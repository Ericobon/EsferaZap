import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Users, Target } from "lucide-react";
import { Link } from "wouter";

export default function Geolocalizacao() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-bolt text-white text-2xl animate-pulse"></i>
          </div>
          <div className="text-xl font-semibold text-gray-900">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Geolocalização"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Hero Section */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Campanhas por Geolocalização
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Encontre e segmente leads usando localização geográfica e classificação por CNAEs para campanhas precisas e eficazes.
                </p>
              </CardContent>
            </Card>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Leads por Geolocalização */}
              <Card className="border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Navigation className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Leads por Geolocalização</h3>
                      <p className="text-sm text-gray-600 font-normal">
                        Google Maps Integration
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Encontre leads próximos a localizações específicas usando a API oficial do Google Maps. 
                    Defina raios de busca e identifique oportunidades baseadas em proximidade geográfica.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Funcionalidades:</span>
                      </div>
                      <ul className="text-gray-600 space-y-1 ml-6">
                        <li>• Busca por endereço</li>
                        <li>• Raio personalizável</li>
                        <li>• Visualização no mapa</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Vantagens:</span>
                      </div>
                      <ul className="text-gray-600 space-y-1 ml-6">
                        <li>• Precisão geográfica</li>
                        <li>• Segmentação local</li>
                        <li>• ROI otimizado</li>
                      </ul>
                    </div>
                  </div>

                  <Link href="/campanhas/leads-geolocalizacao">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      <Navigation className="h-4 w-4 mr-2" />
                      Acessar Geolocalização
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* CNAEs por Segmento */}
              <Card className="border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">CNAEs por Segmento</h3>
                      <p className="text-sm text-gray-600 font-normal">
                        Classificação Nacional de Atividades
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Segmente leads por atividade econômica usando códigos CNAE. Identifique empresas 
                    específicas por setor, porte e região para campanhas B2B altamente direcionadas.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Segmentação:</span>
                      </div>
                      <ul className="text-gray-600 space-y-1 ml-6">
                        <li>• Por código CNAE</li>
                        <li>• Por setor econômico</li>
                        <li>• Por porte da empresa</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">Precisão:</span>
                      </div>
                      <ul className="text-gray-600 space-y-1 ml-6">
                        <li>• 2.847 CNAEs mapeados</li>
                        <li>• 63.770 empresas ativas</li>
                        <li>• Taxa média 17.6%</li>
                      </ul>
                    </div>
                  </div>

                  <Link href="/campanhas/cnaes-segmento">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      <Users className="h-4 w-4 mr-2" />
                      Acessar CNAEs
                    </Button>
                  </Link>
                </CardContent>
              </Card>

            </div>

            {/* Stats Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Consolidadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">15.420</div>
                      <div className="text-sm text-gray-600">Localizações Mapeadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">2.847</div>
                      <div className="text-sm text-gray-600">CNAEs Disponíveis</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">63.770</div>
                      <div className="text-sm text-gray-600">Empresas Ativas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">52.100</div>
                      <div className="text-sm text-gray-600">Leads Potenciais</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}