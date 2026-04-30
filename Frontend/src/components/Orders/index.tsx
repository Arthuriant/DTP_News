"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderService } from "@/services/OrderService";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Menunggu Pembayaran", color: "text-amber-600",   bg: "bg-amber-50 border-amber-200" },
  confirmed:  { label: "Menunggu Konfirmasi", color: "text-blue-600",    bg: "bg-blue-50 border-blue-200" },
  processing: { label: "Sedang Diproses",     color: "text-purple-600",  bg: "bg-purple-50 border-purple-200" },
  shipped:    { label: "Sedang Dikirim",       color: "text-indigo-600",  bg: "bg-indigo-50 border-indigo-200" },
  delivered:  { label: "Sudah Sampai",         color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  cancelled:  { label: "Dibatalkan",           color: "text-rose-600",    bg: "bg-rose-50 border-rose-200" },
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders]     = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await OrderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleConfirm = async (orderId: string) => {
    if (!confirm("Konfirmasi pesanan sudah diterima?")) return;
    try {
      await OrderService.confirmReceived(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
    } catch (err: any) {
      alert(err.message || "Gagal konfirmasi.");
    }
  };

  const handlePay = (order: any) => {
    if (order.payment?.receipt_url) {
      window.open(order.payment.receipt_url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EE] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D9B35A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EE] py-20 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 border-b border-[#D9B35A]/30 pb-6">
          <h1 className="text-3xl font-bold text-[#2D1A11] flex items-center gap-3">
            <span className="text-[#D9B35A]">✧</span> Pesanan Saya
          </h1>
          <p className="text-[#8B7355] text-sm mt-2">Riwayat dan status pesanan kamu.</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#D9B35A]/30 rounded-2xl bg-white/50">
            <p className="text-[#8B7355] mb-4">Belum ada pesanan.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#D9B35A] text-white font-bold text-sm rounded-xl"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? { label: order.status, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" };

              return (
                <div key={order.id} className="bg-[#FFFDF5] border border-[#D9B35A]/20 rounded-2xl overflow-hidden shadow-sm">

                  {/* Header Order */}
                  <div className="px-6 py-4 bg-[#D9B35A]/5 border-b border-[#D9B35A]/20 flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase font-black text-[#8B7355] tracking-widest">ID Pesanan</p>
                      <p className="font-mono text-[#2D1A11] font-bold text-sm mt-0.5">{order.id.split('-')[0]}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-[#8B7355] tracking-widest mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Detail Order */}
                  <div className="px-6 py-5">

                    {/* Produk */}
                    {order.details?.map((detail: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-[#D9B35A]/10 last:border-0">
                        <p className="text-sm text-[#2D1A11] font-medium">
                          Produk Kustom <span className="text-[#8B7355]">x{detail.qty}</span>
                        </p>
                        <p className="text-sm font-bold text-[#2D1A11]">
                          Rp {Number(detail.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D9B35A]/20">
                      <p className="font-black text-[#2D1A11]">Total</p>
                      <p className="font-black text-xl text-[#D9B35A]">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Tanggal */}
                    <p className="text-xs text-[#8B7355] mt-2">
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="px-6 py-4 bg-[#F9F6EE] border-t border-[#D9B35A]/10 flex gap-3">

                    {/* Pending — belum bayar */}
                    {order.status === 'pending' && order.payment?.receipt_url && (
                      <button
                        onClick={() => handlePay(order)}
                        className="flex-1 py-3 bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        Bayar Sekarang
                      </button>
                    )}

                    {/* Shipped — konfirmasi terima */}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className="flex-1 py-3 bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        Konfirmasi Diterima
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}