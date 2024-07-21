"use client";

import React from "react";
import { RegisterButton } from "./registerButton";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { signup } from "../register";
import Link from "next/link";

const RegisterForm = () => {
  const [state, action] = useFormState(signup, undefined);

  return (
    <div>
      <form action={action}>
        <div className="my-2 flex flex-col space-y-2">
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your Username"
              className={`h-14 border font-mono rounded-lg px-4 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:bg-white dark:bg-opacity-80 ${
                state?.errors?.username
                  ? "border-red-500"
                  : "border border-white"
              }`}
            />
          </div>
          {state?.errors?.username && (
            <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
              {state.errors.username}
            </p>
          )}
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              className={`h-14 border rounded-lg font-mono px-4 dark:focus:bg-opacity-100 transition-all dark:outline-none dark:bg-white dark:bg-opacity-80 ${
                state?.errors?.email ? "border-red-500" : "border border-white"
              }`}
            />
          </div>
          {state?.errors?.email && (
            <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
              {state.errors.email}
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
                state?.errors?.password
                  ? "border-red-500"
                  : "border border-white"
              }`}
              color="secondary"
            />
          </div>
          {state?.errors?.password && (
            <ul className="my-2">
              {state.errors.password.map((error, index) => (
                <li
                  key={index}
                  className="flex items-center gap-x-2 text-sm text-red-500 font-semibold"
                >
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
        {state?.error && (
            <p className="my-2 flex items-center gap-x-2 text-sm text-red-500 font-semibold">
              {state.error}
            </p>
          )}
        <RegisterButton />
        <div>
          <p>
            Already have an account? <Link href="/auth/login">Log in here</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
