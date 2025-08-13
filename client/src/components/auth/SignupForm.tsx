import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggleSimple } from "@/components/ui/theme-toggle";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  phone: z.string().min(10, "Telefone inválido").optional(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password, data.name, data.company, data.phone);
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao EsferaZap - Plataforma de automação WhatsApp",
      });
      onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900 flex items-center justify-center p-4">
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <ThemeToggleSimple />
      </div>
      
      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
        {/* InsightEsfera Branding */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-teal-600 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <div className="h-8 w-8 bg-white rounded-full opacity-80"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">
            Join InsightEsfera
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            Create your account to get started
          </p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              {...form.register("name")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-semibold text-gray-700">
              Company <span className="text-gray-400">(optional)</span>
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Your company name"
              {...form.register("company")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              WhatsApp Phone <span className="text-gray-400">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+55 11 98765-4321"
              {...form.register("phone")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...form.register("email")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              {...form.register("password")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...form.register("confirmPassword")}
              className="h-12 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-teal-500/20 bg-gray-50/50"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 hover:from-teal-700 hover:via-teal-800 hover:to-teal-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" 
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button 
              variant="link" 
              onClick={onSwitchToLogin}
              className="text-teal-600 hover:text-teal-700 font-semibold p-0"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}