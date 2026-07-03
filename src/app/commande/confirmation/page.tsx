import { CheckCircle2, ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Commande confirmée !</h1>
          <p className="mt-4 text-muted-foreground">
            Merci pour votre confiance. Votre commande est en cours de traitement.
          </p>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 text-left border space-y-4">
          <h2 className="font-semibold text-foreground border-b pb-2">Prochaines étapes :</h2>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">1</div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Validation du BAT</p>
              <p className="text-sm text-muted-foreground mt-1">Notre équipe prépare votre Bon À Tirer final (PDF haute définition) sous 24h ouvrées.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">2</div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Impression</p>
              <p className="text-sm text-muted-foreground mt-1">Dès votre accord sur le BAT, la production est lancée.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">3</div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Livraison</p>
              <p className="text-sm text-muted-foreground mt-1">Vous recevrez vos bûchettes sous 3 à 4 semaines.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full text-center py-2 h-11 flex justify-center items-center")}>
            Retour à l'accueil
          </Link>
          <a href="mailto:contact@parisucre.fr" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full text-center py-2 h-11 flex justify-center items-center gap-2")}>
            <Mail className="w-4 h-4" />
            Contacter le support
          </a>
        </div>
      </div>
    </div>
  );
}
