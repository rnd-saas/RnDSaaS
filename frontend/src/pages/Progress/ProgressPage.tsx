import SwipeableAchievementList from "@/components/SwipeableAchievementList";
import ChatbotButton from "@/components/chatbotButton";
import Goals from "@/pages/Progress/ProgressComponents/Goals";
import Moods from "@/pages/Progress/ProgressComponents/Moods";
import Workouts from "@/pages/Progress/ProgressComponents/Workouts";
import PlannedCalendar from "@/pages/Progress/ProgressComponents/PlannedCalendar";
import PersonalData from "@/pages/Progress/ProgressComponents/PersonalData";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { profileService, type ProfileResponse } from "@/lib/api";

export default function ProgressPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        profileService.getProfile()
            .then((data) => {
                if (mounted) {
                    setProfile(data);
                }
            })
            .catch((err) => {
                console.error('Failed to load profile:', err);
                if (mounted) {
                    setError('Failed to load profile data');
                }
            })
            .finally(() => {
                if (mounted) {
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, []);

    const progressComponents = [
        { value:"goals", render: () => {
            try {
                return <Goals />;
            } catch (error) {
                console.error('Error rendering goals:', error);
                return <div className="text-sm text-red-500">Error loading goals</div>;
            }
        }, label:"Your goals" },
        { value:"achievements", render: () => {
            try {
                return <SwipeableAchievementList 
                    achievements={profile?.achievements ?? []} 
                    isLoading={loading} 
                    title="" 
                    showViewAll={false} 
                />;
            } catch (error) {
                console.error('Error rendering achievements:', error);
                return <div className="text-sm text-red-500">Error loading achievements</div>;
            }
        }, label: "Recent Achievements" },
        { value:"moods", render: () => {
            try {
                return <Moods />;
            } catch (error) {
                console.error('Error rendering moods:', error);
                return <div className="text-sm text-red-500">Error loading moods</div>;
            }
        }, label:"This week's mood" },
        { value:"workouts", render: () => {
            try {
                return <Workouts />;
            } catch (error) {
                console.error('Error rendering workouts:', error);
                return <div className="text-sm text-red-500">Error loading workouts</div>;
            }
        }, label:"This week's workouts" },
        { value:"calendar", render: () => {
            try {
                return <PlannedCalendar />;
            } catch (error) {
                console.error('Error rendering calendar:', error);
                return <div className="text-sm text-red-500">Error loading calendar</div>;
            }
        }, label:"Workout Calendar" },
        { value:"data", render: () => {
            try {
                return <PersonalData />;
            } catch (error) {
                console.error('Error rendering personal data:', error);
                return <div className="text-sm text-red-500">Error loading personal data</div>;
            }
        }, label:"Your data" },
    ];
    useEffect(() => {
        window.tidioChatApi.show();
    }, []);
    if (loading) {
        return (
            <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-lg min-h-[75vh] min-w-[30vw] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-semibold tracking-tight">Progress</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }
  return (
    <div className="w-full max-w-lg md:max-w-4xl lg:max-w-6xl mx-auto p-6 pb-24 flex flex-col space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight font-serif">
          Progress
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your journey and body metrics.
        </p>
      </header>

      <div className="space-y-12">
        {progressComponents.map((section, index) => (
          <div
            key={section.value}
            className="animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards space-y-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold font-serif text-foreground/90 shrink-0">
                {section.label}
              </h2>
              <Separator className="flex-1" />
              {section.value === "achievements" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs shrink-0"
                  onClick={() => navigate("/achievements")}
                >
                  View All
                </Button>
              )}
            </div>

            <div className="px-1">
                {section.render()}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-14 right-6 z-50">
        <div className="shadow-lg rounded-full">
          <ChatbotButton variant={"default"} />
        </div>
      </div>
    </div>
  );
}
