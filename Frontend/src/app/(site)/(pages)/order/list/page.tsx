import React from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";
import OrderList from "@/components/Orders/OrderList";

export const metadata: Metadata = {
  title: "Riwayat Pesanan | UpToYou Custom Bags",
  description: "Pantau status pesanan tas kustom Anda.",
};

const OrderListPage = () => {
  return (
    <>
      <Breadcrumb title={"Daftar Transaksi"} pages={["Orders"]} />
      <section className="py-20 bg-[#F9F6EE]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default OrderListPage;