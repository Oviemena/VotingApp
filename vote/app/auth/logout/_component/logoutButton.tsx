"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import logout from "../logout";

interface LogoutButtonProps {
  sessionId: string;
}

const LogoutButton = ({ sessionId }: LogoutButtonProps) => {
  const onClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    await logout(sessionId);
  };
  return (
    <div>
      <Button
        variant="destructive"
        type="submit"
        // formAction={logout}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          onClick(e)
        }
      >
        LogOut
      </Button>
    </div>
  );
};

export default LogoutButton;
