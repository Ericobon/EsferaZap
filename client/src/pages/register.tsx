import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Eye, EyeOff, ArrowLeft, Building, User, Mail, Phone, Lock, Briefcase } from "lucide-react";

// Schema de validação para o formulário
const registerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato: (11) 99999-9999"),
  company: z.string().min(2, "Nome da empresa é obrigatório"),
  sector: z.string().min(1, "Selecione um setor"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos"),
  acceptNewsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const sectors = [
  "Tecnologia",
  "E-commerce",
  "Saúde",
  "Educação",
  "Financeiro",
  "Varejo",
  "Serviços",
  "Manufatura",
  "Imobiliário",
  "Alimentício",
  "Turismo",
  "Consultoria",
  "Marketing",
  "Outro"
];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      sector: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptNewsletter: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => {
      const payload = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        company: data.company,
        sector: data.sector,
        password: data.password,
      };
      return apiRequest("/api/auth/register", "POST", payload);
    },
    onSuccess: () => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao EsferaZap. Redirecionando...",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Algo deu errado. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const nextStep = () => {
    const fieldsToValidate = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'phone'] 
      : ['company', 'sector', 'password', 'confirmPassword'];
    
    form.trigger(fieldsToValidate as any).then(isValid => {
      if (isValid) {
        setCurrentStep(2);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <Link href="/login">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EsferaZap</h1>
              <p className="text-sm text-gray-500">by InsightEsfera</p>
            </div>
          </div>
        </Link>
        <Link href="/login">
          <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Login
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-20 h-1 rounded ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Informações Pessoais</span>
              <span>Empresa & Senha</span>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {currentStep === 1 ? "Crie sua conta" : "Informações da Empresa"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {currentStep === 1 
                  ? "Preencha suas informações pessoais para começar"
                  : "Complete o cadastro com dados da sua empresa"
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 ? (
                  <>
                    {/* Step 1: Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          Nome
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="firstName"
                            placeholder="Seu nome"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...form.register("firstName")}
                          />
                        </div>
                        {form.formState.errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Sobrenome
                        </Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="lastName"
                            placeholder="Seu sobrenome"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...form.register("lastName")}
                          />
                        </div>
                        {form.formState.errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...form.register("email")}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Telefone
                      </Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="phone"
                          placeholder="(11) 99999-9999"
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...form.register("phone")}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            e.target.value = formatted;
                            form.setValue("phone", formatted);
                          }}
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="button"
                      onClick={nextStep}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                    >
                      Continuar
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Step 2: Company & Password */}
                    <div>
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Nome da Empresa
                      </Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="company"
                          placeholder="Nome da sua empresa"
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                          {...form.register("company")}
                        />
                      </div>
                      {form.formState.errors.company && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.company.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sector" className="text-sm font-medium text-gray-700">
                        Setor de Atuação
                      </Label>
                      <div className="relative mt-1">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                        <Select onValueChange={(value) => form.setValue("sector", value)}>
                          <SelectTrigger className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o setor" />
                          </SelectTrigger>
                          <SelectContent>
                            {sectors.map((sector) => (
                              <SelectItem key={sector} value={sector}>
                                {sector}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {form.formState.errors.sector && (
                        <p className="text-red-500 text-xs mt-1">
                          {form.formState.errors.sector.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Senha
                        </Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua senha"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...form.register("password")}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {form.formState.errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                          Confirmar Senha
                        </Label>
                        <div className="relative mt-1">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            {...form.register("confirmPassword")}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {form.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acceptTerms"
                          className="mt-1"
                          checked={form.watch("acceptTerms")}
                          onCheckedChange={(checked) => form.setValue("acceptTerms", !!checked)}
                        />
                        <div className="text-sm">
                          <Label htmlFor="acceptTerms" className="text-gray-700 cursor-pointer">
                            Eu aceito os{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                              Termos de Uso
                            </a>{" "}
                            e a{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                              Política de Privacidade
                            </a>
                          </Label>
                          {form.formState.errors.acceptTerms && (
                            <p className="text-red-500 text-xs mt-1">
                              {form.formState.errors.acceptTerms.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="acceptNewsletter"
                          className="mt-1"
                          checked={form.watch("acceptNewsletter")}
                          onCheckedChange={(checked) => form.setValue("acceptNewsletter", !!checked)}
                        />
                        <Label htmlFor="acceptNewsletter" className="text-sm text-gray-700 cursor-pointer">
                          Quero receber novidades e atualizações por email
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 h-12 border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                      >
                        {registerMutation.isPending ? "Criando conta..." : "Criar Conta"}
                      </Button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Fazer Login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}