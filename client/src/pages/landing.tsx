import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-accent-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-white text-lg"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">EsferaZap</div>
                <div className="text-xs text-gray-500">by InsightEsfera</div>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary-dark"
            >
              Entrar
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Automatize seu <span className="text-primary">WhatsApp Business</span><br />
            com IA Avançada
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecte, automatize e analise suas conversas no WhatsApp com chatbots inteligentes 
            e analytics em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary-dark text-lg px-8 py-4"
            >
              <i className="fas fa-rocket mr-2"></i>
              Começar Agora
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary-light"
            >
              <i className="fas fa-play mr-2"></i>
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plataforma SaaS Completa
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para automatizar seu atendimento no WhatsApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-robot text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chatbots IA</h3>
                <p className="text-gray-600">OpenAI & Gemini</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600">Tempo real</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-users text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Tenant</h3>
                <p className="text-gray-600">Gestão de usuários</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cog text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automação</h3>
                <p className="text-gray-600">IA Avançada</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 text-center">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-primary-dark text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para automatizar seu WhatsApp?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Comece agora e transforme seu atendimento com IA
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              >
                Começar Gratuitamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
