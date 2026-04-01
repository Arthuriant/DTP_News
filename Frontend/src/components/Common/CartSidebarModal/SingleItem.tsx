import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";

const SingleItem = ({ item, removeItemFromCart }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = async () => {
    // 1. Hapus dari Redux (Agar tampilan UI langsung hilang tanpa loading)
    dispatch(removeItemFromCart(item.id));

    // 2. Lapor ke Laravel untuk menghapusnya dari Database
    try {
      await fetch(`http://127.0.0.1:8000/cart/${item.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Gagal menghapus dari database", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5 overflow-hidden">
          {/* Tampilkan gambar default dari produk */}
          {item.imgs?.thumbnails?.[0] ? (
            <Image
              src={item.imgs.thumbnails[0]}
              alt="product"
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-xs text-gray-400">No Image</div>
          )}
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            <a href="#"> {item.title} </a>
          </h3>
          <p className="text-custom-sm text-dark font-semibold">
            Rp {Number(item.discountedPrice).toLocaleString('id-ID')}
          </p>

          {/* 👇 INI ADALAH BAGIAN DETAIL KUSTOMISASI 👇 */}
          {item.customizations && (
            <div className="mt-2 flex flex-col gap-1.5">
              {/* Ukuran */}
              {item.customizations.size && (
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                  Ukuran: {item.customizations.size}
                </span>
              )}
              
              {/* Warna Badan Tas */}
              {item.customizations.colors?.body && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">Warna Utama:</span>
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: item.customizations.colors.body }}
                    title={`Hex: ${item.customizations.colors.body}`}
                  ></span>
                </div>
              )}
            </div>
          )}
          {/* 👆 BATAS DETAIL KUSTOMISASI 👆 */}

        </div>
      </div>

      <button
        onClick={handleRemoveFromCart}
        aria-label="button for remove product from cart"
        className="flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 text-dark ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
      >
        <svg
          className="fill-current"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.45017 2.06252H12.5498C12.7482 2.06239 12.921 2.06228 13.0842 2.08834C13.7289 2.19129 14.2868 2.59338 14.5883 3.17244C14.6646 3.319 14.7192 3.48298 14.7818 3.6712L14.8841 3.97819C14.9014 4.03015 14.9064 4.04486 14.9105 4.05645C15.0711 4.50022 15.4873 4.80021 15.959 4.81217C15.9714 4.81248 15.9866 4.81254 16.0417 4.81254H18.7917C19.1714 4.81254 19.4792 5.12034 19.4792 5.50004C19.4792 5.87973 19.1714 6.18754 18.7917 6.18754H3.20825C2.82856 6.18754 2.52075 5.87973 2.52075 5.50004C2.52075 5.12034 2.82856 4.81254 3.20825 4.81254H5.95833C6.01337 4.81254 6.02856 4.81248 6.04097 4.81217C6.51273 4.80021 6.92892 4.50024 7.08944 4.05647C7.09366 4.0448 7.09852 4.03041 7.11592 3.97819L7.21823 3.67122C7.28083 3.48301 7.33538 3.319 7.41171 3.17244C7.71324 2.59339 8.27112 2.19129 8.91581 2.08834C9.079 2.06228 9.25181 2.06239 9.45017 2.06252ZM8.25739 4.81254C8.30461 4.71993 8.34645 4.6237 8.38245 4.52419C8.39338 4.49397 8.4041 4.4618 8.41787 4.42048L8.50936 4.14601C8.59293 3.8953 8.61217 3.84416 8.63126 3.8075C8.73177 3.61448 8.91773 3.48045 9.13263 3.44614C9.17345 3.43962 9.22803 3.43754 9.49232 3.43754H12.5077C12.772 3.43754 12.8265 3.43962 12.8674 3.44614C13.0823 3.48045 13.2682 3.61449 13.3687 3.8075C13.3878 3.84416 13.4071 3.89529 13.4906 4.14601L13.5821 4.42031L13.6176 4.52421C13.6535 4.62372 13.6954 4.71994 13.7426 4.81254H8.25739Z"
            fill=""
          />
        </svg>
      </button>
    </div>
  );
};

export default SingleItem;