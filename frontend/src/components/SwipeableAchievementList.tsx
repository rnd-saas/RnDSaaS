import { useState, useMemo } from "react";
import AchievementList from "@/pages/Profile/ProfileComponents/AchievementList";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Helper function for chunking
function chunkAchievements(items: any[], size: number) {
    if (!items || items.length === 0) {
        return [[]];
    }
    const chunks = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

function Dot({ active, onClick }: { active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`size-2 rounded-full transition-colors ${
                active ? "bg-foreground" : "bg-muted-foreground/40"
            }`}
        />
    );
}

type SwipeableAchievementListProps = {
    achievements: any[];
    isLoading: boolean;
    title?: string;
    showViewAll?: boolean;
};

export default function SwipeableAchievementList({ 
    achievements, 
    isLoading, 
    title = "Achievements",
    showViewAll = true 
}: SwipeableAchievementListProps) {
    const navigate = useNavigate();
    const [achievementPage, setAchievementPage] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;

    const achievementPages = useMemo(
        () => chunkAchievements(achievements, 3),
        [achievements]
    );
    const totalAchievementPages = achievementPages.length;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && achievementPage < totalAchievementPages - 1) {
            setAchievementPage((prev) => prev + 1);
        }
        if (isRightSwipe && achievementPage > 0) {
            setAchievementPage((prev) => prev - 1);
        }
    };

    return (
        <div className="w-full">
            {(title || showViewAll) && (
                <div className="flex items-center justify-between px-1 mb-4">
                    {title && <h3 className="h3-styles font-semibold">{title}</h3>}
                    {showViewAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => navigate("/achievements")}
                        >
                            View All
                        </Button>
                    )}
                </div>
            )}
            <div
                className="overflow-hidden touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${achievementPage * 100}%)` }}
                >
                    {achievementPages.map((page, idx) => (
                        <div key={`ach-page-${idx}`} className="min-w-full">
                            <AchievementList
                                achievements={page}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {totalAchievementPages > 1 && (
                <div className="mt-2 flex items-center justify-center gap-2">
                    {achievementPages.map((_, idx) => (
                        <Dot
                            key={`ach-dot-${idx}`}
                            active={idx === achievementPage}
                            onClick={() => setAchievementPage(idx)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
