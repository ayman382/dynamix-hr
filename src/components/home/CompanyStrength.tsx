import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, Download, MessageCircle, Globe, Zap, Heart } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useLocale } from '@/hooks/useLocale';
import { useTheme } from '@/hooks/useTheme';
import { formatNumber } from '@/lib/localization';
import type { Locale } from '@/types';

function AnimatedCounter({ target, locale, duration = 2000 }: { target: number; locale: Locale; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    let animationFrameId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));

            if (progress < 1) {
              animationFrameId = window.requestAnimationFrame(animate);
            }
          };

          animationFrameId = window.requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, target]);

  return <span ref={ref}>{formatNumber(count, locale)}</span>;
}

const icons = [Shield, Download, MessageCircle, Globe, Zap, Heart];

export default function CompanyStrength() {
  const { t } = useTranslation();
  const { data } = useBootstrap();
  const { locale } = useLocale();
  const { theme } = useTheme();
  const counters = data?.counters;
  const points = t('why_us.points', { returnObjects: true }) as string[];

  const stats = useMemo(
    () => [
      { value: counters?.years_experience || 0, label: t('counters.years_experience'), suffix: '+' },
      { value: counters?.assigned_workers || 0, label: t('counters.assigned_workers'), suffix: '+' },
      { value: counters?.available_candidates || 0, label: t('counters.available_candidates'), suffix: '' },
    ],
    [counters?.assigned_workers, counters?.available_candidates, counters?.years_experience, t],
  );

  return (
    <section
      className={`relative overflow-hidden py-section-y-mobile lg:py-section-y ${
        theme === 'dark' ? 'section-gradient-dark' : 'section-gradient-light'
      }`}
    >
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center text-2xl font-display font-bold text-foreground sm:text-3xl lg:text-4xl"
        >
          {t('why_us.title')}
        </motion.h2>

        <div className="mx-auto mb-16 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex min-h-[112px] min-w-0 flex-col items-center justify-center rounded-card border border-border bg-card px-2 py-3 text-center sm:min-h-[136px] sm:px-4 sm:py-5 lg:px-6 lg:py-6"
            >
              <div className="whitespace-nowrap text-xl font-display font-extrabold leading-none tracking-tight text-primary sm:text-4xl lg:text-5xl">
                <AnimatedCounter target={stat.value} locale={locale} />
                {stat.suffix}
              </div>
              <p className="mt-2 mx-auto min-h-[2.5rem] max-w-[10ch] text-center text-[11px] leading-tight text-muted-foreground sm:min-h-[2.75rem] sm:max-w-[12ch] sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={`${point}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-3 rounded-card border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-micro bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{point}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
