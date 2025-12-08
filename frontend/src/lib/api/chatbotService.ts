import apiClient from './client';
import type { ChatbotRequest, ChatbotResponse, ChatbotTrainerProfile } from './types';

export async function sendMessage(payload: ChatbotRequest): Promise<ChatbotResponse> {
    return apiClient.post<ChatbotResponse>('/api/chatbot', payload);
}

export async function fetchProfile(): Promise<ChatbotTrainerProfile> {
    return apiClient.get<ChatbotTrainerProfile>('/api/chatbot/profile');
}

export async function generatePlan(messages: any[]): Promise<any> {
    return apiClient.post('/api/chatbot/generate-plan', { messages });
}
