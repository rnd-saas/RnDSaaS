import { Button } from "@/components/ui/button";
import tomImage from "@/assets/onboarding_welcome/onboarding-tom.png";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Card } from "@/components/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LoginDialog from "@/pages/Login/LoginDialog";
import RegisterDialog from "@/pages/Login/RegisterDialog";
import {useEffect, useState} from "react";

export default function DefaultPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="w-full min-w-[50vw] min-h-[90vh] relative flex flex-col">
      <header className="px-6 pt-11 pb-4">
        <div className="flex items-center justify-end">
          <ButtonGroup>
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </DialogTrigger>
              <LoginDialog
                onSwitchToRegister={() => {
                  setLoginOpen(false);
                  setRegisterOpen(true);
                }}
              />
            </Dialog>
            <ButtonGroupSeparator />
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Register</Button>
              </DialogTrigger>
              <RegisterDialog
                onSwitchToLogin={() => {
                  setLoginOpen(true);
                  setRegisterOpen(false);
                }}
              />
            </Dialog>
          </ButtonGroup>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <Card className={"p-10 hover:scale-none"}>
          <h1 className="h1-styles">Hello!</h1>
          <img
            src={tomImage}
            alt={`waving`}
            className="max-h-[55vh] object-contain"
          />
          <p>
            We're glad you decided to start your workout journey with us.
            <br />
            Just register and answer a few short questions about your goals!
          </p>
        </Card>
      </main>
    </div>
  );
}
