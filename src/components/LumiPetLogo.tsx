import React from 'react';

interface LumiPetLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customWidth?: number;
  customHeight?: number;
  iconOnly?: boolean;
  color?: string; // Hex color or Tailwind class override, default is the terracotta brand color #a25230
}

export default function LumiPetLogo({
  className = '',
  size = 'md',
  customWidth,
  customHeight,
  iconOnly = false,
  color = '#a25230', // exact brand terracotta brown from the uploaded logo image
}: LumiPetLogoProps) {
  // Sizing definitions
  const dimensions = {
    sm: { iconWidth: 32, iconHeight: 32, textClass: 'text-lg', subtextClass: 'text-[8px]' },
    md: { iconWidth: 44, iconHeight: 44, textClass: 'text-xl', subtextClass: 'text-[9px]' },
    lg: { iconWidth: 64, iconHeight: 64, textClass: 'text-2xl', subtextClass: 'text-[11px]' },
    xl: { iconWidth: 120, iconHeight: 120, textClass: 'text-4xl', subtextClass: 'text-xs' },
    custom: { iconWidth: customWidth || 48, iconHeight: customHeight || 48, textClass: 'text-xl', subtextClass: 'text-[9px]' },
  }[size];

  const iconSvg = (
    <svg
      viewBox="0 0 100 100"
      width={dimensions.iconWidth}
      height={dimensions.iconHeight}
      className="flex-shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 4 Paw Toe Ovals (Terracotta brand color) */}
      <ellipse
        cx="26"
        cy="38"
        rx="8"
        ry="12"
        fill={color}
        transform="rotate(-24 26 38)"
      />
      <ellipse
        cx="42"
        cy="25"
        rx="8.5"
        ry="13.5"
        fill={color}
        transform="rotate(-8 42 25)"
      />
      <ellipse
        cx="58"
        cy="25"
        rx="8.5"
        ry="13.5"
        fill={color}
        transform="rotate(8 58 25)"
      />
      <ellipse
        cx="74"
        cy="38"
        rx="8"
        ry="12"
        fill={color}
        transform="rotate(24 74 38)"
      />

      {/* Main Bottom Heel Pad */}
      <path
        d="M 31 58 C 29 42, 71 42, 69 58 C 68 64.5, 59 66, 50 62.5 C 41 66, 32 64.5, 31 58 Z"
        fill={color}
      />

      {/* White Nested Dog & Cat Lineart Content inside the Heel Pad */}
      {/* Dog Profile (Facing Left) */}
      <path
        d="M 43 51 C 45 49.5, 47.5 50, 48.5 52.5 C 49.2 54, 49.2 56, 47.8 57.5 C 46.8 58.5, 45.2 59.2, 44 59.2 C 43 59.2, 41.2 58.8, 40.5 57.8 M 40.5 57.8 C 39.5 56.8, 39 55.6, 39 54.2 C 39 52.8, 40 51.5, 41.5 51.5 L 43 51 Z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dog Nose & floppy ear */}
      <path
        d="M 39 54.2 C 38 54.2, 37.2 54.8, 37.2 55.6 C 37.2 56.4, 38 57, 39 57"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 43.5 51 C 43.5 52.5, 42.5 54.5, 41.5 54.5 C 40.5 54.5, 40 53, 40 51"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dog Eye */}
      <circle cx="43.5" cy="52.8" r="0.7" fill="white" />

      {/* Cat Profile (Facing Forward) */}
      {/* Head and pointy ears */}
      <path
        d="M 50.5 54 C 50.2 53.5, 50.1 51, 51.5 50 C 52 51, 52.5 52.5, 53.5 52.8 C 54.8 52.5, 55.5 51, 56 50 C 57.2 51, 57.1 53.5, 56.8 54"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cat Cheeks and chin */}
      <path
        d="M 50.5 54 C 49.5 55.5, 49.5 57.5, 51 58.5 C 52.5 59.5, 55 59.5, 56.2 58.5 C 57.5 57.5, 57.8 55.5, 56.8 54"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Cat Eyes */}
      <circle cx="52.2" cy="55.2" r="0.6" fill="white" />
      <circle cx="55.2" cy="55.2" r="0.6" fill="white" />
      {/* Cat Nose & Mouth */}
      <path
        d="M 53.7 56.5 L 53.5 57 L 53.3 56.5 Z"
        fill="white"
      />
      <path
        d="M 53.5 57 C 53.1 57.5, 52.8 57.5, 52.8 57.5 M 53.5 57 C 53.9 57.5, 54.2 57.5, 54.2 57.5"
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Cat Whiskers */}
      <path
        d="M 49.5 56.5 L 47.5 56 M 49.2 57.5 L 47 57.5 M 57.8 56.5 L 59.8 56 M 58.1 57.5 L 60.3 57.5"
        stroke="white"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );

  if (iconOnly) {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        {iconSvg}
      </div>
    );
  }

  // Full Brand Logo with exact text styles
  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {iconSvg}
      <div className="flex flex-col justify-center leading-none whitespace-nowrap">
        {/* Brand name */}
        <span 
          className={`font-black tracking-wide font-display whitespace-nowrap ${dimensions.textClass}`}
          style={{ color }}
        >
          LUMI PET
        </span>
        {/* Brand business descriptors */}
        <span 
          className={`font-black tracking-[0.2em] font-sans block mt-1 uppercase whitespace-nowrap ${dimensions.subtextClass}`}
          style={{ color, opacity: 0.85 }}
        >
          SPA & HOTEL
        </span>
      </div>
    </div>
  );
}
