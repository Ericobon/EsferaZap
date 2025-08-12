import { makeWASocket, DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";
import { EventEmitter } from "events";
import path from "path";
import fs from "fs";

export interface WhatsAppSession {
  botId: string;
  sessionId: string;
  socket?: any;
  qrCode?: string;
  status: "disconnected" | "connecting" | "qr_required" | "connected";
  lastSeen?: Date;
}

class WhatsAppService extends EventEmitter {
  private sessions: Map<string, WhatsAppSession> = new Map();
  private sessionsDir: string;

  constructor() {
    super();
    this.sessionsDir = path.join(process.cwd(), "whatsapp_sessions");
    this.ensureSessionsDir();
  }

  private ensureSessionsDir() {
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
    }
  }

  async createSession(botId: string): Promise<WhatsAppSession> {
    const sessionId = `bot_${botId}_${Date.now()}`;
    const sessionPath = path.join(this.sessionsDir, sessionId);

    const session: WhatsAppSession = {
      botId,
      sessionId,
      status: "connecting",
      lastSeen: new Date(),
    };

    this.sessions.set(botId, session);

    try {
      const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

      const socket = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: {
          level: "silent",
          info: () => {},
          error: () => {},
          warn: () => {},
          debug: () => {},
          trace: () => {},
          child: () => ({
            level: "silent",
            info: () => {},
            error: () => {},
            warn: () => {},
            debug: () => {},
            trace: () => {},
            child: () => ({} as any),
          }),
        },
      });

      session.socket = socket;

      socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            const qrCodeDataURL = await QRCode.toDataURL(qr);
            const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");
            session.qrCode = base64Data;
            session.status = "qr_required";
            
            this.emit("qr-updated", { botId, qrCode: base64Data, status: "qr_required" });
          } catch (error) {
            console.error("Error generating QR code:", error);
            session.status = "disconnected";
          }
        }

        if (connection === "close") {
          const shouldReconnect = 
            (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          
          session.status = "disconnected";
          
          if (shouldReconnect) {
            console.log("Connection closed, reconnecting...");
            setTimeout(() => this.createSession(botId), 3000);
          } else {
            this.sessions.delete(botId);
            this.emit("session-ended", { botId });
          }
        } else if (connection === "open") {
          session.status = "connected";
          session.lastSeen = new Date();
          this.emit("connected", { botId, sessionId });
        }
      });

      socket.ev.on("creds.update", saveCreds);

      socket.ev.on("messages.upsert", (m) => {
        const messages = m.messages;
        if (messages && messages.length > 0) {
          // Handle incoming messages here
          this.emit("message", { botId, messages });
        }
      });

      return session;
    } catch (error) {
      console.error("Error creating WhatsApp session:", error);
      session.status = "disconnected";
      throw error;
    }
  }

  async getSession(botId: string): Promise<WhatsAppSession | null> {
    return this.sessions.get(botId) || null;
  }

  async generateQRCode(botId: string): Promise<WhatsAppSession> {
    // If session exists, clear it first
    if (this.sessions.has(botId)) {
      const existingSession = this.sessions.get(botId);
      if (existingSession?.socket) {
        existingSession.socket.end();
      }
      this.sessions.delete(botId);
    }

    return await this.createSession(botId);
  }

  async sendMessage(botId: string, to: string, message: string): Promise<boolean> {
    const session = this.sessions.get(botId);
    
    if (!session || !session.socket || session.status !== "connected") {
      throw new Error("WhatsApp session not connected");
    }

    try {
      await session.socket.sendMessage(to, { text: message });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  getAllSessions(): WhatsAppSession[] {
    return Array.from(this.sessions.values());
  }

  disconnectSession(botId: string): boolean {
    const session = this.sessions.get(botId);
    if (session?.socket) {
      session.socket.end();
      this.sessions.delete(botId);
      return true;
    }
    return false;
  }
}

export const whatsappService = new WhatsAppService();
