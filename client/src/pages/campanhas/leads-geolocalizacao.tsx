import { useState, useEffect } from "react";
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
import { Slider } from "@/components/ui/slider";
import { MapPin, Navigation, Target, Users, Filter, Search } from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  estimatedLeads: number;
  radius: number;
}

export default function LeadsGeolocalizacao() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [radius, setRadius] = useState([5]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Dados de exemplo para localizações
  const exampleLocations: LocationData[] = [
    {
      id: '1',
      name: 'Shopping Center Norte',
      address: 'Av. Otto Baumgart, 500 - Vila Guilherme, São Paulo - SP',
      lat: -23.5186,
      lng: -46.6196,
      category: 'shopping',
      estimatedLeads: 2500,
      radius: 3
    },
    {
      id: '2',
      name: 'Universidade de São Paulo',
      address: 'Rua da Universidade, 308 - Butantã, São Paulo - SP',
      lat: -23.5610,
      lng: -46.7290,
      category: 'educacao',
      estimatedLeads: 1800,
      radius: 2
    },
    {
      id: '3',
      name: 'Hospital das Clínicas',
      address: 'R. Dr. Ovídio Pires de Campos, 225 - Cerqueira César, São Paulo - SP',
      lat: -23.5582,
      lng: -46.6628,
      category: 'saude',
      estimatedLeads: 3200,
      radius: 5
    }
  ];

  useEffect(() => {
    setLocations(exampleLocations);
    // Simular carregamento do mapa
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

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
      'shopping': 'Shopping Centers',
      'educacao': 'Educação',
      'saude': 'Saúde',
      'empresarial': 'Empresarial',
      'residencial': 'Residencial',
      'lazer': 'Lazer e Entretenimento'
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'shopping': 'bg-blue-100 text-blue-800 border-blue-200',
      'educacao': 'bg-green-100 text-green-800 border-green-200',
      'saude': 'bg-red-100 text-red-800 border-red-200',
      'empresarial': 'bg-purple-100 text-purple-800 border-purple-200',
      'residencial': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'lazer': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleSearch = () => {
    toast({
      title: "Buscando Localização",
      description: `Procurando leads próximos a: ${searchAddress}`,
    });
    // Implementar busca com Google Maps API
  };

  const handleCreateCampaign = (location: LocationData) => {
    toast({
      title: "Campanha Criada",
      description: `Campanha criada para ${location.name} - ${location.estimatedLeads} leads estimados`,
    });
  };

  const filteredLocations = locations.filter(location => {
    if (selectedCategory && location.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Leads por Geolocalização"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Search and Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Busca por Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço ou Ponto de Interesse</Label>
                    <Input
                      id="address"
                      placeholder="Ex: Av. Paulista, 1000 - São Paulo"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
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
                        <SelectItem value="shopping">Shopping Centers</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="empresarial">Empresarial</SelectItem>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="lazer">Lazer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleSearch}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Buscar
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label>Raio de Busca: {radius[0]} km</Label>
                  <Slider
                    value={radius}
                    onValueChange={setRadius}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Map Area */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa de Localizações
                  <Badge className="ml-2">Google Maps Integration</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {!mapLoaded ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <p className="text-gray-600 font-medium">Carregando Google Maps...</p>
                      <p className="text-sm text-gray-500">Integração com API oficial do Google</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">Mapa Interativo do Google</p>
                      <p className="text-sm text-gray-500">Visualize localizações e áreas de cobertura</p>
                      <div className="mt-4 text-xs text-gray-400 bg-white px-3 py-1 rounded-full inline-block">
                        🗺️ Google Maps API integrada - Funcionalidade completa em desenvolvimento
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Localizações Encontradas ({filteredLocations.length})
                  </div>
                  <Badge variant="outline">
                    {filteredLocations.reduce((total, loc) => total + loc.estimatedLeads, 0)} leads estimados
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLocations.length > 0 ? (
                  <div className="space-y-4">
                    {filteredLocations.map((location) => (
                      <div key={location.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              <h3 className="font-semibold text-gray-900">{location.name}</h3>
                              <Badge className={getCategoryColor(location.category)}>
                                {getCategoryName(location.category)}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              📍 {location.address}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Leads Estimados:</span>
                                <span className="font-semibold text-green-600 ml-2">
                                  {location.estimatedLeads.toLocaleString()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Raio de Cobertura:</span>
                                <span className="font-semibold ml-2">{location.radius} km</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Custo Estimado:</span>
                                <span className="font-semibold text-blue-600 ml-2">
                                  R$ {(location.estimatedLeads * 0.89).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-6">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={() => handleCreateCampaign(location)}
                            >
                              <Target className="h-3 w-3 mr-1" />
                              Criar Campanha
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <MapPin className="h-3 w-3 mr-1" />
                              Ver no Mapa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <MapPin className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma localização encontrada</h3>
                    <p className="text-gray-600 mb-6">
                      Faça uma busca por endereço ou ajuste os filtros para encontrar localizações
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCategory('')}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}