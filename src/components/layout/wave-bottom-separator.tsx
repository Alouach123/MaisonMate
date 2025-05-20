
// src/components/layout/wave-bottom-separator.tsx
import React from 'react';

interface WaveBottomSeparatorProps {
  fillColor?: string;
  className?: string;
}

export default function WaveBottomSeparator({ fillColor = 'rgba(0,0,0,0.7)', className }: WaveBottomSeparatorProps) {
  return (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 ${className}`} style={{ transform: 'translateY(1px)' }}> {/* Slight Y translate to avoid thin lines */}
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full max-h-[80px] md:max-h-[100px] lg:max-h-[120px]" // Control wave height
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,23.5V120H0V47.31C102.33,39.73,220.71,51.56,321.39,56.44Z"
          fill={fillColor}
        ></path>
      </svg>
    </div>
  );
}
