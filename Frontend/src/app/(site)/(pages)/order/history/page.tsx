import React from "react";
import History from "@/components/Orders/History";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Pesanan | UpToYou Custom Bags",
  description: "Pantau status pesanan tas kustom Anda.",
};

const OrderHistoryPage = () => {
  return (
    <>
      <Breadcrumb title={"Riwayat Pesanan"} pages={["Orders"]} />
      <section className="py-20 bg-[#F9F6EE]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8">
          <History />
        </div>
      </section>
    </>
  );
};

export default OrderHistoryPage;