
"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
  size?: number; // Size of the star icon
  totalStars?: number;
  className?: string;
}

export default function StarRatingInput({
  rating,
  setRating,
  disabled = false,
  size = 24,
  totalStars = 5,
  className,
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Button
            key={starValue}
            type="button" // Important to prevent form submission if inside a form
            variant="ghost"
            size="icon"
            className={cn(
              "p-0 h-auto w-auto",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={() => !disabled && setRating(starValue)}
            onMouseEnter={() => !disabled && setHoverRating(starValue)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            aria-label={`Rate ${starValue} out of ${totalStars} stars`}
            disabled={disabled}
          >
            <Star
              className={cn(
                "transition-colors",
                (hoverRating || rating) >= starValue
                  ? 'fill-accent text-accent'
                  : 'text-muted-foreground/40'
              )}
              size={size}
            />
          </Button>
        );
      })}
    </div>
  );
}
