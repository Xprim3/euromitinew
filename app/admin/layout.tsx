import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Admin Panel",
  },
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function AdminBranchLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-100 antialiased">
      {children}
    </div>
  )
}
