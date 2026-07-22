"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-4 text-center text-zinc-50">
          <p className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </p>
          <p className="max-w-sm text-sm text-zinc-400">
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
