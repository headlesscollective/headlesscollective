import type { ReactNode } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Bilingual } from '../../i18n/LanguageContext'

interface SectionHeaderProps {
  /** Small mono label inside the pill, e.g. "01 // WHO WE ARE". */
  code: string
  heading: Bilingual
  subheading?: Bilingual
  /** Extra line rendered under the heading, e.g. a mono meta line. */
  meta?: ReactNode
  /** Spacing between the header block and the section body. */
  spacing?: 'mb-12' | 'mb-14' | 'mb-16'
}

/**
 * The recurring section header: numbered mono pill, display heading and a
 * muted supporting line.
 */
export function SectionHeader({
  code,
  heading,
  subheading,
  meta,
  spacing = 'mb-14',
}: SectionHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className={spacing}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stellar/15 border border-starblue/25 text-xs font-mono text-starblue tracking-widest uppercase mb-3">
        <span>{code}</span>
      </div>
      <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">{t(heading)}</h2>
      {subheading ? (
        <p className="text-gray-400 mt-2 font-light text-base max-w-2xl">{t(subheading)}</p>
      ) : null}
      {meta ? meta : null}
    </div>
  )
}
