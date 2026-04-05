import { useEffect, useState, FormEvent } from 'react';
import { getStudentsAPI, addStudentAPI, updateStudentAPI, deleteStudentAPI } from '../../services/api';
import { User } from '../../types';
import { ConfirmDialog, LoadingSpinner, Pagination, EmptyState } from '../../components/common';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPerson, MdClose } from 'react-icons/md';

const emptyForm = { name: '', email: '', password: '', phone: '', address: '', enrollmentNo: '', department: '', semester: '', batch: '' };

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
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

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudentsAPI({ search, page, limit: 10 });
      setStudents(res.data.students);
      setPages(res.data.pages);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [search, page]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setPhoto(null); setError(''); setShowModal(true); };
  const openEdit = (s: User) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, password: '', phone: s.phone || '', address: s.address || '', enrollmentNo: s.enrollmentNo || '', department: s.department || '', semester: String(s.semester || ''), batch: s.batch || '' });
    setPhoto(null); setError(''); setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (photo) fd.append('photo', photo);
      if (editing) await updateStudentAPI(editing._id, fd);
      else await addStudentAPI(fd);
      setShowModal(false); fetchStudents();
    } catch (err: any) { setError(err.response?.data?.message || 'Error saving student');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteStudentAPI(deleteTarget._id); setDeleteTarget(null); fetchStudents(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h2 className="text-2xl font-extrabold text-gray-800">Students</h2><p className="text-gray-500 text-sm">Manage student records</p></div>
        <button onClick={openAdd} className="btn-primary"><MdAdd className="text-lg" />Add Student</button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input className="input pl-10" placeholder="Search by name, email, enrollment..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : students.length === 0 ? <EmptyState title="No students found" subtitle="Add your first student to get started" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student', 'Enrollment No', 'Department', 'Semester', 'Batch', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        {s.photo ? <img src={s.photo} className="w-9 h-9 rounded-full object-cover" alt="" /> : <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center"><MdPerson className="text-primary-600" /></div>}
                        <div><p className="font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-400">{s.email}</p></div>
                      </div>
                    </td>
                    <td className="table-td">{s.enrollmentNo || '—'}</td>
                    <td className="table-td">{s.department || '—'}</td>
                    <td className="table-td">{s.semester || '—'}</td>
                    <td className="table-td">{s.batch || '—'}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><MdEdit /></button>
                        <button onClick={() => setDeleteTarget(s)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><MdDelete /></button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{editing ? 'Edit Student' : 'Add Student'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><MdClose /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required disabled={!!editing} /></div>
                <div><label className="label">{editing ? 'New Password (optional)' : 'Password *'}</label><input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editing} /></div>
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div><label className="label">Enrollment No</label><input className="input" value={form.enrollmentNo} onChange={e => setForm({...form, enrollmentNo: e.target.value})} /></div>
                <div><label className="label">Department</label><input className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} /></div>
                <div><label className="label">Semester</label><input type="number" min="1" max="8" className="input" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} /></div>
                <div><label className="label">Batch</label><input className="input" placeholder="e.g. 2021-2025" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} /></div>
                <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                <div className="sm:col-span-2">
                  <label className="label">Photo</label>
                  <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : editing ? 'Update' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && <ConfirmDialog message={`Delete student "${deleteTarget.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
    </div>
  );
}
