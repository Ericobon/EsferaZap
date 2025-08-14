import { Link } from "wouter";
import type { Bot } from "@shared/schema";

interface BotListProps {
  bots: Bot[];
  loading: boolean;
}

export default function BotList({ bots, loading }: BotListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-gray-600';
      case 'configuring':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'inactive':
        return 'bg-gray-400';
      case 'configuring':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Online';
      case 'inactive':
        return 'Offline';
      case 'configuring':
        return 'Configurando';
      default:
        return 'Desconhecido';
    }
  };

  const getBotIcon = (name: string) => {
    if (name.toLowerCase().includes('loja') || name.toLowerCase().includes('store')) {
      return 'fas fa-store';
    } else if (name.toLowerCase().includes('suporte') || name.toLowerCase().includes('support')) {
      return 'fas fa-headset';
    } else if (name.toLowerCase().includes('venda') || name.toLowerCase().includes('sales')) {
      return 'fas fa-shopping-cart';
    }
    return 'fas fa-robot';
  };

  const getBotColor = (name: string) => {
    if (name.toLowerCase().includes('loja') || name.toLowerCase().includes('store')) {
      return 'bg-primary';
    } else if (name.toLowerCase().includes('suporte') || name.toLowerCase().includes('support')) {
      return 'bg-blue-500';
    } else if (name.toLowerCase().includes('venda') || name.toLowerCase().includes('sales')) {
      return 'bg-purple-500';
    }
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold gradient-whatsapp">Meus Bots WhatsApp</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold gradient-whatsapp">Meus Bots WhatsApp</h2>
          <Link href="/bots">
            <span className="text-primary hover:text-primary-dark cursor-pointer">
              <i className="fas fa-plus mr-1"></i>Adicionar Bot
            </span>
          </Link>
        </div>
      </div>
      <div className="p-6">
        {!bots || bots.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-robot text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600 mb-4">Nenhum bot criado ainda</p>
            <Link href="/bots" className="text-primary hover:text-primary-dark">
              Criar primeiro bot
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bots.map((bot) => (
              <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${getBotColor(bot.name)} rounded-lg flex items-center justify-center`}>
                    <i className={`${getBotIcon(bot.name)} text-white`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                    <p className="text-sm text-gray-600">{bot.phoneNumber}</p>
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 ${getStatusDot(bot.status || 'inactive')} rounded-full mr-2`}></div>
                      <span className={`text-xs font-medium ${getStatusColor(bot.status || 'inactive')}`}>
                        {getStatusText(bot.status || 'inactive')}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        • Criado em {new Date(bot.createdAt!).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 500) + 100} msgs hoje
                  </span>
                  <Link href="/bots" className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-cog"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
