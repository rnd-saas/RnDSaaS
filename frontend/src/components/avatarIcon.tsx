import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
export default function AvatarIcon({ icon= avatarPlaceholder}) {
return(
    <Avatar className="h-12 w-12">
        <AvatarImage src={icon} />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
)
}