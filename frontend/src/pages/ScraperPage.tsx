import { useScraper } from '../features/scraper/hooks/useScraper';
import type { ScrapeJobResponse, ScrapedProductResponse } from '../features/scraper/types';

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
  RUNNING: { label: 'Running', color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700' },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, color: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {status === 'RUNNING' && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ProductTable({ products }: { products: ScrapedProductResponse[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b">
          <th className="py-2 pr-3 w-10">#</th>
          <th className="py-2 pr-3">Product</th>
          <th className="py-2 pr-3">Price</th>
          <th className="py-2">Source</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b last:border-0">
            <td className="py-2 pr-3 text-gray-400 font-medium">{p.rank}</td>
            <td className="py-2 pr-3">
              {p.productUrl ? (
                <a
                  href={p.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {p.productName}
                </a>
              ) : (
                p.productName
              )}
            </td>
            <td className="py-2 pr-3 text-gray-600">{p.price ?? '-'}</td>
            <td className="py-2 text-gray-400 text-xs">{p.sourceSite ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function JobHistoryTable({ jobs }: { jobs: ScrapeJobResponse[] }) {
  if (jobs.length === 0) return null;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b">
          <th className="py-2 pr-3">ID</th>
          <th className="py-2 pr-3">Status</th>
          <th className="py-2 pr-3">Categories</th>
          <th className="py-2 pr-3">Started</th>
          <th className="py-2">Completed</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-b last:border-0">
            <td className="py-2 pr-3 text-gray-400">#{job.id}</td>
            <td className="py-2 pr-3"><StatusBadge status={job.status} /></td>
            <td className="py-2 pr-3">{job.scrapedCount}/{job.totalCategories}</td>
            <td className="py-2 pr-3 text-gray-500 text-xs">
              {job.startedAt ? new Date(job.startedAt).toLocaleString() : '-'}
            </td>
            <td className="py-2 text-gray-500 text-xs">
              {job.completedAt ? new Date(job.completedAt).toLocaleString() : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ScraperPage() {
  const { activeJob, recentJobs, results, loading, error, triggerScrape, isRunning } = useScraper();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Web Scraper</h2>

      {/* Control Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manual Trigger</h3>
            <p className="text-sm text-gray-500 mt-1">
              Collect Top 5 products per category from public ranking pages.
            </p>
          </div>
          <button
            onClick={triggerScrape}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? 'Scraping...' : 'Start Scraping'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {activeJob && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Job #{activeJob.id} <StatusBadge status={activeJob.status} />
              </span>
              <span className="text-gray-500">
                {activeJob.scrapedCount}/{activeJob.totalCategories} categories
              </span>
            </div>
            <ProgressBar current={activeJob.scrapedCount} total={activeJob.totalCategories} />
          </div>
        )}
      </div>

      {/* Results Grid */}
      {results && Object.keys(results.productsByCategory).length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Latest Results
            {results.job && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Job #{results.job.id} — {results.job.completedAt ? new Date(results.job.completedAt).toLocaleString() : ''})
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(results.productsByCategory).map(([category, products]) => (
              <div key={category} className="bg-white rounded-xl border border-gray-200 p-5">
                <h4 className="font-semibold text-gray-800 mb-3">{category}</h4>
                <ProductTable products={products} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Job History */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job History</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          {recentJobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No scraping jobs yet.</p>
          ) : (
            <JobHistoryTable jobs={recentJobs} />
          )}
        </div>
      </section>
    </div>
  );
}
