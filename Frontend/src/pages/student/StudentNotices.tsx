import { useEffect, useState } from 'react';
import { getNoticesAPI } from '../../services/api';
import { Notice } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { MdAnnouncement, MdPerson, MdSearch } from 'react-icons/md';

export default function StudentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filtered, setFiltered] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getNoticesAPI().then(r => { setNotices(r.data.notices); setFiltered(r.data.notices); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(notices); return; }
    setFiltered(notices.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase())));
  }, [search, notices]);

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">Notices</h2><p className="text-gray-500 text-sm">Campus announcements and updates</p></div>

      <div className="relative max-w-sm">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input className="input pl-10" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <div className="card"><EmptyState title="No notices found" /></div> : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <div key={n._id} className="card hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.role === 'admin' ? 'bg-primary-100' : 'bg-emerald-100'}`}>
                  <MdAnnouncement className={n.role === 'admin' ? 'text-primary-600' : 'text-emerald-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-bold text-gray-800">{n.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'}`}>{n.role === 'admin' ? 'Admin' : 'Faculty'}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{n.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      {n.postedBy?.photo ? <img src={n.postedBy.photo} className="w-4 h-4 rounded-full" alt="" /> : <MdPerson />}
                      <span>{n.postedBy?.name}</span>
                    </div>
                    <span>•</span>
                    <span>{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {n.image && <img src={n.image} alt="" className="mt-3 rounded-xl max-h-48 w-full object-cover" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
