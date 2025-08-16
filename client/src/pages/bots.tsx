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
import { Settings, Trash2, Bot as BotIcon, Activity, QrCode, Wifi, Plus } from "lucide-react";
import { QRCodeDialog } from "@/components/bots/qr-code-dialog";
import { QRDemo } from "@/components/bots/qr-demo";
import { ProviderCategoriesInfo } from "@/components/bots/provider-categories-info";

export default function Bots() {
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
        title: "Bot deletado",
        description: "O bot foi removido com sucesso.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Erro",
        description: "Falha ao deletar o bot.",
        variant: "destructive",
      });
    },
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

  const handleDelete = (botId: string) => {
    if (confirm("Tem certeza que deseja deletar este bot?")) {
      deleteBotMutation.mutate(botId);
    }
  };

  const handleWizardComplete = (botId: string) => {
    setShowCreateWizard(false);
    // Aqui pode abrir o simulador se necessário
  };

  const checkConnectionStatus = async (botId: string) => {
    try {
      const response = await apiRequest("GET", `/api/bots/${botId}/connection-status`);
      const data = await response.json();
      toast({
        title: "Status da Conexão",
        description: data.connected ? 
          `Conectado via ${data.provider}` : 
          `Desconectado: ${data.status}`,
        variant: data.connected ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao verificar status de conexão",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'configuring':
        return <Badge className="bg-yellow-100 text-yellow-800">Configurando</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Meus Bots" 
          action={
            <Button
              onClick={() => setShowCreateWizard(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Chatbot
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
{/* Wizard será renderizado no final do componente */}

            {botsLoading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                <p className="text-gray-600">Carregando bots...</p>
              </div>
            ) : bots.length === 0 ? (
              <div className="space-y-8">
                {/* QR Demo quando não há bots */}
                <Card className="border-dashed border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="text-center text-blue-700 flex items-center justify-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Demo: Provedores WhatsApp - Gratuitos vs Pagos
                    </CardTitle>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Teste a integração com diferentes tipos de provedores
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <ProviderCategoriesInfo />
                      <QRDemo />
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-robot text-gray-400 text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum bot criado</h3>
                  <p className="text-gray-600 mb-6">Crie seu primeiro bot para começar a automatizar o WhatsApp</p>
                  <Button
                    onClick={() => setShowCreateWizard(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Bot
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {bots.map((bot) => (
                  <Card key={bot.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <BotIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                              <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(bot.status)}
                            <Badge variant="outline" className="text-xs">
                              {bot.whatsappProvider}
                            </Badge>
                          </div>
                          {bot.prompt && (
                            <p className="text-sm text-gray-600 max-w-md line-clamp-2">
                              {bot.prompt.substring(0, 100)}...
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => alert('Funcionalidade de edição será adicionada em breve')}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configurar
                            </Button>
                            <QRCodeDialog bot={bot} />
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => checkConnectionStatus(bot.id)}
                            >
                              <Wifi className="h-3 w-3 mr-1" />
                              Status
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