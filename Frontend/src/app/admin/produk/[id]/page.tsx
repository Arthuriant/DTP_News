// src/app/admin/produk/[id]/page.tsx
import AdminLayout from '@/components/Admin/AdminLayout';
import ProdukDetail from '@/components/Admin/ProdukDetail/ProdukDetail';

// Next.js otomatis menangkap [id] dari URL dan memasukkannya ke 'params'
export default function ProdukDetailPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      {/* Lempar ID tersebut ke komponen UI kita */}
      <ProdukDetail productId={params.id} />
    </AdminLayout>
  );
}