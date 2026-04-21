"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { ProductService } from '@/services/ProductService';

export default function ProductSizesTab() {
  const params = useParams();
  const productId = params.id as string;

  const [sizes, setSizes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // State Form
  const [form, setForm] = useState({
    id: '', title: '', short_desc: '', description: '', 
    price: '', width: '', height: '', depth: '', unit: 'cm', img: null as File | null
  });

  const fetchSizes = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getProductSizes(productId);
      setSizes(data || []);
    } catch (error) {
      console.error("Gagal mengambil data ukuran:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchSizes();
  }, [fetchSizes, productId]);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path.startsWith('storage/') ? `http://127.0.0.1:8000/${path}` : `http://127.0.0.1:8000/storage/${path}`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('title', form.title);
    if (form.short_desc) formData.append('short_desc', form.short_desc);
    if (form.description) formData.append('description', form.description);
    if (form.price !== '') formData.append('price', form.price.toString());
    if (form.width !== '') formData.append('width', form.width.toString());
    if (form.height !== '') formData.append('height', form.height.toString());
    if (form.depth !== '') formData.append('depth', form.depth.toString());
    formData.append('unit', form.unit || 'cm');
    if (form.img) formData.append('img', form.img);

    try {
      if (form.id) {
        await ProductService.updateProductSize(form.id, formData);
      } else {
        await ProductService.createProductSize(formData);
      }
      setIsModalOpen(false);
      fetchSizes();
    } catch (error: any) {
      alert("Gagal menyimpan varian ukuran: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (size: any) => {
    setForm({
      id: size.id,
      title: size.title || '',
      short_desc: size.short_desc || '',
      description: size.description || '',
      price: size.price !== null ? size.price.toString() : '',
      width: size.width !== null ? size.width.toString() : '',
      height: size.height !== null ? size.height.toString() : '',
      depth: size.depth !== null ? size.depth.toString() : '',
      unit: size.unit || 'cm',
      img: null // Kosongkan file input saat edit, hanya isi jika mau diubah
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus varian ukuran ini beserta gambarnya secara permanen?")) {
      try {
        await ProductService.deleteProductSize(id);
        setSizes(sizes.filter(s => s.id !== id));
      } catch (error: any) {
        alert("Gagal menghapus varian ukuran: " + error.message);
      }
    }
  };

  const openNewModal = () => {
    setForm({ id: '', title: '', short_desc: '', description: '', price: '', width: '', height: '', depth: '', unit: 'cm', img: null });
    setIsModalOpen(true);
  };

  return (
    <div className="font-sans animate-fadeIn">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-[#D9B35A]/20 pb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D1A11]">Panduan Proporsi (Size)</h3>
          <p className="text-[#8B7355] text-sm mt-1">Kelola varian ukuran produk (S, M, L) beserta dimensi dan harga tambahannya.</p>
        </div>
        <button onClick={openNewModal} className="px-6 py-3 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:-translate-y-0.5 transition-all">
          + Tambah Ukuran
        </button>
      </div>

      {/* LIST KARTU UKURAN */}
      {isLoading ? (
        <div className="py-20 text-center text-[#8B7355] animate-pulse">Memuat data ukuran...</div>
      ) : sizes.length === 0 ? (
        <div className="py-20 text-center bg-white/50 rounded-2xl border border-dashed border-[#D9B35A]/50 flex flex-col items-center">
          <span className="text-4xl mb-3">📏</span>
          <h4 className="text-lg font-bold text-[#2D1A11] mb-1">Belum Ada Varian Ukuran</h4>
          <p className="text-[#8B7355] text-sm">Tambahkan varian ukuran pertama untuk produk ini (Misal: Medium / M).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sizes.map((size) => (
            <div key={size.id} className="bg-white/90 border border-[#D9B35A]/20 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D9B35A]"></div>
              
              <div className="flex gap-5 mb-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D9B35A]/30 bg-[#FFFDF5] p-1 shadow-sm flex-shrink-0 flex items-center justify-center">
                  {size.img ? (
                    <img src={getImageUrl(size.img)} alt={size.title} className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <span className="text-xs font-bold text-[#8B7355] text-center">No Img</span>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-[#2D1A11] leading-tight mb-1">{size.title}</h4>
                  <p className="text-[10px] uppercase font-bold text-[#D9B35A] tracking-widest mb-1">{size.short_desc || '-'}</p>
                  <p className="text-sm font-black text-[#2D1A11]">
                    + Rp {Number(size.price).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Grid Dimensi */}
              <div className="grid grid-cols-3 gap-2 bg-[#FFFDF5] border border-[#D9B35A]/10 rounded-xl p-3 mb-4 text-center">
                <div>
                  <p className="text-[9px] uppercase font-bold text-[#8B7355] mb-0.5">Lebar (W)</p>
                  <p className="text-xs font-bold text-[#2D1A11]">{size.width || 0} {size.unit}</p>
                </div>
                <div className="border-x border-[#D9B35A]/10">
                  <p className="text-[9px] uppercase font-bold text-[#8B7355] mb-0.5">Tinggi (H)</p>
                  <p className="text-xs font-bold text-[#2D1A11]">{size.height || 0} {size.unit}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-[#8B7355] mb-0.5">Dalam (D)</p>
                  <p className="text-xs font-bold text-[#2D1A11]">{size.depth || 0} {size.unit}</p>
                </div>
              </div>

              <div className="mt-auto flex gap-3 pt-2">
                <button onClick={() => handleEdit(size)} className="flex-1 py-2.5 bg-gray-50 text-[11px] font-bold text-[#D9B35A] rounded-xl border border-gray-100 hover:bg-[#D9B35A] hover:text-white transition-all shadow-sm">Ubah Data</button>
                <button onClick={() => handleDelete(size.id)} className="flex-1 py-2.5 bg-gray-50 text-[11px] font-bold text-rose-500 rounded-xl border border-gray-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#2D1A11] mb-6 border-b border-[#D9B35A]/20 pb-3">
              {form.id === '' ? 'Tambah Varian Ukuran' : 'Edit Varian Ukuran'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Baris 1: Judul & Short Desc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Nama Ukuran (Cth: Large / L) *</label>
                  <input required maxLength={25} value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Sub Judul (Cth: Cocok untuk Laptop 15")</label>
                  <input maxLength={100} value={form.short_desc} onChange={e => setForm({...form, short_desc: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
              </div>

              {/* Baris 2: Dimensi & Unit */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <label className="text-[10px] uppercase font-bold text-[#2D1A11] block mb-3 border-b border-gray-200 pb-1">Detail Dimensi Fisik</label>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#8B7355] block mb-1">Lebar (Width)</label>
                    <input type="number" value={form.width} onChange={e => setForm({...form, width: e.target.value})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#8B7355] block mb-1">Tinggi (Height)</label>
                    <input type="number" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#8B7355] block mb-1">Kedalaman (Depth)</label>
                    <input type="number" value={form.depth} onChange={e => setForm({...form, depth: e.target.value})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-[#D9B35A]" />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold text-[#8B7355] block mb-1">Satuan</label>
                    <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="w-full bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-[#D9B35A]">
                      <option value="cm">cm</option>
                      <option value="mm">mm</option>
                      <option value="inch">inch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Baris 3: Harga Tambahan & Upload Gambar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Harga Tambahan (Rp)</label>
                  <input type="number" placeholder="0 jika tidak ada tambahan" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Gambar Visual Proporsi (Opsional)</label>
                  <input type="file" accept="image/*" onChange={e => setForm({...form, img: e.target.files ? e.target.files[0] : null})} className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#D9B35A]/10 file:text-[#D9B35A]" />
                </div>
              </div>

              {/* Baris 4: Deskripsi */}
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] block mb-1">Deskripsi Tambahan (Opsional)</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A] resize-none"></textarea>
              </div>

              {/* Aksi */}
              <div className="flex space-x-3 pt-4 border-t border-[#D9B35A]/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 rounded-xl bg-gray-100 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Batal</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#c4a150] transition-all">
                  {isSaving ? 'Menyimpan...' : 'Simpan Ukuran'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}