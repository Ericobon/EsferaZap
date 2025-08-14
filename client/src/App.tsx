import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Bots from "@/pages/bots";
import IA from "@/pages/ia";
import Ferramentas from "@/pages/ferramentas";
import Conversations from "@/pages/conversations";
import Analytics from "@/pages/analytics";
import Contacts from "@/pages/contacts";
import RegisterPage from "@/pages/register";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/register" component={RegisterPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/bots" component={Bots} />
          <Route path="/ia" component={IA} />
          <Route path="/ferramentas" component={Ferramentas} />
          <Route path="/conversations" component={Conversations} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/analytics" component={Analytics} />
        </>
      )}
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
