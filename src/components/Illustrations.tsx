import { useId } from 'react';

type IllustrationProps = {
  className?: string;
};

function joinClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function HomeHeroIllustration({ className }: IllustrationProps) {
  const id = useId().replace(/:/g, '');
  
  return (
    <svg
      className={joinClassNames('page-illustration', className)}
      viewBox="50 80 1100 780"
      width="1100"
      height="780"
      role="img"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Background Gradients */}
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0B0C0E" />
          <stop offset="50%" stopColor="#12141C" />
          <stop offset="100%" stopColor="#08090C" />
        </linearGradient>
        
        <linearGradient id={`orange-glow-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        
        {/* Card Gradients */}
        <linearGradient id={`card-dark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#222530" />
          <stop offset="100%" stopColor="#14161E" />
        </linearGradient>
        
        <linearGradient id={`card-light-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
        </linearGradient>

        <linearGradient id={`accent-orange-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>

        {/* Filters */}
        <filter id={`shadow-${id}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="25" stdDeviation="22" floodColor="#000000" floodOpacity="0.55" />
        </filter>
        <filter id={`glow-filter-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Patterns */}
        <pattern id={`dot-grid-${id}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.2" fill="#fff" opacity="0.07" />
        </pattern>
      </defs>

      {/* Base Canvas */}

      
      {/* Background Dot Grid */}
      <rect width="1200" height="900" rx="36" fill={`url(#dot-grid-${id})`} />

      {/* Decorative Orbs */}
      <circle cx="950" cy="180" r="240" fill={`url(#orange-glow-${id})`} />
      <circle cx="200" cy="700" r="180" fill={`url(#orange-glow-${id})`} opacity="0.4" />
      
      {/* Subtle lines across background */}
      <path d="M 50 250 L 1150 250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      <path d="M 50 650 L 1150 650" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />

      {/* ── CENTRAL MAIN WORKSPACE WINDOW ── */}
      <g filter={`url(#shadow-${id})`}>
        <rect x="80" y="160" width="680" height="520" rx="26" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        
        {/* Header Bar */}
        <rect x="80" y="160" width="680" height="52" rx="26" fill="#14161F" opacity="0.9" />
        <circle cx="115" cy="186" r="6" fill="#ef4444" opacity="0.8" />
        <circle cx="135" cy="186" r="6" fill="#f59e0b" opacity="0.8" />
        <circle cx="155" cy="186" r="6" fill="#10b981" opacity="0.8" />
        <rect x="220" y="174" width="380" height="24" rx="12" fill="#1f2330" />
        <text x="410" y="190" fill="rgba(255,255,255,0.3)" fontSize="11" textAnchor="middle" fontFamily="monospace">jac-media-land // design-system</text>

        {/* Sidebar explorer mock */}
        <line x1="240" y1="212" x2="240" y2="680" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        <rect x="105" y="240" width="110" height="14" rx="7" fill={`url(#accent-orange-${id})`} opacity="0.9" />
        <rect x="105" y="275" width="90" height="10" rx="5" fill="#fff" opacity="0.25" />
        <rect x="105" y="305" width="100" height="10" rx="5" fill="#fff" opacity="0.25" />
        <rect x="105" y="335" width="75" height="10" rx="5" fill="#fff" opacity="0.25" />
        
        <rect x="105" y="400" width="80" height="12" rx="6" fill="#fff" opacity="0.4" />
        <rect x="105" y="430" width="95" height="10" rx="5" fill="#fff" opacity="0.15" />
        <rect x="105" y="460" width="60" height="10" rx="5" fill="#fff" opacity="0.15" />
        
        {/* Editor Main Canvas */}
        <g transform="translate(270 240)">
          {/* Vector grid paper in center */}
          <rect x="0" y="0" width="455" height="280" rx="16" fill="#0d0f14" stroke="rgba(255,255,255,0.03)" />
          <path d="M 0 70 L 455 70 M 0 140 L 455 140 M 0 210 L 455 210 M 113 0 L 113 280 M 227 0 L 227 280 M 341 0 L 341 280" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          
          {/* Stylized Vector curves (creative branding design layout) */}
          <path d="M 50 220 Q 150 40, 260 180 T 400 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
          <path d="M 50 220 Q 150 40, 260 180 T 400 60" fill="none" stroke={`url(#accent-orange-${id})`} strokeWidth="3" strokeLinecap="round" />
          
          {/* Handles & Nodes */}
          <circle cx="150" cy="110" r="5" fill="#fff" stroke="#f97316" strokeWidth="2" />
          <line x1="150" y1="110" x2="180" y2="70" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="180" cy="70" r="3.5" fill="#f97316" />
          
          <circle cx="260" cy="180" r="6" fill="#fff" stroke="#f97316" strokeWidth="2.5" />
          <line x1="260" y1="180" x2="300" y2="220" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3" />
          <circle cx="300" cy="220" r="3.5" fill="#f97316" />

          {/* Dotted target boxes */}
          <rect x="30" y="30" width="110" height="40" rx="8" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" strokeDasharray="3" />
          <circle cx="50" cy="50" r="10" fill="#f97316" opacity="0.25" />
          <circle cx="50" cy="50" r="4" fill="#f97316" />
          <rect x="75" y="46" width="50" height="8" rx="4" fill="#fff" opacity="0.6" />
        </g>
        
        {/* Terminal/Code area at bottom of panel */}
        <rect x="270" y="540" width="455" height="100" rx="14" fill="#0c0d12" stroke="rgba(255,255,255,0.03)" />
        <text x="290" y="570" fill="#34d399" fontSize="11" fontFamily="monospace">✓ Build compiled successfully</text>
        <text x="290" y="595" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="monospace">npm run deploy:prod --optimize</text>
        <text x="290" y="620" fill="#ea580c" fontSize="11" fontFamily="monospace">JAC Media Land - v1.4.2 [Online]</text>
      </g>

      {/* ── FLOATING ANALYTICS CARD (TOP RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(800 120)">
        <rect x="0" y="0" width="320" height="280" rx="24" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        
        {/* Glassmorphic border glow overlay */}
        <rect x="0" y="0" width="320" height="280" rx="24" fill={`url(#card-light-${id})`} />
        
        {/* Header */}
        <text x="28" y="42" fill="#fff" fontSize="15" fontWeight="800">Growth Index</text>
        <rect x="230" y="26" width="60" height="22" rx="11" fill="rgba(34,197,94,0.15)" />
        <text x="260" y="41" fill="#22c55e" fontSize="11" fontWeight="800" textAnchor="middle">+42%</text>

        {/* Chart Line path */}
        <path d="M 30 220 Q 90 190, 120 130 T 210 160 T 290 80" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 30 220 Q 90 190, 120 130 T 210 160 T 290 80" fill="none" stroke="url(#accent-orange-helper)" strokeWidth="4" strokeLinecap="round" />
        
        {/* Gradient fill under chart */}
        <path d="M 30 220 Q 90 190, 120 130 T 210 160 T 290 80 L 290 230 L 30 230 Z" fill="url(#chart-gradient-glow)" opacity="0.15" />

        {/* Data points */}
        <circle cx="120" cy="130" r="5" fill="#fff" stroke="#f97316" strokeWidth="2" filter={`url(#glow-filter-${id})`} />
        <circle cx="210" cy="160" r="5" fill="#fff" stroke="#f97316" strokeWidth="2" />
        <circle cx="290" cy="80" r="6" fill="#fff" stroke="#f97316" strokeWidth="3" filter={`url(#glow-filter-${id})`} />

        {/* Chart Gradients */}
        <defs>
          <linearGradient id="accent-orange-helper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="chart-gradient-glow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        <line x1="28" y1="95" x2="292" y2="95" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="28" y1="145" x2="292" y2="145" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="28" y1="195" x2="292" y2="195" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <line x1="28" y1="230" x2="292" y2="230" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      </g>

      {/* ── FLOATING MOBILE COMPILER CARD (BOTTOM RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(830 440)">
        <rect x="0" y="0" width="270" height="340" rx="24" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        <rect x="0" y="0" width="270" height="340" rx="24" fill={`url(#card-light-${id})`} />

        {/* Phone Speaker & Camera Notch */}
        <rect x="95" y="12" width="80" height="14" rx="7" fill="#14161F" />
        <circle cx="107" cy="19" r="2.5" fill="rgba(255,255,255,0.3)" />
        <rect x="125" y="17" width="36" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

        {/* Card Content inside mockup screen */}
        <rect x="24" y="50" width="222" height="76" rx="14" fill="#0d0f14" />
        <circle cx="56" cy="88" r="20" fill={`url(#accent-orange-${id})`} opacity="0.2" />
        {/* Simple checkmark icon */}
        <path d="M 48 88 L 53 93 L 64 82" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        
        <rect x="92" y="72" width="110" height="12" rx="6" fill="#fff" opacity="0.9" />
        <rect x="92" y="94" width="70" height="8" rx="4" fill="#fff" opacity="0.45" />

        {/* App details grid list */}
        <g transform="translate(24 150)">
          <rect x="0" y="0" width="222" height="46" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="24" cy="23" r="10" fill="#60a5fa" opacity="0.15" />
          <rect x="46" y="18" width="100" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="190" y="17" width="18" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
        </g>
        
        <g transform="translate(24 210)">
          <rect x="0" y="0" width="222" height="46" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="24" cy="23" r="10" fill="#34d399" opacity="0.15" />
          <rect x="46" y="18" width="120" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="190" y="17" width="18" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
        </g>
        
        <g transform="translate(24 270)">
          <rect x="0" y="0" width="222" height="46" rx="10" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="24" cy="23" r="10" fill="#a78bfa" opacity="0.15" />
          <rect x="46" y="18" width="85" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="190" y="17" width="18" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
        </g>
      </g>
    </svg>
  );
}

export function AboutHeroIllustration({ className }: IllustrationProps) {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      className={joinClassNames('page-illustration', className)}
      viewBox="50 80 1100 750"
      width="1100"
      height="750"
      role="img"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a0c10" />
          <stop offset="60%" stopColor="#141722" />
          <stop offset="100%" stopColor="#08090d" />
        </linearGradient>
        
        <linearGradient id={`orange-glow-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        
        <linearGradient id={`card-dark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e212b" />
          <stop offset="100%" stopColor="#121319" />
        </linearGradient>

        <linearGradient id={`card-light-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.01" />
        </linearGradient>
        
        <linearGradient id={`accent-orange-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>

        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="25" stdDeviation="22" floodColor="#000000" floodOpacity="0.5" />
        </filter>
        <filter id={`blur-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <pattern id={`dot-grid-${id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1" fill="#fff" opacity="0.06" />
        </pattern>
      </defs>


      <rect width="1200" height="900" rx="36" fill={`url(#dot-grid-${id})`} />
      
      {/* Background radial soft light */}
      <circle cx="600" cy="450" r="300" fill={`url(#orange-glow-${id})`} opacity="0.85" />
      <circle cx="950" cy="700" r="180" fill={`url(#orange-glow-${id})`} opacity="0.3" />

      {/* ── CENTRAL DATA & CREATIVE NODE WORK (Futuristic constellation) ── */}
      <g opacity="0.85" transform="translate(600, 450)">
        {/* Orbit paths */}
        <circle cx="0" cy="0" r="280" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <circle cx="0" cy="0" r="200" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" strokeDasharray="6 8" />
        <circle cx="0" cy="0" r="120" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        
        {/* Connective node web */}
        <line x1="-120" y1="-70" x2="0" y2="-120" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" />
        <line x1="0" y1="-120" x2="140" y2="-140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="140" y1="-140" x2="180" y2="80" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" />
        <line x1="180" y1="80" x2="80" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="80" y1="180" x2="-120" y2="160" stroke="rgba(249,115,22,0.25)" strokeWidth="1.5" />
        <line x1="-120" y1="160" x2="-120" y2="-70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* Lines connecting to center */}
        <line x1="0" y1="0" x2="-120" y2="-70" stroke="rgba(249,115,22,0.18)" strokeWidth="1" strokeDasharray="3" />
        <line x1="0" y1="0" x2="140" y2="-140" stroke="rgba(249,115,22,0.18)" strokeWidth="1" strokeDasharray="3" />
        <line x1="0" y1="0" x2="80" y2="180" stroke="rgba(249,115,22,0.18)" strokeWidth="1" strokeDasharray="3" />
        
        {/* Center glowing sun */}
        <circle cx="0" cy="0" r="28" fill="rgba(249,115,22,0.12)" />
        <circle cx="0" cy="0" r="14" fill={`url(#accent-orange-${id})`} filter={`url(#blur-glow-${id})`} />
        <circle cx="0" cy="0" r="6" fill="#fff" />

        {/* Constellation Nodes */}
        <g transform="translate(-120 -70)">
          <circle cx="0" cy="0" r="9" fill="#141722" stroke="#f97316" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="4" fill="#fff" />
        </g>
        <g transform="translate(0 -120)">
          <circle cx="0" cy="0" r="7" fill="#141722" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        </g>
        <g transform="translate(140 -140)">
          <circle cx="0" cy="0" r="10" fill="#141722" stroke="#f97316" strokeWidth="2.5" filter={`url(#blur-glow-${id})`} />
          <circle cx="0" cy="0" r="4" fill="#f97316" />
        </g>
        <g transform="translate(180 80)">
          <circle cx="0" cy="0" r="8" fill="#141722" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        </g>
        <g transform="translate(80 180)">
          <circle cx="0" cy="0" r="11" fill="#141722" stroke="#f97316" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="5" fill="#fff" />
        </g>
        <g transform="translate(-120 160)">
          <circle cx="0" cy="0" r="7" fill="#141722" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        </g>
      </g>

      {/* ── FLOATING GLASS CARD 1: DESIGN SYSTEM (TOP LEFT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(80 100)">
        <rect x="0" y="0" width="300" height="240" rx="20" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <rect x="0" y="0" width="300" height="240" rx="20" fill={`url(#card-light-${id})`} />
        
        {/* Title */}
        <text x="24" y="38" fill="#fff" fontSize="14" fontWeight="800" letterSpacing="0.05em">DESIGN SYSTEMS</text>
        
        {/* Color swatches */}
        <g transform="translate(24, 60)">
          <rect x="0" y="0" width="48" height="48" rx="8" fill="#ea580c" />
          <rect x="60" y="0" width="48" height="48" rx="8" fill="#f97316" />
          <rect x="120" y="0" width="48" height="48" rx="8" fill="#1f2937" stroke="rgba(255,255,255,0.1)" />
          <rect x="180" y="0" width="48" height="48" rx="8" fill="#0f172a" stroke="rgba(255,255,255,0.1)" />
        </g>

        {/* UI element previews */}
        <g transform="translate(24, 134)">
          <rect x="0" y="0" width="252" height="36" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="14" y="13" width="70" height="10" rx="5" fill="#f97316" />
          <rect x="200" y="11" width="38" height="14" rx="7" fill="rgba(249,115,22,0.15)" />
          <circle cx="219" cy="18" r="3" fill="#f97316" />
        </g>

        <g transform="translate(24, 182)">
          <rect x="0" y="0" width="252" height="36" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="22" cy="18" r="8" fill="#fff" opacity="0.25" />
          <rect x="42" y="13" width="90" height="10" rx="5" fill="#fff" opacity="0.8" />
        </g>
      </g>

      {/* ── FLOATING GLASS CARD 2: ANALYTICS (TOP RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(820 120)">
        <rect x="0" y="0" width="300" height="240" rx="20" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <rect x="0" y="0" width="300" height="240" rx="20" fill={`url(#card-light-${id})`} />
        
        <text x="24" y="38" fill="#fff" fontSize="14" fontWeight="800" letterSpacing="0.05em">ANALYTICS & TECH</text>
        
        {/* Simple Bar charts */}
        <g transform="translate(24 70)">
          <text x="0" y="14" fill="rgba(255,255,255,0.4)" fontSize="10">UI/UX</text>
          <rect x="44" y="5" width="208" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
          <rect x="44" y="5" width="180" height="8" rx="4" fill={`url(#accent-orange-${id})`} />
        </g>

        <g transform="translate(24 115)">
          <text x="0" y="14" fill="rgba(255,255,255,0.4)" fontSize="10">DEV</text>
          <rect x="44" y="5" width="208" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
          <rect x="44" y="5" width="145" height="8" rx="4" fill={`url(#accent-orange-${id})`} />
        </g>

        <g transform="translate(24 160)">
          <text x="0" y="14" fill="rgba(255,255,255,0.4)" fontSize="10">SEO</text>
          <rect x="44" y="5" width="208" height="8" rx="4" fill="rgba(255,255,255,0.05)" />
          <rect x="44" y="5" width="195" height="8" rx="4" fill={`url(#accent-orange-${id})`} />
        </g>
      </g>

      {/* ── FLOATING GLASS CARD 3: CODE INTEGRATION (BOTTOM LEFT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(120 460)">
        <rect x="0" y="0" width="320" height="280" rx="22" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <rect x="0" y="0" width="320" height="280" rx="22" fill={`url(#card-light-${id})`} />

        <text x="24" y="38" fill="#fff" fontSize="14" fontWeight="800" letterSpacing="0.05em">CODE INTEGRATION</text>
        
        {/* Mock HTML/React code blocks */}
        <g transform="translate(24 65)" fontFamily="monospace" fontSize="11" fontWeight="600">
          <text x="0" y="15" fill="#f97316">&lt;<tspan fill="#60a5fa">CreativeStudio</tspan>&gt;</text>
          
          <text x="20" y="40" fill="#a78bfa">const<tspan fill="#fff"> team</tspan> = <tspan fill="#34d399">&apos;youth&apos;</tspan>;</text>
          <text x="20" y="65" fill="#a78bfa">const<tspan fill="#fff"> goal</tspan> = <tspan fill="#34d399">&apos;impact&apos;</tspan>;</text>
          
          <text x="20" y="95" fill="#fff">dispatch(&#123;</text>
          <text x="40" y="120" fill="#f59e0b">type:<tspan fill="#34d399"> &apos;INNOVATE&apos;</tspan>,</text>
          <text x="40" y="145" fill="#f59e0b">payload: <tspan fill="#fff">team</tspan></text>
          <text x="20" y="170" fill="#fff">&#125;);</text>
          
          <text x="0" y="195" fill="#f97316">&lt;/<tspan fill="#60a5fa">CreativeStudio</tspan>&gt;</text>
        </g>
        
        <circle cx="280" cy="240" r="14" fill="#1f2937" />
        <path d="M 275 240 L 285 240 M 280 235 L 280 245" fill="none" stroke="#f97316" strokeWidth="2" />
      </g>

      {/* ── FLOATING GLASS CARD 4: PROCESS FLOW (BOTTOM RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(760 480)">
        <rect x="0" y="0" width="360" height="260" rx="22" fill={`url(#card-dark-${id})`} stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <rect x="0" y="0" width="360" height="260" rx="22" fill={`url(#card-light-${id})`} />

        <text x="24" y="38" fill="#fff" fontSize="14" fontWeight="800" letterSpacing="0.05em">USER JOURNEY MAP</text>

        {/* Dotted connection pathway */}
        <path d="M 50 140 Q 120 70, 180 140 T 310 140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeDasharray="4 6" />
        <path d="M 50 140 Q 120 70, 180 140 T 310 140" fill="none" stroke="#f97316" strokeWidth="1.5" />
        
        {/* Connection Milestones */}
        <g transform="translate(50 140)">
          <circle cx="0" cy="0" r="16" fill="#141722" stroke="#f97316" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#fff" />
          <rect x="-30" y="24" width="60" height="8" rx="4" fill="#fff" opacity="0.5" />
        </g>

        <g transform="translate(180 140)">
          <circle cx="0" cy="0" r="16" fill="#141722" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="#f97316" />
          <rect x="-30" y="24" width="60" height="8" rx="4" fill="#fff" opacity="0.5" />
        </g>

        <g transform="translate(310 140)">
          <circle cx="0" cy="0" r="18" fill="#141722" stroke="#f97316" strokeWidth="2" filter={`url(#blur-glow-${id})`} />
          <circle cx="0" cy="0" r="6" fill="#fff" />
          <rect x="-30" y="24" width="60" height="8" rx="4" fill="#f97316" />
        </g>
      </g>
    </svg>
  );
}

export function CultureIllustration({ className }: IllustrationProps) {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      className={joinClassNames('page-illustration', className)}
      viewBox="70 80 1060 770"
      width="1060"
      height="770"
      role="img"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Background Gradients */}
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBF8" />
          <stop offset="100%" stopColor="#F9EBE0" />
        </linearGradient>
        
        <linearGradient id={`accent-orange-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        
        <linearGradient id={`panel-grad-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fffcf8" />
        </linearGradient>

        <filter id={`shadow-${id}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="18" stdDeviation="15" floodColor="#9c7553" floodOpacity="0.14" />
        </filter>
        
        <pattern id={`dot-grid-${id}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.2" fill="#f97316" opacity="0.12" />
        </pattern>
      </defs>


      <rect width="1200" height="900" rx="36" fill={`url(#dot-grid-${id})`} />
      
      {/* Background circles */}
      <circle cx="150" cy="150" r="140" fill="#fff" opacity="0.6" />
      <circle cx="1020" cy="720" r="200" fill="#f97316" opacity="0.06" />

      {/* ── LEFT PANEL: IDEAS & CREATIVE MOODBOARD ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(100 120)">
        <rect x="0" y="0" width="460" height="660" rx="26" fill={`url(#panel-grad-${id})`} stroke="#f6cca3" strokeWidth="1.5" />
        
        {/* Header */}
        <rect x="0" y="0" width="460" height="64" rx="26" fill="#FCEEE2" opacity="0.7" />
        <rect x="28" y="22" width="130" height="20" rx="10" fill="#f97316" opacity="0.18" />
        <circle cx="410" cy="32" r="12" fill="#fff" stroke="#f6cca3" strokeWidth="1" />
        
        {/* Board content - Mock sticky notes & polaroids */}
        {/* Notes 1 */}
        <g transform="translate(28 90)">
          <rect x="0" y="0" width="180" height="160" rx="14" fill="#ffffff" stroke="rgba(249,115,22,0.15)" strokeWidth="1" />
          <rect x="18" y="18" width="144" height="90" rx="8" fill="#FDF3E9" />
          {/* Mock drawings */}
          <path d="M 40 76 Q 80 40, 110 76 T 140 60" fill="none" stroke="#f97316" strokeWidth="2.5" />
          <circle cx="80" cy="50" r="4" fill="#f97316" />
          <circle cx="110" cy="76" r="3" fill="#f97316" />
          
          <rect x="18" y="124" width="90" height="10" rx="5" fill="#1f2937" opacity="0.7" />
          <rect x="18" y="140" width="55" height="8" rx="4" fill="#1f2937" opacity="0.3" />
        </g>
        
        {/* Notes 2 (Sticky orange note) */}
        <g transform="translate(236 90)">
          <rect x="0" y="0" width="196" height="180" rx="14" fill="#FFF7ED" stroke="#fed7aa" strokeWidth="1" />
          <path d="M 0 0 L 196 0 L 196 150 L 166 180 L 0 180 Z" fill="#FFF7ED" />
          <path d="M 166 150 L 196 150 L 166 180 Z" fill="#ffedd5" stroke="#fed7aa" strokeWidth="1" />
          <text x="24" y="40" fill="#ea580c" fontSize="14" fontWeight="800">CULTURE</text>
          <rect x="24" y="65" width="148" height="8" rx="4" fill="#ea580c" opacity="0.25" />
          <rect x="24" y="85" width="148" height="8" rx="4" fill="#ea580c" opacity="0.25" />
          <rect x="24" y="105" width="110" height="8" rx="4" fill="#ea580c" opacity="0.25" />
          
          <rect x="24" y="142" width="60" height="16" rx="8" fill="#ea580c" />
          <text x="54" y="154" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">CORE</text>
        </g>

        {/* Wireframe layouts mockup */}
        <g transform="translate(28 280)">
          <rect x="0" y="0" width="404" height="240" rx="16" fill="#fff" stroke="rgba(31,41,55,0.08)" strokeWidth="1.5" />
          <rect x="18" y="18" width="140" height="204" rx="10" fill="#F8FAFC" stroke="rgba(31,41,55,0.04)" strokeWidth="1" />
          <circle cx="88" cy="70" r="22" fill="#fff" stroke="rgba(31,41,55,0.05)" strokeWidth="1" />
          <rect x="38" y="115" width="100" height="12" rx="6" fill="#1f2937" opacity="0.6" />
          <rect x="38" y="140" width="70" height="8" rx="4" fill="#1f2937" opacity="0.3" />
          <rect x="38" y="174" width="100" height="26" rx="13" fill="#f97316" />

          {/* Right section inside layout mockup */}
          <rect x="178" y="18" width="208" height="46" rx="10" fill="#F8FAFC" />
          <rect x="178" y="76" width="208" height="46" rx="10" fill="#F8FAFC" />
          <rect x="178" y="134" width="208" height="46" rx="10" fill="#F8FAFC" />
          <rect x="178" y="192" width="208" height="30" rx="10" fill="#F8FAFC" />
        </g>
        
        {/* Floating communication tags */}
        <g transform="translate(28 550)">
          <rect x="0" y="0" width="120" height="36" rx="18" fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.2)" strokeWidth="1" />
          <text x="60" y="22" fill="#16a34a" fontSize="12" fontWeight="700" textAnchor="middle">#Innovation</text>

          <rect x="132" y="0" width="110" height="36" rx="18" fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
          <text x="187" y="22" fill="#2563eb" fontSize="12" fontWeight="700" textAnchor="middle">#UX-Design</text>
          
          <rect x="254" y="0" width="122" height="36" rx="18" fill="rgba(249,115,22,0.1)" stroke="rgba(249,115,22,0.2)" strokeWidth="1" />
          <text x="315" y="22" fill="#ea580c" fontSize="12" fontWeight="700" textAnchor="middle">#YouthPower</text>
        </g>
      </g>

      {/* ── RIGHT PANEL: DIGITAL WORKSHOP (TOP RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(600 120)">
        <rect x="0" y="0" width="500" height="380" rx="26" fill={`url(#panel-grad-${id})`} stroke="#f6cca3" strokeWidth="1.5" />
        
        {/* Stat visualization */}
        <rect x="28" y="32" width="444" height="84" rx="18" fill="#FFFBF7" stroke="rgba(249,115,22,0.06)" strokeWidth="1" />
        <circle cx="70" cy="74" r="26" fill="#FFF7ED" />
        <path d="M 60 74 L 67 81 L 80 68" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        <rect x="114" y="52" width="200" height="16" rx="8" fill="#1f2937" opacity="0.8" />
        <rect x="114" y="78" width="130" height="10" rx="5" fill="#1f2937" opacity="0.3" />

        {/* Abstract vector graphics network */}
        <g transform="translate(28, 148)">
          <rect x="0" y="0" width="444" height="200" rx="18" fill="#ffffff" stroke="rgba(31,41,55,0.06)" strokeWidth="1" />
          
          {/* Waves graph */}
          <path d="M 28 150 Q 100 80, 180 130 T 320 60 T 416 110" fill="none" stroke="#f2f4f8" strokeWidth="8" strokeLinecap="round" />
          <path d="M 28 150 Q 100 80, 180 130 T 320 60 T 416 110" fill="none" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          
          {/* Flow connections */}
          <circle cx="180" cy="130" r="10" fill="#fff" stroke="#f97316" strokeWidth="2.5" />
          <circle cx="180" cy="130" r="4" fill="#f97316" />
          <circle cx="320" cy="60" r="10" fill="#fff" stroke="#f97316" strokeWidth="2.5" />
          <circle cx="320" cy="60" r="4" fill="#f97316" />
        </g>
      </g>

      {/* ── BOTTOM PANEL: WORKSPACE HIGHLIGHTS (BOTTOM RIGHT) ── */}
      <g filter={`url(#shadow-${id})`} transform="translate(600 540)">
        <rect x="0" y="0" width="500" height="240" rx="26" fill="#1F232D" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
        
        {/* Dark theme glass indicators */}
        <circle cx="68" cy="70" r="28" fill="rgba(249,115,22,0.15)" />
        {/* Simple outline leaf / energy icon */}
        <path d="M 68 52 C 78 52, 86 60, 86 70 C 86 80, 78 88, 68 88 C 58 88, 50 80, 50 70 Z M 50 70 C 50 60, 58 52, 68 52" fill="none" stroke="#f97316" strokeWidth="2.5" />
        
        <rect x="116" y="52" width="220" height="16" rx="8" fill="#fff" opacity="0.9" />
        <rect x="116" y="78" width="310" height="10" rx="5" fill="#fff" opacity="0.45" />
        <rect x="116" y="98" width="240" height="10" rx="5" fill="#fff" opacity="0.45" />

        {/* Minimal creative grid inside panel */}
        <g transform="translate(28 140)">
          <rect x="0" y="0" width="134" height="72" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="14" y="22" width="106" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="14" y="42" width="60" height="8" rx="4" fill="#f97316" />
        </g>
        
        <g transform="translate(182 140)">
          <rect x="0" y="0" width="134" height="72" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="14" y="22" width="106" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="14" y="42" width="75" height="8" rx="4" fill="#f97316" />
        </g>
        
        <g transform="translate(338 140)">
          <rect x="0" y="0" width="134" height="72" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <rect x="14" y="22" width="106" height="10" rx="5" fill="#fff" opacity="0.8" />
          <rect x="14" y="42" width="50" height="8" rx="4" fill="#f97316" />
        </g>
      </g>
    </svg>
  );
}

export function TeamIllustration({ className }: IllustrationProps) {
  // Return the HomeHeroIllustration since it is unused but keeps signature valid and clean.
  return <HomeHeroIllustration className={className} />;
}
