import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, BarChart3 } from "lucide-react";

interface LandingProps {
  onShowLogin: () => void;
  onShowSignup: () => void;
}

export default function Landing({ onShowLogin, onShowSignup }: LandingProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">EsferaZap</span>
                <span className="text-xs text-slate-500 ml-2">by insightEsfera</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onShowLogin}
                className="text-slate-600 hover:text-slate-900"
              >
                Entrar
              </Button>
              <Button onClick={onShowSignup}>
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Chatbots WhatsApp com{" "}
            <span className="text-primary">Inteligência Artificial</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Automatize conversas, qualifique leads e escale seu atendimento no WhatsApp 
            com nossa plataforma multi-tenant orientada a dados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onShowSignup}>
              Criar Conta Gratuita
            </Button>
            <Button size="lg" variant="outline">
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">IA Avançada</h3>
            <p className="text-slate-600">
              Powered by OpenAI e Gemini para conversas naturais e respostas inteligentes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">WhatsApp Nativo</h3>
            <p className="text-slate-600">
              Conexão direta via Baileys, sem dependências de APIs terceiras.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics Avançado</h3>
            <p className="text-slate-600">
              Métricas detalhadas para otimizar performance dos seus bots.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
