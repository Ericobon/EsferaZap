import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Bot } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/dashboard/Header";
import StatsGrid from "@/components/dashboard/StatsGrid";
import BotsList from "@/components/dashboard/BotsList";
import CreateBotModal from "@/components/dashboard/CreateBotModal";
import QRCodeModal from "@/components/dashboard/QRCodeModal";

interface DashboardStats {
  totalBots: number;
  connectedBots: number;
  todayMessages: number;
  responseRate: string;
}

export default function Dashboard() {
  const { userData } = useAuth();
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState<string>("");

  // Fetch bots
  const { data: bots = [], isLoading: botsLoading, refetch: refetchBots } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
    enabled: !!userData,
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
    enabled: !!userData,
  });

  const handleShowQRCode = (botId: string) => {
    setSelectedBotId(botId);
    setShowQRCode(true);
  };

  const handleEditBot = (bot: Bot) => {
    // TODO: Implement edit functionality
    console.log("Edit bot:", bot);
  };

  const handleBotCreated = () => {
    refetchBots();
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Carregando...</h2>
          <p className="text-slate-600">Aguarde enquanto carregamos seus dados</p>
        </div>
      </div>
    );
  }

  const defaultStats: DashboardStats = {
    totalBots: bots.length,
    connectedBots: bots.filter(bot => bot.status === "connected").length,
    todayMessages: 0,
    responseRate: "0%",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userData={userData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Seus Bots</h1>
            <p className="text-slate-600 mt-1">Gerencie e monitore seus chatbots WhatsApp</p>
          </div>
          <Button onClick={() => setShowCreateBot(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Criar Bot
          </Button>
        </div>

        {/* Stats Grid */}
        <StatsGrid 
          stats={stats || defaultStats} 
          isLoading={statsLoading} 
        />

        {/* Bots List */}
        <BotsList
          bots={bots}
          isLoading={botsLoading}
          onShowQRCode={handleShowQRCode}
          onEditBot={handleEditBot}
        />

        {/* Modals */}
        <CreateBotModal
          isOpen={showCreateBot}
          onClose={() => setShowCreateBot(false)}
          onSuccess={handleBotCreated}
        />

        <QRCodeModal
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          botId={selectedBotId}
        />
      </main>
    </div>
  );
}
