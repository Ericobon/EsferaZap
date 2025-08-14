interface QueueItem<T> {
  id: string;
  data: T;
  timestamp: Date;
  retries: number;
  maxRetries: number;
}

export class MessageQueue<T = any> {
  private queue: QueueItem<T>[] = [];
  private processing = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor(
    private processor: (item: T) => Promise<void>,
    private intervalMs: number = 1000,
    private maxRetries: number = 3
  ) {}

  add(data: T, id?: string): string {
    const itemId = id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.queue.push({
      id: itemId,
      data,
      timestamp: new Date(),
      retries: 0,
      maxRetries: this.maxRetries,
    });

    this.startProcessing();
    return itemId;
  }

  private startProcessing() {
    if (this.processing) return;

    this.processing = true;
    this.processingInterval = setInterval(async () => {
      await this.processNext();
    }, this.intervalMs);
  }

  private async processNext() {
    if (this.queue.length === 0) {
      this.stopProcessing();
      return;
    }

    const item = this.queue.shift()!;

    try {
      await this.processor(item.data);
      console.log(`Queue item ${item.id} processed successfully`);
    } catch (error) {
      console.error(`Queue item ${item.id} failed:`, error);
      
      if (item.retries < item.maxRetries) {
        item.retries++;
        this.queue.push(item);
        console.log(`Queue item ${item.id} retrying (${item.retries}/${item.maxRetries})`);
      } else {
        console.error(`Queue item ${item.id} failed permanently after ${item.maxRetries} retries`);
      }
    }
  }

  private stopProcessing() {
    this.processing = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  clear() {
    this.queue = [];
    this.stopProcessing();
  }

  getItems(): QueueItem<T>[] {
    return [...this.queue];
  }
}

// Singleton instance for WhatsApp messages
export const whatsappMessageQueue = new MessageQueue(
  async (messageData: any) => {
    // This will be processed by the WhatsApp service
    console.log('Processing WhatsApp message:', messageData);
  },
  2000, // Process every 2 seconds
  3 // Max 3 retries
);