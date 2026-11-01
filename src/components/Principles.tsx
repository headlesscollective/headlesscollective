import { content } from '../data/content'
import { principleIcons } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { PrincipleIconGlyph } from './ui/Icon'
import { SectionHeader } from './ui/SectionHeader'

const PRINCIPLE_CODES = [
  '01 // TRANSPARENCY',
  '02 // SYNERGY',
  '03 // MASTERY',
  '04 // FREEDOM',
  '05 // PRACTICE',
  '06 // ETHICS',
]

export function Principles() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 relative bg-obsidian" id="principles">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="02 // WHAT GUIDES US"
          heading={content.principles.heading}
          subheading={content.principles.subheading}
          spacing="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.principles.items.map((principle, index) => (
            <div
              key={principle.title.en}
              className="glass-panel p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-starblue/60 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-starblue tracking-wider font-semibold">
                  {PRINCIPLE_CODES[index]}
                </span>
                <div className="w-8 h-8 rounded-lg bg-stellar/20 border border-starblue/30 flex items-center justify-center text-starblue group-hover:scale-110 transition-transform">
                  <PrincipleIconGlyph className="w-4 h-4" name={principleIcons[index]} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t(principle.title)}</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">{t(principle.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
