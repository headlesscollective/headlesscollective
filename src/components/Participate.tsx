import { content } from '../data/content'
import { GITHUB_ORG } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { GithubIcon } from './ui/Icon'
import { SectionHeader } from './ui/SectionHeader'

export function Participate() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 relative bg-obsidian" id="participate">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="06 // PARTICIPATION"
          heading={content.participate.heading}
          subheading={content.participate.subheading}
          spacing="mb-16"
        />

        {/* Contribution pathways */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {content.participate.tracks.map((track, index) => {
            const wide = index === content.participate.tracks.length - 1
            return (
              <div
                key={track.title.en}
                className={`glass-panel p-5 rounded-xl border border-white/10 hover:border-starblue/50 transition-all group ${
                  wide ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="text-starblue font-mono text-xs mb-1 font-semibold">
                  TRACK {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{t(track.title)}</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">{t(track.body)}</p>
              </div>
            )
          })}
        </div>

        {/* Action box */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-starblue/30 text-center max-w-3xl mx-auto space-y-4 shadow-glow-stellar">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            {t(content.participate.readyTitle)}
          </h3>
          <p className="text-sm text-gray-300 font-light max-w-lg mx-auto">
            {t(content.participate.readyBody)}
          </p>
          <div className="pt-2">
            <a
              className="btn-sweep inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stellar text-white font-medium text-xs font-mono tracking-wider shadow-glow-stellar hover:bg-stellar/90 transition-all"
              href={GITHUB_ORG}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>GET INVOLVED ON GITHUB</span>
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
