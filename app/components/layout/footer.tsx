import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary-50 w-full">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex  gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="mx-1">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}