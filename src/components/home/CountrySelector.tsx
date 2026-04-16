import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { formatNumber } from '@/lib/localization';
import type { CountryOption, DisplayMode } from '@/types';

interface Props {
  mode: DisplayMode;
  onSelect: (country: CountryOption) => void;
}

const revealTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function CountrySelector({ mode, onSelect }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = useBootstrap();
  const { locale } = useLocale();
  const { theme } = useTheme();

  const countries = useMemo(
    () =>
      data?.countries.filter((country) =>
        mode === 'Home' ? country.count_home > 0 : country.count_transfer > 0,
      ) || [],
    [data?.countries, mode],
  );

  const title = mode === 'Home' ? t('country_selector.title_home') : t('country_selector.title_transfer');
  const subtitle = mode === 'Home' ? t('country_selector.subtitle_home') : t('country_selector.subtitle_transfer');

  return (
    <section
      id="country-selector"
      className={`scroll-mt-20 py-section-y-mobile lg:py-section-y ${
        theme === 'dark' ? 'section-gradient-dark' : 'section-gradient-light'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={revealTransition}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-display font-bold text-foreground sm:text-3xl lg:text-4xl">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
        </motion.div>

        {isLoading ? (
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="shimmer h-28 rounded-card" />
            ))}
          </div>
        ) : countries.length === 0 ? (
          <p className="text-center text-muted-foreground">{t('country_selector.no_countries')}</p>
        ) : (
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {countries.map((country, index) => {
              const count = mode === 'Home' ? country.count_home : country.count_transfer;
              return (
                <motion.button
                  key={country.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ ...revealTransition, delay: index * 0.035 }}
                  whileHover={{ scale: 1.035, y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onSelect(country)}
                  className="group relative flex cursor-pointer transform-gpu flex-col items-center gap-3 card-elevated p-6 transition-all will-change-transform hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                >
                  <span className="text-4xl drop-shadow-sm">{country.logo_or_flag}</span>
                  <span className="text-center text-sm font-semibold leading-tight text-foreground">
                    {locale === 'ar' ? country.ar : country.en}
                  </span>
                  <span className="absolute -end-2.5 -top-2.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">
                    {formatNumber(count, locale)} {t('country_selector.badge_suffix')}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
