"use client";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";

const Checkout = () => {
  // Data produk yang dipilih untuk keranjang (contoh)
  const cartItems = [
    {
      name: "Classic Leather Briefcase",
      price: 129.0, // harga setelah diskon
    },
    {
      name: "Slim Leather Card Holder",
      price: 25.0,
    },
    {
      name: "Minimalist Leather Clutch",
      price: 65.0,
    },
  ];

  const shippingCost = 10.0;
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + shippingCost;

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* Kolom Kiri: Form Alamat, Login, Catatan */}
              <div className="lg:max-w-[670px] w-full">
                <Login />
                <Billing />
                <Shipping />

                {/* Catatan Tambahan */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Catatan Tambahan (opsional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Contoh: Pesan khusus untuk grafir inisial atau instruksi pengiriman."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Ringkasan Pesanan, Kupon, Pengiriman, Pembayaran */}
              <div className="max-w-[455px] w-full">
                {/* Ringkasan Pesanan */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Ringkasan Pesanan
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* Header Produk */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Produk</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* Daftar Produk dari Keranjang */}
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <div>
                          <p className="text-dark">{item.name}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Biaya Pengiriman */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Biaya Pengiriman</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">
                          ${shippingCost.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Total Akhir */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">
                          Total Akhir
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Komponen Tambahan */}
                <Coupon />
                <ShippingMethod />
                <PaymentMethod />

                {/* Tombol Submit */}
                <button
                  type="submit"
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Selesaikan Pembayaran
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;