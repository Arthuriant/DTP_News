import React from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

const BlogDetails = () => {
  return (
    <>
      <Breadcrumb 
        title={"Cara Merawat Tas Kulit Agar Awet"} 
        pages={["blog", "merawat-tas-kulit"]} 
      />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            <Image
              className="rounded-[10px]"
              src="/images/blog/blog-01.jpg"
              alt="Merawat Tas Kulit"
              width={750}
              height={477}
            />
          </div>

          <div>
            <span className="flex items-center gap-3 mb-4">
              <a href="#" className="ease-out duration-200 hover:text-blue">
                Apr 15, 2024
              </a>

              {/* */}
              <span className="block w-px h-4 bg-gray-4"></span>

              <a href="#" className="ease-out duration-200 hover:text-blue">
                15k Views
              </a>
            </span>

            <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">
              Cara Merawat Tas Kulit Agar Awet dan Tetap Mengkilap
            </h2>

            <p className="mb-6">
              Tas kulit adalah investasi jangka panjang. Dengan perawatan yang tepat, tas kulit kesayangan Anda bisa bertahan puluhan tahun, bahkan menjadi warisan. Namun, banyak orang yang masih bingung bagaimana cara merawatnya agar tetap awet dan mengkilap. Artikel ini akan membahas langkah-langkah mudah yang bisa Anda lakukan di rumah.
            </p>

            <p className="mb-6">
              Kulit asli, terutama jenis full grain dan top grain, memiliki pori-pori alami yang membuatnya 'bernapas'. Karena itu, perawatannya berbeda dengan bahan sintetis. Debu, keringat, dan minyak dari tangan bisa menumpuk dan membuat kulit kusam jika tidak dibersihkan secara rutin.
            </p>

            <p>
              Langkah pertama yang paling penting adalah membersihkan tas secara teratur. Gunakan kain lembut yang sedikit lembap untuk mengangkat debu dan kotoran. Hindari penggunaan tisu basah atau pembersih berbahan kimia keras karena dapat merusak lapisan kulit.
            </p>

            <div className="mt-7.5">
              <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-6">
                Langkah-Langkah Perawatan Harian:
              </h3>

              <ul className="list-disc pl-6">
                <li>Lap tas dengan kain mikrofiber setelah setiap pemakaian untuk menghilangkan debu.</li>
                <li>Hindari menggantung tas dalam waktu lama; isi dengan kertas tisu agar bentuknya tetap.</li>
                <li>Jauhkan dari paparan sinar matahari langsung dan sumber panas seperti radiator.</li>
                <li>Gunakan conditioner khusus kulit setiap 3-6 bulan untuk menjaga kelembapan.</li>
                <li>Jika terkena air, segera lap kering dan biarkan mengering secara alami di suhu ruang.</li>
              </ul>
            </div>

            <div className="rounded-xl bg-white pt-7.5 pb-6 px-4 sm:px-7.5 my-7.5">
              <p className="italic text-dark text-center">
                “Sejak saya rutin membersihkan dan memberi conditioner setiap 3 bulan, tas kulit kesayangan saya tetap terlihat baru meski sudah dipakai 5 tahun. Kuncinya adalah konsisten dan menggunakan produk yang tepat.”
              </p>

              <a
                href="#"
                className="flex items-center justify-center gap-3 mt-5.5"
              >
                <div className="flex w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/images/users/user-04.jpg"
                    alt="user"
                    width={48}
                    height={48}
                  />
                </div>

                <div>
                  <h4 className="text-dark text-custom-sm">Rina Wijaya</h4>
                  <p className="text-custom-xs">Kolektor Tas Kulit</p>
                </div>
              </a>
            </div>

            <p className="mb-6">
              Untuk noda membandel seperti tinta atau minyak, jangan pernah menggosok dengan keras. Gunakan pembersih khusus kulit sesuai petunjuk. Anda juga bisa berkonsultasi dengan jasa perawatan kulit profesional untuk penanganan lebih lanjut.
            </p>

            <p className="mb-6">
              Selain perawatan rutin, penyimpanan juga memegang peranan penting. Simpan tas di dalam dust bag yang disertakan saat pembelian, dan hindari menyimpan tas dalam kondisi lembap. Jika memungkinkan, letakkan silica gel di dalam lemari penyimpanan untuk menyerap kelembapan.
            </p>

            <p>
              Dengan perawatan yang tepat, tas kulit tidak hanya awet, tetapi juga semakin cantik seiring waktu karena terbentuk patina—lapisan mengilap alami yang menjadi ciri khas kulit berkualitas. Mulailah merawat tas kulit Anda hari ini dan nikmati keindahannya untuk tahun-tahun mendatang.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-10 mt-10">
              <div className="flex flex-wrap items-center gap-5">
                <p>Popular Tags :</p>

                <ul className="flex flex-wrap items-center gap-3.5">
                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      Tas Kulit
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      Perawatan Kulit
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-flex hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue"
                      href="#"
                    >
                      Patina
                    </a>
                  </li>
                </ul>
              </div>

              {/* */}
              <div className="flex items-center gap-3">
                {/* Pinterest/Social 1 */}
                <a
                  href="#"
                  className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#BD081C] ease-in duration-200 hover:bg-opacity-95"
                >
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <g clipPath="url(#clip0_190_5507)">
                      <path
                        d="M0.47827 8.52675C0.531395 10.9971 1.67359 13.4674 3.61264 14.9549C4.22357 15.4064 4.88764 15.6721 5.57826 15.9642C5.28607 14.0783 6.00326 12.1924 6.4017 10.333C6.45482 10.1471 6.48139 9.93456 6.48139 9.72206C6.48139 9.42987 6.37514 9.13769 6.29545 8.8455C6.21576 8.36737 6.26889 7.86269 6.48139 7.41112C6.77357 6.80019 7.4642 6.32206 8.07514 6.56112C8.63295 6.77362 8.84545 7.51737 8.7392 8.10175C8.63295 8.71269 8.3142 9.24394 8.15482 9.82831C7.96889 10.4127 7.99545 11.1299 8.42045 11.5283C8.81889 11.9002 9.45639 11.9267 9.96107 11.7142C10.7048 11.3955 11.1829 10.6517 11.4751 9.908C12.0064 8.52675 11.9001 6.77362 10.8111 5.76425C10.3595 5.31269 9.72201 5.0205 9.03139 4.91425C7.86264 4.72831 6.58764 5.07362 5.7642 5.92362C4.94076 6.77362 4.56889 8.07519 4.9142 9.19081C5.02045 9.56269 5.23295 9.93456 5.31264 10.3064C5.39232 10.6783 5.36576 11.1564 5.10014 11.4221C5.07358 11.4486 5.04701 11.4752 4.99389 11.5017C4.94076 11.5283 4.86107 11.4752 4.80795 11.4486C4.30326 11.1299 3.90482 10.6252 3.66576 10.0939C2.92201 8.47362 3.29389 6.45487 4.46264 5.12675C5.63139 3.79862 7.51732 3.16112 9.27045 3.40019C10.9173 3.61269 12.5376 4.5955 13.2283 6.10956C13.6533 7.01269 13.7329 8.04862 13.5736 9.03144C13.4142 10.0408 13.0158 10.9971 12.3517 11.7674C11.6876 12.5377 10.7314 13.0689 9.72201 13.1221C8.89857 13.1752 8.02201 12.883 7.59701 12.1924C7.33139 13.6267 6.8267 15.0346 6.08295 16.283C6.05639 16.3361 7.78295 16.708 7.94232 16.708C9.90795 16.8674 12.0064 16.0971 13.547 14.8752C17.797 11.5017 17.3454 5.04706 13.1486 1.85957C10.9704 0.186128 8.39389 -0.132622 5.84389 0.770504C5.07357 1.03613 4.35639 1.48769 3.69232 1.96582C2.62983 2.76269 1.77983 3.79862 1.22202 4.99394C0.664207 6.083 0.451707 7.30487 0.47827 8.52675Z"
                        fill="white"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_190_5507">
                        <rect width="17" height="17" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                {/* LinkedIn/Social 2 */}
                <a
                  href="#"
                  className="flex items-center justify-center w-[35px] h-[35px] rounded-full bg-[#0376A8] ease-in duration-200 hover:bg-opacity-95"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14.3442 0H1.12455C0.499798 0 0 0.497491 0 1.11936V14.3029C0 14.8999 0.499798 15.4222 1.12455 15.4222H14.2942C14.919 15.4222 15.4188 14.9247 15.4188 14.3029V1.09448C15.4688 0.497491 14.969 0 14.3442 0ZM4.57316 13.1089H2.29907V5.7709H4.57316V13.1089ZM3.42362 4.75104C2.67392 4.75104 2.09915 4.15405 2.09915 3.43269C2.09915 2.71133 2.69891 2.11434 3.42362 2.11434C4.14833 2.11434 4.74809 2.71133 4.74809 3.43269C4.74809 4.15405 4.19831 4.75104 3.42362 4.75104ZM13.1947 13.1089H10.9206V9.55183C10.9206 8.7061 10.8956 7.58674 9.72108 7.58674C8.52156 7.58674 8.34663 8.53198 8.34663 9.47721V13.1089H6.07255V5.7709H8.29665V6.79076H8.32164C8.64651 6.19377 9.37122 5.59678 10.4958 5.59678C12.8198 5.59678 13.2447 7.08925 13.2447 9.12897V13.1089H13.1947Z"
                      fill="white"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;