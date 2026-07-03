'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled
          ? 'glass shadow-md py-3'
          : 'bg-transparent py-5',
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-8">
        {/* ── Logo ── */}
        <a href="#accueil" className="flex items-center gap-3 select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpg"
            alt="PariSucre Logo"
            className="h-10 w-auto rounded-md shadow-sm object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            Pari<span className="text-accent">S</span>ucre
          </span>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-text/80 hover:text-primary transition-colors duration-300
                         after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0
                         after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}

          <a
            href="#configurateur"
            className="btn-accent text-sm flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Personnaliser
          </a>
        </nav>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative z-50 p-2 -mr-2 text-text"
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col md:hidden transition-all duration-500',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      >
        {/* backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* panel */}
        <div
          className={cn(
            'relative ml-auto h-full w-[80%] max-w-sm bg-bg shadow-xl flex flex-col pt-24 px-6 pb-8 transition-transform duration-500',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-text py-3 px-4 rounded-lg hover:bg-bg-subtle transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-8">
            <a
              href="#configurateur"
              onClick={() => setMobileOpen(false)}
              className="btn-accent w-full text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Personnaliser
            </a>
          </div>

          {/* bottom branding */}
          <div className="mt-auto pt-8 border-t border-border">
            <span className="font-display text-sm text-text-muted">
              <span className="text-primary">Pari</span>
              <span className="text-accent">Sucre</span>
              {' '}— Sucre sur-mesure
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
