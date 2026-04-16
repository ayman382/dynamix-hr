import { useQuery } from '@tanstack/react-query';
import { fetchMockCandidates } from '@/lib/mock-data';
import type { CandidateFilters, CandidatesResponse } from '@/types';

async function fetchCandidates(filters: CandidateFilters): Promise<CandidatesResponse> {
  return fetchMockCandidates(filters);
}

export function useCandidates(filters: CandidateFilters) {
  return useQuery({
    queryKey: [
      'candidates',
      filters.display_mode,
      filters.country || '',
      filters.work || '',
      filters.religion || '',
      filters.search || '',
      filters.prioritized || '',
      filters.reserved || '',
      filters.page || 1,
      filters.page_size || 20,
    ],
    queryFn: () => fetchCandidates(filters),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    placeholderData: (previousData) => previousData,
  });
}
