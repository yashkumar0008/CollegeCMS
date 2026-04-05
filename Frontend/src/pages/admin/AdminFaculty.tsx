import { useEffect, useState, FormEvent } from 'react';
import { getFacultyAPI, addFacultyAPI, updateFacultyAPI, deleteFacultyAPI } from '../../services/api';
import { User } from '../../types';
import { ConfirmDialog, LoadingSpinner, Pagination, EmptyState } from '../../components/common';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPerson, MdClose } from 'react-icons/md';

const emptyForm = { name: '', email: '', password: '', phone: '', address: '', department: '', designation: '', qualification: '', experience: '' };

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await getFacultyAPI({ search, page, limit: 10 });
      setFaculty(res.data.faculty); setPages(res.data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchFaculty(); }, [search, page]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPhoto(null); setError(''); setShowModal(true); };
  const openEdit = (f: User) => {
    setEditing(f);
    setForm({ name: f.name, email: f.email, password: '', phone: f.phone || '', address: f.address || '', department: f.department || '', designation: f.designation || '', qualification: f.qualification || '', experience: f.experience || '' });
    setPhoto(null); setError(''); setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (photo) fd.append('photo', photo);
      if (editing) await updateFacultyAPI(editing._id, fd);
      else await addFacultyAPI(fd);
      setShowModal(false); fetchFaculty();
    } catch (err: any) { setError(err.response?.data?.message || 'Error saving faculty');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteFacultyAPI(deleteTarget._id); setDeleteTarget(null); fetchFaculty(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-extrabold text-gray-800">Faculty</h2><p className="text-gray-500 text-sm">Manage faculty members</p></div>
        <button onClick={openAdd} className="btn-primary"><MdAdd />Add Faculty</button>
      </div>

      <div className="card">
        <div className="relative max-w-sm mb-5">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input className="input pl-10" placeholder="Search faculty..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {loading ? <LoadingSpinner /> : faculty.length === 0 ? <EmptyState title="No faculty found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Faculty', 'Department', 'Designation', 'Qualification', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {faculty.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        {f.photo ? <img src={f.photo} className="w-9 h-9 rounded-full object-cover" alt="" /> : <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center"><MdPerson className="text-emerald-600" /></div>}
                        <div><p className="font-semibold text-gray-800">{f.name}</p><p className="text-xs text-gray-400">{f.email}</p></div>
                      </div>
                    </td>
                    <td className="table-td">{f.department || '—'}</td>
                    <td className="table-td">{f.designation || '—'}</td>
                    <td className="table-td">{f.qualification || '—'}</td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(f)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><MdEdit /></button>
                        <button onClick={() => setDeleteTarget(f)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><MdDelete /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editing ? 'Edit Faculty' : 'Add Faculty'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><MdClose /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={!!editing} /></div>
                <div><label className="label">{editing ? 'New Password' : 'Password *'}</label><input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} /></div>
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="label">Department</label><input className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
                <div><label className="label">Designation</label><input className="input" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} /></div>
                <div><label className="label">Qualification</label><input className="input" value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} /></div>
                <div><label className="label">Experience</label><input className="input" placeholder="e.g. 5 years" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} /></div>
                <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                <div className="sm:col-span-2">
                  <label className="label">Photo</label>
                  <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : editing ? 'Update' : 'Add Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && <ConfirmDialog message={`Delete faculty "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
    </div>
  );
}
