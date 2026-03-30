import React from "react";

export default function PreLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0806] overflow-hidden">
      
      {/* Latar Belakang Sangat Samar (Vibe Kultural) */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-screen pointer-events-none"
        style={{ 
          backgroundImage: `url('https://img.freepik.com/premium-vector/traditional-batik-pattern-from-indonesia-vector-illustration-batik-motifs-cloth-batik-national-day_354831-1016.jpg?w=2000')`,
          backgroundSize: '400px',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Cahaya Latar (Glow effect) yang Elegan */}
      <div className="absolute w-[400px] h-[400px] bg-[#C5A059] opacity-5 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative flex flex-col items-center z-10">
        
        <div className="relative flex items-center justify-center w-32 h-32 mb-8">
          {/* Garis Putar Tipis (Modern/Futuristik) */}
          <div className="absolute inset-0 border-[1px] border-dashed border-[#C5A059]/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
          
          {/* Lingkaran Solid Sangat Tipis */}
          <div className="absolute inset-2 border-[0.5px] border-[#C5A059]/20 rounded-full"></div>

          {/* Efek Riak Air (Ripple) yang Lembut */}
          <div className="absolute inset-4 bg-[#C5A059]/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>

          {/* Ikon Utama (Gunungan) dengan Efek Mengambang (Floating) */}
          <div className="relative w-12 h-14 flex items-center justify-center animate-[pulse_4s_ease-in-out_infinite]">
            <img 
              src="https://static.vecteezy.com/system/resources/previews/045/771/399/non_2x/indonesian-javanese-culture-golden-gunungan-wayang-shapes-free-png.png" 
              alt="Loading" 
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]"
            />
          </div>
        </div>

        {/* Tipografi Mahal: Jarak huruf sangat lebar, font tipis */}
        <div className="flex flex-col items-center">
          <h2 
            className="text-[#C5A059] text-sm md:text-base tracking-[0.4em] uppercase font-light drop-shadow-sm"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', serif" }}
          >
            Mempersiapkan
          </h2>
          
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent my-4"></div>
          
          <p className="text-[#8B7355] text-[9px] uppercase tracking-[0.3em] font-sans font-medium">
            Mahakarya Nusantara
          </p>
        </div>
      </div>

    </div>
  );
}