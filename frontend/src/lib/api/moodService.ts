import apiClient from "./client";

type TodayMoodResponse = {
    mood: number | null;
};

export async function getTodayMood(): Promise<TodayMoodResponse> {
    return apiClient.get<TodayMoodResponse>("/api/mood/today");
}

export async function saveTodayMood(mood: number): Promise<void> {
    await apiClient.post("/api/mood/today", { mood });
}

