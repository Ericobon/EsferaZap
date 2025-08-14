import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import type { Contact } from "@shared/schema";

export default function Contacts() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar contatos
  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/contacts'],
    enabled: !!user,
  });

  // Filtrar contatos
  const filteredContacts = contacts.filter((contact: Contact) =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber?.includes(searchTerm) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex">
        {/* Lista de Contatos */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contatos</h2>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                <i className="fas fa-plus mr-2"></i>
                Novo
              </Button>
            </div>
            
            {/* Busca */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredContacts.map((contact: Contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name || contact.phoneNumber}`} />
                      <AvatarFallback>{getInitials(contact.name || contact.phoneNumber)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {contact.name || contact.phoneNumber}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(contact.status || 'active')}`}>
                          {contact.status || 'active'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate">
                        {contact.phoneNumber}
                      </p>
                      
                      {contact.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {contact.email}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        Última atividade: {formatTime(contact.lastActivity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Detalhes do Contato */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Header do Contato */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedContact.name || selectedContact.phoneNumber}`} />
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedContact.name || selectedContact.phoneNumber)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {selectedContact.name || selectedContact.phoneNumber}
                      </h1>
                      <p className="text-gray-600">{selectedContact.phoneNumber}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getStatusColor(selectedContact.status || 'active')}>
                          {selectedContact.status || 'active'}
                        </Badge>
                        {selectedContact.assignedAt && (
                          <Badge variant="outline">
                            <i className="fas fa-user mr-1"></i>
                            Atribuído
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-comments mr-2"></i>
                      Abrir Chat
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-edit mr-2"></i>
                      Editar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  
                  {/* Informações Gerais */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informação geral</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <i className="fas fa-user mr-2"></i>Name
                            </label>
                            <Input value={selectedContact.name || ''} placeholder="Enter name" readOnly />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <i className="fas fa-user mr-2"></i>Surname
                            </label>
                            <Input value={selectedContact.surname || ''} placeholder="Enter surname" readOnly />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-envelope mr-2"></i>E-mail
                          </label>
                          <Input value={selectedContact.email || ''} placeholder="Enter contact email" readOnly />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <i className="fas fa-tag mr-2"></i>Type
                            </label>
                            <Select value={selectedContact.type || 'personal'} disabled>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="personal">Personal</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="opacity-50">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business</label>
                            <Input placeholder="" disabled />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informação del contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-briefcase mr-2"></i>Title
                          </label>
                          <Input value={selectedContact.title || ''} placeholder="No son prefixes; Mr, Mrs, Miss, Dr..." readOnly />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-birthday-cake mr-2"></i>Birthday
                          </label>
                          <Input value={selectedContact.birthday ? formatTime(selectedContact.birthday) : ''} placeholder="15-01-1995" readOnly />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-clock mr-2"></i>Time zone
                          </label>
                          <Input value={selectedContact.timezone || ''} placeholder="Europe/Madrid" readOnly />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-venus-mars mr-2"></i>Gender
                          </label>
                          <Input value={selectedContact.gender || ''} placeholder="Female" readOnly />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-language mr-2"></i>Languages
                          </label>
                          <div className="flex space-x-2">
                            {(selectedContact.languages as string[] || ['Español']).map((lang, index) => (
                              <Badge key={index} variant="secondary">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <i className="fas fa-dollar-sign mr-2"></i>Currency
                          </label>
                          <Input value={selectedContact.currency || ''} placeholder="Euro" readOnly />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Chat Information */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Chat Information</CardTitle>
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                            Open Chat
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className="bg-green-100 text-green-700">
                            <i className="fas fa-circle mr-1 text-xs"></i>Resolved
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Assigned at</span>
                          <span className="text-sm font-medium">6 days ago</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">First message</span>
                          <span className="text-sm font-medium">6 days ago</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Labels */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Labels</CardTitle>
                          <Button size="sm" variant="outline" className="text-blue-500">
                            Manage labels
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Input placeholder="Type label name" />
                      </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Metadata</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-sm font-medium">Key</span>
                          <span className="text-sm font-medium">Value</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Enter key name" />
                          <Input placeholder="Enter value" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          + Add new metadata item
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Private notes about this contact"
                          rows={4}
                          value={selectedContact.notes || ''}
                          readOnly
                          className="bg-yellow-50"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-address-book text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecione um contato
                </h3>
                <p className="text-gray-500">
                  Escolha um contato da lista para ver os detalhes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}