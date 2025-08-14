import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AnalyticsData {
  totalMessages: number;
  activeBots: number;
  averageResponseTime: number;
  unreadConversations: number;
}

interface AnalyticsOverviewProps {
  data: AnalyticsData;
  loading?: boolean;
}

export default function AnalyticsOverview({ data, loading = false }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: "Novos chats",
      value: "25",
      change: "+12%",
      trend: "up",
      color: "text-green-600"
    },
    {
      title: "Chats pendentes",
      value: "13",
      change: "+30%",
      trend: "up", 
      color: "text-blue-600"
    },
    {
      title: "Chats atribuídos",
      value: "23",
      change: "-3%",
      trend: "down",
      color: "text-red-600"
    },
    {
      title: "Chats resolvidos",
      value: "14",
      change: "+10%",
      trend: "up",
      color: "text-green-600"
    },
    {
      title: "Tempo de resolução",
      value: "11 dias",
      change: "+18%",
      trend: "up",
      color: "text-green-600"
    },
    {
      title: "Tempo de primeira resposta",
      value: "alguns segundos",
      change: "+7%",
      trend: "up",
      color: "text-green-600"
    }
  ];

  const whatsappNumbers = [
    {
      name: "Sales",
      number: "+5511234567890",
      status: "active",
      stats: {
        pending: 1,
        active: 183,
        chatMembers: 8,
        groupChats: 144,
        contacts: 713
      }
    },
    {
      name: "Providers", 
      number: "+5511987654321",
      status: "disconnected",
      stats: {
        queued: 0,
        active: 234,
        groupChats: 45,
        sent: 564,
        media: 365
      }
    }
  ];

  const teamMembers = [
    {
      name: "David",
      email: "david@company.com",
      role: "Administrator",
      status: "Available",
      lastActivity: "3 minutes ago",
      avatar: "D"
    },
    {
      name: "Kevin",
      email: "kevin@company.com", 
      role: "Administrator",
      status: "Available",
      lastActivity: "4 months ago",
      avatar: "K"
    },
    {
      name: "Laura",
      email: "laura@company.com",
      role: "Agent", 
      status: "Pending",
      lastActivity: "4 months ago",
      avatar: "L"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics overview</h1>
          <p className="text-gray-600 mt-1">Explore more</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Today</span>
          <Badge variant="outline" className="bg-gray-100">
            <i className="fas fa-calendar mr-1"></i>
            30 Oct - 31 Oct
          </Badge>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${metric.color}`}>
                  {metric.change}
                </span>
                <i className={`fas fa-arrow-${metric.trend === 'up' ? 'up' : 'down'} text-xs ${metric.color}`}></i>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* WhatsApp Numbers */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">WhatsApp numbers</CardTitle>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
              <i className="fas fa-plus mr-2"></i>
              Add number
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {whatsappNumbers.map((number, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    number.status === 'active' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <i className={`fas fa-whatsapp text-xl ${
                      number.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{number.name}</h3>
                    <p className="text-sm text-gray-600">{number.number}</p>
                    <Badge 
                      variant={number.status === 'active' ? 'secondary' : 'destructive'}
                      className={number.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {number.status === 'active' ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-chart-line text-gray-500"></i>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-cog text-gray-500"></i>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-4">
                {Object.entries(number.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
              
              {index < whatsappNumbers.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </div>
          ))}
          
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-2">Gateway numbers</p>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Team</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <i className="fas fa-search mr-2"></i>
                All devices
              </Button>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <i className="fas fa-plus mr-2"></i>
                Add member
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        <i className={`fas fa-${member.role === 'Administrator' ? 'crown' : 'user'} mr-1`}></i>
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Last activity</div>
                    <div className="text-sm font-medium">{member.lastActivity}</div>
                  </div>
                  
                  <Badge 
                    variant={member.status === 'Available' ? 'secondary' : 'outline'}
                    className={member.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  >
                    <i className={`fas fa-circle mr-1 text-xs ${
                      member.status === 'Available' ? 'text-green-500' : 'text-yellow-500'
                    }`}></i>
                    {member.status}
                  </Badge>
                  
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-ellipsis-v text-gray-500"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}