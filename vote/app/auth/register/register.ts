"use server";

import { randomBytes, scrypt } from "crypto";
import { FormState, RegisterSchema } from "@/lib/schema/validation";
import { redirect } from 'next/navigation';
import { createUser } from "@/lib/user";

export async function signup(state: FormState, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const [hashed, salt] = await saltAndHash(validatedFields.data.password);

    const createUserResult = await createUser({
        password: `${hashed}.${salt}`,
        username: validatedFields.data.username,
        email: validatedFields.data.email
    });

    if ('error' in createUserResult) {
        return { error: createUserResult.error };
    }

    redirect('/auth/login');
}

const saltAndHash = (password: string): Promise<[string, string]> => {
    const salt = randomBytes(4).toString('hex');
    return new Promise((resolve, reject) => {
        scrypt(password, salt, 32, (err, key) => {
            if (err) {
                reject(err);
            }
            resolve([key.toString('hex'), salt]);
        });
    });
};
