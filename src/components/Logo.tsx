import React from 'react';
interface LogoProps {
  className?: string;
}
export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Yaygara Logo"
    >
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Playful background flourish (speech bubble tail style) */}
      <path
        d="M320 20C340 10 370 20 375 45C380 70 355 90 330 85L310 100L315 80C290 80 280 40 320 20Z"
        fill="#facc15"
        filter="url(#shadow)"
      />
      {/* Stylized Star Burst */}
      <path
        d="M40 30L45 15L50 30L65 35L50 40L45 55L40 40L25 35L40 30Z"
        fill="#38bdf8"
      />
      {/* "Yaygara" Wordmark - Rounded, Playful Typography Simulation */}
      <g filter="url(#shadow)">
        {/* Y */}
        <path d="M70 40L90 75V100" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M110 40L90 75" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        {/* a */}
        <path d="M135 70C135 60 160 60 160 75V100" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <circle cx="145" cy="85" r="15" stroke="currentColor" strokeWidth="12" />
        {/* y */}
        <path d="M175 70L190 95V115C190 125 175 125 170 120" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <path d="M205 70L190 95" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        {/* g */}
        <circle cx="225" cy="85" r="15" stroke="currentColor" strokeWidth="12" />
        <path d="M240 70V105C240 115 220 125 210 115" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        {/* a */}
        <path d="M260 70C260 60 285 60 285 75V100" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <circle cx="270" cy="85" r="15" stroke="currentColor" strokeWidth="12" />
        {/* r */}
        <path d="M305 70V100" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <path d="M305 80C305 70 325 65 330 75" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        {/* a */}
        <path d="M345 70C345 60 370 60 370 75V100" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
        <circle cx="355" cy="85" r="15" stroke="currentColor" strokeWidth="12" />
      </g>
    </svg>
  );
};