import { TemplateClassique } from './TemplateClassique';
import { TemplateBandeau } from './TemplateBandeau';
import { TemplateMinimaliste } from './TemplateMinimaliste';
import { TemplatePrestige } from './TemplatePrestige';
import type { TemplateRegistry } from './types';

export const templateRegistry: TemplateRegistry[] = [
  { slug: 'classique', name: 'Classique', component: TemplateClassique },
  { slug: 'bandeau', name: 'Complet (QR)', component: TemplateBandeau },
  { slug: 'minimaliste', name: 'Minimaliste', component: TemplateMinimaliste },
  { slug: 'prestige', name: 'Prestige', component: TemplatePrestige },
];

export { TemplateClassique, TemplateBandeau, TemplateMinimaliste, TemplatePrestige };
export type { TemplateRegistry, TemplateProps, TemplateComponent } from './types';
