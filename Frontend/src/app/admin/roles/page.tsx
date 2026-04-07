import AdminLayout from '../../../components/Admin/AdminLayout';
import Roles from '../../../components/Admin/Roles';

export const metadata = {
  title: 'Manajemen Role | Admin Panel',
};

export default function RolesPage() {
  return (
    <AdminLayout>
      <Roles />
    </AdminLayout>
  );
}