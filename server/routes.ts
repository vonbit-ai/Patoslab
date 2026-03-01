import type { Express } from "express";
  import { createServer, type Server } from "http";
  import { storage } from "./storage";
  import { api } from "@shared/routes";
  import { z } from "zod";
  import OpenAI from "openai";
  import multer from "multer";
  import * as pdfParse from "pdf-parse";
  import PDFDocument from "pdfkit";

  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const upload = multer({ storage: multer.memoryStorage() });

  export async function registerRoutes(
    httpServer: Server,
    app: Express
  ): Promise<Server> {

    app.post(api.ai.enhance.path, async (req, res) => {
      try {
        const input = api.ai.enhance.input.parse(req.body);
        
        let systemPrompt = "Você é um especialista em recrutamento e carreira. ";
        if (input.context === "objective") {
          systemPrompt += "Melhore este objetivo profissional para ser mais impactante, focado em resultados e com linguagem formal, mantendo o sentido original.";
        } else if (input.context === "experience") {
          systemPrompt += "Melhore esta descrição de experiência profissional, destacando conquistas, usando verbos de ação fortes e linguagem corporativa adequada.";
        } else if (input.context === "apprentice_objective") {
          systemPrompt += "Melhore este objetivo de jovem aprendiz. Mantenha uma linguagem leve, com foco em potencial, vontade de aprender e proatividade, sendo adequado para quem está buscando a primeira oportunidade.";
        }

        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.text }
          ]
        });

        const enhancedText = response.choices[0]?.message.content?.trim() || input.text;
        res.status(200).json({ enhancedText, enhanced_text: enhancedText });
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join('.'),
          });
        }
        console.error("Enhance error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post(api.ai.score.path, upload.single("pdf"), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "PDF file is required" });
        }

        const pdfData = await pdfParse(req.file.buffer);
        const text = pdfData.text;

        const response = await openai.chat.completions.create({
          model: "gpt-5.1",
          messages: [
            { 
              role: "system", 
              content: "Você é um recrutador sênior avaliando um currículo. Analise o currículo fornecido e retorne ESTRITAMENTE um objeto JSON válido seguindo a estrutura solicitada, sem markdown ou texto adicional. As chaves devem ser exatas: nota_final (0-100), clareza (0-100), impacto (0-100), organizacao (0-100), linguagem (0-100), competitividade (0-100), pontos_fortes (array de strings), pontos_fracos (array de strings), sugestoes (array de strings)." 
            },
            { role: "user", content: "Aqui está o texto extraído do currículo:\n\n" + text }
          ],
          response_format: { type: "json_object" }
        });

        const jsonResult = JSON.parse(response.choices[0]?.message.content || "{}");
        res.status(200).json(jsonResult);
      } catch (err) {
        console.error("Score error:", err);
        res.status(500).json({ message: "Failed to analyze resume" });
      }
    });

    app.post(api.resume.professional.path, async (req, res) => {
      try {
        const input = api.resume.professional.input.parse(req.body);
        
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${input.fullName.replace(/\s+/g, '_')}_Curriculo.pdf"`);
        
        doc.pipe(res);

        // Generate basic PDF content based on template
        doc.fontSize(24).font('Helvetica-Bold').text(input.fullName, { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`${input.email} | ${input.phone} | ${input.city}`, { align: 'center' });
        if (input.linkedin) doc.text(input.linkedin, { align: 'center' });
        if (input.portfolio) doc.text(input.portfolio, { align: 'center' });
        doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold').text("Objetivo Profissional");
      doc.fontSize(11).font('Helvetica').text(input.objective || "");
      doc.moveDown();

      if (input.experiences && input.experiences.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text("Experiência Profissional");
        input.experiences.forEach(exp => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${exp.position || ""} - ${exp.company || ""}`);
          doc.fontSize(10).font('Helvetica-Oblique').text(exp.period || "");
          doc.fontSize(11).font('Helvetica').text(exp.description || "");
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }

      if (input.education && input.education.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text("Formação Acadêmica");
        input.education.forEach(edu => {
          doc.fontSize(12).font('Helvetica-Bold').text(`${edu.course || ""} - ${edu.institution || ""}`);
          doc.fontSize(10).font('Helvetica-Oblique').text(edu.period || "");
          doc.moveDown(0.5);
        });
        doc.moveDown();
      }

      if (input.skills && input.skills.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text("Habilidades");
        doc.fontSize(11).font('Helvetica').text(input.skills.join(" • "));
      }

        doc.end();

      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join('.'),
          });
        }
        console.error("PDF generation error:", err);
        res.status(500).json({ message: "Failed to generate PDF" });
      }
    });

    app.post(api.resume.apprentice.path, async (req, res) => {
      try {
        const input = api.resume.apprentice.input.parse(req.body);
        
        const doc = new PDFDocument({ margin: 50 });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${input.fullName.replace(/\s+/g, '_')}_Curriculo.pdf"`);
        
        doc.pipe(res);

        doc.fontSize(24).font('Helvetica-Bold').text(input.fullName, { align: 'center' });
        doc.fontSize(10).font('Helvetica').text(`Idade: ${input.age} anos`, { align: 'center' });
        doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold').text("Objetivo");
      doc.fontSize(11).font('Helvetica').text(input.objective || "");
      doc.moveDown();

      doc.fontSize(14).font('Helvetica-Bold').text("Educação");
      doc.fontSize(12).font('Helvetica-Bold').text(input.school || "");
      doc.fontSize(10).font('Helvetica-Oblique').text(`Série: ${input.grade || ""} | Turno: ${input.shift || ""}`);
      doc.moveDown();

      if (input.courses) {
        doc.fontSize(14).font('Helvetica-Bold').text("Cursos Complementares");
        doc.fontSize(11).font('Helvetica').text(input.courses);
        doc.moveDown();
      }

      if (input.projects) {
        doc.fontSize(14).font('Helvetica-Bold').text("Projetos Escolares");
        doc.fontSize(11).font('Helvetica').text(input.projects);
        doc.moveDown();
      }

      if (input.skills && input.skills.length > 0) {
        doc.fontSize(14).font('Helvetica-Bold').text("Habilidades");
        doc.fontSize(11).font('Helvetica').text(input.skills.join(" • "));
      }

        doc.end();

      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join('.'),
          });
        }
        console.error("PDF generation error:", err);
        res.status(500).json({ message: "Failed to generate PDF" });
      }
    });

    return httpServer;
  }
  