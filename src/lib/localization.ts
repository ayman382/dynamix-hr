import type { CategoryOption, CountryOption, Locale } from '@/types';

const numberFormatters = new Map<Locale, Intl.NumberFormat>();

const categoryFallbacks = {
  housemaid: { en: 'House Maid', ar: 'عاملة منزلية' },
  driver: { en: 'Private Driver', ar: 'سائق خاص' },
  cook: { en: 'Cook / Chef', ar: 'طباخ' },
  nanny: { en: 'Nanny / Babysitter', ar: 'مربية أطفال' },
  gardener: { en: 'Gardener', ar: 'بستاني' },
  nurse: { en: 'Home Nurse', ar: 'ممرض منزلي' },
} as const;

const religionLabels = {
  muslim: { en: 'Muslim', ar: 'مسلم' },
  christian: { en: 'Christian', ar: 'مسيحي' },
  hindu: { en: 'Hindu', ar: 'هندوسي' },
  buddhist: { en: 'Buddhist', ar: 'بوذي' },
} as const;

const locationLabels = {
  riyadh: { en: 'Riyadh', ar: 'الرياض' },
  jeddah: { en: 'Jeddah', ar: 'جدة' },
  dammam: { en: 'Dammam', ar: 'الدمام' },
} as const;

function getFormatter(locale: Locale) {
  const cachedFormatter = numberFormatters.get(locale);
  if (cachedFormatter) {
    return cachedFormatter;
  }

  const nextFormatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US');
  numberFormatters.set(locale, nextFormatter);
  return nextFormatter;
}

export function formatNumber(value: number, locale: Locale) {
  return getFormatter(locale).format(value);
}

export function normalizeLookupValue(value?: string | null) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/\//g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function localizeCountryName(
  countryName: string,
  locale: Locale,
  countries: CountryOption[] = [],
) {
  const normalizedCountryName = normalizeLookupValue(countryName);

  const matchedCountry = countries.find(
    (country) =>
      country.slug === normalizedCountryName ||
      normalizeLookupValue(country.en) === normalizedCountryName ||
      normalizeLookupValue(country.ar) === normalizedCountryName,
  );

  if (matchedCountry) {
    return locale === 'ar' ? matchedCountry.ar : matchedCountry.en;
  }

  return countryName;
}

export function localizeCategoryLabel(
  categoryValue: string,
  locale: Locale,
  categories: CategoryOption[] = [],
) {
  const normalizedCategoryValue = normalizeLookupValue(categoryValue);

  const matchedCategory = categories.find(
    (category) =>
      category.value === normalizedCategoryValue ||
      normalizeLookupValue(category.en) === normalizedCategoryValue ||
      normalizeLookupValue(category.ar) === normalizedCategoryValue,
  );

  if (matchedCategory) {
    return locale === 'ar' ? matchedCategory.ar : matchedCategory.en;
  }

  const fallback = categoryFallbacks[normalizedCategoryValue as keyof typeof categoryFallbacks];
  if (fallback) {
    return fallback[locale];
  }

  return categoryValue;
}

export function localizeReligionLabel(religion: string, locale: Locale) {
  const normalizedReligion = normalizeLookupValue(religion);
  const fallback = religionLabels[normalizedReligion as keyof typeof religionLabels];
  if (fallback) {
    return fallback[locale];
  }

  return religion;
}

export function localizeLocationLabel(location: string, locale: Locale) {
  const normalizedLocation = normalizeLookupValue(location);
  const fallback = locationLabels[normalizedLocation as keyof typeof locationLabels];
  if (fallback) {
    return fallback[locale];
  }

  return location;
}

export function formatExperience(experience: string | null | undefined, locale: Locale) {
  if (!experience) {
    return '';
  }

  const matchedYears = experience.match(/\d+/);
  if (!matchedYears) {
    return experience;
  }

  const years = Number(matchedYears[0]);
  const formattedYears = formatNumber(years, locale);

  if (locale === 'ar') {
    return `${formattedYears} ${years === 1 ? 'سنة' : 'سنوات'}`;
  }

  return `${formattedYears} ${years === 1 ? 'year' : 'years'}`;
}

export function formatResultsCount(count: number, locale: Locale) {
  const formattedCount = formatNumber(count, locale);

  if (locale === 'ar') {
    return `${formattedCount} ${count === 1 ? 'نتيجة' : 'نتائج'}`;
  }

  return `${formattedCount} ${count === 1 ? 'result' : 'results'}`;
}
