"use client";
import {
  ChevronDoubleDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// Define the Vehicle type
interface Vehicle {
  _id: string;
  model: string;
  registrationNumber: string;
  type: string;
  inService: boolean;
}

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicles/get-all");
        const data: Vehicle[] = await response.json();
        console.log("Fetched vehicles:", data); // Log the fetched data
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  //Handle vehicle edit
  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  //Handle vehicle delete
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVehicles((prevVehicles) =>
          prevVehicles.filter((v) => v._id !== selectedVehicle._id)
        );
        setIsDeleteModalOpen(false);
        setSelectedVehicle(null);
      } else {
        console.error("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.action === "closeModal") {
        setIsModalOpen(false);
        setSelectedVehicle(null);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vehicles Management</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="">
            <th className="border border-gray-300 px-4 py-2">Model</th>
            <th className="border border-gray-300 px-4 py-2">Number Plate</th>
            <th className="border border-gray-300 px-4 py-2">Vehicle Type</th>
            <th className="border border-gray-300 px-4 py-2">On Trip</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No vehicles found.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {vehicle.model}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {vehicle.registrationNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {vehicle.type}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {vehicle.inService ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex items-center justify-center relative">
                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="flex items-center justify-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    <span className="material-icons">
                      <Cog6ToothIcon className="h-5 w-5" />
                    </span>
                    <span className="material-icons">
                      <ChevronDoubleDownIcon className="h-5 w-5" />
                    </span>
                  </button>
                  {selectedVehicle?._id === vehicle._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleEditVehicle(vehicle)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 "
                      >
                        Edit Vehicle
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle)}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                      >
                        Delete Vehicle
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*Edit Modal */}
      {isModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-2/3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-red-500"
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Update Vehicle</h2>
            <iframe
              src={`/dashboard/vehicles-entry?id=${selectedVehicle._id}&mode=edit`}
              className="w-full h-[600px] border rounded-md"
              onLoad={() => {
                const iframe = document.querySelector("iframe");
                iframe?.contentWindow?.postMessage(
                  { action: "closeModal" },
                  window.location.origin
                );
              }}
            ></iframe>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteVehicle}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesManagement;
