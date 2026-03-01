import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base schemas for PatosLab features

export const generateResumeSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  city: z.string().min(1, "City is required"),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  objective: z.string().min(1, "Objective is required"),
  experiences: z.array(
    z.object({
      company: z.string().min(1, "Company is required"),
      position: z.string().min(1, "Position is required"),
      period: z.string().min(1, "Period is required"),
      description: z.string().min(1, "Description is required"),
    })
  ).default([]),
  education: z.array(
    z.object({
      course: z.string().min(1, "Course is required"),
      institution: z.string().min(1, "Institution is required"),
      period: z.string().min(1, "Period is required"),
    })
  ).default([]),
  skills: z.array(z.string()).default([]),
  template: z.enum(["modern", "minimalist", "corporate"]).default("modern"),
});

export const generateApprenticeResumeSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  school: z.string().min(1, "School is required"),
  grade: z.string().min(1, "Grade is required"),
  shift: z.string().min(1, "Shift is required"),
  courses: z.string().default(""),
  projects: z.string().default(""),
  skills: z.array(z.string()).default([]),
  objective: z.string().min(1, "Objective is required"),
  template: z.enum(["modern", "minimalist", "corporate"]).default("modern"),
});

export type GenerateResumeRequest = z.infer<typeof generateResumeSchema>;
export type GenerateApprenticeResumeRequest = z.infer<typeof generateApprenticeResumeSchema>;

export const enhanceTextSchema = z.object({
  text: z.string().min(1),
  context: z.enum(["objective", "experience", "apprentice_objective"]),
});

export type EnhanceTextRequest = z.infer<typeof enhanceTextSchema>;

export type EnhanceTextResponse = {
  enhancedText: string;
};

export const scoreResumeResponseSchema = z.object({
  nota_final: z.number(),
  clareza: z.number(),
  impacto: z.number(),
  organizacao: z.number(),
  linguagem: z.number(),
  competitividade: z.number(),
  pontos_fortes: z.array(z.string()),
  pontos_fracos: z.array(z.string()),
  sugestoes: z.array(z.string()),
});

export type ScoreResumeResponse = z.infer<typeof scoreResumeResponseSchema>;

// Just a dummy table to satisfy any db requirement if needed
export const dummy = pgTable("dummy", {
  id: serial("id").primaryKey(),
});
