import { useQuery } from '@tanstack/react-query';
import { mockBootstrap } from '@/lib/mock-data';
import type { PublicBootstrapPayload } from '@/types';

async function fetchBootstrap(): Promise<PublicBootstrapPayload> {
  // In production, replace with: fetch('/wp-json/cv-agency/v1/bootstrap')
  return mockBootstrap;
}

export function useBootstrap() {
  return useQuery({
    queryKey: ['bootstrap'],
    queryFn: fetchBootstrap,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
}
