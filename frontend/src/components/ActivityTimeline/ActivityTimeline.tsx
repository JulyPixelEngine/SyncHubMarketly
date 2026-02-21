import { type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimelineActivity {
  id: string;
  time: string;
  /** Plain activity text */
  text: string;
  /** Optional portion of `text` to render in bold */
  boldText?: string;
  /** Optional inline link appended after text */
  link?: { label: string; href: string };
  /** Number of filled stars (1-5). When set, a star rating is shown before text */
  rating?: number;
  /** Tailwind bg-* class for the dot, e.g. 'bg-violet-500' */
  dotColor: string;
}

interface ActivityTimelineProps {
  title?: string;
  subtitle?: string;
  activities: TimelineActivity[];
  /** Max items to show (default: all) */
  maxItems?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5 mr-1 text-amber-400 text-sm leading-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function ActivityContent({ activity }: { activity: TimelineActivity }) {
  const { text, boldText, link, rating } = activity;

  const renderText = (): ReactNode => {
    if (!boldText) return text;
    const [before, after] = text.split(boldText);
    return (
      <>
        {before}
        <strong className="font-semibold text-gray-800">{boldText}</strong>
        {after}
      </>
    );
  };

  return (
    <p className="text-sm text-gray-600 leading-snug">
      {rating !== undefined && <StarRating rating={rating} />}
      {renderText()}
      {link && (
        <>
          {' '}
          <a
            href={link.href}
            className="text-indigo-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        </>
      )}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ActivityTimeline({
  title = 'Recent Activities',
  subtitle = 'last 2 weeks',
  activities,
  maxItems,
}: ActivityTimelineProps) {
  const visible = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base leading-tight">{title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Timeline */}
      <ol className="space-y-0">
        {visible.map((activity, idx) => (
          <li key={activity.id} className="flex gap-4">
            {/* Time */}
            <span className="w-16 flex-shrink-0 text-right text-xs text-gray-400 pt-0.5 leading-tight">
              {activity.time}
            </span>

            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ring-2 ring-white ${activity.dotColor}`}
              />
              {idx < visible.length - 1 && (
                <span className="w-px flex-1 bg-gray-100 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="pb-4 flex-1 min-w-0">
              <ActivityContent activity={activity} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
