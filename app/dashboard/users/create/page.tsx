import { Metadata } from 'next';
import CreateUserForm from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Create Invoice'
}
 
export default async function Page() {
 
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Users', href: '/dashboard/users' },
          {
            label: 'Create User',
            href: '/dashboard/users/create',
            active: true,
          },
        ]}
      />
      <CreateUserForm />
    </main>
  );
}