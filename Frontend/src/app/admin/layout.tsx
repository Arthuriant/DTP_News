// src/app/admin/layout.tsx
import "../css/style.css"; // Pastikan path ini mengarah ke file CSS global/Tailwind Anda

export const metadata = {
  title: 'Dashboard Admin',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan background warna abu-abu muda khas dashboard admin */}
      <body className="bg-[#f4f7fb] text-gray-800 m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
}