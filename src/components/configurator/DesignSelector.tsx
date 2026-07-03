"use client";

import { templateRegistry } from "@/templates";
import { cn } from "@/lib/utils";
import type { TemplateProps } from "@/templates";

interface DesignSelectorProps {
  selectedTemplateSlug: string;
  onSelect: (slug: string) => void;
  previewProps?: Partial<TemplateProps>;
}

export default function DesignSelector({
  selectedTemplateSlug,
  onSelect,
  previewProps = {},
}: DesignSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Choisissez un design</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Sélectionnez le modèle qui mettra le mieux en valeur votre logo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {templateRegistry.map((template) => {
          const isSelected = selectedTemplateSlug === template.slug;
          const Tmpl = template.component;

          const miniProps: TemplateProps = {
            establishmentName: previewProps.establishmentName || "Mon Établissement",
            slogan: previewProps.slogan || "",
            logoUrl: previewProps.logoUrl,
            colors: previewProps.colors || ["#264188"],
            weightGrams: "4",
            address: previewProps.address || "PariSucre — Paris",
            sugarType: "Sucre blanc",
            isExport: false,
          };

          return (
            <button
              key={template.slug}
              type="button"
              id={`design-${template.slug}`}
              onClick={() => onSelect(template.slug)}
              className={cn(
                "group flex flex-col justify-center p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden",
                isSelected
                  ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg shrink-0", isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.836-.437-1.124-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.66h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                </div>
                <span className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                  {template.name}
                </span>
                {isSelected && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
