import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Generate authorization URL for user consent
  getAuthUrl(userId: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      state: userId, // Pass user ID in state
    });
  }

  // Exchange authorization code for tokens
  async getAccessToken(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getAccessToken(code);
    return tokens;
  }

  // Set credentials for API calls
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Get user's calendar events
  async getUpcomingEvents(maxResults: number = 10): Promise<any[]> {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  // Get events for a specific date range
  async getEventsInRange(startDate: Date, endDate: Date): Promise<any[]> {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  }

  // Check availability for a specific time slot
  async checkAvailability(startTime: Date, endTime: Date): Promise<boolean> {
    const events = await this.getEventsInRange(startTime, endTime);
    return events.length === 0; // Available if no events in the time slot
  }

  // Get business hours from calendar (looking for recurring "Business Hours" events)
  async getBusinessHours(): Promise<{ start: string; end: string } | null> {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    // Look for today's events that might indicate business hours
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: today.toISOString(),
      timeMax: tomorrow.toISOString(),
      q: 'horário de atendimento OR business hours OR expediente',
      singleEvents: true,
    });

    const businessHourEvent = response.data.items?.[0];
    if (businessHourEvent?.start?.dateTime && businessHourEvent?.end?.dateTime) {
      return {
        start: new Date(businessHourEvent.start.dateTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        end: new Date(businessHourEvent.end.dateTime).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    }

    return null;
  }

  // Format event for WhatsApp message
  formatEventForWhatsApp(event: any): string {
    const startTime = event.start?.dateTime || event.start?.date;
    const endTime = event.end?.dateTime || event.end?.date;
    
    if (!startTime) return '';

    const start = new Date(startTime);
    const isAllDay = !event.start?.dateTime;
    
    let message = `📅 *${event.summary || 'Evento'}*\n`;
    
    if (isAllDay) {
      message += `📍 Data: ${start.toLocaleDateString('pt-BR')}\n`;
    } else {
      message += `📍 Data: ${start.toLocaleDateString('pt-BR')}\n`;
      message += `🕐 Horário: ${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      
      if (endTime) {
        const end = new Date(endTime);
        message += ` - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }
      message += '\n';
    }
    
    if (event.location) {
      message += `📍 Local: ${event.location}\n`;
    }
    
    if (event.description) {
      message += `📝 Descrição: ${event.description.substring(0, 200)}${event.description.length > 200 ? '...' : ''}\n`;
    }

    return message;
  }
}

export const googleCalendarService = new GoogleCalendarService();