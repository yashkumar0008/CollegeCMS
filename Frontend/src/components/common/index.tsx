// ConfirmDialog
import { MdWarning } from 'react-icons/md';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><MdWarning className="text-red-600 text-xl" /></div>
          <h3 className="text-lg font-bold text-gray-800">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 btn-secondary justify-center">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 btn-danger justify-center">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

interface PaginationProps { page: number; pages: number; onPageChange: (p: number) => void; }
export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-all">Prev</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{p}</button>
      ))}
      <button disabled={page === pages} onClick={() => onPageChange(page + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-all">Next</button>
    </div>
  );
}

interface StatCardProps { label: string; value: number | string; icon: React.ElementType; color: string; bg: string; }
export function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon className={`text-2xl ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

interface EmptyStateProps { title: string; subtitle?: string; }
export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">📭</span>
      </div>
      <p className="text-gray-600 font-semibold">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
