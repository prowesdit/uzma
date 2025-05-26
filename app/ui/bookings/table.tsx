"use client";

import {
  ArrowLongRightIcon,
  ArrowUturnRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { UpdateBookingModal } from "./update-booking-modal";
import { BookingForm } from "@/app/lib/definitions";
import { formatDateToLocal } from "@/app/lib/utils";
import { PrintDeliveryChallanButton, PrintDevitVoucherButton } from "./buttons";

export default function BookingsTable({
  bookings,
}: {
  bookings: BookingForm[];
}) {
  console.log(bookings)
  const [showUpdateBookingModal, setShowUpdateBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingForm | null>(
    null
  );

  return (
    <>
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            {/* Mobile View */}
            <div className="md:hidden">
              {bookings?.map((booking) => (
                <div
                  key={booking.id}
                  className="mb-2 w-full rounded-md bg-white p-4 shadow-sm border"
                >
                  {/* id and time */}
                  <div className="mb-2">
                      <span className="text-xs">{booking.id}</span> <br />
                      <span className="text-xs text-gray-500">
                        Issued at {formatDateToLocal(booking.created_at)}.
                      </span>
                      {booking?.updated_at  ? (
                        <>
                          <span className="text-xs text-gray-500"> Updated at {formatDateToLocal(booking.updated_at)}</span>
                        </>
                      ) : ("")}
                    </div>

                  {/* Header */}
                  <div className="mb-2 flex justify-between">
                    <div>
                      <p className="font-semibold">{booking.customer}</p>
                      <p className="text-sm text-gray-500">{booking.vehicle}</p>
                    </div>
                    {/* edit and print buttons */}
                    <div>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="flex items-center space-x-1 text-sm font-medium text-teal-400 hover:text-teal-700"
                          onClick={() => {
                            setShowUpdateBookingModal(true);
                            setSelectedBooking(booking);
                          }}
                        >
                          <PencilIcon
                            className="w-5 h-5"
                            title="Edit Challan"
                          />
                        </button>
                        <PrintDeliveryChallanButton booking={booking} />
                      </div>
                      {showUpdateBookingModal &&
                      selectedBooking &&
                      selectedBooking.id === booking.id ? (
                        <UpdateBookingModal
                          setShowUpdateBookingModal={setShowUpdateBookingModal}
                          booking={booking}
                        />
                      ) : null}
                    </div>
                  </div>

                  {/* Pickup → Dropoff */}
                  <div className="mb-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">{booking.pickup_address}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(booking.pickup_dt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center ml-6 my-1">
                      <ArrowLongRightIcon className="w-5 h-5 text-blue-500" />
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">{booking.dropoff_address}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {formatDateToLocal(booking.dropoff_dt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Return Leg (if any) */}
                  {booking.booking_type === "return" &&
                    booking.return_pickup_dt &&
                    booking.return_dropoff_dt && (
                      <div className="mb-2 text-sm border-t pt-2 mt-2">
                        <div className="flex items-start gap-2">
                          <ArrowUturnRightIcon className="w-4 h-4 text-amber-500 mt-1" />
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium">
                              {booking.dropoff_address}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(booking.return_pickup_dt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center ml-10 my-1">
                          <ArrowLongRightIcon className="w-5 h-5 text-blue-500" />
                        </div>

                        <div className="flex items-start gap-2 ml-6">
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div>
                            <p className="font-medium">
                              {booking.pickup_address}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(booking.return_dropoff_dt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Details */}
                  <div className="mb-2 text-sm">
                    <p>Driver: {booking.driver}</p>
                    <p>Passengers: {booking.passenger_num}</p>
                    {booking.note && <p>Note: {booking.note}</p>}
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1 text-sm">
                    <p>
                      <span className="font-medium">Payment:</span>{" "}
                      {booking.payment_status}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {booking.booking_status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}

            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium">#</th>
                  <th className="px-4 py-5 font-medium">Customer</th>
                  <th className="px-3 py-5 font-medium">Vehicle</th>
                  <th className="px-3 py-5 font-medium">Pickup / Dropoff</th>
                  <th className="px-3 py-5 font-medium">Cr / Dr</th>
                  {/* <th className="px-3 py-5 font-medium">Passengers</th>
                  <th className="px-3 py-5 font-medium">Payment Status</th>
                  <th className="px-3 py-5 font-medium">Booking Status</th> */}
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm">
                {bookings?.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b last-of-type:border-none"
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className="text-xs">{booking.id}</span> <br />
                      <span className="text-xs text-gray-500">
                        Issued at {formatDateToLocal(booking.created_at)}
                      </span>
                      {booking?.updated_at  ? (
                        <>
                          <br />
                          <span className="text-xs text-gray-500">Updated at {formatDateToLocal(booking.updated_at)} by {booking.updated_by}</span>
                        </>
                      ) : ("")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {booking.customer}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {booking.vehicle}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <TruckIcon className="w-4 h-4 text-teal-500" />
                        {booking.driver}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <div className="flex flex-col gap-2 text-sm">
                        {/* One-way or First Leg */}
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {booking.pickup_address}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(booking.pickup_dt)}
                            </span>
                          </div>
                          <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mx-1 mt-1" />
                          <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {booking.dropoff_address}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDaysIcon className="w-3 h-3" />
                              {formatDateToLocal(booking.dropoff_dt)}
                            </span>
                          </div>
                        </div>

                        {/* Return Leg (if applicable) */}
                        {booking.booking_type === "return" &&
                          booking.return_pickup_dt &&
                          booking.return_dropoff_dt && (
                            <div className="flex items-start gap-2 border-l-2 border-dashed border-gray-300 pl-3 ml-3">
                              <ArrowUturnRightIcon className="w-4 h-4 text-amber-500 mt-1" />
                              <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {booking.dropoff_address}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <CalendarDaysIcon className="w-3 h-3" />
                                  {formatDateToLocal(booking.return_pickup_dt)}
                                </span>
                              </div>
                              <ArrowLongRightIcon className="w-5 h-5 text-blue-500 mx-1 mt-1" />
                              <MapPinIcon className="w-4 h-4 text-gray-500 mt-1" />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {booking.pickup_address}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <CalendarDaysIcon className="w-3 h-3" />
                                  {formatDateToLocal(booking.return_dropoff_dt)}
                                </span>
                              </div>
                            </div>
                          )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-center">
                          {booking.credit_amount ? booking.credit_amount : 0} / {(Array.isArray(booking.delivery_costs_data)
                            ? booking.delivery_costs_data
                            : (typeof booking.delivery_costs_data === "string" && Array.isArray(JSON.parse(booking.delivery_costs_data)))
                              ? JSON.parse(booking.delivery_costs_data)
                              : []
                          ).reduce((acc: any, item: { cost: any; }) => acc + item.cost, 0)}
                    </td>

                    {/* <td className="whitespace-nowrap px-3 py-4 text-center"> {booking.passenger_num}  </td>
                    <td className="whitespace-nowrap px-3 py-4">  {booking.payment_status} </td>
                    <td className="whitespace-nowrap px-3 py-4"> {booking.booking_status} </td> */}
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          className="flex items-center space-x-1 text-sm font-medium text-teal-400 hover:text-teal-700"
                          onClick={() => {
                            setShowUpdateBookingModal(true);
                            setSelectedBooking(booking);
                          }}
                        >
                          <PencilIcon
                            className="w-5 h-5"
                            title="Edit Challan"
                          />
                        </button>
                        
                        <PrintDevitVoucherButton booking={booking} />
                        <PrintDeliveryChallanButton booking={booking} />
                      </div>
                      {showUpdateBookingModal &&
                      selectedBooking &&
                      selectedBooking.id === booking.id ? (
                        <UpdateBookingModal
                          setShowUpdateBookingModal={setShowUpdateBookingModal}
                          booking={booking}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
