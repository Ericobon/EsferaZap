import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ChatViewer from "@/components/conversations/chat-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Bot, Conversation } from "@shared/schema";

export default function Conversations() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

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

  const { data: bots = [] } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: isAuthenticated,
  });

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations", selectedBotId],
    enabled: isAuthenticated && !!selectedBotId,
  });

  useEffect(() => {
    if (bots && bots.length > 0 && !selectedBotId) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Conversas" />
        
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <Select value={selectedBotId} onValueChange={setSelectedBotId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um bot" />
                  </SelectTrigger>
                  <SelectContent>
                    {bots?.map((bot: Bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="p-4 text-center">
                    <i className="fas fa-spinner fa-spin text-primary"></i>
                    <p className="text-sm text-gray-600 mt-2">Carregando conversas...</p>
                  </div>
                ) : !conversations || conversations.length === 0 ? (
                  <div className="p-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-comments text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-600">Nenhuma conversa encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {conversations.map((conversation: Conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-primary-light'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {getInitials(conversation.customerName || 'Unknown')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.customerName || conversation.customerPhone}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessageAt!)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.customerPhone}
                          </p>
                          <div className="flex items-center mt-1">
                            {conversation.assignedToAgent ? (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                Com agente
                              </Badge>
                            ) : (
                              <Badge className="bg-primary-light text-primary-dark text-xs">
                                Bot ativo
                              </Badge>
                            )}
                            {conversation.isActive && (
                              <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Viewer */}
            <div className="flex-1 bg-gray-50">
              {selectedConversation ? (
                <ChatViewer conversation={selectedConversation} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-comment-dots text-gray-400 text-4xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Selecione uma conversa
                    </h3>
                    <p className="text-gray-600">
                      Escolha uma conversa na lista para visualizar as mensagens
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
