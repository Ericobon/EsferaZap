import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, User, Settings, LogOut, Globe, BarChart3, Bot } from "lucide-react";
import { UserData } from "@/lib/auth";
import { logOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { EsferaZapLogo } from "@/components/ui/EsferaZapLogo";

interface HeaderProps {
  userData: UserData;
}

export default function Header({ userData }: HeaderProps) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            {/* EsferaZap Logo */}
            <div className="flex items-center space-x-3">
              <EsferaZapLogo size={48} animated={true} />
              <div className="flex flex-col">
                <span className="text-xl font-bold insight-text-gradient">EsferaZap</span>
                <span className="text-xs text-muted-foreground">
                  by <span className="font-semibold text-primary">InsightEsfera</span>
                </span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#" 
                className="flex items-center space-x-2 text-primary font-medium border-b-2 border-primary pb-4 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span>Bots</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground pb-4 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground pb-4 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Integrações</span>
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-3 hover:bg-accent transition-colors"
                >
                  <div className="w-9 h-9 insight-gradient rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(userData.name)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-foreground font-medium text-sm">
                      {userData.name}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {userData.email}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 insight-shadow">
                <div className="px-3 py-2 border-b border-border">
                  <div className="text-sm font-medium text-foreground">{userData.name}</div>
                  <div className="text-xs text-muted-foreground">{userData.email}</div>
                </div>
                <DropdownMenuItem className="hover:bg-accent">
                  <User className="w-4 h-4 mr-3 text-primary" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-accent">
                  <Settings className="w-4 h-4 mr-3 text-primary" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-accent">
                  <Globe className="w-4 h-4 mr-3 text-primary" />
                  InsightEsfera Portal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
