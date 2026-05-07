"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SingleGridItem, { ProductAPI } from "@/components/Shop/SingleGridItem";

const NewArrival = () => {
  const [products, setProducts] = useState<ProductAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api-fe/proxy/products');
        if (res.ok) {
          const json = await res.json();
          setProducts(json.data?.slice(0, 4) || []); // ambil 4 produk terbaru
        }
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#F8F3E9] py-16 lg:py-24">
      
      {/* ORNAMEN */}
      <div 
        className="absolute right-[-8%] top-[-5%] w-[500px] h-[700px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
        style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'right top' }}
      ></div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10">
        
        {/* HEADER */}
        <div className="mb-14 flex flex-col md:flex-row items-center justify-between border-b border-[#C5A059]/30 pb-6 gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="flex items-center gap-3 font-sans font-bold tracking-[0.3em] text-[#C5A059] text-[10px] uppercase mb-3">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                <path d="M3.11826 15.4622C4.11794 16.6668 5.97853 16.6668 9.69971 16.6668H10.3007C14.0219 16.6668 15.8825 16.6668 16.8821 15.4622M3.11826 15.4622C2.11857 14.2577 2.46146 12.429 3.14723 8.77153C3.63491 6.17055 3.87875 4.87006 4.8045 4.10175M3.11826 15.4622C3.11826 15.4622 3.11826 15.4622 3.11826 15.4622ZM16.8821 15.4622C17.8818 14.2577 17.5389 12.429 16.8532 8.77153C16.3655 6.17055 16.1216 4.87006 15.1959 4.10175M16.8821 15.4622C16.8821 15.4622 16.8821 15.4622 16.8821 15.4622ZM15.1959 4.10175C14.2701 3.33345 12.947 3.33345 10.3007 3.33345H9.69971C7.0534 3.33345 5.73025 3.33345 4.8045 4.10175M15.1959 4.10175C15.1959 4.10175 15.1959 4.10175 15.1959 4.10175ZM4.8045 4.10175C4.8045 4.10175 4.8045 4.10175 4.8045 4.10175Z" stroke="#C5A059" strokeWidth="1.5"/>
                <path d="M7.64258 6.66678C7.98578 7.63778 8.91181 8.33345 10.0003 8.33345C11.0888 8.33345 12.0149 7.63778 12.3581 6.66678" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Edisi Perdana
            </span>
            <h2 className="font-serif font-light text-3xl lg:text-4xl text-[#2D1A11] uppercase tracking-[0.1em]">
              Koleksi <span className="text-[#C5A059] font-medium italic">Terbaru</span>
            </h2>
          </div>
          <Link href="/shop-with-sidebar" className="inline-flex items-center justify-center font-sans font-bold text-[10px] tracking-[0.2em] uppercase text-[#2D1A11] rounded-full border border-[#C5A059]/60 bg-transparent py-3 px-8 hover:bg-[#C5A059] hover:text-[#F8F3E9] transition-all">
            Lihat Semua Koleksi
          </Link>
        </div>

        {/* GRID PRODUK */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((item) => (
              <div key={item.id} className="relative group transition-transform duration-500 hover:-translate-y-2">
                <SingleGridItem item={item} />
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
};

export default NewArrival;