import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Bots from "@/pages/bots";
import IA from "@/pages/ia";
import UploadDocumentos from "@/pages/upload-documentos";
import CompraLeads from "@/pages/campanhas/compra-leads";
import LeadsOrganicos from "@/pages/campanhas/leads-organicos";
import Geolocalizacao from "@/pages/campanhas/geolocalizacao-simples";
import CNAEsSegmento from "@/pages/campanhas/cnaes-segmento-simples";
import Conversations from "@/pages/conversations";
import Analytics from "@/pages/analytics";
import Contacts from "@/pages/contacts";
import Register from "@/pages/register";
import CalendarIntegration from "@/pages/calendar-integration";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Home} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/bots" component={Bots} />
          <Route path="/ia" component={IA} />
          <Route path="/upload-documentos" component={UploadDocumentos} />
          <Route path="/campanhas/compra-leads" component={CompraLeads} />
          <Route path="/campanhas/leads-organicos" component={LeadsOrganicos} />
          <Route path="/campanhas/geolocalizacao" component={Geolocalizacao} />
          <Route path="/campanhas/cnaes-segmento" component={CNAEsSegmento} />
          <Route path="/conversations" component={Conversations} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/calendar-integration" component={CalendarIntegration} />
          <Route path="/settings" component={Settings} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
