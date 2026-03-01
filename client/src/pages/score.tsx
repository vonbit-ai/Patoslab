import { useState, useCallback } from "react";
import { Layout } from "@/components/layout";
import { useDropzone } from "react-dropzone";
import { useAIScore, ScoreResponse } from "@/hooks/use-ai";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, Loader2, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui-components";

export default function PatosScore() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  
  const scoreMutation = useAIScore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      const data = await scoreMutation.mutateAsync(file);
      setResult(data);
    } catch (e) {
      // Handled in hook
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const ScoreBar = ({ label, value }: { label: string, value: number }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`h-full ${value >= 80 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
        />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">PatosScore</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra o quão competitivo é o seu currículo. Nossa IA analisa formatação, clareza e impacto em segundos.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="upload"
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-border bg-card/50 hover:border-primary/50 hover:bg-card"}
                `}
              >
                <input {...getInputProps()} />
                
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
                  {file ? <File className="w-10 h-10 text-primary" /> : <UploadCloud className="w-10 h-10 text-muted-foreground" />}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">
                  {file ? file.name : "Arraste seu PDF aqui"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {file ? "Pronto para análise" : "ou clique para selecionar o arquivo (Apenas PDF)"}
                </p>
                
                {file && (
                  <Button 
                    onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                    isLoading={scoreMutation.isPending}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Iniciar Análise com IA
                  </Button>
                )}
              </div>

              {scoreMutation.isPending && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4 relative overflow-hidden">
                     <Loader2 className="w-8 h-8 text-primary animate-spin relative z-10" />
                     {/* Scanning effect line */}
                     <motion.div 
                       animate={{ y: ["-100%", "200%"] }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                       className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_#00F0FF] z-20"
                     />
                  </div>
                  <p className="text-primary font-medium animate-pulse">Lendo entropia de dados e calculando métricas...</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Score Overview */}
              <div className="lg:col-span-1">
                <div className="glass-panel rounded-2xl p-8 text-center h-full flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full" />
                  
                  <h3 className="text-xl font-display font-semibold mb-8 text-muted-foreground">Nota PatosLab</h3>
                  
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className={`text-8xl font-display font-bold mb-4 glow-text ${getScoreColor(result.nota_final)}`}
                  >
                    {result.nota_final}
                  </motion.div>
                  <p className="text-muted-foreground mb-8">de 100 pontos possíveis</p>

                  <Button variant="outline" onClick={() => { setFile(null); setResult(null); }}>
                    Analisar Novo Arquivo
                  </Button>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="lg:col-span-2 glass-panel rounded-2xl p-8">
                <h3 className="text-2xl font-display font-semibold mb-6 border-b border-white/10 pb-4">Análise Detalhada</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                  <ScoreBar label="Clareza" value={result.clareza} />
                  <ScoreBar label="Impacto" value={result.impacto} />
                  <ScoreBar label="Organização" value={result.organizacao} />
                  <ScoreBar label="Linguagem" value={result.linguagem} />
                  <ScoreBar label="Competitividade" value={result.competitividade} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pros */}
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-green-400 font-semibold mb-4">
                      <CheckCircle2 className="w-5 h-5" /> Pontos Fortes
                    </div>
                    <ul className="space-y-2">
                      {result.pontos_fortes.map((p, i) => (
                        <li key={i} className="text-sm text-green-100/80 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-red-400 font-semibold mb-4">
                      <AlertTriangle className="w-5 h-5" /> Pontos a Melhorar
                    </div>
                    <ul className="space-y-2">
                      {result.pontos_fracos.map((p, i) => (
                        <li key={i} className="text-sm text-red-100/80 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="mt-6 bg-primary/10 border border-primary/20 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                    <Lightbulb className="w-5 h-5" /> Sugestões da IA
                  </div>
                  <ul className="space-y-3">
                    {result.sugestoes.map((s, i) => (
                      <li key={i} className="text-sm text-primary-foreground flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                        <span className="text-primary font-bold">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
