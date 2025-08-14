import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import BotList from "@/components/dashboard/bot-list";
import ConversationList from "@/components/dashboard/conversation-list";
import type { Bot } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats = {}, isLoading: statsLoading } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: bots = [], isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

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

  const statsData = stats || {
    totalMessages: 0,
    activeBots: 0,
    averageResponseTime: 0,
    unreadConversations: 0,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Mensagens Hoje"
                value={statsData.totalMessages.toString()}
                icon="fas fa-paper-plane"
                iconColor="text-primary"
                iconBg="bg-primary-light"
                trend="+12%"
                trendLabel="vs ontem"
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Bots Ativos"
                value={statsData.activeBots.toString()}
                icon="fas fa-robot"
                iconColor="text-green-600"
                iconBg="bg-green-100"
                trend="Todos online"
                trendLabel=""
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Taxa de Resposta"
                value="98.5%"
                icon="fas fa-chart-line"
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
                trend="+2.1%"
                trendLabel="esta semana"
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Tempo Médio"
                value={`${(statsData.averageResponseTime / 1000).toFixed(1)}s`}
                icon="fas fa-clock"
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
                trend="-0.3s"
                trendLabel="mais rápido"
                isPositive={true}
                loading={statsLoading}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Bot Management Panel */}
              <div className="lg:col-span-2">
                <BotList bots={bots} loading={botsLoading} />
              </div>

              {/* Recent Conversations */}
              <div className="lg:col-span-1">
                <ConversationList />
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light/20 transition-colors">
                    <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-2">
                      <i className="fas fa-plus text-primary text-xl"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Criar Bot</span>
                  </button>

                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light/20 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <i className="fas fa-chart-bar text-blue-600 text-xl"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Analytics</span>
                  </button>

                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light/20 transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <i className="fas fa-key text-purple-600 text-xl"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-900">API Keys</span>
                  </button>

                  <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-light/20 transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                      <i className="fas fa-book text-green-600 text-xl"></i>
                    </div>
                    <span className="text-sm font-medium text-gray-900">Documentação</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
