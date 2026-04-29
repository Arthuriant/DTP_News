import AdminLayout from '@/components/Admin/AdminLayout';
import PesananDetail from '@/components/Admin/PesananDetail';


export default async function OrderDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <AdminLayout>
      <PesananDetail orderId={id} />
    </AdminLayout>
  );
}