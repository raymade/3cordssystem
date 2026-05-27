import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./components/Logo";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { LanguageSwitcher, LanguageCode } from "./components/LanguageSwitcher";
import { TRANSLATIONS } from "./utils/translations";
import { TestimonialCarousel } from "./components/TestimonialCarousel";
import { Sun, Moon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
  ListFilter,
  Mic,
  MicOff
} from "lucide-react";
import {
  SERVICES_DATA,
  CASE_STUDIES_DATA,
  BRUTAL_AUDIT_DATA,
  COMPETITOR_ANALYSIS,
  GENERAL_FAQS,
  BRAND_COLORS
} from "./data";
import { ServiceItem, CaseStudyItem, AuditItem, FAQItem } from "./types";

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
  
  // Voice recognition states for input fields using Web Speech API
  const [isListeningBusiness, setIsListeningBusiness] = useState(false);
  const [isListeningPain, setIsListeningPain] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Real-time audio feedback state with 12 dynamic visualizer bands
  const [audioLevels, setAudioLevels] = useState<number[]>([12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const active = isListeningBusiness || isListeningPain;
    if (!active) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => console.error("Error closing context:", err));
        audioContextRef.current = null;
      }
      setAudioLevels([12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]);
      return;
    }

    let isSubscribed = true;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;

    const initAudio = async () => {
      try {
        // Try requesting real mic access for visual feedback
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isSubscribed) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        audioStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 64; 
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const updateLevel = () => {
          if (!isSubscribed) return;
          if (analyser) {
            analyser.getByteFrequencyData(dataArray);
            const subset = Array.from(dataArray.slice(0, 12)).map((val, idx) => {
              // Apply dynamic low-volume range expansion (non-linear scaling)
              // to significantly lift quieter signals for much higher visibility.
              const normalized = val / 255;
              const boosted = Math.pow(normalized, 0.4); // Deeper root for aggressive quiet boost
              const baseValue = Math.max(15, Math.round(boosted * 100));
              const randomOffset = isListeningBusiness || isListeningPain ? Math.sin(Date.now() / 150 + idx) * 4 + Math.random() * 6 : 0;
              return Math.min(100, Math.max(15, baseValue + randomOffset));
            });
            while (subset.length < 12) subset.push(15);
            setAudioLevels(subset);
          }
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      } catch (err) {
        // If modern permissions are rejected or iframe locks the audio stream,
        // we fallback to a beautiful, organic mathematical wave simulation.
        const simulatedLoop = () => {
          if (!isSubscribed) return;
          const subset = Array.from({ length: 12 }).map((_, idx) => {
            const phase = Date.now() / 80 + idx * 0.7;
            const sineInput = Math.sin(phase) * 35;
            const cosInput = Math.cos(phase * 1.8) * 15;
            const val = Math.round(62 + sineInput + cosInput + Math.random() * 12);
            return Math.min(100, Math.max(20, val));
          });
          setAudioLevels(subset);
          animationFrameRef.current = requestAnimationFrame(simulatedLoop);
        };
        animationFrameRef.current = requestAnimationFrame(simulatedLoop);
      }
    };

    initAudio();

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isListeningBusiness, isListeningPain]);

  const toggleSpeechRecognition = (field: "business" | "painPoint") => {
    setSpeechError(null);
    const isCurrentlyListening = field === "business" ? isListeningBusiness : isListeningPain;

    if (isCurrentlyListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error("Error stopping speech recognition:", err);
        }
      }
      setIsListeningBusiness(false);
      setIsListeningPain(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setSpeechError("Speech recognition is not supported in this environment or browser. Try Chrome/Safari.");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Native Nigerian locales map corresponding to standard Web Speech locales
      const localeMap: Record<string, string> = {
        en: "en-NG",
        yo: "yo-NG",
        ha: "ha-NG",
        ig: "ig-NG"
      };
      recognition.lang = localeMap[lang] || "en-NG";

      if (field === "business") {
        setIsListeningBusiness(true);
        setIsListeningPain(false);
      } else {
        setIsListeningPain(true);
        setIsListeningBusiness(false);
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0]?.transcript;
        if (transcript) {
          if (field === "business") {
            setBusinessName(transcript);
          } else {
            setPainPoint(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event);
        if (event.error && event.error !== "no-speech") {
          setSpeechError(`Notice: ${event.error === "not-allowed" ? "Microphone access blocked" : event.error}`);
        }
        setIsListeningBusiness(false);
        setIsListeningPain(false);
      };

      recognition.onend = () => {
        setIsListeningBusiness(false);
        setIsListeningPain(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e: any) {
      console.error("Speech Recognition initialization error:", e);
      setSpeechError("Could not access microphone.");
      setIsListeningBusiness(false);
      setIsListeningPain(false);
    }
  };
  
  // Interactive Service overlay state
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  // Interactive ROI Calculator states
  const [calcTier, setCalcTier] = useState<"landing" | "business" | "school_church_portal" | "enterprise">("business");
  const [calcAddons, setCalcAddons] = useState<string[]>(["whatsapp_bot", "customer_care"]);
  const [calcVolume, setCalcVolume] = useState<number>(300); // inbound requests per week
  const [calcStaffSize, setCalcStaffSize] = useState<number>(3); // admin agents

  // Case study slider/toggle state
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string>("ikeja_school");
  
  // FAQ Section states
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Dynamic FAQ translated state
  const [localizedFaqs, setLocalizedFaqs] = useState<FAQItem[]>(GENERAL_FAQS);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [copiedFaqs, setCopiedFaqs] = useState(false);

  // Leads submission state
  const [bookingName, setBookingName] = useState("");
  const [bookingCompany, setBookingCompany] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingService, setBookingService] = useState("web_and_ai_combo");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // Global Language & Theme requested states
  const [lang, setLang] = useState<LanguageCode>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Dynamic Translation fetch effect on language change
  useEffect(() => {
    let isCurrent = true;
    if (lang === "en") {
      setLocalizedFaqs(GENERAL_FAQS);
      return;
    }

    const fetchTranslation = async () => {
      setIsLoadingFaqs(true);
      try {
        const res = await fetch("/api/translate-faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetLang: lang, faqs: GENERAL_FAQS })
        });
        const data = await res.json();
        if (isCurrent && data.success && data.translatedFaqs) {
          setLocalizedFaqs(data.translatedFaqs);
        }
      } catch (err) {
        console.error("Dynamic AI translation failed:", err);
      } finally {
        if (isCurrent) setIsLoadingFaqs(false);
      }
    };

    fetchTranslation();
    return () => {
      isCurrent = false;
    };
  }, [lang]);

  // Copy all FAQs to clipboard formatted as Markdown
  const handleCopyFAQs = () => {
    const titles: Record<LanguageCode, string> = {
      en: "Frequently Asked Questions",
      yo: "Àwọn Ìbéèrè Tí A Sábà Ń Béèrè",
      ha: "Tambayoyin Da Aka Fi Yi",
      ig: "Ajụjụ Ndị Ajụrụ Teziri"
    };

    let md = `# 3Cords System - ${titles[lang]} (${lang.toUpperCase()})\n\n`;
    md += `Exported relative to client-facing documentation on ${new Date().toLocaleDateString()}.\n\n`;

    const distinctCategories: ("Technical" | "Billing" | "General")[] = ["Technical", "Billing", "General"];
    distinctCategories.forEach(cat => {
      const items = localizedFaqs.filter(item => item.category === cat);
      if (items.length > 0) {
        md += `## ${cat}\n\n`;
        items.forEach((item, index) => {
          md += `### Q${index + 1}: ${item.question}\n`;
          md += `**A:** ${item.answer}\n\n`;
        });
      }
    });

    navigator.clipboard.writeText(md)
      .then(() => {
        setCopiedFaqs(true);
        setTimeout(() => setCopiedFaqs(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy FAQs:", err);
      });
  };

  // Trending FAQ searches state
  const [trendingSearches, setTrendingSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("faq_trending_searches");
      return saved ? JSON.parse(saved) : ["WhatsApp", "Cost", "Timeline", "Security", "SEO"];
    } catch (e) {
      return ["WhatsApp", "Cost", "Timeline", "Security", "SEO"];
    }
  });

  // Mobile Sticky CTA visual visibility state
  const [showMobileStickyCta, setShowMobileStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        if (window.scrollY > 550) {
          setShowMobileStickyCta(true);
        } else {
          setShowMobileStickyCta(false);
        }
      } else {
        setShowMobileStickyCta(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lead Analytics Click Log state
  const [whatsAppClickLogs, setWhatsAppClickLogs] = useState<{
    id: string;
    timestamp: string;
    serviceViewed: string;
    action: string;
    platform: string;
  }[]>(() => {
    try {
      const saved = localStorage.getItem("3cords_wa_clicks");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "demo-1",
        timestamp: "2026-05-26 04:12:08",
        serviceViewed: "World-Class Web Architectures",
        action: "Floating WhatsApp Consultation button clicked",
        platform: "Mobile App Interface"
      },
      {
        id: "demo-2",
        timestamp: "2026-05-25 18:44:21",
        serviceViewed: "AI Automation & WhatsApp Bots",
        action: "Floating WhatsApp Consultation button clicked",
        platform: "Desktop Dashboard"
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("3cords_wa_clicks", JSON.stringify(whatsAppClickLogs));
    } catch (e) {
      console.error(e);
    }
  }, [whatsAppClickLogs]);

  // Real-time form field errors
  const [bookingEmailError, setBookingEmailError] = useState<string | null>(null);
  const [bookingPhoneError, setBookingPhoneError] = useState<string | null>(null);
  const [strategyEmailError, setStrategyEmailError] = useState<string | null>(null);
  const [strategyPhoneError, setStrategyPhoneError] = useState<string | null>(null);

  // Clipboard feedback state & custom Toast system
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ 
    id: string; 
    message: string; 
    type: "success" | "info";
    action?: { label: "Undo" | "View Logs"; callback: () => void }
  }[]>([]);

  const addToast = (
    message: string, 
    type: "success" | "info" = "success",
    action?: { label: "Undo" | "View Logs"; callback: () => void }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, action }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000); // 6 seconds for action interaction
  };

  // Helper to visually highlight search terms inside a text string
  const highlightText = (text: string, search: string) => {
    if (!search || !search.trim()) return <span>{text}</span>;
    try {
      const escaped = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const parts = text.split(regex);
      return (
        <span>
          {parts.map((part, index) => 
            regex.test(part) ? (
              <mark key={index} className="bg-orange-500/25 text-orange-400 font-bold px-0.5 rounded">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </span>
      );
    } catch (e) {
      return <span>{text}</span>;
    }
  };

  // Helper to generate a URL slug for deep linking
  const getFAQHash = (question: string) => {
    return "faq-" + question
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  // Record FAQ search terms to trending list after user finishes typing
  useEffect(() => {
    if (!faqSearch || faqSearch.trim().length < 3) return;

    const timer = setTimeout(() => {
      const term = faqSearch.trim();
      setTrendingSearches(prev => {
        const cleaned = prev.map(t => t.toLowerCase());
        if (cleaned.includes(term.toLowerCase())) {
          return prev;
        }
        const formatted = term.charAt(0).toUpperCase() + term.slice(1);
        const updated = [formatted, ...prev.filter(t => t.toLowerCase() !== term.toLowerCase())].slice(0, 6);
        try {
          localStorage.setItem("faq_trending_searches", JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [faqSearch]);

  const handleTrendingClick = (term: string) => {
    setFaqSearch(term);
    addToast(`loaded FAQ search filter: "${term}"`, "success", {
      label: "Undo",
      callback: () => {
        setFaqSearch("");
      }
    });
  };

  // Handler to copy direct link and update URL hash
  const handleShareFAQ = (question: string) => {
    const hash = getFAQHash(question);
    window.location.hash = hash;
    const fullURL = `${window.location.origin}${window.location.pathname}#${hash}`;
    navigator.clipboard.writeText(fullURL).then(() => {
      addToast("Direct link copied to clipboard & updated URL!", "success");
    }).catch(() => {
      addToast("Failed to copy link.", "info");
    });
  };

  // Monitor hash change on mount/change for deep-linking directly to a FAQ
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#faq-")) {
        const matches = GENERAL_FAQS.find(faq => getFAQHash(faq.question) === hash.slice(1));
        if (matches) {
          setExpandedFaqId(matches.question);
          setTimeout(() => {
            const el = document.getElementById(getFAQHash(matches.question));
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 400);
        }
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Strategic proposal tabs
  const [auditTab, setAuditTab] = useState<"all" | "critical" | "high">("all");
  
  // Simple toast feedback handler
  const triggerCopyFeedback = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(key);
    addToast(`"${key.toUpperCase().replace('-', ' ')}" Copied to Clipboard! You can now paste this direct in your deployment systems.`, "success");
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Helper validation functions
  const validateEmail = (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Enter a valid email (e.g., manager@domain.ng)";
    return null;
  };

  const validatePhone = (phone: string) => {
    const trimmed = phone.trim();
    if (!trimmed) return "Phone number is required";
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 14) {
      return "Nigerian phone numbers must be between 9 and 14 digits";
    }
    return null;
  };

  const handleStrategyEmailChange = (val: string) => {
    setContactEmail(val);
    setStrategyEmailError(validateEmail(val));
  };

  const handleStrategyPhoneChange = (val: string) => {
    setContactPhone(val);
    setStrategyPhoneError(validatePhone(val));
  };

  const handleBookingEmailChange = (val: string) => {
    setBookingEmail(val);
    setBookingEmailError(validateEmail(val));
  };

  const handleBookingPhoneChange = (val: string) => {
    setBookingPhone(val);
    setBookingPhoneError(validatePhone(val));
  };

  // Pre-configured custom WhatsApp message generator helper
  const getWhatsAppURL = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    return `https://wa.me/2348123456789?text=${encoded}`;
  };

  const getCurrentlyViewedService = () => {
    if (selectedService) {
      return selectedService.title;
    }
    if (bookingService) {
      if (bookingService === "web_and_ai_combo") return "Elite Web + WhatsApp Automation Combo";
      if (bookingService === "school_church_portal") return "School Report Cards Portal";
      if (bookingService === "independent_white_label") return "One-Man AI Agency Setup Blueprint";
      if (bookingService === "ongoing_maintenance") return "Managed Website Maintenance";
    }
    return "Main Corporate Redesign Showcase";
  };

  const logWhatsAppClick = () => {
    const serviceName = getCurrentlyViewedService();
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      serviceViewed: serviceName,
      action: "Floating WhatsApp Consultation button clicked",
      platform: window.innerWidth < 768 ? "Mobile App Interface" : "Desktop Dashboard"
    };

    setWhatsAppClickLogs(prev => [newLog, ...prev]);
    addToast(`Floating WhatsApp click registered under context: "${serviceName}"!`, "success", {
      label: "View Logs",
      callback: () => {
        document.getElementById("telemetry-console-section")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  const getMostPopularService = () => {
    if (whatsAppClickLogs.length === 0) return "No clicks yet";
    const counts: Record<string, number> = {};
    whatsAppClickLogs.forEach(log => {
      counts[log.serviceViewed] = (counts[log.serviceViewed] || 0) + 1;
    });
    let maxCount = 0;
    let mainService = "Main Corporate Redesign Showcase";
    Object.entries(counts).forEach(([service, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mainService = service;
      }
    });
    return mainService;
  };

  // Interactive AI Strategist generator trigger
  const generateProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation: ensure mandatory fields are filled
    if (!businessName.trim()) {
      addToast("Please fill in the Business Name / Identity.", "info");
      return;
    }

    const pError = validatePhone(contactPhone);
    const eError = validateEmail(contactEmail);

    if (pError || eError) {
      setStrategyPhoneError(pError);
      setStrategyEmailError(eError);
      addToast("Please correct the form validation errors before generating.", "info");
      return;
    }

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
          contactEmail: contactEmail.trim(),
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
For your **${industry}** operations, the pain point **"${painPoint}"** represents an immediate leakage of potential revenues.

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

  // Client-side validated submission handler for the Strategy Call form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingName.trim()) {
      addToast("Please fill in your name.", "info");
      return;
    }
    if (!bookingCompany.trim()) {
      addToast("Please fill in your School / SME Name.", "info");
      return;
    }

    const pError = validatePhone(bookingPhone);
    const eError = validateEmail(bookingEmail);

    if (pError || eError) {
      setBookingPhoneError(pError);
      setBookingEmailError(eError);
      addToast("Please correct the form fields with errors before submitting.", "info");
      return;
    }

    setBookingSubmitted(true);
    addToast("Strategy audit request submitted successfully!", "success", {
      label: "View Logs",
      callback: () => {
        document.getElementById("telemetry-console-section")?.scrollIntoView({ behavior: "smooth" });
      }
    });
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
      case "enterprise":
        basePriceNaira = 1400000;
        baseTimeSavedHrs = 75;
        baseDescription = "Enterprise Intelligent Integration";
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

    let totalInvestment = basePriceNaira + extraNaira;
    let discountApplied = 0;
    if (calcTier === "enterprise") {
      discountApplied = Math.round(totalInvestment * 0.1);
      totalInvestment = totalInvestment - discountApplied;
    }

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
      leadBoostPercent,
      originalInvestment: basePriceNaira + extraNaira,
      discountApplied
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
    let finalSchema = { ...dynamicSchema };
    let isValid = true;

    try {
      const faqNode = dynamicSchema["@graph"]?.find(item => item["@type"] === "FAQPage") as { mainEntity?: any[] } | undefined;
      const entities = faqNode?.mainEntity;

      if (!Array.isArray(entities) || entities.length === 0) {
        isValid = false;
      } else {
        // Validate that each question and answer exists, is a string, and is non-empty
        for (const entity of entities) {
          if (
            !entity ||
            typeof entity.name !== "string" ||
            entity.name.trim() === "" ||
            !entity.acceptedAnswer ||
            typeof entity.acceptedAnswer.text !== "string" ||
            entity.acceptedAnswer.text.trim() === ""
          ) {
            isValid = false;
            break;
          }
        }
      }
    } catch (e) {
      isValid = false;
    }

    if (!isValid) {
      console.warn("FAQPage schema validation failed - adopting default fallback state");
      // Define a secure, non-empty schema fallback
      const fallbackFAQEntities = [
        {
          "@type": "Question",
          "name": "How long does it take 3Cords to build a premium business portal?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A standard elite custom landing page or modular business site is engineered, optimized, and ready for deployment within 7 to 14 working days."
          }
        }
      ];

      finalSchema = {
        ...dynamicSchema,
        "@graph": dynamicSchema["@graph"].map(item => {
          if (item["@type"] === "FAQPage") {
            return {
              "@type": "FAQPage",
              "mainEntity": fallbackFAQEntities
            };
          }
          return item;
        })
      };
    }

    const validatedSchemaCode = JSON.stringify(finalSchema, null, 2);

    let script = document.getElementById("jsonld-schema") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "jsonld-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = validatedSchemaCode;
    return () => {
      const existing = document.getElementById("jsonld-schema");
      if (existing) {
        existing.remove();
      }
    };
  }, [schemaCode]);

  return (
    <div className={`min-h-screen flex flex-col relative animate-fade-in transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-slate-950 text-slate-100" 
        : "bg-slate-50 text-slate-900"
    }`}>
      
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
      <header className={`border-b sticky top-[33px] z-40 transition-all backdrop-blur-md ${
        theme === "dark" 
          ? "border-slate-900/80 bg-slate-950/80" 
          : "border-slate-200 bg-white/85"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo showText={true} />

          {/* MAIN DESKTOP DIRECT SWITCH / TABS */}
          <div className={`hidden md:flex rounded-full p-1 border ${
            theme === "dark" 
              ? "bg-slate-900/90 border-slate-800/85" 
              : "bg-slate-100 border-slate-300"
          }`}>
            <button
              onClick={() => setActiveWorkspace("redesign")}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeWorkspace === "redesign"
                  ? "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-slate-950 font-bold shadow-md shadow-orange-950/20"
                  : theme === "dark" 
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
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
                  : theme === "dark" 
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              📊 Strategist Audit Hub
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
              className={`p-2 rounded-xl border transition-all ${
                theme === "dark"
                  ? "border-slate-800 bg-slate-900 text-amber-400 hover:text-amber-300"
                  : "border-slate-300 bg-white text-slate-700 hover:text-orange-500"
              }`}
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

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
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-lg text-sm hover:opacity-90 transition-all shadow-md active:scale-95 duration-100"
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
              className={`md:hidden border-t p-4 space-y-4 shadow-xl transition-all ${
                theme === "dark" ? "border-slate-900 bg-slate-950/95 backdrop-blur-md" : "border-slate-200 bg-white/95 backdrop-blur-md text-slate-900"
              }`}
            >
              {/* Mobile Quick Settings Row */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800/20">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">Quick Settings</span>
                <div className="flex items-center gap-2">
                  <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} />
                  <button
                    onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
                    className={`p-2 rounded-xl border transition-all ${
                      theme === "dark"
                        ? "border-slate-850 bg-slate-900 text-amber-400"
                        : "border-slate-300 bg-slate-100 text-slate-700"
                    }`}
                  >
                    {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

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
            </motion.div>
          )}
        </AnimatePresence>
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
                  {TRANSLATIONS[lang].hero_badge}
                </div>
              </div>

              {/* Display Header Copy */}
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                  {TRANSLATIONS[lang].hero_title_1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 glow-orange">
                    {TRANSLATIONS[lang].hero_title_2}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
                  {TRANSLATIONS[lang].hero_desc}
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
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">{TRANSLATIONS[lang].services_badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{TRANSLATIONS[lang].services_title}</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  {TRANSLATIONS[lang].services_desc}
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
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">{TRANSLATIONS[lang].case_studies_badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{TRANSLATIONS[lang].case_studies_title}</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  {TRANSLATIONS[lang].case_studies_desc}
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

            {/* CLIENT ENDORSEMENT TESTIMONIAL CAROUSEL */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="text-center space-y-2 mb-4">
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold">CLIENT ENDORSEMENTS</span>
                <h2 className="text-2xl md:text-4xl font-bold text-white">Trust is Built on Actual Success</h2>
              </div>
              <TestimonialCarousel />
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* INTERACTIVE 3-PHASE DELIVERY TIMELINE */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
              <div className="text-center space-y-3">
                <span className={`text-xs font-mono uppercase tracking-widest font-bold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>
                  3CORDS EXECUTION METHODOLOGY
                </span>
                <h2 className={`text-3xl md:text-5xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  High-Speed Delivery Timeline
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                  Hover or select each phase of our signature 15-day double-stack execution track to inspect exact tech processes.
                </p>
              </div>

              {/* Vertical timeline body */}
              <div className="relative max-w-4xl mx-auto pl-6 md:pl-0">
                {/* Central line */}
                <div className={`absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 -ml-px ${theme === "dark" ? "bg-gradient-to-b from-orange-500/80 via-teal-500/80 to-emerald-500/85" : "bg-gradient-to-b from-orange-400 via-teal-400 to-emerald-500"}`} />

                {/* Timeline items list */}
                <div className="space-y-12 relative">
                  
                  {/* Phase 1 */}
                  <div className="flex flex-col md:flex-row md:items-center relative">
                    <div className="absolute left-[-26px] md:left-1/2 md:-translate-x-1/2 z-10 flex items-center justify-center">
                      <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-slate-950 transition-colors ${
                        theme === "dark" 
                          ? "border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                          : "border-orange-500 text-orange-500 bg-white"
                      }`}>
                        01
                      </div>
                    </div>

                    {/* Timeline Left Column */}
                    <div className="w-full md:w-1/2 md:pr-12 md:text-right">
                      <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded">
                        Days 1–3: Audit & Wireframing
                      </span>
                    </div>

                    {/* Timeline Right Column (Interactive Card) */}
                    <div className="w-full md:w-1/2 md:pl-12 pt-4 md:pt-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer relative group ${
                          theme === "dark"
                            ? "bg-slate-900/40 border-slate-800 hover:border-orange-500/50 hover:bg-slate-900/60"
                            : "bg-white border-slate-200 hover:border-orange-500/50 shadow-sm"
                        }`}
                      >
                        <h4 className={`text-lg font-bold mb-1 group-hover:text-orange-500 transition-colors ${theme === "dark" ? "text-white" : "text-slate-850"}`}>
                          Phase 1: Deep Tech Audit
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          We execute local speed diagnostics inside extreme Lagos workspaces, auditing existing mobile load latency and listing core database integration leaks.
                        </p>
                        
                        {/* Hover elements / micro bullets */}
                        <div className="space-y-2 border-t border-slate-800/20 pt-3">
                          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Deliverables Preview:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {[
                              "🔍 Core Bottleneck Analysis",
                              "✏️ Wireframe Canvas Draft",
                              "📋 Tech Audit Scorecard"
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className={`text-[11px] px-2 py-1 rounded border font-mono transition-all ${
                                  theme === "dark"
                                    ? "bg-slate-950/60 border-slate-800 text-slate-400 group-hover:bg-slate-950 group-hover:text-orange-300"
                                    : "bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-orange-50/50 group-hover:text-orange-600"
                                }`}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="flex flex-col md:flex-row-reverse md:items-center relative">
                    <div className="absolute left-[-26px] md:left-1/2 md:-translate-x-1/2 z-10 flex items-center justify-center">
                      <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-slate-950 transition-colors ${
                        theme === "dark" 
                          ? "border-teal-500 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                          : "border-teal-500 text-teal-650 bg-white"
                      }`}>
                        02
                      </div>
                    </div>

                    {/* Timeline Left Column */}
                    <div className="w-full md:w-1/2 md:pl-12 md:text-left">
                      <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded">
                        Days 4–10: High-Speed Modular Build
                      </span>
                    </div>

                    {/* Timeline Right Column (Interactive Card) */}
                    <div className="w-full md:w-1/2 md:pr-12 pt-4 md:pt-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer relative group ${
                          theme === "dark"
                            ? "bg-slate-900/40 border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/60"
                            : "bg-white border-slate-200 hover:border-teal-500/50 shadow-sm"
                        }`}
                      >
                        <h4 className={`text-lg font-bold mb-1 group-hover:text-teal-400 transition-colors ${theme === "dark" ? "text-white" : "text-slate-850"}`}>
                          Phase 2: Full-Stack Modular Build
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          We construct pure, lightweight React structures with robust responsive performance. No bloated page templates; clean modular code is crafted locally.
                        </p>

                        {/* Hover elements / micro bullets */}
                        <div className="space-y-2 border-t border-slate-800/20 pt-3">
                          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Deliverables Preview:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {[
                              "⚡ Ultra-speed React Modules",
                              "🧱 High-Contrast bento grid",
                              "📦 Local state calculators"
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className={`text-[11px] px-2 py-1 rounded border font-mono transition-all ${
                                  theme === "dark"
                                    ? "bg-slate-950/60 border-slate-800 text-slate-400 group-hover:bg-slate-950 group-hover:text-teal-300"
                                    : "bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-teal-50/50 group-hover:text-teal-600"
                                }`}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="flex flex-col md:flex-row md:items-center relative">
                    <div className="absolute left-[-26px] md:left-1/2 md:-translate-x-1/2 z-10 flex items-center justify-center">
                      <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-xs bg-slate-950 transition-colors ${
                        theme === "dark" 
                          ? "border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          : "border-emerald-500 text-emerald-600 bg-white"
                      }`}>
                        03
                      </div>
                    </div>

                    {/* Timeline Left Column */}
                    <div className="w-full md:w-1/2 md:pr-12 md:text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded">
                        Days 11–15: AI Bot & Live Deployment
                      </span>
                    </div>

                    {/* Timeline Right Column (Interactive Card) */}
                    <div className="w-full md:w-1/2 md:pl-12 pt-4 md:pt-0">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer relative group ${
                          theme === "dark"
                            ? "bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/60"
                            : "bg-white border-slate-200 hover:border-emerald-500/50 shadow-sm"
                        }`}
                      >
                        <h4 className={`text-lg font-bold mb-1 group-hover:text-emerald-400 transition-colors ${theme === "dark" ? "text-white" : "text-slate-850"}`}>
                          Phase 3: AI WhatsApp Integration & Go-Live
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          We mount custom Gemini conversational agents inside active school & SME WhatsApp handles, configure admin dashboards, and deploy onto lightweight servers.
                        </p>

                        {/* Hover elements / micro bullets */}
                        <div className="space-y-2 border-t border-slate-800/20 pt-3">
                          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Deliverables Preview:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {[
                              "🤖 Active Gemini WhatsApp bot",
                              "📡 99.9% Cloud Run Ingress",
                              "🛡️ Secure local sync panels"
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className={`text-[11px] px-2 py-1 rounded border font-mono transition-all ${
                                  theme === "dark"
                                    ? "bg-slate-950/60 border-slate-800 text-slate-400 group-hover:bg-slate-950 group-hover:text-emerald-300"
                                    : "bg-slate-50 border-slate-100 text-slate-600 group-hover:bg-emerald-50/50 group-hover:text-emerald-600"
                                }`}
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* DYNAMIC INTERACTIVE ROI CALCULATOR & CO-ESTIMATOR */}
            <section id="roi-calc-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">{TRANSLATIONS[lang].roi_badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{TRANSLATIONS[lang].roi_title}</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  {TRANSLATIONS[lang].roi_desc}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
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

                      <button
                        type="button"
                        onClick={() => setCalcTier("enterprise")}
                        className={`p-4 rounded-xl border text-left relative transition-all ${
                          calcTier === "enterprise"
                            ? "bg-slate-950 border-emerald-500 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-450 hover:bg-slate-950 hover:border-slate-750"
                        }`}
                      >
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/20 text-[9px] rounded-bl font-mono text-orange-400 uppercase font-bold">10% OFF</div>
                        <span className="block text-xs font-semibold text-orange-400 font-mono mb-1">₦1,400,000</span>
                        <p className="font-bold text-sm font-sans">Enterprise Suite</p>
                        <p className="text-[11px] text-slate-500 mt-1">Full-scale integrations with built-in volume discounts.</p>
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
                        <AnimatedNumber value={roiResult.totalInvestment} prefix="₦" />
                      </p>
                      {roiResult.discountApplied > 0 && (
                        <div className="flex flex-col gap-0.5 mt-2">
                          <span className="text-xs text-orange-400 font-mono font-semibold">
                            🏷️ 10% Volume Discount Level Applied: Saved ₦{roiResult.discountApplied.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-mono line-through">
                            Original: ₦{roiResult.originalInvestment.toLocaleString()}
                          </span>
                        </div>
                      )}
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
                            <AnimatedNumber value={roiResult.totalHoursSavedMonthly} suffix=" hrs" decimals={1} /> / Month
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
                            <AnimatedNumber value={roiResult.financialSavingsMonthly} prefix="₦" /> / Month
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

              {/* ROI BAR CHART SAVINGS ANALYSIS */}
              <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
                theme === "dark" 
                  ? "bg-slate-900/40 border-slate-800 text-slate-100" 
                  : "bg-white border-slate-200 text-slate-850 shadow-md"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest font-bold">SAVINGS FORECAST MODEL</span>
                    <h3 className={`text-xl md:text-2xl font-black mt-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      12-Month Cumulative Cost Comparison
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                      Visualizes potential long-term savings by comparing ongoing manual operational overhead with upfront 3Cords automated architecture implementation (including a minor cumulative ₦20k recurring maintenance).
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 self-start sm:self-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Break-Even Trend Captured</span>
                  </div>
                </div>

                <div className="h-[280px] w-full mt-4 font-mono text-[10px] sm:text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(() => {
                        const data = [];
                        for (let month = 1; month <= 12; month++) {
                          const manualCost = Math.round(roiResult.financialSavingsMonthly * month);
                          const automatedCost = Math.round(roiResult.totalInvestment + (20000 * month));
                          data.push({
                            name: `Month ${month}`,
                            "Manual Labor Costs": manualCost,
                            "Automated System Costs": automatedCost
                          });
                        }
                        return data;
                      })()}
                      margin={{ top: 15, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                      <XAxis 
                        dataKey="name" 
                        stroke={theme === "dark" ? "#64748b" : "#475569"} 
                        tickLine={false}
                        fontSize={10}
                      />
                      <YAxis 
                        stroke={theme === "dark" ? "#64748b" : "#475569"} 
                        tickLine={false}
                        tickFormatter={(value) => `₦${(value / 1000).toLocaleString()}k`}
                        fontSize={10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff", 
                          borderColor: theme === "dark" ? "#1e293b" : "#cbd5e1",
                          borderRadius: "12px",
                          color: theme === "dark" ? "#f8fafc" : "#0f172a",
                          fontFamily: "monospace",
                          fontSize: "11px"
                        }} 
                        formatter={(value: any) => [`₦${value.toLocaleString()}`, ""]}
                      />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Bar name="Manual Labor Costs" dataKey="Manual Labor Costs" fill="#f97316" radius={[4, 4, 0, 0]} />
                      <Bar name="Automated System Costs" dataKey="Automated System Costs" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <div className="laser-line max-w-7xl mx-auto" />

            {/* LIVE CHATBOT STRATEGY ADVISOR SECTION */}
            <section id="ai-consulting-sect" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">{TRANSLATIONS[lang].consultant_badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{TRANSLATIONS[lang].consultant_title}</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  {TRANSLATIONS[lang].consultant_desc}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Form column */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <form onSubmit={generateProposal} className="space-y-4">
                    <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">INPUT CORPORATE CHALLENGES</p>
                    
                    {speechError && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/15 text-xs text-red-400 font-mono flex items-start gap-2 animate-fadeIn mb-4">
                        <span className="shrink-0 mt-0.5">⚠️</span>
                        <div>
                          <p className="font-bold">Dictation Service Notice</p>
                          <p className="opacity-90">{speechError}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">1. Business Name / Identity</label>
                        {isListeningBusiness && (
                          <span className="text-[10px] text-emerald-400 font-mono animate-pulse flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-fadeIn">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            Listening...
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <AnimatePresence>
                          {isListeningBusiness && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, scale: 0.8, x: -10 }}
                              animate={{ 
                                opacity: [1, 0.85, 1],
                                scale: [1, 1.06, 1],
                                x: 0 
                              }}
                              exit={{ opacity: 0, scale: 0.8, x: -10 }}
                              transition={{
                                x: { type: "spring", stiffness: 350, damping: 30 },
                                opacity: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                                scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                              }}
                              whileHover={{ scale: 1.1 }}
                              onClick={() => toggleSpeechRecognition("business")}
                              className="absolute left-2.5 top-[13px] flex items-center gap-1.5 bg-rose-500 text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded tracking-widest font-mono z-20 shadow-lg shadow-rose-500/30 cursor-pointer hover:bg-rose-600 group transition-colors duration-200"
                              title="Click to cancel recording"
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping group-hover:hidden" />
                              <span className="group-hover:hidden">REC</span>
                              <span className="hidden group-hover:inline-flex items-center gap-0.5">STOP ✕</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {isListeningBusiness && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-16 right-10 bottom-1.5 h-5 flex items-end gap-[3px] pointer-events-none z-10 overflow-hidden"
                            >
                              {audioLevels.map((val, idx) => (
                                <motion.div
                                  key={idx}
                                  animate={{ height: `${Math.max(15, val)}%` }}
                                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                  className="flex-1 bg-gradient-to-t from-rose-600 via-pink-500 to-rose-400 rounded-t-[1px] shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <input
                          type="text"
                          required
                          placeholder={isListeningBusiness ? "Dictate corporate name..." : "e.g., Christ the King Academy, Lagos"}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className={`w-full ${
                            isListeningBusiness 
                              ? "pl-16 pb-[22px] pt-[10px] border-rose-500/50 ring-2 ring-rose-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-slate-950/90" 
                              : "pl-3 py-3 border-slate-800 hover:border-slate-700/80 focus:border-emerald-500"
                          } pr-10 rounded-lg bg-slate-950 text-sm placeholder-slate-600 focus:outline-none text-white transition-all duration-300`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("business")}
                          className={`absolute right-2 top-1.5 p-2 rounded-md transition-all flex items-center justify-center cursor-pointer ${
                            isListeningBusiness
                              ? "bg-rose-500/20 text-rose-400 animate-pulse"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                          }`}
                          title="Dictate with voice input"
                        >
                          {isListeningBusiness ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400 uppercase">2. Industry / Sector Category</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-emerald-500 text-sm text-slate-300 focus:outline-none transition-all"
                      >
                        <option value="School / Educational Center">School / Educational Center</option>
                        <option value="Church / Religious Center">Church / Religious Center</option>
                        <option value="eCommerce Retail SME">eCommerce Retail SME</option>
                        <option value="Real Estate Development">Real Estate Development</option>
                        <option value="Consultancy or Law Firm">Consultancy or Law Firm</option>
                        <option value="General Professional Services">General Professional Services</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-mono text-slate-400 uppercase">3. Primary Corporate Pain Point</label>
                        {isListeningPain && (
                          <span className="text-[10px] text-emerald-400 font-mono animate-pulse flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-fadeIn">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            Listening...
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <AnimatePresence>
                          {isListeningPain && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, scale: 0.8, x: -10 }}
                              animate={{ 
                                opacity: [1, 0.85, 1],
                                scale: [1, 1.06, 1],
                                x: 0 
                              }}
                              exit={{ opacity: 0, scale: 0.8, x: -10 }}
                              transition={{
                                x: { type: "spring", stiffness: 350, damping: 30 },
                                opacity: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                                scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
                              }}
                              whileHover={{ scale: 1.1 }}
                              onClick={() => toggleSpeechRecognition("painPoint")}
                              className="absolute left-2.5 top-[11px] flex items-center gap-1.5 bg-rose-500 text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded tracking-widest font-mono z-20 shadow-lg shadow-rose-500/30 cursor-pointer hover:bg-rose-600 group transition-colors duration-200"
                              title="Click to cancel recording"
                            >
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping group-hover:hidden" />
                              <span className="group-hover:hidden">REC</span>
                              <span className="hidden group-hover:inline-flex items-center gap-0.5">STOP ✕</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {isListeningPain && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute left-16 right-10 bottom-1.5 h-5 flex items-end gap-[3px] pointer-events-none z-10 overflow-hidden"
                            >
                              {audioLevels.map((val, idx) => (
                                <motion.div
                                  key={idx}
                                  animate={{ height: `${Math.max(15, val)}%` }}
                                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                  className="flex-1 bg-gradient-to-t from-rose-600 via-pink-500 to-rose-400 rounded-t-[1px] shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <textarea
                          required
                          rows={2}
                          placeholder={isListeningPain ? "Dictate bottleneck details..." : "Dictate with voice or type custom corporate barriers..."}
                          value={painPoint}
                          onChange={(e) => setPainPoint(e.target.value)}
                          className={`w-full ${
                            isListeningPain
                              ? "pl-16 pb-[22px] pt-[10px] border-rose-500/50 ring-2 ring-rose-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-slate-950/90"
                              : "pl-3 py-2.5 border-slate-800 hover:border-slate-700/80 focus:border-emerald-500"
                          } pr-10 rounded-lg bg-slate-950 text-xs text-slate-300 focus:outline-none resize-none leading-relaxed transition-all duration-300`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleSpeechRecognition("painPoint")}
                          className={`absolute right-2 top-3 p-2 rounded-md transition-all flex items-center justify-center cursor-pointer ${
                            isListeningPain
                              ? "bg-rose-500/20 text-rose-400 animate-pulse"
                              : "text-slate-500 hover:text-slate-300 hover:bg-slate-900"
                          }`}
                          title="Dictate bottleneck with voice input"
                        >
                          {isListeningPain ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Dynamic Selection Presets */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Recommended Corporate Templates (or type custom):</span>
                        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                          {[
                            "Manual paperwork & delayed customer reply times",
                            "Losing 40%+ inbound leads because of sluggish WhatsApp admin handling",
                            "Muddled student billing configurations and chaotic parent message chains",
                            "No credible modern digital web presence to scale out high-ticket pricing",
                            "No automated follow-ups or systematic invoice generation"
                          ].map((preset) => {
                            const isSelected = painPoint === preset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setPainPoint(preset)}
                                className={`text-[10px] text-left px-2 py-1.5 rounded transition border truncate max-w-full cursor-pointer ${
                                  isSelected
                                    ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400 font-medium"
                                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                                }`}
                                title={preset}
                              >
                                {preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Your Mobile No (WhatsApp Optional)</label>
                        <input
                          type="tel"
                          placeholder="e.g., 08031234567"
                          value={contactPhone}
                          onChange={(e) => handleStrategyPhoneChange(e.target.value)}
                          className={`w-full p-2.5 rounded-lg bg-slate-950 border text-xs placeholder-slate-700 focus:outline-none ${
                            strategyPhoneError ? "border-red-500 focus:border-red-500" : "border-slate-850 focus:border-emerald-500"
                          }`}
                        />
                        {strategyPhoneError && (
                          <p className="text-[10px] text-red-400 mt-1 font-mono">{strategyPhoneError}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase">Private Email Address (Required)</label>
                        <input
                          type="email"
                          required
                          placeholder="manager@domain.ng"
                          value={contactEmail}
                          onChange={(e) => handleStrategyEmailChange(e.target.value)}
                          className={`w-full p-2.5 rounded-lg bg-slate-950 border text-xs placeholder-slate-700 focus:outline-none ${
                            strategyEmailError ? "border-red-500 focus:border-red-500" : "border-slate-850 focus:border-emerald-500"
                          }`}
                        />
                        {strategyEmailError && (
                          <p className="text-[10px] text-red-400 mt-1 font-mono">{strategyEmailError}</p>
                        )}
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
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">{TRANSLATIONS[lang].faq_badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold text-white">{TRANSLATIONS[lang].faq_title}</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm">
                  {TRANSLATIONS[lang].faq_desc}
                </p>
              </div>

              {/* FAQ Filters & search bars */}
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Search general questions (e.g., 'WhatsApp', 'Time', 'Cost')..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className={`w-full p-3 pl-10 rounded-xl border text-sm focus:outline-none focus:border-emerald-500 transition-colors ${
                        theme === "dark" 
                          ? "bg-slate-900 border-slate-800 text-slate-200" 
                          : "bg-white border-slate-300 text-slate-800 focus:bg-slate-50"
                      }`}
                    />
                    <span className="absolute left-3.5 top-[15px] text-slate-400 font-mono">🔍</span>
                  </div>

                  <div className={`flex rounded-xl p-1 border w-full md:w-auto overflow-x-auto transition-colors ${
                    theme === "dark" 
                      ? "bg-slate-900 border-slate-800" 
                      : "bg-white border-slate-200 shadow-sm"
                  }`}>
                    {["All", "Technical", "Billing", "General"].map(category => {
                      const count = category === "All"
                        ? localizedFaqs.length
                        : localizedFaqs.filter(faq => faq.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setFaqCategory(category)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition flex items-center gap-1.5 ${
                            faqCategory === category
                              ? theme === "dark"
                                ? "bg-slate-950 text-orange-400 border border-slate-800"
                                : "bg-orange-50 text-orange-600 border border-orange-200"
                              : theme === "dark"
                                ? "text-slate-400 hover:text-slate-200"
                                : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <span>{category}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            faqCategory === category
                              ? theme === "dark"
                                ? "bg-orange-400/15 text-orange-400"
                                : "bg-orange-600/10 text-orange-600"
                              : theme === "dark"
                                ? "bg-slate-800 text-slate-550"
                                : "bg-slate-100 text-slate-400"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trending Searches Row */}
                <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
                  <span className="text-slate-500 font-mono text-[10px] font-bold uppercase tracking-wider">🔥 Trending Searches:</span>
                  {trendingSearches.map((term, idx) => (
                    <button
                      key={term + idx}
                      onClick={() => handleTrendingClick(term)}
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition cursor-pointer ${
                        theme === "dark"
                          ? "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-orange-400 hover:border-orange-500/40"
                          : "bg-white border-slate-200 text-slate-650 hover:text-orange-500 hover:bg-slate-55"
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy FAQs tool bar */}
              <div className="max-w-3xl mx-auto flex items-center justify-between px-1 bg-slate-900/10 border border-slate-800/20 rounded-xl p-2">
                {isLoadingFaqs ? (
                  <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="animate-pulse">AI Translator Working...</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 font-mono">
                    Showing {(() => {
                      const filtered = localizedFaqs.filter(faq => {
                        const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
                        const matchesCat = faqCategory === "All" || faq.category === faqCategory;
                        return matchesSearch && matchesCat;
                      });
                      return filtered.length;
                    })()} of {localizedFaqs.length} items
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handleCopyFAQs}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedFaqs
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : theme === "dark"
                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                        : "bg-white border-slate-200 text-slate-650 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {copiedFaqs ? (
                    <>
                      <span>✓ FAQ MD Copied!</span>
                    </>
                  ) : (
                    <>
                      <span>📋 Copy All FAQ (MD)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Accordions List */}
              <div className="space-y-3">
                  {(() => {
                    const filtered = localizedFaqs.filter(faq => {
                      const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
                      const matchesCat = faqCategory === "All" || faq.category === faqCategory;
                      return matchesSearch && matchesCat;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-12 text-slate-500">
                          <p>No queries match your search parameters.</p>
                          <button onClick={() => { setFaqSearch(""); setFaqCategory("All"); }} className="text-orange-400 underline text-xs mt-2">Reset FAQ Filters</button>
                        </div>
                      );
                    }

                    return (
                      <AnimatePresence mode="popLayout">
                        {filtered.map((faq) => {
                          const isExpanded = expandedFaqId === faq.question;
                          return (
                            <motion.div
                              key={faq.question}
                              id={getFAQHash(faq.question)}
                              layout
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              className={`rounded-xl overflow-hidden transition-all duration-300 border ${
                                theme === "dark" 
                                  ? "bg-slate-900/40 border-slate-800 text-slate-100 hover:border-orange-500/40 hover:shadow-[0_0_15px_rgba(249,115,22,0.06)] hover:scale-[1.012]" 
                                  : "bg-white border-slate-200 text-slate-800 shadow-sm hover:border-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.04)] hover:scale-[1.012]"
                              }`}
                            >
                              <div
                                onClick={() => setExpandedFaqId(isExpanded ? null : faq.question)}
                                className={`w-full p-4 text-left flex items-start sm:items-center justify-between gap-4 font-medium transition cursor-pointer select-none ${
                                  theme === "dark"
                                    ? "text-white hover:text-orange-400 hover:bg-slate-900/10"
                                    : "text-slate-800 hover:text-orange-500 hover:bg-slate-100/40"
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 flex-1 min-w-0">
                                  <span className="text-sm md:text-base leading-snug">{highlightText(faq.question, faqSearch)}</span>
                                  <span className="inline-block self-start sm:self-auto text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-orange-500/20 bg-orange-500/10 text-orange-400 font-semibold shrink-0">
                                    {faq.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 self-center" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    onClick={() => handleShareFAQ(faq.question)}
                                    title="Copy direct link to this FAQ"
                                    className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-slate-850 rounded transition focus:outline-none"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.question)}
                                    className="p-1.5 text-slate-400 hover:text-orange-400 transition focus:outline-none"
                                  >
                                    <span className="text-xs font-mono">{isExpanded ? "▲" : "▼"}</span>
                                  </button>
                                </div>
                              </div>
                              
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ 
                                      type: "spring", 
                                      stiffness: 220, 
                                      damping: 17,
                                      mass: 0.8
                                    }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <div className={`px-4 pb-4 text-xs md:text-sm pt-3 leading-relaxed border-t transition-colors ${
                                      theme === "dark"
                                        ? "text-slate-400 border-slate-900/60"
                                        : "text-slate-600 border-slate-150"
                                    }`}>
                                      {faq.answer}
                                      <div className="mt-3 flex gap-2">
                                        <span className="text-[10px] uppercase font-mono bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">{faq.category}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    );
                  })()}
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
                    onSubmit={handleBookingSubmit}
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
                        onChange={(e) => handleBookingPhoneChange(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-slate-900 border text-slate-200 text-sm focus:outline-none placeholder-slate-600 ${
                          bookingPhoneError ? "border-red-500 focus:border-red-500" : "border-slate-800 focus:border-emerald-500"
                        }`}
                      />
                      {bookingPhoneError && (
                        <p className="text-[10px] text-red-400 mt-1 font-mono">{bookingPhoneError}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Private Email Address (Required)</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., manager@school.ng"
                        value={bookingEmail}
                        onChange={(e) => handleBookingEmailChange(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-slate-900 border text-slate-200 text-sm focus:outline-none placeholder-slate-600 ${
                          bookingEmailError ? "border-red-500 focus:border-red-500" : "border-slate-800 focus:border-emerald-500"
                        }`}
                      />
                      {bookingEmailError && (
                        <p className="text-[10px] text-red-400 mt-1 font-mono">{bookingEmailError}</p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-1">
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

            {/* LEAD & INTERACTION ANALYTICS CONSOLE */}
            <div id="telemetry-console-section" className={`p-6 md:p-8 rounded-2xl border transition-all space-y-6 scroll-mt-24 ${
              theme === "dark" 
                ? "bg-slate-900/60 border-slate-800 text-slate-100" 
                : "bg-white border-slate-200 text-slate-800 shadow-md"
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-orange-500 uppercase tracking-widest font-bold">REAL-TIME CONVERSION AUDIT CHANNEL</span>
                  <h3 className={`text-xl md:text-3xl font-extrabold tracking-tight mt-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    Lead & Interaction Analytics Console
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Performs automated telemetry tracking on external advisory interactions. Click the floating WhatsApp button to see new telemetry instances trigger live.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const previous = [...whatsAppClickLogs];
                      setWhatsAppClickLogs([]);
                      addToast("Telemetry logs cleared.", "info", {
                        label: "Undo",
                        callback: () => {
                          setWhatsAppClickLogs(previous);
                          addToast("Telemetry logs restored!", "success");
                        }
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-mono transition flex items-center gap-1 cursor-pointer"
                    title="Clear All Tracking Data"
                  >
                    Clear Logs
                  </button>
                  <button
                    onClick={() => {
                      const serviceName = getCurrentlyViewedService();
                      const mockLog = {
                        id: Math.random().toString(36).substring(2, 9),
                        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
                        serviceViewed: serviceName,
                        action: "Simulated Floating WhatsApp Consultation click",
                        platform: "Simulated Sandbox Interface"
                      };
                      setWhatsAppClickLogs(prev => [mockLog, ...prev]);
                      addToast("Simulated WhatsApp consultation click added!", "success");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer shadow-sm shadow-orange-500/10"
                  >
                    Simulate Clicks
                  </button>
                </div>
              </div>

              {/* High-level KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Floating Clicks</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-orange-500">
                      {whatsAppClickLogs.length}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">sessions recorded</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Most Tracked Context</p>
                  <div className="mt-1">
                    <span className="text-sm font-bold truncate block text-teal-400">
                      {getMostPopularService()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">leading high-intent capture</span>
                  </div>
                </div>
                <div className={`p-4 rounded-xl border ${theme === "dark" ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Conversion Ratio SLA</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-emerald-500">
                      {whatsAppClickLogs.length > 0 ? "94.2%" : "0%"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold text-slate-500">extreme interest</span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className={`border rounded-xl overflow-hidden ${theme === "dark" ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50/50"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase text-slate-400 tracking-wider ${theme === "dark" ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-100"}`}>
                        <th className="p-3 font-semibold">Log ID</th>
                        <th className="p-3 font-semibold">Timestamp</th>
                        <th className="p-3 font-semibold">Service Context Being Viewed</th>
                        <th className="p-3 font-semibold">Action Registered</th>
                        <th className="p-3 font-semibold">Platform</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {whatsAppClickLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                            No telemetry sequences generated yet. Try clicking the green floating WhatsApp widget in the bottom right corner!
                          </td>
                        </tr>
                      ) : (
                        whatsAppClickLogs.map((log) => (
                          <tr 
                            key={log.id} 
                            className={`transition hover:bg-slate-550/5 ${theme === "dark" ? "text-slate-300 hover:bg-slate-900/40" : "text-slate-750 hover:bg-slate-100/60"}`}
                          >
                            <td className="p-3 font-bold text-orange-400">#{log.id}</td>
                            <td className="p-3 text-slate-500">{log.timestamp}</td>
                            <td className="p-3 font-semibold text-teal-400">
                              {log.serviceViewed}
                            </td>
                            <td className="p-3 text-slate-400">{log.action}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                log.platform.includes("Mobile") 
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              }`}>
                                {log.platform}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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

      {/* MOBILE STICKY CTA BAR - SLIDES UP past Hero scroll */}
      <AnimatePresence>
        {showMobileStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 border-t border-slate-800 p-4 shadow-xl backdrop-blur-md flex items-center justify-between gap-3"
          >
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Double-stack Track</span>
              <p className="text-xs font-bold text-white font-sans">Direct Live Architect Call</p>
            </div>
            <a
              onClick={() => logWhatsAppClick()}
              href={getWhatsAppURL("Hello 3Cords System, I am viewing your mobile site and wish to schedule our free 15-day implementation audit & system design proposal.")}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg transition-transform flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>Audit Now</span>
              <span className="text-sm">💬</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING AND STICKY WHATSAPP WHISPER WIDGET */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
        {/* Hover label hint */}
        <div className="bg-slate-900 border border-slate-800 text-[10px] md:text-xs text-slate-200 px-3 py-1.5 rounded-xl shadow-lg font-bold flex items-center gap-1.5 animate-bounce pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          🇳🇬 Live Strategy Hotline online
        </div>

        {/* Pulsing trigger button */}
        <a
          onClick={() => logWhatsAppClick()}
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
            className="pointer-events-auto bg-slate-900/95 border border-orange-500/40 text-white rounded-xl shadow-xl shadow-orange-950/25 p-4 flex flex-col gap-2.5 animate-toast-in max-w-sm w-full"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping shrink-0 mt-1.5" />
              <div className="flex-grow text-xs">
                <p className="font-bold text-orange-400 uppercase tracking-widest font-mono text-[9px] mb-0.5">SYSTEM BROADCAST</p>
                <p className="text-slate-200 leading-normal text-start">{toast.message}</p>
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-500 hover:text-white text-xs pl-2 font-mono shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>
            {toast.action && (
              <div className="flex justify-end border-t border-slate-800/40 pt-2 w-full">
                <button
                  onClick={() => {
                    toast.action?.callback();
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-slate-950 rounded border border-orange-500/30 transition cursor-pointer"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
