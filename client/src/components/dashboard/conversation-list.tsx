import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function ConversationList() {
  const { data: bots } = useQuery({
    queryKey: ["/api/bots"],
  });

  // Mock conversation data for demonstration
  const mockConversations = [
    {
      id: '1',
      name: 'Maria Costa',
      initials: 'MC',
      lastMessage: 'Preciso de ajuda com meu pedido...',
      time: '14:30',
      bot: 'Atendimento',
      botColor: 'text-primary bg-primary-light',
      unread: true,
    },
    {
      id: '2',
      name: 'João Santos',
      initials: 'JS',
      lastMessage: 'Obrigado pela resposta rápida!',
      time: '13:45',
      bot: 'Suporte',
      botColor: 'text-blue-600 bg-blue-100',
      unread: false,
    },
    {
      id: '3',
      name: 'Ana Lima',
      initials: 'AL',
      lastMessage: 'Quero saber sobre produtos novos',
      time: '12:20',
      bot: 'Vendas',
      botColor: 'text-purple-600 bg-purple-100',
      unread: true,
    },
    {
      id: '4',
      name: 'Rafael Ferreira',
      initials: 'RF',
      lastMessage: 'Como posso integrar com meu sistema?',
      time: '11:55',
      bot: 'Suporte',
      botColor: 'text-blue-600 bg-blue-100',
      unread: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Conversas Recentes</h2>
          <Link href="/conversations">
            <a className="text-primary hover:text-primary-dark text-sm">Ver todas</a>
          </Link>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {mockConversations.map((conversation) => (
            <div key={conversation.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700">
                  {conversation.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.name}
                  </p>
                  <span className="text-xs text-gray-500">{conversation.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${conversation.botColor}`}>
                    {conversation.bot}
                  </span>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-accent rounded-full ml-auto"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
