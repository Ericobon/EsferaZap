import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI with API key
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function generateChatResponse(
  messages: ChatMessage[],
  systemPrompt?: string,
  temperature: number = 0.7
): Promise<ChatResponse> {
  try {
    // Convert messages to Gemini format
    const prompt = messages.map(msg => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return `${role}: ${msg.content}`;
    }).join('\n');

    // Add system prompt if provided
    const fullPrompt = systemPrompt 
      ? `${systemPrompt}\n\n${prompt}\nmodel:`
      : `${prompt}\nmodel:`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        temperature: temperature,
        maxOutputTokens: 1000,
      },
    });

    const text = result.text || "";

    return {
      content: text,
      usage: {
        prompt_tokens: 0, // Gemini doesn't provide detailed token usage
        completion_tokens: 0,
        total_tokens: 0
      }
    };
  } catch (error) {
    console.error('Erro ao gerar resposta com Gemini:', error);
    throw new Error(`Falha ao gerar resposta: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function generateWhatsAppResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  botPersonality?: string,
  temperature: number = 0.7
): Promise<string> {
  try {
    const systemPrompt = botPersonality || 
      "Você é um assistente útil e amigável que responde mensagens do WhatsApp. " +
      "Mantenha suas respostas concisas, naturais e apropriadas para mensagens de texto. " +
      "Seja profissional mas caloroso no atendimento.";

    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await generateChatResponse(messages, systemPrompt, temperature);
    return response.content;
  } catch (error) {
    console.error('Erro ao gerar resposta do WhatsApp:', error);
    throw error;
  }
}

export async function analyzeSentiment(textToAnalyze: string): Promise<{
  rating: number;
  confidence: number;
}> {
  try {
    const systemPrompt = `Você é um especialista em análise de sentimento. 
Analise o sentimento do texto e forneça uma classificação de 1 a 5 estrelas e um nível de confiança entre 0 e 1.
Responda com JSON neste formato: 
{'rating': number, 'confidence': number}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `${systemPrompt}\n\nTexto para análise: ${textToAnalyze}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawJson = result.text;

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        rating: Math.max(1, Math.min(5, Math.round(data.rating))),
        confidence: Math.max(0, Math.min(1, data.confidence))
      };
    } else {
      throw new Error("Resposta vazia do modelo");
    }
  } catch (error) {
    console.error('Erro ao analisar sentimento:', error);
    throw new Error(`Falha ao analisar sentimento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function summarizeConversation(messages: ChatMessage[]): Promise<string> {
  try {
    const conversationText = messages.map(msg => 
      `${msg.role === 'user' ? 'Cliente' : 'Bot'}: ${msg.content}`
    ).join('\n');

    const prompt = `Resuma a seguinte conversa de WhatsApp de forma concisa, destacando os pontos principais:\n\n${conversationText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 300,
      },
    });

    return result.text || "";
  } catch (error) {
    console.error('Erro ao resumir conversa:', error);
    throw new Error(`Falha ao resumir conversa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}