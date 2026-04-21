// src/app/admin/produk/[id]/part/[partId]/page.tsx
import AdminLayout from '@/components/Admin/AdminLayout';
import PartVariant from '@/components/Admin/ProdukDetail/PartVariant/PartVariant';

export default function PartVariantRoute() {
  return (
    <AdminLayout>
      {/* Kita tidak perlu melempar param karena komponen sudah mandiri memakai useParams! */}
      <PartVariant />
    </AdminLayout>
  );
}