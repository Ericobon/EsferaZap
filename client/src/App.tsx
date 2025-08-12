import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import { useState } from "react";
import Landing from "./pages/landing";
import Dashboard from "./pages/dashboard";
import AuthModal from "./components/auth/AuthModal";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { user, userData, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-slate-600">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  const handleShowLogin = () => {
    setAuthModalView("login");
    setShowAuthModal(true);
  };

  const handleShowSignup = () => {
    setAuthModalView("signup");
    setShowAuthModal(true);
  };

  return (
    <>
      <Switch>
        <Route path="/">
          {user && userData ? (
            <Dashboard />
          ) : (
            <Landing onShowLogin={handleShowLogin} onShowSignup={handleShowSignup} />
          )}
        </Route>
        
        <Route path="/dashboard">
          {user && userData ? (
            <Dashboard />
          ) : (
            <Landing onShowLogin={handleShowLogin} onShowSignup={handleShowSignup} />
          )}
        </Route>
        
        <Route component={NotFound} />
      </Switch>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={authModalView}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthenticatedApp />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
