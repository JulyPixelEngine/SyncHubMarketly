import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant =
  | 'new'
  | 'update'
  | 'test'
  | 'report'
  | 'print'
  | 'control'
  | 'meeting';

export interface Issue {
  id: string;
  title: string;
  completed: boolean;
  badge: { label: string; variant: BadgeVariant };
  dueIn: string;
}

interface IssueListProps {
  title: string;
  owner: string;
  issues: Issue[];
  onAdd?: () => void;
  /** Allow toggling completion state in the UI */
  interactive?: boolean;
}

// ─── Badge config ─────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<BadgeVariant, string> = {
  new: 'bg-emerald-100 text-emerald-700',
  update: 'bg-indigo-100 text-indigo-700',
  test: 'bg-amber-100 text-amber-700',
  report: 'bg-violet-100 text-violet-700',
  print: 'bg-orange-100 text-orange-700',
  control: 'bg-gray-100 text-gray-600',
  meeting: 'bg-pink-100 text-pink-700',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function IssueBadge({ label, variant }: { label: string; variant: BadgeVariant }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${BADGE_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function IssueList({
  title,
  owner,
  issues: initialIssues,
  onAdd,
  interactive = true,
}: IssueListProps) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);

  const completedCount = issues.filter((i) => i.completed).length;
  const total = issues.length;
  const progressPct = total > 0 ? (completedCount / total) * 100 : 0;

  const toggleComplete = (id: string) => {
    if (!interactive) return;
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, completed: !issue.completed } : issue,
      ),
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{title}</h3>
            <p className="text-xs text-gray-400">{owner}</p>
          </div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-semibold hover:bg-violet-100 transition-colors"
        >
          <AddIcon />
          New
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 mb-5">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>{completedCount} of {total} completed</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Issue list */}
      <ul className="flex-1 space-y-1 overflow-y-auto">
        {issues.map((issue) => (
          <li
            key={issue.id}
            className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleComplete(issue.id)}
              aria-label={issue.completed ? 'Mark incomplete' : 'Mark complete'}
              className={`flex-shrink-0 w-4.5 h-4.5 w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-colors ${
                issue.completed
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 hover:border-violet-400 bg-white'
              }`}
            >
              {issue.completed && <CheckIcon />}
            </button>

            {/* Title */}
            <span
              className={`flex-1 text-sm min-w-0 truncate transition-colors ${
                issue.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {issue.title}
            </span>

            {/* Due */}
            <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
              {issue.dueIn}
            </span>

            {/* Badge */}
            <div className="flex-shrink-0">
              <IssueBadge label={issue.badge.label} variant={issue.badge.variant} />
            </div>

            {/* More menu */}
            <button
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-gray-200"
              aria-label="More options"
            >
              <MoreIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
