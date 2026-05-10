import { cn } from "@/lib/utils"

/** Small banner reminding operators that Phase 5 admin is UI-only (no persistence). */

export function MockPersistHint({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-200/95 text-xs",
        className
      )}
    >
      Phase 5–8: admin saves are illustrative until authenticated writes land. Homepage fuel reads Supabase when
      env vars are set; after Table Editor updates, optionally flush ISR via{" "}
      <code className="rounded bg-amber-500/25 px-1 font-mono text-[0.7rem] text-amber-100">POST /api/revalidate</code>{" "}
      (Bearer <span className="font-mono text-[0.7rem]">REVALIDATE_SECRET</span>) when configured.
    </p>
  )
}
