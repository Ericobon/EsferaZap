import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { insertBotSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const createBotSchema = insertBotSchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  instructions: z.string().min(10, "Instruções devem ter pelo menos 10 caracteres"),
  aiProvider: z.enum(["openai", "gemini"]),
});

type CreateBotFormData = z.infer<typeof createBotSchema>;

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBotModal({ isOpen, onClose, onSuccess }: CreateBotModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<CreateBotFormData>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      description: "",
      instructions: "",
      aiProvider: "openai",
      userId: user?.uid || "",
    },
  });

  const onSubmit = async (data: CreateBotFormData) => {
    if (!user?.uid) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = { ...data, userId: user.uid };
      
      await apiRequest("POST", "/api/bots", payload);
      
      toast({
        title: "Bot criado com sucesso!",
        description: `O bot "${data.name}" foi criado e está pronto para ser configurado.`,
      });
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Create bot error:", error);
      toast({
        title: "Erro ao criar bot",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Bot</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Nome do Bot</Label>
            <Input
              id="name"
              placeholder="Ex: Atendimento Comercial"
              {...form.register("name")}
              className="mt-2"
            />
            <p className="text-sm text-slate-500 mt-1">Nome que identificará o bot no painel</p>
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Breve descrição do propósito do bot"
              {...form.register("description")}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instruções do Bot (Prompt)</Label>
            <Textarea
              id="instructions"
              rows={8}
              placeholder="Escreva as instruções detalhadas para o comportamento do bot. Seja específico sobre como ele deve responder aos usuários, qual tom usar, que informações pode fornecer, etc."
              {...form.register("instructions")}
              className="mt-2 resize-none"
            />
            <p className="text-sm text-slate-500 mt-1">Estas instruções guiarão o comportamento da IA</p>
            {form.formState.errors.instructions && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.instructions.message}
              </p>
            )}
          </div>

          <div>
            <Label>Provedor de IA</Label>
            <Select
              defaultValue="openai"
              onValueChange={(value) => form.setValue("aiProvider", value as "openai" | "gemini")}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
              Criar Bot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
