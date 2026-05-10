"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cart-slice";
import { OrderService } from "@/services/OrderService";
import Link from "next/link";

import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import Billing from "./Billing";

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- STATE PROFILE & ALAMAT ---
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- STATE FORMS ---
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  
  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    town: "",
    phone: "",
  });

  const [notes, setNotes] = useState(""); 

  // --- FETCH PROFILE & ALAMAT ---
  useEffect(() => {
    const fetchProfileAndAddress = async () => {
      try {
        // Fetch user
        const userRes = await fetch('/api-fe/proxy/user', {
          credentials: 'include',
        });

        // Fetch profile
        const profileRes = await fetch('/api-fe/proxy/profile', {
          credentials: 'include',
        });

        // Fetch alamat
        const addressRes = await fetch('/api-fe/proxy/addresses', {
          credentials: 'include',
        });

        if (userRes.ok && profileRes.ok) {
          const userData    = await userRes.json();
          const profileData = await profileRes.json();

          // Split nama jadi firstName & lastName
          const nameParts = (userData.name || '').split(' ');
          const firstName = nameParts[0] || '';
          const lastName  = nameParts.slice(1).join(' ') || '';

          setProfile({ ...userData, ...profileData });

          // Auto-fill billing data dari profile
          setBillingData(prev => ({
            ...prev,
            firstName: firstName,
            lastName:  lastName,
            email:     userData.email || '',
            phone:     profileData.phone || '',
          }));
        }

        if (addressRes.ok) {
          const addressData = await addressRes.json();
          setAddresses(addressData);

          // Auto-select alamat utama
          const primaryAddress = addressData.find((a: any) => a.is_primary) || addressData[0];
          if (primaryAddress) {
            setSelectedAddress(primaryAddress);
            setBillingData(prev => ({
              ...prev,
              address: primaryAddress.street || '',
              town:    primaryAddress.region || '',
              phone:   primaryAddress.phone_number || prev.phone,
            }));
          }
        }

      } catch (err) {
        console.error("Gagal fetch profile/alamat:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileAndAddress();
  }, []);

  // --- HANDLERS ---
  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingData({ ...billingData, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (address: any) => {
    setSelectedAddress(address);
    setBillingData(prev => ({
      ...prev,
      address: address.street || '',
      town:    address.region || '',
      phone:   address.phone_number || prev.phone,
    }));
  };


  // --- PERHITUNGAN HARGA ---
  const subtotal    = cartItems.reduce((acc, item) => acc + (Number(item.discountedPrice) * Number(item.quantity || 1)), 0);
  const shippingCost = shippingInfo?.cost ?? 0;
  const total        = subtotal + shippingCost;

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }
     if (!shippingInfo || shippingInfo.cost === 0) {
    alert("Pilih layanan pengiriman terlebih dahulu!");
    return;
  }

    setIsProcessing(true);

    try {
      const fullAddress = `${billingData.address}, ${billingData.town} | Catatan: ${notes || '-'}`;

      const response = await OrderService.checkout({
      shipping_address: fullAddress,
      payment_method:   "xendit_invoice", // ← fixed
      shipping_cost:    shippingInfo.cost,
      shipping_courier: shippingInfo.courier,
      shipping_service: shippingInfo.service,
      origin_id:        4816,
      destination_id:   shippingInfo.destination_id,
      customer_name:    `${billingData.firstName} ${billingData.lastName}`,
      customer_email:   billingData.email,
      customer_phone:   billingData.phone,
    });

      dispatch(clearCart());
      window.location.href = response.invoice_url;

    } catch (error: any) {
      console.error("Gagal checkout:", error);
      alert(error.message || "Terjadi kesalahan saat memproses pesanan.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-[#F9F6EE]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              
              <div className="lg:max-w-[670px] w-full">
                <Login />

                {/* PILIH ALAMAT */}
                {/* <div className="mt-9">
                  <h2 className="font-bold text-[#2D1A11] text-xl sm:text-2xl mb-5.5 flex items-center gap-2">
                    <span className="text-[#D9B35A]">✧</span> Pilih Alamat Pengiriman
                  </h2>
                  <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 p-4 sm:p-6 space-y-3">
                    
                    {addresses.length === 0 ? (
                      // Belum ada alamat — tampilkan pesan
                      <p className="text-sm text-[#8B7355] text-center py-4">
                        Belum ada alamat tersimpan. Tambahkan alamat pengiriman kamu.
                      </p>
                    ) : ( */}
                      {/* // Ada alamat — tampilkan list */}
                      {/* addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => handleAddressSelect(address)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            selectedAddress?.id === address.id
                              ? 'border-[#D9B35A] bg-[#D9B35A]/10'
                              : 'border-[#D9B35A]/20 hover:border-[#D9B35A]/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedAddress?.id === address.id ? 'border-[#D9B35A]' : 'border-gray-300'
                            }`}>
                              {selectedAddress?.id === address.id && (
                                <div className="w-2 h-2 rounded-full bg-[#D9B35A]"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#2D1A11] text-sm">
                                {address.recipient_name} ({address.phone_number})
                                {address.is_primary && (
                                  <span className="ml-2 text-xs bg-[#D9B35A] text-white px-2 py-0.5 rounded-full">Utama</span>
                                )}
                              </p>
                              <p className="text-[#8B7355] text-xs mt-1">{address.street}</p>
                              <p className="text-[#8B7355] text-xs">{address.region}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )} */}

                    {/* Tombol Tambah Alamat — selalu tampil */}
                    {/* <Link
                      href="/Profile?tab=alamat"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-dashed border-[#D9B35A]/50 text-[#D9B35A] text-sm font-bold hover:bg-[#D9B35A]/10 transition-all duration-200 mt-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Alamat Baru
                    </Link>

                  </div>
                </div> */}

                <Billing formData={billingData} handleInputChange={handleBillingChange} />
                <Shipping onShippingChange={setShippingInfo} />

                <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20 p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5 font-bold text-[#2D1A11]">Catatan Tambahan (opsional)</label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Pesan khusus atau instruksi pengiriman."
                      className="rounded-xl border border-[#D9B35A]/30 bg-white placeholder:text-[#8B7355]/50 w-full p-5 outline-none duration-200 focus:border-[#D9B35A] focus:ring-2 focus:ring-[#D9B35A]/20 text-[#2D1A11]"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-[#FFFDF5] shadow-sm rounded-2xl border border-[#D9B35A]/20">
                  <div className="border-b border-[#D9B35A]/30 py-5 px-4 sm:px-8.5 bg-[#D9B35A]/5 rounded-t-2xl">
                    <h3 className="font-bold text-xl text-[#2D1A11] flex items-center gap-2">
                      <span className="text-[#D9B35A]">✧</span> Ringkasan Pesanan
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                      <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest">Produk</h4>
                      <h4 className="font-bold text-[#8B7355] text-xs uppercase tracking-widest text-right">Subtotal</h4>
                    </div>

                    {cartItems.map((item, index) => {
                      const itemSubtotal = Number(item.discountedPrice) * Number(item.quantity || 1);
                      return (
                        <div key={index} className="flex items-center justify-between py-4 border-b border-[#D9B35A]/10 border-dashed">
                          <div className="pr-4">
                            <p className="text-[#2D1A11] font-medium text-sm line-clamp-1">
                              {item.title} <span className="text-[#8B7355] text-xs">(x{item.quantity || 1})</span>
                            </p>
                          </div>
                          <p className="text-[#8B7355] font-bold text-sm whitespace-nowrap text-right">
                            Rp {itemSubtotal.toLocaleString('id-ID')}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between py-5 border-b border-[#D9B35A]/20">
                      <p className="text-[#2D1A11] font-medium text-sm">
                        Biaya Pengiriman
                        {shippingInfo && (
                          <span className="text-[#8B7355] text-xs block">
                            {shippingInfo.courier.toUpperCase()} - {shippingInfo.service}
                          </span>
                        )}
                      </p>
                      <p className="text-[#8B7355] font-bold text-sm text-right">
                        {shippingInfo ? `Rp ${shippingCost.toLocaleString('id-ID')}` : '-'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <p className="font-bold text-lg text-[#2D1A11]">Total Akhir</p>
                      <p className="font-bold text-2xl text-[#D9B35A] text-right">Rp {total.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cartItems.length === 0 || !shippingInfo || shippingInfo.cost === 0} // ← ganti ini
                  className={`w-full flex justify-center font-bold py-[15px] px-6 rounded-full ease-out duration-200 mt-8 uppercase tracking-widest transition-all ${
                    isProcessing || cartItems.length === 0 || !shippingInfo || shippingInfo.cost === 0
                      ? "bg-[#D9B35A]/50 text-[#1A1A1A]/50 cursor-not-allowed shadow-none"
                      : "bg-gradient-to-r from-[#EAC135] to-[#DFB121] text-[#1A1A1A] hover:-translate-y-0.5 shadow-lg shadow-[#D9B35A]/20"
                  }`}
                >
                  {isProcessing ? "Memproses..." : "Selesaikan Pembayaran"}
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