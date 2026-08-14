import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MobileDrawer from "@/components/MobileDrawer";
import GlobalModals from "@/components/GlobalModals";
import dynamic from 'next/dynamic';
const JayantiChatbot = dynamic(() => import('@/components/JayantiChatbot'), { ssr: false });
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
        <div className="main-layout-content">
          {children}
        </div>



        <Footer />
        <BottomNav />
        <JayantiChatbot />
    </UIProvider>
  );
}
