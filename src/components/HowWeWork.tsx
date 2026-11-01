import { useState } from 'react'
import { content } from '../data/content'
import { GITHUB_ORG } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { BoltIcon } from './ui/Icon'
import { SectionHeader } from './ui/SectionHeader'

export function HowWeWork() {
  const { t } = useLanguage()
  const [selectedStage, setSelectedStage] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 relative bg-obsidian" id="how-we-work">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="04 // HOW WE WORK"
          heading={content.howWeWork.heading}
          subheading={content.howWeWork.subheading}
          spacing="mb-16"
        />

        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-gradient-to-r from-stellar via-starblue to-lavender opacity-30 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {content.howWeWork.stages.map((stage, index) => {
              const isSelected = selectedStage === index
              return (
                <button
                  key={stage.title.en}
                  aria-pressed={isSelected}
                  className={`glass-panel p-6 rounded-2xl relative group hover:border-starblue transition-all cursor-pointer text-left w-full ${
                    isSelected ? 'border-starblue bg-stellar/20' : ''
                  }`}
                  onClick={() => setSelectedStage(isSelected ? null : index)}
                  type="button"
                >
                  <div className="w-10 h-10 rounded-xl bg-stellar/20 text-starblue font-mono font-bold flex items-center justify-center text-sm mb-4 border border-starblue/40 group-hover:scale-110 transition-transform">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{t(stage.title)}</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">{t(stage.body)}</p>
                  <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-starblue flex items-center justify-between">
                    <span>{t(stage.footer)}</span>
                    <span className="text-gray-500">{index === 3 ? '↺' : '→'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Deep-dive bar */}
        <div className="mt-8 p-5 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-stellar/20 border border-starblue/30 flex items-center justify-center text-starblue flex-shrink-0">
              <BoltIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono text-starblue uppercase">
                {t(content.howWeWork.coordination)}
              </div>
              <div className="text-xs text-gray-300 font-light">
                {t(content.howWeWork.coordinationBody)}
              </div>
            </div>
          </div>
          <a
            className="text-xs font-mono text-white hover:text-starblue transition-colors whitespace-nowrap flex items-center gap-1.5 self-end md:self-center"
            href={GITHUB_ORG}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>{t(content.howWeWork.exploreDiscussions)}</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
