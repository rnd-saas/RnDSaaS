import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import defaultAvatar from "../assets/avatars/tom_avatar.png";

export default function AvatarIcon({ icon = defaultAvatar }) {
return(
    <Avatar className="h-12 w-12">
        <AvatarImage src={icon} />
        <AvatarFallback>CN</AvatarFallback>
    </Avatar>
)
}