import Link from "next/link";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 text-xl font-bold tracking-tight text-foreground",
        className
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-coral text-coral">
        <Home size={18} strokeWidth={2.5} aria-hidden />
      </span>
      <span>
        encuentra<span className="text-coral">.</span>
      </span>
      <span className="sr-only">— inicio</span>
    </Link>
  );
}
