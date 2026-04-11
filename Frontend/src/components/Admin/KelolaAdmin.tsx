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

  // 1. STATE: Untuk menyimpan status akses orang yang sedang login
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

  // 2. FUNGSI FETCH GABUNGAN: Ambil data User (izin), Tabel Admin, dan Dropdown Roles
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

  // 3. VARIABEL PEMBANTU: Cek apakah user boleh melihat tombol
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
    <div className="space-y-6 max-w-7xl mx-auto text-slate-800 font-sans p-4 sm:p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Pengguna Sistem</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola akses dan data administrator.</p>
        </div>
        
        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
            />
          </div>
          
          {/* 4. TOMBOL TAMBAH HANYA MUNCUL JIKA PUNYA IZIN */}
          {canCreate && (
            <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-colors w-full sm:w-auto whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah Pengguna
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="text-sm font-bold text-red-800">Gagal Memuat Data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Hak Akses</th> 
                <th className="px-6 py-4">Tgl Terdaftar</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-medium">Memuat pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500 bg-slate-50/50">
                    Tidak ada pengguna yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{a.name}</td>
                  <td className="px-6 py-4 text-slate-500">{a.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      a.role === 'super_admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                      a.role === 'admin' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {a.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* 5. TOMBOL EDIT & HAPUS HANYA MUNCUL JIKA PUNYA IZIN */}
                      {canEdit && (
                        <button onClick={() => openEdit(a)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                          Edit
                        </button>
                      )}
                      
                      {/* Proteksi di UI: Jangan tampilkan tombol hapus untuk Super Admin */}
                      {canDelete && a.role !== 'super_admin' && (
                        <button onClick={() => setDeleteTarget(a)} className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                          Hapus
                        </button>
                      )}

                      {/* Fallback Jika Hanya Bisa Melihat */}
                      {!canEdit && !canDelete && (
                        <span className="text-slate-400 text-sm">Lihat Saja</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH / EDIT */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">{editTarget ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{formError}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
                <input type="email" placeholder="email@contoh.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hak Akses (Role)</label>
                <select 
                  value={form.role} 
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  disabled={editTarget?.role === 'super_admin'}
                  className="w-full border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-slate-100 disabled:text-slate-500 transition-shadow"
                >
                  <option value="" disabled>Pilih peran pengguna...</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
                {editTarget?.role === 'super_admin' && <p className="text-xs text-slate-500 mt-1">Hak akses super admin tidak dapat diubah di sini.</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                <input type="password" placeholder={editTarget ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                {submitting && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {submitting ? 'Menyimpan...' : 'Simpan Pengguna'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6 animate-fadeIn">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Hapus Pengguna?</h2>
            <p className="text-slate-500 text-sm mb-6">
              Tindakan ini tidak dapat dibatalkan. Pengguna <span className="font-semibold text-slate-800">"{deleteTarget.name}"</span> akan dihapus dari sistem secara permanen.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button onClick={() => setDeleteTarget(null)} className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleDelete} className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors">
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}