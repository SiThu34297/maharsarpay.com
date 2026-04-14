import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-6 text-center text-zinc-900 dark:bg-black dark:text-zinc-100">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-zinc-600 dark:text-zinc-300">The page you requested does not exist.</p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back to home
      </Link>
    </div>
  );
}
