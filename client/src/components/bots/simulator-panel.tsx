import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MessageSquare, Send, Smartphone, User, Bot, Clock } from "lucide-react";

interface SimulatorPanelProps {
  botId: string;
  botName: string;
}

export function SimulatorPanel({ botId, botName }: SimulatorPanelProps) {
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+5511999999999");
  const { toast } = useToast();

  // Buscar exemplos de mensagens
  const { data: examples = [] } = useQuery({
    queryKey: ['/api/bots', botId, 'examples'],
  });

  // Simular mensagem
  const simulateMutation = useMutation({
    mutationFn: async (data: { message: string; fromNumber: string }) => {
      return await apiRequest("POST", `/api/bots/${botId}/simulate`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      toast({
        title: "Mensagem simulada!",
        description: `Bot respondeu: ${data.botResponse?.substring(0, 50)}...`,
      });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Erro na simulação",
        description: "Não foi possível simular a mensagem",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite uma mensagem para testar",
        variant: "destructive",
      });
      return;
    }

    simulateMutation.mutate({
      message: message.trim(),
      fromNumber: phoneNumber
    });
  };

  const handleExampleClick = (exampleMessage: string) => {
    setMessage(exampleMessage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          Simulador WhatsApp - {botName}
          <Badge className="bg-green-100 text-green-800 ml-2">MVP Teste</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Teste seu chatbot simulando conversas do WhatsApp
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Campo de número */}
        <div>
          <label className="text-sm font-medium text-gray-700">Número do cliente (simulação)</label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+5511999999999"
            className="mt-1"
          />
        </div>

        {/* Campo da mensagem */}
        <div>
          <label className="text-sm font-medium text-gray-700">Mensagem do cliente</label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite a mensagem que o cliente enviaria..."
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Botão enviar */}
        <Button
          onClick={handleSendMessage}
          disabled={simulateMutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {simulateMutation.isPending ? "Enviando..." : "Simular Mensagem"}
        </Button>

        {/* Mensagens de exemplo */}
        {examples.examples && examples.examples.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Mensagens de exemplo:</h4>
            <div className="grid grid-cols-1 gap-2">
              {examples.examples.map((example: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  className="text-left h-auto p-2 justify-start text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{example}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado da última simulação */}
        {simulateMutation.data && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Última simulação
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-medium text-blue-600">Cliente:</span>
                  <p className="text-gray-700">{simulateMutation.data.userMessage}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Bot className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <span className="font-medium text-green-600">Bot:</span>
                  <p className="text-gray-700">{simulateMutation.data.botResponse}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}