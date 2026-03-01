import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "./pages/home";
import ProfessionalResume from "./pages/professional";
import ApprenticeResume from "./pages/apprentice";
import PatosScore from "./pages/score";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profissional" component={ProfessionalResume} />
      <Route path="/aprendiz" component={ApprenticeResume} />
      <Route path="/score" component={PatosScore} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
