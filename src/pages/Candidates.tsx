import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import CandidateListing from '@/components/candidates/CandidateListing';
import { scrollWindowToTop } from '@/lib/smoothScroll';

export default function CandidatesPage() {
  useEffect(() => {
    scrollWindowToTop();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CandidateListing mode="Home" />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
