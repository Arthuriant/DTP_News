"use client";
import React, { useState, useEffect } from 'react';

interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const BASE_URL = "http://127.0.0.1:8000";

export default function KelolaAdmin() {
  const [search, setSearch] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal tambah/edit
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Admin | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admins`, {
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setAdmins(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', email: '', password: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (admin: Admin) => {
    setEditTarget(admin);
    setForm({ name: admin.name, email: admin.email, password: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setFormError('Nama dan email wajib diisi'); return; }
    if (!editTarget && !form.password) { setFormError('Password wajib diisi'); return; }
    setSubmitting(true);
    setFormError('');
    try {
      const body: any = { name: form.name, email: form.email };
      if (form.password) body.password = form.password;
      const res = await fetch(
        editTarget ? `${BASE_URL}/admins/${editTarget.id}` : `${BASE_URL}/admins`,
        {
          method: editTarget ? 'PUT' : 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Terjadi kesalahan'); }
      setShowModal(false);
      fetchAdmins();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${BASE_URL}/admins/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Gagal menghapus admin');
      setDeleteTarget(null);
      fetchAdmins();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-slate-800">Kelola Admin</h1>
        <div className="flex gap-3">
          <input type="text" placeholder="Cari nama..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72" />
          <button onClick={openAdd} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-sm transition">+ Tambah Admin</button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-500 px-6 py-3 rounded-2xl text-sm">{error}</div>}

      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 p-8">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-slate-400 border-b border-white/50">
            <tr>
              <th className="pb-4">Nama</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Tanggal Dibuat</th>
              <th className="pb-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-slate-400">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-slate-400">Tidak ada admin ditemukan</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="hover:bg-white/40 transition">
                <td className="py-4 font-bold text-slate-800">{a.name}</td>
                <td className="py-4">{a.email}</td>
                <td className="py-4">{new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                <td className="py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEdit(a)} className="bg-white shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-blue-500 hover:shadow-md transition">Edit</button>
                    <button onClick={() => setDeleteTarget(a)} className="bg-white shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:shadow-md transition">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold text-slate-800">{editTarget ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>
            {formError && <p className="text-red-400 text-sm bg-red-50 px-4 py-2 rounded-xl">{formError}</p>}
            <div className="space-y-3">
              <input type="text" placeholder="Nama" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/60 border border-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-white/60 border border-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
              <input type="password" placeholder={editTarget ? 'Password baru (kosongkan jika tidak diubah)' : 'Password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-white/60 border border-white px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-white shadow-sm px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:shadow-md transition">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-sm transition disabled:opacity-50">{submitting ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white p-8 w-full max-w-sm space-y-5 text-center">
            <h2 className="text-xl font-bold text-slate-800">Hapus Admin?</h2>
            <p className="text-sm text-slate-500">Akun <span className="font-bold text-slate-700">{deleteTarget.name}</span> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-white shadow-sm px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:shadow-md transition">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-400 hover:bg-red-500 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-sm transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}