/**
 * API Client
 * Unified management of all API requests
 */

import { ApiError } from './types';

// API base URL, read from environment variables, defaults to localhost:4000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    /**
     * Get full request URL
     */
    private getFullUrl(endpoint: string, params?: Record<string, any>): string {
        const url = endpoint.startsWith('http') 
            ? endpoint 
            : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            return queryString ? `${url}?${queryString}` : url;
        }
        
        return url;
    }

    /**
     * Get request headers
     */
    private getHeaders(customHeaders?: HeadersInit): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        // Add token to request header if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Handle response
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');
        
        const data = isJson ? await response.json() : await response.text();
        
        if (!response.ok) {
            const error = isJson 
                ? (data.error || { message: data.message || 'An error occurred' })
                : { message: data || 'An error occurred' };
            
            throw new ApiError(
                error.message || 'An error occurred',
                response.status,
                error.code,
                error.details
            );
        }
        
        return data;
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = this.getFullUrl(endpoint, params);
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, data?: any): Promise<T> {
        const url = this.getFullUrl(endpoint);
        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, data?: any): Promise<T> {
        const url = this.getFullUrl(endpoint);
        const response = await fetch(url, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        return this.handleResponse<T>(response);
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        const url = this.getFullUrl(endpoint);
        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        return this.handleResponse<T>(response);
    }

    /**
     * Save token
     */
    setToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    /**
     * Clear token
     */
    clearToken(): void {
        localStorage.removeItem('auth_token');
    }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

