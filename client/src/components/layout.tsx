import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { FlaskConical, FileText, GraduationCap, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/profissional", label: "Profissional", icon: FileText },
    { href: "/aprendiz", label: "Jovem Aprendiz", icon: GraduationCap },
    { href: "/score", label: "PatosScore", icon: BarChart },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FlaskConical className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">PatosLab</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">O laboratório da sua carreira</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-primary/10 text-primary shadow-[inset_0_-2px_0_rgba(0,240,255,0.5)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"}
                  `}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile menu could go here, omitting for brevity to focus on core features */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PatosLab. Preparando o futuro do mercado de trabalho.</p>
        </div>
      </footer>
    </div>
  );
}
