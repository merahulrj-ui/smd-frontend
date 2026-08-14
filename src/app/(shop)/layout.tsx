import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MobileDrawer from "@/components/MobileDrawer";
import GlobalModals from "@/components/GlobalModals";
import JayantiChatbotWrapper from "@/components/JayantiChatbotWrapper";
import { UIProvider } from "@/context/UIContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UIProvider>
        <Navbar />
        
        {/* Mobile Drawer & Modals */}
        <MobileDrawer />
        <GlobalModals />

        {/* Main Content Area */}
        <main className="main-layout-content">
          {children}
        </main>



        <Footer />
        <BottomNav />
        <JayantiChatbotWrapper />
    </UIProvider>
  );
}
