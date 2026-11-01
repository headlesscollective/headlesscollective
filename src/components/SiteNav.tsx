import { useEffect, useState } from 'react'
import { content } from '../data/content'
import { GITHUB_ORG } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { getAssetUrl } from '../utils/assetPath'
import { GithubIcon, MenuIcon } from './ui/Icon'

const NAV_ITEMS = [
  { index: '01', id: 'philosophy', label: content.nav.philosophy },
  { index: '02', id: 'principles', label: content.nav.principles },
  { index: '03', id: 'fields', label: content.nav.fields },
  { index: '04', id: 'how-we-work', label: content.nav.howWeWork },
  { index: '05', id: 'projects', label: content.nav.projects },
  { index: '06', id: 'participate', label: content.nav.participate },
] as const

export function SiteNav() {
  const { t, lang, toggle } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile sheet on Escape so it is dismissible without a pointer.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-3 sm:py-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="glass-nav pointer-events-auto rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 h-14 flex items-center justify-between w-full max-w-6xl shadow-2xl transition-all duration-300 border border-starblue/20"
      >
        {/* Brand */}
        <a className="flex flex-row items-center whitespace-nowrap gap-2.5 group" href="#home">
          <div className="w-8 h-8 rounded-lg overflow-hidden p-0.5 border border-starblue/30 group-hover:border-starblue transition-colors bg-black/60 flex items-center justify-center flex-shrink-0">
            <img
              alt="Headless Collective Emblem"
              className="w-full h-full object-cover rounded-md"
              height={128}
              width={128}
              src={getAssetUrl('/assets/emblem-128.jpg')}
            />
          </div>
          <div className="flex flex-row items-center gap-1.5 whitespace-nowrap leading-none">
            <span className="font-bold tracking-tight text-sm sm:text-base text-[#F0EEE8] uppercase group-hover:text-starblue transition-colors font-mono">
              HEADLESS
            </span>
            <span className="font-semibold text-[10px] sm:text-xs text-[#8CB8FF]/90 uppercase tracking-widest font-mono">
              COLLECTIVE
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5 text-xs uppercase tracking-wider text-gray-300 font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className="hover:text-starblue transition-colors py-1 relative flex items-center gap-1"
              href={`#${item.id}`}
            >
              <span className="text-[10px] font-mono text-starblue/70">{item.index}</span>
              <span>{t(item.label)}</span>
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Switch language"
            className="px-2.5 py-1 text-xs font-mono rounded-full border border-starblue/30 hover:border-starblue bg-white/5 hover:bg-white/10 transition-all text-starblue font-semibold flex items-center gap-1"
            onClick={toggle}
            title="Switch Language"
            type="button"
          >
            <span>{lang === 'ar' ? 'EN' : 'AR'}</span>
            <span className="text-[10px] text-gray-400">/ {lang === 'ar' ? 'AR' : 'EN'}</span>
          </button>

          <a
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-stellar/20 text-starblue border border-stellar/40 hover:bg-stellar hover:text-white transition-all duration-300 font-medium font-mono"
            href={GITHUB_ORG}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            aria-controls="mobileNavMenu"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            className="lg:hidden p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            onClick={() => setMenuOpen((open) => !open)}
            title="Toggle Menu"
            type="button"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed top-20 left-4 right-4 z-50 glass-nav rounded-2xl p-6 border border-starblue/20 shadow-2xl max-w-md mx-auto pointer-events-auto lg:hidden flex-col gap-4 text-center ${
          menuOpen ? 'flex' : 'hidden'
        }`}
        id="mobileNavMenu"
      >
        <div className="flex flex-col gap-3 text-sm uppercase tracking-wider text-gray-200 font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className="hover:text-starblue py-2 border-b border-white/5 transition-colors"
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.index} {t(item.label)}
            </a>
          ))}
        </div>
        <div className="pt-2 border-t border-white/10">
          <a
            className="w-full py-2.5 rounded-full bg-stellar/20 text-starblue border border-stellar/40 hover:bg-stellar hover:text-white transition-all font-mono text-xs flex items-center justify-center gap-2"
            href={GITHUB_ORG}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub Organization</span>
          </a>
        </div>
      </div>
    </header>
  )
}
