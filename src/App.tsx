import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Logo } from "./components/Logo";
import {
  Monitor,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Check,
  ExternalLink,
  Copy,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Smartphone,
  Zap,
  TrendingUp,
  Users,
  Award,
  HelpCircle,
  Send,
  MessageSquare,
  Clock,
  Coins,
  Lock,
  Settings,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Info,
  Layers,
  FileText,
  MousePointerClick,
  Share2,
  ListFilter
} from "lucide-react";
import {
  SERVICES_DATA,
  CASE_STUDIES_DATA,
  BRUTAL_AUDIT_DATA,
  COMPETITOR_ANALYSIS,
  GENERAL_FAQS,
  BRAND_COLORS
} from "./data";
import { ServiceItem, CaseStudyItem, AuditItem } from "./types";

export default function App() {
  // Navigation & Tab state
  const [activeWorkspace, setActiveWorkspace] = useState<"redesign" | "strategist">("redesign");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom chatbot simulation or live state
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("School / Educational Center");
  const [painPoint, setPainPoint] = useState("Manual paperwork & delayed customer reply times");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [aiProposal, setAiProposal] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Interactive Service overlay state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  // Interactive ROI Calculator states
  const [calcTier, setCalcTier] = useState<"landing" | "business" | "school_church_portal">("business");
  const [calcAddons, setCalcAddons] = useState<string[]>(["whatsapp_bot", "customer_care"]);
  const [calcVolume, setCalcVolume] = useState<number>(300); // inbound requests per week
  const [calcStaffSize, setCalcStaffSize] = useState<number>(3); // admin agents

  // Case study slider/toggle state
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string>("ikeja_school");
  
  // FAQ Section states
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Leads submission state
  const [bookingName, setBookingName] = useState("");
  const [bookingCompany, setBookingCompany] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingService, setBookingService] = useState("web_and_ai_combo");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Clipboard feedback state & custom Toast system
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" }[]>([]);

  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000); // 4 seconds auto-dismiss
  };

  // Strategic proposal tabs
  const [auditTab, setAuditTab] = useState<"all" | "critical" | "high">("all");
  
  // Simple toast feedback handler
  const triggerCopyFeedback = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(key);
    addToast(`"${key.toUpperCase().replace('-', ' ')}" Copied to Clipboard! You can now paste this direct in your deployment systems.`, "success");
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Pre-configured custom WhatsApp message generator helper
  const getWhatsAppURL = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/2348123456789?text=${encoded}`;
  };

  // Interactive AI Strategist generator trigger
  const generateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoading(true);
    setAiProposal("");

    try {
      const response = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry,
          painPoint,
          contactEmail,
          contactPhone,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAiProposal(data.proposal);
      } else {
        setAiProposal("### ⚠️ Connection Diagnostic Note\nFailed to reach server-side API: " + (data.error || "Unknown response state"));
      }
    } catch (err: any) {
      setAiProposal(`### 💡 THE CORE DIAGNOSIS & OPPORTUNITY
For your **${industry}** industry operations, the pain point **"${painPoint}"** represents an immediate leakage of potential revenues.

*Note: Live backend connection timed out or is running offline fallback.*

#### ⚡ THE 3CORDS AUTOMATED ACTION-PLAN
1. **Lightweight Portal Engine**: We will deploy an optimized server-side React application ensuring <1.5s load times.
2. **AI WhatsApp Assistant**: Connect an automated CRM responding instantly 24/7.
3. **Streamlined Workflows**: Move all manual logs into interactive sheets.

**Tap our direct floating WhatsApp Consultant Hotline now to secure a live interactive demonstration!**`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ROI computations
  const calculateROI = () => {
    let basePriceNaira = 0;
    let baseTimeSavedHrs = 0;
    let baseDescription = "";

    switch (calcTier) {
      case "landing":
        basePriceNaira = 250000;
        baseTimeSavedHrs = 8;
        baseDescription = "Elite Landing Page Architecture";
        break;
      case "business":
        basePriceNaira = 450000;
        baseTimeSavedHrs = 18;
        baseDescription = "Corporate Full-Stack Hub";
        break;
      case "school_church_portal":
        basePriceNaira = 750000;
        baseTimeSavedHrs = 35;
        baseDescription = "Custom Specialized Web Portal";
        break;
    }

    let extraNaira = 0;
    let extraTimeSavedHrs = 0;

    calcAddons.forEach(addon => {
      if (addon === "whatsapp_bot") {
        extraNaira += 180000;
        extraTimeSavedHrs += (calcVolume * 0.1); // 6 mins per request
      }
      if (addon === "customer_care") {
        extraNaira += 150000;
        extraTimeSavedHrs += (calcVolume * 0.05); // 3 mins per request
      }
      if (addon === "sms_alerts") {
        extraNaira += 90000;
        extraTimeSavedHrs += 5;
      }
      if (addon === "auto_billing") {
        extraNaira += 120000;
        extraTimeSavedHrs += 15;
      }
      if (addon === "ai_training") {
        extraNaira += 75000;
        extraTimeSavedHrs += 10;
      }
    });

    const totalInvestment = basePriceNaira + extraNaira;
    const totalHoursSavedMonthly = parseFloat((baseTimeSavedHrs + (extraTimeSavedHrs * 4)).toFixed(1));
    const adminHourlyCost = 2500; // Average cost/value per hour in Nigeria for admin staff (₦2500/hr)
    const financialSavingsMonthly = totalHoursSavedMonthly * adminHourlyCost;
    const leadBoostPercent = calcAddons.includes("whatsapp_bot") ? 35 : 15;
    const conversionsCapturedWeekly = Math.round(calcVolume * (leadBoostPercent / 100));

    return {
      totalInvestment,
      totalHoursSavedMonthly,
      financialSavingsMonthly,
      conversionsCapturedWeekly,
      leadBoostPercent
    };
  };

  const roiResult = calculateROI();

  // Dynamic Icon selector
  const renderIcon = (name: string, className = "w-6 h-6 text-orange-500") => {
    switch (name) {
      case "Monitor": return <Monitor className={className} />;
      case "Cpu": return <Cpu className={className} />;
      case "GraduationCap": return <GraduationCap className={className} />;
      case "ShieldCheck": return <ShieldCheck className={className} />;
      case "Briefcase": return <Briefcase className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  // Code Block for Schema to Copy - Dynamically pulled from GENERAL_FAQS data
  const dynamicSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "name": "3Cords System Global Resources",
        "image": "https://3cordssystem.com/assets/logo.png",
        "url": "https://3cordssystem.com",
        "telephone": "+2348123456789",
        "priceRange": "₦₦-₦₦₦",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yaba Tech District, Herbert Macaulay Way",
          "addressLocality": "Lagos",
          "addressRegion": "Lagos State",
          "postalCode": "100001",
          "addressCountry": "NG"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "6.5181",
          "longitude": "3.3713"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "18:00"
        },
        "sameAs": [
          "https://facebook.com/3cordssystem",
          "https://linkedin.com/company/3cordssystem"
        ],
        "service": [
          {
            "@type": "Service",
            "name": "Custom Next.js & React Web Architectures",
            "description": "Ultra-fast mobile-first portals designed for conversion authority."
          },
          {
            "@type": "Service",
            "name": "Gemini-Powered WhatsApp Automation CRM",
            "description": "24/7 autonomous chatbot sales loops for schools and enterprises."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": GENERAL_FAQS.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  const schemaCode = JSON.stringify(dynamicSchema, null, 2);

  // Inject the live JSON-LD schema into the document head for index crawler authority
  useEffect(() => {
    let script = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "jsonld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = schemaCode;
    return () => {
      const existing = document.getElementById("jsonld-schema");
      if (existing) {
        existing.remove();
      }
    };
  }, [schemaCode]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative animate-fade-in">
      
      {/* BACKGROUND DECORATIONS IN LOGO-INSPIRED ORANGE ACCENTS */}
      <div className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-orange-950/20 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[200px] left-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      {/* FIXED STRATEGIC TOP BAR DISCLAIMER */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 text-center sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 text-slate-300 mx-auto md:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          <span className="font-semibold text-orange-400">BRUTAL REDESIGN PROPOSAL STATE:</span>
          <span className="hidden md:inline text-slate-400 font-mono">Transforming 3cordssystem.com into an Elite African Powerhouse</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-slate-500 font-mono">CURRENT TIME UTC: 2026-05-21 17:41</span>
          <a 
            href="#brutal-audit" 
            onClick={() => setActiveWorkspace("strategist")}
            className="text-orange-400 hover:text-orange-300 underline font-semibold transition animate-pulse"
          >
            Read Brutal Audit Report
          </a>
        </div>
      </div>

      {/* MAIN NAVIGATION ROW */}
      <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-md sticky top-[33px] z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo showText={true} />

          {/* MAIN DESKTOP DIRECT SWITCH / TABS */}
          <div className="hidden md:flex bg-slate-900/90 rounded-full p-1 border border-slate-800/85">
            <button
              onClick={() => setActiveWorkspace("redesign")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeWorkspace === "redesign"
                  ? "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-slate-950 font-bold shadow-md shadow-orange-950/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              🌐 Proposed Redesign Preview
            </button>
            <button
              onClick={() => setActiveWorkspace("strategist")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeWorkspace === "strategist"
                  ? "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-slate-950 font-bold shadow-md shadow-orange-950/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              📊 Strategist Audit Hub
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href={getWhatsAppURL("Hello 3Cords. I am viewing your revised website proposal. Let's arrange a free technology consultation.")}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-orange-400 bg-orange-500/5 hover:bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Lagos Office: WA Hotline
            </a>
            <a
              href="#strategy-call"
              onClick={() => {
                setActiveWorkspace("redesign");
                setTimeout(() => {
                  document.getElementById("strategy-call")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="px-4 py-2 bg-white text-slate-950 font-bold rounded-lg text-sm hover:bg-slate-200 transition-all shadow-md shadow-white/5 active:scale-95 duration-100"
            >
              Book Strategy Call
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950 p-4 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveWorkspace("redesign");
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                  activeWorkspace === "redesign"
                    ? "bg-slate-900 border-orange-500 text-orange-400"
                    : "border-slate-900 text-slate-400"
                }`}
              >
                🌐 Redesign App Preview
              </button>
              <button
                onClick={() => {
                  setActiveWorkspace("strategist");
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-xs font-bold text-center border transition-all ${
                  activeWorkspace === "strategist"
                    ? "bg-slate-900 border-orange-500 text-orange-400"
                    : "border-slate-900 text-slate-400"
                }`}
              >
                📊 Strategy Deliverables
              </button>
            </div>
            <div className="laser-line" />
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-semibold px-2">Quick Navigation Links</p>
              {activeWorkspace === "redesign" ? (
                <>
                  <a href="#services-sect" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Services Grid</a>
                  <a href="#case-studies-sect" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Case Studies</a>
                  <a href="#roi-calc-sect" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Interactive Cost Estimator</a>
                  <a href="#ai-consulting-sect" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Live AI Strategy Tool</a>
                  <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Redesign FAQ</a>
                </>
              ) : (
                <>
                  <a href="#brutal-audit" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Brutal Core Audit</a>
                  <a href="#seo-strategy" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">SEO Architecture</a>
                  <a href="#architecture-wireframe" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">Wireframes Blueprint</a>
                  <a href="#transformation-roadmap" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 hover:bg-slate-900 rounded-lg text-sm">30-Day Conversion Roadmap</a>
                </>
              )}
            </div>
            <div className="pt-2">
              <a
                href={getWhatsAppURL("Hello, I would like to schedule a technology system review for my business.")}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-lg text-center block text-sm shadow-md"
              >
                WhatsApp Direct Hotline (🇳🇬)
              </a>
            </div>
          </div>
        )}
      </header>


      {/* WORKSPACE AREA */}
      <main className="flex-grow z-10">
        
        {/* ======================================================== */}
        {/* TAB 1: LIVE PROPOSED ELITE REDESIGN PREVIEW             */}
        {/* ======================================================== */}
        {activeWorkspace === "redesign" && (
          <div className="space-y-20 pb-20">
            
            {/* HERO SECTION CONTAINER */}
            <section className="relative pt-12 md:pt-20 lg:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              {/* Floating Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-medium tracking-tight">
                  <span className="flex h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                  Redefining Digital Scale for Lagos Schools, Businesses & Churches
                </div>
              </div>

              {/* Display Header Copy */}
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                  Stop Losing Leads. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 glow-orange">
                    Automate Your Growth
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                  3Cords System constructs clean, ultra-speed mobile architectures & automated AI assistant solutions. Turn chaotic manual operations into a 24/7 client converting engine.
                </p>

                {/* Conversion Trigger Box */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="#strategy-call"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all text-base shadow-lg hover:shadow-orange-500/15 flex items-center justify-center gap-2 group transform active:scale-95 duration-100"
                  >
                    Book Free System Strategy Audit
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </a>
                  
                  <a
                    href="#services-sect"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all text-base flex items-center justify-center gap-2"
                  >
                    Explore Core Modules
                  </a>
                </div>

                {/* Live Client Trust Strip (Lagos / Yaba proof points) */}
                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 backdrop-blur-sm text-center">
                    <p className="text-2xl font-bold text-white font-display">1.2s</p>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase">Mobile Load Target</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 backdrop-blur-sm text-center">
                    <p className="text-2xl font-bold text-white font-display">24/7</p>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase">Auto Client Capturing</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 backdrop-blur-sm text-center">
                    <p className="text-2xl font-bold text-white font-display">&lt; 30s</p>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase">Lead Response SLA</p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-900/60 backdrop-blur-sm text-center">
                    <p className="text-2xl font-bold text-white font-display">₦0</p>
                    <p className="text-[11px] text-slate-500 font-mono tracking-wider uppercase">High-Cost Server Cost</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* INTEGRATED SERVICES GRID SECTION */}
            <section id="services-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-3">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">CORE PRODUCT SERVICE LINES</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">We Solve Operational Friction</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  Leverage elite web architecture styled for command and autonomous AI scripts calibrated to save up to 140 administrative human hours monthly.
                </p>
              </div>

              {/* Modern Staggered Responsive Service Grid with Framer Motion scroll container */}
              <motion.div 
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.12
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {SERVICES_DATA.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={{
                      hidden: { opacity: 0, y: 35 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85, damping: 14 } }
                    }}
                    className="p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-900 hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between hover:translate-y-[-4px] relative group"
                  >
                    <div className="space-y-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-orange-400">
                        {renderIcon(service.iconName, "w-6 h-6 text-orange-500")}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition">
                          {service.title}
                        </h3>
                        <p className="text-[11px] font-mono text-orange-500/70 mt-1 uppercase tracking-widest font-bold">
                          EST. TIME: {service.timeline}
                        </p>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-900/60 mt-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Target Sectors:</span>
                        <span className="font-semibold text-slate-300">{service.nigerianSectors.slice(0, 2).join(', ')}</span>
                      </div>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="w-full py-2 bg-slate-900 hover:bg-orange-550 hover:bg-orange-500 hover:text-slate-950 text-slate-300 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 group-hover:border-orange-500/20"
                      >
                        Launch Specifications
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Selected Service Detailed Overlay Panel */}
              {selectedService && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
                    <button
                      onClick={() => setSelectedService(null)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/80"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        {renderIcon(selectedService.iconName, "w-8 h-8 text-emerald-400")}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">TECHNOLOGY DEPLOYMENT MODULE</span>
                        <h3 className="text-2xl font-bold text-white">{selectedService.title}</h3>
                      </div>
                    </div>

                    <p className="text-slate-300 text-base leading-relaxed">
                      {selectedService.longDescription}
                    </p>

                    <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">Estimated Timeline</p>
                        <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-400" />
                          {selectedService.timeline}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">Value Starting Fee</p>
                        <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-emerald-400" />
                          {selectedService.pricingEstimate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        Built-In Conversion Trigger System:
                      </p>
                      <p className="text-xs text-slate-400 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 leading-relaxed font-mono">
                        {selectedService.automationPower}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <a
                        href={getWhatsAppURL(`Hello 3Cords Team, I am interested in exploring deployment setup details for "${selectedService.title}" for my operations.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-center text-sm shadow-md"
                      >
                        Confirm Technical Feasibility (WhatsApp)
                      </a>
                      <button
                        onClick={() => setSelectedService(null)}
                        className="py-3 px-5 bg-slate-800 hover:bg-slate-7550 text-slate-300 rounded-xl text-sm font-semibold transition"
                      >
                        Close Blueprints
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* BEFORE & AFTER CLIENT TRANSFORMATION CASE STUDIES */}
            <section id="case-studies-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">CLIENT PROOF INDICATORS</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Lagos Business Transformations</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  We don't deal in vague 'brand promises'. Read the actual metrics of local organizations automated by our dual-stack implementations.
                </p>
              </div>

              {/* Interactive Case study selector and comparative cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Visual Selector Column */}
                <div className="lg:col-span-4 space-y-3">
                  {CASE_STUDIES_DATA.map((study) => (
                    <button
                      key={study.id}
                      onClick={() => setActiveCaseStudyId(study.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        activeCaseStudyId === study.id
                          ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500 text-white shadow-md shadow-emerald-950/20"
                          : "bg-slate-900/40 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">{study.industry}</span>
                        {activeCaseStudyId === study.id && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                      </div>
                      <p className="font-bold text-sm mt-1">{study.clientName}</p>
                    </button>
                  ))}

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-500 font-mono tracking-wider">WANT A SIMILAR AUTOMATION VALUE OUTCOME?</p>
                    <a
                      href="#strategy-call"
                      className="block text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Review Your Internal Gaps Now &rarr;
                    </a>
                  </div>
                </div>

                {/* Detailed Comparative Screen Display */}
                {(() => {
                  const study = CASE_STUDIES_DATA.find(s => s.id === activeCaseStudyId);
                  if (!study) return null;

                  // High fidelity showcase images mapped by study ID
                  const studyImages: Record<string, string> = {
                    ikeja_school: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=700", // Academy
                    gbagada_church: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&q=80&w=700", // Community Hub / Core Server
                    yaba_ecommerce: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=700"  // Premium Couture Store / Fashion tech
                  };

                  return (
                    <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-900 relative overflow-hidden space-y-6">
                      {/* Ambient Accent Glow in deep premium orange */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />

                      {/* Header Image with native lazy loading & aspect ratio to prevent Core Web Vitals layout shifting */}
                      <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-800/80 relative group/img">
                        <img 
                          src={studyImages[study.id]} 
                          alt={`${study.clientName} Automation Showcase`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 brightness-[0.8] saturate-75 hover:saturate-100"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                        <div>
                          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">REAL CLIENT SUCCESS ANALYSIS</p>
                          <h3 className="text-2xl font-bold text-white mt-1">{study.clientName}</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl">
                          <TrendingUp className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="px-1 text-2xl font-extrabold text-orange-400 line-height-1 leading-none">{study.impactMetric}</p>
                            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">{study.metricLabel}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2 space-y-6">
                        <div className="space-y-2">
                          <p className="text-xs text-red-400 uppercase font-mono tracking-wider flex items-center gap-1.5 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            THE MANUAL BOTTLENECK (Challenge)
                          </p>
                          <p className="text-sm text-slate-350 leading-relaxed bg-red-500/5 border border-red-950/20 p-4 rounded-xl">
                            {study.challenge}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs text-orange-400 uppercase font-mono tracking-wider flex items-center gap-1.5 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            THE DUAL-STACK SOLUTION (Redesign)
                          </p>
                          <p className="text-sm text-slate-350 leading-relaxed bg-orange-500/5 border border-orange-950/20 p-4 rounded-xl">
                            {study.solution}
                          </p>
                        </div>
                      </div>

                      {/* Before / After Slider Toggle Simulation */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-900">
                          <p className="text-xs text-slate-500 uppercase font-mono tracking-wider">Before State Setup</p>
                          <p className="text-sm mt-1 text-slate-400">{study.beforeState}</p>
                        </div>
                        <div className="p-4 bg-slate-950/80 rounded-xl border border-orange-500/10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/10 border-l border-b border-orange-500/20 text-[9px] font-mono text-orange-400 uppercase tracking-widest rounded-bl">3CORDS POWERED</div>
                          <p className="text-xs text-orange-400 uppercase font-mono tracking-wider">Redesigned After State</p>
                          <p className="text-sm mt-1 text-slate-300 font-semibold">{study.afterState}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* DYNAMIC INTERACTIVE ROI CALCULATOR & CO-ESTIMATOR */}
            <section id="roi-calc-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">TRANSPARENT VALUE ENGINE</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Dynamic Pricing & ROI Estimator</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  Estimate premium platform architecture costs and model the actual hours and communication expenses saved for your team.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Settings Input Card Column */}
                <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-8">
                  
                  {/* Step 1: Core Portal Structure Option Select */}
                  <div className="space-y-4">
                    <p className="text-xs uppercase font-mono tracking-widest text-emerald-400 flex items-center justify-between">
                      <span>STEP 1: CHOOSE WEBSITE MODULE BASE TIER</span>
                      <span className="text-slate-500 lowercase">(pick one)</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setCalcTier("landing")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          calcTier === "landing"
                            ? "bg-slate-950 border-emerald-500 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-450 hover:bg-slate-950 hover:border-slate-750"
                        }`}
                      >
                        <span className="block text-xs font-semibold text-emerald-400 font-mono mb-1">₦250,000</span>
                        <p className="font-bold text-sm">One-Page Showcase</p>
                        <p className="text-[11px] text-slate-500 mt-1">Stunning mobile responsiveness with core contact points.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCalcTier("business")}
                        className={`p-4 rounded-xl border text-left relative transition-all ${
                          calcTier === "business"
                            ? "bg-slate-950 border-emerald-500 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-450 hover:bg-slate-950 hover:border-slate-750"
                        }`}
                      >
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/20 text-[9px] rounded-bl font-mono text-emerald-400 uppercase">POPULAR</div>
                        <span className="block text-xs font-semibold text-teal-400 font-mono mb-1">₦450,000</span>
                        <p className="font-bold text-sm">Corporate Authority Site</p>
                        <p className="text-[11px] text-slate-500 mt-1">Multi-page, modern bento grid structural design.</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCalcTier("school_church_portal")}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          calcTier === "school_church_portal"
                            ? "bg-slate-950 border-emerald-500 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-450 hover:bg-slate-950 hover:border-slate-750"
                        }`}
                      >
                        <span className="block text-xs font-semibold text-cyan-400 font-mono mb-1">₦750,000</span>
                        <p className="font-bold text-sm">Dynamic Custom Portal</p>
                        <p className="text-[11px] text-slate-500 mt-1">Schools & Churches, reports generation & member directories.</p>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: AI Automation Integrations Select */}
                  <div className="space-y-4">
                    <p className="text-xs uppercase font-mono tracking-widest text-emerald-400 flex items-center justify-between">
                      <span>STEP 2: ADD-ON AI AUTOMATION MODULES</span>
                      <span className="text-slate-500 lowercase">(select multiple)</span>
                    </p>
                    <div className="space-y-2">
                      {[
                        { id: "whatsapp_bot", label: "Gemini AI WhatsApp Bot Integration", cost: "₦180,000", desc: "Closes inquiries, captures student/lead data inside active WhatsApp scripts." },
                        { id: "customer_care", label: "Automated Ticket & Lead Synchronizer", cost: "₦150,000", desc: "Syncs leads straight into interactive Google Sheets/Slack with immediate SMS auto-alerts." },
                        { id: "sms_alerts", label: "Bulky SMS Microservice Engine", cost: "₦90,000", desc: "Automate custom confirmation SMS directly on transaction states." },
                        { id: "auto_billing", label: "Smart Invoicing & Bank Account Router", cost: "₦120,000", desc: "Instant automated invoice generation with direct local bank verification hooks." },
                        { id: "ai_training", label: "Team AI Handover & Training Blueprint", cost: "₦75,000", desc: "Interactive customized tutorials for upskilling school or agency team staff." }
                      ].map(addon => (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => {
                            if (calcAddons.includes(addon.id)) {
                              setCalcAddons(calcAddons.filter(id => id !== addon.id));
                            } else {
                              setCalcAddons([...calcAddons, addon.id]);
                            }
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-4 transition ${
                            calcAddons.includes(addon.id)
                              ? "bg-slate-950 border-emerald-500/60"
                              : "bg-slate-950/20 border-slate-800/80 hover:bg-slate-950"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="pt-1">
                              <div className={`h-4 w-4 rounded flex items-center justify-center border ${
                                calcAddons.includes(addon.id)
                                  ? "bg-emerald-500 border-emerald-400"
                                  : "border-slate-800"
                              }`}>
                                {calcAddons.includes(addon.id) && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-200">{addon.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{addon.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-semibold text-emerald-400">{addon.cost}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume adjustments sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/55 p-4 rounded-xl border border-slate-800">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>WEEKLY LEAD VOLUME</span>
                        <span className="text-emerald-400 font-bold">{calcVolume} inquiries</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="1000"
                        step="20"
                        value={calcVolume}
                        onChange={(e) => setCalcVolume(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Estimates standard inquiries from Facebook, IG, and WhatsApp.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400 font-mono">
                        <span>ADMIN TEAM SIZE</span>
                        <span className="text-emerald-400 font-bold">{calcStaffSize} humans</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="1"
                        value={calcStaffSize}
                        onChange={(e) => setCalcStaffSize(parseInt(e.target.value))}
                        className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Saves administrative work hours across current officers.</p>
                    </div>
                  </div>

                </div>

                {/* Estimate Analysis Result Panel */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
                  {/* Decorative background circle */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">PROJECT INVESTMENT SCOPE</span>
                      <h4 className="text-sm font-bold text-slate-400 mt-1 uppercase">ESTIMATED LAUNCH BUDGET</h4>
                      <p className="text-4xl md:text-5xl font-extrabold text-white font-display mt-2">
                        ₦{roiResult.totalInvestment.toLocaleString()}
                      </p>
                      <p className="text-xs text-theme-emerald text-emerald-400 font-mono mt-2">
                        ≈ ${Math.round(roiResult.totalInvestment / 1400).toLocaleString()} USD Token equivalent valuation
                      </p>
                    </div>

                    <div className="laser-line" />

                    {/* ROI Statistics Breakdown */}
                    <div className="space-y-4">
                      {/* Hours Saved row */}
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Estimated Administrative Hours Saved</p>
                          <p className="text-base font-bold text-white mt-0.5">
                            {roiResult.totalHoursSavedMonthly} hrs / Month
                          </p>
                        </div>
                      </div>

                      {/* Communications value save row */}
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Equivalent Reclaimed Labor Value</p>
                          <p className="text-base font-bold text-slate-200 mt-0.5">
                            ₦{roiResult.financialSavingsMonthly.toLocaleString()} / Month
                          </p>
                        </div>
                      </div>

                      {/* Conversions captured row */}
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Estimated Weekly Conversion Lift</p>
                          <p className="text-base font-bold text-emerald-400 mt-0.5 font-mono">
                            +{roiResult.leadBoostPercent}% Capture Ratio
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-900 space-y-2">
                      <p className="text-xs font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        3Cords System Efficiency Pledge
                      </p>
                      <p className="text-xs text-slate-400 leading-normal">
                        Our Next.js / React micro architectures require robust, low maintenance. Zero hosting fees for smaller configurations leveraging serverless Cloud Run.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-900 space-y-3">
                    <a
                      href={getWhatsAppURL(`Hello 3Cords Team, I modeled my platform pricing estimation on your site. Base tier: ${calcTier}, Add-ons: ${calcAddons.join(", ")}. Total budget is around ₦${roiResult.totalInvestment.toLocaleString()}. Let's finalize details.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-center text-sm shadow-md block transition active:scale-[0.98]"
                    >
                      Lock In Estimate & Proceed &rarr;
                    </a>
                    <p className="text-[10px] text-slate-500 text-center font-mono">
                      *Estimates are custom calculated. No automatic recurring card billings.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* LIVE CHATBOT STRATEGY ADVISOR SECTION */}
            <section id="ai-consulting-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">INTERACTIVE DEEP CONSULTATION</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Live AI Strategy Proposal Generator</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  Experience our agency's actual automation power. Input your exact operational pain point and our server-side specialist handles live analysis instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Form column */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <form onSubmit={generateProposal} className="space-y-4">
                    <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">INPUT CORPORATE CHALLENGES</p>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">1. Business Name / Identity</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Christ the King Academy, Lagos"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-8 w-11 hover:border-slate-700/80 focus:border-emerald-500 text-sm placeholder-slate-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">2. Industry / Sector Category</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-slate-300 focus:outline-none"
                      >
                        <option value="School / Educational Center">School / Educational Center</option>
                        <option value="Church / Religious Center">Church / Religious Center</option>
                        <option value="eCommerce Retail SME">eCommerce Retail SME</option>
                        <option value="Real Estate Development">Real Estate Development</option>
                        <option value="Consultancy or Law Firm">Consultancy or Law Firm</option>
                        <option value="General Professional Services">General Professional Services</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">3. Primary Corporate Pain Point</label>
                      <select
                        value={painPoint}
                        onChange={(e) => setPainPoint(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-955 border border-slate-800 focus:border-emerald-500 text-sm text-slate-300 focus:outline-none"
                      >
                        <option value="Manual paperwork & delayed customer reply times">Manual paperwork & delayed customer reply times</option>
                        <option value="Losing 40%+ inbound leads because of sluggish WhatsApp admin handling">Losing 40%+ inbound leads because of sluggish WhatsApp admin handling</option>
                        <option value="Muddled student billing configurations and chaotic parent message chains">Muddled student billing configurations and chaotic parent message chains</option>
                        <option value="No credible modern digital web presence to scale out high-ticket pricing">No credible modern digital web presence to scale out high-ticket pricing</option>
                        <option value="No automated follow-ups or systematic invoice generation">No automated follow-ups or systematic invoice generation</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Your Mobile No (WhatsApp Optional)</label>
                        <input
                          type="tel"
                          placeholder="e.g., 08031234567"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs placeholder-slate-700 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Private Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="manager@domain.ng"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-850 focus:border-emerald-500 text-xs placeholder-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAiLoading}
                      className="w-full py-4.5 rounded-xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {isAiLoading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                          Consulting AI Strategy Server...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Generate Custom AI Architecture Plan
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5 justify-center leading-normal">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Client privacy guaranteed. Powered securely by Gemini 3.5.
                    </p>
                  </div>
                </div>

                {/* Response preview column */}
                <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-850 relative flex flex-col justify-between overflow-hidden min-h-[460px]">
                  {/* Mock terminal display decoration */}
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="text-[10px] font-mono text-slate-500 ml-2">SYSTEM: CUSTOM_AI_STRATEGY_ENGINE.sh</span>
                    </div>
                    {aiProposal && (
                      <button
                        onClick={() => triggerCopyFeedback("strategy-docs", aiProposal)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono hover:bg-slate-800 px-2 py-0.5 rounded"
                      >
                        {copyFeedback === "strategy-docs" ? "Copied!" : "Copy Report"}
                      </button>
                    )}
                  </div>

                  {/* Body Content output */}
                  <div className="p-6 overflow-y-auto flex-grow text-slate-300 space-y-4 max-h-[450px]">
                    {!aiProposal ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                        <div className="p-4 bg-slate-900 rounded-full border border-slate-800 animate-pulse">
                          <Cpu className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-white">System Awaiting Input Parameters</p>
                          <p className="text-xs text-slate-500 max-w-sm">
                            Fill dynamic school, retail, or religious parameters on the left and hit generate. Our Gemini-expert engine synthesizes actionable roadmap guidelines.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line text-slate-300">
                        {aiProposal}
                      </div>
                    )}
                  </div>

                  {/* Actions row */}
                  {aiProposal && (
                    <div className="p-4 bg-slate-900/60 border-t border-slate-850 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs text-slate-400 font-mono">Proposal Code: NG-3C-{(businessName ? businessName.slice(0, 3).toUpperCase() : "SME")}-2026</span>
                      </div>
                      <a
                        href={getWhatsAppURL(`Hello, I would like to schedule a free architecture consultation to implement the AI Strategy report generated on your website. Code: NG-3C-${businessName ? businessName.slice(0, 3).toUpperCase() : "SME"}-2026. Industry: ${industry}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        Connect with Lagos Consultant on WA
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* INTERACTIVE COMPREHENSIVE FAQ SECTION */}
            <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">CLIENT KNOWLEDGE BASE</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">Frequently Addressed Questions</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  We demystify modern technology. Read our straightforward answers regarding delivery speeds, billing integrations, and tech standards.
                </p>
              </div>

              {/* FAQ Filters & search bars */}
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search general questions (e.g., 'WhatsApp', 'Time', 'Cost')..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full p-3 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute left-3.5 top-[15px] text-slate-500 font-mono">🔍</span>
                  </div>

                  <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 w-full md:w-auto overflow-x-auto">
                    {["All", "Web Dev", "AI Automation", "Trust & Delivery"].map(category => (
                      <button
                        key={category}
                        onClick={() => setFaqCategory(category)}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition ${
                          faqCategory === category
                            ? "bg-slate-950 text-emerald-400 border border-slate-800"
                            : "text-slate-400 hover:text-slate-200 animate"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accordions List */}
                <div className="space-y-3">
                  {(() => {
                    const filtered = GENERAL_FAQS.filter(faq => {
                      const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
                      const matchesCat = faqCategory === "All" || faq.category === faqCategory;
                      return matchesSearch && matchesCat;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-12 text-slate-500">
                          <p>No queries match your search parameters.</p>
                          <button onClick={() => { setFaqSearch(""); setFaqCategory("All"); }} className="text-emerald-400 underline text-xs mt-2">Reset FAQ Filters</button>
                        </div>
                      );
                    }

                    return filtered.map((faq, i) => (
                      <div
                        key={i}
                        className="bg-slate-900/40 border border-slate-880 rounded-xl transition-all duration-200"
                      >
                        <button
                          onClick={() => setExpandedFaqIndex(expandedFaqIndex === i ? null : i)}
                          className="w-full p-4 text-left flex items-center justify-between gap-4 font-medium text-white hover:text-emerald-400 transition"
                        >
                          <span className="text-sm md:text-base">{faq.question}</span>
                          <span className="text-slate-500">{expandedFaqIndex === i ? "▲" : "▼"}</span>
                        </button>
                        
                        {expandedFaqIndex === i && (
                          <div className="px-4 pb-4 text-xs md:text-sm text-slate-400 border-t border-slate-900/60 pt-3 leading-relaxed">
                            {faq.answer}
                            <div className="mt-3 flex gap-2">
                              <span className="text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">{faq.category}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* FOUNDER STORY SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Bio text */}
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">MEET THE TECH LEAD</span>
                    <h3 className="text-2xl md:text-4xl font-bold text-white">Crafted locally. Calibrated globally.</h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                      "At 3Cords System Global Resources, we believe that African businesses do not need sluggish website builders or bloated page themes that consume parent mobile data. True digital power lies in deploying extremely optimized React modules, pairing them with automated WhatsApp scripts, and saving hundreds of administrative hours so school directors, eCommerce managers, and churches can focus on physical excellence."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-sm font-mono border border-emerald-500/30">
                        FO
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">Fidelis Ogungbe (T.L. - 3Cords Lead)</p>
                        <p className="text-xs text-slate-500">Chief Executive AI Automation Strategist, Lagos Node</p>
                      </div>
                    </div>
                  </div>

                  {/* Wireframe Mockup Visual Graphic instead of standard photo */}
                  <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4 relative overflow-hidden">
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-900 text-[9px] font-mono text-slate-500 border border-slate-800 rounded uppercase">3C CORE METRIC</div>
                    <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest">3CORDS GUARANTEE METRICS</p>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Mobile Accessibility Score</span>
                          <span className="font-bold text-emerald-400 font-mono">98% Perfect LCP</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '98%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Monthly Admin Reduction Ratio</span>
                          <span className="font-bold text-emerald-400 font-mono">Saves Mean 70+ Hours</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '85%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>System Architecture Payback Window</span>
                          <span className="font-bold text-emerald-400 font-mono">&lt; 45 Days Median ROI</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '92%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={getWhatsAppURL("Hello. I would like to schedule a private phone review regarding web upgrades for my corporate entity.")}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold font-mono uppercase text-center block"
                      >
                        Request Private Tech Audit
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* STRATEGY CONVERSION CALL CONVERSION FUNNEL FORM */}
            <section id="strategy-call" className="max-w-4xl mx-auto px-4 py-8">
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-emerald-500/20 text-center space-y-8 relative overflow-hidden">
                {/* Decorative lines and glows */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

                <div className="space-y-3 max-w-2xl mx-auto">
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">BOOK FREE SYSTEM STRATEGY AUDIT</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">Uncover Operational Friction Gaps</h3>
                  <p className="text-slate-400 text-sm">
                    No salespeople. You'll chat with our lead tech systems architect in Lagos. We map out a bespoke responsive wireframe mock and estimate administrative cost savings.
                  </p>
                </div>

                {bookingSubmitted ? (
                  <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl max-w-lg mx-auto space-y-4">
                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h4 className="text-lg font-bold text-white">Strategy Request Registered!</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Thank you! Our systems lead has queued your request. To bypass delays and view immediately, click the direct WhatsApp consulting button below.
                    </p>
                    <a
                      href={getWhatsAppURL(`Hello, I submitted my strategy call request for my business: "${bookingCompany}". Please check my details and suggest a system call time.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm rounded-xl transition"
                    >
                      Instant WhatsApp Strategy Booking
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBookingSubmitted(true);
                    }}
                    className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Your Human Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Mrs. Aisha Adebayo"
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">School / SME Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Lead British Prep School"
                        value={bookingCompany}
                        onChange={(e) => setBookingCompany(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Operational Work Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g., 0803 456 7890"
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Selected Technology Area</label>
                      <select
                        value={bookingService}
                        onChange={(e) => setBookingService(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-350 text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="web_and_ai_combo">Elite Web + WhatsApp Automation Combo</option>
                        <option value="school_church_custom">School Administration Report Portal</option>
                        <option value="independent_white_label">One-Man AI Agency Setup Blueprint</option>
                        <option value="ongoing_maintenance">Managed Website Overhaul & Uptime Retainer</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 transition shadow-lg shadow-emerald-950/20"
                      >
                        Request Instant System Architecture Review
                      </button>
                    </div>
                  </form>
                )}

                <div className="text-[11px] text-slate-500 max-w-md mx-auto leading-normal">
                  *By requesting, you trigger a guaranteed localized review. We build real code and outline exact wireframe specs within 48 hours.
                </div>
              </div>
            </section>

          </div>
        )}


        {/* ======================================================== */}
        {/* TAB 2: AUDIT & DELIVERABLES WORKSPACE                     */}
        {/* ======================================================== */}
        {activeWorkspace === "strategist" && (
          <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            
            {/* Introductory Blueprint Header */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900 border border-slate-800 relative space-y-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">EXECUTIVE STRATEGIC ANALYZERS BOARD</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">Elite Digital Brand, SEO & Design Architecture Blueprint</h2>
              <p className="text-sm text-slate-400 max-w-4xl leading-relaxed">
                This document represents a brutal, comprehensive technology and conversion audit formulated by our executive team. Discover the technical bottlenecks on the legacy <code className="text-emerald-400 font-mono">3cordssystem.com</code> and access complete schema code blocks, performance overhauls, typography configurations, and a 30-day tactical transition roadmap.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-mono">SEO Status</p>
                  <p className="text-sm font-bold text-emerald-400 mt-1">Optimized Structure</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-mono">Tech Recommends</p>
                  <p className="text-sm font-bold text-teal-400 mt-1">Next.js Serverless</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-mono">Target Mobile Speeds</p>
                  <p className="text-sm font-bold text-cyan-400 mt-1">&lt; 1.5s in Lagos</p>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/60 text-center">
                  <p className="text-xs text-slate-500 uppercase font-mono">Schema Status</p>
                  <p className="text-sm font-bold text-pink-400 mt-1">JSON-LD Instantiated</p>
                </div>
              </div>
            </div>

            {/* SECT 1: BRUTAL CORE AUDIT OF LEGACY WEBSITE */}
            <section id="brutal-audit" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">DIAGNOSTIC BLOCK 01</span>
                  <h3 className="text-xl md:text-3xl font-bold text-white mt-1">Brutal Website Analysis Report</h3>
                </div>
                
                {/* Audit level filter */}
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0">
                  <button
                    onClick={() => setAuditTab("all")}
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      auditTab === "all" ? "bg-slate-950 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All Audits (4)
                  </button>
                  <button
                    onClick={() => setAuditTab("critical")}
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      auditTab === "critical" ? "bg-red-500/15 text-red-400" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Critical Level Only
                  </button>
                </div>
              </div>

              {/* List of brutal truth cards */}
              <div className="space-y-4">
                {(() => {
                  const filtered = BRUTAL_AUDIT_DATA.filter(audit => {
                    if (auditTab === "critical") return audit.impactScore === "CRITICAL";
                    return true;
                  });

                  return filtered.map((audit) => (
                    <div
                      key={audit.id}
                      className="p-5 md:p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80 relative space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-850">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                            audit.impactScore === "CRITICAL"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          }`}>
                            LEVEL: {audit.impactScore}
                          </span>
                          <h4 className="font-bold text-white text-base md:text-lg">{audit.component}</h4>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">Asset ID: 3C-AUD-{audit.id.toUpperCase()}</span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Column 1: Brutal Truth */}
                        <div className="lg:col-span-5 bg-red-500/5 p-4 rounded-xl border border-red-950/20 space-y-1.5">
                          <p className="text-[10px] font-mono text-red-400 uppercase font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            THE BRUTAL REALITY:
                          </p>
                          <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">{audit.brutalTruth}</p>
                        </div>

                        {/* Column 2: Redesigned State */}
                        <div className="lg:col-span-4 bg-emerald-500/5 p-4 rounded-xl border border-emerald-950/20 space-y-1.5">
                          <p className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            THE PROPOSED RECONSTRUCTION:
                          </p>
                          <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-sans">{audit.redesignSolution}</p>
                        </div>

                        {/* Column 3: SEO Analysis */}
                        <div className="lg:col-span-3 bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-1.5">
                          <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">SEO & SEARCH IMPLICATION:</p>
                          <p className="text-[11px] text-slate-400 leading-normal font-mono">{audit.seoImplication}</p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </section>

            <div className="laser-line" />

            {/* SECT 2: BRAND CONVERSION SCHEMAS & SEO EXCELLENCE */}
            <section id="seo-strategy" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Copywriting principles and guidelines */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">SEO & BRAND SYSTEM</span>
                  <h3 className="text-2xl font-bold text-white mt-1">SEO & Brand Positioning Strategy</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    How we position the redesigned 3Cords brand to dominate organically in local SERPs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      LOCAL SEARCH HIERARCHY TAGGING ( Lagos/Abuja Target )
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      Ensure major keywords like <strong>"AI automation agency Nigeria"</strong>, <strong>"custom parent portal school software Lagos"</strong>, and <strong>"bespoke next.js developer Lagos"</strong> reside inside dedicated H1, H2, and FAQ microdata. This guarantees organic crawlability without paying heavy Google Ads premiums.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-teal-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      THEME COLOR SYSTEM & BRAND VIBE
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1.5 font-mono list-disc list-inside">
                      <li><strong className="text-slate-200">Outer Canvas:</strong> Deep slate-950 background for an premium, innovative mood</li>
                      <li><strong className="text-slate-200">Main Highlight:</strong> Laser emerald-400 indicating maximum automation accuracy</li>
                      <li><strong className="text-slate-200">Typography Theme:</strong> Space Grotesk (technical style) & Plus Jakarta Sans</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                      ★ STRATEGIST SEO META DISCOVERY TIP
                    </p>
                    <p className="text-xs text-slate-450 leading-relaxed">
                      Always include a fully instantiated JSON-LD schema referencing your physical Lagos coordinates (Herbert Macaulay Way/Yaba Tech corridors). This builds local authority scores, lifting local business listings on maps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real JSON Schema Output with easy copying capability */}
              <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold block">METADATA SCHEMAS</span>
                    <p className="text-xs font-bold text-white">Google Schema JSON-LD Markup</p>
                  </div>
                  <button
                    onClick={() => triggerCopyFeedback("schema-json", schemaCode)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded"
                  >
                    {copyFeedback === "schema-json" ? "Copied!" : "Copy Schema Code"}
                  </button>
                </div>

                <div className="p-4 bg-slate-950 overflow-x-auto text-[11px] font-mono text-slate-400 leading-relaxed select-all">
                  <pre className="text-emerald-300 font-mono max-h-[350px] overflow-y-auto w-full whitespace-pre">
                    {schemaCode}
                  </pre>
                </div>

                <div className="p-3 bg-slate-900/60 border-t border-slate-850 text-xs text-slate-500 leading-normal flex items-start gap-2">
                  <span className="text-emerald-400">ℹ</span>
                  <p>Copy and inject this into your redesigned homepage <code className="text-slate-400">&lt;head&gt;</code> element to claim the local snippet structure instantly on Google Search.</p>
                </div>
              </div>
            </section>

            <div className="laser-line" />

            {/* SECT 3: HOME-PAGE WIREFRAME STRUCTURAL SCHEMATICS */}
            <section id="architecture-wireframe" className="space-y-6">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">DIAGNOSTIC BLOCK 03</span>
                <h3 className="text-2xl font-bold text-white mt-1">Homepage Wireframe Blueprint Mockups</h3>
                <p className="text-sm text-slate-400">
                  Visual mapping of how standard components reside to guarantee maximum user attention retention within the first 30 seconds of landing.
                </p>
              </div>

              {/* Wireframe bento grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Panel 1: Hero Block */}
                <div className="bg-slate-950/80 border border-dashed border-slate-800 p-5 rounded-2xl space-y-4 relative">
                  <span className="absolute top-2 right-2 text-[9px] font-mono bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">HERO-BLOCK-WF</span>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">NAV BAR & HERO PRE-VIEW</p>
                  <p className="text-sm font-bold text-white select-none">Framer Minimalist Layout Structure</p>
                  
                  <div className="space-y-2 text-xs text-slate-400 select-none">
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-center">
                      [Glow Link Badge]: Nigeria's Premier AI Agency
                    </div>
                    <div className="p-4 bg-slate-900 rounded border border-slate-800 text-center space-y-2">
                      <p className="font-extrabold text-slate-200">H1: Stop Losing Leads. Automate Your Growth.</p>
                      <p className="text-[10px] text-slate-500">Body paragraph detailing zero-bloat dynamic React setup.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-center font-bold text-emerald-400">
                        Primary CTA: Book Strategy Call
                      </div>
                      <div className="p-2 bg-slate-900 border border-slate-800 rounded text-[10px] text-center text-slate-500">
                        Secondary CTA: Explore Modules
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Product Solution Grid */}
                <div className="bg-slate-950/80 border border-dashed border-slate-800 p-5 rounded-2xl space-y-4 relative">
                  <span className="absolute top-2 right-2 text-[9px] font-mono bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">SERVICE-CARDS-WF</span>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">PRODUCT GRID MAPPING</p>
                  <p className="text-sm font-bold text-white select-none">Staggered Interactive Grid Card</p>

                  <div className="space-y-2 text-xs text-slate-400 select-none">
                    <div className="p-4 bg-slate-900 rounded border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="p-1 bg-slate-950 rounded border border-slate-850">🖥️ [Icon]</span>
                        <span className="text-[9px] text-slate-500 font-mono font-semibold">EST. TIME: 7 DAYS</span>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-200">Next.js Web Platforms</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Custom-coded responsive structures.</p>
                      </div>
                      <div className="laser-line" />
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Sectors: Schools, SMEs</span>
                        <span className="text-emerald-400 font-semibold font-mono">₦250k Base</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel 3: Funnel Call Box */}
                <div className="bg-slate-950/80 border border-dashed border-slate-800 p-5 rounded-2xl space-y-4 relative">
                  <span className="absolute top-2 right-2 text-[9px] font-mono bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded">FUNNEL-FORM-WF</span>
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">CONVERSION MECHANICS</p>
                  <p className="text-sm font-bold text-white select-none">Targeted System Diagnostic Funnel</p>

                  <div className="space-y-2 text-xs text-slate-400 select-none">
                    <div className="p-4 bg-slate-900 rounded border border-slate-800 text-center space-y-2">
                      <p className="font-bold text-slate-200">AI Strategy Core Generator</p>
                      <p className="text-[10px] text-slate-500">Dynamic trigger queries: Name | Pain-Point | Phone</p>
                      <div className="laser-line" />
                      <div className="bg-slate-950 p-2 text-left rounded font-mono text-[9px] text-slate-500">
                        Executing node sequence parameters server-side with Gemini Flash integration...
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            <div className="laser-line" />

            {/* SECT 4: 30-DAY TRANSFORMATION & TECHNICAL ROADMAP */}
            <section id="transformation-roadmap" className="space-y-8 bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800">
              <div className="text-center md:text-left space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">TRANSFORMATION EXECUTION TRACK</span>
                <h3 className="text-2xl md:text-3.5xl font-bold text-white">30-Day Conversion Redeployment Roadmap</h3>
                <p className="text-sm text-slate-400">
                  Step-by-step structural blueprint for staging, designing, testing, and fully indexing the premium 3Cords Global website.
                </p>
              </div>

              <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-8 pl-6 md:pl-8">
                
                {/* Milestone 1 */}
                <div className="relative">
                  <span className="absolute -left-[35px] md:-left-[43px] top-1 h-6 w-6 rounded-full bg-slate-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                      Days 1–5: Visual Overhaul & Interactive Blueprinting
                    </h4>
                    <p className="text-xs text-emerald-400 font-mono mt-1">Focus Areas: Brand guidelines, typography, layout mockups</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                      De-bloat all generic themes. Wire and calibrate the core React application layer with modern display heading configurations (Space Grotesk + Plus Jakarta Sans). Construct high-converting localized copy matching Nigerian target demographics.
                    </p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <span className="absolute -left-[35px] md:-left-[43px] top-1 h-6 w-6 rounded-full bg-slate-950 border-2 border-teal-500 flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                      Days 6–15: Core Platform Modular Build-out
                    </h4>
                    <p className="text-xs text-teal-400 font-mono mt-1">Focus Areas: Modular clean-code, custom components, slider states</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                      Construct the optimized Services grids, structural accordion elements, and reactive pricing estimators. Setup before/after comparison modules and connect floating client click actions straight to the executive WhatsApp hotlines.
                    </p>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <span className="absolute -left-[35px] md:-left-[43px] top-1 h-6 w-6 rounded-full bg-slate-950 border-2 border-cyan-500 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                      Days 16–22: AI Server Integration & Chatbot Pipeline
                    </h4>
                    <p className="text-xs text-cyan-400 font-mono mt-1">Focus Areas: Server-side Gemini API routing, prompt calibrations, fallbacks</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                      Deploy light API routing loops on Node/Koa/Express containers. Secure your Gemini API key inside backend environments. Fine-tune localized prompt configurations prioritizing Naira estimates and common infrastructure recommendations.
                    </p>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="relative">
                  <span className="absolute -left-[35px] md:-left-[43px] top-1 h-6 w-6 rounded-full bg-slate-950 border-2 border-purple-500 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
                    4
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                      Days 23–30: Edge Optimization & local SEO Domination
                    </h4>
                    <p className="text-xs text-purple-400 font-mono mt-1">Focus Areas: Core Web Vitals audit, JSON Schema integrations, search indexing</p>
                    <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
                      Inject localized JSON-LD schema blocks direct in head wrappers. Configure image layout tags, and setup automated weekly backups on Google Cloud to ensure 99.9% uptime.
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 px-4 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Bio */}
          <div className="md:col-span-4 space-y-4">
            <Logo showText={true} />
            
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              "3Cords System Global Resources" is an elite technological solution agency registered locally in Lagos, Nigeria. We design light-speed Next.js web portals and autonomous digital automations for modern schools, religious entities, and progressive enterprises.
            </p>

            <p className="text-[10px] text-slate-600 font-mono">
              Registration Corridors: RC-3C-LagosNode
            </p>
          </div>

          {/* Col 2: Services */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px] text-orange-450 text-orange-400 font-bold">TECHNOLOGY SOLUTIONS</h5>
            <ul className="space-y-2">
              <li><a href="#services-sect" onClick={() => setActiveWorkspace("redesign")} className="hover:text-orange-400 transition">Custom Next.js & React Architectures</a></li>
              <li><a href="#services-sect" onClick={() => setActiveWorkspace("redesign")} className="hover:text-orange-400 transition">Gemini WhatsApp Bot Deployments</a></li>
              <li><a href="#services-sect" onClick={() => setActiveWorkspace("redesign")} className="hover:text-orange-400 transition">School Admin Portal Systems</a></li>
              <li><a href="#services-sect" onClick={() => setActiveWorkspace("redesign")} className="hover:text-orange-400 transition">One-Man AI Agency Blueprints</a></li>
            </ul>
          </div>

          {/* Col 3: Strategist items */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px] text-teal-400">EXECUTIVE DELIVERABLES</h5>
            <ul className="space-y-2">
              <li><a href="#brutal-audit" onClick={() => setActiveWorkspace("strategist")} className="hover:text-teal-400 transition">Honest Brutal UX Audit</a></li>
              <li><a href="#seo-strategy" onClick={() => setActiveWorkspace("strategist")} className="hover:text-teal-400 transition">SEOSchemas & Meta Tags</a></li>
              <li><a href="#architecture-wireframe" onClick={() => setActiveWorkspace("strategist")} className="hover:text-teal-400 transition">Wireframe Structural Blueprints</a></li>
              <li><a href="#transformation-roadmap" onClick={() => setActiveWorkspace("strategist")} className="hover:text-teal-400 transition">30-Day Project Roadmap</a></li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h5 className="font-bold text-white font-mono uppercase tracking-wider text-[11px] text-cyan-400">LAGOS TECH DISTRICT</h5>
            <p className="text-slate-500 leading-normal font-sans">
              Herbert Macaulay Way,<br />
              Yaba Corridors,<br />
              Lagos Node, Nigeria
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Tel: +234 81 2345 6789
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-650">
          <p className="text-[11px] text-slate-600 font-mono">
            &copy; 2026 3Cords System Global Resources. Strategic Redesign formulated by our senior audit suite. All rights indexable.
          </p>

          <div className="flex gap-4 text-slate-500 font-mono text-[10px]">
            <span>UTC TIMESTAMP: 2026-05-21 17:09</span>
            <span>SECURE ENCRYPTION SHA-256</span>
          </div>
        </div>
      </footer>


      {/* FLOATING AND STICKY WHATSAPP WHISPER WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
        {/* Hover label hint */}
        <div className="bg-slate-900 border border-slate-800 text-[10px] md:text-xs text-slate-200 px-3 py-1.5 rounded-xl shadow-lg font-bold flex items-center gap-1.5 animate-bounce pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          🇳🇬 Live Strategy Hotline online
        </div>

        {/* Pulsing trigger button */}
        <a
          href={getWhatsAppURL("Hello 3Cords System, I am viewing your beautiful elite Redesign Proposal. I would like to lock in a free system architecture review call for my business.")}
          target="_blank"
          rel="noreferrer"
          className="h-14 w-14 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-emerald-950/40 transition hover:scale-110 active:scale-95 duration-100 pointer-events-auto relative shrink-0"
          title="Instant WhatsApp Consultation"
        >
          {/* Animated ripple circle */}
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
          
          <img 
            src="https://cdn-icons-png.flaticall.com/512/3670/3670051.png" 
            alt="WA" 
            className="w-7 h-7 filter brightness-0 invert" 
            onError={(e) => {
              // Fallback text if image source has issue
              e.currentTarget.style.display = 'none';
              const textNode = document.createElement('span');
              textNode.innerText = 'WA';
              textNode.className = 'font-extrabold text-[#020617] text-sm';
              e.currentTarget.parentNode?.appendChild(textNode);
            }}
          />
        </a>
      </div>

      {/* FLOATING AND AUTO-DISMISSING TOAST NOTIFICATIONS IN THE TOP-RIGHT CORNER */}
      <div className="fixed top-24 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full flex flex-col items-end">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900/95 border border-orange-500/40 text-white rounded-xl shadow-xl shadow-orange-950/25 p-4 flex items-center gap-3 animate-toast-in max-w-sm"
          >
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping shrink-0" />
            <div className="flex-grow text-xs">
              <p className="font-bold text-orange-400 uppercase tracking-widest font-mono text-[9px] mb-0.5">SYSTEM BROADCAST</p>
              <p className="text-slate-200 leading-normal">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-slate-500 hover:text-white text-xs pl-2 font-mono shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
