import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import BotForm from "@/components/bots/bot-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bot } from "@shared/schema";

export default function Bots() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);

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

  const handleEdit = (bot: Bot) => {
    setEditingBot(bot);
    setShowForm(true);
  };

  const handleDelete = (botId: string) => {
    if (confirm("Tem certeza que deseja deletar este bot?")) {
      deleteBotMutation.mutate(botId);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBot(null);
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
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary-dark"
            >
              <i className="fas fa-plus mr-2"></i>
              Novo Bot
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <BotForm 
                    bot={editingBot}
                    onClose={handleFormClose}
                  />
                </div>
              </div>
            )}

            {botsLoading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                <p className="text-gray-600">Carregando bots...</p>
              </div>
            ) : bots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-robot text-gray-400 text-4xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum bot criado</h3>
                <p className="text-gray-600 mb-6">Crie seu primeiro bot para começar a automatizar o WhatsApp</p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Criar Primeiro Bot
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot: Bot) => (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        {getStatusBadge(bot.status || 'inactive')}
                      </div>
                      <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-clock mr-2 w-4"></i>
                          Criado em {new Date(bot.createdAt!).toLocaleDateString('pt-BR')}
                        </div>
                        
                        {bot.prompt && (
                          <div className="text-sm text-gray-600">
                            <i className="fas fa-comment-dots mr-2 w-4"></i>
                            Prompt personalizado
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 pt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(bot)}
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(bot.id)}
                            disabled={deleteBotMutation.isPending}
                          >
                            <i className="fas fa-trash mr-1"></i>
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
    </div>
  );
}
