import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Download, MessageCircle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { buildWhatsAppUrl } from '@/lib/contact';
import {
  formatExperience,
  formatNumber,
  localizeCategoryLabel,
  localizeCountryName,
  localizeReligionLabel,
} from '@/lib/localization';
import type { Candidate, CategoryOption, CountryOption } from '@/types';

interface Props {
  candidate: Candidate;
  countries?: CountryOption[];
  categories?: CategoryOption[];
  whatsappNumber?: string;
}

function CandidateCardComponent({ candidate, countries = [], categories = [], whatsappNumber }: Props) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const shouldReduceMotion = useReducedMotion();

  const isReserved = candidate.reserved === 1;
  const isPriority = candidate.prioritized === 1;

  const localizedCountry = useMemo(
    () => localizeCountryName(candidate.country, locale, countries),
    [candidate.country, countries, locale],
  );
  const localizedWork = useMemo(
    () => localizeCategoryLabel(candidate.work, locale, categories),
    [candidate.work, categories, locale],
  );
  const localizedReligion = useMemo(
    () => localizeReligionLabel(candidate.religion, locale),
    [candidate.religion, locale],
  );
  const localizedExperience = useMemo(
    () => formatExperience(candidate.experience, locale),
    [candidate.experience, locale],
  );

  const summary = useMemo(() => {
    const parts = [localizedCountry, localizedWork];

    if (localizedExperience) {
      parts.push(localizedExperience);
    }

    if (candidate.age) {
      parts.push(`${t('candidate_card.age_label')}: ${formatNumber(candidate.age, locale)}`);
    }

    return parts.join(' · ');
  }, [candidate.age, locale, localizedCountry, localizedExperience, localizedWork, t]);

  const handleDownload = () => {
    if (isReserved) {
      return;
    }

    window.open(candidate.cv_file, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsApp = () => {
    if (isReserved) {
      return;
    }

    const url = buildWhatsAppUrl(whatsappNumber, t('whatsapp.message', { url: candidate.cv_file }));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={!isReserved && !shouldReduceMotion ? { y: -4 } : undefined}
      className={`group overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
        isPriority ? 'border-destructive/30 shadow-md shadow-destructive/5' : 'border-border hover:border-primary/20'
      } ${!isReserved ? 'hover:shadow-xl hover:shadow-primary/8' : ''}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={candidate.image}
          alt={candidate.name}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover transition-transform duration-500 ${
            isReserved ? 'grayscale opacity-10' : 'group-hover:scale-105'
          }`}
        />

        {isPriority && (
          <div className="absolute start-3 top-3 flex items-center gap-1.5 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-destructive-foreground shadow-lg">
            <span className="priority-pulse h-2 w-2 rounded-full bg-destructive-foreground" />
            {t('candidate_card.priority_label')}
          </div>
        )}

        {isReserved && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none -rotate-12 font-display text-2xl font-extrabold uppercase tracking-widest text-destructive/80">
              {t('candidate_card.reserved_label')}
            </span>
          </div>
        )}

        {!isReserved && (
          <div className="absolute bottom-3 end-3 rounded-md border border-border/50 bg-card/80 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-sm">
            {localizedReligion}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-foreground">{candidate.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{summary}</p>

        <div className="mt-3 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isReserved}
            aria-disabled={isReserved}
            title={isReserved ? t('candidate_card.reserved_tooltip') : t('candidate_card.download')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${
              isReserved
                ? 'cursor-not-allowed bg-muted text-muted-foreground opacity-50'
                : 'bg-secondary text-secondary-foreground active:scale-[0.97] hover:bg-muted'
            }`}
          >
            <Download size={14} />
            {t('candidate_card.download')}
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={isReserved}
            aria-disabled={isReserved}
            title={isReserved ? t('candidate_card.reserved_tooltip') : t('candidate_card.book_whatsapp')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition-all ${
              isReserved
                ? 'cursor-not-allowed bg-muted text-muted-foreground opacity-50'
                : 'bg-primary text-primary-foreground active:scale-[0.97] hover:brightness-110'
            }`}
          >
            <MessageCircle size={14} />
            {t('candidate_card.book_whatsapp')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const CandidateCard = memo(CandidateCardComponent);

export default CandidateCard;
