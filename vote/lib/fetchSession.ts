"use server"

import { cookies } from "next/headers";
import { getSession } from "./session";

const fetchSession = async () => {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("session-id")?.value;
    console.log("Session ID:", sessionId);
    const session = sessionId ? await getSession(sessionId) : null;
    console.log("Fetched session:", session);
    return session
  } catch (error) {
    console.error("Error in fetchSession:", error);
    return null;
  }
};

export default fetchSession;
