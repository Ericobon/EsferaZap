import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Eye, Edit, QrCode } from "lucide-react";
import { Bot } from "@shared/schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BotsListProps {
  bots: Bot[];
  isLoading: boolean;
  onShowQRCode: (botId: string) => void;
  onEditBot: (bot: Bot) => void;
}

export default function BotsList({ bots, isLoading, onShowQRCode, onEditBot }: BotsListProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      connected: { label: "Conectado", variant: "default" as const, className: "bg-green-100 text-green-800" },
      connecting: { label: "Conectando...", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      disconnected: { label: "Desconectado", variant: "destructive" as const, className: "bg-red-100 text-red-800" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.disconnected;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const iconClass = status === "connected" ? "text-green-600" : 
                     status === "connecting" ? "text-yellow-600" : "text-red-600";
    const bgClass = status === "connected" ? "bg-green-100" : 
                    status === "connecting" ? "bg-yellow-100" : "bg-red-100";
    
    return { iconClass, bgClass };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lista de Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum bot criado ainda</h3>
            <p className="text-slate-600">Crie seu primeiro bot para começar a automatizar conversas no WhatsApp.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Bots</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-200">
          {bots.map((bot) => {
            const { iconClass, bgClass } = getStatusIcon(bot.status);
            
            return (
              <div key={bot.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${bgClass} rounded-lg flex items-center justify-center`}>
                      <MessageCircle className={`w-6 h-6 ${iconClass}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{bot.name}</h3>
                      <p className="text-slate-600 text-sm">{bot.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        {getStatusBadge(bot.status)}
                        <span className="text-xs text-slate-500">
                          {bot.lastActive 
                            ? `Última atividade: ${new Date(bot.lastActive).toLocaleString()}`
                            : "Nunca ativo"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-slate-600"
                      onClick={() => onEditBot(bot)}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button onClick={() => onShowQRCode(bot.id)}>
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Code
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
