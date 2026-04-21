"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ProductService } from '@/services/ProductService'; 
import { useParams, useRouter } from 'next/navigation'; // 👈 1. Import senjata rahasia kita


// Kita hapus interface props, karena komponen ini sekarang mandiri!
export default function ProductPartsTab() {
  // 👈 2. Ambil ID absolut langsung dari baris URL Browser!
  const params = useParams();
  const productId = params.id as string; 
  const router = useRouter();
  const [parts, setParts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    id: '',
    product_id: productId,
    name: '',
    z_index_front: 20,
    z_index_back: 10,
    z_index_top: 10,
  });

  // Fungsi kebal error untuk membaca format JSON dari Laravel
  const parseZIndex = (zIndexData: any) => {
    if (typeof zIndexData === 'string') {
      try { return JSON.parse(zIndexData); } catch (e) { return { Front: 0, Back: 0, Top: 0 }; }
    }
    return zIndexData || { Front: 0, Back: 0, Top: 0 };
  };

  const fetchParts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getParts();
      // Sekarang productId pasti terbaca, filter akan bekerja sempurna!
      const filteredParts = (data || []).filter((p: any) => p.product_id === productId);
      setParts(filteredParts);
    } catch (error) {
      console.error("Gagal mengambil data parts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    // Pastikan ID sudah didapat dari URL sebelum nge-fetch
    if (productId) fetchParts();
  }, [fetchParts, productId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      product_id: productId, // Sekarang ini 100% ada isinya!
      name: editForm.name,
      z_index: {
        Front: editForm.z_index_front,
        Back: editForm.z_index_back,
        Top: editForm.z_index_top
      }
    };

    try {
      if (editForm.id) {
        await ProductService.updatePart(editForm.id, payload);
      } else {
        await ProductService.createPart(payload);
      }
      await fetchParts();
      setIsModalOpen(false);
    } catch (error: any) {
      alert("Gagal Menyimpan: " + error.message);
    }
  };

  const handleEdit = (part: any) => {
    const parsedZ = parseZIndex(part.z_index);
    setEditForm({
      id: part.id,
      product_id: part.product_id,
      name: part.name,
      z_index_front: parsedZ.Front || 0,
      z_index_back: parsedZ.Back || 0,
      z_index_top: parsedZ.Top || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus komponen tas ini beserta foldernya secara permanen?")) {
      try {
        await ProductService.deletePart(id);
        setParts(parts.filter(p => p.id !== id));
      } catch (error) {
        console.error("Gagal menghapus part:", error);
      }
    }
  };

  const openNewModal = () => {
    setEditForm({ id: '', product_id: productId, name: '', z_index_front: 20, z_index_back: 10, z_index_top: 10 });
    setIsModalOpen(true);
  };

  return (
    <div className="font-sans animate-fadeIn">
      <div className="flex justify-between items-center mb-6 border-b border-[#D9B35A]/20 pb-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#2D1A11]">Komponen Slicing (Parts)</h3>
          <p className="text-[#8B7355] text-sm mt-1">Kelola potongan bagian tas untuk fitur 3D Customizer.</p>
        </div>
        <button onClick={openNewModal} className="px-5 py-2.5 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:-translate-y-0.5 transition-all">
          + Tambah Part
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-[#8B7355]">Memuat data komponen...</div>
      ) : parts.length === 0 ? (
        <div className="py-10 text-center bg-white/50 rounded-2xl border border-dashed border-[#D9B35A]/50 text-[#8B7355]">
          Belum ada komponen slicing. Tambahkan part pertama Anda (Misal: Badan Tas Depan).
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {parts.map((p) => {
         const z = parseZIndex(p.z_index);
         return (
           <div 
             key={p.id} 
             onClick={() => router.push(`/admin/produk/${productId}/part/${p.id}`)} // 👈 1. Kartu jadi tombol link
             className="group cursor-pointer bg-white/80 border border-[#D9B35A]/20 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex justify-between items-center"
           >
             <div>
               <p className="font-bold text-[#2D1A11] text-lg group-hover:text-[#D9B35A] transition-colors">{p.name}</p>
               <div className="flex gap-3 mt-2 text-[10px] uppercase font-bold text-[#8B7355] tracking-wider">
                 <span className="bg-[#FFFDF5] px-2 py-1 rounded border border-[#D9B35A]/10">Front: {z.Front}</span>
                 <span className="bg-[#FFFDF5] px-2 py-1 rounded border border-[#D9B35A]/10">Back: {z.Back}</span>
                 <span className="bg-[#FFFDF5] px-2 py-1 rounded border border-[#D9B35A]/10">Top: {z.Top}</span>
               </div>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={(e) => { e.stopPropagation(); handleEdit(p); }} // 👈 2. Cegah klik tembus ke kartu
                 className="p-2 text-[#D9B35A] hover:bg-[#D9B35A]/10 rounded-lg transition-colors relative z-10"
               >
                 Edit
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }} // 👈 2. Cegah klik tembus ke kartu
                 className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors relative z-10"
               >
                 Hapus
               </button>
             </div>
           </div>
         );
       })}
     </div>
      )}

      {/* Modal CRUD TETAP SAMA SEPERTI SEBELUMNYA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2D1A11] mb-6 border-b border-[#D9B35A]/20 pb-3">
              {editForm.id === '' ? 'Tambah Part Baru' : 'Edit Part Produk'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Nama Part (cth: Badan Depan)</label>
                <input required type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Z-Front</label>
                  <input required type="number" value={editForm.z_index_front} onChange={e => setEditForm({...editForm, z_index_front: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Z-Back</label>
                  <input required type="number" value={editForm.z_index_back} onChange={e => setEditForm({...editForm, z_index_back: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest block mb-1">Z-Top</label>
                  <input required type="number" value={editForm.z_index_top} onChange={e => setEditForm({...editForm, z_index_top: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-[#D9B35A]/20 px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#D9B35A]" />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-50 text-[#8B7355] font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#D9B35A] text-white font-bold text-xs uppercase tracking-widest shadow-md hover:bg-[#c4a150] transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}