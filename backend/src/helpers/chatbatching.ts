import { prisma } from "../lib/prisma";

interface BufferedMessage {
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

class ChatBatcher {
  private queue: BufferedMessage[] = [];
  private BATCH_INTERVAL = 5000; 
  private MAX_BATCH_SIZE = 100;  

  constructor() {
    setInterval(() => this.flush(), this.BATCH_INTERVAL);
  }

  public add(message: BufferedMessage) {
    this.queue.push(message);
    if (this.queue.length >= this.MAX_BATCH_SIZE) {
      this.flush();
    }
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const messagesToSave = [...this.queue];
    this.queue = [];

    try {
      await prisma.mensagem.createMany({
        data: messagesToSave.map(msg => ({
           conversa_id: msg.chatId,
           remetente_id: msg.senderId,
           conteudo: msg.content,
           data_envio: msg.timestamp,
           lido_por: [msg.senderId] 
        }))
      });
    } catch (error) {
      console.error("Error saving chat messages:", error);
    }
  }
}

export const chatBatcher = new ChatBatcher();