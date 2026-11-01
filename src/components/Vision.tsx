import { content } from '../data/content'
import { useLanguage } from '../i18n/LanguageContext'
import { getAssetUrl } from '../utils/assetPath'

export function Vision() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-6 border-t border-white/5 relative bg-gradient-to-b from-obsidian via-void to-black text-center overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Emblem centerpiece */}
        <div className="w-20 h-20 rounded-full mx-auto p-1 border border-starblue/40 shadow-glow-stellar bg-black/60 flex items-center justify-center">
          <picture>
            <source srcSet={getAssetUrl('/assets/emblem-512.webp')} type="image/webp" />
            <img
              alt="Headless Collective official logo"
              className="w-full h-full object-contain"
              height={512}
              src={getAssetUrl('/assets/emblem-512.jpg')}
              width={512}
            />
          </picture>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono text-starblue uppercase tracking-widest">
            {t(content.vision.lookingForward)}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t(content.vision.heading)}
          </h2>
        </div>

        <p className="text-base sm:text-xl text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
          {t(content.vision.body)}
        </p>

        <div className="pt-4">
          <p className="text-lg sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cream via-starblue to-white">
            {t(content.vision.quote)}
          </p>
        </div>
      </div>
    </section>
  )
}
