"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useEffect, useState, useCallback } from "react";
import { Wordcloud } from "@visx/wordcloud";
import { scaleLog } from "@visx/scale";
import { Text } from "@visx/text";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { submitComment } from "../action";
import { useSocket } from "@/lib/useSocket";
import useSession from "@/lib/useSession";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

interface ClientPageProps {
  topicName: string;
  initialData: { text: string; value: number }[];
}

const COLORS = ["#143059", "#2F6B9A", "#82a6c2"];

const ClientPage = ({ topicName, initialData }: ClientPageProps) => {
  const [words, setWords] = useState(initialData);
  const [input, setInput] = useState<string>("");

  const router = useRouter();
  const { session, loading } = useSession();
  const [token, setToken] = useState<object | null>(null);

  // Handle session and token
  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
      return;
    } else if (!loading) {
      setToken(session);
    }
  }, [loading, session, router]);

  // Initialize socket connection
  const { socket, isConnected } = useSocket({
    endpoint: `http://localhost:8080`,
    token: token || {},
  });

  // Emit join-room event when connected
  useEffect(() => {
    if (isConnected && token) {
      socket.emit("join-room", `room:${topicName}`);
    }
  }, [isConnected, topicName, socket, token]);

  // Handle room updates from socket
  useEffect(() => {
    const handleRoomUpdate = (message: string) => {
      const data = JSON.parse(message) as { text: string; value: number }[];
      setWords((prevWords) => {
        const updatedWords = [...prevWords];

        data.forEach((newWord) => {
          const existingWordIndex = updatedWords.findIndex(
            (word) => word.text === newWord.text
          );

          if (existingWordIndex !== -1) {
            updatedWords[existingWordIndex].value += newWord.value;
          } else if (updatedWords.length < 50) {
            updatedWords.push(newWord);
          }
        });

        return updatedWords;
      });
    };

    socket.on("room-update", handleRoomUpdate);
    return () => {
      socket.off("room-update", handleRoomUpdate);
    };
  }, [socket]);

  // Font scale for word cloud
  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });

  // Mutation for submitting comment
  const { mutate, isPending } = useMutation({
    mutationFn: submitComment,
    onSuccess: () => {
      router.refresh();
    },
  });

  // Handle share button click
  const handleShare = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutate({ comment: input.toLowerCase(), topicName });
  };

  // Debounce input changes
  const debouncedSetInput = useCallback(
    debounce((value: string) => {
      setInput(value);
    }, 100),
    []
  );

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetInput(e.target.value);
  };

  // Render content
  const content = (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-grid-zinc-50 pb-20">
      <MaxWidthWrapper className="flex flex-col items-center gap-6 pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-tight text-balance">
          What people think about{" "}
          <span className="text-blue-600">{topicName}</span>:
        </h1>

        <p className="text-sm">(messages are updated in real-time)</p>

        <div className="aspect-square max-w-xl flex items-center justify-center">
          <Wordcloud
            words={words}
            width={500}
            height={500}
            fontSize={(data) => fontScale(data.value)}
            font={"Impact"}
            padding={2}
            spiral="archimedean"
            rotate={0}
            random={() => 0.5}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={w.text}
                  fill={COLORS[i % COLORS.length]}
                  textAnchor="middle"
                  transform={`translate(${w.x}, ${w.y})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
        </div>
        <form className="w-full max-w-lg">
          <div className="w-full">
            <Label className="font-semibold tracking-tight text-lg pb-2">
              Here&apos;s what I think about {topicName}
            </Label>
            <div className="mt-1 flex gap-2 items-center">
              <Input
                value={input}
                onChange={handleChange}
                placeholder={`${topicName} is absolutely...`}
              />
              <Button disabled={isPending} onClick={handleShare}>
                Share
              </Button>
            </div>
          </div>
        </form>
      </MaxWidthWrapper>
    </div>
  );

  return content;
};

export default ClientPage;
