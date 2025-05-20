// src/components/layout/wave-bottom-separator.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface WaveBottomSeparatorProps {
  fillColor: string; // Color of the section this separator is part of
  className?: string;
}

const WaveBottomSeparator: React.FC<WaveBottomSeparatorProps> = ({ fillColor, className }) => {
  return (
    // Positioned at the bottom of its parent.
    // leading-[0px] to prevent extra space from the div itself.
    // z-index ensures it's above the background image but below any absolute content if necessary.
    // translateY(1px) or similar can help prevent anti-aliasing lines between the SVG and the div bottom.
    <div 
      className={cn(
        "absolute bottom-0 left-0 w-full leading-[0px] z-20",
        className
      )} 
      style={{ transform: 'translateY(1px)' }} // Nudge to prevent rendering artifacts
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 100" // ViewBox height (e.g., 100) defines the design space of the wave.
        preserveAspectRatio="none" // Stretches SVG to fill container if aspect ratios differ.
        className="block w-full h-auto max-h-[40px] sm:max-h-[60px] md:max-h-[80px]" // Responsive height of the wave.
      >
        {/* 
          This path creates a shape that is solid above and wavy below.
          The fill color is the color of the current section's overlay/gradient bottom.
          The area "under" the wave is transparent, revealing the next section.
          Path: M0,0 (top-left) L1440,0 (top-right) L1440,70 (bottom-right, start of wave curve)
                C1080,20 360,120 0,70 (cubic bezier curve back to bottom-left)
                Z (close path)
        */}
        <path
          d="M0,0L1440,0L1440,60C1080,10 720,100 360,60C180,40 0,80 0,60Z" // A slightly different wave shape
          fill={fillColor}
        />
      </svg>
    </div>
  );
};

export default WaveBottomSeparator;
