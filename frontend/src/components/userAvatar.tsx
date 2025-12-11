import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {AvatarOptionValues} from "@/utils/AvatarOptionValues.tsx";
type UserAvatarProps = {
    avatarOption: number;
    displayName: string;
};
export default function  UserAvatar({ avatarOption, displayName }: UserAvatarProps) {
    return(
    <Avatar className="w-32 h-32 shadow-xl ring-4 ring-background">
        <AvatarImage src={AvatarOptionValues[avatarOption].src}/>
        <AvatarFallback className="text-3xl font-serif">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
    );
}