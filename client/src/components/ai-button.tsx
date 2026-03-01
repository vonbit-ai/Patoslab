import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAIEnhance } from "@/hooks/use-ai";

interface AIEnhanceButtonProps {
  currentText: string;
  context?: string;
  onEnhance: (enhancedText: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function AIEnhanceButton({ currentText, context, onEnhance, className = "", size = "md" }: AIEnhanceButtonProps) {
  const enhanceMutation = useAIEnhance();

  const handleEnhance = async () => {
    if (!currentText.trim()) return;
    
    try {
      const res = await enhanceMutation.mutateAsync({ text: currentText, context: context as any });
      const enhancedText = res.enhancedText || res.enhanced_text;
      if (enhancedText) {
        onEnhance(enhancedText);
      }
    } catch (e) {
      // Error handled by hook
    }
  };

  return (
    <button
      type="button"
      onClick={handleEnhance}
      disabled={enhanceMutation.isPending || !currentText.trim()}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
        bg-primary/10 text-primary border border-primary/20
        hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        transition-all duration-300 ${className}
      `}
    >
      {enhanceMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      Melhorar com IA
    </button>
  );
}
