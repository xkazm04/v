import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';

interface LanguageFlagSvgProps {
  flagSvg: string;
  alt: string;
  className?: string;
}

export const LanguageFlagSvg = ({ flagSvg, alt, className = '' }: LanguageFlagSvgProps) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return <div className={cn("rounded-md bg-gray-200 dark:bg-gray-700", className)} />;
  }
  
  return (
    <div className={cn("relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-600", className)}>
      <Image
        src={flagSvg}
        alt={alt}
        width={32}
        height={24}
        className="object-cover w-full h-full"
        onError={() => setImageError(true)}
      />
    </div>
  );
};