import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { EmBreveCard } from "@/components/EmBreveCard";
import { Target } from "lucide-react";

export default function CompraLeads() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-bolt text-white text-2xl animate-pulse"></i>
          </div>
          <div className="text-xl font-semibold text-gray-900">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Compra de Leads" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmBreveCard
              icon={Target}
              title="Compra de Leads"
              description="Funcionalidade de marketplace de leads em desenvolvimento. Em breve você poderá comprar leads qualificados por categoria e região."
              features={[
                "Marketplace de leads qualificados",
                "Filtros por categoria e região",
                "Sistema de compra integrado",
                "Analytics de performance"
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}