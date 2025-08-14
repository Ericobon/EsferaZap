import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation, Message } from "@shared/schema";

interface ChatInterfaceProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  onSelectConversation: (conversation: Conversation) => void;
  onSendMessage: (content: string) => void;
  loading?: boolean;
}

export default function ChatInterface({
  conversations,
  selectedConversation,
  messages,
  onSelectConversation,
  onSendMessage,
  loading = false
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <i className="fas fa-search text-gray-500"></i>
              </Button>
              <Button variant="ghost" size="sm">
                <i className="fas fa-filter text-gray-500"></i>
              </Button>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <i className="fas fa-circle mr-1 text-xs"></i>
              Todas
            </Badge>
            <Badge variant="outline">
              <i className="fas fa-user mr-1"></i>
              Não atribuídas
            </Badge>
            <Badge variant="outline">
              <i className="fas fa-clock mr-1"></i>
              Aguardando
            </Badge>
          </div>
        </div>

        {/* Lista de Conversas */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${conversation.customerName}`} />
                      <AvatarFallback>{getInitials(conversation.customerName || 'Cliente')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor('active')} rounded-full border-2 border-white`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {conversation.customerName || conversation.customerPhone}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageAt || conversation.createdAt!)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mt-1">
                      Última atividade: {conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : "Sem mensagens"}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {conversation.assignedToAgent && (
                          <Badge variant="outline" className="text-xs">
                            <i className="fas fa-user mr-1"></i>
                            Atribuído
                          </Badge>
                        )}
                        {conversation.isActive && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            <i className="fas fa-circle mr-1 text-xs"></i>
                            Ativo
                          </Badge>
                        )}
                      </div>
                      
                      <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        2
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.customerName}`} />
                    <AvatarFallback>{getInitials(selectedConversation.customerName || 'Cliente')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedConversation.customerName || selectedConversation.customerPhone}
                    </h3>
                    <p className="text-sm text-gray-500">
                      <i className="fas fa-circle text-green-500 mr-1"></i>
                      Online - Última atividade há 2 min
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-phone text-gray-500"></i>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-video text-gray-500"></i>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-info-circle text-gray-500"></i>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-sm lg:max-w-md xl:max-w-lg ${
                      message.direction === 'inbound'
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-blue-500 text-white'
                    } rounded-lg px-4 py-2`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          message.direction === 'inbound' ? 'text-gray-500' : 'text-blue-100'
                        }`}>
                          {formatTime(message.createdAt!)}
                        </span>
                        {message.direction === 'outbound' && (
                          <div className="flex items-center space-x-1">
                            {message.status === 'sent' && <i className="fas fa-check text-xs"></i>}
                            {message.status === 'delivered' && <i className="fas fa-check-double text-xs"></i>}
                            {message.status === 'read' && <i className="fas fa-check-double text-blue-200 text-xs"></i>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <i className="fas fa-paperclip text-gray-500"></i>
                </Button>
                <Button variant="ghost" size="sm">
                  <i className="fas fa-smile text-gray-500"></i>
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite uma mensagem..."
                    className="pr-12"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || loading}
                    className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                  >
                    <i className="fas fa-paper-plane text-xs"></i>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  <i className="fas fa-bolt mr-1"></i>
                  Resposta rápida
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  <i className="fas fa-sticky-note mr-1"></i>
                  Nota
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  Agendar
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-comments text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-gray-500">
                Escolha uma conversa da lista para começar a responder
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Painel Lateral de Informações */}
      {selectedConversation && (
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Informações</h3>
            
            {/* Perfil do Cliente */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="text-center mb-4">
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.customerName}`} />
                  <AvatarFallback>{getInitials(selectedConversation.customerName || 'Cliente')}</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-gray-900">
                  {selectedConversation.customerName || 'Cliente'}
                </h4>
                <p className="text-sm text-gray-500">{selectedConversation.customerPhone}</p>
              </div>
              
              <Separator className="my-3" />
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Última mensagem:</span>
                  <span className="text-sm font-medium">
                    {selectedConversation.lastMessageAt 
                      ? formatTime(selectedConversation.lastMessageAt)
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <i className="fas fa-circle mr-1 text-xs"></i>
                    Ativo
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atribuído a:</span>
                  <span className="text-sm font-medium">
                    {selectedConversation.assignedToAgent ? 'Agente' : 'Bot IA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Ações</h5>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm">
                  <i className="fas fa-user-tag mr-2"></i>
                  Atribuir conversa
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <i className="fas fa-ban mr-2"></i>
                  Bloquear contato
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm">
                  <i className="fas fa-trash mr-2"></i>
                  Excluir conversa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}