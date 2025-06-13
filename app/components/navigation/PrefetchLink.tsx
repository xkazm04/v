'use client';

import Link from 'next/link';
import { useNavigationContext } from '@/app/providers/navigation-provider';
import { ReactNode, MouseEvent } from 'react';

interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function PrefetchLink({ href, children, className }: PrefetchLinkProps) {
  const { navigateTo } = useNavigationContext();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateTo(href);
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}