import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { EmBreveCard } from "@/components/EmBreveCard";
import { Building2 } from "lucide-react";

export default function CNAEsSegmento() {
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
        <Header title="CNAEs por Segmento" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <EmBreveCard
              icon={Building2}
              title="CNAEs por Segmento"
              description="Sistema de segmentação por Classificação Nacional de Atividades Econômicas em desenvolvimento. Em breve você poderá filtrar leads por setor empresarial."
              features={[
                "2.847 códigos CNAE mapeados",
                "Segmentação por setor econômico",
                "Filtros por porte de empresa",
                "Análise de mercado B2B"
              ]}
            />
          </div>
        </main>
      </div>
    </div>
  );
}