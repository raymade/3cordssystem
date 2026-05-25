import React from "react";

export function Logo({ className = "h-10", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Exquisite SVG representation of the 3Cords orange knotted logo */}
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 select-none drop-shadow-[0_0_12px_rgba(249,115,22,0.3)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft backglow */}
        <circle cx="50" cy="50" r="35" fill="url(#orangeGlow)" opacity="0.15" />
        
        {/* Interconnected loops forming the "3" cord */}
        <path
          d="M35 30C35 22 45 16 55 20C65 24 62 38 52 40C42 42 42 58 52 60C62 62 65 76 55 80C45 84 35 78 35 70"
          stroke="url(#orangeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Metallic "B/3" inner element curve */}
        <path
          d="M32 30C28 30 25 33 25 38C25 43 28 46 32 46V54C28 54 25 57 25 62C25 67 28 70 32 70"
          stroke="url(#silverGradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Binding node connector loop representing core strength */}
        <path
          d="M48 38C48 38 45 46 50 50C55 54 52 62 52 62"
          stroke="url(#orangeGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.8"
        />

        <defs>
          <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5500" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6a00" />
            <stop offset="50%" stopColor="#ff4500" />
            <stop offset="100%" stopColor="#f39c12" />
          </linearGradient>
          <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#b0b0b0" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 font-display">
              3Cords
            </span>
            <span className="text-slate-300 font-display font-medium">System</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/15 border border-orange-500/30 text-orange-400 rounded font-mono font-bold leading-none select-none">
              GLOBAL
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5 leading-none">
            INTELLIGENT REDESIGN NODE
          </span>
        </div>
      )}
    </div>
  );
}
