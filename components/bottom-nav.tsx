"use client";

import { Home, Sprout, MessageSquare, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "My Farm", icon: Sprout, href: "/farm" },
    { name: "Advisor", icon: MessageSquare, href: "/advisor" },
    { name: "Alerts", icon: Bell, href: "/alerts" },
    { name: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border dark:bg-background dark:border-border pb-safe shadow-sm">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6",
                  isActive && "fill-current text-primary"
                )}
              />
              <span className="text-[10px] uppercase tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
