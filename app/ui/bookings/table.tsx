
import { fetchFilteredBookings } from "@/app/lib/data";

export default async function BookingsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const bookings = await fetchFilteredBookings(query, currentPage);
 
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile View */}
          <div className="md:hidden">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="mb-2">
                  <p className="font-semibold">{booking.customer}</p>
                  <p className="text-sm text-gray-500">{booking.vehicle}</p>
                </div>
                <div className="mb-2">
                  <p>Driver: {booking.driver}</p>
                  <p>Pickup: {booking.pickup_address}</p>
                  <p>Dropoff: {booking.dropoff_address}</p>
                </div>
                <div className="mb-2">
                  <p>Passengers: {booking.passenger_num}</p>
                  <p>Note: {booking.note}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Payment Status: {booking.payment_status}</p>
                  <p>Booking Status: {booking.booking_status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                <th className="px-3 py-5 font-medium">Vehicle</th>
                <th className="px-3 py-5 font-medium">Driver</th>
                <th className="px-3 py-5 font-medium">Pickup</th>
                <th className="px-3 py-5 font-medium">Dropoff</th>
                <th className="px-3 py-5 font-medium">Passengers</th>
                <th className="px-3 py-5 font-medium">Payment Status</th>
                <th className="px-3 py-5 font-medium">Booking Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-sm">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b last-of-type:border-none"
                >
                  <td className="whitespace-nowrap px-4 py-4 sm:pl-6">
                    {booking.customer}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.vehicle}</td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.driver}</td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.pickup_address}</td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.dropoff_address}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-center">{booking.passenger_num}</td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.payment_status}</td>
                  <td className="whitespace-nowrap px-3 py-4">{booking.booking_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
