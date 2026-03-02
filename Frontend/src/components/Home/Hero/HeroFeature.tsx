import React from "react";
import Image from "next/image";

const featureData = [
  {
    img: "/images/icons/icon-01.svg",
    title: "Gratis Pengiriman",
    description: "Untuk setiap pembelian minimal Rp2.000.000",
  },
  {
    img: "/images/icons/icon-02.svg",
    title: "1 Hari Pengembalian",
    description: "Pembatalan dapat dilakukan dalam waktu 1 hari setelah pemesanan.",
  },
  {
    img: "/images/icons/icon-03.svg",
    title: "100% Pembayaran Aman",
    description: "Transaksi dijamin aman.",
  },
  {
    img: "/images/icons/icon-04.svg",
    title: "Dukungan 24/7",
    description: "Siap membantu kapan saja.",
  },
];

const HeroFeature = () => {
  return (
    <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0">
      {/* Mengubah flex menjadi grid dengan 2 kolom pada layar sedang/besar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7.5 xl:gap-12.5 mt-10">
        {featureData.map((item, key) => (
          <div className="flex items-center gap-4" key={key}>
            <Image src={item.img} alt="icons" width={40} height={41} />

            <div>
              <h3 className="font-medium text-lg text-dark">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeature;
