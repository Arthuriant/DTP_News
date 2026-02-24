"use client";

import { useState } from "react";
import ProductViewer from "@/components/ProductViewer";
import Breadcrumb from "../Common/Breadcrumb"; // Sesuaikan path jika perlu


const COLOR_PALETTE = {
  badan: ["#4B5563", "#60A5FA", "#F472B6"],
  tali: ["#000000", "#FFFFFF"],
  telinga: ["#EF4444", "#A855F7", "#22C55E"],
  sayap: ["#000000", "#4B5563", "#DC2626"],
  detail: ["#FCD34D", "#FFFFFF", "#000000"],
};

export default function BagCustomizer3D() {

  const [colors, setColors] = useState({
    badan: "#F472B6",
    tali: "#FFFFFF",
    telinga: "#22C55E",
    sayap: "#000000",
    detail: "#FCD34D",
  });

  const [activeView, setActiveView] = useState("360");

  const handleColorChange = (part, color) => {
    setColors(prev => ({
      ...prev,
      [part]: color
    }));
  };

  const viewButtonClass = (view) =>
    `w-16 h-16 flex items-center justify-center text-sm font-semibold rounded border-2 transition-all ${
      activeView === view
        ? "bg-gray-200 border-gray-400"
        : "bg-white border-gray-200"
    }`;

  return (
    <>
    <Breadcrumb title={"Build Your Bag"} pages={["customizer"]} />
    <section className="overflow-hidden py-20 bg-gray-2">

      <div className="max-w-[1170px] mx-auto px-4">

        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-1 overflow-hidden">

          {/* LEFT */}
          <div className="w-full lg:w-3/5 p-10">

            <ProductViewer
              badanColor={colors.badan}
              taliColor={colors.tali}
              telingaColor={colors.telinga}
              sayapColor={colors.sayap}
              detailColor={colors.detail}
              activeView={activeView}
            />

            <div className="flex gap-3 mt-5 justify-center">

              <button onClick={() => setActiveView("360")} className={viewButtonClass("360")}>
                360°
              </button>

              <button onClick={() => setActiveView("depan")} className={viewButtonClass("depan")}>
                Depan
              </button>

              <button onClick={() => setActiveView("belakang")} className={viewButtonClass("belakang")}>
                Belakang
              </button>

              <button onClick={() => setActiveView("atas")} className={viewButtonClass("atas")}>
                Atas
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-2/5 p-10">

            <h2 className="text-3xl font-bold mb-6">
              Design Your Bag
            </h2>

            {Object.entries(COLOR_PALETTE).map(([part, palette]) => (

              <div key={part} className="mb-6">

                <h3 className="font-semibold mb-2 capitalize">
                  Warna {part}
                </h3>

                <div className="flex gap-3">

                  {palette.map(color => (

                    <button
                      key={color}
                      onClick={() => handleColorChange(part, color)}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border-2 ${
                        colors[part] === color
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    />

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
</>
  );

}