import { useState } from 'react'
import { content } from '../data/content'
import { CYBER_DIARIES_REPO, GITHUB_ORG, perspectives } from '../data/site'
import type { PerspectiveKey } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { ExternalLinkIcon } from './ui/Icon'
import { SectionHeader } from './ui/SectionHeader'

const PHASES = ['01 LEARN', '02 INVESTIGATE', '03 REMEDIATE', '04 DOCUMENT']

const TECH_STACK = ['React', 'Next.js', 'ASP.NET Core', 'PostgreSQL', 'Docker Labs']

export function Projects() {
  const { t } = useLanguage()
  const [perspectiveKey, setPerspectiveKey] = useState<PerspectiveKey>('red')
  const perspective = perspectives.find((item) => item.key === perspectiveKey) ?? perspectives[0]

  return (
    <section
      className="py-24 px-6 border-t border-white/5 relative bg-gradient-to-b from-obsidian via-cosmic/20 to-obsidian"
      id="projects"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="05 // SELECTED WORK"
          heading={content.projects.heading}
          meta={
            <div className="mt-2 text-starblue font-mono text-xs tracking-wider uppercase">
              FLAGSHIP EDUCATIONAL PLATFORM · ARABIC-FIRST SECURITY LEARNING
            </div>
          }
          spacing="mb-14"
        />

        {/* Cyber Diaries showcase */}
        <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-starblue/35 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-stellar/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Project info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-400/10 text-cyan-300 border border-cyan-400/30">
                  FLAGSHIP REPOSITORY
                </span>
                <span className="text-xs font-mono text-gray-400 border border-white/10 px-2.5 py-1 rounded-full bg-black/40">
                  OWASP TOP 10:2025 ALIGNED
                </span>
              </div>

              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Cyber Diaries{' '}
                  <span className="text-starblue font-arabic">/ يوميات سابر</span>
                </h3>
                <p className="text-sm font-mono text-gray-400 mt-1">
                  Learn · Investigate · Remediate · Document
                </p>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-light">
                {t(content.projects.description)}
              </p>

              {/* 4-phase incident learning journey */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="text-[11px] font-mono text-starblue uppercase tracking-wider font-semibold">
                  4-PHASE INCIDENT JOURNEY:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
                  {PHASES.map((phase, index) => (
                    <div
                      key={phase}
                      className="p-2.5 rounded-lg bg-stellar/15 border border-starblue/30 text-white"
                    >
                      <span className="text-starblue block text-[10px]">
                        PHASE {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold">{phase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {content.projects.highlights.map((highlight) => (
                  <div
                    key={highlight.title.en}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                  >
                    <span className="text-starblue font-semibold block mb-0.5">
                      {t(highlight.title)}
                    </span>
                    <span className="text-gray-400">{t(highlight.body)}</span>
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 pt-1">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/50 text-gray-300 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  className="btn-sweep px-6 py-3 rounded-full bg-stellar text-white font-medium text-xs font-mono tracking-wider flex items-center gap-2 hover:bg-stellar/90 shadow-glow-stellar transition-all"
                  href={CYBER_DIARIES_REPO}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>VIEW REPOSITORY ON GITHUB</span>
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
                <a
                  className="px-6 py-3 rounded-full border border-white/20 text-cream font-medium text-xs font-mono hover:bg-white/5 transition-all"
                  href={GITHUB_ORG}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ORGANIZATION PROFILE
                </a>
              </div>
            </div>

            {/* Operational perspectives inspector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-black/70 border border-starblue/35 backdrop-blur-md shadow-2xl">
                <div className="text-xs font-mono text-starblue uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    OPERATIONAL PERSPECTIVES
                  </span>
                  <span className="text-gray-400 text-[11px]">TRIAD MODEL</span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl mb-4 border border-white/10">
                  {perspectives.map((item) => (
                    <button
                      key={item.key}
                      aria-pressed={item.key === perspectiveKey}
                      className={`py-2 text-xs font-mono rounded-lg transition-all ${
                        item.key === perspectiveKey
                          ? 'bg-stellar text-white font-semibold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      id={`btn-persp-${item.key}`}
                      onClick={() => setPerspectiveKey(item.key)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4" id="perspCard">
                  <div className="flex items-center justify-between">
                    <span className={perspective.tagClass} id="perspTag">
                      {perspective.tag}
                    </span>
                    <span className="text-xs font-mono text-gray-400">STATUS: SIMULATING</span>
                  </div>
                  <div className="text-white text-base font-bold" id="perspRole">
                    {perspective.role}
                  </div>
                  <p
                    className="text-xs text-gray-300 font-light leading-relaxed"
                    id="perspDesc"
                  >
                    {perspective.description}
                  </p>
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-gray-300 space-y-1.5">
                    <div>
                      // OBJECTIVE:{' '}
                      <span className="text-white font-semibold" id="perspObj">
                        {perspective.objective}
                      </span>
                    </div>
                    <div>
                      // METHOD:{' '}
                      <span className="text-starblue font-semibold" id="perspMethod">
                        {perspective.method}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Incident lifecycle monitor */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="text-[11px] font-mono text-gray-400 mb-2 flex justify-between">
                    <span>INCIDENT LIFECYCLE MONITOR:</span>
                    <span className="text-emerald-400 font-semibold">CONTAINED</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 via-stellar to-emerald-400 h-full transition-all duration-300"
                      id="perspProgressMeter"
                      style={{ width: perspective.progressWidth }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
