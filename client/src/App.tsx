import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Bots from "@/pages/bots";
import IA from "@/pages/ia";
import UploadDocumentos from "@/pages/upload-documentos";
import CompraLeads from "@/pages/campanhas/compra-leads";
import Geolocalizacao from "@/pages/campanhas/geolocalizacao";
import LeadsGeolocalizacao from "@/pages/campanhas/leads-geolocalizacao";
import CNAEsSegmento from "@/pages/campanhas/cnaes-segmento";
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
          <Route path="/campanhas/geolocalizacao" component={Geolocalizacao} />
          <Route path="/campanhas/leads-geolocalizacao" component={LeadsGeolocalizacao} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
