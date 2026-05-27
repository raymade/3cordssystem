import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, MessageSquare, Star, CheckCircle, X, Video } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  companyName: string;
  quote: string;
  avatarUrl: string;
  videoUrl?: string;
  metrics: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "ikeja_school",
    clientName: "Mrs. Aisha Adebayo",
    role: "Proprietress / Director of Studies",
    companyName: "Grace Heights Academy, Ikeja",
    quote: "Before 3Cords redesigned our systems, our end-of-term was absolute chaos. Teachers literally spent overnight printing, signing, and matching report cards. Now, with the secure Parent Portal, we process scores with a single click and parent alerts are pushed into WhatsApp instantly! The local Lagos support is also top-notch.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    metrics: "80% reduction in admin compiling hours",
  },
  {
    id: "gbagada_church",
    clientName: "Pastor David Oyela",
    role: "Executive Administrator & IT Lead",
    companyName: "RCCG Life Center, Gbagada",
    quote: "Our previous site was static and slow, but the instant WhatsApp Chatbot integration changed everything. Our congregation now receives daily prayer alerts, generates secure bank guides, and answers common inquiries 24/7. Saving over ₦50,050 every month on traditional SMS broadcasts is a huge financial relief for our ministries.",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    videoUrl: "https://www.youtube.com/embed/g2S_q5D-pS0",
    metrics: "92% Communication fees saved monthly",
  },
  {
    id: "yaba_ecommerce",
    clientName: "Folashade Alao",
    role: "Founder & Creative Director",
    companyName: "Sisi Alara Couture, Yaba",
    quote: "We were losing half of our incoming social media leads because our staff couldn't reply to DMs after midnight. 3Cords connected an AI Shopping Agent that coordinates size fits, suggests collections, and books appointments flawlessly. It feels like having an elite, non-sleeping sales team located right here in Lagos. Highly recommended!",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    metrics: "+310% in weekly order conversions",
  }
];

const getCaseBreakdown = (id: string) => {
  switch (id) {
    case "ikeja_school":
      return [
        "Synced sheets directly to a secure local parent scoring database portal.",
        "Automatic WhatsApp broadcast queues pushing report notifications to over 400 families.",
        "Saved teachers over 24 workload accumulation hours every term exam interval.",
        "Completely replaced physical card printing requirements, saving school paper-sheet budgets tracker."
      ];
    case "gbagada_church":
      return [
        "Configured robust digital verification pathways to guide secure tithing and donation workflows.",
        "Constructed automated WhatsApp bots answering multi-lingual congregational queries in real-time.",
        "Saved ₦50,050 every month from legacy cellular SMS billing procedures.",
        "Created an instantly updatable web directory hosting interactive stream media and service schedules."
      ];
    case "yaba_ecommerce":
      return [
        "Seamless Gemini AI automation logic answering 100% of late-night fashion inquires instantly.",
        "Decreased visitor customer response intervals from 4 hours down to sub-3 seconds.",
        "Configured smart size and fit suggestion logic that dropped standard returns and sizing doubts.",
        "Directly boosted overall order rates inside active Lagos delivery cycles and logistics."
      ];
    default:
      return [
        "Modern lightweight React interface build to manage speedy browsing across low-latency Lagos networks.",
        "Secure server webhook routing pipelines connecting web views directly with real-time phone alerts."
      ];
  }
};

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1); // 1 = Next, -1 = Prev
  const [contentType, setContentType] = useState<"text" | "video">("text");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-play cycling effect for testimonial rotation (only cycles quote slides in "text" mode)
  useEffect(() => {
    if (!isPlaying || isModalOpen || contentType === "video") return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
      setContentType("text");
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, isModalOpen, contentType]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
    setContentType("text");
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    setContentType("text");
  };

  const selectSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setContentType("text");
  };

  const active = TESTIMONIALS_DATA[currentIndex];

  // Custom directional transition settings for clean horizontal content sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 160 : -160,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 26 },
        opacity: { duration: 0.25 },
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 160 : -160,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 26 },
        opacity: { duration: 0.2 },
      }
    })
  };

  return (
    <div 
      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl min-h-[500px] sm:min-h-[440px] md:min-h-[380px] flex flex-col justify-center"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Accent Background Highlights */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 sm:gap-10 lg:gap-12 w-full text-center sm:text-left"
          >
            
            {/* Left Column: Avatar & verification information - centered on mobile (<640px) */}
            <div className="flex flex-col items-center shrink-0 w-full sm:w-56 lg:w-64">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
                  <img 
                    src={active.avatarUrl} 
                    alt={active.clientName}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-0 right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border-2 border-slate-950 shadow-md">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4 text-center">
                <h4 className="text-sm sm:text-base font-bold text-white font-sans">{active.clientName}</h4>
                <p className="text-xs text-orange-400 font-mono font-semibold mt-0.5">{active.role}</p>
                <p className="text-[11px] text-slate-400 mt-1">{active.companyName}</p>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 friendly-status-indicator" />
                Lagos Verified Client
              </div>
            </div>

            {/* Right Column: Stars, Text mode or Video Mode toggle, Quotes content, Metrics list & Actions */}
            <div className="flex-1 flex flex-col justify-between w-full items-center sm:items-start min-h-[220px]">
              
              <div className="space-y-4 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                
                {/* 5 Stars display line */}
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                  <span className="text-[10px] font-mono text-slate-500 uppercase ml-2 select-none">Rating 5.0 Global</span>
                </div>

                {/* Text Review & Video Case dynamic toggle bar */}
                {active.videoUrl && (
                  <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setContentType("text")}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition ${
                        contentType === "text"
                          ? "bg-slate-900 border border-slate-800 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.15)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      📝 Read Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentType("video")}
                      className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-1 ${
                        contentType === "video"
                          ? "bg-slate-900 border border-slate-800 text-emerald-450 text-emerald-450 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      🎥 Watch Video
                    </button>
                  </div>
                )}

                {/* Swappable main quote or video player box */}
                <div className="relative w-full flex items-center min-h-[140px] pt-1">
                  <AnimatePresence mode="wait">
                    {contentType === "text" ? (
                      <motion.div
                        key={`quote-${active.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full"
                      >
                        <Quote className="absolute -top-4 -left-3.5 w-8 h-8 text-orange-500/10 pointer-events-none hidden md:block" />
                        <p className="text-sm md:text-base text-slate-150 text-slate-200 leading-relaxed italic font-medium">
                          "{active.quote}"
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`player-${active.id}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.22 }}
                        className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video max-w-lg mx-auto sm:mx-0 shadow-lg"
                      >
                        <iframe
                          src={`${active.videoUrl}?autoplay=0&rel=0`}
                          title={`${active.clientName} video testimonial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Bottom control bar - Centers on mobile, standard row on tablet+ */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Visual metric & View Case Study Button Group */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl text-center">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="text-[10px] md:text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                      {active.metrics}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 text-[10px] md:text-xs font-mono font-bold uppercase tracking-wider bg-slate-950/60 text-slate-300 hover:text-orange-400 border border-slate-800 hover:border-orange-500/40 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    🔍 View Case Study
                  </button>
                </div>

                {/* Custom sliding indicators & Pagination arrows */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-orange-400 hover:border-slate-700 transition cursor-pointer"
                    title="Previous case story"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {TESTIMONIALS_DATA.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectSlide(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          currentIndex === i 
                            ? "w-5 bg-orange-500" 
                            : "w-2 bg-slate-850 hover:bg-slate-700 bg-slate-800"
                        }`}
                        title={`Navigate to review ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-orange-400 hover:border-slate-700 transition cursor-pointer"
                    title="Next case story"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* DETAILED OVERLAY CASE STUDY MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl z-10 overflow-hidden text-slate-200"
            >
              {/* Radial decor spots */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none" />

              {/* Close Button top corner */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-855 transition cursor-pointer bg-slate-950/40"
                title="Close success breakdown"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal header content */}
              <div className="text-left space-y-2 border-b border-slate-800/80 pb-4 pr-6">
                <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">
                  Lagos Business Impact Case
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">{active.companyName}</h3>
                <p className="text-xs text-slate-400">
                  By <strong className="text-slate-200 font-semibold">{active.clientName}</strong> — {active.role}
                </p>
              </div>

              {/* Details and metrics list */}
              <div className="py-5 space-y-4 text-left">
                
                {/* Big Outcomes Block */}
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-850/80 flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/5">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Validated Success Metric</span>
                    <p className="text-sm md:text-base font-bold text-emerald-400 font-mono mt-0.5">{active.metrics}</p>
                  </div>
                </div>

                {/* Quote details */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Client Testimonial Summary</h4>
                  <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-orange-500/40 pl-3">
                    "{active.quote}"
                  </p>
                </div>

                {/* Success points list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Architectural Enhancements Implemented</h4>
                  <div className="space-y-1.5">
                    {getCaseBreakdown(active.id).map((point, index) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs">
                        <span className="text-emerald-400 text-sm leading-none mt-0.5 select-none">✦</span>
                        <p className="text-slate-300 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal action button */}
              <div className="flex justify-end pt-3 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-extrabold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition cursor-pointer"
                >
                  Dismiss Breakdown
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
