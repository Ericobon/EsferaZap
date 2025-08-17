import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Users, BarChart3, MessageCircle, Zap, Play } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function HomeContent() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false
  });
  const { t, language } = useLanguage();

  const isAuthenticated = !!user && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EsferaZap
                </div>
                <div className="text-xs text-blue-800 font-medium">by InsightEsfera</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(user as any)?.fullName?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost">{language === 'en' ? 'Login' : 'Login'}</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      {language === 'en' ? 'Start Free' : 'Começar Grátis'}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
              {language === 'en' ? 'Automate your' : 'Automatize seu'}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WhatsApp Business
              </span>{" "}
              {language === 'en' ? 'with AI' : 'com IA'}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'en' 
                ? 'Create intelligent chatbots for WhatsApp, automate customer service and increase your sales with the most complete platform on the market. Includes qualified lead generation and purchase services.'
                : 'Crie chatbots inteligentes para WhatsApp, automatize atendimentos e aumente suas vendas com a plataforma mais completa do mercado. Inclui serviços de geração e compra de leads qualificados.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Ir para Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg">
                      <Play className="mr-2 h-5 w-5" />
                      {language === 'en' ? 'Start Free' : 'Começar Grátis'}
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-300 hover:bg-gray-50">
                      Fazer Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 pt-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>100% Grátis para começar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Configuração em 5 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a EsferaZap?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo o que você precisa para automatizar e escalar seu atendimento no WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Chatbots Inteligentes</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure bots com IA avançada para responder automaticamente suas mensagens
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics Completo</CardTitle>
                <CardDescription className="text-gray-600">
                  Acompanhe métricas detalhadas e melhore continuamente seu atendimento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Gestão de Contatos</CardTitle>
                <CardDescription className="text-gray-600">
                  Organize seus contatos e acompanhe todo histórico de conversas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Integração Rápida</CardTitle>
                <CardDescription className="text-gray-600">
                  Conecte seu WhatsApp Business em poucos cliques
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Campanhas Personalizadas</CardTitle>
                <CardDescription className="text-gray-600">
                  Envie campanhas segmentadas e personalizadas para seus contatos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Relatórios Avançados</CardTitle>
                <CardDescription className="text-gray-600">
                  Insights detalhados para otimizar sua estratégia de comunicação
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seu atendimento?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já automatizaram seu WhatsApp Business com nossa plataforma
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-14 px-8 bg-white text-blue-600 hover:bg-gray-100 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Começar Grátis Agora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-white border-white hover:bg-white hover:text-blue-600 text-lg">
                  Fazer Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section with Lead Generation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Serviços de Geração de Leads
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Além dos chatbots, oferecemos serviços completos de aquisição e geração de leads qualificados
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Leads Orgânicos</CardTitle>
                <CardDescription className="text-gray-600">
                  Estratégias de geração orgânica de leads através de conteúdo e SEO especializado
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Compra de Leads</CardTitle>
                <CardDescription className="text-gray-600">
                  Leads qualificados e segmentados prontos para conversão com garantia de qualidade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-gray-300">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EsferaZap
              </span>
            </div>
            <p className="text-gray-400 mb-8">
              © 2025 InsightEsfera. Todos os direitos reservados. Plataforma completa de automatização WhatsApp com IA e geração de leads.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  // Don't wrap in LanguageProvider here since it's already wrapped in App.tsx
  return <HomeContent />;
}