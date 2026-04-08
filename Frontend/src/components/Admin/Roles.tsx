"use client";

import React, { useState, useEffect } from "react";

const AVAILABLE_PERMISSIONS = [
  {
    module: "Akses Utama (Wajib)",
    actions: [{ id: "view_dashboard", label: "Akses Dashboard" }],
  },
  {
    module: "Manajemen Produk",
    actions: [
      { id: "view_products", label: "Lihat Produk" },
      { id: "create_products", label: "Tambah Produk" },
      { id: "edit_products", label: "Ubah Produk" },
      { id: "delete_products", label: "Hapus Produk" },
    ],
  },
  {
    module: "Pesanan Custom",
    actions: [
      { id: "view_orders", label: "Lihat Pesanan" },
      { id: "update_orders", label: "Update Status" },
      { id: "delete_orders", label: "Hapus Pesanan" },
    ],
  },
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

  // 👇 1. STATE BARU: Untuk menyimpan status akses orang yang sedang login (Bayu/Lintang)
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 👇 2. FUNGSI FETCH GABUNGAN: Ambil data User (untuk cek tombol) & data Roles (untuk tabel)
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // A. Ambil data aku (User yang login)
      const userRes = await fetch("http://127.0.0.1:8000/user", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        setIsSuperAdmin(userData.roles?.includes("super_admin") || false);
        setMyPermissions(userData.permissions || []);
      }

      // B. Ambil daftar Role untuk tabel
      const rolesRes = await fetch("http://127.0.0.1:8000/roles", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (rolesRes.ok) {
        setRoles(await rolesRes.json());
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 👇 3. VARIABEL PEMBANTU: Cek apakah user boleh melihat tombol
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
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId],
    );
  };

  const toggleModulePermissions = (
    moduleActions: any[],
    isAllSelected: boolean,
  ) => {
    const actionIds = moduleActions.map((a) => a.id);
    if (isAllSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !actionIds.includes(p)),
      );
    } else {
      setSelectedPermissions((prev) =>
        Array.from(new Set([...prev, ...actionIds])),
      );
    }
  };

  const handleSave = async () => {
    if (!roleName.trim()) return alert("Nama role tidak boleh kosong!");
    setIsSaving(true);

    const payload = { name: roleName, permissions: selectedPermissions };
    const url = editingRole
      ? `http://127.0.0.1:8000/roles/${editingRole.id}`
      : "http://127.0.0.1:8000/roles";
    const method = editingRole ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchInitialData();
      } else {
        const errData = await res.json();
        alert(errData.message || "Gagal menyimpan role.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus role ini?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchInitialData();
      else alert("Gagal menghapus role.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white h-[calc(100vh-160px)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#2D3E5E] mb-2">
            Manajemen Role & Hak Akses
          </h1>
          <p className="text-slate-500 text-sm">
            Atur peran pengguna dan batasan fitur yang dapat mereka akses di
            sistem.
          </p>
        </div>

        {/* 👇 4. TOMBOL TAMBAH HANYA MUNCUL JIKA PUNYA IZIN 👇 */}
        {canCreate && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tambah Role
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-y-auto shadow-sm flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-20">
            <div className="w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

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
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  Belum ada data role.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">#{role.id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${role.name === "super_admin" ? "bg-purple-100 text-purple-700" : role.name === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                      {role.name === "super_admin"
                        ? "Semua Akses"
                        : `${role.permissions?.length || 0} Akses`}
                    </span>
                  </td>
                  <td className="px-6 py-4">{role.users_count} Akun</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {/* 👇 5. TOMBOL UBAH & HAPUS HANYA MUNCUL JIKA PUNYA IZIN 👇 */}
                    {canEdit && (
                      <button
                        onClick={() => handleOpenModal(role)}
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        Ubah Akses
                      </button>
                    )}
                    {canDelete &&
                      !["super_admin", "admin"].includes(role.name) && (
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          Hapus
                        </button>
                      )}

                    {/* Jika tidak punya izin Edit & Delete sama sekali, beri tahu UI */}
                    {!canEdit && !canDelete && (
                      <span className="text-slate-400 italic text-xs">
                        Hanya Lihat
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-[#2D3E5E]/40 backdrop-blur-sm flex items-center justify-center p-4">
          {/* ... (Isi Modal Sama Persis Seperti Sebelumnya) ... */}
          {/* Karena kodenya panjang, bagian isi modal <div className="bg-white...">...</div> biarkan utuh seperti file aslimu ya! */}

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-soft-fade flex flex-col">
            <div className="p-6 border-b border-slate-100 shrink-0">
              <h3 className="text-xl font-bold text-[#2D3E5E]">
                {editingRole ? "Ubah Hak Akses Role" : "Buat Role Baru"}
              </h3>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFCFF]">
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="block text-sm font-bold text-[#2D3E5E] mb-2">
                    Nama Role
                  </label>
                  <input
                    type="text"
                    value={roleName}
                    disabled={["super_admin", "admin"].includes(
                      editingRole?.name,
                    )}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="Contoh: staff_gudang"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all text-slate-700 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#2D3E5E] mb-4">
                    Pengaturan Hak Akses (Permissions)
                  </h4>
                  {editingRole?.name === "super_admin" ? (
                    <div className="bg-purple-50 border border-purple-200 text-purple-700 p-4 rounded-xl text-sm font-medium">
                      Super Admin memiliki akses absolut ke seluruh fitur
                      sistem.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {AVAILABLE_PERMISSIONS.map((moduleConfig, idx) => {
                        const moduleActionIds = moduleConfig.actions.map(
                          (a) => a.id,
                        );
                        const isAllSelected = moduleActionIds.every((id) =>
                          selectedPermissions.includes(id),
                        );
                        const isSomeSelected =
                          moduleActionIds.some((id) =>
                            selectedPermissions.includes(id),
                          ) && !isAllSelected;

                        return (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
                          >
                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                              <span className="font-bold text-[#2D3E5E] text-sm">
                                {moduleConfig.module}
                              </span>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isAllSelected}
                                  ref={(input) => {
                                    if (input)
                                      input.indeterminate = isSomeSelected;
                                  }}
                                  onChange={() =>
                                    toggleModulePermissions(
                                      moduleConfig.actions,
                                      isAllSelected,
                                    )
                                  }
                                  className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-[#3B82F6]"
                                />
                                <span className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-700">
                                  Pilih Semua
                                </span>
                              </label>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3">
                              {moduleConfig.actions.map((action) => (
                                <label
                                  key={action.id}
                                  className="flex items-center cursor-pointer group"
                                >
                                  <div className="relative flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedPermissions.includes(
                                        action.id,
                                      )}
                                      onChange={() =>
                                        togglePermission(action.id)
                                      }
                                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                    />
                                    <svg
                                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                  <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-[#3B82F6] transition-colors select-none">
                                    {action.label}
                                  </span>
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
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-2.5 text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
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
