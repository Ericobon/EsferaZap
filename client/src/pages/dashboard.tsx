import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import AnalyticsOverview from "@/components/dashboard/analytics-overview";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
    enabled: !!user,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <AnalyticsOverview 
            data={analytics || { totalMessages: 0, activeBots: 0, averageResponseTime: 0, unreadConversations: 0 }} 
            loading={analyticsLoading} 
          />
        </div>
      </main>
    </div>
  );
}
