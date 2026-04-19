"use client";

import { AuthService } from "@/services/AuthService";
import { RoleService } from "@/services/RoleService";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AVAILABLE_PERMISSIONS = [
  {
    module: "Akses Utama (Wajib)",
    actions: [{ id: "view_dashboard", label: "Akses Dashboard" }],
  },
  // {
  //   module: "Manajemen Produk",
  //   actions: [
  //     { id: "view_products", label: "Lihat Produk" },
  //     { id: "create_products", label: "Tambah Produk" },
  //     { id: "edit_products", label: "Ubah Produk" },
  //     { id: "delete_products", label: "Hapus Produk" },
  //   ],
  // },
  // {
  //   module: "Pesanan Custom",
  //   actions: [
  //     { id: "view_orders", label: "Lihat Pesanan" },
  //     { id: "update_orders", label: "Update Status" },
  //     { id: "delete_orders", label: "Hapus Pesanan" },
  //   ],
  // },
  {
    module: "Data Customer",
    actions: [
      { id: "view_customers", label: "Lihat Customer" },
      { id: "edit_customers", label: "Ubah Customer" },
      { id: "delete_customers", label: "Hapus Customer" },
    ],
  },
  {
    module: "Kelola Akun Pengguna",
    actions: [
      { id: "view_users", label: "Lihat Pengguna" },
      { id: "create_users", label: "Tambah Pengguna" },
      { id: "edit_users", label: "Ubah Pengguna" },
      { id: "delete_users", label: "Hapus Pengguna" },
    ],
  },
  {
    module: "Manajemen Role & Akses",
    actions: [
      { id: "view_roles", label: "Lihat Role" },
      { id: "create_roles", label: "Tambah Role" },
      { id: "edit_roles", label: "Ubah Role" },
      { id: "delete_roles", label: "Hapus Role" },
    ],
  },
];

export default function Roles() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Status akses user login
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // URL Ornamen
  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [userData, rolesData] = await Promise.all([
          AuthService.getUser(),
          RoleService.getRoles()
        ]);

        if (userData) {
          setIsSuperAdmin(userData.roles?.includes("super_admin") || false);
          setMyPermissions(userData.permissions || []);
        }
        if (rolesData) {
          setRoles(rolesData);
        }
      } catch (error: any) {
        console.error("Gagal mengambil data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchInitialData();
    }, []);

  const canCreate = isSuperAdmin || myPermissions.includes("create_roles");
  const canEdit = isSuperAdmin || myPermissions.includes("edit_roles");
  const canDelete = isSuperAdmin || myPermissions.includes("delete_roles");

  const handleOpenModal = (role: any = null) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    } else {
      setEditingRole(null);
      setRoleName("");
      setSelectedPermissions([]);
    }
    setIsModalOpen(true);
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId],
    );
  };

  const toggleModulePermissions = (moduleActions: any[], isAllSelected: boolean) => {
    const actionIds = moduleActions.map((a) => a.id);
    if (isAllSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !actionIds.includes(p)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...actionIds])));
    }
  };

  const handleSave = async () => {
    if (!roleName.trim()) {
      Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama role tidak boleh kosong!', confirmButtonColor: '#2A1B14' });
      return;
    }
    
    setIsSaving(true);
    const payload = { name: roleName, permissions: selectedPermissions };

    try {
      if (editingRole) {
        await RoleService.updateRole(editingRole.id, payload);
      } else {
        await RoleService.createRole(payload);
      }
      
      setIsModalOpen(false);
      fetchInitialData();

      Swal.fire({
        title: 'Berhasil!',
        text: `Role berhasil ${editingRole ? 'diperbarui' : 'ditambahkan'}.`,
        icon: 'success',
        background: '#F8F3E9',
        color: '#2A1B14',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan saat menyimpan role.',
        icon: 'error',
        confirmButtonColor: '#2A1B14'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Role?',
      text: "Role yang dihapus tidak dapat dikembalikan dan mungkin mempengaruhi hak akses pengguna yang menggunakan role ini.",
      icon: 'warning',
      showCancelButton: true,
      background: '#F8F3E9',
      color: '#2D1A11',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      buttonsStyling: false, 
      customClass: {
        confirmButton: 'bg-[#2D1A11] text-[#D9B35A] px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-md hover:bg-[#3d2417] transition-colors',
        cancelButton: 'bg-white text-[#8B7355] border border-[#8B7355]/30 px-6 py-2.5 rounded-full font-bold uppercase tracking-widest text-[10px] mx-2 shadow-sm hover:bg-[#EFE8DC] transition-colors'
      }
    });
    

    if (!result.isConfirmed) return;

    try {
      await RoleService.deleteRole(id);
      fetchInitialData();
      
      Swal.fire({
        title: 'Terhapus!',
        text: 'Role berhasil dihapus dari sistem.',
        icon: 'success',
        background: '#F8F3E9',
        color: '#2A1B14',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Gagal menghapus role.',
        icon: 'error',
        confirmButtonColor: '#2A1B14'
      });
    }
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2A1B14]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Otoritas Sistem</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#2A1B14]">Manajemen Role & Akses</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full shrink-0"></span>
            Atur peran pengguna dan batasan fitur mahakarya UpToYou.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => handleOpenModal()}
            className="group relative bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] hover:shadow-[0_10px_25px_rgba(234,193,53,0.4)] text-[#2A1B14] px-8 py-3.5 rounded-full font-serif font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2.5 overflow-hidden border border-[#FFF6C5]/50 shadow-[0_5px_15px_rgba(234,193,53,0.3)]"
          >
             <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
             <span className="relative z-10 flex items-center gap-2 tracking-wide font-sans">
              <span className="text-lg">✧</span> Tambah Role Baru
            </span>
          </button>
        )}
      </div>

      {/* ================= MAIN DATA SECTION ================= */}
      <div className="relative w-full pb-10 pt-2">
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
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl border-y border-l border-[#D9B35A]/20">ID</th>
                 <th className="py-5 px-4 text-left border-y border-[#D9B35A]/20">Nama Role</th>
                 <th className="py-5 px-4 text-center border-y border-[#D9B35A]/20">Total Hak Akses</th>
                 <th className="py-5 px-4 text-center border-y border-[#D9B35A]/20">Jumlah Pengguna</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl border-y border-r border-[#D9B35A]/20">Tindakan</th>
               </tr>
            </thead>

            <tbody className="relative">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              )}

              {!isLoading && roles.map((role) => (
                <tr key={role.id} className="group transition-all duration-300 hover:-translate-y-1.5">
                  <td className="py-5 pl-8 pr-4 bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(42,27,20,0.08)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow font-bold text-[#D9B35A]">
                    #{role.id}
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 font-bold text-[#2A1B14]">
                    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border ${
                      role.name === "super_admin" 
                        ? "bg-purple-50 text-purple-600 border-purple-200" 
                        : "bg-[#F8F3E9] text-[#2A1B14] border-[#D9B35A]/30"
                    }`}>
                      {role.name}
                    </span>
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 text-center">
                    <span className="font-bold text-[#D9B35A] bg-[#D9B35A]/10 px-4 py-1.5 rounded-full border border-[#D9B35A]/20 shadow-[inner_0_1px_2px_rgba(255,255,255,0.5)]">
                      {role.name === "super_admin" ? "Akses Penuh" : `${role.permissions?.length || 0} Izin`}
                    </span>
                  </td>
                  <td className="py-5 px-4 bg-white/60 backdrop-blur-xl border-y border-white/40 text-center font-bold text-[#8B7355]">
                    {role.users_count} Akun
                  </td>
                  <td className="py-5 pr-8 pl-4 bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 text-right">
                    <div className="flex justify-end gap-3">
                      {canEdit && (
                        <button 
                          onClick={() => handleOpenModal(role)} 
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#2A1B14] bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#D9B35A] hover:bg-[#FFFDF5] hover:shadow-[0_5px_15px_rgba(217,179,90,0.2)] transition-all"
                        >
                          Ubah Akses
                        </button>
                      )}
                      {canDelete && !["super_admin", "admin"].includes(role.name) && (
                        <button 
                          onClick={() => handleDelete(role.id)} 
                          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-rose-300 hover:bg-rose-50 transition-all"
                        >
                          Hapus
                        </button>
                      )}
                      {!canEdit && !canDelete && <span className="text-slate-400 italic text-xs">Hanya Lihat</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL PERMISSIONS ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#2A1B14]/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
            
            <div className="p-8 border-b border-[#D9B35A]/30 bg-[#2A1B14] text-[#D9B35A] shrink-0" style={{ backgroundImage: `linear-gradient(rgba(42, 27, 20, 0.92), rgba(42, 27, 20, 0.92)), url('${brownBatikUrl}')`, backgroundSize: '300px' }}>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-white">✧</span> {editingRole ? "Konfigurasi Hak Akses" : "Daftarkan Role Baru"}
              </h3>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-[#FFFDF5] font-sans">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-[#D9B35A]/20 shadow-sm">
                  <label className="block text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-2">Nama Identitas Role</label>
                  <input 
                    type="text" 
                    value={roleName} 
                    disabled={["super_admin", "admin"].includes(editingRole?.name)} 
                    onChange={(e) => setRoleName(e.target.value)} 
                    placeholder="Contoh: staff_gudang" 
                    className="w-full bg-[#FFFDF5] border border-gray-200 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm font-bold disabled:bg-gray-100 text-[#2A1B14]" 
                  />
                </div>

                {editingRole?.name === "super_admin" ? (
                  <div className="bg-purple-50 border border-purple-200 text-purple-700 p-6 rounded-3xl text-sm font-bold uppercase tracking-widest text-center shadow-inner">
                    Super Admin memiliki akses absolut ke seluruh fitur sistem.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    {AVAILABLE_PERMISSIONS.map((moduleConfig, idx) => {
                      const moduleActionIds = moduleConfig.actions.map(a => a.id);
                      const isAllSelected = moduleActionIds.every(id => selectedPermissions.includes(id));

                      return (
                        <div key={idx} className="bg-white border border-[#D9B35A]/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="bg-[#2A1B14]/5 px-5 py-4 border-b border-[#D9B35A]/10 flex justify-between items-center">
                            <span className="font-bold text-[#2A1B14] text-xs uppercase tracking-wide">{moduleConfig.module}</span>
                            <label className="flex items-center cursor-pointer gap-2 group">
                              <input 
                                type="checkbox" 
                                checked={isAllSelected} 
                                onChange={() => toggleModulePermissions(moduleConfig.actions, isAllSelected)} 
                                className="w-4 h-4 rounded border-[#D9B35A] text-[#D9B35A] focus:ring-[#D9B35A] cursor-pointer" 
                              />
                              <span className="text-[10px] font-bold text-[#8B7355] uppercase group-hover:text-[#D9B35A] transition-colors">Pilih Semua</span>
                            </label>
                          </div>
                          <div className="p-5 grid grid-cols-1 gap-3">
                            {moduleConfig.actions.map((action) => (
                              <label key={action.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F3E9] transition-colors cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={selectedPermissions.includes(action.id)} 
                                  onChange={() => togglePermission(action.id)} 
                                  className="w-4 h-4 rounded border-[#D9B35A] text-[#D9B35A] focus:ring-[#D9B35A] cursor-pointer shadow-sm" 
                                />
                                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#2A1B14] transition-colors">{action.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-white">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#8B7355] hover:bg-gray-50 rounded-full transition-colors">Batal</button>
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-[#2A1B14] px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-[#D9B35A]/30 hover:-translate-y-1 active:translate-y-0 transition-all border border-[#FFF6C5]/50"
              >
                {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}