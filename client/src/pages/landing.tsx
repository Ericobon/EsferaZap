import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, BarChart3, Zap, Globe, Brain, ArrowRight } from "lucide-react";
import CrossPlatformAuth from "@/components/integration/CrossPlatformAuth";
import { EsferaZapLogo } from "@/components/ui/EsferaZapLogo";

interface LandingProps {
  onShowLogin: () => void;
  onShowSignup: () => void;
}

export default function Landing({ onShowLogin, onShowSignup }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* EsferaZap Logo - WhatsApp + InsightEsfera */}
              <EsferaZapLogo size={48} animated={true} />
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold insight-text-gradient">EsferaZap</span>
                  <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                    AI WhatsApp
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  by <span className="font-semibold text-primary">InsightEsfera</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => window.open('https://www.insightesfera.io', '_blank')}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                InsightEsfera
              </Button>
              <Button
                variant="ghost"
                onClick={onShowLogin}
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Entrar
              </Button>
              <Button onClick={onShowSignup} className="insight-shadow">
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Powered by InsightEsfera AI Technology
            </span>
          </div>
          
          {/* Grande logo central */}
          <div className="flex justify-center mb-12">
            <EsferaZapLogo size={120} animated={true} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-foreground">Chatbots WhatsApp</span>
            <br />
            <span className="insight-text-gradient">com IA Avançada</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Automatize conversas, capture leads e transforme atendimento em vendas com 
            <span className="text-green-600 font-semibold"> tecnologia WhatsApp </span>
            integrada ao ecossistema 
            <span className="text-primary font-semibold"> InsightEsfera</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Button
              size="lg"
              onClick={onShowSignup}
              className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Criar Bot Grátis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onShowLogin}
              className="text-lg px-8 py-4 border-2 hover:bg-accent transition-colors"
            >
              Fazer Login
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-muted-foreground">Atendimento</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-muted-foreground">Mais Conversões</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">2.1B</div>
              <div className="text-muted-foreground">Usuários WhatsApp</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 insight-shadow hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">WhatsApp Nativo</h3>
            <p className="text-muted-foreground">
              Conexão direta com WhatsApp Business API. QR Code simples e conexão instantânea.
            </p>
          </div>
          
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 insight-shadow hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">IA Personalizada</h3>
            <p className="text-muted-foreground">
              Chatbots inteligentes com GPT-4 e Gemini. Respostas humanizadas e contextual.
            </p>
          </div>
          
          <div className="text-center p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 insight-shadow hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-6 bg-secondary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Analytics Avançado</h3>
            <p className="text-muted-foreground">
              Dashboard completo com métricas de conversão, engajamento e ROI em tempo real.
            </p>
          </div>
        </div>

        {/* Integration Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Integração com Ecossistema 
            <span className="insight-text-gradient"> InsightEsfera</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Use a mesma conta do InsightEsfera. Dados sincronizados, insights integrados e gestão unificada.
          </p>
          <CrossPlatformAuth />
        </div>
      </main>
    </div>
  );
}
