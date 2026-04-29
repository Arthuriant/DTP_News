"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { CategoryService } from '@/services/CategoryService';
import { AuthService } from '@/services/AuthService';
// IMPORT AlertService yang baru dibuat
import { AlertService } from '@/services/AlertService'; 

export default function Kategori() {
  // State Data
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // State RBAC
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // State Modals
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', name: '' });
  const [subForm, setSubForm] = useState({ id: '', category_id: '', name: '' });
  const [isSaving, setIsSaving] = useState(false);

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catData, userData] = await Promise.all([
        CategoryService.getAll(),
        AuthService.getUser()
      ]);
      
      setCategories(catData || []);
      
      setSelectedCategory((prevSelected: any) => {
        if (catData && catData.length > 0 && !prevSelected) {
          return catData[0];
        } else if (prevSelected) {
          return catData.find((c: any) => c.id === prevSelected.id) || catData[0];
        }
        return null;
      });

      if (userData) {
        setIsSuperAdmin(userData.roles?.includes("super_admin") || false);
        setMyPermissions(userData.permissions || []);
      }
    } catch (error: any) {
      console.error("Gagal mengambil data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // RBAC Check
  const canManage = isSuperAdmin || myPermissions.includes("manage_categories");

  // ================= HANDLER KATEGORI UTAMA =================
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (catForm.id) {
        await CategoryService.updateCategory(catForm.id, { name: catForm.name });
      } else {
        await CategoryService.createCategory({ name: catForm.name });
      }
      setIsCatModalOpen(false);
      fetchInitialData();
      
      // MENGGUNAKAN ALERT SERVICE
      AlertService.success('Berhasil', 'Kategori utama berhasil disimpan.');
    } catch (error: any) {
      // MENGGUNAKAN ALERT SERVICE
      AlertService.error('Gagal', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    // MENGGUNAKAN ALERT SERVICE UNTUK KONFIRMASI
    const isConfirmed = await AlertService.confirm(
      "Hapus Kategori?", 
      "Semua sub-kategori di dalamnya juga akan terhapus secara permanen!",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await CategoryService.deleteCategory(id);
        if (selectedCategory?.id === id) setSelectedCategory(null);
        fetchInitialData();
        AlertService.success('Terhapus!', 'Kategori utama beserta sub-kategorinya telah dihapus.');
      } catch (error: any) {
        AlertService.error('Gagal Menghapus', error.message);
      }
    }
  };

  // ================= HANDLER SUB-KATEGORI =================
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (subForm.id) {
        await CategoryService.updateSubCategory(subForm.id, { name: subForm.name });
      } else {
        await CategoryService.createSubCategory({ 
          categories_id: subForm.category_id, 
          name: subForm.name 
        });
      }
      setIsSubModalOpen(false);
      fetchInitialData();
      
      // MENGGUNAKAN ALERT SERVICE
      AlertService.success('Berhasil', 'Sub-Kategori berhasil disimpan.');
    } catch (error: any) {
      AlertService.error('Gagal', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    // MENGGUNAKAN ALERT SERVICE UNTUK KONFIRMASI
    const isConfirmed = await AlertService.confirm(
      "Hapus Sub-Kategori?", 
      "Data sub-kategori ini akan dihapus secara permanen.",
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await CategoryService.deleteSubCategory(id);
        fetchInitialData();
        AlertService.success('Terhapus!', 'Sub-Kategori berhasil dihapus.');
      } catch (error: any) {
        AlertService.error('Gagal Menghapus', error.message);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2 relative z-10">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Data Master</p>
          <h1 className="text-4xl font-bold tracking-tight">Kategori Produk</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span>
            Kelompokkan jenis produk untuk mempermudah pencarian pelanggan.
          </p>
        </div>
      </div>

      <div className="relative w-full pb-10">
        <div className="absolute -right-10 top-20 w-[500px] h-[500px] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}></div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 font-sans relative z-10">
            
            {/* PANEL KIRI: KATEGORI UTAMA */}
            <div className="w-full lg:w-1/3 flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xl font-bold text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', serif" }}>Kategori Utama</h3>
                {canManage && (
                  <button onClick={() => { setCatForm({ id: '', name: '' }); setIsCatModalOpen(true); }} className="text-[10px] font-bold text-[#D9B35A] uppercase tracking-widest hover:text-[#2D1A11] transition-colors">
                    + Tambah Baru
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
                {categories.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-[#D9B35A]/30 rounded-2xl bg-white/50"><p className="text-xs text-[#8B7355]">Belum ada kategori.</p></div>
                ) : (
                  categories.map(cat => (
                    <div 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`group p-5 rounded-[1.5rem] cursor-pointer transition-all border flex justify-between items-center ${
                        selectedCategory?.id === cat.id 
                        ? 'bg-gradient-to-r from-[#D9B35A] to-[#C5A059] text-white border-transparent shadow-[0_10px_20px_-5px_rgba(217,179,90,0.4)]' 
                        : 'bg-white/80 backdrop-blur-sm text-[#2D1A11] border-[#D9B35A]/20 hover:border-[#D9B35A]/50 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-lg mb-1">{cat.name}</p>
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${selectedCategory?.id === cat.id ? 'text-white/80' : 'text-[#8B7355]'}`}>
                          {cat.sub_categories?.length || 0} Sub-Kategori
                        </p>
                      </div>
                      
                      {canManage && (
                        <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory?.id === cat.id ? 'text-white' : 'text-[#D9B35A]'}`}>
                          <button onClick={(e) => { e.stopPropagation(); setCatForm({ id: cat.id, name: cat.name }); setIsCatModalOpen(true); }} className="p-2 hover:scale-110">✏️</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-2 hover:scale-110 text-rose-500">🗑️</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* PANEL KANAN: SUB-KATEGORI */}
            <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#D9B35A]/20 p-8 shadow-sm h-[70vh] flex flex-col">
              {selectedCategory ? (
                <>
                  <div className="flex justify-between items-center mb-8 border-b border-[#D9B35A]/10 pb-6">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest mb-1">Menampilkan Sub-Kategori untuk</p>
                      <h3 className="text-3xl font-bold text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {selectedCategory.name}
                      </h3>
                    </div>
                    {canManage && (
                      <button 
                        onClick={() => { setSubForm({ id: '', category_id: selectedCategory.id, name: '' }); setIsSubModalOpen(true); }}
                        className="px-6 py-3 bg-[#2D1A11] text-[#D9B35A] rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3d2417] shadow-lg transition-all hover:-translate-y-0.5"
                      >
                        + Tambah Sub
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {(!selectedCategory.sub_categories || selectedCategory.sub_categories.length === 0) ? (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                         <span className="text-4xl mb-3">📁</span>
                         <p className="text-[#8B7355] text-sm">Belum ada sub-kategori di dalam {selectedCategory.name}</p>
                       </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCategory.sub_categories.map((sub: any) => (
                          <div key={sub.id} className="p-5 bg-[#FFFDF5] border border-[#D9B35A]/20 rounded-2xl flex justify-between items-center group hover:border-[#D9B35A]/50 hover:shadow-md transition-all">
                            <span className="font-bold text-[#2D1A11] text-lg">{sub.name}</span>
                            
                            {canManage && (
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSubForm({ id: sub.id, category_id: selectedCategory.id, name: sub.name }); setIsSubModalOpen(true); }} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-[#D9B35A] shadow-sm hover:bg-[#D9B35A] hover:text-white transition-colors">✏️</button>
                                <button onClick={() => handleDeleteSubCategory(sub.id)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-colors">🗑️</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                  <span className="text-5xl mb-4">👈</span>
                  <h3 className="text-xl font-bold text-[#2D1A11] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Pilih Kategori</h3>
                  <p className="text-[#8B7355] text-sm">Pilih kategori di panel sebelah kiri untuk melihat detailnya.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* MODAL KATEGORI UTAMA */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#2D1A11] mb-6">{catForm.id ? 'Edit Kategori' : 'Kategori Baru'}</h2>
            <form onSubmit={handleSaveCategory}>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-2 tracking-widest">Nama Kategori</label>
              <input required autoFocus type="text" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-5 py-3.5 rounded-2xl outline-none focus:border-[#D9B35A] mb-8 font-bold text-[#2D1A11]" placeholder="Cth: Tas Pria" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 py-3.5 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-200">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#c5a059]">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUB-KATEGORI */}
      {isSubModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#2D1A11] mb-2">{subForm.id ? 'Edit Sub-Kategori' : 'Sub-Kategori Baru'}</h2>
            <p className="text-xs text-[#8B7355] mb-6 tracking-widest uppercase font-bold">Induk: <span className="text-[#D9B35A]">{selectedCategory?.name}</span></p>
            <form onSubmit={handleSaveSubCategory}>
              <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-2 tracking-widest">Nama Sub-Kategori</label>
              <input required autoFocus type="text" value={subForm.name} onChange={e => setSubForm({...subForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/30 px-5 py-3.5 rounded-2xl outline-none focus:border-[#D9B35A] mb-8 font-bold text-[#2D1A11]" placeholder="Cth: Messenger Bag" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsSubModalOpen(false)} className="flex-1 py-3.5 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-200">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl bg-[#2D1A11] text-[#D9B35A] font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#3d2417]">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}