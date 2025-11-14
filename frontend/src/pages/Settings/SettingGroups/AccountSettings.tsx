import {Button} from "@/components/ui/button.tsx";

export default function AccountSettings() {
    return (
        <div className="space-y-6 w-full max-w-xl">
            {/* Logout */}
            <div className="flex items-center justify-between w-full">
                <Button id="logout" className="mr-4 whitespace-nowrap" variant={"link"}>Logout</Button>
            </div>
            {/* Delete account */}
            <div className="flex items-center justify-between w-full">
                <Button id="delete-account" variant="link">Delete account</Button>
            </div>
        </div>
    );
}