import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

/**
 * Invalidate cached ISR pages after CMS / Supabase edits.
 * Headers: Authorization: Bearer <REVALIDATE_SECRET>
 * Body optional JSON `{ "paths": string[] }` — defaults to ["/"]
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || secret.length < 8) {
    return NextResponse.json({ ok: false, error: "Revalidation disabled" }, { status: 503 })
  }

  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({})) as { paths?: string[] }

    const rawPaths =
      Array.isArray(body.paths) && body.paths.length > 0
        ? body.paths.filter((x): x is string => typeof x === "string")
        : ["/"]

    const paths = [...new Set(rawPaths.map((p) => (p === "" ? "/" : p)))]

    for (const p of paths) {
      if (p.startsWith("/")) {
        revalidatePath(p)
      }
    }

    return NextResponse.json({ ok: true, revalidated: { paths } })
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
