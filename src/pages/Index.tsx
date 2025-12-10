import { Header } from "@/components/Header";
import { LivestockSection } from "@/components/LivestockSection";
import { CropsSection } from "@/components/CropsSection";
import { FinancialSection } from "@/components/FinancialSection";
import { InventorySection } from "@/components/InventorySection";
import {MedicalHistorySection} from "@/components/MedicalHistorySection";
import {PhotoSection} from "@/components/PhotoSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-12">
        <LivestockSection />
          <MedicalHistorySection/>
        <CropsSection />
        <FinancialSection />
        <InventorySection />
      </main>
    </div>
  );
};

export default Index;
