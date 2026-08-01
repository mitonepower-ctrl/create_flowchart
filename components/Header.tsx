import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Flowchart Learning
        </Link>
        <nav className="flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
          <Link href="/" className="hover:text-black dark:hover:text-white">
            Problems
          </Link>
          <Link
            href="/admin/login"
            className="hover:text-black dark:hover:text-white"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
