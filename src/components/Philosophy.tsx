import { content } from '../data/content'
import { useLanguage } from '../i18n/LanguageContext'
import { SectionHeader } from './ui/SectionHeader'

export function Philosophy() {
  const { t } = useLanguage()
  const { pillars, paradigmItems, conventionalItems } = content.philosophy

  return (
    <section
      className="py-24 px-6 border-t border-white/5 relative bg-gradient-to-b from-obsidian via-void to-obsidian"
      id="philosophy"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="01 // WHO WE ARE"
          heading={content.philosophy.heading}
          subheading={content.philosophy.subheading}
          spacing="mb-14"
        />

        {/* Editorial pillars strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
          {pillars.map((pillar, index) => {
            const highlighted = index === pillars.length - 1
            return (
              <div
                key={pillar.title.en}
                className={`p-3.5 rounded-xl glass-panel transition-all ${
                  highlighted
                    ? 'border border-starblue/30 bg-stellar/10 hover:border-starblue col-span-2 md:col-span-1'
                    : 'border border-white/10 hover:border-starblue/40'
                }`}
              >
                <span className="text-[10px] font-mono text-starblue block mb-1">
                  PILLAR {String(index + 1).padStart(2, '0')}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold text-white mb-1">{t(pillar.title)}</h4>
                <p
                  className={`text-[11px] font-light ${
                    highlighted ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {t(pillar.body)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Narrative statement & collective thesis */}
          <div className="lg:col-span-6 space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              {t(content.philosophy.narrative)}
            </p>
            <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">
              {t(content.philosophy.narrativeSecondary)}
            </p>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-starblue shadow-glow-stellar mt-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-stellar/10 rounded-full blur-xl pointer-events-none" />
              <p className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                {t(content.philosophy.thesis)}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-mono text-starblue tracking-wider uppercase">
                  — THE HEADLESS COLLECTIVE THESIS
                </span>
                <span className="text-[11px] font-mono text-gray-400">FOUNDATIONAL PRINCIPLE</span>
              </div>
            </div>

            <div className="text-sm text-gray-400 font-light border-l border-white/10 pl-4 py-1 italic">
              {t(content.philosophy.thesisNote)}
            </div>
          </div>

          {/* Architectural comparison */}
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-starblue/30 shadow-2xl">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-white font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {t(content.philosophy.comparisonTitle)}
                </span>
                <span className="text-starblue text-xs font-mono px-2 py-0.5 rounded bg-stellar/20 border border-starblue/30">
                  PARADIGM SHIFT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Our paradigm */}
                <div className="p-5 rounded-xl bg-stellar/15 border-2 border-starblue/60 relative shadow-glow-stellar transition-all hover:border-cyan-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute top-4 right-4 animate-ping" />
                  <div className="text-cyan-300 font-mono text-[11px] mb-1 font-bold tracking-wider">
                    OUR PARADIGM
                  </div>
                  <div className="text-white text-base font-bold mb-3">
                    {t(content.philosophy.paradigmTitle)}
                  </div>
                  <ul className="text-xs text-gray-200 space-y-2.5 font-light">
                    {paradigmItems.map((item) => (
                      <li key={item.en} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold">✓</span>
                        <span>{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conventional model */}
                <div className="p-5 rounded-xl bg-black/50 border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                  <div className="text-gray-500 font-mono text-[11px] mb-1 font-medium tracking-wider">
                    CONVENTIONAL
                  </div>
                  <div className="text-gray-300 text-base font-semibold mb-3">
                    {t(content.philosophy.conventionalTitle)}
                  </div>
                  <ul className="text-xs text-gray-400 space-y-2.5 font-light">
                    {conventionalItems.map((item) => (
                      <li key={item.en} className="flex items-start gap-2">
                        <span className="text-rose-400/80">✕</span>
                        <span>{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visualization strip */}
              <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs font-mono text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{t(content.philosophy.systemState)}</span>
                </div>
                <span className="text-starblue font-semibold">100% OPEN SOURCE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
