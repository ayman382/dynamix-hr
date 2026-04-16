import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import HeroSection from '@/components/home/HeroSection';
import CountrySelector from '@/components/home/CountrySelector';
import CategorySelector from '@/components/home/CategorySelector';
import CompanyStrength from '@/components/home/CompanyStrength';
import Testimonials from '@/components/home/Testimonials';
import ContactCTA from '@/components/home/ContactCTA';
import { useLocale } from '@/hooks/useLocale';
import { cancelSmoothScroll, smoothScrollToElement } from '@/lib/smoothScroll';
import type { CountryOption } from '@/types';

export default function Index() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    let firstFrameId = 0;
    let secondFrameId = 0;

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        smoothScrollToElement('category-selector', { align: 'center', offset: 12, duration: 720 });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
      cancelSmoothScroll();
    };
  }, [selectedCountry]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <CountrySelector mode="Home" onSelect={(country) => setSelectedCountry(country)} />

      <AnimatePresence initial={false}>
        {selectedCountry && (
          <CategorySelector
            countryName={locale === 'ar' ? selectedCountry.ar : selectedCountry.en}
            onSelect={(cat) => {
              navigate(`/candidates?country=${selectedCountry.slug}&work=${cat.value}`);
            }}
            onBack={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>

      <CompanyStrength />
      <Testimonials />
      <ContactCTA />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
