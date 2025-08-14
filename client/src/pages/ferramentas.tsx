import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  Trash2, 
  Download, 
  Info,
  Settings,
  Brain,
  Database,
  MessageSquare
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  description?: string;
}

export default function Ferramentas() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Settings className="text-white text-2xl animate-pulse" />
          </div>
          <div className="text-xl font-semibold text-gray-900">Carregando...</div>
        </div>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['text/csv', 'application/pdf', 'image/png', 'image/jpeg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Aceitos apenas: CSV, PDF, PNG, JPEG",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload
    setUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          
          // Add document to list
          const newDoc: Document = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };
          
          setDocuments(prev => [...prev, newDoc]);
          
          toast({
            title: "Upload concluído",
            description: `${file.name} foi carregado com sucesso.`,
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi removido com sucesso.",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('csv')) return <Database className="h-5 w-5 text-green-600" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-600" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-blue-600" />;
    return <File className="h-5 w-5 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title="Ferramentas" 
          subtitle="Gerencie documentos e configurações do sistema"
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Upload Section */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-6 w-6 text-primary" />
                    <CardTitle>Upload de Documentos</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm max-w-xs">
                            <p className="font-semibold mb-1">Exemplos de uso:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Cardápios (PDF/PNG)</li>
                              <li>Lista de serviços (CSV/PDF)</li>
                              <li>Catálogo de produtos (CSV/PNG)</li>
                              <li>Preços e promoções (PDF/CSV)</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">
                              Máximo: 5MB por arquivo
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    CSV, PDF, PNG, JPEG
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* File upload area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        Arraste arquivos aqui ou clique para selecionar
                      </h4>
                      <p className="text-sm text-gray-500">
                        Suporte para CSV, PDF, PNG e JPEG (máx. 5MB)
                      </p>
                    </div>
                    <div className="mt-6">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".csv,.pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          disabled={uploading}
                        >
                          {uploading ? (
                            <>
                              <Settings className="h-4 w-4 mr-2 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Selecionar Arquivo
                            </>
                          )}
                        </Button>
                      </Label>
                    </div>
                  </div>

                  {/* Upload progress */}
                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enviando arquivo...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Documentos Carregados
                  </CardTitle>
                  <Badge variant="secondary">
                    {documents.length} arquivo{documents.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum documento carregado
                    </h3>
                    <p className="text-gray-500">
                      Carregue documentos para treinar a IA dos seus bots
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(doc.size)} • Carregado em {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Training Section */}
            {documents.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Treinamento de IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Use os documentos carregados para treinar a IA dos seus bots e melhorar as respostas.
                    </p>
                    <Button className="bg-primary hover:bg-primary-dark">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Treinar IA com Documentos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}