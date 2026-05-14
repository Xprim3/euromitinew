"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

import { saveFuelPrice, type FuelPriceSaveState } from "@/app/admin/(panel)/fuel-prices/actions"
import {
  AdminContentGrid,
  AdminSectionCard,
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableTd,
  AdminTableTh,
  ErrorMessage,
  SaveBar,
  SelectInput,
  StatusBadge,
  SuccessMessage,
  TableActions,
  TextInput,
  ToggleInput,
} from "@/components/admin/design-system"
import { dsBtnGhost, dsBtnPrimary } from "@/components/admin/design-system/ds-button-classes"
import { formatNewsDate } from "@/lib/format-news-date"
import { cn } from "@/lib/utils"

export type AdminFuelPriceRow = {
  id: string
  product_key: string
  fuel_type: string
  price_numeric: string | number
  currency: string
  label_status: "active" | "updated" | string
  is_active: boolean
  updated_at: string
}

const initialSaveState: FuelPriceSaveState = { ok: null }

const fuelTypeOptions = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "lpg", label: "LPG" },
] as const

const currencyOptions = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
  { value: "ALL", label: "ALL" },
] as const

function fuelTypeKey(row: AdminFuelPriceRow | null) {
  if (!row) return "diesel"
  if (row.product_key === "diesel") return "diesel"
  if (row.product_key === "lpg") return "lpg"
  return "petrol"
}

function priceValue(row: AdminFuelPriceRow | null) {
  if (!row) return ""
  const n = typeof row.price_numeric === "number" ? row.price_numeric : Number(row.price_numeric)
  return Number.isFinite(n) ? n.toFixed(3) : ""
}

export function FuelPricesAdminClient({ rows }: { rows: AdminFuelPriceRow[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<AdminFuelPriceRow | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [state, formAction] = useActionState(async (prev: FuelPriceSaveState, formData: FormData) => {
    const next = await saveFuelPrice(prev, formData)
    if (next.ok === true) {
      setPanelOpen(false)
      setEditing(null)
      router.refresh()
    }
    return next
  }, initialSaveState)

  const fieldErrors = state.ok === false && "fieldErrors" in state ? state.fieldErrors : undefined

  function openCreate() {
    setEditing(null)
    setPanelOpen(true)
  }

  function openEdit(row: AdminFuelPriceRow) {
    setEditing(row)
    setPanelOpen(true)
  }

  return (
    <div className="space-y-6">
      {state.ok === true ? (
        <SuccessMessage title="Fuel price saved">{state.message}</SuccessMessage>
      ) : null}
      {state.ok === false && "message" in state ? (
        <ErrorMessage title="Could not save fuel price">{state.message}</ErrorMessage>
      ) : null}

      <AdminSectionCard
        headerActions={
          <button type="button" className={cn(dsBtnPrimary, "min-h-10 px-4 text-xs")} onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Add fuel type
          </button>
        }
      >
        <AdminTable>
          <AdminTableHead>
            <AdminTableRow>
              <AdminTableTh>Fuel type</AdminTableTh>
              <AdminTableTh>Price</AdminTableTh>
              <AdminTableTh>Status</AdminTableTh>
              <AdminTableTh>Last updated</AdminTableTh>
              <AdminTableTh className="text-right">Actions</AdminTableTh>
            </AdminTableRow>
          </AdminTableHead>
          <AdminTableBody>
            {rows.length === 0 ? (
              <AdminTableRow>
                <AdminTableTd colSpan={5} className="py-10 text-center text-[var(--admin-text-muted)]">
                  No fuel prices found. Use Add fuel type to create the first row.
                </AdminTableTd>
              </AdminTableRow>
            ) : (
              rows.map((row) => {
                const numeric = typeof row.price_numeric === "number" ? row.price_numeric : Number(row.price_numeric)
                return (
                  <AdminTableRow key={row.id}>
                    <AdminTableTd>
                      <div className="font-semibold">{row.fuel_type}</div>
                      <div className="mt-1 font-mono text-xs text-[var(--admin-text-muted)]">{row.product_key}</div>
                    </AdminTableTd>
                    <AdminTableTd>
                      <span className="font-mono font-semibold">
                        {Number.isFinite(numeric) ? numeric.toFixed(3) : "0.000"} {row.currency}
                      </span>
                    </AdminTableTd>
                    <AdminTableTd>
                      <StatusBadge tone={row.is_active ? "success" : "neutral"}>
                        {row.is_active ? "Active" : "Inactive"}
                      </StatusBadge>
                    </AdminTableTd>
                    <AdminTableTd>
                      <span className="whitespace-nowrap text-[var(--admin-text-muted)]">{formatNewsDate(row.updated_at)}</span>
                    </AdminTableTd>
                    <AdminTableTd className="text-right">
                      <TableActions>
                        <button type="button" className={cn(dsBtnGhost, "min-h-9 px-3 text-xs")} onClick={() => openEdit(row)}>
                          Edit
                        </button>
                      </TableActions>
                    </AdminTableTd>
                  </AdminTableRow>
                )
              })
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminSectionCard>

      {panelOpen ? (
        <div className="fixed inset-0 z-[120]">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            aria-label="Close fuel price editor"
            onClick={() => setPanelOpen(false)}
          />
          <aside
            aria-label={editing ? "Edit fuel price" : "Add fuel type"}
            className="absolute top-0 right-0 flex h-full max-h-dvh w-full max-w-full flex-col overflow-y-auto border-[var(--admin-border)] border-l bg-[var(--admin-surface)] pb-[env(safe-area-inset-bottom,0px)] shadow-2xl sm:max-w-lg"
          >
            <form action={formAction} className="flex min-h-full flex-col">
              <div className="border-[var(--admin-border)] border-b px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-xs font-semibold tracking-wide text-[var(--admin-text-muted)] uppercase">
                  {editing ? "Edit fuel price" : "Add fuel type"}
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-montserrat)] text-xl font-bold text-[var(--admin-text)]">
                  {editing ? editing.fuel_type : "New fuel price"}
                </h2>
              </div>

              <div className="flex-1 space-y-5 px-4 py-5 sm:px-5">
                {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
                <AdminContentGrid columns={1}>
                  <SelectInput
                    label="Fuel type"
                    name="fuel_type_key"
                    options={fuelTypeOptions}
                    defaultValue={fuelTypeKey(editing)}
                    required
                    error={fieldErrors?.fuel_type_key?.[0]}
                  />
                  <TextInput
                    label="Price"
                    name="price_numeric"
                    type="number"
                    min={0}
                    step="0.001"
                    placeholder="1.340"
                    defaultValue={priceValue(editing)}
                    trailingAddon="/ L"
                    required
                    error={fieldErrors?.price_numeric?.[0]}
                  />
                  <SelectInput
                    label="Currency"
                    name="currency"
                    options={currencyOptions}
                    defaultValue={editing?.currency || "EUR"}
                    required
                    error={fieldErrors?.currency?.[0]}
                  />
                  <ToggleInput
                    label="Active on public homepage"
                    name="is_active"
                    checkedLabel="Active"
                    uncheckedLabel="Inactive"
                    defaultChecked={editing ? editing.is_active : true}
                  />
                </AdminContentGrid>
              </div>

              <SaveBar
                cancelLabel="Cancel"
                onCancel={() => setPanelOpen(false)}
                submitLabel="Save fuel price"
                submitPendingLabel="Saving…"
                className="sticky bottom-0"
              />
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
