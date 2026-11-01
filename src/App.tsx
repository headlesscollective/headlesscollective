import { Fields } from './components/Fields'
import { Hero } from './components/Hero'
import { HowWeWork } from './components/HowWeWork'
import { Participate } from './components/Participate'
import { Philosophy } from './components/Philosophy'
import { Principles } from './components/Principles'
import { Projects } from './components/Projects'
import { ScrollProgress } from './components/ScrollProgress'
import { SiteFooter } from './components/SiteFooter'
import { SiteNav } from './components/SiteNav'
import { Vision } from './components/Vision'
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <ScrollProgress />
      <SiteNav />
      <main>
        <Hero />
        <Philosophy />
        <Principles />
        <Fields />
        <HowWeWork />
        <Projects />
        <Participate />
        <Vision />
      </main>
      <SiteFooter />
    </LanguageProvider>
  )
}
