import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, MessageSquare, Star, CheckCircle } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  companyName: string;
  videoPlaceholderUrl?: string;
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
    metrics: "80% reduction in admin compiling hours",
  },
  {
    id: "gbagada_church",
    clientName: "Pastor David Oyela",
    role: "Executive Administrator & IT Lead",
    companyName: "RCCG Life Center, Gbagada",
    quote: "Our previous site was static and slow, but the instant WhatsApp Chatbot integration changed everything. Our congregation now receives daily prayer alerts, generates secure bank guides, and answers common inquiries 24/7. Saving over ₦50,050 every month on traditional SMS broadcasts is a huge financial relief for our ministries.",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    metrics: "92% Communication fees saved monthly",
  },
  {
    id: "yaba_ecommerce",
    clientName: "Folashade Alao",
    role: "Founder & Creative Director",
    companyName: "Sisi Alara Couture, Yaba",
    quote: "We were losing half of our incoming social media leads because our staff couldn't reply to DMs after midnight. 3Cords connected an AI Shopping Agent that coordinates size fits, suggests collections, and books appointments flawlessly. It feels like having an elite, non-sleeping sales team located right here in Lagos. Highly recommended!",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    metrics: "+310% in weekly order conversions",
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play cycling effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const active = TESTIMONIALS_DATA[currentIndex];

  return (
    <div 
      className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Accent Background Highlights */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
        
        {/* Left Side: Avatar with verified indicators & interactive layout */}
        <div className="flex flex-col items-center shrink-0 w-full lg:w-72">
          <div className="relative group">
            {/* Pulsing ring pattern */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
              <img 
                src={active.avatarUrl} 
                alt={active.clientName}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Active/Verified Badge */}
            <div className="absolute bottom-0 right-1.5 bg-emerald-500 text-slate-950 rounded-full p-1.5 border-2 border-slate-950 shadow-md">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4 text-center">
            <h4 className="text-base font-bold text-white font-sans">{active.clientName}</h4>
            <p className="text-xs text-orange-400 font-mono font-medium mt-0.5">{active.role}</p>
            <p className="text-[11px] text-slate-400 mt-1">{active.companyName}</p>
          </div>

          {/* Lagos Business Verified Seal */}
          <div className="mt-4 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Lagos Verified Case
          </div>
        </div>

        {/* Right Side: Quote and Interactive Navigation */}
        <div className="flex-1 flex flex-col justify-between min-h-[220px] w-full text-center lg:text-left">
          
          <div className="space-y-4">
            <div className="flex justify-center lg:justify-start items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-[10px] font-mono text-slate-500 uppercase ml-2">Rating 5.0 / 5.0</span>
            </div>

            <div className="relative">
              <Quote className="absolute -top-3.5 -left-4 w-8 h-8 text-orange-500/10 pointer-events-none hidden md:block" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm md:text-base text-slate-200 leading-relaxed italic font-medium"
                >
                  "{active.quote}"
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer of card - Metrics and controls */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-xl self-center lg:self-start">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                {active.metrics}
              </span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3 self-center">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-orange-400 hover:border-slate-700 transition"
                title="Previous feedback"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {TESTIMONIALS_DATA.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === i 
                        ? "w-5 bg-orange-500" 
                        : "w-2 bg-slate-800 hover:bg-slate-7050"
                    }`}
                    title={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-orange-400 hover:border-slate-700 transition"
                title="Next feedback"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
