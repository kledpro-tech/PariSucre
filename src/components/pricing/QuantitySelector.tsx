"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Tag, 
  Info, 
  Package, 
  Layers, 
  Scale, 
  Truck,
  Check
} from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout";

export default function QuantitySelector() {
  const [isCustom, setIsCustom] = useState<boolean>(true);
  const [cartonType, setCartonType] = useState<3000 | 1000>(3000); // 3000 or 1000 sticks per carton
  const [palettes, setPalettes] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const vatRate = 0.20; // 20% B2B default

  // Palette metrics
  const sticksPerPalette = 120000;
  const totalSticks = palettes * sticksPerPalette;

  // Prices per palette
  const pricePerPaletteHT = isCustom ? 1548.00 : 1308.00;
  
  // Calculate carton counts
  // Standard is always 1000 sticks per carton
  const activeCartonType = isCustom ? cartonType : 1000;
  const cartonsPerPalette = activeCartonType === 3000 ? 40 : 120;
  const totalCartons = palettes * cartonsPerPalette;

  // Price per carton
  const pricePerCartonHT = isCustom 
    ? (cartonType === 3000 ? 38.70 : 12.90)
    : 10.90;

  // Unit price per stick
  const unitPriceHT = isCustom ? 0.0129 : 0.0109;

  // Totals
  const subtotal = palettes * pricePerPaletteHT;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  // Net weight estimation (approx 4.3g per stick wrapper + sugar)
  const approxWeightKg = Math.round(totalSticks * 0.0043);

  const handlePaletteChange = (val: number) => {
    if (val >= 1) {
      setPalettes(val);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    
    const configState = {
      templateSlug: isCustom ? "classique" : "standard",
      establishmentName: isCustom ? "Mon Établissement (Personnalisé)" : "PariSucre (Gamme Standard)",
    };

    // Calculate checkout session details
    await createCheckoutSession(
      configState,
      totalSticks,
      Math.round(unitPriceHT * 10000) / 100, // Cents per unit
      Math.round(subtotal * 100),
      Math.round(vatAmount * 100),
      Math.round(total * 100)
    );
    setIsLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-sm space-y-8">
      {/* ── 1. SELECT CUSTOM VS STANDARD ── */}
      <div className="space-y-3">
        <Label className="text-base font-bold text-foreground">Type de produit</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option Personnalisée */}
          <button
            type="button"
            onClick={() => {
              setIsCustom(true);
              setCartonType(3000); // default back to 3000
            }}
            className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all ${
              isCustom
                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                : "border-border hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${isCustom ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm text-foreground">Personnalisé (Votre Logo)</span>
              {isCustom && <Check className="h-4 w-4 text-primary ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Valorisez votre image de marque auprès de vos clients avec votre propre design, logo et couleurs.
            </p>
            <div className="mt-auto">
              <span className="text-lg font-bold text-foreground">1 548,00 € HT</span>
              <span className="text-xs text-muted-foreground"> / palette</span>
              <div className="text-[10px] text-primary font-medium mt-1">Soit 0,0129 € HT / bûchette</div>
            </div>
          </button>

          {/* Option Standard PariSucre */}
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
            }}
            className={`flex flex-col items-start text-left p-4 rounded-xl border-2 transition-all ${
              !isCustom
                ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                : "border-border hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${!isCustom ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                <Tag className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm text-foreground">Gamme PariSucre (Standard)</span>
              {!isCustom && <Check className="h-4 w-4 text-primary ml-auto" />}
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Bûchettes prêtes à servir arborant le design officiel et élégant de la marque PariSucre.
            </p>
            <div className="mt-auto">
              <span className="text-lg font-bold text-foreground">1 308,00 € HT</span>
              <span className="text-xs text-muted-foreground"> / palette</span>
              <div className="text-[10px] text-primary font-medium mt-1">Soit 0,0109 € HT / bûchette (Économie : -15,5%)</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── 2. CONDITIONNEMENT (Only shown if custom selected) ── */}
      {isCustom && (
        <div className="space-y-3 pt-4 border-t">
          <Label className="text-base font-bold text-foreground">Format du carton</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCartonType(3000)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                cartonType === 3000
                  ? "border-primary bg-primary/5 font-semibold text-primary"
                  : "border-border hover:bg-muted/30 text-muted-foreground"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-sm text-foreground">Cartons de 3 000 bûchettes</span>
                <span className="text-[11px] text-muted-foreground">40 cartons par palette • 38,70 € HT / carton</span>
              </div>
              {cartonType === 3000 && <Check className="h-4 w-4 text-primary" />}
            </button>

            <button
              type="button"
              onClick={() => setCartonType(1000)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                cartonType === 1000
                  ? "border-primary bg-primary/5 font-semibold text-primary"
                  : "border-border hover:bg-muted/30 text-muted-foreground"
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="text-sm text-foreground">Cartons de 1 000 bûchettes</span>
                <span className="text-[11px] text-muted-foreground">120 cartons par palette • 12,90 € HT / carton</span>
              </div>
              {cartonType === 1000 && <Check className="h-4 w-4 text-primary" />}
            </button>
          </div>
        </div>
      )}

      {/* ── 3. PALETTE QUANTITY SELECTOR ── */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <Label htmlFor="palettes" className="text-base font-bold text-foreground">Nombre de palettes</Label>
            <p className="text-xs text-muted-foreground">1 palette minimum (120 000 bûchettes)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePaletteChange(palettes - 1)}
              disabled={palettes <= 1}
              className="h-9 w-9 rounded-lg"
            >
              -
            </Button>
            <Input
              id="palettes"
              type="number"
              min={1}
              value={palettes}
              onChange={(e) => handlePaletteChange(parseInt(e.target.value) || 1)}
              className="w-16 text-center font-bold h-9 rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePaletteChange(palettes + 1)}
              className="h-9 w-9 rounded-lg"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* ── 4. LOGISTICAL REASSURANCE CARD ── */}
      <div className="bg-muted/50 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-foreground">{palettes} Palette{palettes > 1 ? 's' : ''}</p>
            <p className="text-muted-foreground">Conditionnement</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-foreground">{totalCartons} Cartons</p>
            <p className="text-muted-foreground">de {activeCartonType} u.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-foreground">~{approxWeightKg} kg</p>
            <p className="text-muted-foreground">Poids total estimé</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-600">Gratuite</p>
            <p className="text-muted-foreground">Livraison Îde-de-France</p>
          </div>
        </div>
      </div>

      {/* ── 5. TOTALS AND CHECKOUT ── */}
      <div className="pt-6 border-t space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Volume total</span>
          <span className="font-medium text-foreground">{totalSticks.toLocaleString()} bûchettes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sous-total HT</span>
          <span className="font-medium text-foreground">{subtotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVA ({vatRate * 100}%)</span>
          <span className="font-medium text-foreground">{vatAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-2 border-t border-border/50">
          <span>Total TTC</span>
          <span className="text-primary">{total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
        </div>

        <Button 
          size="lg" 
          className="w-full text-base h-12 rounded-xl mt-4 font-semibold" 
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Redirection vers Stripe..." : "Passer la commande"}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
          <Info className="h-3 w-3 shrink-0" />
          Un Bon À Tirer (BAT) vous sera envoyé par email pour validation avant impression.
        </p>
      </div>
    </div>
  );
}
