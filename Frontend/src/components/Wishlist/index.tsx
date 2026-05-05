"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import DynamicPart from "../Proto/DynamicPart";
import Link from "next/link";
import { AlertService } from "@/services/AlertService";

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Akses elemen estetik tema UpToYou
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api-fe/proxy/wishlist', {
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          setWishlistItems(json.data || []);
        }
      } catch (err) {
        console.error("Gagal fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId: string, wishlistId: string) => {
    // 1. Konfirmasi sebelum menghapus
    const isConfirmed = await AlertService.confirm(
      "Hapus dari Wishlist?",
      "Apakah Anda yakin ingin menghapus desain kustom ini dari daftar impian Anda?",
      "YA, HAPUS!"
    );

    if (!isConfirmed) return;

    try {
      // 2. Eksekusi API Hapus
      const res = await fetch(`/api-fe/proxy/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // 3. Hapus dari State UI
        setWishlistItems((prev) => prev.filter((w) => w.id !== wishlistId));
        // 4. Munculkan Alert Sukses
        AlertService.success("Terhapus!", "Desain berhasil dihapus dari Wishlist Anda.");
      } else {
        throw new Error("Gagal menghapus dari server");
      }
    } catch (error) {
      AlertService.error("Gagal", "Terjadi kesalahan saat menghapus data.");
    }
  };

  // Render preview kustomisasi menggunakan DynamicPart
  const renderPreview = (item: any) => {
    const customizations = item.customizations;
    const parts = item.product?.parts || [];

    if (!customizations || parts.length === 0) {
      return (
        <img
          src={item.product?.img || "/placeholder.png"}
          alt={item.product?.name}
          className="w-full h-full object-contain p-2"
        />
      );
    }

    const pov = "front";

    return (
      <div className="relative w-full h-full scale-[0.85] origin-center">
        {parts.map((part: any) => {
          if (!customizations.visibleParts?.[part.id]) return null;

          const activeShapeId = customizations.shapes?.[part.id];
          const variant = part.variants?.find((v: any) => v.id === activeShapeId) || part.variants?.[0];
          const textures = variant?.textures || [];
          const activeTextureId = customizations.textures?.[part.id];
          const textureObj = textures.find((t: any) => t.id === activeTextureId) || textures[0];

          const textureImageUrl = textureObj?.img_front || "";
          const color = customizations.colors?.[part.id] || "#FFFFFF";

          return (
            <DynamicPart
              key={part.id}
              productId={item.product.id}
              pov={pov}
              partName={part.name}
              color={color}
              texture={activeTextureId || ""}
              textureImageUrl={textureImageUrl}
              zIndex={part.z_index || 0}
            />
          );
        })}
      </div>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#F9F6EE]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D9B35A]"></div>
    </div>
  );

  return (
    <div className="bg-[#F9F6EE] min-h-screen relative font-sans">
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      
      {/* Background Ornamen */}
      <div 
        className="fixed right-0 bottom-0 w-[500px] h-[500px] opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url('${gununganUrl}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom right' }}
      ></div>

      <section className="overflow-hidden py-16 relative z-10">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          
          <div className="mb-10 text-center">
            <h2 className="text-[#2D1A11] text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
              Daftar <span className="text-[#D9B35A] italic">Impian</span> Anda
            </h2>
            <p className="text-[#8B7355] text-sm font-medium">Koleksi mahakarya desain tas yang telah Anda simpan.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(45,26,17,0.05)] border border-[#D9B35A]/20 overflow-hidden">
            <div className="w-full overflow-x-auto custom-scrollbar">
              <div className="min-w-[900px]">
                
                {/* Header Table */}
                <div className="flex items-center py-5 px-8 border-b border-[#D9B35A]/30 bg-[#FFFDF5]">
                  <div className="w-[120px]"></div>
                  <div className="flex-1 min-w-[300px]"><p className="text-[#8B7355] text-[10px] font-black uppercase tracking-[0.2em]">Detail Desain</p></div>
                  <div className="w-[180px]"><p className="text-[#8B7355] text-[10px] font-black uppercase tracking-[0.2em]">Estimasi Harga</p></div>
                  <div className="w-[150px]"><p className="text-[#8B7355] text-[10px] font-black uppercase tracking-[0.2em]">Status</p></div>
                  <div className="w-[200px] text-right"><p className="text-[#8B7355] text-[10px] font-black uppercase tracking-[0.2em]">Aksi</p></div>
                </div>

                {/* Items */}
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white/50">
                    <span className="text-6xl mb-4 opacity-30 text-[#D9B35A]">✧</span>
                    <p className="text-[#2D1A11] font-bold text-xl font-serif">Belum ada desain yang disimpan.</p>
                    <p className="text-[#8B7355] text-sm mt-2">Mulai kreasikan tas impian Anda sekarang!</p>
                    <Link href="/shop" className="mt-6 bg-[#2D1A11] text-[#D9B35A] px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#3d2417] transition-all hover:-translate-y-1 shadow-lg">
                      Mulai Kustomisasi
                    </Link>
                  </div>
                ) : (
                  wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center py-6 px-8 border-b border-[#D9B35A]/10 hover:bg-[#FFFDF5]/50 transition-colors group">
                      
                      {/* Preview Kustomisasi */}
                      <div className="w-[120px]">
                        <div className="relative w-24 h-24 bg-white border border-[#D9B35A]/20 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group-hover:border-[#D9B35A]/50 transition-colors">
                          {renderPreview(item)}
                        </div>
                      </div>

                      {/* Nama Produk */}
                      <div className="flex-1 min-w-[300px] pr-4">
                        <h3 className="text-[#2D1A11] font-bold text-lg font-serif mb-1 group-hover:text-[#D9B35A] transition-colors line-clamp-1">
                          {item.product?.name}
                        </h3>
                        <p className="text-[#8B7355] text-xs font-medium">
                          Desain Kustom {
                          item.customizations?.size 
                            ? `• Ukuran: ${item.product?.sizes?.find((s: any) => s.id === item.customizations.size)?.title || item.customizations.size}` 
                            : ""
                          }
                        </p>
                      </div>

                      {/* Harga */}
                      <div className="w-[180px]">
                        <p className="text-[#2D1A11] font-black text-lg">
                          Rp {parseFloat(item.total_price || item.product?.base_price || 0).toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="w-[150px]">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                          Tersedia
                        </span>
                      </div>

                      {/* Action */}
                      <div className="w-[200px] flex flex-col gap-2.5 items-end">
                        <Link
                          href={`/Proto?productId=${item.product_id}`}
                          className="w-full text-center bg-[#D9B35A] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c29e4b] hover:-translate-y-0.5 shadow-md transition-all"
                        >
                          Lanjut Kustomisasi
                        </Link>
                        <button
                          onClick={() => handleRemove(item.product_id, item.id)}
                          className="w-full text-center bg-transparent border border-[#8B7355]/30 text-[#8B7355] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          Hapus Daftar
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};