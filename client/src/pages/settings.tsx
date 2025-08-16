import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Bell, 
  Clock, 
  Smartphone,
  Shield,
  User
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        {children}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if user has calendar integration
  const { data: integrationStatus, isLoading } = useQuery({
    queryKey: ['/api/calendar/status'],
    retry: false,
  });

  // Get business hours
  const { data: businessHours } = useQuery({
    queryKey: ['/api/calendar/business-hours'],
    enabled: integrationStatus?.connected,
    retry: false,
  });

  const connectCalendarMutation = useMutation({
    mutationFn: () => apiRequest("/api/calendar/connect", "POST"),
    onSuccess: (data) => {
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro na conexão",
        description: error.message || "Não foi possível conectar ao Google Calendar",
        variant: "destructive",
      });
    },
  });

  const disconnectCalendarMutation = useMutation({
    mutationFn: () => apiRequest("/api/calendar/disconnect", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/status'] });
      toast({
        title: "Desconectado",
        description: "Google Calendar desconectado com sucesso",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("/api/logout", "POST"),
    onSuccess: () => {
      // Limpar cache do React Query
      queryClient.clear();
      // Redirecionar para página de login
      window.location.href = "/login";
    },
    onError: (error: any) => {
      toast({
        title: "Erro no logout",
        description: error.message || "Não foi possível fazer logout",
        variant: "destructive",
      });
    },
  });

  const handleConnect = () => {
    setIsConnecting(true);
    connectCalendarMutation.mutate();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-gray-600">
            Gerencie suas preferências e integrações da plataforma
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil do Usuário
              </CardTitle>
              <CardDescription>
                Informações básicas da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome</Label>
                  <p className="text-sm text-gray-900 mt-1">Usuário EsferaZap</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900 mt-1">usuario@exemplo.com</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          {/* Google Calendar Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Integração Google Calendar
              </CardTitle>
              <CardDescription>
                Conecte sua agenda para automatizar horários de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrationStatus?.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Conectado</span>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Ativo
                    </Badge>
                  </div>
                  
                  {businessHours && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        Horário de Atendimento Detectado:
                      </p>
                      <p className="text-sm text-blue-700">
                        {businessHours.start} - {businessHours.end}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.location.href = '/calendar-integration'}
                      variant="outline"
                      size="sm"
                    >
                      Ver Agenda
                    </Button>
                    <Button
                      onClick={() => disconnectCalendarMutation.mutate()}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      disabled={disconnectCalendarMutation.isPending}
                    >
                      {disconnectCalendarMutation.isPending ? "Desconectando..." : "Desconectar"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Não Conectado</span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">Recursos disponíveis após conectar:</p>
                    <ul className="space-y-1 pl-4">
                      <li>• Verificação automática de disponibilidade</li>
                      <li>• Horários de atendimento sincronizados</li>
                      <li>• Lembretes de compromissos via WhatsApp</li>
                      <li>• Agendamentos inteligentes</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleConnect}
                    size="sm"
                    disabled={isConnecting || connectCalendarMutation.isPending}
                  >
                    {isConnecting || connectCalendarMutation.isPending ? 
                      "Conectando..." : 
                      "Conectar Google Calendar"
                    }
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Configurações WhatsApp
              </CardTitle>
              <CardDescription>
                Configurações para automação WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-reply" className="text-sm font-medium">
                    Respostas Automáticas
                  </Label>
                  <p className="text-sm text-gray-600">
                    Ativar respostas automáticas com IA
                  </p>
                </div>
                <Switch id="auto-reply" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="business-hours" className="text-sm font-medium">
                    Horário Comercial
                  </Label>
                  <p className="text-sm text-gray-600">
                    Responder apenas no horário comercial
                  </p>
                </div>
                <Switch id="business-hours" defaultChecked={!!integrationStatus?.connected} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar-sync" className="text-sm font-medium">
                    Sincronização com Agenda
                  </Label>
                  <p className="text-sm text-gray-600">
                    Usar agenda para disponibilidade
                  </p>
                </div>
                <Switch 
                  id="calendar-sync" 
                  defaultChecked={!!integrationStatus?.connected}
                  disabled={!integrationStatus?.connected}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-messages" className="text-sm font-medium">
                    Novas Mensagens
                  </Label>
                  <p className="text-sm text-gray-600">
                    Notificações de novas conversas
                  </p>
                </div>
                <Switch id="new-messages" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointment-reminders" className="text-sm font-medium">
                    Lembretes de Compromissos
                  </Label>
                  <p className="text-sm text-gray-600">
                    Avisos sobre próximos eventos
                  </p>
                </div>
                <Switch id="appointment-reminders" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-updates" className="text-sm font-medium">
                    Atualizações do Sistema
                  </Label>
                  <p className="text-sm text-gray-600">
                    Novidades e melhorias na plataforma
                  </p>
                </div>
                <Switch id="system-updates" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>
                Configurações de segurança da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-gray-600">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Sessões Ativas</Label>
                  <p className="text-sm text-gray-600">
                    Gerencie dispositivos conectados
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Sessões
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-5 w-5" />
                Sair da Conta
              </CardTitle>
              <CardDescription>
                Encerrar sessão e retornar à página de login
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Logout</Label>
                  <p className="text-sm text-gray-600">
                    Desconecte-se com segurança da sua conta
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Saindo..." : "Sair da Conta"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}