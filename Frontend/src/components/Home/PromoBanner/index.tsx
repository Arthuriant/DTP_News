import React from "react";
import Image from "next/image";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <span className="block font-medium text-xl text-dark mb-3">
              Tas Kerja Kulit Premium
            </span>

            <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
              DISKON HINGGA 30%
            </h2>

            <p>
              Tas kerja kulit Full Grain dengan kompartemen laptop empuk dan 
              strap bahu yang nyaman. Dibuat tangan untuk daya tahan seumur hidup.
            </p>

            <a
              href="#"
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
            >
              Beli Sekarang
            </a>
          </div>

          <Image
            src="/images/promo/promo-01.png"
            alt="promo img"
            className="absolute bottom-0 right-4 lg:right-26 -z-1"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
            {/* Card Promo Dompet */}
            {/* 1. Tambahkan flex dan justify-end di bungkus utama ini */}
            <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10 flex items-center justify-end">
              
              <Image
                src="/images/promo/promo-02.png"
                alt="promo img"
                className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
                width={241}
                height={241}
              />
              {/* 2. Batasi lebar teks dengan max-w-[60%] atau max-w-[50%] agar tidak menyeberang ke area gambar */}
              <div className="text-right relative z-10 max-w-[60%] sm:max-w-auto">
                <span className="block text-lg text-dark mb-1.5">
                  Dompet Kulit Asli
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                  Desain Ramping
                </h2>
                <p className="font-semibold text-custom-1 text-teal">
                  Diskon 20%
                </p>
                <a
                  href="#"
                  className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
                >
                  Ambil Sekarang
                </a>
              </div>
            </div>
          {/* */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <Image
              src="/images/promo/promo-03.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              width={200}
              height={200}
            />

            <div>
              <span className="block text-lg text-dark mb-1.5">
                Tas Travel Kulit
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                Diskon Sampai <span className="text-orange">40%</span> 
              </h2>

              <p className="max-w-[285px] text-custom-sm">
                Kapasitas luas untuk perjalanan akhir pekan Anda dengan material 
                kulit asli tahan air yang premium.
              </p>

              <a
                href="#"
                className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
              >
                Beli Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;