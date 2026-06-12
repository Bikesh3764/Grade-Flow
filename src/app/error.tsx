'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <AlertTriangle className="w-24 h-24 text-red-500/80 mb-8" />
      <h1 className="text-5xl font-bold text-on-surface mb-4">Something went wrong!</h1>
      <p className="text-on-surface-variant max-w-md mb-8 text-lg">
        We've encountered an unexpected server error (500). Our technical team has been notified.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all inline-flex items-center gap-2 font-semibold"
        >
          <RefreshCw size={18} />
          Try again
        </button>
        <Link href="/" className="bg-surface text-on-surface border border-outline-variant font-label-md px-6 py-3 rounded-full shadow-sm hover:bg-surface-container transition-all inline-flex items-center gap-2 font-semibold">
          <Home size={18} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
