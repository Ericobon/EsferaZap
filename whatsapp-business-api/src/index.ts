import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import { logger } from './utils/logger';
import { webhookRoutes } from './routes/webhook.routes';
import { messageRoutes } from './routes/message.routes';
import { mediaRoutes } from './routes/media.routes';
import { setupQueues } from './queues';
import { initializeServices } from './services';

const prisma = new PrismaClient();
const fastify = Fastify({
  logger: logger,
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  trustProxy: true
});

async function bootstrap() {
  try {
    // Registrar plugins
    await fastify.register(cors, {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
      credentials: true
    });

    await fastify.register(helmet, {
      contentSecurityPolicy: false
    });

    await fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute'
    });

    // Health check
    fastify.get('/health', async (request, reply) => {
      const dbHealthy = await prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbHealthy ? 'connected' : 'disconnected',
        version: process.env.npm_package_version
      };
    });

    // Registrar rotas
    await fastify.register(webhookRoutes, { prefix: '/webhook' });
    await fastify.register(messageRoutes, { prefix: '/api/messages' });
    await fastify.register(mediaRoutes, { prefix: '/api/media' });

    // Inicializar Socket.io para real-time
    const io = new Server(fastify.server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      
      socket.on('subscribe', (phoneNumber) => {
        socket.join(`phone:${phoneNumber}`);
        logger.info(`Client ${socket.id} subscribed to phone:${phoneNumber}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });

    // Anexar io ao fastify para uso em outros módulos
    fastify.decorate('io', io);

    // Inicializar serviços e filas
    await initializeServices();
    await setupQueues();

    // Iniciar servidor
    const port = parseInt(process.env.PORT || '8080');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    logger.info(`🚀 WhatsApp Business API Server running on ${host}:${port}`);
    logger.info(`📡 WebSocket server ready`);
    logger.info(`🔄 Background queues initialized`);
    
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await fastify.close();
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar aplicação
bootstrap();