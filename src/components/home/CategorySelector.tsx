import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import type { CategoryOption } from '@/types';

interface Props {
  countryName: string;
  onSelect: (category: CategoryOption) => void;
  onBack: () => void;
}

const revealTransition = {
  duration: 0.44,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function CategorySelector({ countryName, onSelect, onBack }: Props) {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { isRTL, locale } = useLocale();

  const categories = data?.categories || [];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <motion.section
      id="category-selector"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        opacity: { duration: 0.24 },
        y: revealTransition,
      }}
      layout="position"
      className="scroll-mt-24 overflow-hidden pb-section-y-mobile lg:pb-section-y"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h3 className="text-xl font-display font-bold text-foreground sm:text-2xl">
            {t('category_selector.title')} — {countryName}
          </h3>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <BackIcon size={16} />
            {t('category_selector.back')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.value}
              initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...revealTransition, delay: index * 0.03 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(category)}
              className="flex cursor-pointer transform-gpu flex-col items-center gap-2 card-elevated p-5 transition-all will-change-transform hover:border-primary/30"
            >
              <span className="text-center text-sm font-semibold text-foreground">
                {locale === 'ar' ? category.ar : category.en}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
