import { Card, CardContent } from "@/components/ui/card";
import { Bot, Activity, MessageCircle, Users } from "lucide-react";

interface StatsData {
  totalBots: number;
  totalSessions: number;
  totalMessages: number;
  activeUsers: number;
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
      title: "Sessões Ativas",
      value: stats.totalSessions.toString(),
      icon: Activity,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total de Mensagens",
      value: stats.totalMessages.toString(),
      icon: MessageCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers.toString(),
      icon: Users,
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
