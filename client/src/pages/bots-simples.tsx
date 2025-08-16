import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Bot } from "@shared/schema";
import { Settings, Trash2, Bot as BotIcon, Activity, Plus, MessageSquare, Zap, Globe } from "lucide-react";
import { URLInfo } from "@/components/bots/url-info";
import { SimulatorPanel } from "@/components/bots/simulator-panel";

export default function Bots() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUrlInfo, setShowUrlInfo] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<string | null>(null);
  const [newBot, setNewBot] = useState({
    name: '',
    phoneNumber: '',
    prompt: '',
    whatsappProvider: 'baileys'
  });

  const { data: bots = [], isLoading: botsLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  const createBotMutation = useMutation({
    mutationFn: async (botData: any) => {
      return await apiRequest("POST", "/api/bots", botData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      setShowCreateForm(false);
      setNewBot({ name: '', phoneNumber: '', prompt: '', whatsappProvider: 'meta_business' });
      toast({
        title: "Bot criado com sucesso!",
        description: "Seu chatbot foi configurado e está pronto para uso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar bot",
        description: "Não foi possível criar o bot. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const testBotMutation = useMutation({
    mutationFn: async (botId: string) => {
      return await apiRequest("POST", `/api/bots/${botId}/test`, {
        message: "Olá! Este é um teste do chatbot."
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Teste do Bot",
        description: `Resposta: ${data.response}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar o bot.",
        variant: "destructive",
      });
    },
  });

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

  const handleCreateBot = () => {
    if (!newBot.name || !newBot.phoneNumber) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e número do telefone.",
        variant: "destructive",
      });
      return;
    }

    createBotMutation.mutate({
      name: newBot.name,
      phoneNumber: newBot.phoneNumber,
      prompt: newBot.prompt || "Você é um assistente útil e amigável que responde mensagens do WhatsApp.",
      whatsappProvider: newBot.whatsappProvider,
      status: 'active'
    });
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
          title="Chatbots de IA" 
          action={
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Chatbot
            </Button>
          }
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Formulário de Criação */}
            {showCreateForm && (
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BotIcon className="h-5 w-5 text-blue-600" />
                    Criar Novo Chatbot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Bot</Label>
                      <Input
                        id="name"
                        placeholder="Ex: Atendimento EsferaZap"
                        value={newBot.name}
                        onChange={(e) => setNewBot(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Número WhatsApp</Label>
                      <Input
                        id="phone"
                        placeholder="Ex: +5511999999999"
                        value={newBot.phoneNumber}
                        onChange={(e) => setNewBot(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="provider">Provedor WhatsApp (MVP - Gratuito)</Label>
                    <Select 
                      value={newBot.whatsappProvider} 
                      onValueChange={(value) => setNewBot(prev => ({ ...prev, whatsappProvider: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baileys">Baileys (Gratuito - Recomendado MVP)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Baileys é uma biblioteca gratuita que conecta diretamente ao WhatsApp Web. 
                      Ideal para testes e desenvolvimento.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="prompt">Personalidade do Bot (Prompt)</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Defina como o bot deve se comportar e responder..."
                      value={newBot.prompt}
                      onChange={(e) => setNewBot(prev => ({ ...prev, prompt: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleCreateBot}
                      disabled={createBotMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {createBotMutation.isPending ? "Criando..." : "Criar Chatbot"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Nenhum Chatbot Criado</h2>
                  <p className="text-gray-600 text-center max-w-md mb-6">
                    Crie seu primeiro chatbot com IA para automatizar o atendimento no WhatsApp.
                  </p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Chatbot
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
                          <BotIcon className="h-5 w-5 text-blue-600" />
                          {bot.name}
                        </CardTitle>
                        {getStatusBadge(bot.status || 'inactive')}
                      </div>
                      <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="font-medium">Provedor:</span> {bot.whatsappProvider}
                        </div>
                        
                        {bot.serverUrl && (
                          <div className="text-sm">
                            <span className="font-medium">URL Servidor:</span>
                            <p className="text-gray-600 mt-1 font-mono text-xs break-all">
                              {bot.serverUrl}
                            </p>
                          </div>
                        )}
                        
                        {bot.webhookUrl && (
                          <div className="text-sm">
                            <span className="font-medium">Webhook:</span>
                            <p className="text-gray-600 mt-1 font-mono text-xs break-all">
                              {bot.webhookUrl}
                            </p>
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="font-medium">Prompt:</span>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {bot.prompt || "Prompt padrão"}
                          </p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
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
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Conversas
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
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            Config
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Painel de URLs expandido */}
                    {showUrlInfo === bot.id && (
                      <div className="border-t">
                        <div className="p-4">
                          <URLInfo botId={bot.id} />
                        </div>
                      </div>
                    )}
                    
                    {/* Painel do Simulador expandido */}
                    {showSimulator === bot.id && (
                      <div className="border-t bg-green-50">
                        <div className="p-4">
                          <SimulatorPanel botId={bot.id} botName={bot.name} />
                        </div>
                      </div>
                    )}
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