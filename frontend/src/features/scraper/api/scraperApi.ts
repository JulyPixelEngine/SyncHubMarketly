import { apiClient, apiMutate } from '../../../shared/lib/apiClient';
import type { ScrapeJobResponse, ScrapeResultResponse } from '../types';

export function startScraping(): Promise<ScrapeJobResponse> {
  return apiMutate<ScrapeJobResponse>('/scraper/start', { method: 'POST' });
}

export function fetchJobStatus(jobId: number): Promise<ScrapeJobResponse> {
  return apiClient<ScrapeJobResponse>(`/scraper/jobs/${jobId}`);
}

export function fetchRecentJobs(): Promise<ScrapeJobResponse[]> {
  return apiClient<ScrapeJobResponse[]>('/scraper/jobs');
}

export function fetchJobResults(jobId: number): Promise<ScrapeResultResponse> {
  return apiClient<ScrapeResultResponse>(`/scraper/jobs/${jobId}/results`);
}

export function fetchLatestResults(): Promise<ScrapeResultResponse> {
  return apiClient<ScrapeResultResponse>('/scraper/latest');
}
