import { content } from '../data/content'
import { CYBER_DIARIES_REPO, GITHUB_ORG } from '../data/site'
import { useLanguage } from '../i18n/LanguageContext'
import { getAssetUrl } from '../utils/assetPath'

const FOOTER_NAV = [
  { index: '01', href: '#philosophy', label: content.nav.philosophy },
  { index: '02', href: '#principles', label: content.nav.principles },
  { index: '03', href: '#fields', label: content.footer.navItems[0] },
  { index: '04', href: '#how-we-work', label: content.footer.navItems[1] },
  { index: '05', href: '#projects', label: content.footer.navItems[2] },
  { index: '06', href: '#participate', label: content.footer.navItems[3] },
]

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="py-14 px-6 border-t border-white/10 bg-black text-gray-400 text-xs font-light">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Brand & manifesto */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <img
              alt="Headless Collective logo"
              className="w-8 h-8 rounded-full border border-starblue/30"
              height={128}
              src={getAssetUrl('/assets/emblem-128.jpg')}
              width={128}
            />
            <span className="text-white font-bold tracking-wider text-sm font-mono">
              HEADLESS COLLECTIVE
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            {t(content.footer.manifesto)}
          </p>
          <div className="text-[11px] font-mono text-gray-500">
            HEADLESS · INDEPENDENT · OPEN · COLLABORATIVE
          </div>
        </div>

        {/* Quick navigation */}
        <div className="md:col-span-3 space-y-2">
          <div className="text-white font-mono text-xs uppercase tracking-wider mb-2">
            {t(content.footer.navigation)}
          </div>
          <ul className="space-y-1.5 text-xs font-mono">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a className="hover:text-starblue transition-colors" href={item.href}>
                  {item.index} {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Repositories & external links */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-white font-mono text-xs uppercase tracking-wider mb-2">
            {t(content.footer.repositories)}
          </div>
          <ul className="space-y-1.5 text-xs font-mono">
            <li>
              <a
                className="hover:text-starblue flex items-center justify-between border-b border-white/5 pb-1"
                href={CYBER_DIARIES_REPO}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Cyber Diaries / يوميات سابر</span>
                <span className="text-gray-500">v1.0</span>
              </a>
            </li>
            <li>
              <a
                className="hover:text-starblue flex items-center justify-between border-b border-white/5 pb-1"
                href={GITHUB_ORG}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>GitHub Organization Profile</span>
                <span className="text-gray-500">Public</span>
              </a>
            </li>
            <li>
              <a
                className="hover:text-starblue flex items-center justify-between border-b border-white/5 pb-1"
                href="#participate"
              >
                <span>Open Participation RFCs</span>
                <span className="text-gray-500">Active</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-mono gap-4">
        <div>© {new Date().getFullYear()} HEADLESS COLLECTIVE. OPEN KNOWLEDGE &amp; CODE.</div>
        <div>DESIGNED FOR OPEN MINDS ACROSS THE GLOBE.</div>
      </div>
    </footer>
  )
}
