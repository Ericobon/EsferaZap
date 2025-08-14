import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Conversation, Message } from "@shared/schema";

interface ChatViewerProps {
  conversation: Conversation;
}

export default function ChatViewer({ conversation }: ChatViewerProps) {
  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/conversations", conversation.id, "messages"],
  });

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
          <p className="text-gray-600">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">
                {conversation.customerName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {conversation.customerName || 'Cliente'}
              </h3>
              <p className="text-sm text-gray-600">{conversation.customerPhone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {conversation.assignedToAgent ? (
              <Badge className="bg-blue-100 text-blue-800">Com agente</Badge>
            ) : (
              <Badge className="bg-primary-light text-primary-dark">Bot ativo</Badge>
            )}
            {conversation.isActive && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-comment-dots text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600">Nenhuma mensagem encontrada</p>
          </div>
        ) : (
          <>
            {/* Group messages by date */}
            {messages.reduce((groups: any[], message: Message) => {
              const date = formatDate(message.createdAt!);
              const existingGroup = groups.find(g => g.date === date);
              
              if (existingGroup) {
                existingGroup.messages.push(message);
              } else {
                groups.push({ date, messages: [message] });
              }
              
              return groups;
            }, []).map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="text-center my-4">
                  <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 border">
                    {group.date}
                  </span>
                </div>
                
                {/* Messages for this date */}
                {group.messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromBot ? 'justify-start' : 'justify-end'} mb-3`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromBot
                          ? 'bg-white text-gray-900 border border-gray-200'
                          : 'bg-primary text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-1 text-xs ${
                        message.isFromBot ? 'text-gray-500' : 'text-primary-light'
                      }`}>
                        <span>{formatTime(message.createdAt!)}</span>
                        {!message.isFromBot && (
                          <div className="flex items-center space-x-1">
                            {message.status === 'delivered' && (
                              <i className="fas fa-check"></i>
                            )}
                            {message.status === 'read' && (
                              <i className="fas fa-check-double"></i>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Message Input (disabled for now) */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Esta conversa é gerenciada pelo bot..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            disabled
          />
          <button 
            className="p-2 text-gray-400 cursor-not-allowed"
            disabled
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
