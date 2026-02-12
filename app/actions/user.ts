"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function updateUserLanguage(language: string) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    try {
        await db.user.update({
            where: { email: session.user.email },
            data: { language },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update language:", error);
        return { error: "Failed to update language" };
    }
}
