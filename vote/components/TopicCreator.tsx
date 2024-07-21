"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { createTopic } from "@/app/action";
import useSession from "@/lib/useSession";
import { usePathname, useRouter } from "next/navigation";

const TopicCreator = () => {
  const { session, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");

  // Fetch session on component mount and when route changes
  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
      return;
    }
  }, [pathname, loading, session, router]);

  const { mutate, error, isPending } = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      return null;
    },
  });

  const handleCreateTopic = () => {
    mutate({ topicName: input });
    router.refresh();
  };

  return (
    <div className="mt-12 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          className="bg-white min-w-64"
          placeholder="Enter topic here..."
          value={input}
          onChange={({ target }) => setInput(target.value)}
        />
        <Button disabled={isPending} onClick={handleCreateTopic}>
          Create
        </Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
};

export default TopicCreator;
