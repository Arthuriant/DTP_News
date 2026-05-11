"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/services/ProductService'; 
import { AuthService } from '@/services/AuthService'; 
import { CategoryService } from '@/services/CategoryService';
import { AlertService } from '@/services/AlertService';

export default function Produk() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('katalog');
  
  // State Data Utama
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State Fitur Pencarian & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Menampilkan 8 produk (2 baris x 4 kolom) per halaman

  // State RBAC
  const [myPermissions, setMyPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ 
    id: '', 
    sub_categories_id: '', 
    name: '', 
    base_price: 0, 
    status: 'Aktif',
    img: null as File | null 
  });

  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productData, userData, categoryData] = await Promise.all([
        ProductService.getProducts(),
        AuthService.getUser(),
        CategoryService.getAll() 
      ]);
      
      setProducts(productData || []); 
      setCategories(categoryData || []);

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

  const canCreate = isSuperAdmin || myPermissions.includes("create_products");
  const canEdit = isSuperAdmin || myPermissions.includes("edit_products");
  const canDelete = isSuperAdmin || myPermissions.includes("delete_products");

  // ================= LOGIKA FILTER & PENCARIAN BERLAPIS =================
  const filteredProducts = products.filter(p => {
    // Filter Pencarian (Nama Produk)
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter Kategori (Mencocokkan sub_categories_id)
    const matchesCategory = filterCategory === 'all' || String(p.sub_categories_id) === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // ================= LOGIKA PAGINATION =================
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // ================= HANDLERS =================
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('base_price', editForm.base_price.toString());
    formData.append('sub_categories_id', editForm.sub_categories_id);
    formData.append('is_active', editForm.status === 'Aktif' ? '1' : '0');

    if (editForm.img) {
      formData.append('img', editForm.img);
    }

    try {
      if (editForm.id) {
        await ProductService.updateProduct(editForm.id, formData);
        AlertService.success("Berhasil Diperbarui", `Karya ${editForm.name} berhasil dimodifikasi.`);
      } else {
        await ProductService.createProduct(formData);
        AlertService.success("Berhasil Didaftarkan", `Karya ${editForm.name} berhasil ditambahkan ke galeri.`);
      }
      
      await fetchInitialData(); 
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Terjadi kesalahan simpan:", error);
      AlertService.error("Gagal Menyimpan", "Terjadi kesalahan sistem saat menyimpan mahakarya.");
    }
  };

  const handleEdit = (prod: any) => { 
    setEditForm({ 
      id: prod.id, 
      name: prod.name, 
      sub_categories_id: prod.sub_categories_id, 
      base_price: Number(prod.base_price), 
      status: prod.is_active ? 'Aktif' : 'Nonaktif',
      img: null 
    }); 
    setIsModalOpen(true); 
  };

  const handleDelete = async (id: string, productName: string) => { 
    const isConfirmed = await AlertService.confirm(
      "Hapus Mahakarya?",
      `Apakah Anda yakin ingin menghapus "${productName}" secara permanen dari galeri?`,
      "YA, HAPUS!"
    );

    if (isConfirmed) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
        AlertService.success("Terhapus!", "Mahakarya berhasil dihapus dari inventaris.");
        
        // Reset ke halaman sebelumnya jika halaman saat ini kosong setelah dihapus
        if (paginatedProducts.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (error) {
        console.error("Gagal menghapus:", error);
        AlertService.error("Gagal Menghapus", "Terjadi kesalahan server saat mencoba menghapus produk.");
      }
    } 
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2 relative z-10">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Inventaris Mahakarya</p>
          <h1 className="text-4xl font-bold tracking-tight">Manajemen Produk</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span>
            Kelola koleksi tas eksklusif dan opsi kustomisasi UpToYou.
          </p>
        </div>

        {canCreate && (
          <button 
            onClick={() => { setEditForm({ id: '', name: '', sub_categories_id: '', base_price: 0, status: 'Aktif', img: null }); setIsModalOpen(true); }} 
            className="group relative bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] hover:shadow-[0_10px_25px_rgba(234,193,53,0.4)] text-[#1A1A1A] px-8 py-3.5 rounded-full font-serif font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2.5 overflow-hidden border border-[#FFF6C5]/50 shadow-[0_5px_15px_rgba(234,193,53,0.3)]"
          >
            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative z-10 flex items-center gap-2 tracking-wide">
              <span className="text-lg">✧</span> Tambah Produk Baru
            </span>
          </button>
        )}
      </div>

      {/* ================= TOOLS SECTION (SEARCH, FILTER & TABS) ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2 relative z-10 font-sans">
        
        {/* Tab Navigasi */}
        <div className="flex space-x-8">
          {['katalog', 'kompartemen', 'slicing'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }} 
              className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative group ${
                activeTab === tab ? 'text-[#D9B35A]' : 'text-[#8B7355] hover:text-[#2D1A11]'
              }`}
            >
              {tab.replace('-', ' ')}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D9B35A] shadow-[0_0_8px_rgba(217,179,90,0.5)]"></span>
              )}
            </button>
          ))}
        </div>

        {/* Alat Pencarian & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Kolom Pencarian */}
          <div className="relative group w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#D9B35A]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/80 backdrop-blur-xl border border-[#D9B35A]/30 text-[#2D1A11] pl-11 pr-4 py-2.5 rounded-full shadow-sm focus:outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Kolom Filter Kategori */}
          <div className="relative w-full sm:w-64">
            <select 
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white/80 backdrop-blur-xl border border-[#D9B35A]/30 text-[#2D1A11] pl-4 pr-10 py-2.5 rounded-full shadow-sm focus:outline-none focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] transition-all text-sm appearance-none cursor-pointer font-semibold"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((category) => (
                <optgroup key={category.id} label={category.name} className="font-bold bg-white text-[#D9B35A]">
                  {category.sub_categories?.map((sub: any) => (
                    <option key={sub.id} value={sub.id} className="font-medium text-[#2D1A11]">
                      {sub.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#D9B35A]">
              <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
      </div>

      {/* ================= MAIN CONTENT SECTION (CARD GRID) ================= */}
      <div className="relative w-full pb-10 pt-2">
        {/* Aksen Mega Mendung */}
        <div 
          className="absolute -right-10 top-20 w-[500px] h-[500px] opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
        ></div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32 relative z-10">
            <div className="animate-pulse flex flex-col items-center">
              <span className="w-10 h-10 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-[#8B7355] font-sans text-sm font-bold tracking-widest uppercase">Memuat Mahakarya...</p>
            </div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/60 relative z-10 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#FFFDF5] rounded-full flex items-center justify-center mb-6 border border-[#E5D7C1]">
              <svg className="w-8 h-8 text-[#D9B35A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2D1A11] mb-2">Katalog Kosong</h3>
            <p className="text-[#8B7355] font-sans text-sm">Tidak ditemukan mahakarya yang sesuai dengan filter pencarian Anda.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 relative z-10">
              {paginatedProducts.map((p) => (
                <div key={p.id} onClick={() => router.push(`/admin/produk/${p.id}`)} className="group bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_10px_30px_-15px_rgba(45,26,17,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(217,179,90,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer">
                  
                  {/* 1. Bagian Gambar & Status */}
                  <div className="relative h-64 w-full overflow-hidden bg-[#FFFDF5]">
                    <img 
                      src={
                        p.img 
                          ? (p.img.startsWith('storage/') 
                            ? `http://127.0.0.1:8000/${p.img}` 
                            : `http://127.0.0.1:8000/storage/${p.img}`)
                          : '/placeholder.jpg'
                      } 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out mix-blend-multiply" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md font-sans backdrop-blur-md ${p.is_active ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Bagian Informasi Produk */}
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-[#8B7355] font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5">
                      {p.sub_category ? p.sub_category.name : 'Tanpa Kategori'}
                    </p>
                    <h3 className="text-xl font-bold text-[#2D1A11] mb-4 leading-tight group-hover:text-[#D9B35A] transition-colors">
                      {p.name}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-[#D9B35A]/10">
                      <p className="text-[10px] uppercase font-bold text-[#8B7355] font-sans tracking-widest mb-1">Nilai Investasi</p>
                      <p className="font-black text-[#D9B35A] text-xl">
                        Rp {Number(p.base_price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* 3. Tombol Aksi (Tergantung Izin) */}
                  <div className="flex gap-2 p-4 bg-gradient-to-b from-transparent to-[#FFFDF5]/80">
                    {canEdit && (
                      <button 
                        onClick={(e) => {e.stopPropagation(); handleEdit(p)}} 
                        className="flex-1 py-3 text-xs font-bold font-sans uppercase tracking-widest text-[#D9B35A] bg-white border border-[#D9B35A]/30 rounded-xl hover:bg-[#D9B35A] hover:text-white transition-all duration-300 shadow-sm"
                      >
                        Ubah
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        onClick={(e) => {e.stopPropagation(); handleDelete(p.id, p.name)}} 
                        className="flex-1 py-3 text-xs font-bold font-sans uppercase tracking-widest text-rose-400 bg-white border border-rose-200 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm"
                      >
                        Hapus
                      </button>
                    )}
                    {!canEdit && !canDelete && (
                       <p className="w-full text-center text-[10px] font-bold text-[#8B7355] uppercase tracking-widest py-3">Hanya Lihat</p>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* ================= KONTROL PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 font-sans relative z-10">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      currentPage === page 
                        ? "bg-[#C5A059] text-white shadow-md" 
                        : "bg-white border border-[#E5D7C1] text-[#8B7355] hover:border-[#C5A059] hover:text-[#C5A059]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 rounded-full border border-[#D9B35A]/50 flex items-center justify-center text-[#C5A059] hover:bg-[#C5A059] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#C5A059] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= MODAL CRUD (GLASSMORPHISM) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative overflow-hidden">
            <h2 className="text-2xl font-bold text-[#2D1A11] mb-8 flex items-center gap-3">
              <span className="text-[#D9B35A]">✧</span> {editForm.id === '' ? 'Daftarkan Karya' : 'Perbarui Karya'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5 font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Nama Produk</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none text-sm transition-all" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Sub-Kategori</label>
                <div className="relative">
                  <select 
                    required 
                    value={editForm.sub_categories_id} 
                    onChange={e => setEditForm({...editForm, sub_categories_id: e.target.value})} 
                    className={`w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-5 py-3.5 pr-12 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none text-sm transition-all appearance-none cursor-pointer ${editForm.sub_categories_id === '' ? 'text-gray-400' : 'text-[#2D1A11]'}`}
                  >
                    <option value="" disabled className="text-gray-400">-- Pilih Sub-Kategori --</option>
                    {categories.map((category) => (
                      <optgroup key={category.id} label={category.name} className="font-bold text-[#D9B35A] bg-white">
                        {category.sub_categories?.map((sub: any) => (
                          <option key={sub.id} value={sub.id} className="font-medium text-[#2D1A11]">
                            {sub.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#D9B35A]">
                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Harga Jual (Rp)</label>
                <input required type="number" value={editForm.base_price || ''} onChange={e => setEditForm({...editForm, base_price: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none text-sm transition-all" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Gambar Sampul</label>
                <input type="file" accept="image/*" onChange={e => setEditForm({...editForm, img: e.target.files ? e.target.files[0] : null})} className="w-full text-sm text-[#8B7355] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#D9B35A]/10 file:text-[#D9B35A] hover:file:bg-[#D9B35A]/20 transition-all cursor-pointer" />
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full bg-white text-[#8B7355] font-bold text-xs uppercase tracking-widest border border-gray-200 hover:border-[#D9B35A]/50 hover:shadow-md transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#D9B35A]/20 hover:-translate-y-0.5 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}