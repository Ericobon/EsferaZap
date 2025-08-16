import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  QrCode, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import type { Bot } from '@shared/schema';

interface QRCodeGeneratorProps {
  bot: Bot;
  onConnectionUpdate?: (connected: boolean) => void;
}

interface QRCodeResponse {
  qrCode: string;
  status: 'pending' | 'connected' | 'error';
  message?: string;
  expires?: string;
}

interface ConnectionStatus {
  connected: boolean;
  status: string;
  provider: string;
  lastCheck: string;
}

export function QRCodeGenerator({ bot, onConnectionUpdate }: QRCodeGeneratorProps) {
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const getProviderName = (provider: string) => {
    const providers: Record<string, string> = {
      meta_business: 'Meta Business API',
      twilio: 'Twilio WhatsApp',
      evolution_api: 'Evolution API',
      baileys: 'Baileys (Open Source)',
      wppconnect: 'WPPConnect',
      venom: 'Venom Bot'
    };
    return providers[provider] || provider;
  };

  const checkConnectionStatus = async () => {
    setIsChecking(true);
    try {
      const response = await apiRequest<ConnectionStatus>(`/api/bots/${bot.id}/connection-status`);
      setConnectionStatus(response);
      onConnectionUpdate?.(response.connected);
    } catch (error) {
      console.error('Error checking connection status:', error);
      toast({
        title: "Erro",
        description: "Falha ao verificar status de conexão",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const response = await apiRequest<QRCodeResponse>(`/api/bots/${bot.id}/generate-qr`, {
        method: 'POST'
      });
      
      setQrData(response);
      
      if (response.status === 'pending' && response.expires) {
        const expiresAt = new Date(response.expires).getTime();
        const now = Date.now();
        setCountdown(Math.max(0, Math.floor((expiresAt - now) / 1000)));
      }

      toast({
        title: "QR Code Gerado",
        description: response.message || "QR Code gerado com sucesso",
      });
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao gerar QR Code",
        variant: "destructive",
      });
      setQrData({
        qrCode: '',
        status: 'error',
        message: error.response?.data?.message || "Erro desconhecido"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Check connection status on component mount
    checkConnectionStatus();
  }, [bot.id]);

  useEffect(() => {
    // Countdown timer for QR code expiration
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && qrData?.status === 'pending') {
      setQrData(prev => prev ? { ...prev, status: 'error', message: 'QR Code expirado' } : null);
    }
  }, [countdown, qrData?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProviderInstructions = (provider: string) => {
    const instructions: Record<string, { title: string; steps: string[] }> = {
      meta_business: {
        title: "Meta Business API",
        steps: [
          "Acesse o Meta Business Manager",
          "Configure sua aplicação WhatsApp",
          "Autorize as permissões necessárias"
        ]
      },
      twilio: {
        title: "Twilio WhatsApp Sandbox",
        steps: [
          "Abra o WhatsApp no seu celular",
          "Escaneie o QR Code ou envie a mensagem indicada",
          "Aguarde a confirmação de conexão"
        ]
      },
      evolution_api: {
        title: "Evolution API",
        steps: [
          "Abra o WhatsApp no seu celular",
          "Vá em Configurações > Aparelhos conectados",
          "Escaneie o QR Code na tela"
        ]
      },
      baileys: {
        title: "Baileys Open Source",
        steps: [
          "Abra o WhatsApp no seu celular",
          "Vá em Configurações > Aparelhos conectados",
          "Escaneie o QR Code na tela"
        ]
      }
    };
    return instructions[provider] || instructions.evolution_api;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2 justify-center">
          <QrCode className="h-5 w-5" />
          Conexão WhatsApp
        </CardTitle>
        <CardDescription>
          {getProviderName(bot.whatsappProvider || 'meta_business')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-2">
            {connectionStatus?.connected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {connectionStatus?.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnectionStatus}
            disabled={isChecking}
          >
            {isChecking ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* QR Code Display */}
        {qrData?.qrCode && qrData.status === 'pending' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <img 
                src={qrData.qrCode} 
                alt="QR Code para conexão WhatsApp"
                className="mx-auto max-w-full h-auto"
                style={{ maxWidth: '200px' }}
              />
            </div>
            
            {countdown > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expira em: {formatTime(countdown)}</span>
              </div>
            )}

            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                {qrData.message || "Escaneie o QR Code com seu WhatsApp"}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Error State */}
        {qrData?.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {qrData.message || "Erro ao gerar QR Code"}
            </AlertDescription>
          </Alert>
        )}

        {/* Generate QR Code Button */}
        <div className="space-y-2">
          <Button
            onClick={generateQRCode}
            disabled={isGenerating || connectionStatus?.connected}
            className="w-full"
            variant={connectionStatus?.connected ? "outline" : "default"}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Gerando QR Code...
              </>
            ) : connectionStatus?.connected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Conectado
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Gerar QR Code
              </>
            )}
          </Button>

          {/* Provider Instructions */}
          {!connectionStatus?.connected && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="font-medium">Como conectar:</div>
              {getProviderInstructions(bot.whatsappProvider || 'evolution_api').steps.map((step, index) => (
                <div key={index} className="flex items-start gap-1">
                  <span className="font-medium text-primary">{index + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Provider Badge */}
        <div className="flex justify-center">
          <Badge variant="secondary" className="text-xs">
            {getProviderName(bot.whatsappProvider || 'meta_business')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}