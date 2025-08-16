import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Zap, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Info,
  Star,
  Crown
} from 'lucide-react';

export function ProviderCategoriesInfo() {
  const officialProviders = [
    {
      name: 'Meta Business API',
      description: 'API oficial do Facebook/Meta para WhatsApp Business',
      features: ['Verificação oficial', 'Suporte comercial', 'Alta disponibilidade', 'Limites altos'],
      pricing: 'Paga por conversa',
      reliability: 'Máxima',
      support: 'Oficial Meta',
      icon: Crown
    },
    {
      name: 'Twilio WhatsApp',
      description: 'Plataforma de comunicação empresarial da Twilio',
      features: ['API robusta', 'Documentação completa', 'Multi-canal', 'Analytics avançado'],
      pricing: 'Modelo de créditos',
      reliability: 'Alta',
      support: 'Suporte Twilio',
      icon: Shield
    },
    {
      name: 'Evolution API',
      description: 'API brasileira para WhatsApp Business com foco em facilidade',
      features: ['Interface amigável', 'Suporte nacional', 'Documentação em português', 'Webhooks'],
      pricing: 'Planos mensais',
      reliability: 'Alta',
      support: 'Suporte brasileiro',
      icon: Zap
    }
  ];

  const freeProviders = [
    {
      name: 'Baileys',
      description: 'Biblioteca TypeScript open-source para WhatsApp Web',
      features: ['Código aberto', 'Flexibilidade total', 'Sem custos', 'Comunidade ativa'],
      limitations: ['Instabilidade ocasional', 'Risco de bloqueio', 'Sem suporte oficial'],
      reliability: 'Moderada',
      support: 'Comunidade',
      icon: Users
    },
    {
      name: 'WPPConnect',
      description: 'Framework JavaScript para automação do WhatsApp',
      features: ['Interface simplificada', 'Gratuito', 'Plugins disponíveis', 'Multi-sessão'],
      limitations: ['Depende do WhatsApp Web', 'Atualizações frequentes necessárias'],
      reliability: 'Moderada',
      support: 'GitHub/Comunidade',
      icon: Users
    },
    {
      name: 'Venom Bot',
      description: 'Bot para WhatsApp baseado em Puppeteer',
      features: ['Fácil de usar', 'Sem custos', 'Recursos avançados', 'TypeScript'],
      limitations: ['Possível instabilidade', 'Dependente de atualizações do WhatsApp'],
      reliability: 'Moderada',
      support: 'Comunidade',
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Provedores WhatsApp: Gratuitos vs Oficiais
        </h2>
        <p className="text-gray-600">
          Entenda as diferenças entre APIs gratuitas e soluções comerciais
        </p>
      </div>

      {/* Comparison Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Dica:</strong> APIs oficiais são recomendadas para uso comercial devido à estabilidade e suporte. 
          APIs gratuitas são ideais para testes e uso pessoal.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Official/Paid Providers */}
        <Card className="border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Crown className="h-5 w-5" />
              APIs Oficiais (Pagas)
            </CardTitle>
            <CardDescription className="text-green-700">
              Soluções comerciais com suporte oficial e alta confiabilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {officialProviders.map((provider) => (
              <div key={provider.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <provider.icon className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-sm">{provider.name}</h4>
                  </div>
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                    Pago
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600">{provider.description}</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Preço: {provider.pricing}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-gray-600">Confiabilidade: {provider.reliability}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">Suporte: {provider.support}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-700">Recursos:</div>
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Free/Personal Providers */}
        <Card className="border-yellow-200">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Users className="h-5 w-5" />
              APIs Gratuitas (Pessoais)
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Soluções open-source para desenvolvimento e uso pessoal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {freeProviders.map((provider) => (
              <div key={provider.name} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <provider.icon className="h-4 w-4 text-yellow-600" />
                    <h4 className="font-semibold text-sm">{provider.name}</h4>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Gratuito
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600">{provider.description}</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-green-500" />
                    <span className="text-gray-600">Preço: Gratuito</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    <span className="text-gray-600">Confiabilidade: {provider.reliability}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-purple-500" />
                    <span className="text-gray-600">Suporte: {provider.support}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">Vantagens:</div>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs text-green-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-700">Limitações:</div>
                    <div className="flex flex-wrap gap-1">
                      {provider.limitations.map((limitation) => (
                        <Badge key={limitation} variant="outline" className="text-xs text-red-700">
                          {limitation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <div className="space-y-2">
            <div className="font-medium text-blue-800">Recomendações de Uso:</div>
            <div className="text-sm text-blue-700 space-y-1">
              <div>• <strong>Para empresas:</strong> Use APIs oficiais (Meta Business, Twilio, Evolution API)</div>
              <div>• <strong>Para testes/desenvolvimento:</strong> APIs gratuitas são adequadas</div>
              <div>• <strong>Para projetos pessoais:</strong> Comece com APIs gratuitas e migre conforme necessário</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}