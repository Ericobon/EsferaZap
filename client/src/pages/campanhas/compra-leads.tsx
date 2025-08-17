import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Star,
  Filter,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";

export default function CompraLeads() {
  const leadPackages = [
    {
      name: "Starter",
      price: "R$ 297",
      leads: "50 leads",
      quality: "Básica",
      segmentation: "Simples",
      guarantee: "15 dias",
      features: [
        "50 leads qualificados",
        "Segmentação básica",
        "Suporte por email",
        "Garantia de 15 dias"
      ]
    },
    {
      name: "Professional",
      price: "R$ 497",
      leads: "100 leads",
      quality: "Premium",
      segmentation: "Avançada",
      guarantee: "30 dias",
      features: [
        "100 leads premium",
        "Segmentação avançada",
        "Suporte prioritário",
        "Garantia de 30 dias",
        "Relatórios detalhados"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 897",
      leads: "200 leads",
      quality: "Ultra Premium",
      segmentation: "Personalizada",
      guarantee: "45 dias",
      features: [
        "200 leads ultra premium",
        "Segmentação personalizada",
        "Suporte 24/7",
        "Garantia de 45 dias",
        "Análises avançadas",
        "Consultoria incluída"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-blue-600" />
            Compra de Leads
          </h1>
          <p className="text-gray-600 mt-1">
            Leads qualificados e segmentados prontos para conversão
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          Resultados Imediatos
        </Badge>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Leads Comprados</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa Conversão</p>
                <p className="text-2xl font-bold text-gray-900">24.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI Médio</p>
                <p className="text-2xl font-bold text-gray-900">340%</p>
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
                <p className="text-sm text-gray-600">Entrega</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leadPackages.map((pkg, index) => (
          <Card key={index} className={`relative ${pkg.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">{pkg.price}</div>
                <div className="text-sm text-gray-600">{pkg.leads}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Qualidade:</span>
                  <div className="font-medium">{pkg.quality}</div>
                </div>
                <div>
                  <span className="text-gray-600">Segmentação:</span>
                  <div className="font-medium">{pkg.segmentation}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                variant={pkg.popular ? "default" : "outline"}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Comprar Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quality Assurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Garantia de Qualidade</CardTitle>
            </div>
            <CardDescription>
              Todos os nossos leads passam por rigoroso processo de qualificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Verificação de dados em tempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Filtros de interesse confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Garantia de reposição</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Segmentação Avançada</CardTitle>
            </div>
            <CardDescription>
              Leads filtrados por critérios específicos do seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Localização geográfica</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Faixa etária e perfil</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Interesse no produto/serviço</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Precisa de leads personalizados?
              </h3>
              <p className="text-blue-700">
                Nossa equipe pode criar pacotes customizados para suas necessidades específicas.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}