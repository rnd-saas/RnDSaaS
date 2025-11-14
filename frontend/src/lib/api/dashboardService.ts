import apiClient from './client';
import type { DashboardData } from './types';

const BASE_PATH = '/api/dashboard';

export async function fetchDashboard(): Promise<DashboardData> {
    return apiClient.get<DashboardData>(BASE_PATH);
}
