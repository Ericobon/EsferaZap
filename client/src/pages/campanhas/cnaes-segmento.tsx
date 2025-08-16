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
import { Building, Search, Target, TrendingUp, Users, Filter } from "lucide-react";

interface CNAESegment {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  estimatedCompanies: number;
  averageEmployees: string;
  potentialLeads: number;
  conversionRate: number;
  examples: string[];
}

export default function CNAEsSegmento() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  const cnaeSegments: CNAESegment[] = [
    {
      id: '1',
      code: '4711-3/02',
      name: 'Comércio varejista de mercadorias em geral - supermercados',
      description: 'Estabelecimentos que vendem ampla variedade de produtos alimentícios e não alimentícios',
      category: 'varejo',
      estimatedCompanies: 15420,
      averageEmployees: '20-100',
      potentialLeads: 8500,
      conversionRate: 12.5,
      examples: ['Extra', 'Carrefour', 'Pão de Açúcar', 'Atacadão']
    },
    {
      id: '2',
      code: '8211-3/00',
      name: 'Serviços combinados de escritório e apoio administrativo',
      description: 'Atividades de apoio administrativo e serviços terceirizados para empresas',
      category: 'servicos',
      estimatedCompanies: 8930,
      averageEmployees: '10-50',
      potentialLeads: 6200,
      conversionRate: 18.7,
      examples: ['Regus', 'WeWork', 'Spaces', 'IWG']
    },
    {
      id: '3',
      code: '6201-5/00',
      name: 'Desenvolvimento de programas de computador sob encomenda',
      description: 'Desenvolvimento de software personalizado e soluções tecnológicas',
      category: 'tecnologia',
      estimatedCompanies: 12680,
      averageEmployees: '5-30',
      potentialLeads: 9400,
      conversionRate: 22.1,
      examples: ['Thoughtworks', 'CI&T', 'Accenture', 'IBM']
    },
    {
      id: '4',
      code: '8630-5/02',
      name: 'Atividades de profissionais especializados na área de saúde',
      description: 'Consultórios médicos, clínicas especializadas e centros de diagnóstico',
      category: 'saude',
      estimatedCompanies: 18750,
      averageEmployees: '3-15',
      potentialLeads: 11200,
      conversionRate: 15.3,
      examples: ['Fleury', 'Dasa', 'Hapvida', 'SulAmérica']
    },
    {
      id: '5',
      code: '4722-9/01',
      name: 'Comércio varejista de carnes - açougues',
      description: 'Estabelecimentos especializados na venda de carnes frescas e processadas',
      category: 'alimentacao',
      estimatedCompanies: 5840,
      averageEmployees: '2-10',
      potentialLeads: 3500,
      conversionRate: 8.9,
      examples: ['Friboi', 'JBS', 'Marfrig', 'Minerva']
    },
    {
      id: '6',
      code: '8512-1/00',
      name: 'Educação superior - graduação e pós-graduação',
      description: 'Instituições de ensino superior, universidades e centros universitários',
      category: 'educacao',
      estimatedCompanies: 2150,
      averageEmployees: '100-500',
      potentialLeads: 1800,
      conversionRate: 28.4,
      examples: ['USP', 'Unicamp', 'FGV', 'Mackenzie']
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

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'varejo': 'Varejo',
      'servicos': 'Serviços',
      'tecnologia': 'Tecnologia',
      'saude': 'Saúde',
      'alimentacao': 'Alimentação',
      'educacao': 'Educação',
      'industria': 'Indústria',
      'construcao': 'Construção'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'varejo': 'bg-blue-100 text-blue-800 border-blue-200',
      'servicos': 'bg-green-100 text-green-800 border-green-200',
      'tecnologia': 'bg-purple-100 text-purple-800 border-purple-200',
      'saude': 'bg-red-100 text-red-800 border-red-200',
      'alimentacao': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'educacao': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'industria': 'bg-gray-100 text-gray-800 border-gray-200',
      'construcao': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredSegments = cnaeSegments.filter(segment => {
    if (searchTerm && !segment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !segment.code.includes(searchTerm)) return false;
    if (selectedCategory && segment.category !== selectedCategory) return false;
    return true;
  });

  const handleCreateCampaign = (segment: CNAESegment) => {
    toast({
      title: "Campanha CNAE Iniciada",
      description: `Criando campanha para ${segment.code} - ${segment.potentialLeads} leads estimados`,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="CNAEs por Segmento"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">CNAEs Mapeados</p>
                      <p className="text-2xl font-bold text-gray-900">2.847</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Empresas Ativas</p>
                      <p className="text-2xl font-bold text-gray-900">63.770</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Leads Disponíveis</p>
                      <p className="text-2xl font-bold text-gray-900">40.600</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                      <p className="text-2xl font-bold text-gray-900">17.6%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Busca por CNAE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="search">Código CNAE ou Descrição</Label>
                    <Input
                      id="search"
                      placeholder="Ex: 4711-3 ou supermercado"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as categorias</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CNAE Segments */}
            <div className="space-y-4">
              {filteredSegments.map((segment) => (
                <Card key={segment.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                {segment.code}
                              </span>
                              <Badge className={getCategoryColor(segment.category)}>
                                {getCategoryName(segment.category)}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-lg">{segment.name}</h3>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{segment.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Empresas Estimadas:</span>
                            <div className="font-semibold text-blue-600">
                              {segment.estimatedCompanies.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Funcionários Médio:</span>
                            <div className="font-semibold">{segment.averageEmployees}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Leads Potenciais:</span>
                            <div className="font-semibold text-green-600">
                              {segment.potentialLeads.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Taxa Conversão:</span>
                            <div className="font-semibold text-purple-600">{segment.conversionRate}%</div>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Exemplos: </span>
                          <span className="text-sm text-gray-700">
                            {segment.examples.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-6">
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => handleCreateCampaign(segment)}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Criar Campanha
                        </Button>
                        <Button
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredSegments.length === 0 && (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <Building className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum CNAE encontrado</h3>
                  <p className="text-gray-600 mb-6">
                    Ajuste os filtros ou refine a busca para encontrar segmentos específicos
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
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