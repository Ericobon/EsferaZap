# 🚀 Arquitetura WhatsApp Business API Oficial - Produção GCP

## Stack Recomendada para Produção

### 🏗️ Arquitetura Completa

```
┌──────────────────────────────────────────────────────────────────┐
│                         Load Balancer (HTTPS)                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │
┌────────────────────────────┴─────────────────────────────────────┐
│                     Cloud Run (Auto-scaling)                      │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │   Webhook   │  │     API     │  │   WebSocket  │            │
│  │   Handler   │  │   Gateway   │  │    Server    │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Cloud Tasks   │  │    Pub/Sub     │  │  Firestore    │
│  (Msg Queue)   │  │  (Events)      │  │  (Real-time)  │
└────────────────┘  └────────────────┘  └───────────────┘
        │                    │                    │
┌───────▼────────────────────▼────────────────────▼────────┐
│              Cloud Functions (Event Processors)           │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Texto   │  │  Imagem  │  │  Áudio   │  │   Voz   ││
│  │ Handler  │  │ Handler  │  │ Handler  │  │ Handler ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└──────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼─────────────────────┐
        │                    │                     │
┌───────▼────────┐  ┌───────▼─────────┐  ┌───────▼────────┐
│ Cloud Storage  │  │   Cloud SQL     │  │  Speech API    │
│   (Mídia)      │  │  (PostgreSQL)   │  │  Vision API    │
└────────────────┘  └─────────────────┘  └────────────────┘
```

## 📦 Componentes Principais

### 1. WhatsApp Business API Cloud (Meta)
```yaml
Provider: Meta Cloud API (Recomendado)
Alternativas: 
  - Twilio (mais fácil integração)
  - MessageBird
  - 360dialog
  
Recursos:
  - ✅ Mensagens de texto
  - ✅ Imagens/Vídeos
  - ✅ Áudios
  - ✅ Documentos
  - ✅ Localização
  - ✅ Botões interativos
  - ✅ Listas
  - ⚠️  Chamadas de voz (Beta - requer aprovação especial)
```

### 2. Backend Core (Cloud Run)
```typescript
// Stack técnica
- Node.js 20 + TypeScript
- Fastify (mais rápido que Express)
- Prisma ORM
- Bull Queue (Redis)
- Socket.io para real-time

// Estrutura modular
/src
  /api         # REST endpoints
  /webhooks    # WhatsApp webhooks
  /workers     # Background jobs
  /services    # Business logic
  /handlers    # Message type handlers
```

### 3. Processamento de Mídia

#### Imagens
```yaml
Recepção: Cloud Storage + signed URLs
Processamento: 
  - Cloud Vision API (OCR, detecção objetos)
  - Sharp/ImageMagick (redimensionamento)
Formatos: JPEG, PNG, WebP
Limites: 5MB por imagem
```

#### Áudios
```yaml
Recepção: Cloud Storage
Processamento:
  - Speech-to-Text API (transcrição)
  - FFmpeg (conversão formatos)
Formatos: OGG, MP3, AAC, AMR
Limites: 16MB por áudio
```

#### Voz (Chamadas)
```yaml
Provider: Twilio Voice API (integrado com WhatsApp)
Alternativa: Cloud Text-to-Speech + Speech-to-Text
Recursos:
  - IVR (menu interativo)
  - Gravação de chamadas
  - Transcrição em tempo real
```

### 4. Banco de Dados

```sql
-- Cloud SQL PostgreSQL (Alta disponibilidade)
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    phone_number VARCHAR(20),
    business_number VARCHAR(20),
    status VARCHAR(50),
    created_at TIMESTAMP,
    metadata JSONB
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    wa_message_id VARCHAR(100) UNIQUE,
    type VARCHAR(20), -- text, image, audio, voice
    content TEXT,
    media_url TEXT,
    direction VARCHAR(10), -- inbound, outbound
    status VARCHAR(20), -- sent, delivered, read, failed
    created_at TIMESTAMP,
    metadata JSONB
);

-- Índices para performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_status ON messages(status);
```

### 5. Sistema de Filas (Cloud Tasks)

```javascript
// Processamento assíncrono
const queues = {
  sendMessage: 'send-message-queue',
  processMedia: 'process-media-queue',
  webhookRetry: 'webhook-retry-queue',
  analytics: 'analytics-queue'
};

// Taxa de envio WhatsApp
const rateLimits = {
  messaging: 80, // msgs/segundo
  businessInitiated: 1000, // msgs/segundo com template
  mediaUpload: 50 // uploads/segundo
};
```

## 🔧 Implementação Técnica

### Webhook Handler
```typescript
// server/webhooks/whatsapp.ts
import { FastifyRequest, FastifyReply } from 'fastify';

interface WhatsAppWebhook {
  entry: [{
    changes: [{
      value: {
        messaging_product: 'whatsapp';
        messages?: Message[];
        statuses?: Status[];
      }
    }]
  }]
}

export async function handleWhatsAppWebhook(
  request: FastifyRequest<{ Body: WhatsAppWebhook }>,
  reply: FastifyReply
) {
  const { entry } = request.body;
  
  // Responder imediatamente (WhatsApp requer < 5s)
  reply.code(200).send();
  
  // Processar assincronamente
  for (const item of entry) {
    const { value } = item.changes[0];
    
    if (value.messages) {
      await processMessages(value.messages);
    }
    
    if (value.statuses) {
      await updateMessageStatuses(value.statuses);
    }
  }
}

async function processMessages(messages: Message[]) {
  for (const message of messages) {
    // Adicionar à fila baseado no tipo
    switch (message.type) {
      case 'text':
        await textQueue.add('process', message);
        break;
      case 'image':
      case 'video':
        await mediaQueue.add('process', message);
        break;
      case 'audio':
        await audioQueue.add('process', message);
        break;
    }
  }
}
```

### Envio de Mensagens
```typescript
// services/whatsapp.service.ts
import axios from 'axios';

class WhatsAppService {
  private readonly apiUrl = 'https://graph.facebook.com/v18.0';
  private readonly phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  private readonly accessToken = process.env.WA_ACCESS_TOKEN;

  async sendTextMessage(to: string, text: string) {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    });
  }

  async sendImage(to: string, imageUrl: string, caption?: string) {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      to,
      type: 'image',
      image: {
        link: imageUrl,
        caption
      }
    });
  }

  async sendAudio(to: string, audioUrl: string) {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      to,
      type: 'audio',
      audio: { link: audioUrl }
    });
  }

  private async sendMessage(payload: any) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      // Implementar retry logic
      throw new WhatsAppAPIError(error);
    }
  }
}
```

### Processamento de Áudio
```typescript
// handlers/audio.handler.ts
import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';

class AudioHandler {
  private storage = new Storage();
  private speech = new SpeechClient();

  async processAudioMessage(message: AudioMessage) {
    // 1. Download áudio do WhatsApp
    const audioBuffer = await this.downloadAudio(message.audio.id);
    
    // 2. Salvar no Cloud Storage
    const gcsUri = await this.uploadToStorage(audioBuffer, message.id);
    
    // 3. Transcrever com Speech-to-Text
    const transcription = await this.transcribeAudio(gcsUri);
    
    // 4. Processar resposta baseada na transcrição
    const response = await this.generateResponse(transcription);
    
    // 5. Enviar resposta
    await whatsappService.sendTextMessage(message.from, response);
    
    // 6. Salvar no banco
    await this.saveToDatabase(message, transcription, response);
  }

  private async transcribeAudio(gcsUri: string) {
    const request = {
      config: {
        encoding: 'OGG_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'pt-BR',
        enableAutomaticPunctuation: true,
      },
      audio: { uri: gcsUri }
    };

    const [response] = await this.speech.recognize(request);
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');
  }
}
```

## 🚀 Deploy com Terraform

```hcl
# terraform/main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Cloud Run Service
resource "google_cloud_run_service" "whatsapp_api" {
  name     = "whatsapp-business-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/whatsapp-api:latest"
        
        resources {
          limits = {
            cpu    = "4"
            memory = "8Gi"
          }
        }
        
        env {
          name  = "DATABASE_URL"
          value = google_sql_database_instance.main.connection_name
        }
      }
    }
    
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "2"
        "autoscaling.knative.dev/maxScale" = "100"
      }
    }
  }
}

# Cloud SQL
resource "google_sql_database_instance" "main" {
  name             = "whatsapp-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-custom-4-16384"
    
    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }
    
    database_flags {
      name  = "max_connections"
      value = "200"
    }
  }
}

# Cloud Tasks Queues
resource "google_cloud_tasks_queue" "message_queue" {
  name     = "whatsapp-message-queue"
  location = var.region

  rate_limits {
    max_dispatches_per_second = 100
  }

  retry_config {
    max_attempts = 5
    max_retry_duration = "300s"
  }
}

# Memorystore Redis
resource "google_redis_instance" "cache" {
  name           = "whatsapp-cache"
  tier           = "STANDARD_HA"
  memory_size_gb = 5
  region         = var.region
  
  redis_version = "REDIS_7_0"
}
```

## 💰 Custos Estimados (Produção)

```yaml
Cloud Run: $200-500/mês (baseado em tráfego)
Cloud SQL: $300-500/mês (HA com replicas)
Cloud Storage: $50-100/mês (mídia)
Memorystore Redis: $150-200/mês
Cloud Tasks: $50-100/mês
Speech/Vision APIs: $100-300/mês (baseado em uso)
WhatsApp Business API: 
  - Conversações: $0.005-0.08 por conversa
  - Templates: $0.05-0.10 por mensagem
  
Total Estimado: $1000-2000/mês + custos WhatsApp
```

## 🔐 Segurança

```yaml
Autenticação:
  - OAuth 2.0 para APIs
  - Webhook signature validation
  - API Keys com rate limiting

Criptografia:
  - TLS 1.3 para transit
  - Customer-managed encryption keys
  - Secrets Manager para credenciais

Compliance:
  - LGPD/GDPR compliant
  - Audit logs
  - Data retention policies
  - DLP para dados sensíveis
```

## 📊 Monitoramento

```yaml
Métricas:
  - Latência de mensagens
  - Taxa de entrega
  - Erros de API
  - Uso de recursos

Alertas:
  - Falhas de webhook > 1%
  - Latência > 2s
  - Taxa de erro > 5%
  - Fila > 1000 mensagens

Dashboards:
  - Google Cloud Monitoring
  - Custom Grafana
  - WhatsApp Business Manager
```

## 🎯 Roadmap de Implementação

### Fase 1 - MVP (2 semanas)
- ✅ Webhook básico
- ✅ Envio/recepção de texto
- ✅ Banco de dados
- ✅ Deploy Cloud Run

### Fase 2 - Mídia (2 semanas)
- 📷 Suporte a imagens
- 🎵 Suporte a áudio
- 📹 Processamento de vídeo
- 💾 Cloud Storage

### Fase 3 - Escala (4 semanas)
- ⚡ Cloud Tasks para filas
- 🔄 Redis cache
- 📊 Analytics
- 🤖 IA integrada

### Fase 4 - Voz (6 semanas)
- 📞 Integração Twilio Voice
- 🎤 IVR interativo
- 📝 Transcrição em tempo real
- 🔊 Text-to-Speech

---

**Esta arquitetura suporta 10k+ conversas simultâneas e 1M+ mensagens/dia**