"use client";
import React, { useState } from 'react';

export default function Produk() {
  const [activeTab, setActiveTab] = useState('katalog');
  
  // State Data
  const [products, setProducts] = useState([
    { id: 1, nama: "Classic Tote Bag", kategori: "Tote Bag", harga: 1250000, status: "Aktif" },
    { id: 2, nama: "Urban Sling Bag", kategori: "Sling Bag", harga: 850000, status: "Aktif" },
  ]);

  // State Modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ id: 0, nama: '', kategori: '', harga: 0, status: 'Aktif' });

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
  const handleDelete = (id: number) => { if (confirm("Hapus produk?")) setProducts(products.filter(p => p.id !== id)); };

  return (
    <div className="space-y-8 max-w-[1500px] mx-auto text-slate-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Produk</h1>
          <p className="text-sm text-slate-500 mt-2">Kelola data tas dan opsi kustomisasi 3D.</p>
        </div>
        <button onClick={() => { setEditForm({ id: 0, nama: '', kategori: '', harga: 0, status: 'Aktif' }); setIsModalOpen(true); }} className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:-translate-y-1 transition-all">
          + Tambah Produk
        </button>
      </div>

      {/* Glass Card Utama */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/80 overflow-hidden">
        <div className="flex px-8 pt-6 space-x-8 border-b border-white/50">
          {['katalog', 'kompartemen', 'slicing'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-bold capitalize transition-all ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {activeTab === 'katalog' && (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-slate-400 border-b border-white/50">
                <tr><th className="pb-4">Nama Produk</th><th className="pb-4">Kategori</th><th className="pb-4">Harga</th><th className="pb-4">Status</th><th className="pb-4 text-center">Aksi</th></tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-4 font-bold text-slate-800">{p.nama}</td><td className="py-4">{p.kategori}</td><td className="py-4">Rp {p.harga.toLocaleString('id-ID')}</td>
                    <td className="py-4"><span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-green-500 shadow-sm">{p.status}</span></td>
                    <td className="py-4 flex justify-center space-x-2">
                      <button onClick={() => handleEdit(p)} className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md text-blue-500 transition">✏️</button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md text-red-500 transition">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Glassmorphism */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{editForm.id === 0 ? 'Tambah Baru' : 'Edit Data'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input required type="text" placeholder="Nama Produk" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className="w-full bg-white/50 border border-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
              <input required type="text" placeholder="Kategori" value={editForm.kategori} onChange={e => setEditForm({...editForm, kategori: e.target.value})} className="w-full bg-white/50 border border-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
              <input required type="number" placeholder="Harga" value={editForm.harga || ''} onChange={e => setEditForm({...editForm, harga: Number(e.target.value)})} className="w-full bg-white/50 border border-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white text-slate-500 font-bold hover:shadow-md transition">Batal</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg shadow-blue-200">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}