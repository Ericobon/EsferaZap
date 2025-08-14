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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bot?.name || "",
      phoneNumber: bot?.phoneNumber || "",
      apiKey: bot?.apiKey || "",
      prompt: bot?.prompt || "",
      geminiApiKey: bot?.geminiApiKey || "",
      maxTokens: bot?.maxTokens || 1000,
      temperature: bot?.temperature || "0.7",
      status: bot?.status || "inactive",
    },
  });

  const createBotMutation = useMutation({
    mutationFn: async (data: any) => {
      if (bot) {
        return await apiRequest("PUT", `/api/bots/${bot.id}`, data);
      } else {
        return await apiRequest("POST", "/api/bots", data);
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

            {/* API Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Configuração de APIs</h3>
              
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Sua chave da API do WhatsApp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="geminiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gemini API Key (opcional)</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Deixe vazio para usar a chave padrão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
