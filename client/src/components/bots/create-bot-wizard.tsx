import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, Bot, Phone, MessageSquare, QrCode, Check } from "lucide-react";
import { QRCodeDisplay } from "./qr-code-display";

interface CreateBotWizardProps {
  onClose: () => void;
  onComplete: (botId: string) => void;
}

interface BotData {
  name: string;
  phoneNumber: string;
  prompt: string;
}

export function CreateBotWizard({ onClose, onComplete }: CreateBotWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState<BotData>({
    name: '',
    phoneNumber: '',
    prompt: ''
  });
  const [createdBotId, setCreatedBotId] = useState<string | null>(null);
  const { toast } = useToast();

  const createBotMutation = useMutation({
    mutationFn: async (data: BotData) => {
      return await apiRequest("POST", "/api/bots", {
        ...data,
        whatsappProvider: 'baileys'
      });
    },
    onSuccess: (response: any) => {
      setCreatedBotId(response.id);
      setCurrentStep(4);
      queryClient.invalidateQueries({ queryKey: ['/api/bots'] });
      toast({
        title: "Bot criado com sucesso!",
        description: "Agora vamos conectá-lo ao WhatsApp",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar bot",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep === 1 && !botData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome do seu bot",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && !botData.phoneNumber.trim()) {
      toast({
        title: "Campo obrigatório", 
        description: "Digite o número do WhatsApp",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3) {
      if (!botData.prompt.trim()) {
        setBotData(prev => ({
          ...prev,
          prompt: 'Você é um assistente virtual amigável e profissional. Responda de forma educada e prestativa.'
        }));
      }
      createBotMutation.mutate(botData);
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConnect = () => {
    if (createdBotId) {
      onComplete(createdBotId);
    }
  };

  const steps = [
    { number: 1, title: "Nome do Bot", icon: Bot },
    { number: 2, title: "Número WhatsApp", icon: Phone },
    { number: 3, title: "Personalidade", icon: MessageSquare },
    { number: 4, title: "Conectar", icon: QrCode }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-green-600" />
              Criar Novo Chatbot
              <Badge className="bg-green-100 text-green-800 ml-2">Baileys</Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-800' :
                    isCompleted ? 'bg-gray-100 text-gray-600' :
                    'bg-gray-50 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium hidden sm:block">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-300 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Step 1: Bot Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <Bot className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Como você quer chamar seu bot?</h3>
                <p className="text-sm text-gray-600">
                  Escolha um nome amigável que seus clientes possam reconhecer
                </p>
              </div>
              
              <div>
                <Label htmlFor="botName">Nome do Bot</Label>
                <Input
                  id="botName"
                  value={botData.name}
                  onChange={(e) => setBotData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Atendente Virtual, Bot de Vendas..."
                  className="mt-2"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Phone Number */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Número do WhatsApp Business</h3>
                <p className="text-sm text-gray-600">
                  Informe o número que será usado pelo bot
                </p>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Número completo com código do país</Label>
                <Input
                  id="phoneNumber"
                  value={botData.phoneNumber}
                  onChange={(e) => setBotData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Ex: +5511999999999"
                  className="mt-2"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: +55 (código do país) + DDD + número
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Bot Prompt */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Personalidade do Bot</h3>
                <p className="text-sm text-gray-600">
                  Como o bot deve se comportar e responder aos clientes?
                </p>
              </div>
              
              <div>
                <Label htmlFor="prompt">Instruções para o bot (opcional)</Label>
                <Textarea
                  id="prompt"
                  value={botData.prompt}
                  onChange={(e) => setBotData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Ex: Você é um assistente de vendas amigável da minha empresa. Responda de forma educada e profissional, oferecendo ajuda sobre nossos produtos e serviços..."
                  rows={4}
                  className="mt-2"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se deixar vazio, usaremos uma personalidade padrão amigável
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Connect */}
          {currentStep === 4 && createdBotId && (
            <div className="space-y-4">
              <QRCodeDisplay 
                botId={createdBotId}
                botName={botData.name}
                phoneNumber={botData.phoneNumber}
                onConnectionSuccess={() => {
                  toast({
                    title: "Chatbot Ativo!",
                    description: "Seu bot está conectado e pronto para uso",
                  });
                }}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div>
              {currentStep > 1 && currentStep < 4 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep < 3 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 3 && (
                <Button 
                  onClick={handleNext}
                  disabled={createBotMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {createBotMutation.isPending ? "Criando..." : "Criar Bot"}
                  <Bot className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 4 && (
                <Button 
                  onClick={handleConnect}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Finalizar e Testar
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}