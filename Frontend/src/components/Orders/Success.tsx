"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Success = () => {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api-fe/proxy/my-orders/${orderId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Gagal fetch order:", err);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const megaMendungUrl =
    "https://static.vecteezy.com/system/resources/thumbnails/024/034/191/small_2x/brown-ornament-batik-mega-mendung-cirebon-indonesia-with-transparent-background-png.png";

  return (
    <div
      className="min-h-screen bg-[#F9F6EE] flex items-center justify-center pt-54 pb-20 px-4 relative overflow-hidden"
      style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
    >
      {/* Aksesoris Latar Belakang */}
      <div
        className="absolute -left-20 -top-20 w-96 h-96 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('${megaMendungUrl}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div
        className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.03] pointer-events-none rotate-180"
        style={{
          backgroundImage: `url('${megaMendungUrl}')`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      <div className="max-w-2xl w-full bg-[#FFFDF5] rounded-3xl shadow-2xl border border-[#D9B35A]/30 p-8 md:p-12 relative z-10 text-center">
        {/* Ikon */}
        <div className="w-24 h-24 bg-gradient-to-br from-[#EAC135] to-[#DFB121] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#D9B35A]/30">
          <svg
            className="w-12 h-12 text-[#2D1A11]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-[#2D1A11] mb-4">
          {order?.status === "processing"
            ? "Pembayaran Berhasil!"
            : "Checkout Berhasil!"}
        </h1>
        <p className="text-[#8B7355] font-sans text-base md:text-lg mb-8 max-w-lg mx-auto">
          {order?.status === "processing"
            ? "Pembayaran Anda telah dikonfirmasi. Kami segera memproses pesanan Anda."
            : "Terima kasih atas pesanan Anda. Selesaikan pembayaran untuk memulai proses pengerjaan."}
        </p>

        <div className="bg-[#D9B35A]/5 border border-[#D9B35A]/20 rounded-2xl p-6 mb-8 text-left font-sans shadow-inner">
          {/* ID & Status */}
          <div className="flex flex-col md:flex-row justify-between mb-5 border-b border-[#D9B35A]/20 pb-5">
            <div>
              <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-1">
                ID Pesanan
              </p>
              <p className="text-[#2D1A11] font-black text-lg tracking-wide">
                {orderId?.split("-")[0].toUpperCase()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:text-right">
              <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-1">
                Status
              </p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  order?.status === "processing"
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
              >
                {order?.status || "Menunggu Pembayaran"}
              </span>
            </div>
          </div>

          {/* Detail Produk */}
          {order?.details?.[0] && (
            <div className="mb-5 border-b border-[#D9B35A]/20 pb-5">
              <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold mb-3">
                Detail Pesanan
              </p>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#D9B35A]/20">
                <div>
                  <p className="font-bold text-[#2D1A11]">
                    Kustom {order.details[0].product?.name}
                  </p>
                  <p className="text-[#8B7355] text-sm">
                    Qty: {order.details[0].qty}
                  </p>
                  <p className="text-[#D9B35A] font-bold">
                    Rp{" "}
                    {Number(order.details[0].price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center mb-5 border-b border-[#D9B35A]/20 pb-5">
            <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold">
              Total Pembayaran
            </p>
            <p className="text-[#D9B35A] font-black text-xl">
              Rp {Number(order?.total_amount).toLocaleString("id-ID")}
            </p>
          </div>

          {/* Metode Pembayaran */}
          <div className="flex justify-between items-center">
            <p className="text-[#8B7355] text-xs uppercase tracking-widest font-bold">
              Metode Pembayaran
            </p>
            <p className="text-[#2D1A11] font-bold text-sm">
              {order?.payment_method || "-"}
            </p>
          </div>

          {/* Link Invoice Xendit kalau masih pending */}
          {order?.status === "pending" &&
            order?.payment?.receipt_url && (
              <div className="mt-5 pt-5 border-t border-[#D9B35A]/20">
                <a
                  href={order.payment.receipt_url}
                  target="_blank"
                  className="w-full flex justify-center bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg"
                >
                  Bayar Sekarang via Xendit
                </a>
              </div>
            )}
        </div>

        {/* Tombol Navigasi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center font-sans">
          <Link
            href="/order/history"
            className="px-8 py-4 rounded-full font-bold text-[#8B7355] bg-white border border-[#D9B35A]/40 hover:bg-[#F9F6EE] hover:text-[#2D1A11] hover:border-[#D9B35A] transition-all shadow-sm w-full sm:w-auto text-sm uppercase tracking-widest"
          >
            Kembali Belanja
          </Link>
          <Link
            href="/order/history"
            className="px-8 py-4 rounded-full font-bold text-[#1A1A1A] bg-gradient-to-r from-[#EAC135] to-[#DFB121] hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20 transition-all w-full sm:w-auto text-sm uppercase tracking-widest text-center"
          >
            Lihat Pesanan Saya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;