import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Target, 
  CheckCircle2, 
  MapPin,
  ArrowRight,
  Star,
  Filter,
  Zap,
  Shield,
  TrendingUp,
  Database,
  Eye
} from "lucide-react";
import { useState } from "react";

export default function CompraLeads() {
  const [selectedUF, setSelectedUF] = useState("");
  const [selectedSegmento, setSelectedSegmento] = useState("");
  const [selectedTempo, setSelectedTempo] = useState("");
  const [quantidade, setQuantidade] = useState(100);

  // Estados brasileiros
  const estados = [
    { value: "sp", label: "São Paulo" },
    { value: "rj", label: "Rio de Janeiro" },
    { value: "mg", label: "Minas Gerais" },
    { value: "rs", label: "Rio Grande do Sul" },
    { value: "pr", label: "Paraná" },
    { value: "sc", label: "Santa Catarina" },
    { value: "ba", label: "Bahia" },
    { value: "go", label: "Goiás" },
    { value: "es", label: "Espírito Santo" },
    { value: "pe", label: "Pernambuco" },
    { value: "ce", label: "Ceará" },
    { value: "pa", label: "Pará" },
    { value: "df", label: "Distrito Federal" },
    { value: "mt", label: "Mato Grosso" },
    { value: "ms", label: "Mato Grosso do Sul" }
  ];

  // Segmentos de negócio
  const segmentos = [
    { value: "tecnologia", label: "Tecnologia" },
    { value: "saude", label: "Saúde" },
    { value: "educacao", label: "Educação" },
    { value: "varejo", label: "Varejo" },
    { value: "servicos", label: "Serviços" },
    { value: "industria", label: "Indústria" },
    { value: "agricultura", label: "Agricultura" },
    { value: "construcao", label: "Construção" },
    { value: "alimentacao", label: "Alimentação" },
    { value: "automotivo", label: "Automotivo" },
    { value: "financeiro", label: "Financeiro" },
    { value: "imobiliario", label: "Imobiliário" }
  ];

  // Tempo de atividade
  const temposAtividade = [
    { value: "0-1", label: "0 a 1 ano" },
    { value: "1-3", label: "1 a 3 anos" },
    { value: "3-5", label: "3 a 5 anos" },
    { value: "5-10", label: "5 a 10 anos" },
    { value: "10+", label: "Mais de 10 anos" }
  ];

  // Cálculo de preço escalonado
  const calcularPreco = (qty: number) => {
    if (qty <= 300) return qty * 0.60;
    if (qty <= 500) return qty * 0.50;
    if (qty <= 1000) return qty * 0.39;
    if (qty <= 10000) return qty * 0.29;
    return "Consultar especialista";
  };

  const precoTotal = calcularPreco(quantidade);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-7 w-7 text-blue-600" />
                Compra de Leads
              </h1>
              <p className="text-gray-600 mt-1">
                Compre leads qualificados e segmentados para sua empresa
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              Base Atualizada
            </Badge>
          </div>

          {/* Configuração e Preços */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filtros de Customização */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-600" />
                    Customização dos Leads
                  </CardTitle>
                  <CardDescription>
                    Configure os filtros para obter leads mais relevantes para seu negócio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="uf">Estado (UF)</Label>
                      <Select value={selectedUF} onValueChange={setSelectedUF}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="segmento">Segmento</Label>
                      <Select value={selectedSegmento} onValueChange={setSelectedSegmento}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o segmento" />
                        </SelectTrigger>
                        <SelectContent>
                          {segmentos.map((segmento) => (
                            <SelectItem key={segmento.value} value={segmento.value}>
                              {segmento.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tempo">Tempo de Atividade</Label>
                      <Select value={selectedTempo} onValueChange={setSelectedTempo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tempo de atividade" />
                        </SelectTrigger>
                        <SelectContent>
                          {temposAtividade.map((tempo) => (
                            <SelectItem key={tempo.value} value={tempo.value}>
                              {tempo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantidade">Quantidade de Leads</Label>
                      <Input
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        min="1"
                        max="50000"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preços Compactos */}
            <div>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Preços
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Até 300 leads:</span>
                      <span className="font-medium">R$ 0,60</span>
                    </div>
                    <div className="flex justify-between">
                      <span>500+ leads:</span>
                      <span className="font-medium">R$ 0,50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1.000+ leads:</span>
                      <span className="font-medium">R$ 0,39</span>
                    </div>
                    <div className="flex justify-between">
                      <span>10.000+ leads:</span>
                      <span className="font-medium">R$ 0,29</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50.000+ leads:</span>
                      <span className="font-medium text-blue-600">Consultar</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Total:</span>
                      <span className="text-xl font-bold text-blue-600">
                        {typeof precoTotal === 'number' ? `R$ ${precoTotal.toFixed(2)}` : precoTotal}
                      </span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Comprar Leads
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mapa de Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Localização dos Leads
              </CardTitle>
              <CardDescription>
                Visualize a distribuição geográfica dos leads selecionados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                <div className="text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-lg font-medium">Mapa Interativo</p>
                  <p className="text-sm">Os pontos dos leads aparecerão aqui após a compra</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview do Dataset */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Preview do Dataset de Saída
              </CardTitle>
              <CardDescription>
                Exemplo dos dados que você receberá integrados via SQL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <div className="mb-2 text-blue-400">-- Estrutura da tabela leads_comprados</div>
                <div className="space-y-1">
                  <div>SELECT * FROM leads_comprados LIMIT 5;</div>
                  <div className="mt-3 text-yellow-400">| id | nome_empresa | cnpj | telefone | email | endereco | cidade | uf | segmento | tempo_atividade | responsavel |</div>
                  <div>| 1 | Tech Solutions Ltda | 12.345.678/0001-90 | (11) 99999-9999 | contato@tech.com | Av. Paulista, 1000 | São Paulo | SP | tecnologia | 3-5 | João Silva |</div>
                  <div>| 2 | Saúde & Vida Clínica | 98.765.432/0001-10 | (11) 88888-8888 | info@saude.com | R. Augusta, 500 | São Paulo | SP | saude | 5-10 | Maria Santos |</div>
                  <div>| 3 | EduTech Cursos | 11.222.333/0001-44 | (11) 77777-7777 | edu@cursos.com | R. da Consolação, 200 | São Paulo | SP | educacao | 1-3 | Pedro Costa |</div>
                  <div className="mt-2 text-gray-400">...</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>Os dados são atualizados mensalmente e incluem validação de CNPJ ativo</span>
              </div>
            </CardContent>
          </Card>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leads Disponíveis</p>
                    <p className="text-2xl font-bold text-gray-900">2.5M+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conversão Média</p>
                    <p className="text-2xl font-bold text-gray-900">24.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualidade dos Dados</p>
                    <p className="text-2xl font-bold text-gray-900">98.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}