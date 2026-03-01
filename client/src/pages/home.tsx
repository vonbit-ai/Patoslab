import { Link } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { FileText, GraduationCap, BarChart, ChevronRight, Sparkles } from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-20 relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Potencializado por IA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight text-gradient">
            O laboratório da sua <span className="text-gradient-neon glow-text block mt-2">carreira</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Crie currículos impossíveis de serem ignorados ou descubra a nota do seu currículo atual com nossa inteligência artificial especializada em recrutamento.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10 px-4"
        >
          {/* Card 1 */}
          <motion.div variants={item}>
            <Link href="/profissional">
              <div className="group h-full glass-panel glow-border rounded-2xl p-8 cursor-pointer flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
                  <FileText className="w-48 h-48" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Currículo Profissional</h3>
                <p className="text-muted-foreground flex-1 mb-8">
                  Para profissionais que buscam reposicionamento ou novas oportunidades. Textos aprimorados por IA.
                </p>
                <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Criar agora <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={item}>
            <Link href="/aprendiz">
              <div className="group h-full glass-panel glow-border rounded-2xl p-8 cursor-pointer flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
                  <GraduationCap className="w-48 h-48" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Jovem Aprendiz</h3>
                <p className="text-muted-foreground flex-1 mb-8">
                  Sua primeira oportunidade. Foco em habilidades, projetos escolares e potencial de aprendizado.
                </p>
                <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                  Criar agora <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={item}>
            <Link href="/score">
              <div className="group h-full glass-panel glow-border rounded-2xl p-8 cursor-pointer flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110">
                  <BarChart className="w-48 h-48" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-6">
                  <BarChart className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">PatosScore</h3>
                <p className="text-muted-foreground flex-1 mb-8">
                  Já tem um currículo? Envie o PDF e deixe nossa IA analisá-lo com notas, pontos fortes e melhorias.
                </p>
                <div className="flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Analisar CV <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </Layout>
  );
}
