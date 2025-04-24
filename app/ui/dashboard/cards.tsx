import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';


const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={1000} type="collected" />
        <Card title="Customers" value={200} type="customers" />
        <Card title="Pending" value={300} type="pending" />
        <Card title="Invoices" value={400} type="invoices" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        <ClockIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        <ClockIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        <ClockIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
        <ClockIcon className="h-5 w-5 text-gray-500" />
      </div>
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-xl`}
      >
        {value}
      </p>
    </div>
  );
}
