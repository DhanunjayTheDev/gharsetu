import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

// Badge
interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
  dot?: boolean;
}

const badgeVariants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-blue-50 text-blue-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  secondary: 'bg-gray-100 text-gray-600',
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  responded: 'bg-blue-50 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
  negotiating: 'bg-amber-50 text-amber-700',
  expired: 'bg-red-50 text-red-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  in_progress: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className, dot }) => (
  <span className={cn(
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold',
    badgeVariants[variant] || badgeVariants.default,
    className
  )}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />}
    {children}
  </span>
);

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover }) => (
  <div
    className={cn(hover ? 'card-hover' : 'card', className)}
    onClick={onClick}
  >
    {children}
  </div>
);

// Avatar
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const avatarSizes: Record<string, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
];

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md' }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % avatarColors.length;

  return src ? (
    <img src={src} alt={name} className={cn('rounded-full object-cover ring-2 ring-white', avatarSizes[size] || avatarSizes.md)} />
  ) : (
    <div className={cn('rounded-full flex items-center justify-center font-semibold ring-2 ring-white', avatarSizes[size] || avatarSizes.md, avatarColors[colorIndex])}>
      {initials}
    </div>
  );
};

// Loading Spinner
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={cn('animate-spin text-gray-400', sizes[size])} />;
};

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      {icon || <Inbox className="w-8 h-8 text-gray-400" />}
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-500 mb-5 max-w-sm">{description}</p>}
    {action}
  </div>
);

// Stat Card
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
  trend?: { value: number; isPositive: boolean };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
  const colorMap: Record<string, { bg: string; iconColor: string; accent: string }> = {
    blue: { bg: 'bg-blue-50', iconColor: 'text-blue-600', accent: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-50', iconColor: 'text-emerald-600', accent: 'bg-emerald-500' },
    violet: { bg: 'bg-violet-50', iconColor: 'text-violet-600', accent: 'bg-violet-500' },
    amber: { bg: 'bg-amber-50', iconColor: 'text-amber-600', accent: 'bg-amber-500' },
    rose: { bg: 'bg-rose-50', iconColor: 'text-rose-600', accent: 'bg-rose-500' },
    cyan: { bg: 'bg-cyan-50', iconColor: 'text-cyan-600', accent: 'bg-cyan-500' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="card relative overflow-hidden">
      <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8', c.accent, 'opacity-[0.07]')} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{value}</p>
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trend.isPositive ? 'text-emerald-600' : 'text-red-500')}>
              <span className={cn('inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px]', trend.isPositive ? 'bg-emerald-100' : 'bg-red-100')}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {trend.value}%
            </div>
          )}
        </div>
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', c.bg, c.iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Pagination
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-gray-500">
        Page <span className="font-medium text-gray-900">{page}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-medium transition-all',
              p === page ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// DataTable
interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({ columns, data, keyExtractor, onRowClick, emptyTitle, emptyDescription }: DataTableProps<T>) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle || 'No data'} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/80">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/80">
            {columns.map(col => (
              <th key={col.key} className={cn('text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3.5', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map(item => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn('bg-white hover:bg-gray-50/80 transition-colors', onRowClick && 'cursor-pointer')}
            >
              {columns.map(col => (
                <td key={col.key} className={cn('px-5 py-4 text-sm', col.className)}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Tabs
interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (key: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ items, active, onChange }) => (
  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit">
    {items.map(item => (
      <button
        key={item.key}
        onClick={() => onChange(item.key)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          active === item.key
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
      >
        {item.label}
        {item.count !== undefined && (
          <span className={cn('ml-1.5 text-xs', active === item.key ? 'text-gray-500' : 'text-gray-400')}>
            {item.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

// PageHeader
interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
    </div>
    {action}
  </div>
);
