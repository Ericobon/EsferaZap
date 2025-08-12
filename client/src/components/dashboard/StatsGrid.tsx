import { Card, CardContent } from "@/components/ui/card";
import { Bot, Wifi, MessageCircle, TrendingUp } from "lucide-react";

interface StatsData {
  totalBots: number;
  connectedBots: number;
  todayMessages: number;
  responseRate: string;
}

interface StatsGridProps {
  stats: StatsData;
  isLoading: boolean;
}

export default function StatsGrid({ stats, isLoading }: StatsGridProps) {
  const statsItems = [
    {
      title: "Total de Bots",
      value: stats.totalBots.toString(),
      icon: Bot,
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Conectados",
      value: stats.connectedBots.toString(),
      icon: Wifi,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Mensagens Hoje",
      value: stats.todayMessages.toString(),
      icon: MessageCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Taxa de Resposta",
      value: stats.responseRate,
      icon: TrendingUp,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {statsItems.map((item, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{item.title}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {isLoading ? "..." : item.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
