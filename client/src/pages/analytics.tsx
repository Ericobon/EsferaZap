import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("last-month");
  const [comparedPeriod, setComparedPeriod] = useState("previous-month");
  const { user } = useAuth();

  // Buscar dados de analytics
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['/api/analytics/detailed', selectedPeriod, comparedPeriod],
    enabled: !!user,
  });

  // Dados mockados baseados na imagem
  const metrics = [
    {
      title: "Active chats",
      value: "173",
      change: "+32%",
      trend: "up",
      color: "text-green-600",
      subtitle: "current vs previous month",
      comparison: { current: 173, previous: 125 }
    },
    {
      title: "New chats", 
      value: "318",
      change: "+130%",
      trend: "up",
      color: "text-blue-600",
      subtitle: "current vs previous month",
      comparison: { current: 318, previous: 354 }
    },
    {
      title: "Resolved chats",
      value: "674",
      change: "+4%", 
      trend: "up",
      color: "text-green-600",
      subtitle: "current vs previous month",
      comparison: { current: 674, previous: 643 }
    },
    {
      title: "Pending chats",
      value: "103",
      change: "+138%",
      trend: "up", 
      color: "text-orange-600",
      subtitle: "current vs previous month",
      comparison: { current: 103, previous: 247 }
    }
  ];

  const timeMetrics = [
    {
      title: "Reply time",
      value: "3 minutes",
      subtitle: "2m",
      change: "+10%",
      trend: "up",
      color: "text-green-600",
      description: "current vs previous month"
    },
    {
      title: "Reply wait time", 
      value: "2.5 minutes",
      subtitle: "2.6m",
      change: "+6%",
      trend: "up",
      color: "text-green-600", 
      description: "current vs previous month"
    },
    {
      title: "Resolution time",
      value: "10 minutes",
      subtitle: "9m", 
      change: "+13%",
      trend: "up",
      color: "text-red-600",
      description: "current vs previous month"
    },
    {
      title: "Unread messages",
      value: "41156",
      subtitle: "10880",
      change: "+118%",
      trend: "up",
      color: "text-green-600",
      description: "current vs previous month"
    }
  ];

  const chartMetrics = [
    {
      title: "New chats",
      value: "9884",
      date: "Apr 30",
      change: "+7%",
      color: "text-green-600"
    },
    {
      title: "Pending chats", 
      value: "478",
      date: "Mar 31",
      change: "+40%",
      color: "text-green-600"
    },
    {
      title: "Resolved chats",
      value: "21689", 
      date: "Mar 31",
      change: "+17%",
      color: "text-green-600"
    }
  ];

  const additionalMetrics = [
    {
      title: "Reply time",
      value: "3m",
      date: "Apr 30",
      change: "+7%",
      color: "text-green-600"
    },
    {
      title: "Waiting time",
      value: "2m", 
      date: "Mar 31",
      change: "+21%",
      color: "text-green-600"
    },
    {
      title: "Chat resolution time",
      value: "11m",
      date: "Apr 30", 
      change: "+70%",
      color: "text-green-600"
    }
  ];

  // Dados dos gráficos
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    newChats: Math.floor(Math.random() * 100) + 50,
    pendingChats: Math.floor(Math.random() * 50) + 20,
    resolvedChats: Math.floor(Math.random() * 120) + 80,
    replyTime: Math.floor(Math.random() * 5) + 2,
    waitingTime: Math.floor(Math.random() * 3) + 1,
    resolutionTime: Math.floor(Math.random() * 15) + 5
  }));

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Get deep business analytics & insights from your team chat usage data.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Marketing</span>
              <Button variant="outline" size="sm">
                <i className="fas fa-chevron-down ml-2"></i>
              </Button>
            </div>
          </div>

          {/* Period Selection */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Last month</span>
              <Badge variant="outline" className="bg-gray-100">
                <i className="fas fa-calendar mr-1"></i>
                1 April - 30 April
              </Badge>
            </div>
            
            <span className="text-sm text-gray-500">compared to</span>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">previous month</span>
              <Badge variant="outline" className="bg-gray-100">
                <i className="fas fa-calendar mr-1"></i>
                1 February - 31 March
              </Badge>
            </div>
          </div>

          {/* Main Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
                  <p className="text-xs text-gray-500">{metric.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {timeMetrics.map((metric, index) => (
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
                  <div className="text-lg text-gray-600 mb-1">{metric.subtitle}</div>
                  <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* New Chats Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">9884</span>
                      <span className="text-sm text-green-600 font-medium">+7%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">New chats</CardTitle>
                    <p className="text-xs text-gray-500">Apr 30</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.slice(0, 15)}>
                      <Area type="monotone" dataKey="newChats" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pending Chats Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">478</span>
                      <span className="text-sm text-green-600 font-medium">+40%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">Pending chats</CardTitle>
                    <p className="text-xs text-gray-500">Mar 31</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.slice(0, 15)}>
                      <Area type="monotone" dataKey="pendingChats" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Resolved Chats Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">21689</span>
                      <span className="text-sm text-green-600 font-medium">+17%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">Resolved chats</CardTitle>
                    <p className="text-xs text-gray-500">Mar 31</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.slice(0, 15)}>
                      <Area type="monotone" dataKey="resolvedChats" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reply Time Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">3m</span>
                      <span className="text-sm text-green-600 font-medium">+7%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">Reply time</CardTitle>
                    <p className="text-xs text-gray-500">Apr 30</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.slice(0, 15)}>
                      <Line type="monotone" dataKey="replyTime" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Waiting Time Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">2m</span>
                      <span className="text-sm text-green-600 font-medium">+21%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">Waiting time</CardTitle>
                    <p className="text-xs text-gray-500">Mar 31</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.slice(0, 15)}>
                      <Line type="monotone" dataKey="waitingTime" stroke="#EF4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Time Chart */}
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">11m</span>
                      <span className="text-sm text-green-600 font-medium">+70%</span>
                    </div>
                    <CardTitle className="text-sm text-gray-600">Chat resolution time</CardTitle>
                    <p className="text-xs text-gray-500">Apr 30</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.slice(0, 15)}>
                      <Line type="monotone" dataKey="resolutionTime" stroke="#06B6D4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}