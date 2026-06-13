"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold text-label-lg"
    >
      {copied ? <Check size={18} /> : <Share2 size={18} />}
      <span>{copied ? "Copied!" : "Share Result"}</span>
    </button>
  );
}
