"use server";

import { FormState, LoginSchema } from "@/lib/schema/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveSession } from "@/lib/session";
import { getUserByUsername } from "@/lib/user";
import { scrypt } from "crypto";
import { genId } from "@/lib/utils";

export async function login(state: FormState, formData: FormData) {
    const validatedFields = LoginSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const userResult = await getUserByUsername(validatedFields.data.username);

    // Check if there is an error retrieving the user
    if ("error" in userResult) {
        return { error: userResult.error };
    }

    const user = userResult;

    // Debugging: Log the stored password to verify its format
    console.log("Stored Password:", user.password);

    const passwordMatch = await comparePasswords(
        validatedFields.data.password,
        user.password
    );

    if (!passwordMatch) return { error: "Invalid password!" };

    // Create a session for the user
    const session = {
        id: genId(),
        userId: user.id,
        username: user.username,
        email: user.email
    };
    console.log(session);

    await saveSession(session);

    revalidatePath("/", "layout");
    redirect("/");
}

const comparePasswords = async (password: string, storedPassword: string) => {
    const [hashed, salt] = storedPassword.split(".");

    if (!salt) return { error: "Password do not match!" };

    return new Promise((resolve, reject) => {
        scrypt(password, salt, 32, (err, key) => {
            if (err) {
                reject(err);
            }
            resolve(key.toString("hex") === hashed);
        });
    });
};
