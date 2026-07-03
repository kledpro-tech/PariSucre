"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Tag,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Layers,
  Scale,
  Truck,
  Info,
  Building2,
  CreditCard,
  Palette,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import LogoUploader from "@/components/configurator/LogoUploader";
import ColorPicker from "@/components/configurator/ColorPicker";
import DesignSelector from "@/components/configurator/DesignSelector";
import TextConfigurator from "@/components/configurator/TextConfigurator";
import { StickPreview } from "@/components/configurator/StickPreview";
import type { ConfiguratorState } from "@/types/configurator";
import { createCheckoutSession } from "@/actions/checkout";

// ─── TYPES ─────────────────────────────────────────────────

type ProductType = "custom" | "standard";
type CartonSize = 3000 | 1000;

interface BillingInfo {
  companyName: string;
  siret: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}

const STEPS = [
  { id: 1, label: "Produit", icon: Package },
  { id: 2, label: "Facturation", icon: FileText },
  { id: 3, label: "Paiement", icon: CreditCard },
] as const;

// ─── COMPONENT ─────────────────────────────────────────────

export default function OrderFlow() {
  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Product configuration
  const [productType, setProductType] = useState<ProductType>("custom");
  const [cartonType, setCartonType] = useState<CartonSize>(3000);
  const [palettes, setPalettes] = useState(1);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Design state (only for custom)
  const [designState, setDesignState] = useState<ConfiguratorState>({
    templateSlug: "classique",
    logoUrl: undefined,
    colors: ["#264188"],
    establishmentName: "",
    slogan: "",
    legalMentions: "",
    weightGrams: "5",
    address: "",
    sugarType: "Sucre blanc",
  });

  // Step 2: Billing
  const [billing, setBilling] = useState<BillingInfo>({
    companyName: "",
    siret: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
  });

  // Step 3: Payment
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Blob URL cleanup
  const prevBlobRef = useRef<string | null>(null);

  // ── Pricing calculations ──
  const vatRate = 0.2;
  const sticksPerPalette = 120_000;
  const totalSticks = palettes * sticksPerPalette;
  const activeCartonType = productType === "custom" ? cartonType : 1000;
  const cartonsPerPalette = activeCartonType === 3000 ? 40 : 120;
  const totalCartons = palettes * cartonsPerPalette;

  const pricePerPaletteHT = productType === "custom" ? 1548.0 : 1308.0;
  const pricePerCartonHT =
    productType === "custom"
      ? cartonType === 3000
        ? 38.7
        : 12.9
      : 10.9;
  const unitPriceHT = productType === "custom" ? 0.0129 : 0.0109;

  const subtotal = palettes * pricePerPaletteHT;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;
  const approxWeightKg = Math.round(totalSticks * 0.0043);

  // ── Handlers ──
  const handleDesignUpdate = useCallback(
    (updates: Partial<ConfiguratorState>) => {
      setDesignState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleFileSelected = useCallback(
    (file: File) => {
      // Revoke previous blob URL to avoid memory leaks
      if (prevBlobRef.current) {
        URL.revokeObjectURL(prevBlobRef.current);
      }
      const url = URL.createObjectURL(file);
      prevBlobRef.current = url;
      setCurrentFile(file);
      handleDesignUpdate({ logoUrl: url });
    },
    [handleDesignUpdate]
  );

  const handleBillingChange = (field: keyof BillingInfo, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaletteChange = (val: number) => {
    if (val >= 1) setPalettes(val);
  };

  // ── Step validation ──
  const isStep1Valid = () => {
    if (productType === "standard") return true;
    // Custom: need at least a name
    return (designState.establishmentName || "").trim().length > 0;
  };

  const isStep2Valid = () => {
    return (
      billing.companyName.trim().length > 0 &&
      billing.email.trim().length > 0 &&
      billing.phone.trim().length > 0 &&
      billing.address.trim().length > 0 &&
      billing.postalCode.trim().length > 0 &&
      billing.city.trim().length > 0
    );
  };

  const goNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1);
  };
  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setCheckoutError(null);

    const configState = {
      templateSlug:
        productType === "standard" ? "standard" : designState.templateSlug,
      establishmentName:
        productType === "standard"
          ? "PariSucre (Gamme Standard)"
          : designState.establishmentName || "Mon Établissement",
    };

    try {
      const result = await createCheckoutSession(
        configState,
        totalSticks,
        Math.round(unitPriceHT * 10000) / 100,
        Math.round(subtotal * 100),
        Math.round(vatAmount * 100),
        Math.round(total * 100)
      );
      if (result?.error) {
        setCheckoutError(result.error);
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      setCheckoutError(
        "Une erreur est survenue. Veuillez réessayer ou nous contacter."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──
  return (
    <div className="space-y-8">
      {/* ── STEP INDICATOR ── */}
      <div className="flex items-center justify-center gap-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;
          return (
            <div key={step.id} className="flex items-center">
              {i > 0 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 transition-colors duration-300 ${
                    isComplete ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
              <button
                onClick={() => {
                  // Allow going back to completed steps
                  if (step.id < currentStep) setCurrentStep(step.id);
                }}
                disabled={step.id > currentStep}
                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : isComplete
                    ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden text-xs">{step.id}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: PRODUCT & DESIGN ── */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in-up" style={{ animationDuration: '0.4s', opacity: 1 }}>
          {/* ── 1. PRODUCT TYPE ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
              <h3 className="text-xl font-bold text-foreground">Type de produit</h3>
            </div>
            
            <div className="flex flex-row items-stretch gap-2 sm:gap-3 ml-0 sm:ml-11">
              {/* Custom */}
              <button
                type="button"
                onClick={() => {
                  setProductType("custom");
                  setCartonType(3000);
                }}
                className={`relative flex flex-1 flex-col items-start text-left p-3 sm:p-4 rounded-lg border-2 transition-all min-w-0 ${
                  productType === "custom"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 w-full">
                  <div className={`p-1 rounded-md ${productType === "custom" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Personnalisé (Votre Logo)</span>
                  {productType === "custom" && <Check className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 leading-snug">
                  Votre design, logo et couleurs.
                </p>
                <div className="mt-auto">
                  <span className="text-sm sm:text-base font-bold text-foreground">1 548,00 € HT</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground"> / palette</span>
                  <div className="text-[10px] text-primary font-medium mt-0.5">0,0129 € HT / bûchette</div>
                </div>
              </button>

              {/* Standard */}
              <button
                type="button"
                onClick={() => setProductType("standard")}
                className={`relative flex flex-1 flex-col items-start text-left p-3 sm:p-4 rounded-lg border-2 transition-all min-w-0 ${
                  productType === "standard"
                    ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                    : "border-border hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 w-full">
                  <div className={`p-1 rounded-md ${productType === "standard" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <Tag className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Gamme PariSucre (Standard)</span>
                  {productType === "standard" && <Check className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 leading-snug">
                  Design officiel PariSucre, prêt à servir.
                </p>
                <div className="mt-auto">
                  <span className="text-sm sm:text-base font-bold text-foreground">1 308,00 € HT</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground"> / palette</span>
                  <div className="text-[10px] text-primary font-medium mt-0.5">0,0109 € HT / bûchette (−15,5%)</div>
                </div>
              </button>
            </div>
          </div>

          <Separator />

          {/* ── 2. DESIGN (Conditional) ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
              <h3 className="text-xl font-bold text-foreground">
                {productType === "custom" ? "Personnalisation du design" : "Design officiel PariSucre"}
              </h3>
            </div>

            <div className="ml-0 sm:ml-11">
              {productType === "custom" ? (
                <div className="space-y-8">
                  <p className="text-sm text-muted-foreground">
                    Configurez le visuel qui apparaîtra sur vos bûchettes.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controls column */}
                    <div className="lg:col-span-5 space-y-6">
                      <LogoUploader
                        currentFile={currentFile}
                        currentPreviewUrl={designState.logoUrl || null}
                        onFileSelected={handleFileSelected}
                      />

                      <Separator />
                      <TextConfigurator
                        state={designState}
                        onUpdate={handleDesignUpdate}
                      />

                      {designState.logoUrl && (
                        <>
                          <Separator />
                          <ColorPicker
                            extractedColors={designState.colors || []}
                            selectedColors={designState.colors || []}
                            onColorsChange={(colors) => handleDesignUpdate({ colors })}
                          />
                        </>
                      )}

                      <Separator />
                      <DesignSelector
                        selectedTemplateSlug={designState.templateSlug}
                        onSelect={(slug) => handleDesignUpdate({ templateSlug: slug })}
                        previewProps={designState}
                      />
                    </div>

                    {/* Preview column */}
                    <div className="lg:col-span-7">
                      <div className="hidden lg:block sticky top-24">
                        <StickPreview {...designState} />
                      </div>
                      {/* Mobile: non-sticky */}
                      <div className="lg:hidden">
                        <StickPreview {...designState} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/5 border border-primary/20 rounded-xl overflow-hidden flex flex-col md:flex-row items-center gap-6">
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-lg">Gamme prête à l'emploi</h4>
                        <p className="text-sm text-muted-foreground mt-2">
                          Les bûchettes standard arborent le design officiel de la marque PariSucre. 
                          <br/><br/>
                          Contenant 4 grammes de sucre pur, elles sont parfaites pour une utilisation immédiate en CHR sans avoir à concevoir votre propre visuel. 
                          Passez directement au choix des quantités !
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 border-l">
                    <div className="relative w-full max-w-[300px] aspect-[4/3]">
                      <Image 
                        src="/parisucre-standard-stick.jpg" 
                        alt="Bûchette Standard PariSucre" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* ── 3. QUANTITIES ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
              <h3 className="text-xl font-bold text-foreground">Conditionnement et quantités</h3>
            </div>

            <div className="ml-0 sm:ml-11 space-y-4">
              {/* Packaging selection (custom only) */}
              {productType === "custom" && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Format du carton</h4>
                  <div className="flex flex-row items-stretch gap-2 sm:gap-3 relative">
                    <button
                      type="button"
                      onClick={() => setCartonType(1000)}
                      className={`relative flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-all text-center min-w-0 ${
                        cartonType === 1000 ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <Layers className={`h-5 w-5 mb-1.5 ${cartonType === 1000 ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Cartons de 1 000 u.</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">120 cartons / palette</span>
                      <span className="text-xs sm:text-sm font-bold text-primary mt-1.5">12,90 € HT / carton</span>
                      {cartonType === 1000 && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                    </button>
                    
                    {/* "OU" Badge */}
                    <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background border-2 border-border items-center justify-center font-bold text-[10px] sm:text-xs text-muted-foreground z-10 shadow-sm">
                      OU
                    </div>

                    <button
                      type="button"
                      onClick={() => setCartonType(3000)}
                      className={`relative flex-1 flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-all text-center min-w-0 ${
                        cartonType === 3000 ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <Package className={`h-5 w-5 mb-1.5 ${cartonType === 3000 ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs sm:text-sm font-semibold text-foreground leading-tight">Cartons de 3 000 u.</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">40 cartons / palette</span>
                      <span className="text-xs sm:text-sm font-bold text-primary mt-1.5">38,70 € HT / carton</span>
                      {cartonType === 3000 && <Check className="h-4 w-4 text-primary absolute top-2 right-2" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Palette quantity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Nombre de palettes</h4>
                    <p className="text-xs text-muted-foreground">1 palette = 120 000 bûchettes (minimum de commande)</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button variant="default" size="icon" onClick={() => handlePaletteChange(palettes - 1)} disabled={palettes <= 1} className="h-8 w-8 rounded-lg" aria-label="Retirer une palette">−</Button>
                    <Input type="number" min={1} value={palettes} onChange={(e) => handlePaletteChange(parseInt(e.target.value) || 1)} className="w-14 text-center font-bold h-8 rounded-lg" aria-label="Nombre de palettes" />
                    <Button variant="default" size="icon" onClick={() => handlePaletteChange(palettes + 1)} className="h-8 w-8 rounded-lg" aria-label="Ajouter une palette">+</Button>
                  </div>
                </div>
              </div>

              {/* Logistics summary card */}
              <div className="bg-muted/50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{palettes} Palette{palettes > 1 ? "s" : ""}</p>
                    <p className="text-muted-foreground">Conditionnement</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{totalCartons} Cartons</p>
                    <p className="text-muted-foreground">de {activeCartonType.toLocaleString("fr-FR")} u.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">~{approxWeightKg} kg</p>
                    <p className="text-muted-foreground">Poids estimé</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-emerald-600">Gratuite</p>
                    <p className="text-muted-foreground">Livraison Île-de-France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next button */}
          <div className="flex justify-end pt-4 border-t">
            <Button size="lg" onClick={goNext} disabled={!isStep1Valid()} className="px-8 h-12 text-base rounded-xl font-semibold">
              Continuer vers la facturation
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: BILLING ── */}
      {currentStep === 2 && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up" style={{ animationDuration: '0.4s', opacity: 1 }}>
          <div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informations de facturation
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ces informations seront utilisées pour la facturation et la
              livraison.
            </p>
          </div>

          <div className="bg-card border rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
            {/* Company info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Raison sociale *
                </Label>
                <Input
                  id="companyName"
                  value={billing.companyName}
                  onChange={(e) =>
                    handleBillingChange("companyName", e.target.value)
                  }
                  placeholder="Ex: SAS Mon Restaurant"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret" className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  N° SIRET
                </Label>
                <Input
                  id="siret"
                  value={billing.siret}
                  onChange={(e) =>
                    handleBillingChange("siret", e.target.value)
                  }
                  placeholder="123 456 789 00012"
                  maxLength={17}
                />
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Nom du contact
                </Label>
                <Input
                  id="contactName"
                  value={billing.contactName}
                  onChange={(e) =>
                    handleBillingChange("contactName", e.target.value)
                  }
                  placeholder="Prénom Nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={billing.email}
                  onChange={(e) =>
                    handleBillingChange("email", e.target.value)
                  }
                  placeholder="contact@monrestaurant.fr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={billing.phone}
                onChange={(e) =>
                  handleBillingChange("phone", e.target.value)
                }
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="billingAddress" className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Adresse de facturation *
              </Label>
              <Input
                id="billingAddress"
                value={billing.address}
                onChange={(e) =>
                  handleBillingChange("address", e.target.value)
                }
                placeholder="123 Rue de Paris"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={billing.postalCode}
                  onChange={(e) =>
                    handleBillingChange("postalCode", e.target.value)
                  }
                  placeholder="75001"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={billing.city}
                  onChange={(e) =>
                    handleBillingChange("city", e.target.value)
                  }
                  placeholder="Paris"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={goBack}
              className="px-6 h-12 text-base rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={goNext}
              disabled={!isStep2Valid()}
              className="px-8 h-12 text-base rounded-xl font-semibold"
            >
              Continuer vers le paiement
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: SUMMARY & PAYMENT ── */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up" style={{ animationDuration: '0.4s', opacity: 1 }}>
          <div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Récapitulatif de commande
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Vérifiez les informations avant de procéder au paiement.
            </p>
          </div>

          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            {/* Product summary */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                {productType === "custom" ? (
                  <Sparkles className="h-5 w-5 text-primary" />
                ) : (
                  <Tag className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {productType === "custom"
                      ? `Bûchettes personnalisées — ${designState.establishmentName}`
                      : "Bûchettes standard PariSucre"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {totalSticks.toLocaleString("fr-FR")} bûchettes •{" "}
                    {totalCartons} cartons de{" "}
                    {activeCartonType.toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Billing summary */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Facturation
                  </p>
                  <p className="font-medium text-foreground">
                    {billing.companyName}
                  </p>
                  {billing.siret && (
                    <p className="text-xs text-muted-foreground">
                      SIRET: {billing.siret}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">
                    Livraison
                  </p>
                  <p className="font-medium text-foreground">
                    {billing.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {billing.postalCode} {billing.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="bg-muted/30 p-6 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {palettes} palette{palettes > 1 ? "s" : ""} ×{" "}
                  {pricePerPaletteHT.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  € HT
                </span>
                <span className="font-medium text-foreground">
                  {subtotal.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TVA (20%)</span>
                <span className="font-medium text-foreground">
                  {vatAmount.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-xl font-bold pt-1">
                <span>Total TTC</span>
                <span className="text-primary">
                  {total.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>
            </div>
          </div>

          {/* Error display */}
          {checkoutError && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              {checkoutError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={goBack}
              className="px-6 h-12 text-base rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
              className="px-8 h-12 text-base rounded-xl font-semibold"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Redirection vers Stripe…
                </>
              ) : (
                <>
                  Payer {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € TTC
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
            <Info className="h-3 w-3 shrink-0" />
            Un Bon À Tirer (BAT) vous sera envoyé par email pour validation
            avant impression.
          </p>
        </div>
      )}
    </div>
  );
}
