import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content'
import { fields } from '../data/site'
import { SectionHeader } from './ui/SectionHeader'

const FOCUS_LABELS = ['KEY FOCUS', 'TECH STACK', 'DELIVERABLES']

export function Fields() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dimmed, setDimmed] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const selectField = (index: number) => {
    if (index === activeIndex) return
    setDimmed(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setActiveIndex(index)
      setDimmed(false)
    }, 120)
  }

  const active = fields[activeIndex]

  return (
    <section
      className="py-24 px-6 border-t border-white/5 relative bg-gradient-to-b from-obsidian via-cosmic/30 to-obsidian"
      id="fields"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          code="03 // WHAT WE EXPLORE"
          heading={content.fields.heading}
          subheading={content.fields.subheading}
          spacing="mb-12"
        />

        <div className="relative mb-6">
          {/* Decorative constellation connectors */}
          <div className="absolute inset-0 pointer-events-none hidden md:block opacity-40">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 900 120">
              {[
                [80, 230],
                [230, 380],
                [380, 530],
                [530, 680],
                [680, 820],
              ].map(([from, to]) => (
                <line
                  key={from}
                  className="constellation-line"
                  stroke="#8CB8FF"
                  strokeDasharray="3 3"
                  x1={from}
                  x2={to}
                  y1={60}
                  y2={60}
                />
              ))}
            </svg>
          </div>

          {/* Constellation nodes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10" id="fieldButtonsContainer">
            {fields.map((field, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={field.label}
                  aria-pressed={isActive}
                  className={`field-btn p-4 rounded-xl text-left transition-all text-xs font-mono relative group focus:outline-none focus:ring-1 focus:ring-starblue ${
                    isActive
                      ? 'border border-starblue/50 bg-stellar/25 text-white'
                      : 'border border-white/10 bg-white/5 text-gray-300 hover:border-starblue/30'
                  }`}
                  id={`field-tab-${index}`}
                  onClick={() => selectField(index)}
                  type="button"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mb-2 group-hover:scale-125 transition-transform ${
                      isActive ? 'bg-cyan-400' : 'bg-gray-500'
                    }`}
                  />
                  <span
                    className={`block text-[11px] mb-1 font-semibold ${
                      isActive ? 'text-starblue' : 'text-gray-400'
                    }`}
                  >
                    NODE {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="font-bold text-sm block">{field.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spotlight inspector */}
        <div
          className="glass-panel p-8 sm:p-10 rounded-3xl border border-starblue/30 transition-all duration-300 shadow-2xl relative overflow-hidden"
          id="fieldDetailsPanel"
          style={{
            opacity: dimmed ? 0.4 : 1,
            transform: dimmed ? 'translateY(4px)' : 'translateY(0)',
          }}
        >
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-stellar/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-starblue font-semibold tracking-wider" id="fieldCode">
                  {active.code}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5" id="fieldTitle">
                {active.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-stellar/20 text-starblue border border-starblue/30"
                id="fieldStatus"
              >
                {active.status}
              </span>
            </div>
          </div>

          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 font-light"
            id="fieldDescription"
          >
            {active.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOCUS_LABELS.map((label, index) => (
              <div key={label} className="p-4 rounded-xl bg-black/50 border border-white/10">
                <span className="text-[11px] font-mono text-starblue uppercase tracking-wider block mb-1">
                  {label}
                </span>
                <span className="text-sm text-white font-medium block">{active.focus[index]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
