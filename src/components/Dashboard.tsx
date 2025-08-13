import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Activity, 
  Plus, 
  Settings, 
  Download,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalBots: number;
  totalSessions: number;
  totalMessages: number;
  activeUsers: number;
}

interface BotData {
  id: string;
  name: string;
  description: string;
  prompt: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  company?: string;
  createdAt: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bots, setBots] = useState<BotData[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);
  const [newBot, setNewBot] = useState({
    name: '',
    description: '',
    prompt: ''
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user profile
      const profileResponse = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        setUserProfile(profile);
      }

      // Load dashboard stats
      const statsResponse = await fetch('/api/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      if (statsResponse.ok) {
        const dashboardStats = await statsResponse.json();
        setStats(dashboardStats);
      }

      // Load user bots
      const botsResponse = await fetch('/api/bots', {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });
      if (botsResponse.ok) {
        const userBots = await botsResponse.json();
        setBots(userBots);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify(newBot)
      });

      if (response.ok) {
        toast.success('Bot criado com sucesso!');
        setNewBot({ name: '', description: '', prompt: '' });
        setShowCreateBot(false);
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao criar bot');
      }
    } catch (error) {
      console.error('Error creating bot:', error);
      toast.error('Erro ao criar bot');
    }
  };

  const handleUpdateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBot) return;

    try {
      const response = await fetch(`/api/bots/${editingBot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          name: editingBot.name,
          description: editingBot.description,
          prompt: editingBot.prompt
        })
      });

      if (response.ok) {
        toast.success('Bot atualizado com sucesso!');
        setEditingBot(null);
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao atualizar bot');
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      toast.error('Erro ao atualizar bot');
    }
  };

  const handleDeleteBot = async (botId: string) => {
    if (!confirm('Tem certeza que deseja deletar este bot?')) return;

    try {
      const response = await fetch(`/api/bots/${botId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });

      if (response.ok) {
        toast.success('Bot deletado com sucesso!');
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erro ao deletar bot');
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
      toast.error('Erro ao deletar bot');
    }
  };

  const handleExportConversations = async (botId: string) => {
    try {
      const response = await fetch(`/api/bots/${botId}/export`, {
        headers: {
          'Authorization': `Bearer ${await user?.getIdToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bot-${botId}-conversations-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Conversas exportadas com sucesso!');
      } else {
        toast.error('Erro ao exportar conversas');
      }
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast.error('Erro ao exportar conversas');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {userProfile?.name || user?.displayName || user?.email}
          </p>
        </div>
        <Button onClick={() => setShowCreateBot(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Bot
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Bots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBots}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bots List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Bots</CardTitle>
          <CardDescription>
            Gerencie seus bots de WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum bot encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Crie seu primeiro bot para começar
              </p>
              <Button className="mt-4" onClick={() => setShowCreateBot(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Bot
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{bot.name}</h3>
                      <Badge variant={bot.isActive ? "default" : "secondary"}>
                        {bot.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{bot.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Criado em: {new Date(bot.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBot(bot)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportConversations(bot.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBot(bot.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Bot Modal */}
      {showCreateBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Criar Novo Bot</CardTitle>
              <CardDescription>
                Configure seu bot de WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBot} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Bot</Label>
                  <Input
                    id="name"
                    value={newBot.name}
                    onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                    placeholder="Ex: Atendimento Loja"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newBot.description}
                    onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                    placeholder="Breve descrição do bot"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prompt">Prompt do Bot</Label>
                  <Textarea
                    id="prompt"
                    value={newBot.prompt}
                    onChange={(e) => setNewBot({ ...newBot, prompt: e.target.value })}
                    placeholder="Instruções para o comportamento do bot..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateBot(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Criar Bot
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Bot Modal */}
      {editingBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Bot</CardTitle>
              <CardDescription>
                Atualize as configurações do bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBot} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nome do Bot</Label>
                  <Input
                    id="edit-name"
                    value={editingBot.name}
                    onChange={(e) => setEditingBot({ ...editingBot, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Input
                    id="edit-description"
                    value={editingBot.description}
                    onChange={(e) => setEditingBot({ ...editingBot, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-prompt">Prompt do Bot</Label>
                  <Textarea
                    id="edit-prompt"
                    value={editingBot.prompt}
                    onChange={(e) => setEditingBot({ ...editingBot, prompt: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingBot(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}