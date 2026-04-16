import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useBootstrap } from '@/hooks/useBootstrap';
import { useCandidates } from '@/hooks/useCandidates';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useLocale } from '@/hooks/useLocale';
import {
  formatNumber,
  formatResultsCount,
  localizeReligionLabel,
} from '@/lib/localization';
import CandidateCard from './CandidateCard';
import type { CandidateFilters, DisplayMode } from '@/types';

interface Props {
  mode: DisplayMode;
}

export default function CandidateListing({ mode }: Props) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { data: bootstrap } = useBootstrap();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const searchParamsString = searchParams.toString();
  const params = useMemo(() => new URLSearchParams(searchParamsString), [searchParamsString]);
  const currentSearch = params.get('search') || '';
  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 250);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (debouncedSearch === currentSearch) {
      return;
    }

    const nextParams = new URLSearchParams(params);
    if (debouncedSearch) {
      nextParams.set('search', debouncedSearch);
    } else {
      nextParams.delete('search');
    }
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }, [currentSearch, debouncedSearch, params, setSearchParams]);

  const filters: CandidateFilters = useMemo(
    () => ({
      display_mode: mode,
      country: params.get('country') || undefined,
      work: params.get('work') || undefined,
      religion: params.get('religion') || undefined,
      search: params.get('search') || undefined,
      prioritized: (params.get('prioritized') as '0' | '1') || undefined,
      page: Number(params.get('page')) || 1,
      page_size: 20,
    }),
    [mode, params],
  );

  const { data, isLoading, isFetching } = useCandidates(filters);

  const updateFilter = (key: string, value: string | null, options?: { replace?: boolean; resetPage?: boolean }) => {
    const nextParams = new URLSearchParams(params);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    if (options?.resetPage !== false && key !== 'page') {
      nextParams.delete('page');
    }

    setSearchParams(nextParams, { replace: options?.replace ?? false });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
    setShowFilters(false);
  };

  const activeCount = useMemo(
    () => ['country', 'work', 'religion', 'search', 'prioritized'].filter((key) => params.has(key)).length,
    [params],
  );

  const countries = useMemo(
    () => bootstrap?.countries.filter((country) => (mode === 'Home' ? country.count_home > 0 : country.count_transfer > 0)) || [],
    [bootstrap?.countries, mode],
  );
  const categories = bootstrap?.categories || [];
  const religionOptions = useMemo(
    () => ['Muslim', 'Christian', 'Hindu', 'Buddhist'].map((religion) => ({
      value: religion.toLowerCase(),
      label: localizeReligionLabel(religion, locale),
    })),
    [locale],
  );

  const totalPages = data?.total_pages || 0;

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] max-w-sm flex-1">
              <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('filters.search_placeholder')}
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-full rounded-button border border-border bg-input py-2.5 pe-4 ps-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <select
                value={params.get('country') || ''}
                onChange={(event) => updateFilter('country', event.target.value || null)}
                className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{t('filters.country')}</option>
                {countries.map((country) => (
                  <option key={country.slug} value={country.slug}>
                    {locale === 'ar' ? country.ar : country.en}
                  </option>
                ))}
              </select>

              <select
                value={params.get('work') || ''}
                onChange={(event) => updateFilter('work', event.target.value || null)}
                className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{t('filters.category')}</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {locale === 'ar' ? category.ar : category.en}
                  </option>
                ))}
              </select>

              <select
                value={params.get('religion') || ''}
                onChange={(event) => updateFilter('religion', event.target.value || null)}
                className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">{t('filters.religion')}</option>
                {religionOptions.map((religion) => (
                  <option key={religion.value} value={religion.value}>
                    {religion.label}
                  </option>
                ))}
              </select>

              <label className="flex cursor-pointer items-center gap-2 rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={params.get('prioritized') === '1'}
                  onChange={(event) => updateFilter('prioritized', event.target.checked ? '1' : null)}
                  className="rounded"
                />
                {t('filters.priority_only')}
              </label>
            </div>

            <button
              onClick={() => setShowFilters((currentValue) => !currentValue)}
              className="flex items-center gap-2 rounded-button bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground md:hidden"
            >
              <SlidersHorizontal size={16} />
              {t('filters.filter')}
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">{formatNumber(activeCount, locale)}</span>
              )}
            </button>

            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <X size={14} />
                {t('filters.clear_all')}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden md:hidden"
              >
                <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-4">
                  <select
                    value={params.get('country') || ''}
                    onChange={(event) => updateFilter('country', event.target.value || null)}
                    className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground"
                  >
                    <option value="">{t('filters.country')}</option>
                    {countries.map((country) => (
                      <option key={country.slug} value={country.slug}>
                        {locale === 'ar' ? country.ar : country.en}
                      </option>
                    ))}
                  </select>
                  <select
                    value={params.get('work') || ''}
                    onChange={(event) => updateFilter('work', event.target.value || null)}
                    className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground"
                  >
                    <option value="">{t('filters.category')}</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {locale === 'ar' ? category.ar : category.en}
                      </option>
                    ))}
                  </select>
                  <select
                    value={params.get('religion') || ''}
                    onChange={(event) => updateFilter('religion', event.target.value || null)}
                    className="rounded-button border border-border bg-input px-3 py-2.5 text-sm text-foreground"
                  >
                    <option value="">{t('filters.religion')}</option>
                    {religionOptions.map((religion) => (
                      <option key={religion.value} value={religion.value}>
                        {religion.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={params.get('prioritized') === '1'}
                      onChange={(event) => updateFilter('prioritized', event.target.checked ? '1' : null)}
                      className="rounded"
                    />
                    {t('filters.priority_only')}
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isFetching && !isLoading && (
          <p className="mb-4 text-xs text-muted-foreground">{t('empty_state.loading')}</p>
        )}

        {data && <p className="mb-6 text-sm text-muted-foreground">{formatResultsCount(data.total, locale)}</p>}

        {isLoading && !data ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="shimmer aspect-[3/5] rounded-card" />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.data.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  countries={bootstrap?.countries}
                  categories={categories}
                  whatsappNumber={bootstrap?.whatsapp_number}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: Math.min(totalPages, 10) }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActivePage = data.page === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => updateFilter('page', String(pageNumber), { resetPage: false })}
                      aria-current={isActivePage ? 'page' : undefined}
                      className={`h-10 w-10 rounded-button text-sm font-semibold transition-colors ${
                        isActivePage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-muted'
                      }`}
                    >
                      {formatNumber(pageNumber, locale)}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">{t('empty_state.no_results')}</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-primary hover:underline">
              {t('empty_state.reset_cta')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
