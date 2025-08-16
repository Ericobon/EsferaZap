import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Server, Webhook, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface URLInfoProps {
  botId: string;
}

export function URLInfo({ botId }: URLInfoProps) {
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const { data: urlData, isLoading } = useQuery({
    queryKey: ['/api/bots', botId, 'urls'],
    enabled: !!botId,
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      toast({
        title: "Copiado!",
        description: `${label} copiada para área de transferência`,
      });
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!urlData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Globe className="h-8 w-8 mx-auto mb-2" />
            <p>Não foi possível carregar as URLs</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case 'replit':
        return <Badge className="bg-blue-100 text-blue-800">Replit</Badge>;
      case 'local':
        return <Badge className="bg-yellow-100 text-yellow-800">Local</Badge>;
      case 'production':
        return <Badge className="bg-green-100 text-green-800">Produção</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{env}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          URLs Geradas Automaticamente
          {getEnvironmentBadge(urlData.environment.environment)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* URL do Servidor */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="font-medium">URL do Servidor</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 text-sm font-mono break-all">
              {urlData.serverURL}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(urlData.serverURL, "URL do servidor")}
              className={copiedUrl === urlData.serverURL ? "bg-green-50" : ""}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(urlData.serverURL, '_blank')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Webhook URL */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Webhook className="h-4 w-4 text-purple-600" />
            <span className="font-medium">URL do Webhook</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <code className="flex-1 text-sm font-mono break-all">
              {urlData.webhookURL}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(urlData.webhookURL, "URL do webhook")}
              className={copiedUrl === urlData.webhookURL ? "bg-green-50" : ""}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* URLs por Provedor */}
        <div>
          <h4 className="font-medium mb-3">URLs por Provedor WhatsApp</h4>
          <div className="space-y-2">
            {Object.entries(urlData.providerWebhooks).map(([provider, url]) => (
              <div key={provider} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium capitalize">
                  {provider.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1">
                  <code className="text-xs font-mono text-gray-600 max-w-xs truncate">
                    .../{provider}/{botId}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(url as string, `URL ${provider}`)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Informações do Ambiente */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Informações do Ambiente</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Ambiente: {urlData.environment.environment}</div>
            <div>Porta: {urlData.environment.port}</div>
            {urlData.environment.replSlug && (
              <div>Repl: {urlData.environment.replOwner}/{urlData.environment.replSlug}</div>
            )}
            {urlData.environment.replId && (
              <div>ID: {urlData.environment.replId}</div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}