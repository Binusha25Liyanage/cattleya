import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomerChatBubble } from "@/components/chat/CustomerChatBubble";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cattleya-offwhite">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CustomerChatBubble />
    </div>
  );
}
