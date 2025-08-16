import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Target, DollarSign, Users, TrendingUp, Filter } from "lucide-react";

interface LeadPackage {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  quality: 'premium' | 'standard' | 'basic';
  features: string[];
}

export default function CompraLeads() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');

  const leadPackages: LeadPackage[] = [
    {
      id: '1',
      name: 'Leads Premium Imóveis',
      description: 'Leads qualificados interessados em compra de imóveis com orçamento definido',
      quantity: 100,
      price: 299.90,
      category: 'imoveis',
      quality: 'premium',
      features: ['Verificados por telefone', 'Orçamento validado', 'Intenção de compra confirmada', 'Dados completos']
    },
    {
      id: '2',
      name: 'Leads Educação Online',
      description: 'Interessados em cursos online e capacitação profissional',
      quantity: 200,
      price: 199.90,
      category: 'educacao',
      quality: 'standard',
      features: ['Email verificado', 'Interesse em categoria específica', 'Perfil profissional', 'WhatsApp válido']
    },
    {
      id: '3',
      name: 'Leads Saúde e Bem-estar',
      description: 'Pessoas interessadas em produtos e serviços de saúde',
      quantity: 150,
      price: 249.90,
      category: 'saude',
      quality: 'premium',
      features: ['Perfil demográfico completo', 'Histórico de compras', 'Interesse específico', 'Contato direto']
    },
    {
      id: '4',
      name: 'Leads Tecnologia B2B',
      description: 'Decisores em empresas interessados em soluções tecnológicas',
      quantity: 50,
      price: 499.90,
      category: 'tecnologia',
      quality: 'premium',
      features: ['Cargo de decisão confirmado', 'Empresa validada', 'Necessidade identificada', 'LinkedIn conectado']
    },
    {
      id: '5',
      name: 'Leads Varejo e E-commerce',
      description: 'Consumidores ativos em compras online',
      quantity: 300,
      price: 149.90,
      category: 'varejo',
      quality: 'standard',
      features: ['Histórico de compras online', 'Faixa etária específica', 'Região definida', 'Interesses categorizados']
    },
    {
      id: '6',
      name: 'Leads Serviços Financeiros',
      description: 'Interessados em investimentos, empréstimos e serviços bancários',
      quantity: 80,
      price: 399.90,
      category: 'financeiro',
      quality: 'premium',
      features: ['Renda comprovada', 'Score de crédito', 'Perfil de investidor', 'Documento validado']
    }
  ];

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

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">Premium</Badge>;
      case 'standard':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Standard</Badge>;
      case 'basic':
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Básico</Badge>;
      default:
        return <Badge>{quality}</Badge>;
    }
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'imoveis': 'Imóveis',
      'educacao': 'Educação',
      'saude': 'Saúde',
      'tecnologia': 'Tecnologia',
      'varejo': 'Varejo',
      'financeiro': 'Financeiro'
    };
    return categories[category] || category;
  };

  const filteredPackages = leadPackages.filter(pkg => {
    if (selectedCategory && pkg.category !== selectedCategory) return false;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (pkg.price < min || pkg.price > max)) return false;
      if (!max && pkg.price < min) return false;
    }
    return true;
  });

  const handlePurchase = (pkg: LeadPackage) => {
    toast({
      title: "Compra Iniciada",
      description: `Processando compra de ${pkg.quantity} leads - ${pkg.name}`,
    });
    // Implementar lógica de compra
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Compra de Leads"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Leads Disponíveis</p>
                      <p className="text-2xl font-bold text-gray-900">12.450</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                      <p className="text-2xl font-bold text-gray-900">8.7%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Custo Médio/Lead</p>
                      <p className="text-2xl font-bold text-gray-900">R$ 2,89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">ROI Médio</p>
                      <p className="text-2xl font-bold text-gray-900">340%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros de Busca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        <SelectItem value="imoveis">Imóveis</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="financeiro">Financeiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Faixa de Preço</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer valor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Qualquer valor</SelectItem>
                        <SelectItem value="0-200">Até R$ 200</SelectItem>
                        <SelectItem value="200-400">R$ 200 - R$ 400</SelectItem>
                        <SelectItem value="400-600">R$ 400 - R$ 600</SelectItem>
                        <SelectItem value="600">Acima de R$ 600</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory('');
                        setPriceRange('');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1">{pkg.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">{getCategoryName(pkg.category)}</p>
                      </div>
                      {getQualityBadge(pkg.quality)}
                    </div>
                    <p className="text-sm text-gray-700">{pkg.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Quantidade</span>
                        <span className="font-semibold">{pkg.quantity} leads</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">Preço</span>
                        <span className="text-xl font-bold text-green-600">R$ {pkg.price.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 text-center">
                        R$ {(pkg.price / pkg.quantity).toFixed(2)} por lead
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Inclui:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handlePurchase(pkg)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar Leads
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPackages.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pacote encontrado</h3>
                  <p className="text-gray-600 mb-6">
                    Ajuste os filtros para encontrar pacotes de leads que atendam suas necessidades
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('');
                      setPriceRange('');
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}