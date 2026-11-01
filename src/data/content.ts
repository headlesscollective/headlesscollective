import type { Bilingual } from '../i18n/LanguageContext'

/**
 * Every user-facing string, in both supported languages.
 *
 * Transcribed from the `data-en` / `data-ar` pairs in the supplied design source.
 * Where the source's rendered English text differed from its `data-en` attribute
 * (the "Architectural Comparison" heading and the "Single Headed" card title),
 * the rendered text is used for English — that is what the reference renders.
 */
export const content = {
  nav: {
    philosophy: { en: 'Philosophy', ar: 'الفلسفة' },
    principles: { en: 'Principles', ar: 'المبادئ' },
    fields: { en: 'Fields', ar: 'المجالات' },
    howWeWork: { en: 'How We Work', ar: 'آلية العمل' },
    projects: { en: 'Projects', ar: 'المشاريع' },
    participate: { en: 'Participate', ar: 'المشاركة' },
  },

  hero: {
    badge: { en: 'INDEPENDENT · OPEN · COLLABORATIVE', ar: 'مستقل · مفتوح · تعاوني' },
    tagline: { en: 'Knowledge is shared. Building is for everyone.', ar: 'المعرفة مُشاعة. والبناء للجميع.' },
    description: {
      en: 'An independent technology community built around curiosity, collaboration, continuous learning, and the freedom to explore ideas beyond conventional boundaries.',
      ar: 'مجتمع تقني مستقل يتمحور حول الفضول، والتعاون، والتعلم المستمر، وحرية استكشاف الأفكار خارج الأطر التقليدية.',
    },
    q1: {
      label: { en: 'QUESTION 01', ar: 'السؤال الأول' },
      title: { en: 'What is Headless Collective?', ar: 'ما هو هيدلس كوليكتف؟' },
      body: {
        en: 'A decentralized tech collective driven by open code.',
        ar: 'مجتمع تقني مستقل لا مركزي يحرر المعرفة.',
      },
    },
    q2: {
      label: { en: 'QUESTION 02', ar: 'السؤال الثاني' },
      title: { en: 'What makes it different?', ar: 'ما الذي يميزنا؟' },
      body: {
        en: 'Many minds over single heads. Open by default.',
        ar: 'عقول متعددة، لا احتكار للمعلومة، ومبادئ واضحة.',
      },
    },
    q3: {
      label: { en: 'QUESTION 03', ar: 'السؤال الثالث' },
      title: { en: 'How can I participate?', ar: 'كيف يمكنني المشاركة؟' },
      body: {
        en: '7 open tracks for any builder without gatekeepers.',
        ar: '7 مسارات مفتوحة لأي شغوف دون ألقاب أو إذن.',
      },
    },
    ctaDiscover: { en: 'Discover Our Philosophy', ar: 'اكتشف فلسفتنا' },
    ctaDiaries: { en: 'Explore Cyber Diaries [001]', ar: 'استكشف يوميات سابر [001]' },
    crossDisciplinary: { en: 'Cross-disciplinary by nature', ar: 'متعدد التخصصات بطبيعته' },
    openToCurious: { en: 'Open to curious minds', ar: 'مفتوح للعقول الشغوفة' },
  },

  philosophy: {
    heading: { en: 'An open space for ideas to become real.', ar: 'مساحة حرة لتحويل الأفكار إلى واقع.' },
    subheading: {
      en: 'Our philosophy: decoupling insight from authority, empowering many minds over centralized control.',
      ar: 'فلسفة هيدلس كوليكتف تقوم على تفكيك المركزية وبناء المعرفة الجماعية دون قيود.',
    },
    pillars: [
      {
        title: { en: 'Independent Thinking', ar: 'التفكير المستقل' },
        body: { en: 'Freedom to explore outside rigid dogmas.', ar: 'حرية السؤال خارج الأنماط السائدة.' },
      },
      {
        title: { en: 'Shared Knowledge', ar: 'المعرفة المُشاعة' },
        body: { en: 'No proprietary silos or gated insights.', ar: 'لا احتكار للأفكار والحلول البرمجية.' },
      },
      {
        title: { en: 'Collective Intelligence', ar: 'الذكاء الجمعي' },
        body: {
          en: 'Networked cognition solves complex feats.',
          ar: 'قوة الإنجاز تنبع من تكامل التخصصات.',
        },
      },
      {
        title: { en: 'Open Collaboration', ar: 'التعاون المفتوح' },
        body: { en: 'Anyone can propose, iterate, and build.', ar: 'الجميع شريك في البناء والتطوير.' },
      },
      {
        title: { en: 'Structure Without Monopoly', ar: 'تنظيم بلا احتكار' },
        body: {
          en: 'Coordination without hierarchical bottlenecks.',
          ar: 'نظام ديناميكي يرفض التمركز الأحادي.',
        },
      },
    ],
    narrative: {
      en: "At Headless Collective, 'Headless' is neither absence nor deficit. It is our deliberate choice to reject centralization. We do not place our vision inside a single gatekeeper or a monolithic command structure.",
      ar: "في هيدلس كوليكتف، لا تعني عبارة 'Headless' الغياب أو النقص، بل هي قرار واعٍ برفض المركزية. نرفض حصر الرؤية في شخص واحد أو هيكل هرمي احتكاري.",
    },
    narrativeSecondary: {
      en: 'We believe innovation flourishes best when authority is decoupled from insight. When engineers, researchers, creatives, and analysts congregate around curiosity rather than bureaucratic hierarchies.',
      ar: 'نؤمن بأن الابتكار يزدهر عندما تُفصل القيادة عن احتكار المعرفة، وحين يجتمع المهندسون والباحثون والمبدعون حول الشغف بدلاً من البيروقراطية.',
    },
    thesis: {
      en: "“We don't build around one head. We build through many minds.”",
      ar: '“لا نبني حول رأس واحد. نحن نبني من خلال عقول متعددة.”',
    },
    thesisNote: {
      en: '“We do not reject structure. We reject the transformation of structure into monopoly.”',
      ar: '“نحن لا نرفض التنظيم، بل نرفض تحول التنظيم إلى احتكار.”',
    },
    comparisonTitle: { en: 'Architectural Comparison', ar: 'المقارنة الهيكلية التفاعلية' },
    paradigmTitle: { en: 'Distributed Network (Many Minds)', ar: 'شبكة موزعة (Many Minds)' },
    paradigmItems: [
      { en: 'Decoupled decision making', ar: 'صنع قرار لا مركزي ومستقل' },
      { en: 'Autonomous initiative taking', ar: 'مبادرة ذاتية حرة دون قيود' },
      { en: 'Redundant resilience & shared code', ar: 'مرونة تشغيلية وبرمجيات مفتوحة' },
      { en: 'Merit & execution over titles', ar: 'الكفاءة والإنجاز فوق الألقاب' },
    ],
    conventionalTitle: {
      en: 'Single Headed (Central Bottleneck)',
      ar: 'الرأس الأحادي (Single Head)',
    },
    conventionalItems: [
      { en: 'Single point of creative failure', ar: 'نقطة فشل إبداعية واحدة' },
      { en: 'Hierarchical approval lag', ar: 'بطء الموافقات الهرمية والبيروقراطية' },
      { en: 'Knowledge silo retention', ar: 'احتكار وعزل المعرفة في صوامع' },
      { en: 'Monopolized direction', ar: 'توجيه أحادي وقرارات معزولة' },
    ],
    systemState: {
      en: 'System State: Fully Decentralized',
      ar: 'حالة النظام: لامركزي بالكامل',
    },
  },

  principles: {
    heading: { en: 'Principles before titles.', ar: 'المبادئ قبل الألقاب.' },
    subheading: {
      en: 'Six non-negotiable tenets guiding our code, communication, and roadmap.',
      ar: 'ستة مبادئ أساسية تقود برمجياتنا، وتواصلنا، وخارطة طريقنا.',
    },
    items: [
      {
        title: { en: 'Openness', ar: 'الانفتاحية' },
        body: {
          en: 'Default to open. We share blueprints, codebases, post-mortems, and discoveries unconditionally.',
          ar: 'الأصل هو المشاركة المفتوحة. ننشر المخططات، والمشاريع، والدراسات دون احتكار.',
        },
      },
      {
        title: { en: 'Collaboration', ar: 'التعاون' },
        body: {
          en: 'No single discipline holds all answers. Complex challenges dissolve when minds assemble without walls.',
          ar: 'لا يوجد تخصص يمتلك كل الحلول. التحديات المعقدة تتلاشى حين تلتقي العقول دون حواجز.',
        },
      },
      {
        title: { en: 'Learning', ar: 'التعلم المستمر' },
        body: {
          en: 'Every problem is a curriculum. Curiosity is our principal currency; we learn in public and refine deliberately.',
          ar: 'كل معضلة هي منهج تعليمي. الفضول هو عملتنا الأساسية؛ نتعلم في العلن ونطور بإتقان.',
        },
      },
      {
        title: { en: 'Autonomy', ar: 'الاستقلالية' },
        body: {
          en: 'Minds create at peak capability when unencumbered by artificial micromanagement and territorial gates.',
          ar: 'تبدع العقول في أوج طاقتها عندما تتحرر من الإدارة الجزئية العقيمة والقيود المصطنعة.',
        },
      },
      {
        title: { en: 'Experimentation', ar: 'التجريب' },
        body: {
          en: 'Theory without execution is dormant. We deploy, probe, stress-test, break, rebuild, and validate.',
          ar: 'النظرية دون تطبيق تظل ساكنة. نحن نبرمج، نختبر، نفكك، نعيد البناء، ونتحقق عملياً.',
        },
      },
      {
        title: { en: 'Responsibility', ar: 'المسؤولية' },
        body: {
          en: 'Power and software impact real lives. We uphold absolute digital ethics, security vigilance, and mutual respect.',
          ar: 'البرمجيات تؤثر في حياة الناس الفعلية. نلتزم بأعلى معايير الأخلاقيات الرقمية والأمان التقني.',
        },
      },
    ],
  },

  fields: {
    heading: { en: 'No single field. No fixed boundaries.', ar: 'لا مجال أوحد. لا حدود ثابتة.' },
    subheading: {
      en: 'Explore our interconnected constellation of domains. Select or hover any node to inspect methodology and trajectories.',
      ar: 'استكشف شبكة مجالاتنا المترابطة كالنجوم؛ اختر أي مجال لمعاينة التوجهات والمنهجيات المعتمدة.',
    },
  },

  howWeWork: {
    heading: { en: 'From a question to something useful.', ar: 'من مجرد تساؤل إلى أثر ملموس.' },
    subheading: {
      en: 'A cyclical, 4-stage pipeline translating raw curiosity into tangible public artifacts without bureaucracy.',
      ar: 'مسار عمل دوري من 4 مراحل لتحويل الفضول الخالص إلى مشاريع تقنية نافعة دون بيروقراطية.',
    },
    stages: [
      {
        title: { en: 'QUESTION', ar: 'التساؤل' },
        body: {
          en: 'Every initiative originates from a real problem or an unanswered curiosity. Anyone can initiate a question.',
          ar: 'يبدأ كل مشروع بسؤال حقيقي أو مشكلة غير محلولة. يستطيع أي شخص طرح التساؤل.',
        },
        footer: { en: 'Formulate & Inquire', ar: 'صياغة التساؤل والبحث' },
      },
      {
        title: { en: 'EXPERIMENT', ar: 'التجريب' },
        body: {
          en: 'Rapid proofs-of-concept, hypothesis stress tests, and isolated laboratories to validate practical feasibility.',
          ar: 'بناء نماذج إثبات مفهوم سريعة، واختبار الفرضيات في مختبرات معزولة للتأكد من الجدوى.',
        },
        footer: { en: 'Sandbox & Prototype', ar: 'النمذجة والاختبار' },
      },
      {
        title: { en: 'BUILD', ar: 'البناء' },
        body: {
          en: 'Decoupled development, clean code standards, comprehensive tests, and continuous peer-driven review.',
          ar: 'تطوير برمجي مستقل، معايير كود نظيفة، اختبارات شاملة، ومراجعة جماعية مستمرة.',
        },
        footer: { en: 'Engineer & Harden', ar: 'التطوير والتأمين' },
      },
      {
        title: { en: 'SHARE', ar: 'المشاركة' },
        body: {
          en: 'Publish source repositories, interactive labs, comprehensive documentation, and Arabic-first educational guides.',
          ar: 'نشر المستودعات البرمجية، والمختبرات التفاعلية، والتوثيق الشامل باللغة العربية أولاً.',
        },
        footer: { en: 'Open Release & Teach', ar: 'النشر والتعليم المفتوح' },
      },
    ],
    coordination: {
      en: 'DECENTRALIZED COORDINATION',
      ar: 'آلية التعاون اللامركزي',
    },
    coordinationBody: {
      en: 'No managerial queue: any member initiates an RFC, forks, isolates an experimental lab, and requests review.',
      ar: 'لا ننتظر موافقة إدارية للبدء؛ أي مساهم يمكنه تحويل التساؤل إلى فرع برمجي واختبار فوري.',
    },
    exploreDiscussions: {
      en: 'Explore Open Discussions',
      ar: 'تصفح مناقشات المشاريع',
    },
  },

  projects: {
    heading: { en: 'HEADLESS COLLECTIVE / PROJECT 001', ar: 'مشروع 001 / هيدلس كوليكتف' },
    description: {
      en: 'A groundbreaking Arabic-first, scenario-driven web security education platform. Built with narrative immersion featuring Egyptian colloquial team dialogue, dockerized multi-tier vulnerability labs, and end-to-end holistic cybersecurity pedagogy.',
      ar: 'منصة تعليمية مبتكرة باللغة العربية لأمن الويب، مبنية على سيناريوهات واقعية وحوارات مصرية لفريق العمل، مع مختبرات ثغرات معزولة بنظام Docker وتدريب شامل على كافة الجوانب الأمنية.',
    },
    highlights: [
      {
        title: { en: '3 Holistic Angles', ar: '3 زوايا أمنية متكاملة' },
        body: {
          en: 'Offensive (Red), Defensive (Blue), & Secure Dev.',
          ar: 'الهجوم (Red)، الدفاع (SOC)، وتطوير الكود الآمن.',
        },
      },
      {
        title: { en: 'Isolated Docker Labs', ar: 'مختبرات دوكر معزولة' },
        body: {
          en: 'Reproducible realistic vulnerable micro-environments.',
          ar: 'بيئات تجريبية حقيقية وقابلة للتكرار بأمان كامل.',
        },
      },
      {
        title: { en: 'Egyptian Colloquial', ar: 'سياق حواري واقعي' },
        body: {
          en: 'Immersive technical banter between engineers.',
          ar: 'نقاشات واقعية بطابع مصري دارج لتبسيط المفاهيم.',
        },
      },
      {
        title: { en: 'OWASP Top 10:2025', ar: 'معايير OWASP 2025' },
        body: {
          en: 'Prepared for current and emerging web risks.',
          ar: 'مواكب لأحدث التصنيفات والمخاطر الأمنية الحديثة.',
        },
      },
    ],
  },

  participate: {
    heading: { en: 'Everyone has something to contribute.', ar: 'لكل شخص ما يضيفه.' },
    subheading: {
      en: 'You do not need formal permissions or titles to initiate or build with Headless Collective. Curiosity and willingness precede pedigree.',
      ar: 'لست بحاجة إلى إذن رسمي أو منصب لتبدأ في البناء والتعاون مع هيدلس كوليكتف. نرحب بكل عقل شغوف.',
    },
    tracks: [
      {
        title: { en: 'Software Engineering', ar: 'هندسة البرمجيات' },
        body: {
          en: 'Contribute to core repos, frontend UI, backend systems, or Docker labs.',
          ar: 'ساهم في الأكواد البرمجية، واجهات المستخدم، الأنظمة الخلفية، أو مختبرات دوكر.',
        },
      },
      {
        title: { en: 'Security Research', ar: 'الأبحاث الأمنية' },
        body: {
          en: 'Dissect CVEs, craft lab scenarios, verify remediation recipes, and write audits.',
          ar: 'حلل الثغرات الأمنية، صمم سيناريوهات المختبرات، واختبر حلول المعالجة البرمجية.',
        },
      },
      {
        title: { en: 'UI / UX & Design', ar: 'التصميم وتجربة المستخدم' },
        body: {
          en: 'Elevate visual languages, schematic diagrams, and user-centric architectures.',
          ar: 'طوّر الهوية البصرية، المخططات التوضيحية، وتجارب المستخدم الاستثنائية.',
        },
      },
      {
        title: { en: 'Testing & QA', ar: 'الاختبار وضمان الجودة' },
        body: {
          en: 'Break edge cases, validate reproducible environments, and verify security bounds.',
          ar: 'اكتشف الحالات الشاذة، وتحقق من بيئات العمل المعزولة ومطابقتها للمعايير.',
        },
      },
      {
        title: { en: 'Technical Documentation', ar: 'التوثيق والترجمة' },
        body: {
          en: 'Refine bilingual knowledge bases, explain security patterns, translate guides.',
          ar: 'صِغ الأدلة التقنية بالعربية والإنجليزية، وبسّط المفاهيم المعقدة للمتعلمين.',
        },
      },
      {
        title: { en: 'Project Coordination', ar: 'تنسيق المشاريع' },
        body: {
          en: 'Organize issues, clarify pull requests, triage bug reports, and connect contributors.',
          ar: 'نظم التذاكر، نسّق مراجعات الكود، وتواصل مع المساهمين لتسهيل مهامهم.',
        },
      },
      {
        title: { en: 'Knowledge Sharing & Mentorship', ar: 'مشاركة المعرفة والإرشاد' },
        body: {
          en: 'Conduct peer discussions, mentor newcomers, write deep-dive technical articles, and spread free software culture across communities.',
          ar: 'قدّم جلسات معرفية، وأرشد المنضمين الجدد، وانشر ثقافة البرمجيات الحرة والتعاونية في مجتمعك التقني.',
        },
      },
    ],
    readyTitle: { en: 'Ready to explore without walls?', ar: 'مستعد للانطلاق دون قيود؟' },
    readyBody: {
      en: 'Explore open issues, submit pull requests, or start an architectural discussion on our GitHub.',
      ar: 'تصفح المهام المفتوحة، أرسل مساهمتك البرمجية، أو ابدأ نقاشاً تقنياً عبر جيت هاب.',
    },
  },

  vision: {
    lookingForward: { en: 'LOOKING FORWARD', ar: 'نحو المستقبل' },
    heading: { en: 'Building beyond individual minds.', ar: 'البناء أبعد من حدود الفرد.' },
    body: {
      en: 'Software is evolving rapidly, but human connection and open access remain our constant compass. We envision an ecosystem where tools belong to those who build and use them, and knowledge travels without tariffs.',
      ar: 'تتطور البرمجيات بوتيرة متسارعة، لكن التواصل الإنساني وحرية المعرفة هما بوصلتنا الثابتة. نتطلع لبيئة تقنية تعود فيها الأدوات لمن يصنعها ويستخدمها، وتنتقل فيها المعرفة دون قيود.',
    },
    quote: {
      en: '“No single mind owns the future. We build it together.”',
      ar: '“لا يملك المستقبل عقل واحد. نحن نبنيه معاً.”',
    },
  },

  footer: {
    manifesto: {
      en: 'An independent, decentralized tech collective dedicated to open source, transparent security education, and unrestricted intellectual curiosity.',
      ar: 'تجمع تقني مستقل ولامركزي مكرس للبرمجيات الحرة، وتعليم الأمن السيبراني الشفاف، وحرية الاستكشاف الفكري.',
    },
    navigation: { en: 'Navigation', ar: 'التنقل' },
    navItems: [
      { en: 'Fields of Work', ar: 'مجالات الاستكشاف' },
      { en: 'Work Methodology', ar: 'آلية العمل' },
      { en: 'Projects & Labs', ar: 'المشاريع والمختبرات' },
      { en: 'How to Participate', ar: 'كيفية المشاركة' },
    ],
    repositories: { en: 'Repositories', ar: 'المستودعات' },
  },
} satisfies Record<string, unknown>

export type Content = typeof content
export type { Bilingual }
