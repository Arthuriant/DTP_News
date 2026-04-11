"use client";
import React, { useState } from 'react';

export default function Produk() {
  const [activeTab, setActiveTab] = useState('katalog');
  
  // State Data
  const [products, setProducts] = useState([
    { id: 1, nama: "Classic Tote Bag", kategori: "Kriya Tote Bag", harga: 1250000, status: "Aktif" },
    { id: 2, nama: "Urban Sling Bag", kategori: "Kriya Sling Bag", harga: 850000, status: "Aktif" },
  ]);

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: 0, nama: '', kategori: '', harga: 0, status: 'Aktif' });

  // URL Aksen Nusantara
  const megaMendungUrl = "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";
  const brownBatikUrl = "https://img.freepik.com/premium-photo/traditional-indonesian-batik-vector-pattern_1267718-2022.jpg";

  // Fungsi CRUD
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.id === 0) {
      setProducts([...products, { ...editForm, id: Date.now() }]);
    } else {
      setProducts(products.map(p => p.id === editForm.id ? editForm : p));
    }
    setIsModalOpen(false);
  };

  const handleEdit = (prod: any) => { setEditForm(prod); setIsModalOpen(true); };
  const handleDelete = (id: number) => { if (confirm("Hapus produk mahakarya ini?")) setProducts(products.filter(p => p.id !== id)); };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-[#2D1A11]" style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-[#D9B35A]/30 pb-6 px-2">
        <div>
          <p className="text-[#D9B35A] font-sans text-xs tracking-[0.3em] uppercase mb-2 font-bold">Inventaris Mahakarya</p>
          <h1 className="text-4xl font-bold tracking-tight">Manajemen Produk</h1>
          <p className="text-[#8B7355] font-sans text-sm mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D9B35A] rounded-full"></span>
            Kelola koleksi tas eksklusif dan opsi kustomisasi UpToYou.
          </p>
        </div>

        <button 
          onClick={() => { setEditForm({ id: 0, nama: '', kategori: '', harga: 0, status: 'Aktif' }); setIsModalOpen(true); }} 
          className="group relative bg-gradient-to-r from-[#EAC135] via-[#F4D145] to-[#DFB121] hover:shadow-[0_10px_25px_rgba(234,193,53,0.4)] text-[#1A1A1A] px-8 py-3.5 rounded-full font-serif font-bold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2.5 overflow-hidden border border-[#FFF6C5]/50 shadow-[0_5px_15px_rgba(234,193,53,0.3)]"
        >
          <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span className="relative z-10 flex items-center gap-2 tracking-wide">
            <span className="text-lg">✧</span> Tambah Produk Baru
          </span>
        </button>
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

      {/* ================= MAIN CONTENT SECTION ================= */}
      <div className="relative w-full pb-10 pt-2">
        
        {/* Aksen Mega Mendung Halus */}
        <div 
          className="absolute -right-10 -bottom-10 w-96 h-72 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom' }}
        ></div>

        <div className="overflow-x-auto px-4 -mx-4">
          <table className="w-full min-w-[1000px] text-sm whitespace-nowrap relative z-10 font-sans border-separate" style={{ borderSpacing: '0 16px' }}>
            
            {/* ================= TABLE HEADER MEWAH (COKLAT BATIK) ================= */}
            <thead className="text-[#D9B35A] uppercase text-[11px] font-bold tracking-[0.25em] shadow-xl">
               <tr 
                 className="bg-[#2D1A11] shadow-[0_10px_20px_rgba(45,26,17,0.2)]"
                 style={{
                   backgroundImage: `linear-gradient(rgba(45, 26, 17, 0.95), rgba(45, 26, 17, 0.95)), url('${brownBatikUrl}')`,
                   backgroundSize: '250px',
                   backgroundRepeat: 'repeat'
                 }}
               >
                 <th className="py-5 pl-8 pr-4 text-left rounded-l-2xl border-y border-l border-[#D9B35A]/20">Nama Produk</th>
                 <th className="py-5 px-4 text-left border-y border-[#D9B35A]/20">Kategori</th>
                 <th className="py-5 px-4 text-left border-y border-[#D9B35A]/20">Nilai Jual</th>
                 <th className="py-5 px-4 text-center border-y border-[#D9B35A]/20">Status</th>
                 <th className="py-5 pr-8 pl-4 text-right rounded-r-2xl border-y border-r border-[#D9B35A]/20">Kelola</th>
               </tr>
            </thead>
            
            {/* ================= TABLE BODY (FLOATING CARDS) ================= */}
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="group transition-all duration-300 hover:-translate-y-1.5">
                  <td className="py-5 pl-8 pr-4 text-left bg-white/60 backdrop-blur-xl rounded-l-2xl border-y border-l border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="font-bold text-[#2D1A11] text-base">{p.nama}</span>
                  </td>
                  <td className="py-5 px-4 text-left bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="text-[#8B7355] font-medium px-3 py-1 rounded-md bg-[#8B7355]/5 border border-[#8B7355]/10">{p.kategori}</span>
                  </td>
                  <td className="py-5 px-4 text-left bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="font-black text-[#D9B35A] text-base">Rp {p.harga.toLocaleString('id-ID')}</span>
                  </td>
                  <td className="py-5 px-4 text-center bg-white/60 backdrop-blur-xl border-y border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-5 pr-8 pl-4 text-right bg-white/60 backdrop-blur-xl rounded-r-2xl border-y border-r border-white/40 shadow-[0_10px_30px_-10px_rgba(45,26,17,0.08),inner_0_2px_4px_rgba(255,255,255,0.8)] group-hover:shadow-[0_15px_35px_-10px_rgba(217,179,90,0.2)] transition-shadow">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(p)} className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#D9B35A] text-[#D9B35A] transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-rose-300 text-rose-400 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL CRUD (GLASSMORPHISM COKLAT) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#2D1A11]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative overflow-hidden">
            {/* Aksen Batik Modal */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('${megaMendungUrl}')`, backgroundSize: 'contain' }}></div>
            
            <h2 className="text-2xl font-bold text-[#2D1A11] mb-8 flex items-center gap-3">
              <span className="text-[#D9B35A]">✧</span> {editForm.id === 0 ? 'Daftarkan Karya' : 'Perbarui Karya'}
            </h2>

            <form onSubmit={handleSave} className="space-y-5 font-sans">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Nama Produk</label>
                <input required type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full bg-[#FFFDF5] border border-gray-100 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm shadow-inner" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Kategori</label>
                <input required type="text" value={editForm.kategori} onChange={e => setEditForm({...editForm, kategori: e.target.value})} className="w-full bg-[#FFFDF5] border border-gray-100 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm shadow-inner" />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-[#8B7355] tracking-widest ml-1 mb-1 block">Harga (Rp)</label>
                <input required type="number" value={editForm.harga || ''} onChange={e => setEditForm({...editForm, harga: Number(e.target.value)})} className="w-full bg-[#FFFDF5] border border-gray-100 px-5 py-3.5 rounded-2xl focus:border-[#D9B35A] focus:ring-1 focus:ring-[#D9B35A] outline-none transition-all text-sm shadow-inner" />
              </div>

              <div className="flex space-x-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-full bg-white text-[#8B7355] font-bold text-xs uppercase tracking-widest border border-gray-100 hover:shadow-md transition-all">Batal</button>
                <button type="submit" className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#D9B35A]/20 hover:-translate-y-0.5 transition-all">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}