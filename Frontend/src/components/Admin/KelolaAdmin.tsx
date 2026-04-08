"use client";
import React, { useState, useEffect } from 'react';

interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: string;
}

const BASE_URL = "http://127.0.0.1:8000";

export default function KelolaAdmin() {
  const [search, setSearch] = useState('');
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 👇 1. STATE BARU: Untuk menyimpan status akses orang yang sedang login
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Modal tambah/edit
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Admin | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' }); 
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Konfirmasi hapus
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

  // 👇 2. FUNGSI FETCH GABUNGAN: Ambil data User (izin), Tabel Admin, dan Dropdown Roles
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // A. Ambil data aku (User yang login)
      const userRes = await fetch(`${BASE_URL}/user`, { credentials: 'include', headers: { Accept: 'application/json' } });
      if (userRes.ok) {
        const userData = await userRes.json();
        setIsSuperAdmin(userData.roles?.includes('super_admin') || false);
        setMyPermissions(userData.permissions || []);
      }

      // B. Ambil data pengguna untuk tabel
      const adminRes = await fetch(`${BASE_URL}/admins`, { credentials: 'include', headers: { Accept: 'application/json' } });
      if (adminRes.ok) setAdmins(await adminRes.json());
      else throw new Error('Gagal mengambil data pengguna');

      // C. Ambil data role untuk dropdown form
      const roleRes = await fetch(`${BASE_URL}/roles`, { credentials: 'include', headers: { Accept: 'application/json' } });
      if (roleRes.ok) setAvailableRoles(await roleRes.json());

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchInitialData(); 
  }, []);

  // 👇 3. VARIABEL PEMBANTU: Cek apakah user boleh melihat tombol
  const canCreate = isSuperAdmin || myPermissions.includes('create_users');
  const canEdit = isSuperAdmin || myPermissions.includes('edit_users');
  const canDelete = isSuperAdmin || myPermissions.includes('delete_users');

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', email: '', password: '', role: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (admin: Admin) => {
    setEditTarget(admin);
    setForm({ name: admin.name, email: admin.email, password: '', role: admin.role });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.role) { setFormError('Nama, email, dan role wajib diisi'); return; }
    if (!editTarget && !form.password) { setFormError('Password wajib diisi'); return; }
    setSubmitting(true);
    setFormError('');
    
    try {
      const body: any = { name: form.name, email: form.email, role: form.role };
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
      
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Terjadi kesalahan saat menyimpan'); }
      setShowModal(false);
      
      // Ambil ulang data tabel setelah berhasil simpan
      fetchInitialData();
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${BASE_URL}/admins/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Gagal menghapus pengguna'); }
      setDeleteTarget(null);
      
      // Ambil ulang data tabel setelah berhasil hapus
      fetchInitialData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold text-slate-800">Kelola Pengguna</h1>
        <div className="flex gap-3">
          <input type="text" placeholder="Cari nama atau role..." value={search} onChange={e => setSearch(e.target.value)} className="bg-white/60 backdrop-blur-md border border-white px-6 py-3 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72 text-sm" />
          
          {/* 👇 4. TOMBOL TAMBAH HANYA MUNCUL JIKA PUNYA IZIN 👇 */}
          {canCreate && (
            <button onClick={openAdd} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm transition">+ Tambah Pengguna</button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-500 px-6 py-3 rounded-2xl text-sm">{error}</div>}

      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 p-8">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-slate-400 border-b border-white/50">
            <tr>
              <th className="pb-4">Nama</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Role</th> 
              <th className="pb-4">Tanggal Dibuat</th>
              <th className="pb-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center text-slate-400">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-slate-400">Tidak ada pengguna ditemukan</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id} className="hover:bg-white/40 transition">
                <td className="py-4 font-bold text-slate-800">{a.name}</td>
                <td className="py-4">{a.email}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    a.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 
                    a.role === 'admin' ? 'bg-red-100 text-red-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {a.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-4">{new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                <td className="py-4 text-center">
                  <div className="flex justify-center gap-2">
                    
                    {/* 👇 5. TOMBOL EDIT & HAPUS HANYA MUNCUL JIKA PUNYA IZIN 👇 */}
                    {canEdit && (
                      <button onClick={() => openEdit(a)} className="bg-white shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-blue-500 hover:shadow-md transition">Edit</button>
                    )}
                    
                    {/* Proteksi di UI: Jangan tampilkan tombol hapus untuk Super Admin */}
                    {canDelete && a.role !== 'super_admin' && (
                      <button onClick={() => setDeleteTarget(a)} className="bg-white shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:shadow-md transition">Hapus</button>
                    )}

                    {/* Fallback Jika Hanya Bisa Melihat */}
                    {!canEdit && !canDelete && (
                      <span className="text-slate-400 italic text-xs">Hanya Lihat</span>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white p-8 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold text-slate-800">{editTarget ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
            
            {formError && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{formError}</p>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 ml-1 mb-1">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/60 border border-slate-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 ml-1 mb-1">Alamat Email</label>
                <input type="email" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-white/60 border border-slate-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 ml-1 mb-1">Jabatan (Role)</label>
                <select 
                  value={form.role} 
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  disabled={editTarget?.role === 'super_admin'}
                  className="w-full bg-white/60 border border-slate-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm appearance-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                >
                  <option value="" disabled>Pilih Hak Akses...</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 ml-1 mb-1">Kata Sandi</label>
                <input type="password" placeholder={editTarget ? 'Biarkan kosong jika tidak ingin diubah' : 'Minimal 6 karakter'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full bg-white/60 border border-slate-200 px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 transition-colors">Batal</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50">
                {submitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white p-8 w-full max-w-sm space-y-5 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Hapus Akun?</h2>
            <p className="text-sm text-slate-500">Anda yakin ingin menghapus permanen akun <span className="font-bold text-slate-700">{deleteTarget.name}</span>?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 transition-colors">Batal</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-md shadow-red-500/20 transition-all">Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}