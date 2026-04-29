import React from "react";
import Success from "@/components/Orders/Success";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Sukses | UpToYou Custom Bags",
  description: "Pesanan tas kustom Anda telah berhasil dibuat dan menunggu pembayaran.",
};

const OrderSuccessPage = () => {
  return (
    <>
      <Success />
    </>
  );
};

export default OrderSuccessPage;