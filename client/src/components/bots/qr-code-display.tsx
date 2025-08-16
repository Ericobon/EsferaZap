import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import QRCodeLib from "qrcode";

interface QRCodeDisplayProps {
  botId: string;
  botName: string;
  phoneNumber: string;
  onConnectionSuccess?: () => void;
}

export function QRCodeDisplay({ botId, botName, phoneNumber, onConnectionSuccess }: QRCodeDisplayProps) {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(8);
  const { toast } = useToast();

  // Conectar com Baileys real
  const generateQRMutation = useMutation({
    mutationFn: async () => {
      // Chamar API real do Baileys
      const response = await apiRequest('POST', `/api/bots/${botId}/connect-whatsapp`);
      
      if (response.success && response.qrCode) {
        setQrCodeData('baileys_qr_generated');
        setQrCodeImage(response.qrCode);
        setConnectionStatus('connecting');
        setCountdown(8);
        
        // Polling para verificar status da conexão
        const pollStatus = async () => {
          try {
            const statusResponse = await apiRequest('GET', `/api/bots/${botId}/whatsapp-status`);
            
            if (statusResponse.status === 'connected') {
              setConnectionStatus('connected');
              queryClient.invalidateQueries({ queryKey: ['/api/bots'] });
              toast({
                title: "WhatsApp Conectado!",
                description: "Seu bot está pronto para receber mensagens",
              });
              onConnectionSuccess?.();
              return true; // Stop polling
            }
            return false; // Continue polling
          } catch (error) {
            console.error('Erro ao verificar status:', error);
            return false;
          }
        };
        
        // Countdown timer com polling
        const timer = setInterval(async () => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              // Verificar status final
              pollStatus();
              return 0;
            }
            return prev - 1;
          });
          
          // Verificar status a cada 2 segundos
          if (countdown % 2 === 0) {
            const connected = await pollStatus();
            if (connected) {
              clearInterval(timer);
              setCountdown(0);
            }
          }
        }, 1000);
        
        return response.qrCode;
      }
      
      throw new Error(response.error || 'Erro ao gerar QR Code');
    },
    onError: () => {
      toast({
        title: "Erro ao gerar QR Code",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    },
  });

  const handleGenerateQR = () => {
    setConnectionStatus('disconnected');
    setQrCodeData(null);
    setQrCodeImage(null);
    setCountdown(8);
    generateQRMutation.mutate();
  };

  useEffect(() => {
    // Gerar QR automaticamente quando o componente for montado
    handleGenerateQR();
  }, []);

  const getStatusInfo = () => {
    switch (connectionStatus) {
      case 'disconnected':
        return {
          icon: QrCode,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Aguardando QR Code',
          description: 'Gerando código QR para conexão...'
        };
      case 'connecting':
        return {
          icon: Smartphone,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'Aguardando Conexão',
          description: 'Escaneie o QR Code com seu WhatsApp'
        };
      case 'connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Conectado com Sucesso',
          description: 'Seu bot está ativo e pronto para uso!'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Conectar ao WhatsApp
          <Badge className="bg-green-100 text-green-800">Baileys</Badge>
        </CardTitle>
        <div className="space-y-1">
          <p className="font-medium">{botName}</p>
          <p className="text-sm text-gray-600">{phoneNumber}</p>
        </div>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        
        {/* Status */}
        <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
          <p className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
          <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
        </div>

        {/* QR Code Area */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
          {generateQRMutation.isPending ? (
            <div className="flex flex-col items-center gap-4">
              <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" />
              <p className="text-gray-600">Gerando QR Code...</p>
            </div>
          ) : qrCodeData && qrCodeImage && connectionStatus !== 'connected' ? (
            <div className="flex flex-col items-center gap-4">
              {/* QR Code real gerado */}
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={qrCodeImage} 
                  alt="QR Code WhatsApp"
                  className="w-64 h-64"
                />
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <p className="font-medium">Escaneie em:</p>
                  <Badge className="bg-yellow-100 text-yellow-800 font-mono">
                    {countdown}s
                  </Badge>
                </div>
                <p className="font-medium">Como conectar:</p>
                <ol className="text-left space-y-1 max-w-xs">
                  <li>1. Abra o WhatsApp no seu celular</li>
                  <li>2. Toque em "Dispositivos conectados"</li>
                  <li>3. Toque em "Conectar dispositivo"</li>
                  <li>4. Escaneie este código QR</li>
                </ol>
              </div>
            </div>
          ) : connectionStatus === 'connected' ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-24 w-24 text-green-600" />
              <div className="space-y-2">
                <p className="text-green-600 font-medium text-lg">Conectado!</p>
                <p className="text-gray-600 text-sm">
                  Seu chatbot está ativo e pronto para responder mensagens
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
              <p className="text-gray-600">Erro ao gerar QR Code</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          {connectionStatus !== 'connected' && (
            <Button
              onClick={handleGenerateQR}
              disabled={generateQRMutation.isPending}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${generateQRMutation.isPending ? 'animate-spin' : ''}`} />
              {generateQRMutation.isPending ? 'Gerando...' : 'Gerar Novo QR'}
            </Button>
          )}
        </div>

        {connectionStatus === 'connected' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <h4 className="font-medium text-green-800 mb-2">Próximos Passos:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Teste o bot enviando mensagens para {phoneNumber}</li>
              <li>• Configure mensagens automáticas</li>
              <li>• Monitore conversas no painel</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}