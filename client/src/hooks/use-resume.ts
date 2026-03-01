import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface ProfessionalResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    linkedin: string;
    portfolio?: string;
  };
  objective: string;
  experience: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    course: string;
    institution: string;
    period: string;
  }>;
  skills: string[];
  template: "moderno" | "minimalista" | "corporativo";
}

export interface ApprenticeResumeData {
  personal: {
    fullName: string;
    age: string;
    school: string;
    grade: string;
    shift: string;
  };
  courses: string;
  projects: string;
  skills: string[];
  objective: string;
  template: "moderno" | "minimalista" | "corporativo";
}

// Utility to handle file download from Blob
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export function useGenerateProfessionalResume() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ProfessionalResumeData) => {
      const res = await fetch("/api/resume/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Falha ao gerar currículo profissional");
      
      const blob = await res.blob();
      const filename = `${data.personal.fullName.replace(/\s+/g, "_")}_Curriculo.pdf`;
      return { blob, filename };
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename);
      toast({
        title: "Sucesso!",
        description: "Seu currículo foi gerado e o download iniciado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useGenerateApprenticeResume() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ApprenticeResumeData) => {
      const res = await fetch("/api/resume/apprentice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Falha ao gerar currículo Jovem Aprendiz");
      
      const blob = await res.blob();
      const filename = `${data.personal.fullName.replace(/\s+/g, "_")}_Aprendiz.pdf`;
      return { blob, filename };
    },
    onSuccess: ({ blob, filename }) => {
      downloadBlob(blob, filename);
      toast({
        title: "Sucesso!",
        description: "Seu currículo foi gerado e o download iniciado.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
