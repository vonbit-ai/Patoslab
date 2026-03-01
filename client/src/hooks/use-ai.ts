import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Types based on requirements
export interface EnhanceRequest {
  text: string;
  context?: string;
}

export interface EnhanceResponse {
  enhancedText: string;
  enhanced_text: string;
}

export interface ScoreResponse {
  nota_final: number;
  clareza: number;
  impacto: number;
  organizacao: number;
  linguagem: number;
  competitividade: number;
  pontos_fortes: string[];
  pontos_fracos: string[];
  sugestoes: string[];
}

export function useAIEnhance() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: EnhanceRequest): Promise<EnhanceResponse> => {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Falha ao melhorar texto com IA");
      }

      return res.json();
    },
    onError: (error) => {
      toast({
        title: "Erro na IA",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAIScore() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File): Promise<ScoreResponse> => {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/ai/score", {
        method: "POST",
        body: formData, // FormData doesn't need Content-Type header, browser sets it with boundary
      });

      if (!res.ok) {
        throw new Error("Falha ao analisar o currículo");
      }

      return res.json();
    },
    onError: (error) => {
      toast({
        title: "Erro na Análise",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
