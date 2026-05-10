"use client"

import type { ReactNode } from "react"

import { AdminSidebar } from "./AdminSidebar"

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh w-full bg-zinc-950 text-zinc-100">
      <AdminSidebar />
      <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-zinc-950">{children}</div>
    </div>
  )
}
