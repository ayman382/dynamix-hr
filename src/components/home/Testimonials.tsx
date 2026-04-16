import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { localizeLocationLabel } from '@/lib/localization';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { locale } = useLocale();
  const testimonials = data?.testimonials || [];

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-section-y-mobile lg:py-section-y">
      <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-display font-bold text-foreground sm:text-3xl lg:text-4xl">
            {t('testimonials.title')}
          </h2>
          <p className="mt-3 text-muted-foreground">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-elevated p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 lg:p-8"
            >
              <span className="font-display text-4xl leading-none text-primary">&quot;</span>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {locale === 'ar' ? item.text_ar : item.text}
              </p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: item.rating }).map((_, starIndex) => (
                  <Star key={starIndex} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-foreground">{locale === 'ar' ? item.name_ar : item.name}</p>
                <p className="text-xs text-muted-foreground">{localizeLocationLabel(item.location, locale)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
