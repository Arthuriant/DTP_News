"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/services/ProductService'; 
import { AuthService } from '@/services/AuthService'; 

export default function Produk() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('katalog');
  
  // State Data
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State RBAC (Role-Based Access Control)
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

  // 1. FUNGSI FETCH MENGGUNAKAN SERVICE
  const fetchInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch produk dan data user secara bersamaan
      const [productData, userData] = await Promise.all([
        ProductService.getProducts(),
        AuthService.getUser()
      ]);
      
      setProducts(productData || []); 

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

  // Cek Izin Spesifik
  const canCreate = isSuperAdmin || myPermissions.includes("create_products");
  const canEdit = isSuperAdmin || myPermissions.includes("edit_products");
  const canDelete = isSuperAdmin || myPermissions.includes("delete_products");

  // 2. FUNGSI SIMPAN (CREATE & UPDATE)
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
      } else {
        await ProductService.createProduct(formData);
      }
      
      await fetchInitialData(); 
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Terjadi kesalahan simpan:", error);
      alert("Gagal menyimpan data!");
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

  // 3. FUNGSI HAPUS MENGGUNAKAN SERVICE
  const handleDelete = async (id: string) => { 
    if (confirm("Hapus produk mahakarya ini secara permanen?")) {
      try {
        await ProductService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Gagal menghapus:", error);
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

        {/* 👈 TOMBOL TAMBAH DILINDUNGI */}
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

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex px-4 space-x-10 relative z-10">
        {['katalog', 'kompartemen', 'slicing'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative group ${
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

      {/* ================= MAIN CONTENT SECTION (CARD GRID) ================= */}
      <div className="relative w-full pb-10 pt-2">
        {/* Aksen Mega Mendung */}
        <div 
          className="absolute -right-10 top-20 w-[500px] h-[500px] opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
        ></div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <span className="w-10 h-10 border-4 border-[#D9B35A] border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-[#8B7355] font-sans text-sm font-bold tracking-widest uppercase">Memuat Mahakarya...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/60">
            <p className="text-[#8B7355] font-sans">Belum ada mahakarya yang terdaftar di galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2 relative z-10">
            {products.map((p) => (
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  {/* Overlay Gradient Halus */}
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
                      onClick={(e) => {e.stopPropagation(); handleDelete(p.id)}} 
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
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">ID Sub-Kategori (Sementara)</label>
                <input required type="text" placeholder="Masukkan UUID Sub Kategori" value={editForm.sub_categories_id} onChange={e => setEditForm({...editForm, sub_categories_id: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none text-sm transition-all" />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Harga Jual (Rp)</label>
                <input required type="number" value={editForm.base_price || ''} onChange={e => setEditForm({...editForm, base_price: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none text-sm transition-all" />
              </div>

              {/* INPUT FILE UNTUK GAMBAR */}
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