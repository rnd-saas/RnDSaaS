import { apiClient } from './client';

export const paymentService = {
  createCheckoutSession: async (priceId: string) => {
    return apiClient.post<{ url: string }>('/api/payment/create-checkout-session', { priceId });
  },
  getSubscriptionStatus: async () => {
    return apiClient.get<any>('/api/payment/subscription');
  },
  cancelSubscription: async () => {
    return apiClient.post<any>('/api/payment/cancel-subscription');
  },
};
