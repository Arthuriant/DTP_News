"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import GenderDropdown from "./GenderDropdown";
import SizeDropdown from "./SizeDropdown";
import ColorsDropdwon from "./ColorsDropdwon"; 
import PriceDropdown from "./PriceDropdown";
import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";
import { ProductService } from "@/services/ProductService"; 
const ShopWithSidebar = () => {
  const [productStyle, setProductStyle] = useState("grid");
  const [productSidebar, setProductSidebar] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  // 👈 State untuk Data API
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  const options = [
    { label: "Koleksi Terbaru", value: "0" },
    { label: "Terlaris", value: "1" },
    { label: "Harga: Rendah ke Tinggi", value: "2" },
    { label: "Harga: Tinggi ke Rendah", value: "3" },
  ];

  // CATATAN: Data filter di bawah ini dibiarkan statis karena API belum menyediakan data agregasinya
  const categories = [
    { name: "Tas Kerja", products: 12, isRefined: true },
    { name: "Ransel", products: 15, isRefined: false },
    { name: "Tas Selempang", products: 8, isRefined: false },
    { name: "Tote Bag", products: 20, isRefined: false },
    { name: "Tas Travel & Liburan", products: 5, isRefined: false },
    { name: "Dompet & Clutch", products: 18, isRefined: false },
  ];

  const genders = [
    { name: "Pria", products: 24 },
    { name: "Wanita", products: 32 },
    { name: "Uniseks", products: 14 },
  ];

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event: any) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  // 👈 Fetch Data dari API saat halaman dimuat
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await ProductService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil data produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // URL Ornamen Latar Belakang
  const gununganUrl = "https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png";
  const wayangUrl = "https://www.shutterstock.com/shutterstock/photos/1411052360/display_1500/stock-photo-puppet-or-wayang-kulit-one-of-the-traditional-art-of-java-indonesia-mahabharata-and-ramayana-1411052360.jpg";

  return (
    <>
      <Breadcrumb
        title={"Telusuri Semua Produk"}
        pages={["Belanja"]}
      />
      
      {/* ================= BACKGROUND SECTION ================= */}
      <section className="overflow-hidden relative pb-24 pt-10 lg:pt-20 xl:pt-28 bg-[#F8F3E9] selection:bg-[#C5A059] selection:text-[#F8F3E9] antialiased">

        {/* Siluet Gunungan Pudar di Kanan Atas */}
        <div 
          className="absolute right-[-10%] top-[5%] w-[600px] h-[800px] pointer-events-none z-0 opacity-[0.05] mix-blend-multiply grayscale contrast-125"
          style={{ 
            backgroundImage: `url('${gununganUrl}')`, 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right top'
          }}
        ></div>

        {/* Siluet Wayang Pudar di Kiri Bawah */}
        <div 
          className="absolute left-[-5%] bottom-[10%] w-[450px] h-[750px] pointer-events-none z-0 opacity-[0.04] mix-blend-multiply grayscale contrast-125"
          style={{ 
            backgroundImage: `url('${wayangUrl}')`, 
            backgroundSize: 'contain', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom'
          }}
        ></div>

        {/* Glow Emas Halus di Tengah Layar */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#C5A059] blur-[150px] opacity-[0.12] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-0 relative z-10">
          <div className="flex gap-8 lg:gap-10">
            
            {/* ================= SIDEBAR FILTER ================= */}
            <div
              className={`sidebar-content fixed xl:z-1 z-[9999] left-0 top-0 xl:translate-x-0 xl:static max-w-[320px] xl:max-w-[280px] w-full ease-out duration-500 ${
                productSidebar
                  ? "translate-x-0 bg-[#Fdfbf7] shadow-2xl xl:shadow-none p-6 xl:p-0 h-screen overflow-y-auto border-r border-[#E5D7C1] xl:border-none xl:bg-transparent"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12 sm:-right-14 flex items-center justify-center w-10 h-10 rounded-r-xl bg-[#2D1A11] text-[#C5A059] shadow-[0_10px_20px_rgba(45,26,17,0.2)] border border-l-0 border-[#C5A059]/40 transition-all duration-300 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <svg className="fill-current w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.0068 3.44714C10.3121 3.72703 10.3328 4.20146 10.0529 4.5068L5.70494 9.25H20C20.4142 9.25 20.75 9.58579 20.75 10C20.75 10.4142 20.4142 10.75 20 10.75H4.00002C3.70259 10.75 3.43327 10.5742 3.3135 10.302C3.19374 10.0298 3.24617 9.71246 3.44715 9.49321L8.94715 3.49321C9.22704 3.18787 9.70147 3.16724 10.0068 3.44714Z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.6865 13.698C20.5668 13.4258 20.2974 13.25 20 13.25L4.00001 13.25C3.5858 13.25 3.25001 13.5858 3.25001 14C3.25001 14.4142 3.5858 14.75 4.00001 14.75L18.2951 14.75L13.9472 19.4932C13.6673 19.7985 13.6879 20.273 13.9932 20.5529C14.2986 20.8328 14.773 20.8121 15.0529 20.5068L20.5529 14.5068C20.7539 14.2876 20.8063 13.9703 20.6865 13.698Z" />
                </svg>
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-8">
                  <div className="bg-[#Fdfbf7] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] border border-[#E5D7C1] rounded-[1.25rem] py-5 px-6 relative overflow-hidden group">
                    <div className="absolute inset-1.5 border border-[#E5D7C1]/40 rounded-xl pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <p className="font-serif font-medium text-xl text-[#2D1A11] tracking-wide">Penyaringan</p>
                      <button type="reset" className="font-sans font-bold text-[9px] tracking-[0.15em] uppercase text-[#C5A059] hover:text-[#2D1A11] transition-colors duration-300">
                        Hapus Semua
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <CategoryDropdown categories={categories} />
                    <GenderDropdown genders={genders} />
                    <SizeDropdown />
                    <ColorsDropdwon />
                    <PriceDropdown />
                  </div>
                </div>
              </form>
            </div>

            {/* ================= MAIN CONTENT AREA ================= */}
            <div className="xl:max-w-[870px] w-full">
              
              <div className="rounded-[1.25rem] bg-[#Fdfbf7] border border-[#E5D7C1] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] pl-5 pr-3 py-3 mb-8 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10 flex-col sm:flex-row gap-4 sm:gap-0">
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect options={options} />
                    {/* 👈 Dibuat dinamis sesuai total data yang di-fetch */}
                    <p className="font-sans text-xs sm:text-sm text-[#6B442A]">
                      Menampilkan <span className="font-semibold text-[#2D1A11]">{products.length}</span> Mahakarya
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProductStyle("grid")}
                      title="Tampilan Kotak"
                      className={`${
                        productStyle === "grid"
                          ? "bg-[#2D1A11] border-[#2D1A11] text-[#C5A059] shadow-md"
                          : "text-[#6B442A] bg-transparent border-[#E5D7C1] hover:border-[#C5A059] hover:text-[#2D1A11]"
                      } flex items-center justify-center w-11 h-10 rounded-xl border ease-out duration-300 transition-all`}
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="6" height="6" rx="1" />
                        <rect x="10" y="2" width="6" height="6" rx="1" />
                        <rect x="2" y="10" width="6" height="6" rx="1" />
                        <rect x="10" y="10" width="6" height="6" rx="1" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      title="Tampilan Daftar"
                      className={`${
                        productStyle === "list"
                          ? "bg-[#2D1A11] border-[#2D1A11] text-[#C5A059] shadow-md"
                          : "text-[#6B442A] bg-transparent border-[#E5D7C1] hover:border-[#C5A059] hover:text-[#2D1A11]"
                      } flex items-center justify-center w-11 h-10 rounded-xl border ease-out duration-300 transition-all`}
                    >
                      <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="4" height="3" rx="0.5" />
                        <rect x="7" y="3" width="9" height="3" rx="0.5" />
                        <rect x="2" y="8" width="4" height="3" rx="0.5" />
                        <rect x="7" y="8" width="9" height="3" rx="0.5" />
                        <rect x="2" y="13" width="4" height="3" rx="0.5" />
                        <rect x="7" y="13" width="9" height="3" rx="0.5" />
                      </svg>
                    </button>
                  </div>
                  
                </div>
              </div>

              {/* Grid / List Layout */}
              <div
                className={`${
                  productStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
                    : "flex flex-col gap-8"
                }`}
              >
                {/* 👈 Cek Kondisi Loading di Sini */}
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-[#8B7355] font-semibold tracking-widest uppercase text-xs">Memuat Mahakarya...</p>
                  </div>
                ) : products.length > 0 ? (
                  products.map((item, key) =>
                    productStyle === "grid" ? (
                      <div key={item.id || key} className="relative group transition-transform duration-500 hover:-translate-y-2">
                         <SingleGridItem item={item} />
                      </div>
                    ) : (
                      <div key={item.id || key} className="relative group transition-transform duration-500 hover:-translate-x-1">
                        <SingleListItem item={item} />
                      </div>
                    )
                  )
                ) : (
                  <div className="col-span-full py-20 text-center text-[#8B7355] font-medium">
                    Belum ada produk yang tersedia.
                  </div>
                )}
              </div>

              {/* Pagination (Dibiarkan Bawaan Aslinya) */}
              <div className="flex justify-center mt-20 relative z-20">
                {/* Letakkan pagination orisinalmu di sini */}
              </div>
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopWithSidebar;