"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export type SettingsActionState =
  | { ok: null }
  | { ok: true; message: string }
  | { ok: false; message: string }
  | { ok: false; fieldErrors: Record<string, string[] | undefined> }

const profileSchema = z.object({
  display_name: z.string().trim().max(160),
})

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string().min(8, "Confirm the new password."),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })

export async function updateAdminProfileAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const parsed = profileSchema.safeParse({
      display_name: formData.get("display_name"),
    })
    if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

    const { error } = await supabase
      .from("admins")
      .update({ display_name: parsed.data.display_name || null })
      .eq("user_id", user.id)
    if (error) return { ok: false, message: error.message }

    revalidatePath("/admin/settings")
    return { ok: true, message: "Profile updated." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}

export async function updateAdminPasswordAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser()
    if (authErr || !user) return { ok: false, message: "You must be signed in as an admin." }

    const parsed = passwordSchema.safeParse({
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    })
    if (!parsed.success) return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
    if (error) return { ok: false, message: error.message }

    return { ok: true, message: "Password updated." }
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unexpected error" }
  }
}
