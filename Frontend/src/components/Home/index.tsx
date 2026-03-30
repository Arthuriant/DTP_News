import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import CounDown from "./Countdown";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";

const Home = () => {
  return (
    <main className="relative w-full min-h-screen bg-[#F8F3E9] text-[#2D1A11] selection:bg-[#C5A059] selection:text-[#F8F3E9] overflow-x-hidden font-sans antialiased scroll-smooth">
      
      {/* ================= GLOBAL PREMIUM EFFECTS ================= */}
      {/* Vinyet Gelap Halus di Ujung Layar (Fokuskan mata ke tengah) */}
      <div className="pointer-events-none fixed inset-0 z-50 mix-blend-multiply opacity-[0.04] shadow-[inset_0_0_150px_rgba(45,26,17,1)]"></div>

      {/* Susunan Mahakarya Nusantara */}
      <div className="relative z-10 flex flex-col">
        <Hero />
        <Categories />
        <NewArrival />
        <PromoBanner />
        <BestSeller />
        <CounDown />
        <Testimonials />
        <Newsletter />
      </div>

    </main>
  );
};

export default Home;