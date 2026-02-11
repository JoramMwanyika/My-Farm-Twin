import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Check if user has a farm
    const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { farms: true },
    });

    if (!user) {
        redirect("/login");
    }

    // If user has NO farm, they MUST go to setup
    // We need to allow them to access /setup, but this layout is in (protected)
    // If /setup is NOT in (protected), this layout won't run for it, which is fine.
    // BUT if we are on /dashboard (which IS in (protected)), we redirect.
    if (user.farms.length === 0) {
        redirect("/setup");
    }

    return (
        <div className="min-h-screen bg-[#f0efe9]">
            {children}
        </div>
    );
}
