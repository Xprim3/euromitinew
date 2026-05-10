import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sbKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!sbUrl || !sbKey) return response

  const supabase = createServerClient(sbUrl, sbKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isLogin = pathname === "/admin/login"
  const needsAuth = pathname.startsWith("/admin") && !isLogin

  if (needsAuth && !user) {
    const next = new URL("/admin/login", request.url)
    next.searchParams.set("next", pathname)
    return NextResponse.redirect(next)
  }

  if (isLogin && user) {
    const nextParam = request.nextUrl.searchParams.get("next")
    const safeNext =
      nextParam &&
      nextParam.startsWith("/admin") &&
      !nextParam.startsWith("/admin//") &&
      !nextParam.includes("://")
        ? nextParam
        : "/admin/dashboard"
    return NextResponse.redirect(new URL(safeNext, request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
