'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown, Building2, Truck, Palette } from 'lucide-react';

const STATS = [
  { icon: Building2, value: '+100', label: 'établissements' },
  { icon: Truck, value: 'Livraison gratuite', label: 'en IDF' },
  { icon: Palette, value: 'Design personnalisable', label: 'pour tous les goûts' },
];

export default function HeroSection() {
  return (
    <section id="accueil" className="relative gradient-hero overflow-hidden">
      {/* Subtle decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #264188 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Text column ── */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up opacity-0">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
                Solution Premium CHR
              </span>
            </div>

            <h1 className="animate-fade-in-up opacity-0 delay-100 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-[1.1] tracking-tight">
              Vos bûchettes de sucre,
              <br />
              <span className="text-primary">à votre&nbsp;</span>
              <span className="text-accent">image</span>
            </h1>

            <p className="animate-fade-in-up opacity-0 delay-200 mt-6 text-lg text-text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Personnalisez vos bûchettes de sucre avec votre logo et vos couleurs.
              Une touche d'élégance premium pour votre établissement CHR.
            </p>

            <div className="animate-fade-in-up opacity-0 delay-300 mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#configurateur" className="btn-accent text-base px-8 py-3.5 flex items-center justify-center gap-2">
                Personnaliser maintenant
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#comment-ca-marche" className="btn-secondary text-base px-8 py-3.5 flex items-center justify-center gap-2">
                Découvrir l'offre
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ── Visual column ── */}
          <div className="animate-fade-in-up opacity-0 delay-400 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] aspect-[4/3] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border">
              <Image 
                src="/hero-image.jpg" 
                alt="Ambiance café avec bûchettes de sucre personnalisées PariSucre"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="animate-fade-in-up opacity-0 delay-500 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-5 shadow-sm border border-border"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-text font-display">{value}</p>
                <p className="text-sm text-text-muted">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
