import { useEffect, useState, FormEvent } from 'react';
import { getCoursesAPI, createCourseAPI, updateCourseAPI, deleteCourseAPI, getFacultyAPI } from '../../services/api';
import { Course, User } from '../../types';
import { ConfirmDialog, LoadingSpinner, EmptyState } from '../../components/common';
import { MdAdd, MdEdit, MdDelete, MdClose, MdPerson, MdMenuBook } from 'react-icons/md';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ name: '', code: '', description: '', department: '', semester: '', credits: '', facultyId: '' });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, fRes] = await Promise.all([getCoursesAPI(), getFacultyAPI({ limit: 100 })]);
      setCourses(cRes.data.courses); setFaculty(fRes.data.faculty);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', code: '', description: '', department: '', semester: '', credits: '', facultyId: '' });
    setError(''); setShowModal(true);
  };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({ name: c.name, code: c.code, description: c.description || '', department: c.department, semester: String(c.semester), credits: String(c.credits), facultyId: (c.faculty as User)?._id || '' });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (editing) await updateCourseAPI(editing._id, form);
      else await createCourseAPI(form);
      setShowModal(false); fetchData();
    } catch (err: any) { setError(err.response?.data?.message || 'Error saving course');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteCourseAPI(deleteTarget._id); setDeleteTarget(null); fetchData(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-gray-800">Courses</h2><p className="text-gray-500 text-sm">Manage academic courses</p></div>
        <button onClick={openAdd} className="btn-primary"><MdAdd />Add Course</button>
      </div>

      {loading ? <LoadingSpinner /> : courses.length === 0 ? <div className="card"><EmptyState title="No courses yet" subtitle="Create your first course" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="card hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center"><MdMenuBook className="text-violet-600" /></div>
                  <div>
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{c.code}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg"><MdEdit className="text-sm" /></button>
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><MdDelete className="text-sm" /></button>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500"><span>Department</span><span className="font-medium text-gray-700">{c.department}</span></div>
                <div className="flex justify-between text-gray-500"><span>Semester</span><span className="font-medium text-gray-700">{c.semester}</span></div>
                <div className="flex justify-between text-gray-500"><span>Credits</span><span className="font-medium text-gray-700">{c.credits}</span></div>
                <div className="flex justify-between text-gray-500"><span>Students</span><span className="font-medium text-gray-700">{c.students?.length || 0}</span></div>
                <div className="flex justify-between text-gray-500 items-center"><span>Faculty</span>
                  {c.faculty ? (
                    <div className="flex items-center gap-1.5">
                      {(c.faculty as User).photo ? <img src={(c.faculty as User).photo} className="w-5 h-5 rounded-full object-cover" alt="" /> : <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"><MdPerson className="text-emerald-600 text-xs" /></div>}
                      <span className="font-medium text-gray-700 text-xs">{(c.faculty as User).name}</span>
                    </div>
                  ) : <span className="text-orange-500 text-xs font-medium">Unassigned</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-xl font-bold">{editing ? 'Edit Course' : 'Add Course'}</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><MdClose /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="label">Course Name *</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div><label className="label">Course Code *</label><input className="input uppercase" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required disabled={!!editing} /></div>
                <div><label className="label">Credits *</label><input type="number" className="input" value={form.credits} onChange={e => setForm({...form, credits: e.target.value})} required /></div>
                <div><label className="label">Department *</label><input className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required /></div>
                <div><label className="label">Semester *</label><input type="number" min="1" max="8" className="input" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} required /></div>
                <div className="col-span-2"><label className="label">Assign Faculty</label>
                  <select className="input" value={form.facultyId} onChange={e => setForm({...form, facultyId: e.target.value})}>
                    <option value="">-- Unassigned --</option>
                    {faculty.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="label">Description</label><textarea rows={3} className="input resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : editing ? 'Update' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && <ConfirmDialog message={`Delete course "${deleteTarget.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
    </div>
  );
}
