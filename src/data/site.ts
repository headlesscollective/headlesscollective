/**
 * Structured section data for the parts of the design that are driven by data
 * rather than static markup. These strings are English-only in the supplied
 * design source, so they are not translated.
 */

export interface FieldNode {
  /** Short label shown on the constellation node button. */
  label: string
  /** Inspector panel code, e.g. "NODE 01 // CORE UTILITY". */
  code: string
  title: string
  description: string
  focus: [string, string, string]
  status: string
}

export const fields: FieldNode[] = [
  {
    label: 'Software & Tools',
    code: 'NODE 01 // CORE UTILITY',
    title: 'Software & Development Tools',
    description:
      'Engineering pragmatic, developer-first tools, modular micro-frameworks, and intuitive CLI solutions that streamline workflows and dismantle vendor entrapment.',
    focus: [
      'Modular Architecture & Microservices',
      'TypeScript, Go, Rust, ASP.NET Core',
      'Open Source Utilities & Libraries',
    ],
    status: 'ACTIVE DEVELOPMENT',
  },
  {
    label: 'Security & Privacy',
    code: 'NODE 02 // DEFENSIVE & OFFENSIVE',
    title: 'Security & Privacy',
    description:
      'Investigating defensive architectures, vulnerability patterns, encryption paradigms, and hands-on offensive simulations to empower robust systems.',
    focus: [
      'AppSec & Vulnerability Triaging',
      'Docker Labs, Burp, OWASP 2025',
      'Cyber Diaries & Audit Playbooks',
    ],
    status: 'FLAGSHIP WORKSTREAM',
  },
  {
    label: 'Systems & Infra',
    code: 'NODE 03 // RESILIENT BACKBONE',
    title: 'Systems & Infrastructure',
    description:
      'Constructing reliable, decentralized, lightweight self-hosted primitives, cloud-native deployments, and container architectures that maintain uptime without bloated overhead.',
    focus: [
      'Containerization & Orchestration',
      'Docker, Kubernetes, Linux Kernels',
      'Zero-Trust Infrastructure Blueprints',
    ],
    status: 'ONGOING RESEARCH',
  },
  {
    label: 'AI & Emerging Tech',
    code: 'NODE 04 // FRONTIER COGNITION',
    title: 'AI & Emerging Technology',
    description:
      'Evaluating local open-weights LLMs, autonomous security analyzers, transparent algorithms, and algorithmic integrity without corporate capture.',
    focus: [
      'Local LLM Tooling & Agents',
      'Python, PyTorch, Ollama, ONNX',
      'AI Assisted Security Code Reviewers',
    ],
    status: 'PROTOTYPING',
  },
  {
    label: 'Docs & Education',
    code: 'NODE 05 // OPEN KNOWLEDGE',
    title: 'Documentation & Education',
    description:
      'Crafting Arabic-first technical documentation, readable guides, and multi-perspective tutorials that demystify high-level concepts for aspiring engineers.',
    focus: [
      'Bilingual Technical Writing',
      'Interactive Scenario Design',
      'Egyptian Dialect Storylines',
    ],
    status: 'COMMUNITY LED',
  },
  {
    label: 'Design & UX',
    code: 'NODE 06 // HUMAN INTERFACE',
    title: 'Design & User Experience',
    description:
      'Creating visually compelling, high-contrast, distraction-free interfaces that treat the user’s attention with dignity and clarity.',
    focus: [
      'Dark-Mode Ergonomics & Accessibility',
      'Tailwind CSS, Figma, Web Standards',
      'Design Tokens & Clean Micro-Interactions',
    ],
    status: 'CONTINUOUS POLISH',
  },
]

export type PerspectiveKey = 'red' | 'blue' | 'dev'

export interface Perspective {
  key: PerspectiveKey
  label: string
  tag: string
  /** Tailwind classes for the role tag chip. */
  tagClass: string
  role: string
  description: string
  objective: string
  method: string
  /** Width of the incident-lifecycle meter. */
  progressWidth: string
}

export const perspectives: Perspective[] = [
  {
    key: 'red',
    label: 'Red Team',
    tag: 'ATTACK VECTOR',
    tagClass:
      'text-xs font-mono px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-semibold',
    role: 'The Offensive Infiltration',
    description:
      'Understand flaw triggers, payload craftsmanship, chained exploits, and how malicious actors bypass input filters.',
    objective: 'Gain unauthorized telemetry & pivot',
    method: 'Blind SQLi, SSRF, Broken Object Auth',
    progressWidth: '35%',
  },
  {
    key: 'blue',
    label: 'Blue / SOC',
    tag: 'DEFENSIVE TRIAGE',
    tagClass:
      'text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold',
    role: 'The SOC & Threat Hunter',
    description:
      'Inspect telemetry anomaly logs, monitor packet streams, extract IoCs, and establish rapid incident containment in sandbox environments.',
    objective: 'Detect intrusions in sub-minute latencies',
    method: 'Log Parsing, SIEM Rules, Docker Isolation',
    progressWidth: '70%',
  },
  {
    key: 'dev',
    label: 'Developer',
    tag: 'SECURE CODE & REMEDIATION',
    tagClass:
      'text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold',
    role: 'The Software Engineer',
    description:
      'Patch vulnerable controllers, enforce strict parameterized queries, configure safe headers, and write preventative unit tests in CI.',
    objective: 'Eradicate flaw pattern at codebase level',
    method: 'Parameterized Queries, AST Checks, CI Audits',
    progressWidth: '100%',
  },
]

/** Icons for the six principle cards, keyed by principle index. */
export type PrincipleIcon = 'eye' | 'nodes' | 'ascent' | 'compass' | 'flask' | 'shield'

export const principleIcons: PrincipleIcon[] = [
  'eye',
  'nodes',
  'ascent',
  'compass',
  'flask',
  'shield',
]

export const GITHUB_ORG = 'https://github.com/HeadLess-Collective'
export const CYBER_DIARIES_REPO = 'https://github.com/HeadLess-Collective/Cyber-Diaries'
