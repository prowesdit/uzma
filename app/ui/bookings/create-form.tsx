"use client";

import Link from "next/link";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { BookingState, createBooking } from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";
import { PrintVoucher } from "@/app/lib/pdf/generate-voucher";

interface Product {
  product_id: string;
  quantity: number;
  [key: string]: string | number; // This allows any additional dynamic fields
}

interface ChallanData {
  item_detail: string;
  delivery_unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  supplementary_duty_rate: number;
  supplementary_duty: number;
  value_added_tax_rate: number;
  value_added_tax: number;
  total_price_with_tax: number;
  [key: string]: string | number; // This allows any additional dynamic fields
}

export default function CreateBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReturn, setIsReturn] = useState(false);
  // with print or not
  const [printVoucher, setPrintVoucher] = useState("");

  const [challans, setChallans] = useState<ChallanData[]>([
    {
      item_detail: "",
      delivery_unit: "",
      quantity: 0,
      unit_price: 0,
      total_price: 0,
      supplementary_duty_rate: 0,
      supplementary_duty: 0,
      value_added_tax_rate: 0,
      value_added_tax: 0,
      total_price_with_tax: 0,
    },
  ]);

  //
  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ): void => {
    const newItems: ChallanData[] = [...challans];
    newItems[index][field] = value;
    setChallans(newItems);
  };
  const addItem = (): void => {
    setChallans([
      ...challans,
      {
        item_detail: "",
        delivery_unit: "",
        quantity: 0,
        unit_price: 0,
        total_price: 0,
        supplementary_duty_rate: 0,
        supplementary_duty: 0,
        value_added_tax_rate: 0,
        value_added_tax: 0,
        total_price_with_tax: 0,
      },
    ]);
  };
  const removeItem = (index: number): void => {
    setChallans((prevChallans) => prevChallans.filter((_, i) => i !== index));
  };

  // form states and functions
  const initialState: BookingState = { message: null, errors: {}, values: {} };
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
      setPrintVoucher("")
    }
  }, [state.errors]);

  useEffect(() => {
    if (state.voucherData && printVoucher === "yes") {
      const voucherData = state.voucherData;
      PrintVoucher({ voucherData });
      setIsLoading(false);
      setPrintVoucher("");
    } else if (state.voucherData && printVoucher === "no") {
      setIsLoading(false);
      setPrintVoucher("");
    } else if (state.message) {
      // form error or early return
      setIsLoading(false);
    }
  }, [state.voucherData, state.message]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Customer Name */}
          <div className="mb-4">
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
                  defaultValue={state?.values?.customer ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.customer && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.customer}
              </p>
            )}
          </div>

          {/* customer BIN */}
          <div className="mb-4 ">
            <label
              htmlFor="customer_bin"
              className="mb-2 block text-sm font-medium"
            >
              Customer BIN
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="customer_bin"
                  name="customer_bin"
                  type="text"
                  placeholder="Enter customer BIN"
                  defaultValue={state?.values?.customer_bin ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.customer_bin && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.customer_bin}
              </p>
            )}
          </div>

          {/* Customer Address */}
          <div className="mb-4">
            <label
              htmlFor="customer_address"
              className="mb-2 block text-sm font-medium"
            >
              Customer Address / Location
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="customer_address"
                  name="customer_address"
                  placeholder="Enter customer address"
                  defaultValue={state?.values?.customer_address ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  cols={40}
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.customer_address && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.customer_address}
              </p>
            )}
          </div>

          {/* Vehicle */}
          <div className="mb-4">
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
                  defaultValue={state?.values?.vehicle ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.vehicle && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.vehicle}
              </p>
            )}
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
                  defaultValue={state?.values?.driver ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.driver && (
              <p className="text-red-500 text-sm mt-1">{state.errors.driver}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Pickup address */}
          <div className="mb-4">
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
                  defaultValue={state?.values?.pickup_address ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  cols={40}
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.pickup_address && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.pickup_address}
              </p>
            )}
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
                  defaultValue={state?.values?.dropoff_address ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  cols={40}
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.dropoff_address && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.dropoff_address}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Pickup date */}
          <div className="mb-4">
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
                defaultValue={
                  state?.values?.pickup_dt ??
                  new Date().toISOString().split("T")[0]
                }
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.pickup_dt && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.pickup_dt}
              </p>
            )}
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
                defaultValue={state?.values?.dropoff_dt ?? ""}
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="dropoff_dt-error"
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.dropoff_dt && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.dropoff_dt}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* Num of Passengers */}
          <div className="mb-4">
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
                  defaultValue={state?.values?.passenger_num ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.passenger_num && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.passenger_num}
              </p>
            )}
          </div>

          {/* payment status */}
          <div className="mb-4">
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
                defaultValue={state?.values?.payment_status ?? ""}
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
            {state.errors?.payment_status && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.payment_status}
              </p>
            )}
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
                defaultValue={state?.values?.booking_status ?? ""}
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
            {state.errors?.booking_status && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.booking_status}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* booking type */}
          <div className="mb-4">
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
                defaultValue={state?.values?.booking_type ?? ""}
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
            {state.errors?.booking_type && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.booking_type}
              </p>
            )}
          </div>

          {isReturn && (
            <>
              {/* return Pickup date */}
              <div className="mb-4">
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
                    defaultValue={state?.values?.return_pickup_dt ?? ""}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="return_pickup_dt-error"
                  />
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
                {state.errors?.return_pickup_dt && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.return_pickup_dt}
                  </p>
                )}
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
                    defaultValue={state?.values?.return_dropoff_dt ?? ""}
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    aria-describedby="return_dropoff_dt-error"
                  />
                  <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>
                {state.errors?.return_dropoff_dt && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.return_dropoff_dt}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* note */}
        <div className="mb-4">
          <label htmlFor="note" className="mb-2 block text-sm font-medium">
            Note
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="note"
                name="note"
                placeholder="Enter notes"
                defaultValue={state?.values?.note ?? ""}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {state.errors?.note && (
            <p className="text-red-500 text-sm mt-1">{state.errors.note}</p>
          )}
        </div>

        {/* challan data */}
        <div className="mb-4">
          {challans.map((challan, index) => (
            <div key={index} className="mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                {/* serial */}
                <div className="">
                  <label
                    htmlFor={`sl_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sl.
                  </label>
                  <p className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm">
                    {index + 1}
                  </p>
                </div>
                {/* detail */}
                <div className="flex-1">
                  <label
                    htmlFor={`item_detail_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Detail of Item
                  </label>
                  <textarea
                    id={`item_detail_${index}`}
                    name={`item_detail_${index}`}
                    value={challan.item_detail}
                    onChange={(e) => {
                      handleItemChange(index, "item_detail", e.target.value);
                    }}
                    placeholder="Enter challan item detail"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* unit */}
                <div className="flex-1">
                  <label
                    htmlFor={`delivery_unit_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Unit
                  </label>
                  <input
                    id={`delivery_unit_${index}`}
                    name={`delivery_unit_${index}`}
                    value={challan.delivery_unit}
                    onChange={(e) =>
                      handleItemChange(index, "delivery_unit", e.target.value)
                    }
                    placeholder="Enter challan unit"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* quantity */}
                <div className="flex-1">
                  <label
                    htmlFor={`quantity_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>
                  <input
                    id={`quantity_${index}`}
                    name={`quantity_${index}`}
                    type="number"
                    value={challan.quantity}
                    onChange={(e) => {
                      const newValue =
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0;
                      handleItemChange(index, "quantity", newValue);
                    }}
                    placeholder="Enter Quantity"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* unit price */}
                <div className="flex-1">
                  <label
                    htmlFor={`unit_price_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Unit Price (BDT)
                  </label>
                  <input
                    id={`unit_price_${index}`}
                    name={`unit_price_${index}`}
                    type="number"
                    value={challan.unit_price}
                    onChange={(e) => {
                      const newValue =
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0;
                      handleItemChange(index, "unit_price", newValue);
                    }}
                    placeholder="Enter Unit Price"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* supplementary duty rate */}
                <div className="flex-1">
                  <label
                    htmlFor={`supplementary_duty_rate_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    SD Rate (%)
                  </label>
                  <input
                    id={`supplementary_duty_rate_${index}`}
                    name={`supplementary_duty_rate_${index}`}
                    type="number"
                    value={challan.supplementary_duty_rate}
                    onChange={(e) => {
                      const newValue =
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0;
                      handleItemChange(
                        index,
                        "supplementary_duty_rate",
                        newValue
                      );
                    }}
                    placeholder="Enter Supplementary Duty Rate (%)"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>
                {/* value added tax rate */}
                <div className="flex-1">
                  <label
                    htmlFor={`value_added_tax_rate_${index}`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    VAT (%)
                  </label>
                  <input
                    id={`value_added_tax_rate_${index}`}
                    name={`value_added_tax_rate_${index}`}
                    type="number"
                    value={challan.value_added_tax_rate}
                    onChange={(e) => {
                      const newValue =
                        Number(e.target.value) >= 0
                          ? Number(e.target.value)
                          : 0;
                      handleItemChange(index, "value_added_tax_rate", newValue);
                    }}
                    placeholder="Enter VAT (%)"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  />
                </div>

                <button
                  type="button"
                  className="ml-2 mt-6 text-red-300 hover:text-red-700"
                  onClick={() => removeItem(index)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mb-2 flex items-center space-x-1 text-sm font-medium text-teal-500 hover:text-teal-700"
            onClick={addItem}
          >
            <PlusIcon className="w-5 h-5" /> <span>Add another item</span>
          </button>
          <input
            type="hidden"
            name="challan_data"
            value={JSON.stringify(challans)}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/bookings"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        {/* <Button type="submit" disabled={isLoading}>
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
        </Button> */}
        <Button
          type="submit"
          disabled={isLoading}
          className={`${
            printVoucher === "yes" || printVoucher === "" ? "" : "hidden"
          }`}
          onClick={() => setPrintVoucher("yes")}
        >
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
              Posting...
            </>
          ) : (
            "Post & Print"
          )}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className={`${
            printVoucher === "no" || printVoucher === "" ? "" : "hidden"
          }`}
          onClick={() => setPrintVoucher("no")}
        >
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
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </form>
  );
}
