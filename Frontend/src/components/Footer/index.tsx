"use client";
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#1E110A] text-[#EFE8DC]" style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}>
      
      {/* ================= BORDER ATAS (GARIS EMAS SOLID BERCANGGIH) ================= */}
      {/* Tanpa gambar, full efek CSS murni agar tajam, halus, dan mahal */}
      <div className="relative w-full z-20">
        {/* Garis Emas Utama (Tebal) */}
        <div className="w-full h-[6px] bg-gradient-to-r from-[#8B6B3D] via-[#D4AF37] to-[#8B6B3D] shadow-[0_4px_15px_rgba(0,0,0,0.8)]"></div>
        {/* Garis Emas Tipis di Bawahnya (Efek Double Line) */}
        <div className="w-full h-[1px] bg-[#C5A059]/40 mt-[3px]"></div>
        {/* Garis Emas Tipis Sekali lagi (Memberikan kesan tiga dimensi) */}
        <div className="w-full h-[1px] bg-[#C5A059]/20 mt-[2px]"></div>
      </div>

      {/* ================= BACKGROUND BATIK WATERMARK GLOBAL ================= */}
      {/* Motif Batik pudar sebagai watermark budaya Nusantara */}
      <div 
        className="absolute inset-0 top-[20px] w-full h-full opacity-[0.06] pointer-events-none mix-blend-overlay z-0"
        style={{ 
          backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`,
          backgroundSize: '300px', 
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Aksen Bintang Kanan Bawah */}
      <div className="absolute right-10 bottom-24 opacity-20 pointer-events-none z-0">
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" fill="#D4AF37"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 pt-12 xl:pt-16">
        
        {/* Grid Container Footer */}
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pb-10 xl:pb-15 border-b border-[#D4AF37]/10">
          
          {/* BAGIAN KIRI: Bantuan & Dukungan */}
          <div className="max-w-[330px] w-full">
            <h2 className="mb-7.5 text-xl font-serif text-[#D4AF37] tracking-widest font-bold">
              Bantuan & Dukungan
            </h2>

            <ul className="flex flex-col gap-4 font-sans text-sm tracking-wide text-[#EFE8DC]/80">
              <li className="flex gap-4 items-start group">
                <span className="flex-shrink-0 mt-0.5 text-[#C5A059] group-hover:text-[#D4AF37] transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.25 8.51464C4.25 4.45264 7.77146 1.25 12 1.25C16.2285 1.25 19.75 4.45264 19.75 8.51464C19.75 12.3258 17.3871 16.8 13.5748 18.4292C12.574 18.8569 11.426 18.8569 10.4252 18.4292C6.61289 16.8 4.25 12.3258 4.25 8.51464ZM12 2.75C8.49655 2.75 5.75 5.38076 5.75 8.51464ZM12 7.75C11.3096 7.75 10.75 8.30964 10.75 9C10.75 9.69036 11.3096 10.25 12 10.25C12.6904 10.25 13.25 9.69036 13.25 9C13.25 8.30964 12.6904 7.75 12 7.75ZM9.25 9C9.25 7.48122 10.4812 6.25 12 6.25C13.5188 6.25 14.75 7.48122 14.75 9C14.75 10.5188 13.5188 11.75 12 11.75C10.4812 11.75 9.25 10.5188 9.25 9ZM3.59541 14.9966C3.87344 15.3036 3.84992 15.7779 3.54288 16.0559C2.97519 16.57 2.75 17.0621 2.75 17.5C2.75 18.2637 3.47401 19.2048 5.23671 19.998C6.929 20.7596 9.31952 21.25 12 21.25C14.6805 21.25 17.071 20.7596 18.7633 19.998C20.526 19.2048 21.25 18.2637 21.25 17.5C21.25 17.0621 21.0248 16.57 20.4571 16.0559C20.1501 15.7779 20.1266 15.3036 20.4046 14.9966C20.6826 14.6895 21.1569 14.666 21.4639 14.9441C22.227 15.635 22.75 16.5011 22.75 17.5C22.75 19.2216 21.2354 20.5305 19.3788 21.3659C17.4518 22.2331 14.8424 22.75 12 22.75C9.15764 22.75 6.54815 22.2331 4.62116 21.3659C2.76457 20.5305 1.25 19.2216 1.25 17.5C1.25 16.5011 1.77305 15.635 2.53605 14.9441C2.84309 14.666 3.31738 14.6895 3.59541 14.9966Z" fill="currentColor"/>
                  </svg>
                </span>
                <span className="leading-relaxed">Jalan Kanayakan 21, Dago, Coblong, Bandung 40135, Jawa Barat, Indonesia.</span>
              </li>

              <li>
                <a href="#" className="flex items-center gap-4 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] group-hover:text-[#D4AF37] transition-colors">
                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C8.95 21 0 12.05 0 1C0 0.45 0.45 0 1 0H4.5C5.05 0 5.5 0.45 5.5 1C5.5 2.25 5.7 3.45 6.07 4.57C6.18 4.92 6.1 5.31 5.82 5.59L3.62 7.79C5.06 10.62 7.38 12.94 10.21 14.38" fill="currentColor"/>
                  </svg>
                  <span className="group-hover:text-[#D4AF37] transition-colors tracking-wider">(+6222) 2500241</span>
                </a>
              </li>

              <li>
                <a href="#" className="flex items-center gap-4 group">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] group-hover:text-[#D4AF37] transition-colors">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.31.79 2.51 1.38 3.56A8.03 8.03 0 0 1 5.08 16zm2.95-8H5.08a8.03 8.03 0 0 1 3.46-3.56A15.65 15.65 0 0 0 7.11 8zm4.89 11.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM10.27 14c-.08-.66-.14-1.32-.14-2s.06-1.34.14-2h3.46c.08.66.14 1.32.14 2s-.06 1.34-.14 2h-3.46zm1.73 6.04c-.01 0-.01 0 0 0zm3.74-3.56c.6-1.05 1.07-2.25 1.38-3.56h2.95a8.03 8.03 0 0 1-3.46 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" fill="currentColor"/>
                  </svg>
                  <span className="group-hover:text-[#D4AF37] transition-colors tracking-wider">polman-bandung.ac.id</span>
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-5 mt-8">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#EFE8DC] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1E110A] hover:scale-110 transition-all duration-300">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.03906H9.5C8.11929 2.03906 7 3.15835 7 4.53906V6.93604H5V9.43604H7V15.0391H9.5V9.43604H11.5L12 6.93604H9.5V4.53906H12V2.03906Z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#EFE8DC] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1E110A] hover:scale-110 transition-all duration-300">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4.74C18.339 5.029 17.626 5.222 16.881 5.32C17.648 4.86 18.227 4.139 18.5 3.28C17.79 3.701 17.001 4.009 16.159 4.17C15.485 3.45 14.526 3 13.464 3C11.423 3 9.771 4.66 9.771 6.7C9.771 6.99 9.797 7.268 9.853 7.536C6.796 7.381 4.076 5.924 2.253 3.67C1.936 4.215 1.752 4.856 1.752 5.539C1.752 6.822 2.406 7.95 3.396 8.614C2.79 8.594 2.22 8.428 1.723 8.151V8.196C1.723 9.988 2.998 11.48 4.686 11.821C4.375 11.905 4.048 11.95 3.711 11.95C3.473 11.95 3.243 11.927 3.023 11.884C3.493 13.353 4.857 14.42 6.474 14.45C5.207 15.443 3.61 16.033 1.882 16.033C1.579 16.033 1.282 16.015 0.99 15.98C2.636 17.037 4.582 17.66 6.671 17.66C13.493 17.66 17.221 12 17.221 7.106C17.221 6.946 17.217 6.786 17.21 6.629C17.935 6.103 18.567 5.467 19 4.74Z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#EFE8DC] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1E110A] hover:scale-110 transition-all duration-300">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 2.5C12.44 2.5 12.748 2.509 13.73 2.554C14.646 2.596 15.143 2.761 15.474 2.89C15.912 3.06 16.225 3.267 16.554 3.596C16.883 3.925 17.09 4.238 17.26 4.676C17.389 5.007 17.554 5.504 17.596 6.42C17.641 7.402 17.65 7.71 17.65 10.15V10.15ZM10 4.743C7.24 4.743 5.006 6.977 5.006 9.737C5.006 12.497 7.24 14.731 10 14.731C12.76 14.731 14.994 12.497 14.994 9.737C14.994 6.977 12.76 4.743 10 4.743ZM15.342 3.652C14.551 3.652 13.911 4.292 13.911 5.083C13.911 5.874 14.551 6.514 15.342 6.514C16.133 6.514 16.773 5.874 16.773 5.083C16.773 4.292 16.133 3.652 15.342 3.652ZM10 13.25C8.18799 13.25 6.75049 11.7812 6.75049 10C6.75049 8.21875 8.21924 6.75 10 6.75C11.813 6.75 13.2505 8.1875 13.2505 10C13.2505 11.8125 11.813 13.25 10 13.25Z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-[#EFE8DC] hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#1E110A] hover:scale-110 transition-all duration-300">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6535 1.6665H3.34619C2.87744 1.6665 2.4738 1.83577 2.13525 2.17432C1.82275 2.48682 1.6665 2.87744 1.6665 3.34619V16.6535C1.6665 17.1222 1.82275 17.5259 2.13525 17.8644C2.4738 18.1769 2.87744 18.3332 3.34619 18.3332H16.6535C17.1222 18.3332 17.5129 18.1769 17.8254 17.8644C18.1639 17.5259 18.3332 17.1222 18.3332 16.6535V3.34619C18.3332 2.87744 18.1639 2.48682 17.8254 2.17432C17.5129 1.83577 17.1222 1.6665 16.6535 1.6665ZM5.74202 7.14827C6.13265 7.14827 6.45817 7.01807 6.71859 6.75765C7.00505 6.47119 7.14827 6.13265 7.14827 5.74202C7.14827 5.3514 7.00505 5.02588 6.71859 4.76546C6.45817 4.479 6.13265 4.33577 5.74202 4.33577C5.3514 4.33577 5.01286 4.479 4.7264 4.76546C4.46598 5.02588 4.33577 5.3514 4.33577 5.74202C4.33577 6.13265 4.46598 6.47119 4.7264 6.75765C5.01286 7.01807 5.3514 7.14827 5.74202 7.14827Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* BAGIAN TENGAH: Akun */}
          <div className="w-full sm:w-auto mt-2">
            <h2 className="mb-7.5 text-xl font-serif text-[#D4AF37] tracking-wider font-bold">
              Akun
            </h2>

            <ul className="flex flex-col gap-4 font-sans text-sm tracking-wide">
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Akun Saya
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Login / Register
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Keranjang
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Belanja
                </a>
              </li>
            </ul>
          </div>

          {/* BAGIAN KANAN: Tautan Cepat */}
          <div className="w-full sm:w-auto mt-2">
            <h2 className="mb-7.5 text-xl font-serif text-[#D4AF37] tracking-wider font-bold">
              Tautan Cepat
            </h2>

            <ul className="flex flex-col gap-4 font-sans text-sm tracking-wide">
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Ketentuan Penggunaan
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  FAQ
                </a>
              </li>
              <li>
                <a className="text-[#EFE8DC]/80 ease-out duration-300 hover:text-[#D4AF37] hover:translate-x-1.5 inline-block" href="#">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="relative z-10 border-t border-[#D4AF37]/20 py-6 bg-[#160B08]">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-[#EFE8DC]/60 font-sans text-sm tracking-wide">
              &copy; {year}. Mahakarya Nusantara. All rights reserved by PimjoLabs.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;