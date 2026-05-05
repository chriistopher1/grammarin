// app/(public)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/app/shared/Navbar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // ❌ Not logged in → redirect
  if (user) {
    redirect("/grammar");
  }

  console.log("PUBLIC LAYOUT RENDERED, USER:", user);

  // ✅ Logged in → render page
  return (
    <div>
      {/* <Navbar /> */}
      {children}
    </div>
  );
}
