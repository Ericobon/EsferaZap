import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowRight, ArrowLeft, Bot, Phone, MessageSquare, QrCode, Check, Mic, PhoneCall } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QRCodeDisplay } from "./qr-code-display";

interface CreateBotWizardProps {
  onClose: () => void;
  onComplete: (botId: string) => void;
}

interface BotData {
  name: string;
  phoneNumber: string;
  prompt: string;
  botTypes: ('text' | 'audio' | 'voice')[];
}

export function CreateBotWizard({ onClose, onComplete }: CreateBotWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [botData, setBotData] = useState<BotData>({
    name: '',
    phoneNumber: '',
    prompt: '',
    botTypes: ['text']
  });
  const [createdBotId, setCreatedBotId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const createBotMutation = useMutation({
    mutationFn: async (data: BotData) => {
      return await apiRequest("POST", "/api/bots", {
        ...data,
        whatsappProvider: 'baileys',
        botType: data.botTypes.join(',')
      });
    },
    onSuccess: (response: any) => {
      setCreatedBotId(response.id);
      setCurrentStep(5);
      queryClient.invalidateQueries({ queryKey: ['/api/bots'] });
      toast({
        title: t('message.bot.created'),
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
    
    if (currentStep === 3 && !botData.phoneNumber.trim()) {
      toast({
        title: "Campo obrigatório", 
        description: "Digite o número do WhatsApp",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 4) {
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
    { number: 1, title: 'Informações Básicas', icon: Bot },
    { number: 2, title: 'Tipo de Comunicação', icon: MessageSquare },
    { number: 3, title: 'Número WhatsApp', icon: Phone },
    { number: 4, title: 'Personalidade', icon: MessageSquare },
    { number: 5, title: 'Conectar WhatsApp', icon: QrCode }
  ];

  const botTypes = [
    {
      id: 'text' as const,
      icon: MessageSquare,
      title: 'Mensagens de Texto',
      description: 'Conversas através de mensagens de texto simples e rápidas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'audio' as const,
      icon: Mic,
      title: 'Mensagens de Áudio',
      description: 'Inclui áudios gravados para comunicação mais pessoal',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'voice' as const,
      icon: PhoneCall,
      title: 'Ligações de Voz',
      description: 'Suporte completo a ligações telefônicas via WhatsApp',
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-green-600" />
              {t('wizard.title')}
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
                <p className="text-sm text-gray-600 mt-2">Escolha um nome que represente bem seu negócio ou serviço</p>
              </div>
              
              <div>
                <Label htmlFor="botName">Nome do seu Bot</Label>
                <Input
                  id="botName"
                  value={botData.name}
                  onChange={(e) => setBotData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Atendimento Loja ABC, Suporte Técnico..."
                  className="mt-2"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Bot Type Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Como seu bot vai se comunicar?</h3>
                <p className="text-sm text-gray-600">Selecione os tipos de comunicação que deseja oferecer</p>
              </div>
              
              <div className="grid gap-3">
                {botTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = botData.botTypes.includes(type.id);
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => {
                        setBotData(prev => ({
                          ...prev,
                          botTypes: isSelected
                            ? prev.botTypes.filter(t => t !== type.id)
                            : [...prev.botTypes, type.id]
                        }));
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? `${type.bgColor} border-2 ${type.color.replace('text-', 'border-')}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? type.bgColor : 'bg-gray-100'}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? type.color : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${isSelected ? type.color : 'text-gray-900'}`}>
                              {type.title}
                            </h4>
                            {isSelected && (
                              <Check className={`h-4 w-4 ${type.color}`} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Você pode selecionar múltiplos tipos para ter mais flexibilidade na comunicação com seus clientes.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Phone Number */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Qual é o número do WhatsApp?</h3>
                <p className="text-sm text-gray-600">Informe o número que será usado para enviar e receber mensagens</p>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
                <Input
                  id="phoneNumber"
                  value={botData.phoneNumber}
                  onChange={(e) => setBotData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="Ex: +5511999887766"
                  className="mt-2"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: +55 (código do país) + DDD + número
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Bot Prompt */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Como seu bot deve se comportar?</h3>
                <p className="text-sm text-gray-600">Descreva a personalidade e estilo de atendimento do seu bot</p>
              </div>
              
              <div>
                <Label htmlFor="prompt">Personalidade do Bot</Label>
                <Textarea
                  id="prompt"
                  value={botData.prompt}
                  onChange={(e) => setBotData(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder={t('bot.form.prompt.placeholder')}
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

          {/* Step 5: Connect */}
          {currentStep === 5 && createdBotId && (
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
              {currentStep > 1 && currentStep < 5 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
{t('wizard.previous')}
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep < 4 && (
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
{t('wizard.next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 4 && (
                <Button 
                  onClick={handleNext}
                  disabled={createBotMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
{createBotMutation.isPending ? t('wizard.creating') : t('wizard.finish')}
                  <Bot className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 5 && (
                <Button 
                  onClick={handleConnect}
                  className="bg-green-600 hover:bg-green-700"
                >
{t('wizard.finish')}
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