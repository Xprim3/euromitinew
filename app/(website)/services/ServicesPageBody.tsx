import { ServicesPageView } from "@/components/services/ServicesPageView"
import { getServicesContentPublic, resolveServicesPage } from "@/lib/data/services-content-public"

export async function ServicesPageBody() {
  const { row, media } = await getServicesContentPublic()
  const data = resolveServicesPage(row, media)
  return <ServicesPageView data={data} />
}
