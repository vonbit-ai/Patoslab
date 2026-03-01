import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Textarea, Label, Button } from "@/components/ui-components";
import { AIEnhanceButton } from "@/components/ai-button";
import { useGenerateApprenticeResume, ApprenticeResumeData } from "@/hooks/use-resume";
import { Trash2, GraduationCap, LayoutTemplate } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ApprenticeResume() {
  const [step, setStep] = useState(0);
  const generateMutation = useGenerateApprenticeResume();

  const { register, handleSubmit, watch, setValue, getValues } = useForm<ApprenticeResumeData>({
    defaultValues: {
      personal: { fullName: "", age: "", school: "", grade: "", shift: "" },
      courses: "",
      projects: "",
      skills: [],
      objective: "",
      template: "moderno"
    }
  });

  const [skillInput, setSkillInput] = useState("");

  const onSubmit = (data: ApprenticeResumeData) => {
    generateMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Jovem Aprendiz</h1>
            <p className="text-muted-foreground">Formulário simplificado focado no seu potencial.</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="space-y-8">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4 text-primary">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><Label>Nome Completo</Label><Input {...register("personal.fullName")} /></div>
                      <div><Label>Idade</Label><Input {...register("personal.age")} /></div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4 text-primary">Escolaridade</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1"><Label>Escola</Label><Input {...register("personal.school")} /></div>
                      <div><Label>Série/Ano</Label><Input {...register("personal.grade")} placeholder="Ex: 3º Ano Médio" /></div>
                      <div><Label>Turno</Label><Input {...register("personal.shift")} placeholder="Ex: Manhã" /></div>
                    </div>
                  </div>

                  {/* Extras */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4 text-primary">Formação Extra</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Cursos Complementares</Label>
                        <Textarea {...register("courses")} placeholder="Informática, Inglês básico..." className="min-h-[80px]"/>
                      </div>
                      <div>
                        <Label>Projetos Escolares / Voluntariado</Label>
                        <Textarea {...register("projects")} placeholder="Participei da feira de ciências..." className="min-h-[80px]"/>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4 text-primary">Habilidades Pessoais</h3>
                    <div className="flex gap-2 mb-4">
                      <Input 
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Ex: Comunicação, Trabalho em equipe..." 
                      />
                      <Button 
                        type="button"
                        onClick={() => {
                          if (skillInput.trim()) {
                            setValue("skills", [...getValues("skills"), skillInput.trim()]);
                            setSkillInput("");
                          }
                        }}
                      >Adicionar</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watch("skills").map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary-foreground text-sm font-medium">
                          {skill}
                          <button onClick={() => {
                            const newSkills = [...getValues("skills")];
                            newSkills.splice(idx, 1);
                            setValue("skills", newSkills);
                          }} className="text-primary hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Objective */}
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                      <h3 className="text-lg font-semibold text-primary">Objetivo</h3>
                      <AIEnhanceButton 
                        currentText={watch("objective")} 
                        context="apprentice_objective"
                        onEnhance={(text) => setValue("objective", text)} 
                        className="scale-90 origin-right"
                      />
                    </div>
                    <Textarea {...register("objective")} placeholder="Busco minha primeira oportunidade para aprender e contribuir..." className="min-h-[100px]"/>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={() => setStep(1)} size="lg">Avançar para Template</Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="text-center py-4">
                  <LayoutTemplate className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                  <h3 className="text-2xl font-display font-bold mb-8">Escolha o visual do seu currículo</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
                    {["moderno", "minimalista"].map((tpl) => (
                      <div 
                        key={tpl}
                        onClick={() => setValue("template", tpl as any)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                          ${watch("template") === tpl ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(0,240,255,0.2)]" : "border-border bg-card hover:border-primary/50"}
                        `}
                      >
                        <div className="aspect-[1/1.4] bg-secondary rounded-md mb-4 flex items-center justify-center text-muted-foreground/30 font-bold text-2xl uppercase">
                          {tpl}
                        </div>
                        <span className="capitalize font-semibold text-lg">{tpl}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center max-w-2xl mx-auto">
                    <Button variant="ghost" onClick={() => setStep(0)}>Voltar ao Formulário</Button>
                    <Button 
                      size="lg" 
                      onClick={handleSubmit(onSubmit)}
                      isLoading={generateMutation.isPending}
                      className="px-10"
                    >
                      Gerar PDF
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
