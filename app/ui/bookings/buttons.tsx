"use client";
import { PrintVoucher } from "@/app/lib/pdf/generate-voucher";
import {
  PencilIcon,
  PlusIcon,
  PrinterIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export function CreateBooking() {
  return (
    <Link
      href="/dashboard/bookings/create"
      className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      title="Create a new booking"
    >
      <span className="hidden md:block">Create Booking</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function PrintDeliveryChallanButton({ booking }: { booking: any }) {
  const [loading, setLoading] = useState(false);
  const handlePrintingFromButton = () => {
    setLoading(true);

    // Initialize voucherData object
    const voucherData: any = {
      bookingNumber: booking.id,
      customer: booking.customer,
      customer_bin: booking.customer_bin,
      customer_address: booking.customer_address,
      vehicle: booking.vehicle,
      driver: booking.driver,
      pickup_address: booking.pickup_address,
      dropoff_address: booking.dropoff_address,
      pickup_dt: booking.pickup_dt,
      dropoff_dt: booking.dropoff_dt,
      return_pickup_dt: booking.return_pickup_dt,
      return_dropoff_dt: booking.return_dropoff_dt,
      passenger_num: booking.passenger_num,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      note: booking.note,
      challan_data: booking.challan_data,
      created_at: booking.created_at,
    };

    setTimeout(() => {
      setLoading(false);
      PrintVoucher({ voucherData, type: "delivery_challan" });
    }, 1000); // Delay to ensure the DOM is ready for printing
  };

  return (
    <div className="rounded-md border p-2 hover:bg-gray-100 ">
      {loading ? (
        <p>printing...</p>
      ) : (
        <PrinterIcon
          className="w-5 "
          onClick={handlePrintingFromButton}
          title="Print/Save Delivery Challan"
        />
      )}
    </div>
  );
}

export function PrintDevitVoucherButton({ booking }: { booking: any }) {
  const [loading, setLoading] = useState(false);
  const handlePrintingFromButton = () => {
    setLoading(true);

    // Initialize voucherData object
    const voucherData: any = {
      bookingNumber: booking.id,
      customer: booking.customer,
      customer_bin: booking.customer_bin,
      customer_address: booking.customer_address,
      vehicle: booking.vehicle,
      driver: booking.driver,
      pickup_address: booking.pickup_address,
      dropoff_address: booking.dropoff_address,
      pickup_dt: booking.pickup_dt,
      dropoff_dt: booking.dropoff_dt,
      return_pickup_dt: booking.return_pickup_dt,
      return_dropoff_dt: booking.return_dropoff_dt,
      passenger_num: booking.passenger_num,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      note: booking.note,
      challan_data: booking.challan_data,
      delivery_costs_data: booking.delivery_costs_data,
      created_at: booking.created_at,
    };

    setTimeout(() => {
      setLoading(false);
      PrintVoucher({ voucherData, type: "debit_voucher" });
    }, 1000); // Delay to ensure the DOM is ready for printing
  };

  return (
    <div className="rounded-md border p-2 hover:bg-gray-100 ">
      {loading ? (
        <p>printing...</p>
      ) : (
        <TruckIcon
          className="w-5 "
          onClick={handlePrintingFromButton}
          title="Print/Save Devit Voucher"
        />
      )}
    </div>
  );
}
