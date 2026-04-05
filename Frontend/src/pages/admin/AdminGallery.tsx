import { useEffect, useState, FormEvent } from 'react';
import { getGalleryAPI, uploadImageAPI, deleteImageAPI } from '../../services/api';
import { GalleryImage } from '../../types';
import { ConfirmDialog, LoadingSpinner, EmptyState } from '../../components/common';
import { MdAdd, MdDelete, MdClose, MdPhoto } from 'react-icons/md';

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<GalleryImage | null>(null);

  const fetch = async () => {
    setLoading(true);
    try { const res = await getGalleryAPI(); setImages(res.data.images); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); if (!file) return; setSaving(true);
    try {
      const fd = new FormData(); fd.append('title', title || 'Campus Image'); fd.append('image', file);
      await uploadImageAPI(fd); setShowModal(false); setTitle(''); setFile(null); fetch();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true);
    try { await deleteImageAPI(deleteTarget._id); setDeleteTarget(null); fetch(); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-extrabold text-gray-800">Campus Gallery</h2><p className="text-gray-500 text-sm">Manage campus photos</p></div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><MdAdd />Upload Image</button>
      </div>

      {loading ? <LoadingSpinner /> : images.length === 0 ? <div className="card"><EmptyState title="No images yet" subtitle="Upload campus photos to get started" /></div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 cursor-pointer shadow-sm hover:shadow-lg transition-all">
              <img src={img.image} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onClick={() => setPreview(img)} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full flex justify-between items-end">
                  <p className="text-white text-xs font-semibold truncate flex-1">{img.title}</p>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(img); }} className="p-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-white ml-2"><MdDelete className="text-sm" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b"><h3 className="text-xl font-bold">Upload Image</h3><button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><MdClose /></button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="label">Title</label><input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Campus image title" /></div>
              <div>
                <label className="label">Image *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
                  {file ? (
                    <div className="space-y-2">
                      <img src={URL.createObjectURL(file)} className="h-32 mx-auto rounded-xl object-cover" alt="" />
                      <p className="text-sm text-gray-500">{file.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <MdPhoto className="text-4xl text-gray-300 mx-auto" />
                      <p className="text-sm text-gray-500">Click to upload</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" style={{position:'relative'}} required />
                  <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700" required />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving || !file} className="btn-primary flex-1 justify-center">{saving ? 'Uploading...' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreview(null)}>
          <div className="max-w-3xl w-full">
            <img src={preview.image} alt={preview.title} className="w-full rounded-2xl max-h-[80vh] object-contain" />
            <p className="text-white text-center mt-3 font-semibold">{preview.title}</p>
          </div>
        </div>
      )}

      {deleteTarget && <ConfirmDialog message={`Delete image "${deleteTarget.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
    </div>
  );
}
