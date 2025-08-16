import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Users, BarChart3, MessageCircle, Zap } from "lucide-react";

export default function Login() {
  const handleReplotAuth = () => {
    window.location.href = "/api/auth/replit";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EsferaZap</h1>
            <p className="text-sm text-gray-500">by InsightEsfera</p>
          </div>
        </div>
        <Link href="/register">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            Criar Conta
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-12 py-16">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Automatize seu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                WhatsApp Business
              </span>
              <br />
              com IA Avançada
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Conecte, automatize e analise suas conversas no WhatsApp com chatbots
              inteligentes e analytics em tempo real.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Chatbots inteligentes com IA</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Analytics e métricas em tempo real</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Gestão completa de contatos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700">Integração com Google Calendar</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto">
                  Começar Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold w-full sm:w-auto"
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-96 flex items-center justify-center p-8">
          <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Fazer Login
              </CardTitle>
              <CardDescription className="text-gray-600">
                Entre na sua conta para continuar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Button
                onClick={handleReplotAuth}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              >
                Entrar com Replit
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Ou</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Criar conta grátis
                  </Link>
                </p>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Ao continuar, você concorda com nossos{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Política de Privacidade
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}