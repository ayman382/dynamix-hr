import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFAB from '@/components/ui/WhatsAppFAB';
import CountrySelector from '@/components/home/CountrySelector';
import CategorySelector from '@/components/home/CategorySelector';
import { useLocale } from '@/hooks/useLocale';
import { cancelSmoothScroll, scrollWindowToTop, smoothScrollToElement } from '@/lib/smoothScroll';
import type { CountryOption } from '@/types';

export default function TransferPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale } = useLocale();
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  useEffect(() => {
    scrollWindowToTop();
  }, []);

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

      <section className="relative overflow-hidden pb-16 pt-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-glow/5" />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-glow/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, hsl(var(--foreground)) 0, hsl(var(--foreground)) 1px, transparent 1px, transparent 50%)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="relative container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-glow/20 bg-glow/10 px-4 py-2"
          >
            <ArrowRight size={16} className="text-glow" />
            <span className="text-sm font-semibold text-glow">{t('transfer_hero.badge')}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-6xl"
          >
            {t('transfer_hero.headline')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
          >
            {t('transfer_hero.subheadline')}
          </motion.p>
        </div>
      </section>

      <CountrySelector mode="Transfer" onSelect={(country) => setSelectedCountry(country)} />

      <AnimatePresence initial={false}>
        {selectedCountry && (
          <CategorySelector
            countryName={locale === 'ar' ? selectedCountry.ar : selectedCountry.en}
            onSelect={(category) => navigate(`/transfer/candidates?country=${selectedCountry.slug}&work=${category.value}`)}
            onBack={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
