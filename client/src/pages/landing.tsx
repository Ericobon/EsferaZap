import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, BarChart3, Zap, Globe, Brain, ArrowRight } from "lucide-react";
import CrossPlatformAuth from "@/components/integration/CrossPlatformAuth";

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
              {/* InsightEsfera Logo - Animated Sphere */}
              <div className="relative">
                <div className="w-10 h-10 insight-sphere-logo rounded-full flex items-center justify-center shadow-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Zap className="w-4 h-4 text-secondary" />
                </div>
              </div>
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
          
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="text-foreground">Transforme Dados em</span>
            <br />
            <span className="insight-text-gradient">Conversas Inteligentes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
            Plataforma SaaS multi-tenant que combina{" "}
            <span className="font-semibold text-primary">WhatsApp + IA + Análise de Dados</span>{" "}
            para automatizar atendimento, qualificar leads e gerar insights estratégicos.
          </p>

          {/* Integration Card */}
          <div className="max-w-md mx-auto mb-12">
            <CrossPlatformAuth />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={onShowSignup}
              className="insight-gradient text-white hover:opacity-90 transition-opacity insight-shadow-lg text-lg px-8 py-4"
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Agora Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 text-lg px-8 py-4"
            >
              <Globe className="w-5 h-5 mr-2" />
              Ver Demo Interativa
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">73%</div>
              <div className="text-sm text-muted-foreground">Redução no tempo de resposta</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">+250%</div>
              <div className="text-sm text-muted-foreground">Aumento na qualificação de leads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Atendimento automatizado</div>
            </div>
          </div>
        </div>

        {/* Features Grid - InsightEsfera Style */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-card/50 backdrop-blur-sm p-8 rounded-2xl insight-shadow border border-border/50 hover:insight-shadow-lg transition-all duration-300">
            <div className="w-16 h-16 insight-gradient rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">IA Multi-Provider</h3>
            <p className="text-muted-foreground leading-relaxed">
              Integração com <span className="font-semibold text-primary">OpenAI GPT</span> e{" "}
              <span className="font-semibold text-primary">Google Gemini</span> para conversas 
              naturais e respostas contextuais inteligentes.
            </p>
          </div>

          <div className="group bg-card/50 backdrop-blur-sm p-8 rounded-2xl insight-shadow border border-border/50 hover:insight-shadow-lg transition-all duration-300">
            <div className="w-16 h-16 insight-gradient-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">WhatsApp Nativo</h3>
            <p className="text-muted-foreground leading-relaxed">
              Conexão direta via <span className="font-semibold text-primary">Baileys Protocol</span>,
              sem dependências de APIs terceiras. QR Code automático e gestão de sessões.
            </p>
          </div>

          <div className="group bg-card/50 backdrop-blur-sm p-8 rounded-2xl insight-shadow border border-border/50 hover:insight-shadow-lg transition-all duration-300">
            <div className="w-16 h-16 insight-gradient rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-4">Data Intelligence</h3>
            <p className="text-muted-foreground leading-relaxed">
              Analytics avançado com <span className="font-semibold text-primary">PostgreSQL + Drizzle ORM</span>.
              Dashboards em tempo real para otimizar performance e ROI dos bots.
            </p>
          </div>
        </div>

        {/* InsightEsfera Ecosystem Integration */}
        <div className="mt-24 text-center">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12 mb-8">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-foreground">Parte do</span>{" "}
              <span className="insight-text-gradient">InsightEsfera Ecosystem</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              EsferaZap se integra perfeitamente com todas as soluções de{" "}
              <span className="font-semibold text-primary">Data Engineering</span>,{" "}
              <span className="font-semibold text-primary">Business Intelligence</span> e{" "}
              <span className="font-semibold text-primary">AI Automation</span> da InsightEsfera.
            </p>
            
            {/* Integration logos/badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["Firebase Auth", "PostgreSQL", "OpenAI", "Google Gemini", "Drizzle ORM", "React Query"].map((tech) => (
                <div key={tech} className="px-4 py-2 bg-background/80 border border-border rounded-full text-sm font-medium text-muted-foreground">
                  {tech}
                </div>
              ))}
            </div>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Globe className="w-5 h-5 mr-2" />
              Explorar Ecossistema Completo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
