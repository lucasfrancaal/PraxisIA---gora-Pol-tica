
import { v4 as uuidv4 } from 'uuid';
import { Conversation } from '../types';

// This is a mock service using localStorage to simulate a Supabase backend.

class ConversationService {
  private getStorageKey(userId: string): string {
    return `praxis_mock_conversations_${userId}`;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    return new Promise((resolve) => {
      const key = this.getStorageKey(userId);
      const data = localStorage.getItem(key);
      resolve(data ? JSON.parse(data) : []);
    });
  }

  async saveConversation(conversation: Conversation): Promise<Conversation> {
     return new Promise(async (resolve) => {
      const user = await authService.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      
      const key = this.getStorageKey(user.id);
      const conversations = await this.getConversations(user.id);
      
      const existingIndex = conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex > -1) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }
      
      localStorage.setItem(key, JSON.stringify(conversations));
      resolve(conversation);
    });
  }

  async deleteConversation(id: string): Promise<void> {
    return new Promise(async (resolve) => {
        const user = await authService.getUser();
        if (!user) throw new Error("Usuário não autenticado");
        
        const key = this.getStorageKey(user.id);
        let conversations = await this.getConversations(user.id);
        conversations = conversations.filter(c => c.id !== id);
        
        localStorage.setItem(key, JSON.stringify(conversations));
        resolve();
    });
  }
}

// Need to import authService late to avoid circular dependency issues in module loading
import { authService } from './authService';

export const conversationService = new ConversationService();