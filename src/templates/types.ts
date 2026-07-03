import type { TemplateProps } from "@/types/configurator";

export type { TemplateProps };

export type TemplateComponent = React.FC<TemplateProps>;

export interface TemplateRegistry {
  slug: string;
  name: string;
  component: TemplateComponent;
}
