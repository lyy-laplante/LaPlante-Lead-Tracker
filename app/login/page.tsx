"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    setNeedsSetup(new URLSearchParams(window.location.search).get("setup") === "1");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || "Unable to sign in.");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            LaPlante Appraisals
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold text-ink">
            Lead Tracker
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-black/5 bg-surface p-6 shadow-sm"
        >
          <h2 className="mb-2 text-lg font-semibold text-ink">Enter access PIN</h2>
          <p className="mb-5 text-sm text-muted">
            Use the shared PIN provided by your team.
          </p>

          <label htmlFor="pin" className="mb-1 block text-sm font-medium text-ink">
            PIN
          </label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mb-5 w-full rounded-md border border-black/10 px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />

          {needsSetup && (
            <p className="mb-4 text-sm text-overdue" role="alert">
              Add an APP_PIN environment variable in Netlify, then redeploy the site.
            </p>
          )}

          {error && (
            <p className="mb-4 text-sm text-overdue" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "Checking..." : "Open tracker"}
          </button>
        </form>
      </div>
    </div>
  );
}
