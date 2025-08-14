import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileText, CheckCircle2, AlertCircle } from "lucide-react";
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

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  description?: string;
}

export default function CalendarIntegrationPage() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if user has calendar integration
  const { data: integrationStatus, isLoading } = useQuery({
    queryKey: ['/api/calendar/status'],
    retry: false,
  });

  // Get upcoming events
  const { data: upcomingEvents, isLoading: loadingEvents } = useQuery({
    queryKey: ['/api/calendar/events'],
    enabled: integrationStatus?.connected,
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

  const handleConnect = () => {
    setIsConnecting(true);
    connectCalendarMutation.mutate();
  };

  const formatEventTime = (event: CalendarEvent) => {
    const startTime = event.start?.dateTime || event.start?.date;
    if (!startTime) return '';

    const start = new Date(startTime);
    const isAllDay = !event.start?.dateTime;

    if (isAllDay) {
      return `📅 ${start.toLocaleDateString('pt-BR')}`;
    }

    return `🕐 ${start.toLocaleDateString('pt-BR')} às ${start.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Integração Google Calendar
          </h1>
          <p className="text-gray-600">
            Conecte sua agenda para automatizar horários de atendimento e agendamentos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Status da Conexão
              </CardTitle>
              <CardDescription>
                Gerencie a conexão com sua conta Google Calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrationStatus?.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Sua conta Google Calendar está conectada e funcionando
                  </p>

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

                  <Button
                    onClick={() => disconnectCalendarMutation.mutate()}
                    variant="outline"
                    className="w-full"
                    disabled={disconnectCalendarMutation.isPending}
                  >
                    {disconnectCalendarMutation.isPending ? "Desconectando..." : "Desconectar"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <Badge variant="secondary">
                      Não Conectado
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600">
                    Conecte sua conta Google Calendar para ativar recursos de agendamento
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">Recursos disponíveis:</p>
                    <ul className="space-y-1 pl-4">
                      <li>• Verificação de disponibilidade</li>
                      <li>• Horários de atendimento automáticos</li>
                      <li>• Lembretes de compromissos</li>
                      <li>• Agendamentos via WhatsApp</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleConnect}
                    className="w-full"
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

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Próximos Compromissos
              </CardTitle>
              <CardDescription>
                Seus próximos eventos do Google Calendar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!integrationStatus?.connected ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Conecte sua agenda para ver os próximos compromissos</p>
                </div>
              ) : loadingEvents ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map((event: CalendarEvent) => (
                    <div key={event.id} className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium text-gray-900">
                        {event.summary || 'Evento sem título'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatEventTime(event)}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {upcomingEvents.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      E mais {upcomingEvents.length - 5} eventos...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhum compromisso próximo encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Como Funciona a Integração</CardTitle>
            <CardDescription>
              Recursos disponíveis com a conexão do Google Calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Horários de Atendimento
                </h4>
                <p className="text-sm text-gray-600">
                  O bot responde automaticamente com seus horários de disponibilidade
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Verificação de Disponibilidade
                </h4>
                <p className="text-sm text-gray-600">
                  Consulta automática se você está livre em determinado horário
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Lembretes Automáticos
                </h4>
                <p className="text-sm text-gray-600">
                  Envio de lembretes de compromissos via WhatsApp
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Respostas Contextuais
                </h4>
                <p className="text-sm text-gray-600">
                  Bot responde considerando seus compromissos atuais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}