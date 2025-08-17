import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções
const translations = {
  pt: {
    // Header e Navegação
    'nav.dashboard': 'Dashboard',
    'nav.bots': 'Bots de IA',
    'nav.campaigns': 'Campanhas',
    'nav.conversations': 'Conversas',
    'nav.contacts': 'Contatos',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'nav.profile': 'Perfil',
    
    // Bots
    'bots.title': 'Bots de IA',
    'bots.subtitle': 'Gerencie seus chatbots inteligentes',
    'bots.create': 'Criar Bot de IA',
    'bots.search': 'Buscar conversas, bots...',
    'bots.empty.title': 'Nenhum bot criado ainda',
    'bots.empty.description': 'Crie seu primeiro chatbot com IA para automatizar conversas no WhatsApp',
    'bots.empty.cta': 'Criar Primeiro Bot',
    
    // Bot Status
    'bot.status.active': 'Ativo',
    'bot.status.inactive': 'Inativo',
    'bot.status.configuring': 'Configurando',
    
    // Bot Creation Wizard
    'wizard.title': 'Criar Novo Chatbot',
    'wizard.step1.title': 'Informações Básicas',
    'wizard.step1.subtitle': 'Configure os dados fundamentais do seu bot',
    'wizard.step2.title': 'Configuração de IA',
    'wizard.step2.subtitle': 'Defina como seu bot irá responder',
    'wizard.step3.title': 'Conectar WhatsApp',
    'wizard.step3.subtitle': 'Conecte seu bot ao WhatsApp Business',
    'wizard.step4.title': 'Revisão e Conclusão',
    'wizard.step4.subtitle': 'Revise todas as configurações',
    'wizard.next': 'Próximo',
    'wizard.previous': 'Anterior',
    'wizard.finish': 'Finalizar',
    'wizard.creating': 'Criando...',
    
    // Bot Form Fields
    'bot.form.name': 'Nome do Bot',
    'bot.form.name.placeholder': 'Ex: Atendimento Cliente',
    'bot.form.phone': 'Número do WhatsApp',
    'bot.form.phone.placeholder': 'Ex: +5511999999999',
    'bot.form.type': 'Tipo do Bot',
    'bot.form.type.text': 'Texto',
    'bot.form.type.text.description': 'Respostas apenas em texto',
    'bot.form.type.audio': 'Áudio',
    'bot.form.type.audio.description': 'Inclui mensagens de áudio',
    'bot.form.type.voice': 'Áudio e Ligação',
    'bot.form.type.voice.description': 'Suporte completo a áudio e chamadas de voz',
    'bot.form.prompt': 'Prompt da IA',
    'bot.form.prompt.placeholder': 'Descreva como o bot deve se comportar...',
    'bot.form.temperature': 'Criatividade',
    'bot.form.tokens': 'Tokens Máximos',
    
    // WhatsApp Connection
    'whatsapp.connect.title': 'Conectar ao WhatsApp',
    'whatsapp.connect.provider': 'Baileys',
    'whatsapp.connect.status.disconnected': 'Aguardando QR Code',
    'whatsapp.connect.status.connecting': 'Aguardando Conexão',
    'whatsapp.connect.status.connected': 'Conectado com Sucesso',
    'whatsapp.connect.description.disconnected': 'Gerando código QR para conexão...',
    'whatsapp.connect.description.connecting': 'Escaneie o QR Code com seu WhatsApp',
    'whatsapp.connect.description.connected': 'Seu bot está ativo e pronto para uso!',
    'whatsapp.qr.generating': 'Gerando QR Code...',
    'whatsapp.qr.scan': 'Escaneie em:',
    'whatsapp.qr.instructions.title': 'Como conectar:',
    'whatsapp.qr.instructions.1': '1. Abra o WhatsApp no seu celular',
    'whatsapp.qr.instructions.2': '2. Toque em "Dispositivos conectados"',
    'whatsapp.qr.instructions.3': '3. Toque em "Conectar dispositivo"',
    'whatsapp.qr.instructions.4': '4. Escaneie este código QR',
    'whatsapp.qr.generate': 'Gerar Novo QR',
    'whatsapp.qr.generating.button': 'Gerando...',
    'whatsapp.connected.title': 'Conectado!',
    'whatsapp.connected.description': 'Seu chatbot está ativo e pronto para responder mensagens',
    'whatsapp.connected.next.title': 'Próximos Passos:',
    'whatsapp.connected.next.test': 'Teste o bot enviando mensagens para',
    'whatsapp.connected.next.configure': 'Configure mensagens automáticas',
    'whatsapp.connected.next.monitor': 'Monitore conversas no painel',
    
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    'common.close': 'Fechar',
    'common.yes': 'Sim',
    'common.no': 'Não',
    
    // Messages
    'message.bot.created': 'Bot criado com sucesso!',
    'message.bot.updated': 'Bot atualizado com sucesso!',
    'message.bot.deleted': 'Bot excluído com sucesso!',
    'message.error.generic': 'Ocorreu um erro inesperado',
    'message.error.network': 'Erro de conexão. Tente novamente.',
  },
  en: {
    // Header e Navegação
    'nav.dashboard': 'Dashboard',
    'nav.bots': 'AI Bots',
    'nav.campaigns': 'Campaigns',
    'nav.conversations': 'Conversations',
    'nav.contacts': 'Contacts',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    
    // Bots
    'bots.title': 'AI Bots',
    'bots.subtitle': 'Manage your intelligent chatbots',
    'bots.create': 'Create AI Bot',
    'bots.search': 'Search conversations, bots...',
    'bots.empty.title': 'No bots created yet',
    'bots.empty.description': 'Create your first AI chatbot to automate WhatsApp conversations',
    'bots.empty.cta': 'Create First Bot',
    
    // Bot Status
    'bot.status.active': 'Active',
    'bot.status.inactive': 'Inactive',
    'bot.status.configuring': 'Configuring',
    
    // Bot Creation Wizard
    'wizard.title': 'Create New Chatbot',
    'wizard.step1.title': 'Basic Information',
    'wizard.step1.subtitle': 'Configure the fundamental data of your bot',
    'wizard.step2.title': 'AI Configuration',
    'wizard.step2.subtitle': 'Define how your bot will respond',
    'wizard.step3.title': 'Connect WhatsApp',
    'wizard.step3.subtitle': 'Connect your bot to WhatsApp Business',
    'wizard.step4.title': 'Review and Completion',
    'wizard.step4.subtitle': 'Review all configurations',
    'wizard.next': 'Next',
    'wizard.previous': 'Previous',
    'wizard.finish': 'Finish',
    'wizard.creating': 'Creating...',
    
    // Bot Form Fields
    'bot.form.name': 'Bot Name',
    'bot.form.name.placeholder': 'Ex: Customer Support',
    'bot.form.phone': 'WhatsApp Number',
    'bot.form.phone.placeholder': 'Ex: +5511999999999',
    'bot.form.type': 'Bot Type',
    'bot.form.type.text': 'Text',
    'bot.form.type.text.description': 'Text-only responses',
    'bot.form.type.audio': 'Audio',
    'bot.form.type.audio.description': 'Includes audio messages',
    'bot.form.type.voice': 'Audio & Voice Call',
    'bot.form.type.voice.description': 'Full audio and voice call support',
    'bot.form.prompt': 'AI Prompt',
    'bot.form.prompt.placeholder': 'Describe how the bot should behave...',
    'bot.form.temperature': 'Creativity',
    'bot.form.tokens': 'Max Tokens',
    
    // WhatsApp Connection
    'whatsapp.connect.title': 'Connect to WhatsApp',
    'whatsapp.connect.provider': 'Baileys',
    'whatsapp.connect.status.disconnected': 'Waiting QR Code',
    'whatsapp.connect.status.connecting': 'Waiting Connection',
    'whatsapp.connect.status.connected': 'Successfully Connected',
    'whatsapp.connect.description.disconnected': 'Generating QR code for connection...',
    'whatsapp.connect.description.connecting': 'Scan the QR Code with your WhatsApp',
    'whatsapp.connect.description.connected': 'Your bot is active and ready to use!',
    'whatsapp.qr.generating': 'Generating QR Code...',
    'whatsapp.qr.scan': 'Scan in:',
    'whatsapp.qr.instructions.title': 'How to connect:',
    'whatsapp.qr.instructions.1': '1. Open WhatsApp on your phone',
    'whatsapp.qr.instructions.2': '2. Tap "Linked devices"',
    'whatsapp.qr.instructions.3': '3. Tap "Link a device"',
    'whatsapp.qr.instructions.4': '4. Scan this QR code',
    'whatsapp.qr.generate': 'Generate New QR',
    'whatsapp.qr.generating.button': 'Generating...',
    'whatsapp.connected.title': 'Connected!',
    'whatsapp.connected.description': 'Your chatbot is active and ready to respond to messages',
    'whatsapp.connected.next.title': 'Next Steps:',
    'whatsapp.connected.next.test': 'Test the bot by sending messages to',
    'whatsapp.connected.next.configure': 'Configure automatic messages',
    'whatsapp.connected.next.monitor': 'Monitor conversations in the panel',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Messages
    'message.bot.created': 'Bot created successfully!',
    'message.bot.updated': 'Bot updated successfully!',
    'message.bot.deleted': 'Bot deleted successfully!',
    'message.error.generic': 'An unexpected error occurred',
    'message.error.network': 'Connection error. Please try again.',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('esferazap-language');
    return (saved as Language) || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('esferazap-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, ...args: any[]): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    
    // Simple string interpolation for arguments
    if (args.length > 0) {
      return translation.replace(/{(\d+)}/g, (match, index) => {
        const argIndex = parseInt(index);
        return args[argIndex] !== undefined ? String(args[argIndex]) : match;
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}