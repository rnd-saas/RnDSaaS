import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { progressService, onboardingService } from "@/lib/api";
import { MOODS, MOOD_KEY_TO_DB_INDEX } from "./MoodPage";

interface WeeklyReviewData {
  onboardingMood: number | null;
  onboardingMoodLabels: string[];
  weeklyMoods: Array<{ date: string; mood: number }>;
  averageMood: number | null;
  moodChange: number | null;
}

// 将入职时的情绪字符串数组映射到每日情绪的索引 (0-4)
// 这个映射基于情绪的整体倾向：负面情绪 -> 低索引，正面情绪 -> 高索引
function mapOnboardingMoodsToMoodIndex(moodStrings: string[] | null | undefined): number | null {
  if (!moodStrings || moodStrings.length === 0) return null;

  // 负面情绪关键词 -> 低索引 (0-1)
  const negativeKeywords = ['distressed', 'upset', 'scared', 'ashamed', 'guilty', 'hostile', 'irritable', 'anxious', 'insecure'];
  // 中性情绪关键词 -> 中等索引 (2)
  const neutralKeywords = ['interested', 'alert', 'nervous'];
  // 正面情绪关键词 -> 高索引 (3-4)
  const positiveKeywords = ['excited', 'strong', 'enthusiastic', 'proud', 'inspired', 'determined', 'comfortable', 'never'];

  // 检查是否有负面情绪
  const hasNegative = moodStrings.some(m => {
    const lowerM = m.toLowerCase();
    return negativeKeywords.some(keyword => lowerM.indexOf(keyword) !== -1);
  });
  
  // 检查是否有正面情绪
  const hasPositive = moodStrings.some(m => {
    const lowerM = m.toLowerCase();
    return positiveKeywords.some(keyword => lowerM.indexOf(keyword) !== -1);
  });

  // 检查是否有中性情绪
  const hasNeutral = moodStrings.some(m => {
    const lowerM = m.toLowerCase();
    return neutralKeywords.some(keyword => lowerM.indexOf(keyword) !== -1);
  });

  // 根据情绪组合决定索引
  if (hasNegative && !hasPositive) {
    // 主要是负面情绪 -> anxious (0) 或 nervous (1)
    const hasAnxious = moodStrings.some(m => {
      const lowerM = m.toLowerCase();
      return lowerM.indexOf('anxious') !== -1 || lowerM.indexOf('insecure') !== -1;
    });
    return hasAnxious ? 0 : 1;
  } else if (hasPositive && !hasNegative) {
    // 主要是正面情绪 -> comfortable (3) 或 never/great (4)
    const hasGreat = moodStrings.some(m => {
      const lowerM = m.toLowerCase();
      return lowerM.indexOf('never') !== -1 || lowerM.indexOf('great') !== -1;
    });
    return hasGreat ? 4 : 3;
  } else if (hasNeutral || (!hasNegative && !hasPositive)) {
    // 中性或混合 -> okay (2)
    return 2;
  } else {
    // 混合情绪，取平均值 -> okay (2)
    return 2;
  }
}

export default function WeeklyReview() {
  const [data, setData] = useState<WeeklyReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWeeklyReview();
  }, []);

  const loadWeeklyReview = async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取入职时的情绪
      // 注意：后端返回的是数据库原始字段名（snake_case），不是驼峰命名
      const onboardingData: any = await onboardingService.fetchResponses();
      
      // 后端返回的字段名是 gym_comfort_level，不是 gymComfortLevel
      // 支持两种字段名格式以兼容不同的数据格式
      const onboardingMoodStrings = onboardingData?.gym_comfort_level || onboardingData?.gymComfortLevel || [];
      
      // 将入职时的情绪字符串数组映射到每日情绪的索引
      const onboardingMood = mapOnboardingMoodsToMoodIndex(onboardingMoodStrings);

      // 获取本周的情绪数据
      const weekMoodsResponse = await progressService.getWeekMoods();
      const weeklyMoods = weekMoodsResponse.moods || [];

      // 计算本周平均情绪
      let averageMood: number | null = null;
      if (weeklyMoods.length > 0) {
        const sum = weeklyMoods.reduce((acc, m) => acc + m.mood, 0);
        averageMood = Math.round((sum / weeklyMoods.length) * 10) / 10;
      }

      // 计算情绪变化（平均情绪 - 入职情绪）
      const moodChange = onboardingMood !== null && averageMood !== null 
        ? averageMood - onboardingMood 
        : null;

      setData({
        onboardingMood,
        onboardingMoodLabels: onboardingMoodStrings,
        weeklyMoods,
        averageMood,
        moodChange,
      });
    } catch (err: any) {
      console.error("Failed to load weekly review:", err);
      setError(err?.message || "Failed to load weekly review data");
    } finally {
      setLoading(false);
    }
  };

  const onboardingMoodInfo = useMemo(() => {
    if (data?.onboardingMood === null || data?.onboardingMood === undefined) {
      return null;
    }
    for (let i = 0; i < MOODS.length; i++) {
      if (MOOD_KEY_TO_DB_INDEX[MOODS[i].key] === data.onboardingMood) {
        return MOODS[i];
      }
    }
    return null;
  }, [data?.onboardingMood]);

  const averageMoodInfo = useMemo(() => {
    if (data?.averageMood === null || data?.averageMood === undefined) {
      return null;
    }
    // 找到最接近平均值的情绪
    const roundedMood = Math.round(data.averageMood);
    for (let i = 0; i < MOODS.length; i++) {
      if (MOOD_KEY_TO_DB_INDEX[MOODS[i].key] === roundedMood) {
        return MOODS[i];
      }
    }
    return MOODS[2];
  }, [data?.averageMood]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // 检查是否有入职数据
  if (data.onboardingMood === null && data.onboardingMoodLabels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You haven't completed onboarding yet. Please complete onboarding to compare moods.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (data.weeklyMoods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No mood data recorded this week.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getChangeMessage = () => {
    if (data.moodChange === null) return "";
    if (data.moodChange > 0.5) {
      return "Your mood has improved significantly! Keep up this positive trend.";
    } else if (data.moodChange > 0) {
      return "Your mood is improving, great progress!";
    } else if (data.moodChange === 0) {
      return "Your mood remains stable.";
    } else if (data.moodChange > -0.5) {
      return "Your mood has slight fluctuations, which is normal.";
    } else {
      return "If you feel your mood has declined, remember to seek support.";
    }
  };

  const getChangeColor = () => {
    if (data.moodChange === null) return "text-muted-foreground";
    if (data.moodChange > 0) return "text-green-600";
    if (data.moodChange === 0) return "text-muted-foreground";
    return "text-orange-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span>📊</span>
          <span>Weekly Review: Mood Changes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mood at onboarding */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Mood at Onboarding</h3>
          {onboardingMoodInfo && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">{onboardingMoodInfo.emoji}</span>
              <div className="flex-1">
                <div className="font-medium">{onboardingMoodInfo.short}</div>
                <div className="text-xs text-muted-foreground">
                  Comfort Level: {onboardingMoodInfo.level}/5
                </div>
                {data.onboardingMoodLabels.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Original Selection: {data.onboardingMoodLabels.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Average mood this week */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Average Mood This Week</h3>
          {averageMoodInfo && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">{averageMoodInfo.emoji}</span>
              <div className="flex-1">
                <div className="font-medium">{averageMoodInfo.short}</div>
                <div className="text-xs text-muted-foreground">
                  Average Comfort Level: {data.averageMood?.toFixed(1)}/4
                  {data.weeklyMoods.length > 0 && (
                    <span className="ml-2">
                      ({data.weeklyMoods.length} days recorded)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change comparison */}
        {data.moodChange !== null && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mood Change</span>
              <span className={`text-sm font-semibold ${getChangeColor()}`}>
                {data.moodChange > 0 ? "+" : ""}
                {data.moodChange.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{getChangeMessage()}</p>
          </div>
        )}

        {/* This week's mood records */}
        {data.weeklyMoods.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">This Week's Mood Records</h3>
            <div className="space-y-1">
              {data.weeklyMoods.map((mood, idx) => {
                let moodInfo = null;
                for (let i = 0; i < MOODS.length; i++) {
                  if (MOOD_KEY_TO_DB_INDEX[MOODS[i].key] === mood.mood) {
                    moodInfo = MOODS[i];
                    break;
                  }
                }
                const date = new Date(mood.date);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                const dayNumber = date.getDate();
                const monthName = date.toLocaleDateString("en-US", { month: "short" });

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{moodInfo?.emoji || "?"}</span>
                      <span className="text-muted-foreground">
                        {dayName}, {monthName} {dayNumber}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {moodInfo?.short || `Mood ${mood.mood}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

