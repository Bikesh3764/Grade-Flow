import Link from 'next/link';
import { SearchX, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <SearchX className="w-24 h-24 text-primary/50 mb-8" />
      <h1 className="text-6xl font-bold text-on-surface mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-on-surface mb-4">Page Not Found</h2>
      <p className="text-on-surface-variant max-w-md mb-8 text-lg">
        We couldn't find the page you're looking for. The link might be broken, or the page may have been removed.
      </p>
      <Link href="/" className="bg-primary text-on-primary font-label-md px-8 py-3 rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all inline-flex items-center gap-2 font-semibold">
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}
