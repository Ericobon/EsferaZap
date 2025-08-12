import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RefreshCw, Smartphone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QRCodeData {
  qrCode: string;
  status: "qr_required" | "connected" | "disconnected";
  sessionId: string;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  botId: string;
}

export default function QRCodeModal({ isOpen, onClose, botId }: QRCodeModalProps) {
  const [connectionStatus, setConnectionStatus] = useState<string>("disconnected");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch QR code data
  const { data: qrData, isLoading, error, refetch } = useQuery<QRCodeData>({
    queryKey: ["/api/whatsapp/qr", botId],
    enabled: isOpen && !!botId,
    refetchInterval: connectionStatus === "qr_required" ? 5000 : false, // Poll every 5s when waiting
  });

  // Generate new QR code mutation
  const generateQRMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/whatsapp/generate-qr/${botId}`, {}),
    onSuccess: () => {
      toast({
        title: "QR Code atualizado",
        description: "Novo QR Code gerado com sucesso",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar QR Code",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (qrData) {
      setConnectionStatus(qrData.status);
      
      // Show success message when connected
      if (qrData.status === "connected") {
        toast({
          title: "WhatsApp Conectado!",
          description: "Seu bot está pronto para receber mensagens",
        });
        
        // Invalidate bots list to update status
        queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
        
        // Auto-close modal after connection
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }
  }, [qrData, toast, queryClient, onClose]);

  const handleRefreshQR = () => {
    generateQRMutation.mutate();
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "connected":
        return {
          label: "Conectado",
          color: "bg-green-100 text-green-800",
          icon: "🟢"
        };
      case "qr_required":
        return {
          label: "Aguardando conexão",
          color: "bg-yellow-100 text-yellow-800",
          icon: "🟡"
        };
      default:
        return {
          label: "Desconectado",
          color: "bg-red-100 text-red-800",
          icon: "🔴"
        };
    }
  };

  const statusInfo = getStatusInfo(connectionStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Conectar WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <LoadingSpinner size="lg" className="mb-4" />
                  <p className="text-sm text-slate-600">Gerando QR Code...</p>
                </div>
              ) : error ? (
                <div className="text-center">
                  <p className="text-sm text-red-600">Erro ao carregar QR Code</p>
                  <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                    Tentar novamente
                  </Button>
                </div>
              ) : qrData?.status === "connected" ? (
                <div className="text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-lg font-medium text-green-600">WhatsApp Conectado!</p>
                </div>
              ) : qrData?.qrCode ? (
                <div className="text-center">
                  <img
                    src={`data:image/png;base64,${qrData.qrCode}`}
                    alt="QR Code"
                    className="w-56 h-56 mx-auto"
                  />
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600">Aguardando escaneamento...</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">QR Code não disponível</p>
                  <Button onClick={handleRefreshQR}>Gerar QR Code</Button>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          {qrData?.status === "qr_required" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-blue-900 mb-2">Como conectar:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o WhatsApp no seu celular</li>
                <li>2. Toque em "Mais opções" (⋮) e selecione "Dispositivos conectados"</li>
                <li>3. Toque em "Conectar um dispositivo"</li>
                <li>4. Escaneie este QR Code</li>
              </ol>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-center space-x-2">
            <Badge className={statusInfo.color}>
              {statusInfo.icon} Status: {statusInfo.label}
            </Badge>
          </div>

          {/* Actions */}
          {qrData?.status !== "connected" && (
            <Button
              onClick={handleRefreshQR}
              disabled={generateQRMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {generateQRMutation.isPending ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Gerar Novo QR Code
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
