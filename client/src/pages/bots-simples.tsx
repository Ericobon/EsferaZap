import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bot } from "@shared/schema";
import { Settings, Trash2, Bot as BotIcon, Activity, Plus, MessageSquare, Zap, Globe } from "lucide-react";
import { URLInfo } from "@/components/bots/url-info";
import { SimulatorPanel } from "@/components/bots/simulator-panel";
import { CreateBotWizard } from "@/components/bots/create-bot-wizard";

export default function Bots() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showUrlInfo, setShowUrlInfo] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<string | null>(null);

  const { data: bots = [], isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  const deleteBotMutation = useMutation({
    mutationFn: async (botId: string) => {
      return await apiRequest("DELETE", `/api/bots/${botId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bots'] });
      toast({
        title: "Bot excluído",
        description: "Bot removido com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o bot",
        variant: "destructive",
      });
    },
  });

  const handleWizardComplete = (botId: string) => {
    setShowCreateWizard(false);
    setShowSimulator(botId); // Abrir simulador automaticamente
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <BotIcon className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="text-xl font-semibold text-gray-900">Carregando...</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
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
          title="Chatbots de IA" 
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
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">

            {/* Lista de Bots */}
            {botsLoading ? (
              <div className="text-center py-12">
                <BotIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600">Carregando chatbots...</p>
              </div>
            ) : bots.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
                    <BotIcon className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Crie seu Primeiro Chatbot</h2>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Configure um chatbot com IA em poucos passos e conecte ao WhatsApp usando Baileys.
                  </p>
                  <Button 
                    onClick={() => setShowCreateWizard(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <BotIcon className="h-5 w-5 text-green-600" />
                          {bot.name}
                        </CardTitle>
                        {getStatusBadge(bot.status || 'inactive')}
                      </div>
                      <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Baileys
                          </Badge>
                          <span className="text-xs text-gray-500">Gratuito</span>
                        </div>
                        
                        {bot.prompt && (
                          <div className="text-sm">
                            <span className="font-medium">Personalidade:</span>
                            <p className="text-gray-600 mt-1 line-clamp-2">
                              {bot.prompt}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowSimulator(showSimulator === bot.id ? null : bot.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            {showSimulator === bot.id ? "Fechar" : "Testar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowUrlInfo(showUrlInfo === bot.id ? null : bot.id)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            URLs
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteBotMutation.mutate(bot.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>

                        {/* URL Info Panel */}
                        {showUrlInfo === bot.id && (
                          <URLInfo bot={bot} />
                        )}

                        {/* Simulator Panel */}
                        {showSimulator === bot.id && (
                          <div className="mt-4">
                            <SimulatorPanel botId={bot.id} />
                          </div>
                        )}
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