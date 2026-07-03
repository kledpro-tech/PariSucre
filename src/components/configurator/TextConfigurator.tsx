"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ConfiguratorState } from "@/types/configurator";

interface TextConfiguratorProps {
  state: ConfiguratorState;
  onUpdate: (updates: Partial<ConfiguratorState>) => void;
}

export default function TextConfigurator({ state, onUpdate }: TextConfiguratorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Personnalisation</h3>
        <p className="text-sm text-muted-foreground">Saisissez les textes qui apparaîtront sur la bûchette.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="establishmentName">Nom de l'établissement</Label>
          <Input
            id="establishmentName"
            value={state.establishmentName || ""}
            onChange={(e) => onUpdate({ establishmentName: e.target.value })}
            placeholder="Ex: Café de la Paix"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan (Optionnel)</Label>
          <Input
            id="slogan"
            value={state.slogan || ""}
            onChange={(e) => onUpdate({ slogan: e.target.value })}
            placeholder="Ex: Le goût de l'authenticité"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse (Face arrière)</Label>
          <Textarea
            id="address"
            value={state.address || ""}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="Adresse de l'établissement ou de PariSucre"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
