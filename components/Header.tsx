"use client";

import Link from "next/link";

export default function Header() {
  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <header className="border-b border-black/5 bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-accent">
            LaPlante Appraisals
          </span>
          <span className="font-display text-lg font-semibold text-ink">
            Lead Tracker
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/leads/new"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary-dark"
          >
            Add lead
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-muted transition hover:text-ink"
          >
            Lock tracker
          </button>
        </nav>
      </div>
    </header>
  );
}
