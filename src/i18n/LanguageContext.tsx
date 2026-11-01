import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'ar'

/** A string that exists in both supported languages. */
export interface Bilingual {
  en: string
  ar: string
}

interface LanguageContextValue {
  lang: Lang
  isArabic: boolean
  toggle: () => void
  /** Resolve a bilingual string for the active language. */
  t: (value: Bilingual) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    root.setAttribute('lang', lang === 'ar' ? 'ar' : 'en')
  }, [lang])

  const toggle = useCallback(() => setLang((current) => (current === 'en' ? 'ar' : 'en')), [])
  const t = useCallback((value: Bilingual) => value[lang], [lang])

  const value = useMemo(
    () => ({ lang, isArabic: lang === 'ar', toggle, t }),
    [lang, toggle, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a <LanguageProvider>')
  }
  return context
}
