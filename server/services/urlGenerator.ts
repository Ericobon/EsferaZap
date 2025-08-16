// Serviço para geração automática de URLs do servidor
export class URLGeneratorService {
  
  /**
   * Gera automaticamente a URL do servidor baseada no ambiente
   */
  static generateServerURL(): string {
    // Detectar se está no Replit
    if (process.env.REPLIT_SLUG && process.env.REPL_OWNER) {
      const replSlug = process.env.REPLIT_SLUG;
      const replOwner = process.env.REPL_OWNER;
      
      // Formato padrão do Replit: https://[slug].[owner].repl.co
      return `https://${replSlug}.${replOwner}.repl.co`;
    }
    
    // Verificar se tem REPL_ID (novo formato)
    if (process.env.REPL_ID) {
      const replId = process.env.REPL_ID;
      return `https://${replId}-00-replit.spock.replit.dev`;
    }
    
    // Para desenvolvimento local
    const port = process.env.PORT || 5000;
    if (process.env.NODE_ENV === 'development') {
      return `http://localhost:${port}`;
    }
    
    // Fallback genérico
    return `https://localhost:${port}`;
  }
  
  /**
   * Gera URL para webhook WhatsApp
   */
  static generateWebhookURL(botId: string): string {
    const baseUrl = this.generateServerURL();
    return `${baseUrl}/api/webhook/whatsapp/${botId}`;
  }
  
  /**
   * Gera URL para verificação de webhook
   */
  static generateWebhookVerifyURL(): string {
    const baseUrl = this.generateServerURL();
    return `${baseUrl}/api/webhook/verify`;
  }
  
  /**
   * Gera URLs para diferentes provedores WhatsApp
   */
  static generateProviderWebhooks(botId: string) {
    const baseUrl = this.generateServerURL();
    
    return {
      meta_business: `${baseUrl}/api/webhook/meta/${botId}`,
      twilio: `${baseUrl}/api/webhook/twilio/${botId}`,
      evolution_api: `${baseUrl}/api/webhook/evolution/${botId}`,
      baileys: `${baseUrl}/api/webhook/baileys/${botId}`,
      wppconnect: `${baseUrl}/api/webhook/wppconnect/${botId}`,
      venom: `${baseUrl}/api/webhook/venom/${botId}`
    };
  }
  
  /**
   * Detecta o ambiente atual
   */
  static detectEnvironment(): 'replit' | 'local' | 'production' {
    if (process.env.REPLIT_SLUG || process.env.REPL_ID) {
      return 'replit';
    }
    
    if (process.env.NODE_ENV === 'development') {
      return 'local';
    }
    
    return 'production';
  }
  
  /**
   * Obtém informações detalhadas do ambiente
   */
  static getEnvironmentInfo() {
    const environment = this.detectEnvironment();
    const serverURL = this.generateServerURL();
    
    return {
      environment,
      serverURL,
      isReplit: environment === 'replit',
      replSlug: process.env.REPLIT_SLUG || null,
      replOwner: process.env.REPL_OWNER || null,
      replId: process.env.REPL_ID || null,
      port: process.env.PORT || 5000,
      nodeEnv: process.env.NODE_ENV || 'production'
    };
  }
}