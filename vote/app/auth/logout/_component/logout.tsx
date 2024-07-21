import React from "react";
import LogoutButton from "./logoutButton";

interface LogoutProps {
  session: {
    id: string;
  } | null;
}
const logout = ({ session }: LogoutProps) => {
  return <div>{session && <LogoutButton sessionId={session.id} />}</div>;
};

export default logout;
