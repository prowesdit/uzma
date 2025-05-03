import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { Button } from "../button";
import { useActionState } from "react";
import { BookingForm, OfficeForm } from "@/app/lib/definitions";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PencilIcon,
  ShareIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BookingState, createBooking, updateBooking } from "@/app/lib/actions";
import { formatDateInput, formatDateToLocal } from "@/app/lib/utils";

export function UpdateBookingModal({
  setShowUpdateBookingModal,
  booking,
}: {
  setShowUpdateBookingModal: Dispatch<SetStateAction<boolean>>;
  booking: BookingForm;
}) {
  const initialState: BookingState = { message: null, errors: {} };
  const [isLoading, setIsLoading] = useState(false);
  const [isReturn, setIsReturn] = useState<boolean>(
    booking.booking_type === "return" ? true : false
  );
  const [state, formAction] = useActionState<BookingState, FormData>(
    updateBooking.bind(null, booking.id),
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

  useEffect(() => {
    if (state.message) {
      const regex = /Booking edited successfully./;
      const match = state.message.match(regex);

      if (match) {
        console.log(match);
        setTimeout(() => {
          setIsLoading(false);
          setShowUpdateBookingModal(false);
        }, 500);
      }
    }
  }, [state.message]);

  useEffect(() => {
    if (state.errors) {
      setShowUpdateBookingModal(true);
      setIsLoading(false);
    }
  }, [state.errors]);

  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-50">
        <div className="relative w-full max-w-3xl mx-auto my-8">
          {/* content */}
          <div className="max-h-[90vh] overflow-y-auto border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none">
            {/* header */}
            <div className="p-5 border-b border-solid border-slate-200 rounded-t flex justify-between">
              <h1 className="text-lg font-semibold">Update Booking</h1>
              <Button
                className="bg-red-400 hover:bg-red-700"
                onClick={() => setShowUpdateBookingModal(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* scrollable form */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
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
                          defaultValue={booking.customer}
                          // required
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="mb-4 mr-5">
                    <label
                      htmlFor="vehicle"
                      className="mb-2 block text-sm font-medium"
                    >
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
                          defaultValue={booking.vehicle}
                          // required
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Driver */}
                  <div className="mb-4">
                    <label
                      htmlFor="driver"
                      className="mb-2 block text-sm font-medium"
                    >
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
                          defaultValue={booking.driver}
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
                          defaultValue={booking.pickup_address}
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
                          defaultValue={booking.dropoff_address}
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
                        defaultValue={formatDateInput(booking.pickup_dt)}
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
                        defaultValue={formatDateInput(booking.dropoff_dt)}
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
                          defaultValue={booking.passenger_num}
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
                        defaultValue={booking.payment_status}
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
                        defaultValue={booking.booking_status}
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
                      Choose Booking Type
                    </label>

                    <div className="relative">
                      <select
                        id="booking_type"
                        name="booking_type"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        aria-describedby="booking_type-error"
                        defaultValue={booking.booking_type}
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
                            id="return_pickup_dt"
                            name="return_pickup_dt"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="return_pickup_dt-error"
                            defaultValue={formatDateInput(
                              booking.return_pickup_dt
                            )}
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
                            defaultValue={formatDateInput(
                              booking.return_dropoff_dt
                            )}
                          />
                          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* note */}
                <div className="mb-4">
                  <label
                    htmlFor="note"
                    className="mb-2 block text-sm font-medium"
                  >
                    Notes
                  </label>
                  <div className="relative mt-2 rounded-md">
                    <div className="relative">
                      <textarea
                        id="note"
                        name="note"
                        placeholder="Enter notes"
                        className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue={booking.note}
                      />
                      <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                  </div>
                </div>

                <div className="flex">
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
                        Updating. Wait...
                      </>
                    ) : (
                      "Update Booking"
                    )}
                  </Button>

                  <button
                    className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowUpdateBookingModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
