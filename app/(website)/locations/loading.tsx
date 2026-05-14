import { WebsiteFullScreenLoading } from "@/components/layout/WebsiteFullScreenLoading"

import { LocationsPageSkeleton } from "./LocationsPageSkeleton"

/** Route-level skeleton while Suspense/async work streams. */
export default function LocationsLoading() {
  return (
    <WebsiteFullScreenLoading>
      <div className="max-h-[min(85dvh,52rem)] w-full max-w-[1280px] overflow-y-auto overflow-x-hidden px-4 sm:px-6 lg:px-12">
        <LocationsPageSkeleton />
      </div>
    </WebsiteFullScreenLoading>
  )
}
