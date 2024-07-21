"use client";

import React, { useEffect, useState } from "react";
import Logout from "../logout/_component/logout";
import {
  Menu,
  ChevronLeft,
  LogOut,
  User,
  MailCheck,
  Signal,
} from "lucide-react";
import useSession from "@/lib/useSession";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logout from "../logout/logout";
import { useAppContext } from "@/lib/isConnectedContext";

const UserProfile = () => {
  const { session, loading } = useSession();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { isConnected } = useAppContext();
  useEffect(() => {
    if (!loading && session) {
      setName(session.username);
      setEmail(session.email);
    }
  }, [loading, session]);

  const handleLogout = async () => {
    if (session?.id) {
      await logout(session.id);
    }
  };

  const pages = ["/", "/auth/login", "/auth/signup"];
  return (
    <div className="mt-3 flex items-center justify-between">
      {!pages.includes(pathname) ? (
        <div
          onClick={() => router.back()}
          className="cursor-pointer flex justify-start"
        >
          <ChevronLeft width="60px" height="50px" />
        </div>
      ) : (
        <div className="flex-grow"></div>
      )}
      <div className="sm:flex sm:gap-4 hidden mr-2 sm:justify-end flex-grow sm:flex-grow-0">
        <div className="bg-gray-200 w-114 h-10 p-2 rounded-sm flex-shrink-0">
          <h3 className="font-black leading-snug capitalize italic text-gray-700 items-center justify-center">
            {name}
          </h3>
        </div>
        <div>
          <Logout session={session} />
        </div>
      </div>
      {pages.includes("/") ? (
        <div className="flex mr-2 sm:hidden justify-end cursor-pointer">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Menu width="60px" height="50px" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-15 mr-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MailCheck className="mr-2 h-4 w-4" />
                  <span>{email}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Signal className="mr-2 h-4 w-4" />
                <span>{isConnected ? "Connected" : "Not Connected"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="focus:bg-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfile;
