// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/app/shared/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   // ❌ Not logged in → redirect
  //   if (!user) {
  //     redirect("/login");
  //   }

  // ✅ Logged in → render page
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
