"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import DynamicPart from "../Proto/DynamicPart";
import Link from "next/link";

export const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    await fetch(`/api-fe/proxy/wishlist/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    setWishlistItems((prev) => prev.filter((w) => w.id !== wishlistId));
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
          className="w-full h-full object-contain"
        />
      );
    }

    const pov = "front";

    return (
      <div className="relative w-full h-full">
        {parts.map((part: any) => {
          if (!customizations.visibleParts?.[part.id]) return null;

          const activeShapeId = customizations.shapes?.[part.id];
          const variant = part.variants?.find((v: any) => v.id === activeShapeId)
            || part.variants?.[0];
          const textures = variant?.textures || [];
          const activeTextureId = customizations.textures?.[part.id];
          const textureObj = textures.find((t: any) => t.id === activeTextureId)
            || textures[0];

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
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C5A059]"></div>
    </div>
  );

  return (
    <>
      <Breadcrumb title={"Wishlist"} pages={["Wishlist"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
            <h2 className="font-medium text-dark text-2xl">Your Wishlist</h2>
          </div>

          <div className="bg-white rounded-[10px] shadow-1">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[1170px]">
                {/* Header */}
                <div className="flex items-center py-5.5 px-10">
                  <div className="min-w-[83px]"></div>
                  <div className="min-w-[387px]"><p className="text-dark">Product</p></div>
                  <div className="min-w-[205px]"><p className="text-dark">Unit Price</p></div>
                  <div className="min-w-[265px]"><p className="text-dark">Stock Status</p></div>
                  <div className="min-w-[150px]"><p className="text-dark text-right">Action</p></div>
                </div>

                {/* Items */}
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    Wishlist kamu masih kosong.
                  </div>
                ) : (
                  wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center py-5 px-10 border-t border-gray-100">
                      
                      {/* Preview Kustomisasi */}
                      <div className="min-w-[83px]">
                        <div className="relative w-16 h-16 bg-[#BFA690] rounded-lg overflow-hidden">
                          {renderPreview(item)}
                        </div>
                      </div>

                      {/* Nama Produk */}
                      <div className="min-w-[387px]">
                        <p className="text-dark font-medium">{item.product?.name}</p>
                        {item.customizations && (
                          <p className="text-xs text-gray-400 mt-1">
                            Ukuran: {
                            item.product?.sizes?.find((s: any) => s.id === item.customizations.size)?.title
                            || item.customizations.size
                            || "-"
                          }
                          </p>
                        )}
                      </div>

                      {/* Harga */}
                      <div className="min-w-[205px]">
                        <p className="text-dark">
                          Rp {parseFloat(item.total_price || item.product?.base_price || 0).toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="min-w-[265px]">
                        <span className="text-green-500 font-medium text-sm">In Stock</span>
                      </div>

                      {/* Action */}
                    <div className="min-w-[150px] flex flex-col gap-2 items-end">
                      <Link
                        href={`/Proto?productId=${item.product_id}`}
                        className="text-xs px-4 py-2 rounded-full border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all duration-300"
                      >
                        Kustomisasi
                      </Link>
                      <button
                        onClick={() => handleRemove(item.product_id, item.id)}
                        className="text-xs px-4 py-2 rounded-full border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all duration-300"
                      >
                        Hapus
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
    </>
  );
};