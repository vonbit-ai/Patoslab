import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Textarea, Label, Button } from "@/components/ui-components";
import { AIEnhanceButton } from "@/components/ai-button";
import { useGenerateProfessionalResume, ProfessionalResumeData } from "@/hooks/use-resume";
import { Plus, Trash2, CheckCircle2, User, Target, Briefcase, GraduationCap, Code, LayoutTemplate } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

const STEPS = [
  { id: "personal", title: "Dados", icon: User },
  { id: "objective", title: "Objetivo", icon: Target },
  { id: "experience", title: "Experiência", icon: Briefcase },
  { id: "education", title: "Formação", icon: GraduationCap },
  { id: "skills", title: "Habilidades", icon: Code },
  { id: "template", title: "Finalizar", icon: LayoutTemplate },
];

export default function ProfessionalResume() {
  const [currentStep, setCurrentStep] = useState(0);
  const generateMutation = useGenerateProfessionalResume();

  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<ProfessionalResumeData>({
    defaultValues: {
      personal: { fullName: "", email: "", phone: "", city: "", linkedin: "", portfolio: "" },
      objective: "",
      experience: [],
      education: [],
      skills: [],
      template: "moderno"
    }
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });

  const [skillInput, setSkillInput] = useState("");

  const onSubmit = (data: ProfessionalResumeData) => {
    generateMutation.mutate(data);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Currículo Profissional</h1>
          <p className="text-muted-foreground">Preencha as informações para gerar um currículo de alto impacto.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 hide-scrollbar">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center min-w-[80px] relative">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 z-10 relative
                  ${isActive ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.4)]" 
                    : isCompleted ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-secondary text-muted-foreground border border-border"}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-primary glow-text" : "text-muted-foreground"}`}>
                  {step.title}
                </span>
                
                {/* Connecting Line */}
                {idx < STEPS.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0
                    ${isCompleted ? "bg-primary/50" : "bg-border"}
                  `} style={{ width: 'calc(100% + 40px)' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Nome Completo</Label>
                    <Input {...register("personal.fullName")} placeholder="João Silva" />
                  </div>
                  <div>
                    <Label>E-mail</Label>
                    <Input {...register("personal.email")} type="email" placeholder="joao@email.com" />
                  </div>
                  <div>
                    <Label>Telefone</Label>
                    <Input {...register("personal.phone")} placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label>Cidade/Estado</Label>
                    <Input {...register("personal.city")} placeholder="São Paulo, SP" />
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input {...register("personal.linkedin")} placeholder="linkedin.com/in/joaosilva" />
                  </div>
                  <div>
                    <Label>Portfólio (Opcional)</Label>
                    <Input {...register("personal.portfolio")} placeholder="github.com/joaosilva" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <div className="flex items-end justify-between mb-4">
                    <Label className="mb-0">Objetivo Profissional / Resumo</Label>
                    <AIEnhanceButton 
                      currentText={watch("objective")} 
                      context="objective"
                      onEnhance={(text) => setValue("objective", text)} 
                    />
                  </div>
                  <Textarea 
                    {...register("objective")} 
                    placeholder="Descreva seu momento profissional, objetivos e principais realizações..."
                    className="min-h-[200px]"
                  />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  {expFields.map((field, index) => (
                    <div key={field.id} className="p-5 rounded-xl border border-white/5 bg-black/20 relative group">
                      <button 
                        onClick={() => removeExp(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Empresa</Label>
                          <Input {...register(`experience.${index}.company`)} />
                        </div>
                        <div>
                          <Label>Cargo</Label>
                          <Input {...register(`experience.${index}.position`)} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Período</Label>
                          <Input {...register(`experience.${index}.period`)} placeholder="Ex: Jan 2020 - Atual" />
                        </div>
                      </div>
                      <div className="flex items-end justify-between mb-2">
                        <Label className="mb-0">Descrição das Atividades</Label>
                        <AIEnhanceButton 
                          currentText={watch(`experience.${index}.description`)} 
                          context="experience"
                          onEnhance={(text) => setValue(`experience.${index}.description`, text)} 
                          size="sm"
                        />
                      </div>
                      <Textarea {...register(`experience.${index}.description`)} placeholder="Fui responsável por..." />
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => appendExp({ company: "", position: "", period: "", description: "" })}
                    className="w-full border-dashed border-muted-foreground/50 text-muted-foreground hover:text-primary hover:border-primary/50"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Adicionar Experiência
                  </Button>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {eduFields.map((field, index) => (
                    <div key={field.id} className="p-5 rounded-xl border border-white/5 bg-black/20 relative group flex flex-col md:flex-row gap-4">
                       <button 
                        onClick={() => removeEdu(index)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100 z-10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <Label>Curso / Formação</Label>
                        <Input {...register(`education.${index}.course`)} placeholder="Análise de Sistemas" />
                      </div>
                      <div className="flex-1">
                        <Label>Instituição</Label>
                        <Input {...register(`education.${index}.institution`)} placeholder="Universidade XYZ" />
                      </div>
                      <div className="flex-1">
                        <Label>Período</Label>
                        <Input {...register(`education.${index}.period`)} placeholder="2018 - 2022" />
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => appendEdu({ course: "", institution: "", period: "" })}
                    className="w-full border-dashed border-muted-foreground/50 text-muted-foreground hover:text-primary hover:border-primary/50"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Adicionar Formação
                  </Button>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <Label>Adicionar Habilidade</Label>
                  <div className="flex gap-2 mb-6">
                    <Input 
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (skillInput.trim()) {
                            setValue("skills", [...getValues("skills"), skillInput.trim()]);
                            setSkillInput("");
                          }
                        }
                      }}
                      placeholder="Ex: React, Liderança, Pacote Office..." 
                    />
                    <Button 
                      type="button"
                      onClick={() => {
                        if (skillInput.trim()) {
                          setValue("skills", [...getValues("skills"), skillInput.trim()]);
                          setSkillInput("");
                        }
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {watch("skills").map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary-foreground font-medium">
                        {skill}
                        <button 
                          onClick={() => {
                            const newSkills = [...getValues("skills")];
                            newSkills.splice(idx, 1);
                            setValue("skills", newSkills);
                          }}
                          className="text-primary hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {watch("skills").length === 0 && (
                      <p className="text-muted-foreground text-sm italic">Nenhuma habilidade adicionada ainda.</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="text-center py-8">
                  <h3 className="text-2xl font-display font-bold mb-6">Escolha o Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {["moderno", "minimalista", "corporativo"].map((tpl) => (
                      <div 
                        key={tpl}
                        onClick={() => setValue("template", tpl as any)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                          ${watch("template") === tpl ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,240,255,0.2)]" : "border-border bg-card hover:border-primary/50"}
                        `}
                      >
                        <div className="aspect-[1/1.4] bg-secondary rounded-md mb-4 overflow-hidden relative">
                           {/* Simplified preview representation */}
                           <div className="absolute inset-4 border border-white/10 rounded flex flex-col p-2 gap-2">
                              <div className={`h-4 w-2/3 rounded ${tpl === 'moderno' ? 'bg-primary/50' : 'bg-white/20'}`} />
                              <div className="h-2 w-full bg-white/10 rounded" />
                              <div className="h-2 w-4/5 bg-white/10 rounded" />
                              <div className="mt-4 h-3 w-1/3 bg-white/20 rounded" />
                              <div className="h-12 w-full bg-white/5 rounded" />
                           </div>
                        </div>
                        <span className="capitalize font-semibold text-lg">{tpl}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto min-w-[250px]"
                    onClick={handleSubmit(onSubmit)}
                    isLoading={generateMutation.isPending}
                  >
                    Gerar PDF Profissional
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            Voltar
          </Button>
          {currentStep < STEPS.length - 1 && (
            <Button onClick={nextStep}>
              Próximo
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
