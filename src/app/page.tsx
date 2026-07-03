import HeroSection from "@/components/hero/HeroSection";
import OrderFlow from "@/components/order/OrderFlow";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <section id="configurateur" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">
              Votre commande
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Configurez, personnalisez et commandez vos bûchettes de sucre en quelques étapes.
            </p>
          </div>
          
          <OrderFlow />
        </div>
      </section>
    </div>
  );
}
