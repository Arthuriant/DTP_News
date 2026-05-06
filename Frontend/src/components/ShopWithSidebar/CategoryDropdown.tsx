"use client";

import { useState } from "react";

// ============================================================
// TIPE DATA
// ============================================================
interface SubCategory {
  id: string;
  name: string;
  products: number;
}

interface Category {
  id: string;
  name: string;
  products: number;
  sub_categories: SubCategory[];
}

interface CategoryDropdownProps {
  categories: Category[];
  // Callback ke parent (ShopWithSidebar) saat seleksi berubah
  onSelectionChange?: (selectedCategoryIds: string[], selectedSubCategoryIds: string[]) => void;
}

// ============================================================
// SUB-KATEGORI ITEM
// ============================================================
const SubCategoryItem = ({
  subCategory,
  isSelected,
  onToggle,
}: {
  subCategory: SubCategory;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => {
  return (
    <button
      className={`group flex w-full items-center justify-between ease-out duration-300 py-1 pl-7 ${
        isSelected ? "text-[#C5A059]" : "text-[#6B442A]/80 hover:text-[#C5A059]"
      }`}
      onClick={() => onToggle(subCategory.id)}
    >
      <div className="flex items-center gap-3">
        {/* Garis sambung accordion */}
        <span className="absolute left-[2.1rem] w-3 h-px bg-[#E5D7C1] group-hover:bg-[#C5A059]/50 transition-colors duration-300" />

        {/* Custom Checkbox kecil untuk sub-kategori */}
        <div
          className={`flex items-center justify-center rounded-[3px] w-[14px] h-[14px] border transition-all duration-300 ${
            isSelected
              ? "border-[#C5A059] bg-[#C5A059]"
              : "bg-transparent border-[#E5D7C1] group-hover:border-[#C5A059]"
          }`}
        >
          <svg
            className={`transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0"}`}
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="#2D1A11"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="font-sans font-normal text-[13px] tracking-wide">{subCategory.name}</span>
      </div>

      {/* Badge jumlah produk */}
      
    </button>
  );
};

// ============================================================
// KATEGORI ITEM (dengan accordion sub-kategori)
// ============================================================
const CategoryItem = ({
  category,
  selectedCategoryIds,
  selectedSubCategoryIds,
  onCategoryToggle,
  onSubCategoryToggle,
}: {
  category: Category;
  selectedCategoryIds: string[];
  selectedSubCategoryIds: string[];
  onCategoryToggle: (id: string) => void;
  onSubCategoryToggle: (id: string) => void;
}) => {
    const [accordionOpen, setAccordionOpen] = useState(
    category.sub_categories?.length > 0
  );
  const isSelected = selectedCategoryIds.includes(category.id);
  const hasSubCategories = category.sub_categories && category.sub_categories.length > 0;

  // Hitung berapa sub-kategori yang dipilih di dalam kategori ini
  const selectedSubCount = category.sub_categories?.filter((sub) =>
    selectedSubCategoryIds.includes(sub.id)
  ).length ?? 0;

  return (
    <div className="relative">
      <div
        className={`group flex w-full items-center justify-between ease-out duration-300 py-1 ${
          isSelected || selectedSubCount > 0 ? "text-[#C5A059]" : "text-[#6B442A] hover:text-[#C5A059]"
        }`}
      >
        {/* Checkbox + Nama Kategori */}
        <button
          className="flex items-center gap-3 flex-1 text-left"
          onClick={() => onCategoryToggle(category.id)}
        >
          <div
            className={`flex items-center justify-center rounded-[4px] w-[18px] h-[18px] border transition-all duration-300 ${
              isSelected
                ? "border-[#C5A059] bg-[#C5A059]"
                : "bg-transparent border-[#E5D7C1] group-hover:border-[#C5A059]"
            }`}
          >
            <svg
              className={`transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0"}`}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                stroke="#2D1A11"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-sans font-medium text-[15px] tracking-wide">{category.name}</span>
        </button>

        <div className="flex items-center gap-2">


          {/* Tombol accordion expand sub-kategori */}
          {hasSubCategories && (
            <button
              onClick={() => setAccordionOpen(!accordionOpen)}
              className={`text-[#C5A059] transition-transform duration-300 ${
                accordionOpen ? "rotate-180" : "rotate-0"
              }`}
              aria-label={`Toggle sub-kategori ${category.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Accordion Sub-Kategori */}
      {hasSubCategories && (
        <div
          className={`overflow-hidden transition-all duration-500 origin-top ${
            accordionOpen ? "max-h-[400px] opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          {/* Garis vertikal kiri sebagai indikator hierarki */}
          <div className="relative border-l-2 border-[#E5D7C1]/60 ml-[8px] pl-2 flex flex-col gap-2 pb-1">
            {category.sub_categories.map((sub) => (
              <SubCategoryItem
                key={sub.id}
                subCategory={sub}
                isSelected={selectedSubCategoryIds.includes(sub.id)}
                onToggle={onSubCategoryToggle}
              />
            ))}
          </div>
        </div>
      )}

      {/* Indikator jumlah sub-kategori terpilih */}
      {selectedSubCount > 0 && !accordionOpen && (
        <p className="text-[10px] text-[#C5A059] font-medium pl-8 mt-0.5">
          {selectedSubCount} sub-kategori dipilih
        </p>
      )}
    </div>
  );
};

// ============================================================
// KATEGORI DROPDOWN (Komponen Utama)
// ============================================================
const CategoryDropdown = ({
  categories,
  onSelectionChange,
}: CategoryDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSubCategoryIds, setSelectedSubCategoryIds] = useState<string[]>([]);

  const handleCategoryToggle = (id: string) => {
    const updated = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((c) => c !== id)
      : [...selectedCategoryIds, id];

    setSelectedCategoryIds(updated);
    onSelectionChange?.(updated, selectedSubCategoryIds);
  };

  const handleSubCategoryToggle = (id: string) => {
    const updated = selectedSubCategoryIds.includes(id)
      ? selectedSubCategoryIds.filter((s) => s !== id)
      : [...selectedSubCategoryIds, id];

    setSelectedSubCategoryIds(updated);
    onSelectionChange?.(selectedCategoryIds, updated);
  };

  const handleResetAll = () => {
    setSelectedCategoryIds([]);
    setSelectedSubCategoryIds([]);
    onSelectionChange?.([], []);
  };

  const totalSelected = selectedCategoryIds.length + selectedSubCategoryIds.length;

  return (
    <div className="bg-[#Fdfbf7] shadow-[0_10px_30px_-10px_rgba(45,26,17,0.06)] border border-[#E5D7C1]/50 rounded-[1.25rem] overflow-hidden relative group/dropdown">

      {/* Inner Frame */}
      <div className="absolute inset-1 border border-[#E5D7C1]/30 rounded-xl pointer-events-none z-10 transition-colors duration-500 group-hover/dropdown:border-[#C5A059]/20"></div>

      {/* Header */}
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-4 pl-6 pr-5 relative z-20 transition-all duration-300 ${
          toggleDropdown ? "border-b border-[#E5D7C1]/40 bg-[#Fdfbf7]" : "bg-[#Fdfbf7]"
        }`}
      >
        <div className="flex items-center gap-2">
          <p className="font-serif font-medium text-lg text-[#2D1A11]">Kategori Produk</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="toggle kategori"
            className={`text-[#C5A059] ease-[cubic-bezier(0.25,1,0.5,1)] duration-500 transform ${
              toggleDropdown ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg className="fill-current w-5 h-5" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      <div
        className={`flex-col gap-3.5 py-6 pl-6 pr-5 relative z-20 transition-all duration-500 origin-top overflow-hidden ${
          toggleDropdown ? "flex max-h-[600px] opacity-100" : "hidden max-h-0 opacity-0"
        }`}
      >
        {categories.length === 0 ? (
          <p className="text-[13px] text-[#6B442A]/50 text-center py-2">
            Memuat kategori...
          </p>
        ) : (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              selectedCategoryIds={selectedCategoryIds}
              selectedSubCategoryIds={selectedSubCategoryIds}
              onCategoryToggle={handleCategoryToggle}
              onSubCategoryToggle={handleSubCategoryToggle}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;