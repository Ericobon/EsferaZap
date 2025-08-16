import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { CreateBotWizard } from "@/components/bots/create-bot-wizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bot } from "@shared/schema";
import { Brain, Plus, Settings, Trash2, BotIcon, Activity, QrCode, Sparkles } from "lucide-react";

export default function IA() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showCreateWizard, setShowCreateWizard] = useState(false);

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

  const { data: bots = [], isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  const deleteBotMutation = useMutation({
    mutationFn: async (botId: string) => {
      await apiRequest("DELETE", `/api/bots/${botId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      toast({
        title: "Bot deletado com sucesso!",
        description: "O bot foi removido permanentemente.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Você foi deslogado. Redirecionando...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      
      toast({
        title: "Erro ao deletar bot",
        description: "Não foi possível deletar o bot. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (botId: string) => {
    if (confirm("Tem certeza que deseja deletar este bot? Esta ação não pode ser desfeita.")) {
      deleteBotMutation.mutate(botId);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativo", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inativo", className: "bg-gray-100 text-gray-800" },
      connecting: { label: "Conectando", className: "bg-yellow-100 text-yellow-800" },
      error: { label: "Erro", className: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleWizardComplete = (botId: string) => {
    setShowCreateWizard(false);
    queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
    toast({
      title: "Bot de IA criado!",
      description: "Seu bot está pronto para uso.",
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          title="Bots de IA" 
          action={
            <Button
              onClick={() => setShowCreateWizard(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Bot de IA
            </Button>
          }
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {botsLoading ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Carregando bots de IA...</p>
              </div>
            ) : bots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum bot de IA criado</h3>
                <p className="text-gray-600 mb-6">Crie seu primeiro bot de IA para começar a automatizar conversas no WhatsApp</p>
                <Button
                  onClick={() => setShowCreateWizard(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Criar Primeiro Bot de IA
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot: Bot) => (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-primary" />
                          {bot.name}
                        </CardTitle>
                        {getStatusBadge(bot.status || 'inactive')}
                      </div>
                      <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="h-4 w-4 mr-2" />
                          Criado em {new Date(bot.createdAt!).toLocaleDateString('pt-BR')}
                        </div>
                        
                        {bot.prompt && (
                          <div className="text-sm text-gray-600">
                            <BotIcon className="h-4 w-4 mr-2" />
                            Prompt personalizado
                          </div>
                        )}

                        {/* Bot capabilities */}
                        <div className="flex items-center gap-2 text-xs">
                          {bot.supportsText && (
                            <Badge variant="secondary" className="text-blue-600 bg-blue-50">
                              Texto
                            </Badge>
                          )}
                          {bot.supportsAudio && (
                            <Badge variant="secondary" className="text-green-600 bg-green-50">
                              Áudio
                            </Badge>
                          )}
                          {bot.supportsImages && (
                            <Badge variant="secondary" className="text-purple-600 bg-purple-50">
                              Imagens
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-gray-600 bg-gray-50">
                            {bot.botType === 'business' ? 'Business' : 'Pessoal'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({
                                title: "Em breve",
                                description: "Funcionalidade de edição será adicionada",
                              })}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() => {
                                toast({
                                  title: "QR Code",
                                  description: "QR Code para conectar WhatsApp será exibido aqui.",
                                });
                              }}
                            >
                              <QrCode className="h-3 w-3 mr-1" />
                              QR Code
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(bot.id)}
                            disabled={deleteBotMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Deletar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Bot Wizard */}
      {showCreateWizard && (
        <CreateBotWizard
          onClose={() => setShowCreateWizard(false)}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
}