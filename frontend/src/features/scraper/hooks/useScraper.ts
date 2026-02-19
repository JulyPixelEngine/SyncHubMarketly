import { useState, useEffect, useCallback, useRef } from 'react';
import {
  startScraping,
  fetchJobStatus,
  fetchRecentJobs,
  fetchLatestResults,
  fetchJobResults,
} from '../api/scraperApi';
import type { ScrapeJobResponse, ScrapeResultResponse } from '../types';

export function useScraper() {
  const [activeJob, setActiveJob] = useState<ScrapeJobResponse | null>(null);
  const [recentJobs, setRecentJobs] = useState<ScrapeJobResponse[]>([]);
  const [results, setResults] = useState<ScrapeResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  // Load initial data
  useEffect(() => {
    Promise.all([fetchRecentJobs(), fetchLatestResults()])
      .then(([jobs, latest]) => {
        setRecentJobs(jobs);
        setResults(latest);
        const running = jobs.find(
          (j) => j.status === 'RUNNING' || j.status === 'PENDING',
        );
        if (running) setActiveJob(running);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Poll active job status
  useEffect(() => {
    if (
      !activeJob ||
      (activeJob.status !== 'RUNNING' && activeJob.status !== 'PENDING')
    ) {
      return;
    }

    pollRef.current = window.setInterval(async () => {
      try {
        const updated = await fetchJobStatus(activeJob.id);
        setActiveJob(updated);

        if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
          if (pollRef.current) window.clearInterval(pollRef.current);

          const [jobs, res] = await Promise.all([
            fetchRecentJobs(),
            fetchJobResults(updated.id),
          ]);
          setRecentJobs(jobs);
          if (updated.status === 'COMPLETED') setResults(res);
          setActiveJob(null);
        }
      } catch {
        // Polling error — will retry on next interval
      }
    }, 2000);

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [activeJob?.id, activeJob?.status]);

  const triggerScrape = useCallback(async () => {
    setError(null);
    try {
      const job = await startScraping();
      setActiveJob(job);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start scraping');
    }
  }, []);

  const isRunning =
    activeJob?.status === 'RUNNING' || activeJob?.status === 'PENDING';

  return { activeJob, recentJobs, results, loading, error, triggerScrape, isRunning };
}
