"use client";
import React, { useEffect, useState } from "react";
import { OrderService } from "@/services/OrderService";
import Link from "next/link";

const History = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setIsLoading(true);
        const data = await OrderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Gagal mengambil riwayat pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "pending";
    const styles: any = {
      pending: "bg-amber-50 text-amber-600 border-amber-200",        
      confirmed: "bg-sky-50 text-sky-600 border-sky-200",            
      processing: "bg-indigo-50 text-indigo-600 border-indigo-200",  
      shipped: "bg-blue-50 text-blue-600 border-blue-200",           
      delivered: "bg-teal-50 text-teal-600 border-teal-200",         
      completed: "bg-[#D9B35A]/10 text-[#D9B35A] border-[#D9B35A]", 
      cancelled: "bg-rose-50 text-rose-600 border-rose-200",         
    };
    
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${styles[normalizedStatus] || "bg-gray-50 text-gray-600"}`}>
        {normalizedStatus}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D9B35A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-20" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="border-b border-[#D9B35A]/30 pb-6">
        <h2 className="text-3xl font-bold text-[#2D1A11]">Riwayat Pesanan Anda</h2>
        <p className="text-[#8B7355] font-sans text-sm mt-1">Pantau proses pembuatan tas kustom impian Anda di sini.</p>
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => {
            const currentStatus = order.status?.toLowerCase();
            
            const mainDetail = order.details?.[0];
            const customConfig = mainDetail?.custom_configuration;
            const productInfo = mainDetail?.product;
            let productImg = "";
            const previewData = customConfig?.image_preview;

            productImg = `http://127.0.0.1:8000/storage/${productInfo.img}`;

            return (
              <div key={order.id} className="group bg-[#FFFDF5] border border-[#D9B35A]/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
                {/* Gambar Desain */}
                <div className="w-full md:w-48 h-48 bg-white flex items-center justify-center p-4 border-r border-[#D9B35A]/10">
                  {productImg ? (
                    <img src={productImg} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="text-[#D9B35A] opacity-20 text-4xl italic">UpToYou</div>
                  )}
                </div>

                {/* Detail Pesanan */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[#8B7355] font-sans text-[10px] uppercase tracking-[0.2em] font-bold mb-1">ID Pesanan: {order.id.split('-')[0]}</p>
                      <h3 className="text-[#2D1A11] font-bold text-xl">Kustom {productInfo?.name || "Tas"}</h3>
                      <p className="text-[#8B7355] font-sans text-xs mt-1 italic">{order.details?.length || 1} Item • Dipesan pada {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="flex justify-between items-end border-t border-[#D9B35A]/10 pt-4 mt-auto">
                    <div>
                      <p className="text-[#8B7355] font-sans text-[10px] uppercase font-bold">Total Pembayaran</p>
                      <p className="text-[#D9B35A] font-black text-xl">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                    </div>
                    
                    {currentStatus === 'pending' ? (
                      <Link href={`/order/success/${order.id}`} className="bg-[#2D1A11] text-[#D9B35A] px-6 py-2.5 rounded-full text-xs font-bold font-sans uppercase tracking-widest hover:bg-[#3d2519] transition-colors shadow-md">
                        Bayar Sekarang
                      </Link>
                    ) : (
                      <Link href={`/order/success/${order.id}`} className="bg-white border border-[#D9B35A] text-[#D9B35A] px-6 py-2.5 rounded-full text-xs font-bold font-sans uppercase tracking-widest hover:bg-[#D9B35A] hover:text-[#2D1A11] transition-colors">
                        Detail Struk
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-dashed border-[#D9B35A]/30">
          <p className="text-[#8B7355] italic">Anda belum memiliki riwayat pesanan.</p>
          <Link href="/shop" className="text-[#D9B35A] font-bold underline mt-2 inline-block">Mulai Kustom Tas Sekarang</Link>
        </div>
      )}
    </div>
  );
};

export default History;