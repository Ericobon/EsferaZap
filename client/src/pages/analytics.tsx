import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: bots } = useQuery({
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
        <Header title="Analytics" />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Total de Mensagens"
                value={statsData.totalMessages.toString()}
                icon="fas fa-paper-plane"
                iconColor="text-primary"
                iconBg="bg-primary-light"
                trend="+12%"
                trendLabel="vs período anterior"
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Taxa de Resposta"
                value="98.5%"
                icon="fas fa-chart-line"
                iconColor="text-green-600"
                iconBg="bg-green-100"
                trend="+2.1%"
                trendLabel="esta semana"
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Tempo Médio de Resposta"
                value={`${(statsData.averageResponseTime / 1000).toFixed(1)}s`}
                icon="fas fa-clock"
                iconColor="text-blue-600"
                iconBg="bg-blue-100"
                trend="-0.3s"
                trendLabel="melhorou"
                isPositive={true}
                loading={statsLoading}
              />
              
              <StatsCard
                title="Conversas Ativas"
                value={statsData.unreadConversations.toString()}
                icon="fas fa-comments"
                iconColor="text-purple-600"
                iconBg="bg-purple-100"
                trend="+5"
                trendLabel="novas hoje"
                isPositive={true}
                loading={statsLoading}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              
              {/* Messages Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Volume de Mensagens</CardTitle>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Últimos 7 dias</SelectItem>
                        <SelectItem value="30days">Últimos 30 dias</SelectItem>
                        <SelectItem value="90days">Últimos 90 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <i className="fas fa-chart-line text-4xl mb-2"></i>
                      <p>Gráfico de mensagens por dia</p>
                      <p className="text-sm">Em desenvolvimento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Tempo de Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <i className="fas fa-clock text-4xl mb-2"></i>
                      <p>Gráfico de tempo de resposta</p>
                      <p className="text-sm">Em desenvolvimento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bot Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Bots</CardTitle>
              </CardHeader>
              <CardContent>
                {!bots || bots.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-robot text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">Nenhum bot criado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bots.map((bot: any) => (
                      <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${
                            bot.status === 'active' ? 'bg-primary' : 'bg-gray-400'
                          } rounded-lg flex items-center justify-center`}>
                            <i className="fas fa-robot text-white text-sm"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{bot.name}</p>
                            <p className="text-xs text-gray-500">{bot.phoneNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Criado em {new Date(bot.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
