"use client";

import { useState } from "react";
import LogoUploader from "./LogoUploader";
import ColorPicker from "./ColorPicker";
import DesignSelector from "./DesignSelector";
import TextConfigurator from "./TextConfigurator";
import { StickPreview } from "./StickPreview";
import type { ConfiguratorState } from "@/types/configurator";
import { Separator } from "@/components/ui/separator";

export default function ConfiguratorFlow() {
  const [state, setState] = useState<ConfiguratorState>({
    templateSlug: "classique",
    logoUrl: undefined,
    colors: ["#264188"],
    establishmentName: "Mon Établissement",
    slogan: "",
    legalMentions: "",
    weightGrams: "5",
    address: "PariSucre, Paris",
    sugarType: "Sucre blanc",
  });

  const handleUpdate = (updates: Partial<ConfiguratorState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5 space-y-8">
        <LogoUploader
          currentFile={null}
          currentPreviewUrl={state.logoUrl || null}
          onFileSelected={(file) => {
            // Mock upload for now
            const url = URL.createObjectURL(file);
            handleUpdate({ logoUrl: url });
          }}
        />
        
        {state.logoUrl && (
          <>
            <Separator />
            <ColorPicker
              extractedColors={state.colors || []}
              selectedColors={state.colors || []}
              onColorsChange={(colors) => handleUpdate({ colors })}
            />
          </>
        )}
        
        <Separator />
        <DesignSelector
          selectedTemplateSlug={state.templateSlug}
          onSelect={(slug) => handleUpdate({ templateSlug: slug })}
          previewProps={state}
        />

        <Separator />
        <TextConfigurator state={state} onUpdate={handleUpdate} />
      </div>
      
      <div className="lg:col-span-7">
        <div className="sticky top-24">
          <StickPreview {...state} />
        </div>
      </div>
    </div>
  );
}
