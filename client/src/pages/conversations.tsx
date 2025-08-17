import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Mail, 
  Clock, 
  User,
  MessageCircle,
  CheckCheck,
  Check,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Filter,
  SortDesc
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation, Message } from "@shared/schema";

export default function Conversations() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar conversas do usuário
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations'],
    enabled: !!user,
  });

  // Buscar mensagens da conversa selecionada
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', selectedConversation?.id, 'messages'],
    enabled: !!selectedConversation,
  });

  // Enviar mensagem
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      return apiRequest('/api/messages', 'POST', {
        conversationId: data.conversationId,
        content: data.content,
        type: 'text',
        direction: 'outbound',
        status: 'sent'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/conversations', selectedConversation?.id, 'messages']
      });
      setNewMessage("");
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      conversationId: selectedConversation.id,
      content: newMessage.trim(),
    });
  };

  const formatTime = (date: Date | string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return messageDate.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredConversations = conversations.filter((conv: any) =>
    conv.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Lista de Conversas */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header da Lista */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Conversas</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SortDesc className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma conversa encontrada</p>
                  <p className="text-sm mt-1">As conversas aparecerão aqui quando chegarem mensagens</p>
                </div>
              ) : (
                filteredConversations.map((conversation: any) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border border-blue-200 shadow-sm' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                        <AvatarImage src={conversation.contactAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                          {conversation.customerName?.charAt(0) || conversation.customerPhone?.slice(-2) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.customerName || conversation.customerPhone || 'Contato Anônimo'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageAt || conversation.updatedAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage || 'Nova conversa iniciada'}
                          </p>
                          {conversation.isActive && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0">
                                Ativo
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Área Principal do Chat */}
        <div className="flex-1 flex flex-col bg-gray-25">
          {selectedConversation ? (
            <>
              {/* Header do Chat */}
              <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                      <AvatarImage src={selectedConversation.contactAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                        {selectedConversation.customerName?.charAt(0) || selectedConversation.customerPhone?.slice(-2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900 text-lg">
                        {selectedConversation.customerName || selectedConversation.customerPhone || 'Contato Anônimo'}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Online agora • {selectedConversation.customerPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea className="flex-1 p-6 bg-gray-50">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma mensagem ainda</h3>
                      <p className="text-sm">Inicie uma conversa enviando uma mensagem abaixo</p>
                    </div>
                  ) : (
                    messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          message.direction === 'outbound'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                        }`}>
                          <p className="break-words leading-relaxed">{message.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-2 ${
                            message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">
                              {formatTime(message.timestamp || message.createdAt)}
                            </span>
                            {message.direction === 'outbound' && getStatusIcon(message.status)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Input de Mensagem */}
              <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="pr-12 py-3 text-base border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Estado Vazio */
            <div className="flex-1 flex items-center justify-center bg-gray-25">
              <div className="text-center max-w-md">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  Escolha uma conversa da lista à esquerda para começar a responder suas mensagens.
                  As conversas serão criadas automaticamente quando seus clientes enviarem mensagens.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Painel de Detalhes do Contato */}
        {selectedConversation && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Detalhes do Contato</h3>
            </div>

            {/* Informações do Contato */}
            <div className="p-6 space-y-6">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-gray-100">
                  <AvatarImage src={selectedConversation.contactAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-medium">
                    {selectedConversation.customerName?.charAt(0) || selectedConversation.customerPhone?.slice(-2) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {selectedConversation.customerName || 'Nome não informado'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">Cliente WhatsApp</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Telefone</p>
                    <p className="text-sm text-gray-900 font-mono">
                      {selectedConversation.customerPhone || 'Não informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-sm text-gray-600">
                      Não informado
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Última atividade</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(selectedConversation.lastMessageAt || selectedConversation.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h5 className="font-medium text-gray-900 mb-3">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Cliente Ativo</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">WhatsApp</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                  <User className="h-4 w-4 mr-2" />
                  Ver Histórico Completo
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-gray-50">
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar Conversa
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Conversa
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}