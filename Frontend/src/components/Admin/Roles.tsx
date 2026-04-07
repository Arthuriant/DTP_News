'use client';

import React, { useState, useEffect } from 'react';

// Daftar semua hak akses yang tersedia di sistem (Sama seperti sebelumnya)
const AVAILABLE_PERMISSIONS = [
  {
    module: 'Manajemen Produk',
    actions: [
      { id: 'view_products', label: 'Lihat Produk' },
      { id: 'create_products', label: 'Tambah Produk' },
      { id: 'edit_products', label: 'Ubah Produk' },
      { id: 'delete_products', label: 'Hapus Produk' },
    ]
  },
  {
    module: 'Pesanan Custom',
    actions: [
      { id: 'view_orders', label: 'Lihat Pesanan' },
      { id: 'update_orders', label: 'Update Status' },
      { id: 'delete_orders', label: 'Hapus Pesanan' },
    ]
  },
  {
    module: 'Data Customer',
    actions: [
      { id: 'view_customers', label: 'Lihat Customer' },
      { id: 'edit_customers', label: 'Ubah Customer' },
      { id: 'delete_customers', label: 'Hapus Customer' },
    ]
  },
  {
    module: 'Sistem & RBAC',
    actions: [
      { id: 'manage_roles', label: 'Kelola Role & Akses' },
      { id: 'view_dashboard', label: 'Akses Dashboard' },
    ]
  }
];

export default function Roles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  
  // STATE BARU: Untuk menyimpan data asli dari API dan status loading
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // FUNGSI 1: MENGAMBIL DATA DARI LARAVEL (READ)
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/roles", {
        credentials: "include",
        
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan fetch saat halaman pertama kali dibuka
  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (role: any = null) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    } else {
      setEditingRole(null);
      setRoleName('');
      setSelectedPermissions([]);
    }
    setIsModalOpen(true);
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const toggleModulePermissions = (moduleActions: any[], isAllSelected: boolean) => {
    const actionIds = moduleActions.map(a => a.id);
    if (isAllSelected) {
      setSelectedPermissions(prev => prev.filter(p => !actionIds.includes(p)));
    } else {
      setSelectedPermissions(prev => Array.from(new Set([...prev, ...actionIds])));
    }
  };

  // FUNGSI 2: MENYIMPAN ATAU MENGUBAH DATA ROLE (CREATE & UPDATE)
  const handleSave = async () => {
    if (!roleName.trim()) return alert("Nama role tidak boleh kosong!");
    setIsSaving(true);

    const payload = {
      name: roleName,
      permissions: selectedPermissions
    };

    const url = editingRole 
      ? `http://127.0.0.1:8000/roles/${editingRole.id}` 
      : "http://127.0.0.1:8000/roles";
      
    const method = editingRole ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchRoles(); // Refresh tabel setelah berhasil
      } else {
        const errData = await res.json();
        alert(errData.message || "Gagal menyimpan role.");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // FUNGSI 3: MENGHAPUS DATA ROLE (DELETE)
  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus role ini? Semua akun dengan role ini akan kehilangan aksesnya.")) return;
    
    try {
      const res = await fetch(`http://127.0.0.1:8000/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchRoles(); // Refresh tabel
      } else {
        const errData = await res.json();
        alert(errData.message || "Gagal menghapus role.");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white h-[calc(100vh-160px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#2D3E5E] mb-2">Manajemen Role & Hak Akses</h1>
          <p className="text-slate-500 text-sm">Atur peran pengguna dan batasan fitur yang dapat mereka akses di sistem.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Tambah Role
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-y-auto shadow-sm flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
            <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}

        <table className="w-full text-left text-sm text-slate-600 relative">
          <thead className="bg-[#F3F6F9] text-[#2D3E5E] font-semibold sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 w-20">ID</th>
              <th className="px-6 py-4 w-48">Nama Role</th>
              <th className="px-6 py-4">Total Hak Akses</th>
              <th className="px-6 py-4">Jumlah Pengguna</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-slate-400">Belum ada data role.</td></tr>
            ) : roles.map((role) => (
              <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium">#{role.id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    role.name === 'super_admin' ? 'bg-purple-100 text-purple-700' : role.name === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {role.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {role.name === 'super_admin' ? 'Semua Akses' : `${role.permissions?.length || 0} Akses Diberikan`}
                  </span>
                </td>
                <td className="px-6 py-4">{role.users_count} Akun</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => handleOpenModal(role)} className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                    Ubah Akses
                  </button>
                  {/* Jangan tampilkan tombol hapus untuk super_admin dan admin */}
                  {!['super_admin', 'admin'].includes(role.name) && (
                    <button onClick={() => handleDelete(role.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors">
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-[#2D3E5E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-soft-fade flex flex-col">
            <div className="p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-[#2D3E5E]">{editingRole ? 'Ubah Hak Akses Role' : 'Buat Role Baru'}</h3>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFCFF]">
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="block text-sm font-bold text-[#2D3E5E] mb-2">Nama Role</label>
                  <input 
                    type="text" 
                    value={roleName}
                    disabled={['super_admin', 'admin'].includes(editingRole?.name)}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Contoh: staff_gudang"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all text-slate-700 disabled:bg-slate-100"
                  />
                  {['super_admin', 'admin'].includes(editingRole?.name) && (
                    <p className="text-xs text-red-500 mt-2 font-medium">Nama role sistem inti tidak dapat diubah.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#2D3E5E] mb-4">Pengaturan Hak Akses (Permissions)</h4>
                  
                  {/* Jika role adalah super_admin, beri tahu bahwa dia punya semua akses otomatis */}
                  {editingRole?.name === 'super_admin' ? (
                    <div className="bg-purple-50 border border-purple-200 text-purple-700 p-4 rounded-xl text-sm font-medium">
                      Super Admin memiliki akses absolut (Kunci Master) ke seluruh fitur sistem. Anda tidak perlu mengatur permission-nya satu per satu.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {AVAILABLE_PERMISSIONS.map((moduleConfig, idx) => {
                        const moduleActionIds = moduleConfig.actions.map(a => a.id);
                        const isAllSelected = moduleActionIds.every(id => selectedPermissions.includes(id));
                        const isSomeSelected = moduleActionIds.some(id => selectedPermissions.includes(id)) && !isAllSelected;

                        return (
                          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                              <span className="font-bold text-[#2D3E5E] text-sm">{moduleConfig.module}</span>
                              <label className="flex items-center cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={isAllSelected}
                                  ref={input => { if (input) input.indeterminate = isSomeSelected }}
                                  onChange={() => toggleModulePermissions(moduleConfig.actions, isAllSelected)}
                                  className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-[#3B82F6]"
                                />
                                <span className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-700">Pilih Semua</span>
                              </label>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                              {moduleConfig.actions.map((action) => (
                                <label key={action.id} className="flex items-center cursor-pointer group">
                                  <div className="relative flex items-center justify-center">
                                    <input 
                                      type="checkbox"
                                      checked={selectedPermissions.includes(action.id)}
                                      onChange={() => togglePermission(action.id)}
                                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                    />
                                    <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-[#3B82F6] transition-colors select-none">
                                    {action.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Batal
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
                {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}