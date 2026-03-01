// A set of highly polished base components to avoid massive files and reuse styles
import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full px-4 py-3 rounded-xl bg-background/50 border border-border
        text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
        transition-all duration-200 ${className || ""}
      `}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        w-full px-4 py-3 rounded-xl bg-background/50 border border-border
        text-foreground placeholder:text-muted-foreground
        focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
        transition-all duration-200 resize-y min-h-[120px] ${className || ""}
      `}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <label className={`block text-sm font-medium text-muted-foreground mb-1.5 ${className}`}>
    {children}
  </label>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = "primary", 
  size = "md", 
  isLoading, 
  className = "", 
  disabled,
  ...props 
}, ref) => {
  const baseStyle = "inline-flex justify-center items-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:-translate-y-0.5 border border-primary/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "bg-transparent border-2 border-border text-foreground hover:border-primary/50 hover:text-primary",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";
