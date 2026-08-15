import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import LazyComponents from "@/components/LazyComponents";
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
        
        {/* Mobile Drawer & Modals (Lazy Loaded) */}
        <LazyComponents />

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
