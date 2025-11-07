/**
* Task & Progress service
* Handles dashboard-related API calls
*/


import apiClient from './client';


export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';


export interface Task {
id: string;
title: string;
description?: string;
assignee_id?: string;
status: TaskStatus;
progress: number; // 0..100
updated_at: string;
created_at: string;
}


export interface ProgressSummary {
total: number;
done: number;
in_progress: number;
blocked: number;
todo: number;
avg_progress: number; // 0..100
}


/**
* Get tasks for the current (logged-in) user
*/
export async function getMyTasks(): Promise<Task[]> {
return apiClient.get<Task[]>('/api/tasks', { scope: 'me' });
}


/**
* Get global/assignee progress summary for current user
*/
export async function getMyProgressSummary(): Promise<ProgressSummary> {
return apiClient.get<ProgressSummary>('/api/progress/summary', { scope: 'me' });
}


/**
* Update task progress (0..100) or status
*/
export async function updateTask(taskId: string, data: Partial<Pick<Task, 'progress' | 'status'>>): Promise<Task> {
return apiClient.put<Task>(`/api/tasks/${taskId}`, data);
}
