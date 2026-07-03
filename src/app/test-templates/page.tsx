'use client';

import { templateRegistry } from '@/templates';
import type { TemplateProps } from '@/templates';

const DEMO_CONFIGS: { label: string; props: TemplateProps }[] = [
  {
    label: 'Sans logo — valeurs par défaut',
    props: {
      establishmentName: 'Café de Flore',
      slogan: 'Depuis 1887',
      weightGrams: '5',
      address: '172 Bd Saint-Germain, 75006 Paris',
      sugarType: 'Sucre blanc',
      colors: ['#264188'],
    },
  },
  {
    label: 'Couleur rouge — avec slogan long',
    props: {
      establishmentName: 'Le Petit Cler',
      slogan: 'Restaurant — Traiteur — Épicerie Fine',
      weightGrams: '4',
      address: '29 Rue Cler, 75007 Paris',
      sugarType: 'Sucre blanc',
      colors: ['#991b1b'],
    },
  },
  {
    label: 'Couleur dorée — sans slogan',
    props: {
      establishmentName: 'Brasserie Lipp',
      slogan: '',
      weightGrams: '5',
      address: '151 Bd Saint-Germain, 75006 Paris',
      sugarType: 'Sucre roux',
      colors: ['#c19a5b'],
    },
  },
  {
    label: 'Nom très long — test overflow',
    props: {
      establishmentName: 'La Maison de la Truffe et du Terroir Français',
      slogan: 'Gastronomie & Tradition',
      weightGrams: '5',
      address: '19 Place de la Madeleine, 75008 Paris',
      sugarType: 'Sucre blanc',
      colors: ['#1a5c3a'],
    },
  },
];

export default function TestTemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🧪 Test des Templates — Bûchettes de Sucre
        </h1>
        <p className="text-gray-500 mb-8">
          Page de test isolée. Chaque template est rendu avec plusieurs jeux de
          données pour vérifier l'alignement, le texte, les pictogrammes et les
          proportions.
        </p>

        <div className="text-xs text-gray-400 mb-8 font-mono bg-white rounded-lg p-4 border">
          <p>ViewBox : <strong>560 × 224</strong></p>
          <p>Dimensions physiques : <strong>120 mm × 52 mm</strong> (bûchette dépliée)</p>
          <p>TAB (onglet collage) : <strong>22 px</strong> de chaque côté</p>
          <p>Bande supérieure : <strong>52 px</strong> | Bande inférieure : <strong>52 px</strong></p>
          <p>Face principale : <strong>120 px</strong> de hauteur</p>
        </div>

        {/* ── Pour chaque jeu de données ── */}
        {DEMO_CONFIGS.map((config, ci) => (
          <div key={ci} className="mb-16">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Jeu de données #{ci + 1} — {config.label}
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              nom: &quot;{config.props.establishmentName}&quot; | slogan: &quot;
              {config.props.slogan || '(vide)'}&quot; | couleur:{' '}
              <span
                className="inline-block w-3 h-3 rounded-full align-middle border"
                style={{ backgroundColor: config.props.colors?.[0] }}
              />{' '}
              {config.props.colors?.[0]}
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {templateRegistry.map((tmpl) => {
                const Comp = tmpl.component;
                return (
                  <div key={tmpl.slug} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    {/* Label bar */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-semibold text-gray-700">
                        {tmpl.name}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        ({tmpl.slug})
                      </span>
                    </div>

                    {/* SVG preview — checkered background */}
                    <div
                      className="p-6"
                      style={{
                        background:
                          'repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 0 / 16px 16px',
                      }}
                    >
                      <div
                        className="w-full drop-shadow-md"
                        style={{ aspectRatio: '560 / 224' }}
                      >
                        <Comp {...config.props} className="w-full h-full" />
                      </div>
                    </div>

                    {/* Zoom ×2 */}
                    <details className="border-t">
                      <summary className="px-4 py-2 text-xs text-gray-500 cursor-pointer hover:bg-gray-50">
                        🔍 Voir en zoom ×2
                      </summary>
                      <div
                        className="p-6 overflow-auto"
                        style={{
                          background:
                            'repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 0 / 16px 16px',
                        }}
                      >
                        <div
                          className="drop-shadow-md"
                          style={{
                            width: '1120px',
                            aspectRatio: '560 / 224',
                          }}
                        >
                          <Comp {...config.props} className="w-full h-full" />
                        </div>
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ── Grille de comparaison rapide: tous les templates, même données ── */}
        <div className="mt-16 mb-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            📊 Comparaison rapide — Même données, 4 templates
          </h2>
          <div className="space-y-4">
            {templateRegistry.map((tmpl) => {
              const Comp = tmpl.component;
              return (
                <div key={tmpl.slug} className="flex items-center gap-4">
                  <span className="text-sm font-mono text-gray-500 w-28 shrink-0 text-right">
                    {tmpl.name}
                  </span>
                  <div
                    className="flex-1 bg-white rounded-lg border shadow-sm p-3"
                    style={{
                      background:
                        'repeating-conic-gradient(#f0f0f0 0% 25%, #fafafa 0% 50%) 0 0 / 16px 16px',
                    }}
                  >
                    <div style={{ aspectRatio: '560 / 224' }}>
                      <Comp
                        {...DEMO_CONFIGS[0]!.props}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
