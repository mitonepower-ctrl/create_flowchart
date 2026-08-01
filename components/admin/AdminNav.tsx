"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const links = [
    { href: "/admin/dashboard", label: "แดชบอร์ด" },
    { href: "/admin/problems", label: "จัดการโจทย์" },
  ];

  return (
    <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
      <nav className="flex gap-4 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "text-black dark:text-white"
                : "text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={signOut}
        className="text-sm font-medium text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
      >
        ออกจากระบบ
      </button>
    </div>
  );
}
