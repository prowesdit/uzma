"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type RepairPart = {
  part: string;
  quantity: number;
  price: number;
};

export default function RepairForm() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [parts, setParts] = useState<RepairPart[]>([
    { part: "", quantity: 1, price: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Fix: Prevent empty part rows from being submitted
  const filteredParts = parts.filter(
    (p) => p.part.trim() !== "" && p.quantity > 0 && p.price >= 0
  );

  const handlePartChange = (
    idx: number,
    field: keyof RepairPart,
    value: string | number
  ) => {
    setParts((prev) =>
      prev.map((p, i) =>
        i === idx
          ? { ...p, [field]: field === "part" ? value : Number(value) }
          : p
      )
    );
  };

  const addRow = () =>
    setParts((prev) => [...prev, { part: "", quantity: 1, price: 0 }]);
  const removeRow = (idx: number) =>
    setParts((prev) => prev.filter((_, i) => i !== idx));

  const total = filteredParts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      alert("Vehicle number is required.");
      return;
    }
    if (filteredParts.length === 0) {
      alert("Please add at least one valid repair part.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/repair-memo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleNumber, date, parts: filteredParts }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (data.success) {
      router.push(`/dashboard/repair/memo/${data.memoId}`);
    } else {
      alert("Failed to save memo: " + data.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">গাড়ি মেরামত রসিদ</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-between gap-4">
          <div>
            <label className="block font-medium">গাড়ি নংঃ </label>
            <input
              className="border p-2 w-full"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium">তারিখঃ </label>
            <input
              type="date"
              className="border p-2 w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">যন্ত্রপাতি</th>
              <th className="border p-2">পরিমান</th>
              <th className="border p-2">মূল্য/ইউনিট</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p, idx) => (
              <tr key={idx}>
                <td className="border p-2">
                  <input
                    className="border p-1 w-full"
                    value={p.part}
                    onChange={(e) =>
                      handlePartChange(idx, "part", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={1}
                    className="border p-1 w-20"
                    value={p.quantity}
                    onChange={(e) =>
                      handlePartChange(idx, "quantity", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min={0}
                    className="border p-1 w-24"
                    value={p.price}
                    onChange={(e) =>
                      handlePartChange(idx, "price", e.target.value)
                    }
                    required
                  />
                </td>
                <td className="border p-2 text-center">
                  {parts.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => removeRow(idx)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold p-2">
                Total: ৳ {total}
              </td>
              <td className="p-2">
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={addRow}
                >
                  + Add Row
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Submit Memo"}
        </button>
      </form>
    </div>
  );
}
