import Link from "next/link"

import { contactPageMock } from "@/data/mock"

export function HomeContactCta() {
  const c = contactPageMock
  const tel = c.phone.replace(/\s/g, "")
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-18 lg:px-12" aria-labelledby="contact-cta-heading">
      <div className="mx-auto max-w-[1280px] rounded-3xl border border-brand-border-muted bg-brand-surface-tinted p-7 md:p-10">
        <p className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-secondary">Contact</p>
        <h2
          id="contact-cta-heading"
          className="mt-3 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold tracking-tight text-black md:text-3xl"
        >
          Talk To Euromiti
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 text-brand-body-soft md:grid-cols-2">
          <a href={`tel:${tel}`} className="rounded-xl bg-white p-4 text-[0.95rem] font-semibold">
            Phone: {c.phone}
          </a>
          <a href={`mailto:${c.email}`} className="rounded-xl bg-white p-4 text-[0.95rem] font-semibold">
            Email: {c.email}
          </a>
        </div>
        <Link
          href="/contact"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red-vivid px-6 py-3.5 text-sm font-bold text-white transition hover:bg-secondary"
        >
          Contact Us
        </Link>
      </div>
    </section>
  )
}
