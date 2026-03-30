// src/app/admin/customer/page.tsx
import AdminLayout from '../../../components/Admin/AdminLayout';
import Customer from '../../../components/Admin/Customer';

export default function CustomerPage() {
  return (
    <AdminLayout>
      <Customer />
    </AdminLayout>
  );
}