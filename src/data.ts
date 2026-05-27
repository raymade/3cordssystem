import { ServiceItem, CaseStudyItem, AuditItem, CompetitorItem, FAQItem } from "./types";

export const BRAND_COLORS = {
  bgDark: "bg-slate-950",
  textLight: "text-slate-50",
  primary: "text-orange-500",
  accent: "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500",
  glassBg: "bg-slate-900/60 backdrop-blur-xl border border-slate-800/80",
  cardBgHover: "hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-950/20",
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "web_dev",
    title: "World-Class Web Architectures",
    description: "Ultra-fast Next.js & React platforms custom engineered for insane visual appeal and high conversion.",
    longDescription: "We build premium, custom-coded web architectures that load in under 1.2 seconds, even on slow 3G/4G networks in Lagos. Fully responsive, fluid, custom interactive animations designed to build instant trust and capture customer inquiries.",
    iconName: "Monitor",
    timeline: "7–14 Days",
    pricingEstimate: "From ₦250,000 / $300",
    nigerianSectors: ["Educational Centers", "Startups", "Corporate Entities", "Churches"],
    automationPower: "Pre-integrated WhatsApp click routers, interactive lead capturers, and custom backend forms.",
  },
  {
    id: "ai_automation",
    title: "AI Automation & WhatsApp Bots",
    description: "24/7 client onboarding, automated order management, and smart WhatsApp CRM integration.",
    longDescription: "Turn your WhatsApp into a high-powered, automated sales agent. We design autonomous AI agents that handle pricing inquiries, book consultations, register students, or take deliveries directly via WhatsApp, syncing with Google Sheets, Slack, or local CRMs.",
    iconName: "Cpu",
    timeline: "5-10 Days",
    pricingEstimate: "From ₦180,000 / $220",
    nigerianSectors: ["eCommerce Shops", "Schools", "Consultants", "Law Firms"],
    automationPower: "Fully autonomous WhatsApp business assistant powered by Gemini API, working 24/7 with zero downtime.",
  },
  {
    id: "training_academy",
    title: "AI Skills & Automation Academy",
    description: "Comprehensive corporate training and 'One-Man AI Agency' business starter systems.",
    longDescription: "Equip your school teachers, business team, or yourself with top-tier AI capabilities. Learn prompt engineering, autonomous agents buildout, CRM triggers, and automated workflows. Get direct blueprints to run a multi-million Naira AI agency locally.",
    iconName: "GraduationCap",
    timeline: "Weekend Intensives or 4-Week Tracks",
    pricingEstimate: "From ₦75,000 / $90 per seat",
    nigerianSectors: ["Churches", "Schools", "Unemployed Youth", "SMEs"],
    automationPower: "Learn how to replicate our elite toolchain to automate 90% of your administrative workload easily.",
  },
  {
    id: "maintenance",
    title: "Managed Website Maintenance",
    description: "Server administration, domain structures, monthly security audits, and content updates on autopilot.",
    longDescription: "Never worry about servers, slow website lag, database errors, or expired domains again. We handle complete security caching, premium cloud hosting with 99.9% uptime, regular SEO health checks, and quick content adjustments within 24 hours.",
    iconName: "ShieldCheck",
    timeline: "Continuous Monthly retainer",
    pricingEstimate: "From ₦25,000 / Month / $30",
    nigerianSectors: ["Corporate Sites", "Churches", "International schools", "SMEs"],
    automationPower: "Automated daily storage backups and server-side safety checks running on Cloud Run infrastructure.",
  },
  {
    id: "one_man_agency",
    title: "One-Man AI Agency Starter Blueprint",
    description: "Turnkey white-label solutions to launch of your own local digital & AI consulting agency.",
    longDescription: "The ultimate business-in-a-box. We set you up with custom marketing collateral, standardized agency agreements, white-labeled client pitches, and our internal automation script catalog so you can start charging Nigerian SMEs ₦200,000+ per month immediately.",
    iconName: "Briefcase",
    timeline: "3 Days Setup",
    pricingEstimate: "From ₦150,000 / $180",
    nigerianSectors: ["Freelancers", "Tech Enthusists", "Graduates", "Side-hustlers"],
    automationPower: "Ready-to-deploy copy-paste automation scripts for CRM, cold outreach, and lead pipeline generation.",
  }
];

export const CASE_STUDIES_DATA: CaseStudyItem[] = [
  {
    id: "ikeja_school",
    clientName: "Grace Heights Academy, Ikeja",
    industry: "Education & K-12 Academy",
    challenge: "Overworked administrative staff spending 60+ hours per term manually compile child report sheets, handling chaotic paper enrollments, and fielding non-stop parent WhatsApp calls regarding school fees.",
    solution: "We deployed a light speed mobile-first parent portal. We combined it with a localized AI automation flow that processes Excel scores, generates bespoke PDF report cards, and automatically sends beautiful secure PDF reports to parents via custom WhatsApp templates.",
    impactMetric: "+80%",
    metricLabel: "Reduction in Administrative Hours",
    beforeState: "60+ hours per term spent compiling data with endless physical paperwork.",
    afterState: "1 click processes all child scores, generating PDF sheets delivered directly into parent WhatsApp inboxes."
  },
  {
    id: "gbagada_church",
    clientName: "RCCG Life Center, Gbagada",
    industry: "Sizable Faith-Based Organization",
    challenge: "Struggling to keep thousands of members engaged with event calendars, prayer alerts, tithe configurations, and audio downloads via their slow legacy website. Traditional SMS broadcasts were costing ₦50,000+ monthly with near zero click rates.",
    solution: "We engineered a clean, minimalist web hub pre-integrated with a customized automated RCCG WhatsApp chatbot assistant. Members search bulletins, request prayers, obtain automated tithing bank account guides, and listen to weekly notes 24/7 directly via WhatsApp.",
    impactMetric: "-92%",
    metricLabel: "Monthly Communications Costs Saved",
    beforeState: "High SMS costs, low member responses, outdated static website announcements.",
    afterState: "Zero Naira marginal distribution costs. Instant WhatsApp feedback system handling 2,000+ member requests weekly."
  },
  {
    id: "yaba_ecommerce",
    clientName: "Sisi Alara Couture, Yaba",
    industry: "Retail & Apparel Ecommerce",
    challenge: "Losing up to 50% of Instagram/Facebook incoming traffic. Customers would inquire about size availability or measurements, but manual staff took 4+ hours to respond, leading to abandoned carts.",
    solution: "Redesigned a stunning Framer-inspired minimalist checkout site and connected an autonomous AI Shopping Assistant. The bot checks inventory databases instantly, answers measurement coordinates, suggests perfect sizing fit, and books bespoke designer measurement schedules on autopilot.",
    impactMetric: "+310%",
    metricLabel: "Increase in Weekly Customer Conversion",
    beforeState: "Lost order leads, sluggish manual customer routing, zero after-hours sales.",
    afterState: "AI closes orders instantly, gathers custom sizes metrics, and queues bookings directly into Slack channels."
  }
];

export const BRUTAL_AUDIT_DATA: AuditItem[] = [
  {
    id: "hero_cta",
    component: "Homepage Hero & Secondary Copy",
    brutalTruth: "The old homepage has weak copywriting that fails to define value in the first 3 seconds. It doesn't instantly articulate 'Nigeria's premiere digital automation agency' and lacks solid primary triggers, using weak generic CTA buttons like 'Read More' instead of conversion-focused buttons like 'Launch Free System Audit' or 'WhatsApp Strategy Hotline'.",
    impactScore: "CRITICAL",
    redesignSolution: "Create an elite, high-character display header that contrasts glowing futuristic headings with crisp structural body lines. Inject direct secondary CTAs that open direct communication channels on mobile.",
    seoImplication: "Missing standard H1 hierarchical focus with local keywords ('Lagos Digital Agency', 'AI Automation Nigeria'). Weak density limits potential rankings."
  },
  {
    id: "trust_leak",
    component: "Social Proof & Trust Indicators",
    brutalTruth: "The current site completely lacks transparent client case studies, before/after process matrices, live metrics of success, and genuine founder accountability. Standard visitors looking at the legacy 3cordssystem.com cannot easily verify physical delivery of high-ticket AI bots, which lowers conversion of standard local businesses.",
    impactScore: "CRITICAL",
    redesignSolution: "Create a visual 'Client Transformations' showcase with specific metrics (+310% conversion, -92% communications expense) highlighting real Nigerian businesses coupled with an interactive Pricing Estimator.",
    seoImplication: "Poor dwell time and high bounce rate because of lack of engaging, rich vertical content, which signals lower relevance to search engine crawlers."
  },
  {
    id: "mobile_slowdown",
    component: "Mobile Page Load & Speed Performance",
    brutalTruth: "Slow, poorly-configured WordPress backend wrappers, bloated legacy plugins, and heavy raw image uploads are devastating mobile speed scores. This creates high bounce rates since standard Lagos mobile traffic relies heavily on capped, volatile public data.",
    impactScore: "HIGH",
    redesignSolution: "Recommend migration to solid Next.js (custom Tailwind structure) with optimized modern image assets (.webp), lightweight layouts, and zero heavy render-blocking assets.",
    seoImplication: "Google's Mobile-First indexing prioritizes Core Web Vitals (Largest Contentful Paint, Cumulative Layout Shift). A slow site is severely demoted in rankings."
  },
  {
    id: "broken_leads_funnel",
    component: "Missing Conversion Systems & CRM Hooks",
    brutalTruth: "No interactive diagnostics. A standard visitor has to fill out a standard long 'Contact Form' (which everyone hates), with no instant reward. It completely ignores that the preferred transactional interface in Nigeria is WhatsApp.",
    impactScore: "HIGH",
    redesignSolution: "Build a sleek floating WhatsApp hotline widget and integrate a 'Live AI Business Strategy Advisor' where users can test 3Cords' capability in real-time.",
    seoImplication: "Zero rich schema markup targeting LocalBusiness, SEO-breadcrumbs, or FAQ schemas, missing high-value rich-snippet real-estate."
  }
];

export const COMPETITOR_ANALYSIS: CompetitorItem[] = [
  {
    name: "Framer (SaaS Benchmark)",
    styleInspiration: "Ultra-dark canvas theme, premium glowing border highlights, and gorgeous fluid card mechanics.",
    rating: "9.8 / 10",
    coreAdvantage: "Extreme layout design, flawless typography hierarchy, and effortless transition motions.",
    localAdaptation: "Bring that elite Silicon Valley dark feel to Lagos corporate agencies to automatically command high-ticket pricing authority."
  },
  {
    name: "Vercel / Next.js",
    styleInspiration: "Minimalist black and white design with high-contrast font tracking and clean bento Grid blocks.",
    rating: "9.5 / 10",
    coreAdvantage: "Visualizes deep technical speed, developer-first trustworthiness, and extreme reliability.",
    localAdaptation: "Adapting clean metrics display columns and monospaced tech statistics (Fira Code/JetBrains Mono) to show deep technological mastery."
  },
  {
    name: "Clay.run (AI & Enrichment)",
    styleInspiration: "Sleek, data-rich table previews, elegant glowing custom rows, and fluid interface mechanics.",
    rating: "9.2 / 10",
    coreAdvantage: "Visualizes advanced data workflow steps, proving capabilities interactively.",
    localAdaptation: "Use custom interactive calculator states and AI proposal builders so clients don't just 'read' about AI, they experience it."
  }
];

export const GENERAL_FAQS: FAQItem[] = [
  {
    question: "How long does it take 3Cords to build a premium business portal?",
    answer: "A standard elite custom landing page or modular business site is engineered, optimized, and ready for deployment within 7 to 14 working days. More complex custom AI WhatsApp CRM database integrations typically require up to 21 working days for continuous feedback loops and testing.",
    category: "Technical"
  },
  {
    question: "Do our clients need to pay expensive monthly software fees for AI?",
    answer: "Absolutely not. We prioritize cost-effective layouts. We configure solutions leveraging lightweight serverless API models like Gemini 3.5 Flash, which has an incredibly generous free tier (saving you thousands of dollars compared to costly alternatives). We only recommend paid subscription API models when your volume absolutely demands it.",
    category: "Billing"
  },
  {
    question: "What exactly is the 'One-Man AI Agency' blueprint?",
    answer: "It is a comprehensive entrepreneurial system. Many graduates and freelancers in Nigeria want to launch high-paying tech careers. We set you up with copy-paste marketing blueprints, white-labeled client pitches, automatic lead-generation tools, and direct guidance on how to sell AI automations to SMEs for ₦150,000+ per month.",
    category: "General"
  },
  {
    question: "Will the redesigned website work perfectly on low-end mobile phones?",
    answer: "Yes, this is a core performance mandate of our redesign. By relying on optimized modern framework rendering (Next.js/React static builds) instead of bloated page builders, page sizes are reduced by up to 80%, ensuring perfect responsive layout and near-instant loads even in poor signal spots in Nigeria.",
    category: "Technical"
  },
  {
    question: "Do you offer flexible installment pricing for small businesses in Lagos?",
    answer: "Yes, we structure payments to align with your business milestones. Our standard structure is 50% upfront to initiate layout architecture and coding, and 50% upon final deployment and staff training. Custom monthly retainer plans are also available.",
    category: "Billing"
  },
  {
    question: "How do we get started with 3Cords System?",
    answer: "Simply use our interactive AI Proposal Generator below to get an instant blueprint, or click the direct 'WhatsApp Strategy Hotline' floating widget to chat directly with our tech lead in Lagos. We will map out your system architecture for free.",
    category: "General"
  }
];
