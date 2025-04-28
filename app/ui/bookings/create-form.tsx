"use client";

import Link from "next/link";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { BookingState, createBooking } from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function CreateBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  const initialState: BookingState = { message: null, errors: {} };
  const [state, formAction] = useActionState<BookingState, FormData>(
    createBooking,
    initialState
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
    });
  };

  // state.errors
  useEffect(() => {
    if (state.errors) {
      setIsLoading(false);
    }
  }, [state.errors]);

  // state.message
  useEffect(() => {
    if (state.message === "Booking created successfully.") {
      //   window.location.href = "/dashboard/bookings"; // Redirect on the client side
    } else if (state.message !== null) {
      console.error(state.message);
    }
  }, [state.message]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="flex">
          {/* Customer Name */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="customer"
              className="mb-2 block text-sm font-medium"
            >
              Customer Name
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="customer"
                  name="customer"
                  type="text"
                  placeholder="Enter customer name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="mb-4 mr-5">
            <label htmlFor="vehicle" className="mb-2 block text-sm font-medium">
              Choose Vehicle
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="vehicle"
                  name="vehicle"
                  type="text"
                  placeholder="Enter vehicle number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Driver */}
          <div className="mb-4">
            <label htmlFor="driver" className="mb-2 block text-sm font-medium">
              Choose Driver
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="driver"
                  name="driver"
                  type="text"
                  placeholder="Enter driver name"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Pickup address */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="pickup_address"
              className="mb-2 block text-sm font-medium"
            >
              Pickup Address / Location
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="pickup_address"
                  name="pickup_address"
                  placeholder="Enter pickup address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  cols={40}
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Dropoff address */}
          <div className="mb-4">
            <label
              htmlFor="dropoff_address"
              className="mb-2 block text-sm font-medium"
            >
              Dropoff Address / Location
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="dropoff_address"
                  name="dropoff_address"
                  placeholder="Enter dropoff address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  cols={40}
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Pickup date */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="pickup_dt"
              className="mb-2 block text-sm font-medium"
            >
              Select Pickup Date
            </label>

            <div className="relative">
              <input
                type="date"
                id="pickup_dt"
                name="pickup_dt"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="pickup_dt-error"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Dropoff date */}
          <div className="mb-4">
            <label
              htmlFor="dropoff_dt"
              className="mb-2 block text-sm font-medium"
            >
              Select Dropoff Date
            </label>

            <div className="relative">
              <input
                type="date"
                id="dropoff_dt"
                name="dropoff_dt"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="dropoff_dt-error"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Num of Passengers */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="passenger_num"
              className="mb-2 block text-sm font-medium"
            >
              Num of Passengers
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="passenger_num"
                  name="passenger_num"
                  type="number"
                  min={1}
                  placeholder="Enter passenger number"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* payment status */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="payment_status"
              className="mb-2 block text-sm font-medium"
            >
              Choose Payment Status
            </label>

            <div className="relative">
              <select
                id="payment_status"
                name="payment_status"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="payment_status-error"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
              <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* booking status */}
          <div className="mb-4">
            <label
              htmlFor="booking_status"
              className="mb-2 block text-sm font-medium"
            >
              Choose Booking Status
            </label>

            <div className="relative">
              <select
                id="booking_status"
                name="booking_status"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="booking_status-error"
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* booking type */}
          <div className="mb-4 mr-5">
            <label
              htmlFor="booking_type"
              className="mb-2 block text-sm font-medium"
            >
              Choose Payment Status
            </label>

            <div className="relative">
              <select
                id="booking_type"
                name="booking_type"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="booking_type-error"
                onChange={(e) => {
                  setIsReturn(e.target.value === "return");
                }}
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="oneway">One Way</option>
                <option value="return">Return</option>
              </select>
              <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {isReturn && (
            <>
              {/* return Pickup date */}
              <div className="mb-4 mr-5">
                <label
                  htmlFor="return_pickup_dt"
                  className="mb-2 block text-sm font-medium"
                >
                  Select Return Pickup Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    id="return_pickup_dt-dt"
                    name="return_pickup_dt-dt"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="return_pickup_dt-error"
                  />
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Return Dropoff date */}
              <div className="mb-4">
                <label
                  htmlFor="return_dropoff_dt"
                  className="mb-2 block text-sm font-medium"
                >
                  Select Return Dropoff Date
                </label>

                <div className="relative">
                  <input
                    type="date"
                    id="return_dropoff_dt"
                    name="return_dropoff_dt"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="return_dropoff_dt-error"
                  />
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* note */}
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            Notes
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="note"
                name="note"
                placeholder="Enter notes"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/bookings"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              creating booking...
            </>
          ) : (
            "Create Booking"
          )}
        </Button>
      </div>
    </form>
  );
}
