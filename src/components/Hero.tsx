import { content } from '../data/content'
import { useLanguage } from '../i18n/LanguageContext'
import { ArrowDownIcon } from './ui/Icon'

const QUESTIONS = [
  { href: '#philosophy', ...content.hero.q1 },
  { href: '#principles', ...content.hero.q2 },
  { href: '#participate', ...content.hero.q3 },
] as const

export function Hero() {
  const { t } = useLanguage()

  return (
    <section
      className="relative min-h-screen flex flex-col justify-between pt-32 pb-14 px-6 overflow-hidden"
      id="home"
    >
      {/* Orbital cosmic backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture>
          <source
            sizes="100vw"
            srcSet="/assets/hero-backdrop-640.webp 640w, /assets/hero-backdrop-1024.webp 1024w, /assets/hero-backdrop-1376.webp 1376w"
            type="image/webp"
          />
          <source
            sizes="100vw"
            srcSet="/assets/hero-backdrop-640.jpg 640w, /assets/hero-backdrop-1024.jpg 1024w, /assets/hero-backdrop-1376.jpg 1376w"
            type="image/jpeg"
          />
          <img
            alt="A constellation of connected stars rising above the curve of the Earth"
            className="w-full h-full object-cover object-bottom opacity-75"
            height={768}
            src="/assets/hero-backdrop-1376.jpg"
            width={1376}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/95 via-transparent to-obsidian" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center my-auto pt-8">
        {/* Wordmark */}
        <div className="mb-5 relative">
          <h1
            className="flex flex-col items-center justify-center text-center uppercase tracking-tight drop-shadow-md select-none"
            style={{ gap: '0.15rem' }}
          >
            <span
              className="font-extrabold text-[#F0EEE8] tracking-tight leading-none"
              style={{ fontSize: 'clamp(3.8rem, 8.5vw, 6.8rem)', fontFamily: "'Space Grotesk', Sora, sans-serif" }}
            >
              HEADLESS
            </span>
            <span
              className="font-semibold leading-none tracking-wider text-[#8CB8FF] drop-shadow-md"
              style={{
                fontSize: 'clamp(1.9rem, 4.25vw, 3.4rem)',
                letterSpacing: '0.08em',
                fontFamily: "'Space Grotesk', Sora, sans-serif",
              }}
            >
              COLLECTIVE
            </span>
          </h1>
        </div>

        {/* Positioning badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-starblue/30 bg-cosmic/50 backdrop-blur-md mb-6 shadow-glow-stellar">
          <span className="w-1.5 h-1.5 rounded-full bg-starblue animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-starblue uppercase font-medium">
            {t(content.hero.badge)}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-cream font-light max-w-3xl mx-auto leading-relaxed mb-4">
          {t(content.hero.tagline)}
        </p>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-300/90 max-w-2xl mx-auto leading-relaxed font-light mb-8">
          {t(content.hero.description)}
        </p>

        {/* Visitor signposting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-8 text-left">
          {QUESTIONS.map((question) => (
            <a 
              key={question.href}
              className="glass-panel p-3.5 rounded-xl border border-white/10 hover:border-starblue/50 transition-all group"
              href={question.href}
            >
              <div className="text-[10px] font-mono text-starblue mb-1 flex items-center justify-between">
                <span>{t(question.label)}</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-xs">→</span>
              </div>
              <div className="text-xs font-bold text-white mb-0.5">{t(question.title)}</div>
              <div className="text-[11px] text-gray-400 font-light">{t(question.body)}</div>
            </a>
          ))}
        </div>

        {/* Calls to action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            className="btn-sweep w-full sm:w-auto px-8 py-3.5 rounded-full bg-stellar text-white font-medium text-sm tracking-wide shadow-glow-stellar hover:bg-stellar/90 transition-all flex items-center justify-center gap-2"
            href="#philosophy"
          >
            <span>{t(content.hero.ctaDiscover)}</span>
            <ArrowDownIcon className="w-4 h-4 ml-1" />
          </a>
          <a
            className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-panel hover:bg-white/10 text-starblue font-medium text-sm tracking-wide transition-all border border-starblue/30 flex items-center justify-center gap-2"
            href="#projects"
          >
            <span>{t(content.hero.ctaDiaries)}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </a>
        </div>
      </div>

      {/* Bottom indicator badges */}
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-8 flex flex-wrap items-center justify-between text-xs text-gray-400 font-mono border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-starblue">◆</span>
          <span>{t(content.hero.crossDisciplinary)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className="text-starblue">◆</span>
          <span>{t(content.hero.openToCurious)}</span>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 text-gray-500">
          <span>EST. 2026</span>
        </div>
      </div>
    </section>
  )
}
