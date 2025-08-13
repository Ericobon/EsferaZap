import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ArrowRight, CheckCircle } from "lucide-react";

interface CrossPlatformAuthProps {
  onIntegrationComplete?: () => void;
}

export default function CrossPlatformAuth({ onIntegrationComplete }: CrossPlatformAuthProps) {
  const { user } = useAuth();
  const [integrationStatus, setIntegrationStatus] = useState<'checking' | 'available' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check if user came from InsightEsfera website
    const urlParams = new URLSearchParams(window.location.search);
    const fromInsight = urlParams.get('from') === 'insightesfera';
    const authToken = urlParams.get('token');

    if (fromInsight && authToken) {
      // User was redirected from InsightEsfera with authentication token
      handleInsightEsferaAuth(authToken);
    } else if (user) {
      setIntegrationStatus('connected');
    } else {
      setIntegrationStatus('available');
    }
  }, [user]);

  const handleInsightEsferaAuth = async (token: string) => {
    try {
      // In a real implementation, you would verify the token with your backend
      // and sign the user in automatically
      console.log('Processing InsightEsfera authentication token:', token);
      setIntegrationStatus('connected');
      onIntegrationComplete?.();
    } catch (error) {
      console.error('InsightEsfera integration error:', error);
      setIntegrationStatus('error');
    }
  };

  const handleRedirectToInsightEsfera = () => {
    // Redirect to InsightEsfera with current URL as return parameter
    const returnUrl = encodeURIComponent(window.location.origin + '?from=insightesfera');
    window.location.href = `https://www.insightesfera.io?return_to=${returnUrl}&service=esferazap`;
  };

  if (integrationStatus === 'checking') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (integrationStatus === 'connected') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Conectado ao ecossistema InsightEsfera</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-teal-600" />
          <span>Integração com InsightEsfera</span>
        </CardTitle>
        <CardDescription>
          Conecte-se ao ecossistema completo de soluções de dados da InsightEsfera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-2">Benefícios da integração:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Login único entre todas as plataformas</li>
            <li>Dados sincronizados com BI e automações</li>
            <li>Acesso a toda suíte InsightEsfera</li>
          </ul>
        </div>
        
        <Button 
          onClick={handleRedirectToInsightEsfera}
          className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
        >
          Conectar com InsightEsfera
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <div className="text-xs text-center text-gray-500">
          Você será redirecionado para o site principal da InsightEsfera para autenticação segura
        </div>
      </CardContent>
    </Card>
  );
}