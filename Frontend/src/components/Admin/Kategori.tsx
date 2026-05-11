"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { CategoryService } from '@/services/CategoryService';
import { AuthService } from '@/services/AuthService';
import { AlertService } from '@/services/AlertService';

export default function Kategori() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ id: '', name: '' });
  const [subForm, setSubForm] = useState({ id: '', category_id: '', name: '' });
  const [isSaving, setIsSaving] = useState(false);

  const batikPatternUrl = "https://www.transparenttextures.com/patterns/cubes.png";

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catData, userData] = await Promise.all([
        CategoryService.getAll(),
        AuthService.getUser()
      ]);
      setCategories(catData || []);
      setSelectedCategory((prevSelected: any) => {
        if (catData && catData.length > 0 && !prevSelected) return catData[0];
        else if (prevSelected) return catData.find((c: any) => c.id === prevSelected.id) || catData[0];
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

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const canManage = isSuperAdmin || myPermissions.includes("manage_categories");

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (catForm.id) await CategoryService.updateCategory(catForm.id, { name: catForm.name });
      else await CategoryService.createCategory({ name: catForm.name });
      setIsCatModalOpen(false);
      fetchInitialData();
      AlertService.success('Berhasil', 'Kategori berhasil disimpan.');
    } catch (error: any) {
      AlertService.error('Gagal', error.message);
    } finally { setIsSaving(false); }
  };

  const handleDeleteCategory = async (id: string) => {
    const isConfirmed = await AlertService.confirm("Hapus Kategori?", "Semua sub-kategori di dalamnya juga akan terhapus.", "YA, HAPUS!");
    if (isConfirmed) {
      try {
        await CategoryService.deleteCategory(id);
        if (selectedCategory?.id === id) setSelectedCategory(null);
        fetchInitialData();
        AlertService.success('Terhapus!', 'Kategori berhasil dihapus.');
      } catch (error: any) { AlertService.error('Gagal', error.message); }
    }
  };

  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (subForm.id) await CategoryService.updateSubCategory(subForm.id, { name: subForm.name });
      else await CategoryService.createSubCategory({ categories_id: subForm.category_id, name: subForm.name });
      setIsSubModalOpen(false);
      fetchInitialData();
      AlertService.success('Berhasil', 'Sub-Kategori berhasil disimpan.');
    } catch (error: any) {
      AlertService.error('Gagal', error.message);
    } finally { setIsSaving(false); }
  };

  const handleDeleteSubCategory = async (id: string) => {
    const isConfirmed = await AlertService.confirm("Hapus Sub-Kategori?", "Data ini akan dihapus secara permanen.", "YA, HAPUS!");
    if (isConfirmed) {
      try {
        await CategoryService.deleteSubCategory(id);
        fetchInitialData();
        AlertService.success('Terhapus!', 'Sub-Kategori berhasil dihapus.');
      } catch (error: any) { AlertService.error('Gagal', error.message); }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3E9] font-sans relative">
      
      {/* Background Texture Subtle */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('${batikPatternUrl}')`, backgroundRepeat: 'repeat' }}></div>

      {/* ── HEADER ── */}
      <div className="relative z-10 border-b border-[#D9B35A]/20 bg-white/80 backdrop-blur-xl px-8 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D9B35A] uppercase">Data Master</span>
              <span className="text-[#8B7355]">·</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D9B35A] uppercase">Produk</span>
            </div>
            <h1 className="text-3xl font-bold text-[#2D1A11] tracking-tight font-serif">Katalog Kategori</h1>
          </div>
          {canManage && (
            <button
              onClick={() => { setCatForm({ id: '', name: '' }); setIsCatModalOpen(true); }}
              className="flex items-center gap-2 bg-[#2D1A11] text-[#D9B35A] hover:bg-[#D9B35A] hover:text-[#2D1A11] px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md hover:-translate-y-0.5"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Kategori Baru
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh] relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#D9B35A]/30 border-t-[#D9B35A] rounded-full animate-spin"></div>
            <span className="text-xs text-[#8B7355] tracking-widest uppercase font-bold animate-pulse">Menyiapkan Katalog...</span>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-100px)] relative z-10">

          {/* ── PANEL KIRI: KATEGORI ── */}
          <div className="w-80 border-r border-[#D9B35A]/20 bg-white/60 backdrop-blur-xl flex flex-col flex-shrink-0 shadow-[10px_0_20px_-10px_rgba(45,26,17,0.05)]">
            <div className="px-6 py-4 border-b border-[#D9B35A]/10 bg-[#FFFDF5]/50">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] uppercase">
                {categories.length} Koleksi Utama
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center opacity-60">
                  <div className="w-12 h-12 rounded-full bg-[#FFFDF5] border border-[#E5D7C1] flex items-center justify-center mb-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D9B35A" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                  </div>
                  <p className="text-xs font-bold tracking-wider uppercase text-[#8B7355]">Belum ada kategori</p>
                </div>
              ) : (
                <div className="py-2">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`group relative flex items-center justify-between px-6 py-4 cursor-pointer transition-all border-b border-[#D9B35A]/5 last:border-0 ${
                        selectedCategory?.id === cat.id
                          ? 'bg-[#D9B35A]/10'
                          : 'hover:bg-[#FFFDF5]'
                      }`}
                    >
                      {/* Active indicator */}
                      {selectedCategory?.id === cat.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D9B35A] rounded-r-md"></div>
                      )}

                      <div className="flex items-center gap-4 min-w-0">
                        <span className={`text-xs font-serif font-bold ${selectedCategory?.id === cat.id ? 'text-[#D9B35A]' : 'text-[#8B7355]/50'} flex-shrink-0 w-5`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold truncate ${selectedCategory?.id === cat.id ? 'text-[#2D1A11]' : 'text-[#2D1A11]/70'}`}>
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-[#8B7355] mt-1 font-semibold uppercase tracking-wider">
                            {cat.sub_categories?.length || 0} Tipe
                          </p>
                        </div>
                      </div>

                      {canManage && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); setCatForm({ id: cat.id, name: cat.name }); setIsCatModalOpen(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[#8B7355] hover:text-[#D9B35A] hover:bg-white border border-transparent hover:border-[#D9B35A]/30 transition-all shadow-sm"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-[#8B7355] hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all shadow-sm"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── PANEL KANAN: SUB-KATEGORI ── */}
          <div className="flex-1 flex flex-col bg-[#FFFDF5] overflow-hidden">
            {selectedCategory ? (
              <>
                {/* Sub-header */}
                <div className="flex items-center justify-between px-10 py-6 border-b border-[#D9B35A]/20 bg-white/40">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-[#8B7355] uppercase mb-1">Menampilkan Tipe Koleksi</p>
                    <h2 className="text-2xl font-bold font-serif text-[#2D1A11]">{selectedCategory.name}</h2>
                  </div>
                  {canManage && (
                    <button
                      onClick={() => { setSubForm({ id: '', category_id: selectedCategory.id, name: '' }); setIsSubModalOpen(true); }}
                      className="flex items-center gap-2 border border-[#D9B35A] text-[#D9B35A] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-all shadow-sm"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Tambah Tipe
                    </button>
                  )}
                </div>

                {/* Sub-kategori list */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                  {(!selectedCategory.sub_categories || selectedCategory.sub_categories.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center opacity-60">
                      <div className="w-16 h-16 rounded-full bg-white border border-[#D9B35A]/30 flex items-center justify-center shadow-inner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9B35A" strokeWidth="1.5"><path d="M3 7h18M3 12h18M3 17h9"/></svg>
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#2D1A11] font-serif">Koleksi Masih Kosong</p>
                        <p className="text-sm text-[#8B7355] mt-1">Tambahkan sub-kategori untuk melengkapi katalog Anda.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {selectedCategory.sub_categories.map((sub: any, idx: number) => (
                        <div
                          key={sub.id}
                          className="group bg-white border border-[#D9B35A]/20 rounded-2xl p-5 flex items-center justify-between hover:border-[#D9B35A] hover:shadow-[0_10px_20px_-10px_rgba(217,179,90,0.2)] hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <span className="w-8 h-8 rounded-full bg-[#FFFDF5] border border-[#E5D7C1] flex items-center justify-center text-[10px] font-bold font-serif text-[#D9B35A] flex-shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-bold text-[#2D1A11] truncate">{sub.name}</span>
                          </div>

                          {canManage && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3 bg-[#FFFDF5] rounded-lg border border-[#E5D7C1] p-0.5">
                              <button
                                onClick={() => { setSubForm({ id: sub.id, category_id: selectedCategory.id, name: sub.name }); setIsSubModalOpen(true); }}
                                className="w-7 h-7 flex items-center justify-center rounded text-[#8B7355] hover:bg-[#D9B35A]/10 hover:text-[#D9B35A] transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <div className="w-px bg-[#E5D7C1] my-1"></div>
                              <button
                                onClick={() => handleDeleteSubCategory(sub.id)}
                                className="w-7 h-7 flex items-center justify-center rounded text-[#8B7355] hover:bg-rose-50 hover:text-rose-500 transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 opacity-70">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E5D7C1] flex items-center justify-center shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D9B35A" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
                </div>
                <div>
                  <p className="text-lg font-bold font-serif text-[#2D1A11]">Eksplorasi Katalog</p>
                  <p className="text-sm text-[#8B7355] mt-1">Pilih kategori di panel kiri untuk melihat rincian tipenya.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL KATEGORI ── */}
      {isCatModalOpen && (
        <div
          className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn"
          onMouseDown={(e) => e.target === e.currentTarget && setIsCatModalOpen(false)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5D7C1] bg-[#FFFDF5]">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#2D1A11]">
                  {catForm.id ? 'Perbarui Kategori' : 'Kategori Baru'}
                </h2>
              </div>
              <button onClick={() => setIsCatModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white border border-transparent hover:border-[#D9B35A]/30 text-[#8B7355] transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-8">
              <label className="block text-[10px] font-bold tracking-[0.2em] text-[#8B7355] uppercase mb-2">
                Nama Kategori
              </label>
              <input
                required
                autoFocus
                type="text"
                value={catForm.name}
                onChange={e => setCatForm({ ...catForm, name: e.target.value })}
                className="w-full bg-white border border-[#E5D7C1] rounded-xl px-5 py-3.5 text-sm font-bold text-[#2D1A11] outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all placeholder-[#E5D7C1] mb-8"
                placeholder="Contoh: Tas Kulit Pria"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border border-[#E5D7C1] text-[#8B7355] text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3.5 rounded-xl bg-[#2D1A11] text-[#D9B35A] text-xs font-bold uppercase tracking-widest hover:bg-[#3d2417] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-[#D9B35A]/30 border-t-[#D9B35A] rounded-full animate-spin"></div>}
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL SUB-KATEGORI ── */}
      {isSubModalOpen && (
        <div
          className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn"
          onMouseDown={(e) => e.target === e.currentTarget && setIsSubModalOpen(false)}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E5D7C1] bg-[#FFFDF5]">
              <div>
                <h2 className="text-xl font-bold font-serif text-[#2D1A11]">
                  {subForm.id ? 'Perbarui Tipe' : 'Tipe Baru'}
                </h2>
                <p className="text-[10px] font-bold text-[#8B7355] mt-0.5 uppercase tracking-wider">
                  Induk: <span className="text-[#D9B35A]">{selectedCategory?.name}</span>
                </p>
              </div>
              <button onClick={() => setIsSubModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white border border-transparent hover:border-[#D9B35A]/30 text-[#8B7355] transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSaveSubCategory} className="p-8">
              <label className="block text-[10px] font-bold tracking-[0.2em] text-[#8B7355] uppercase mb-2">
                Nama Tipe / Sub-kategori
              </label>
              <input
                required
                autoFocus
                type="text"
                value={subForm.name}
                onChange={e => setSubForm({ ...subForm, name: e.target.value })}
                className="w-full bg-white border border-[#E5D7C1] rounded-xl px-5 py-3.5 text-sm font-bold text-[#2D1A11] outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all placeholder-[#E5D7C1] mb-8"
                placeholder="Contoh: Tote Bag Premium"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border border-[#E5D7C1] text-[#8B7355] text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3.5 rounded-xl bg-[#2D1A11] text-[#D9B35A] text-xs font-bold uppercase tracking-widest hover:bg-[#3d2417] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-[#D9B35A]/30 border-t-[#D9B35A] rounded-full animate-spin"></div>}
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}