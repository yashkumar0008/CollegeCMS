import { useEffect, useState, FormEvent } from 'react';
import { getMyNoticesAPI, createNoticeAPI, deleteNoticeAPI } from '../../services/api';
import { Notice } from '../../types';
import { ConfirmDialog, LoadingSpinner, EmptyState } from '../../components/common';
import { MdAdd, MdDelete, MdAnnouncement, MdClose } from 'react-icons/md';

export default function FacultyNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    setLoading(true);
    try { const res = await getMyNoticesAPI(); setNotices(res.data.notices); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title); fd.append('description', form.description);
      if (image) fd.append('image', image);
      await createNoticeAPI(fd);
      setShowModal(false); setForm({ title: '', description: '' }); setImage(null); fetch();
    } catch (err: any) { setError(err.response?.data?.message || 'Error posting notice');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteNoticeAPI(deleteTarget._id); setDeleteTarget(null); fetch(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-gray-800">My Notices</h2><p className="text-gray-500 text-sm">Post and manage your announcements</p></div>
        <button onClick={() => { setError(''); setShowModal(true); }} className="btn-primary"><MdAdd />Post Notice</button>
      </div>

      {loading ? <LoadingSpinner /> : notices.length === 0 ? <div className="card"><EmptyState title="You haven't posted any notices yet" subtitle="Click Post Notice to create one" /></div> : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n._id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><MdAnnouncement className="text-emerald-600" /></div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{n.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 leading-relaxed">{n.description}</p>
                    <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    {n.image && <img src={n.image} alt="" className="mt-3 rounded-xl h-32 object-cover w-full" />}
                  </div>
                </div>
                <button onClick={() => setDeleteTarget(n)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"><MdDelete /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-xl font-bold">Post Notice</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><MdClose /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><label className="label">Description *</label><textarea rows={4} className="input resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /></div>
              <div><label className="label">Image (optional)</label><input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700" /></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Posting...' : 'Post Notice'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && <ConfirmDialog message={`Delete notice "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
    </div>
  );
}
