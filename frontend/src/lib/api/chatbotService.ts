import apiClient from './client';
import type { ChatbotRequest, ChatbotResponse } from './types';

export async function sendMessage(payload: ChatbotRequest): Promise<ChatbotResponse> {
    return apiClient.post<ChatbotResponse>('/api/chatbot', payload);
}
