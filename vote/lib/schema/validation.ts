import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required!"
    }),
    password: z.string().min(1, {
        message: "Password is required!"
    }),
});

export const RegisterSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Username is required!" })
        .regex(/^(?=.*[a-zA-Z])[A-Za-z0-9]+$/, { message: "Username can only contain letters" })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
});

export type FormState =
    | {
        errors?: {
            username?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined;
