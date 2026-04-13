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

  // URL Ornamen (Sesuai Desain Role)
  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // 2. FUNGSI FETCH GABUNGAN
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

  // 3. VARIABEL PEMBANTU
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
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2A1B14]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Otoritas Sistem</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#2A1B14]">Manajemen Pengguna</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shrink-0"></span>
            Kelola akses dan data administrator mahakarya UpToYou.
          </p>
        </div>

        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-4">
          {/* Custom Search Bar */}
          <div className="relative w-full sm:w-72">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D9B35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-[#FFFDF5]/80 backdrop-blur-sm border border-[#D9B35A]/30 pl-11 pr-4 py-3.5 rounded-full text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#D9B35A] focus:border-[#D9B35A] transition-all shadow-[inset_0_2px_4px_rgba(42,27,20,0.02)] placeholder-[#8B7355]/60" 
            />
          </div>
          
          {canCreate && (
            <button 
              onClick={openAdd} 
              className="group relative bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] hover:shadow-[0_10px_25px_rgba(234,193,53,0.4)] text-[#2A1B14] px-8 py-3.5 rounded-full font-serif font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2.5 overflow-hidden border border-[#FFF6C5]/50 shadow-[0_5px_15px_rgba(234,193,53,0.3)] whitespace-nowrap"
            >
               <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
               <span className="relative z-10 flex items-center gap-2 tracking-wide font-sans">
                <span className="text-lg">✧</span> Tambah Pengguna
              </span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl flex items-start gap-3 font-sans shadow-sm">
          <svg className="w-5 h-5 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <h3 className="text-sm font-bold text-rose-800">Gagal Memuat Data</h3>
            <p className="text-sm text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* ================= MAIN DATA SECTION ================= */}
      <div className="relative w-full pb-10 pt-2">
        <div className="absolute -left-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none transform -scale-x-100" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}></div>
        <div className="absolute -right-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}></div>

        <div className="overflow-x-auto px-4 -mx-4">
          <table className="w-full min-w-[1000px] text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            <thead className="text-[#D9B35A] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr 
                 className="bg-[#2A1B14] shadow-[0_10px_20px_rgba(42,27,20,0.2)]"
                 style={{
                   backgroundImage: `linear-gradient(rgba(42, 27, 20, 0.95), rgba(42, 27, 20, 0.95)), url('${brownBatikUrl}')`,
                   backgroundSize: '250px',
                   backgroundRepeat: 'repeat'
                 }}
               >
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl border-y border-l border-[#D9B35A]/20">Nama Lengkap</th>
                 <th className="py-5 px-4 text-left border-y border-[#D9B35A]/20">Email</th>
                 <th className="py-5 px-4 text-center border-y border-[#D9B35A]/20">Hak Akses</th>
                 <th className="py-5 px-4 text-center border-y border-[#D9B35A]/20">Tgl Terdaftar</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl border-y border-r border-[#D9B35A]/20">Tindakan</th>
               </tr>
            </thead>

            <tbody className="relative">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="inline-block w-8 h-8 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[#8B7355] font-bold tracking-widest uppercase text-xs">Memuat Data...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center bg-white/40 backdrop-blur-md rounded-2xl border border-white/40">
                    <span className="text-[#8B7355] font-bold text-sm">Tidak ada pengguna yang cocok dengan pencarian.</span>
                  </td>
                </tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="group transition-all duration-300 hover:-translate-y-1.5">
                  <td className="py-5 pl-8 pr-4 bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(42,27,20,0.08)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow font-bold text-[#2A1B14]">
                    {a.name}
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 text-[#8B7355] font-medium">
                    {a.email}
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 text-center font-bold">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border ${
                      a.role === 'super_admin' 
                        ? "bg-purple-50 text-purple-600 border-purple-200" 
                        : a.role === 'admin'
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-[#F8F3E9] text-[#2A1B14] border-[#D9B35A]/30"
                    }`}>
                      {a.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 text-center font-bold text-[#8B7355] text-xs">
                    {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-5 pr-8 pl-4 bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 text-right">
                    <div className="flex justify-end gap-3">
                      {canEdit && (
                        <button 
                          onClick={() => openEdit(a)} 
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#2A1B14] bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#D9B35A] hover:bg-[#FFFDF5] hover:shadow-[0_5px_15px_rgba(217,179,90,0.2)] transition-all"
                        >
                          Ubah
                        </button>
                      )}
                      
                      {canDelete && a.role !== 'super_admin' && (
                        <button 
                          onClick={() => setDeleteTarget(a)} 
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-rose-300 hover:bg-rose-50 transition-all"
                        >
                          Hapus
                        </button>
                      )}

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
      </div>

      {/* ================= MODAL TAMBAH / EDIT ================= */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-[#2A1B14]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative">
            
            <div className="p-8 border-b border-[#D9B35A]/30 bg-[#2A1B14] text-[#D9B35A] shrink-0" style={{ backgroundImage: `linear-gradient(rgba(42, 27, 20, 0.92), rgba(42, 27, 20, 0.92)), url('${brownBatikUrl}')`, backgroundSize: '300px' }}>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-white">✧</span> {editTarget ? "Konfigurasi Pengguna" : "Daftarkan Pengguna Baru"}
              </h3>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-[#FFFDF5] font-sans">
              <div className="space-y-6">
                {formError && (
                  <div className="bg-rose-50 text-rose-600 text-sm p-4 rounded-2xl flex items-start gap-2 border border-rose-100 font-bold">
                    <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{formError}</span>
                  </div>
                )}
                
                <div className="bg-white p-6 rounded-3xl border border-[#D9B35A]/20 shadow-sm space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nama..." 
                      value={form.name} 
                      onChange={e => setForm({ ...form, name: e.target.value })} 
                      className="w-full bg-[#FFFDF5] border border-gray-200 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm font-bold text-[#2A1B14]" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-2">Alamat Email</label>
                    <input 
                      type="email" 
                      placeholder="email@contoh.com" 
                      value={form.email} 
                      onChange={e => setForm({ ...form, email: e.target.value })} 
                      className="w-full bg-[#FFFDF5] border border-gray-200 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm font-bold text-[#2A1B14]" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-2">Hak Akses (Role)</label>
                    <select 
                      value={form.role} 
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      disabled={editTarget?.role === 'super_admin'}
                      className="w-full bg-[#FFFDF5] border border-gray-200 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm font-bold text-[#2A1B14] disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="" disabled>Pilih peran pengguna...</option>
                      {availableRoles.map(role => (
                        <option key={role.id} value={role.name}>
                          {role.name.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                    {editTarget?.role === 'super_admin' && <p className="text-[10px] text-purple-600 font-bold mt-2 uppercase tracking-wide">Hak akses super admin tidak dapat diubah di sini.</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-2">Kata Sandi</label>
                    <input 
                      type="password" 
                      placeholder={editTarget ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'} 
                      value={form.password} 
                      onChange={e => setForm({ ...form, password: e.target.value })} 
                      className="w-full bg-[#FFFDF5] border border-gray-200 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm font-bold text-[#2A1B14]" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-white font-sans">
              <button onClick={() => setShowModal(false)} className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#8B7355] hover:bg-gray-50 rounded-full transition-colors">Batal</button>
              <button 
                onClick={handleSubmit} 
                disabled={submitting} 
                className="bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-[#2A1B14] px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#D9B35A]/30 hover:-translate-y-1 active:translate-y-0 transition-all border border-[#FFF6C5]/50 flex items-center gap-2"
              >
                {submitting && <div className="w-3.5 h-3.5 border-2 border-[#2A1B14]/30 border-t-[#2A1B14] rounded-full animate-spin"></div>}
                {submitting ? 'Menyimpan...' : 'Simpan Pengguna'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI HAPUS ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2A1B14]/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden text-center p-8 animate-fadeIn border border-[#D9B35A]/20">
            <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2A1B14] mb-3 font-serif">Hapus Pengguna?</h2>
            <p className="text-[#8B7355] text-sm mb-8 font-sans">
              Tindakan ini bersifat permanen. Pengguna <span className="font-bold text-[#2A1B14]">"{deleteTarget.name}"</span> akan dihapus dari mahakarya sistem.
            </p>
            <div className="flex flex-col gap-3 font-sans">
              <button 
                onClick={handleDelete} 
                className="w-full px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white bg-rose-600 hover:bg-rose-700 rounded-2xl shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-0.5"
              >
                Ya, Hapus Permanen
              </button>
              <button 
                onClick={() => setDeleteTarget(null)} 
                className="w-full px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-[#8B7355] bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}