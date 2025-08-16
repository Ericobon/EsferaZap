import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Smartphone,
  Settings
} from 'lucide-react';

const SAMPLE_QR_CODE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

interface QRDemoProps {
  botId?: string;
}

export function QRDemo({ botId }: QRDemoProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('evolution_api');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    serverUrl: 'https://evolution-api.com',
    apiKey: '',
    instanceId: 'minha-instancia'
  });
  const { toast } = useToast();

  const providers = {
    // APIs Oficiais (Pagas)
    meta_business: { name: 'Meta Business API', tier: 'official_paid', cost: 'Paga' },
    twilio: { name: 'Twilio WhatsApp', tier: 'official_paid', cost: 'Paga' },
    evolution_api: { name: 'Evolution API', tier: 'official_paid', cost: 'Paga' },
    
    // APIs Gratuitas (Pessoais)
    baileys: { name: 'Baileys (Open Source)', tier: 'free_personal', cost: 'Gratuita' },
    wppconnect: { name: 'WPPConnect', tier: 'free_personal', cost: 'Gratuita' },
    venom: { name: 'Venom Bot', tier: 'free_personal', cost: 'Gratuita' }
  };

  const generateDemoQR = async () => {
    setIsGenerating(true);
    
    // Simular chamada à API
    setTimeout(() => {
      setQrCode(`data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="60" y="20" width="20" height="20" fill="black"/>
          <rect x="100" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <rect x="20" y="60" width="20" height="20" fill="black"/>
          <rect x="100" y="60" width="20" height="20" fill="black"/>
          <rect x="180" y="60" width="20" height="20" fill="black"/>
          <rect x="20" y="100" width="20" height="20" fill="black"/>
          <rect x="60" y="100" width="20" height="20" fill="black"/>
          <rect x="140" y="100" width="20" height="20" fill="black"/>
          <rect x="180" y="100" width="20" height="20" fill="black"/>
          <rect x="20" y="140" width="20" height="20" fill="black"/>
          <rect x="100" y="140" width="20" height="20" fill="black"/>
          <rect x="140" y="140" width="20" height="20" fill="black"/>
          <rect x="60" y="180" width="20" height="20" fill="black"/>
          <rect x="100" y="180" width="20" height="20" fill="black"/>
          <rect x="180" y="180" width="20" height="20" fill="black"/>
          <text x="100" y="210" text-anchor="middle" font-family="Arial" font-size="12" fill="gray">QR Code Demo</text>
        </svg>
      `)}`);
      setIsGenerating(false);
      
      toast({
        title: "QR Code Gerado!",
        description: `QR Code demo para ${providers[selectedProvider as keyof typeof providers].name}`,
      });
    }, 1500);
  };

  const simulateConnection = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "Desconectado" : "Conectado!",
      description: isConnected ? 
        "WhatsApp desconectado do sistema" : 
        `WhatsApp conectado via ${providers[selectedProvider as keyof typeof providers].name}`,
      variant: isConnected ? "destructive" : "default",
    });
  };

  const getProviderInstructions = () => {
    const instructions: Record<string, string[]> = {
      meta_business: [
        "Configure sua aplicação no Meta Business Manager",
        "Autorize as permissões necessárias",
        "Conecte sua conta WhatsApp Business"
      ],
      twilio: [
        "Acesse seu painel Twilio",
        "Configure o WhatsApp Sandbox",
        "Envie a mensagem de confirmação"
      ],
      evolution_api: [
        "Abra o WhatsApp no celular",
        "Vá em Configurações > Aparelhos conectados",
        "Escaneie o QR Code"
      ],
      baileys: [
        "Abra o WhatsApp no celular",
        "Toque em Mais opções > Aparelhos conectados",
        "Escaneie o QR Code"
      ],
      wppconnect: [
        "Execute o servidor WPPConnect",
        "Abra o WhatsApp no celular", 
        "Escaneie o QR Code"
      ],
      venom: [
        "Inicie o Venom Bot",
        "Abra o WhatsApp no celular",
        "Escaneie o QR Code gerado"
      ]
    };
    return instructions[selectedProvider] || instructions.evolution_api;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração do Provedor WhatsApp
          </CardTitle>
          <CardDescription>
            Escolha e configure seu provedor de WhatsApp API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="provider">Provedor</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2 text-xs font-semibold text-gray-600 border-b">APIs Oficiais (Pagas)</div>
                {Object.entries(providers)
                  .filter(([_, provider]) => provider.tier === 'official_paid')
                  .map(([key, provider]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <span>{provider.name}</span>
                        <Badge variant="default" className="ml-2 text-xs">Paga</Badge>
                      </div>
                    </SelectItem>
                  ))}
                
                <div className="p-2 text-xs font-semibold text-gray-600 border-b border-t mt-1">APIs Gratuitas (Pessoais)</div>
                {Object.entries(providers)
                  .filter(([_, provider]) => provider.tier === 'free_personal')
                  .map(([key, provider]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center justify-between w-full">
                        <span>{provider.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">Gratuita</Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProvider !== 'meta_business' && selectedProvider !== 'twilio' && (
            <Button
              variant="outline"
              onClick={() => setShowConfig(!showConfig)}
              className="w-full"
            >
              {showConfig ? 'Ocultar' : 'Mostrar'} Configurações Avançadas
            </Button>
          )}

          {showConfig && (
            <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
              <div>
                <Label htmlFor="serverUrl">URL do Servidor</Label>
                <Input
                  id="serverUrl"
                  value={config.serverUrl}
                  onChange={(e) => setConfig({...config, serverUrl: e.target.value})}
                  placeholder="https://sua-api.com"
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={config.apiKey}
                  onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                  placeholder="Sua chave da API"
                />
              </div>
              <div>
                <Label htmlFor="instanceId">Instance ID</Label>
                <Input
                  id="instanceId"
                  value={config.instanceId}
                  onChange={(e) => setConfig({...config, instanceId: e.target.value})}
                  placeholder="nome-da-instancia"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Generator */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center">
            <QrCode className="h-5 w-5" />
            Conexão WhatsApp
          </CardTitle>
          <CardDescription>
            {providers[selectedProvider as keyof typeof providers].name}
            <Badge 
              variant={providers[selectedProvider as keyof typeof providers].tier === 'free_personal' ? "secondary" : "default"}
              className="ml-2"
            >
              {providers[selectedProvider as keyof typeof providers].cost}
            </Badge>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={simulateConnection}
            >
              {isConnected ? 'Desconectar' : 'Simular Conexão'}
            </Button>
          </div>

          {/* QR Code Display */}
          {qrCode && !isConnected && (
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <img 
                  src={qrCode} 
                  alt="QR Code para conexão WhatsApp"
                  className="mx-auto max-w-full h-auto"
                  style={{ maxWidth: '200px' }}
                />
              </div>

              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  Escaneie o QR Code com seu WhatsApp para conectar
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Generate QR Code Button */}
          <div className="space-y-2">
            <Button
              onClick={generateDemoQR}
              disabled={isGenerating || isConnected}
              className="w-full"
              variant={isConnected ? "outline" : "default"}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando QR Code...
                </>
              ) : isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  WhatsApp Conectado
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Gerar QR Code Demo
                </>
              )}
            </Button>

            {/* Instructions */}
            {!isConnected && (
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-700">Como conectar:</div>
                {getProviderInstructions().map((step, index) => (
                  <div key={index} className="flex items-start gap-1">
                    <span className="font-medium text-blue-600">{index + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Provider Badge */}
          <div className="flex justify-center gap-2">
            <Badge 
              variant={providers[selectedProvider as keyof typeof providers].tier === 'free_personal' ? "secondary" : "default"}
              className="text-xs"
            >
              {providers[selectedProvider as keyof typeof providers].name}
            </Badge>
            <Badge 
              variant={providers[selectedProvider as keyof typeof providers].tier === 'free_personal' ? "outline" : "destructive"}
              className="text-xs"
            >
              {providers[selectedProvider as keyof typeof providers].cost}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}