import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  TrendingUp, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Lightbulb,
  Search,
  Share2
} from "lucide-react";

export default function LeadsOrganicos() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sprout className="h-7 w-7 text-green-600" />
            Leads Orgânicos
          </h1>
          <p className="text-gray-600 mt-1">
            Estratégias para gerar leads qualificados de forma natural e sustentável
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          Crescimento Sustentável
        </Badge>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Leads Este Mês</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-gray-900">18.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Custo por Lead</p>
                <p className="text-2xl font-bold text-gray-900">R$ 0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-gray-900">2.3 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">SEO e Conteúdo</CardTitle>
            </div>
            <CardDescription>
              Otimização para mecanismos de busca e marketing de conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Blog posts otimizados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Palavras-chave estratégicas</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Landing pages personalizadas</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Lightbulb className="mr-2 h-4 w-4" />
              Configurar SEO
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Redes Sociais</CardTitle>
            </div>
            <CardDescription>
              Presença orgânica em plataformas sociais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Conteúdo Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Stories e Reels</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Engajamento LinkedIn</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Agendar Posts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Section */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Pronto para acelerar seus leads orgânicos?
              </h3>
              <p className="text-green-700">
                Nossa equipe pode ajudar você a implementar estratégias comprovadas para gerar mais leads qualificados.
              </p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Falar com Especialista
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Em Breve Section */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-800 mb-2">
            Ferramentas Avançadas em Desenvolvimento
          </h3>
          <p className="text-orange-700 mb-4">
            Estamos desenvolvendo ferramentas automáticas de SEO, análise de concorrência e otimização de conteúdo.
          </p>
          <Badge className="bg-orange-200 text-orange-800">
            Em Breve
          </Badge>
        </CardContent>
      </Card>
        </div>
      </main>
    </div>
  );
}