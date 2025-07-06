'use client';

import * as React from 'react';
import Link from 'next/link';
import { ScalingIcon as SeedlingIcon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { cn } from '@/lib/utils';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'am', name: 'Amharic' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState('English');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <SeedlingIcon className="h-6 w-6 text-green-600" />
          <span className="text-xl font-bold">ClyCites Pulse</span>
        </Link>
        
        <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link 
            href="/markets" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Markets
          </Link>
          <Link 
            href="/weather" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Weather
          </Link>
          <Link 
            href="/advisory" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Advisory
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {currentLanguage}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setCurrentLanguage(lang.name)}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ModeToggle />
          
          <Button className="hidden md:flex" size="sm">
            Sign In
          </Button>
          
          <Button 
            className="md:hidden" 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "container pb-4 md:hidden",
        isMenuOpen ? "block" : "hidden"
      )}>
        <nav className="flex flex-col space-y-3">
          <Link 
            href="/" 
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/markets" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Markets
          </Link>
          <Link 
            href="/weather" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Weather
          </Link>
          <Link 
            href="/advisory" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Advisory
          </Link>
          <Button className="w-full" size="sm">
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  );
}
