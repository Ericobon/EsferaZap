import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { insertBotSchema, type Bot } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Mic, Image, QrCode, X } from "lucide-react";
import { z } from "zod";

const formSchema = insertBotSchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  phoneNumber: z.string().min(1, "Número do WhatsApp é obrigatório"),
});

interface BotFormProps {
  bot?: Bot | null;
  onClose: () => void;
}

export default function BotForm({ bot, onClose }: BotFormProps) {
  const { toast } = useToast();
  const [triggerWords, setTriggerWords] = useState<string[]>(bot?.triggerWords || []);
  const [currentWord, setCurrentWord] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bot?.name || "",
      phoneNumber: bot?.phoneNumber || "",
      prompt: bot?.prompt || "",
      maxTokens: bot?.maxTokens || 1000,
      temperature: bot?.temperature || "0.7",
      status: bot?.status || "inactive",
      botType: bot?.botType || "business",
      supportsText: bot?.supportsText ?? true,
      supportsAudio: bot?.supportsAudio ?? false,
      supportsImages: bot?.supportsImages ?? false,
      humanHandoffEnabled: bot?.humanHandoffEnabled ?? false,
      humanHandoffMessage: bot?.humanHandoffMessage || "Um agente humano entrará na conversa em breve.",
      triggerWords: bot?.triggerWords || [],
    },
  });

  const addTriggerWord = () => {
    if (currentWord.trim() && triggerWords.length < 5 && !triggerWords.includes(currentWord.trim())) {
      const newWords = [...triggerWords, currentWord.trim()];
      setTriggerWords(newWords);
      form.setValue('triggerWords', newWords);
      setCurrentWord("");
    }
  };

  const removeTriggerWord = (wordToRemove: string) => {
    const newWords = triggerWords.filter(word => word !== wordToRemove);
    setTriggerWords(newWords);
    form.setValue('triggerWords', newWords);
  };

  const createBotMutation = useMutation({
    mutationFn: async (data: any) => {
      const submitData = { ...data, triggerWords };
      if (bot) {
        return await apiRequest("PUT", `/api/bots/${bot.id}`, submitData);
      } else {
        return await apiRequest("POST", "/api/bots", submitData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard"] });
      toast({
        title: bot ? "Bot atualizado" : "Bot criado",
        description: bot 
          ? "O bot foi atualizado com sucesso." 
          : "O bot foi criado com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: bot 
          ? "Falha ao atualizar o bot." 
          : "Falha ao criar o bot.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createBotMutation.mutate(data);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{bot ? "Editar Bot" : "Criar Novo Bot"}</CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <i className="fas fa-times"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Bot</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Atendimento Loja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do WhatsApp</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: +55 11 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="configuring">Configurando</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* WhatsApp Connection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Conexão WhatsApp</h3>
              
              <FormField
                control={form.control}
                name="botType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Conta</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de conta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="business">WhatsApp Business</SelectItem>
                        <SelectItem value="personal">WhatsApp Pessoal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">QR Code para Conexão</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Clique no botão abaixo para gerar um QR Code e conectar seu WhatsApp
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => {
                      // TODO: Implementar geração de QR Code
                      toast({
                        title: "QR Code",
                        description: "Funcionalidade de QR Code será implementada em breve.",
                      });
                    }}
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Gerar QR Code</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Configuração da IA</h3>
              
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt do Sistema</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Defina como o bot deve se comportar. Ex: Você é um assistente de atendimento ao cliente..."
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input placeholder="0.7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bot Capabilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Funcionalidades do Bot</h3>
              <p className="text-sm text-gray-600">Selecione quais tipos de mensagem o bot será capaz de processar</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="supportsText"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                          <div>
                            <FormLabel className="text-sm font-medium cursor-pointer">Texto</FormLabel>
                            <p className="text-xs text-gray-500">Mensagens de texto</p>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportsAudio"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2">
                          <Mic className="h-5 w-5 text-green-600" />
                          <div>
                            <FormLabel className="text-sm font-medium cursor-pointer">Áudio</FormLabel>
                            <p className="text-xs text-gray-500">Mensagens de voz</p>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportsImages"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex items-center space-x-2">
                          <Image className="h-5 w-5 text-purple-600" />
                          <div>
                            <FormLabel className="text-sm font-medium cursor-pointer">Imagens</FormLabel>
                            <p className="text-xs text-gray-500">Imagens e fotos</p>
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Trigger Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Configurações de Gatilhos</h3>
              
              {/* Human Handoff Trigger */}
              <FormField
                control={form.control}
                name="humanHandoffEnabled"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          Direcionar para Humano
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          Permite que um agente humano entre na conversa
                        </p>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Human Handoff Message */}
              {form.watch("humanHandoffEnabled") && (
                <FormField
                  control={form.control}
                  name="humanHandoffMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem quando humano entrar</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mensagem exibida quando um agente humano entrar na conversa"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Trigger Words */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    checked={triggerWords.length > 0}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setTriggerWords([]);
                        form.setValue('triggerWords', []);
                      }
                    }}
                  />
                  <div>
                    <Label className="text-sm font-medium">Palavras-chave para Gatilhos</Label>
                    <p className="text-xs text-gray-500">
                      Define palavras que ativam ações específicas (máximo 5 palavras)
                    </p>
                  </div>
                </div>

                {triggerWords.length > 0 && (
                  <div className="space-y-3 pl-4">
                    {/* Input for adding new words */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Digite uma palavra-chave"
                        value={currentWord}
                        onChange={(e) => setCurrentWord(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTriggerWord();
                          }
                        }}
                        disabled={triggerWords.length >= 5}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTriggerWord}
                        disabled={!currentWord.trim() || triggerWords.length >= 5}
                        size="sm"
                      >
                        Adicionar
                      </Button>
                    </div>

                    {/* Display current trigger words */}
                    {triggerWords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {triggerWords.map((word, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                          >
                            <span>{word}</span>
                            <button
                              type="button"
                              onClick={() => removeTriggerWord(word)}
                              className="text-primary hover:text-primary/70 ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {triggerWords.length}/5 palavras-chave definidas
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createBotMutation.isPending}
                className="bg-primary hover:bg-primary-dark"
              >
                {createBotMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {bot ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {bot ? "Atualizar Bot" : "Criar Bot"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
