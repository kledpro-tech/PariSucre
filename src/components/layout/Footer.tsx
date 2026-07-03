import { Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'Accueil', href: '/' },
  { label: 'Personnaliser', href: '/#configurateur' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'Politique de confidentialité', href: '/confidentialite' },
];



export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-4 select-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="PariSucre Logo"
                className="h-10 w-auto rounded-md shadow-sm object-contain bg-white p-0.5"
              />
              <div className="flex items-center gap-0.5">
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  Pari<span className="text-accent-light">S</span>ucre
                </span>
              </div>
            </a>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Bûchettes de sucre personnalisées pour les professionnels de la restauration.
              Une touche d&apos;élégance à votre image de marque.
            </p>

          </div>

          {/* ── Navigation ── */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
                <a href="mailto:contact@parisucre.fr" className="hover:text-primary transition-colors">contact@parisucre.fr</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
                <a href="tel:+33184806030" className="hover:text-primary transition-colors">+33 1 84 80 60 30</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
                <span>Paris, Île-de-France</span>
              </li>
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Informations
            </h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} PariSucre. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40">
            Fabriqué avec passion à Paris 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
