"use client"

import { useActionState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import {
  updateAdminPasswordAction,
  updateAdminProfileAction,
  type SettingsActionState,
} from "@/app/admin/(panel)/settings/actions"
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton"
import {
  AdminContentGrid,
  AdminSectionCard,
  ErrorMessage,
  SaveBar,
  SuccessMessage,
  TextInput,
} from "@/components/admin/design-system"

type AdminSettingsClientProps = {
  userEmail: string
  userId: string
  displayName: string
  lastUpdated: string | null
}

const initialState: SettingsActionState = { ok: null }

export function AdminSettingsClient({ userEmail, userId, displayName, lastUpdated }: AdminSettingsClientProps) {
  const router = useRouter()
  const profileFormRef = useRef<HTMLFormElement>(null)
  const passwordFormRef = useRef<HTMLFormElement>(null)
  const [profileState, profileAction] = useActionState(updateAdminProfileAction, initialState)
  const [passwordState, passwordAction] = useActionState(updateAdminPasswordAction, initialState)

  useEffect(() => {
    if (profileState.ok === true) router.refresh()
  }, [profileState.ok, router])

  useEffect(() => {
    if (passwordState.ok === true) passwordFormRef.current?.reset()
  }, [passwordState.ok])

  const profileErrors = profileState.ok === false && "fieldErrors" in profileState ? profileState.fieldErrors : undefined
  const passwordErrors = passwordState.ok === false && "fieldErrors" in passwordState ? passwordState.fieldErrors : undefined

  return (
    <div className="space-y-6">
      <form ref={profileFormRef} action={profileAction} className="space-y-6 pb-4">
        {profileState.ok === true ? <SuccessMessage title="Profile saved">{profileState.message}</SuccessMessage> : null}
        {profileState.ok === false && "message" in profileState ? (
          <ErrorMessage title="Could not save profile">{profileState.message}</ErrorMessage>
        ) : null}

        <AdminSectionCard title="Admin profile" description="Basic profile information for the signed-in admin account.">
          <div className="space-y-5">
            <AdminContentGrid columns={2}>
              <TextInput
                label="Display name"
                name="display_name"
                defaultValue={displayName}
                placeholder="Admin name"
                error={profileErrors?.display_name?.[0]}
              />
              <TextInput label="Email" value={userEmail} readOnly disabled />
            </AdminContentGrid>
            <AdminContentGrid columns={2}>
              <TextInput label="User ID" value={userId} readOnly disabled />
              <TextInput label="Profile updated" value={lastUpdated ?? "Not available"} readOnly disabled />
            </AdminContentGrid>
          </div>
        </AdminSectionCard>

        <SaveBar
          hasUnsavedChanges
          unsavedLabel="Review profile changes"
          cancelLabel="Reset profile"
          onCancel={() => profileFormRef.current?.reset()}
          submitLabel="Save profile"
          submitPendingLabel="Saving..."
        className="static rounded-[var(--admin-radius-card)] border"
        />
      </form>

      <form ref={passwordFormRef} action={passwordAction} className="space-y-6 pb-4">
        {passwordState.ok === true ? <SuccessMessage title="Password saved">{passwordState.message}</SuccessMessage> : null}
        {passwordState.ok === false && "message" in passwordState ? (
          <ErrorMessage title="Could not update password">{passwordState.message}</ErrorMessage>
        ) : null}

        <AdminSectionCard title="Password & account" description="Update the current Supabase auth password for this admin account.">
          <AdminContentGrid columns={2}>
            <TextInput
              label="New password"
              name="password"
              type="password"
              autoComplete="new-password"
              error={passwordErrors?.password?.[0]}
            />
            <TextInput
              label="Confirm password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              error={passwordErrors?.confirm_password?.[0]}
            />
          </AdminContentGrid>
        </AdminSectionCard>

        <SaveBar
          hasUnsavedChanges
          unsavedLabel="Password fields are private"
          cancelLabel="Clear password fields"
          onCancel={() => passwordFormRef.current?.reset()}
          submitLabel="Update password"
          submitPendingLabel="Updating..."
        className="static rounded-[var(--admin-radius-card)] border"
        />
      </form>

      <AdminSectionCard title="Logout" description="End the current admin session on this browser.">
        <AdminSignOutButton />
      </AdminSectionCard>
    </div>
  )
}
