"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, BookText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">Grammarin</span>
        </Link>

        {/* Nav + Actions */}
        <div className="flex items-center gap-2">
          {/* shadcn NavigationMenu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/grammar" className="flex items-center gap-1.5">
                    <BookText className="w-4 h-4" />
                    Grammar
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* HSK badge */}
          {/* <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
            HSK 2
          </span> */}

          {/* Sign out */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}