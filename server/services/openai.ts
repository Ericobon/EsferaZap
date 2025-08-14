import OpenAI from "openai";

class OpenAIService {
  async generateResponse(
    message: string,
    systemPrompt: string,
    apiKey: string
  ): Promise<string | null> {
    try {
      const openai = new OpenAI({ 
        apiKey: apiKey || process.env.OPENAI_API_KEY || '' 
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('Error generating OpenAI response:', error);
      return null;
    }
  }

  async generateResponseWithContext(
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    systemPrompt: string,
    apiKey: string
  ): Promise<string | null> {
    try {
      const openai = new OpenAI({ 
        apiKey: apiKey || process.env.OPENAI_API_KEY || '' 
      });

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...conversationHistory,
        { role: "user" as const, content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('Error generating OpenAI response with context:', error);
      return null;
    }
  }

  async analyzeSentiment(text: string, apiKey: string): Promise<{
    rating: number;
    confidence: number;
  } | null> {
    try {
      const openai = new OpenAI({ 
        apiKey: apiKey || process.env.OPENAI_API_KEY || '' 
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        rating: Math.max(1, Math.min(5, Math.round(result.rating))),
        confidence: Math.max(0, Math.min(1, result.confidence)),
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  }
}

export const openaiService = new OpenAIService();
