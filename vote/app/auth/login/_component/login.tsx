"use client";

import React from "react";
import { LoginButton } from "./loginButton";
import { useFormState } from "react-dom";
import { login } from "../login";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const LoginForm = () => {
  const [state, action] = useFormState(login, undefined);
  return (
    <form action={action}>
      <div className="my-2 flex flex-col space-y-2">
        <div className="flex flex-col">
          <label htmlFor="username">Name</label>
          <Input
            id="username"
            name="username"
            placeholder="Enter your Username"
            className={`h-14 border font-mono rounded-lg px-4 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:bg-white dark:bg-opacity-80 ${
              state?.errors?.username ? "border-red-500" : "border border-white"
            }`}
            autoComplete="true"
          />
        </div>
        {state?.errors?.username && (
          <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
            {state.errors.username}
          </p>
        )}
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className={`h-14 border font-mono rounded-lg px-4 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:bg-white dark:bg-opacity-80 ${
              state?.errors?.password ? "border-red-500" : "border border-white"
            }`}
            color="secondary"
          />
        </div>
        {state?.errors?.password && (
          <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
            {state.errors.password}
          </p>
        )}
        {state?.error && (
          <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
            {state.error}
          </p>
        )}
      </div>
      <LoginButton />
      <div>
        <p>
          Don&apos;t have an account?<Link href="/auth/register">Sign up</Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
