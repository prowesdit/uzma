"use client";

import { XCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Vehicle {
  // _id: string;
  model: string;
  registrationNumber: string;
  type: string;
  manufacturingYear: string | number;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  ownerName: string;
  ownerAddress: string;
  carryingCapacity: string | number;
  fitnessExpirationDate: string;
  licenseExpirationDate: string;
  initialMileage: string | number;
  averageMileage: string | number;
  inService: boolean;
  assetFiles?: File[];
  assetFileUrl?: string;
}

const VehiclesEntry = (selectedVehicle: Vehicle) => {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  useEffect(() => {
    // Access the window object safely on the client side
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const mode = searchParams?.get("mode");
  const buttonText = mode === "edit" ? "Update Vehicle" : "Add Vehicle";

  const vehicleId = searchParams?.get("id");
  console.log(vehicleId);

  const [formData, setFormData] = useState<Vehicle>({
    // _id: "", // Default value for _id
    model: "",
    registrationNumber: "",
    type: "",
    manufacturingYear: 0,
    engineNumber: "",
    chassisNumber: "",
    fuelType: "",
    ownerName: "",
    ownerAddress: "",
    carryingCapacity: 0,
    fitnessExpirationDate: "",
    licenseExpirationDate: "",
    initialMileage: 0,
    averageMileage: 0,
    inService: false,
    assetFiles: [] as File[], // field for the uploaded file
  });

  // Fetch vehicle data if an ID is provided

  useEffect(() => {
    if (vehicleId) {
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`/api/vehicles/${vehicleId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch vehicle");
          }
          const data = await response.json();
          console.log(data);
          // Convert date strings to proper format for input fields
          setFormData({
            ...data,
            fitnessExpirationDate: data.fitnessExpirationDate?.split("T")[0],
            licenseExpirationDate: data.licenseExpirationDate?.split("T")[0],
          });
        } catch (error) {
          console.error("Error fetching vehicle:", error);
        }
      };

      fetchVehicle();
    }
  }, [vehicleId]);

  const [filePreviews, setFilePreviews] = useState<
    { name: string; preview: string | null }[]
  >([]); // Array to store file previews
  // const [fileName, setFileName] = useState<string | null>(null); // For file name
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files); // Convert FileList to an array
      setFormData({ ...formData, assetFiles: files });
      // setFileName(file.name); // Set the file name for display

      // Generate previews for image and PDF files
      const previews = files.map((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            setFilePreviews((prev) => [
              ...prev,
              { name: file.name, preview: reader.result as string },
            ]);
          };
          reader.readAsDataURL(file);
        } else if (file.type === "application/pdf") {
          const pdfUrl = URL.createObjectURL(file);
          return { name: file.name, preview: pdfUrl };
        } else {
          return { name: file.name, preview: null }; // No preview for unsupported files
        }
      });

      // Add non-image previews (e.g., PDFs) to the state
      setFilePreviews((prev) => [
        ...prev,
        ...previews.filter((preview) => preview !== undefined),
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "assetFiles") {
          formDataToSend.append(key, formData[key as keyof Vehicle] as string);
        }
      });

      // Append files if any
      formData.assetFiles?.forEach((file) => {
        formDataToSend.append("assetFiles", file);
      });
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        window.parent.postMessage(
          { action: "vehicleUpdated" },
          window.location.origin
        );
      } else {
        const error = await response.json();
        console.error("Failed to update vehicle:", error.message);
      }
      // console.log("Vehicle updated successfully!");
    } catch (error) {
      console.error("Error updating vehicle:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Remove the file input reference
  const handleRemoveFile = (index: number) => {
    // Remove the file from the assetFiles array
    const updatedFiles = (formData.assetFiles ?? []).filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, assetFiles: updatedFiles });

    // Remove the file preview
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);
    setFilePreviews(updatedPreviews);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Vehicle Entry Form</h1>
      <form onSubmit={handleSubmit} className="  space-y-4 w-2/3">
        {/* //model */}
        <div>
          <label className="block text-sm font-medium">Model</label>
          <input
            type="text"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //registrationNumber */}
        <div>
          <label className="block text-sm font-medium">
            Registration Number
          </label>
          <input
            type="text"
            name="registrationNumber"
            // value={formData.registrationNumber}
            defaultValue={selectedVehicle.registrationNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //vehicle type */}
        <div>
          <label className="block text-sm font-medium">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //manufacturing year */}
        <div>
          <label className="block text-sm font-medium">
            Manufacturing Year
          </label>
          <input
            type="number"
            name="manufacturingYear"
            value={formData.manufacturingYear}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* Engine Number */}
        <div>
          <label className="block text-sm font-medium">Engine Number</label>
          <input
            type="text"
            name="engineNumber"
            value={formData.engineNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //chassis number */}
        <div>
          <label className="block text-sm font-medium">Chassis Number</label>
          <input
            type="text"
            name="chassisNumber"
            value={formData.chassisNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //fuel type */}
        <div>
          <label className="block text-sm font-medium">Fuel Type</label>
          <input
            type="text"
            name="fuelType"
            // value={formData.fuelType}
            defaultValue={selectedVehicle.fuelType}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //owner name */}
        <div>
          <label className="block text-sm font-medium">Owner's Name</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //owner address */}
        <div>
          <label className="block text-sm font-medium">Owner's Address</label>
          <textarea
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          ></textarea>
        </div>
        {/* //carrying capacity */}
        <div>
          <label className="block text-sm font-medium">
            Carrying Capacity(Ton)
          </label>
          <input
            type="number"
            name="carryingCapacity"
            value={formData.carryingCapacity}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //fitness expiration date */}
        <div>
          <label className="block text-sm font-medium">
            Fitness Expiration Date
          </label>
          <input
            type="date"
            name="fitnessExpirationDate"
            value={formData.fitnessExpirationDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>
        {/* //license expiration date */}
        <div>
          <label className="block text-sm font-medium">
            License Expiration Date
          </label>

          <input
            type="date"
            name="licenseExpirationDate"
            value={formData.licenseExpirationDate}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>

        {/* Initial Mileage / Litre */}
        <div>
          <label className="block text-sm font-medium">
            Initial Mileage / Litre
          </label>
          <input
            type="number"
            name="initialMileage"
            value={formData.initialMileage}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>

        {/* Average Mileage / Litre */}
        <div>
          <label className="block text-sm font-medium">
            Average Mileage / Litre
          </label>
          <input
            type="number"
            name="averageMileage"
            value={formData.averageMileage}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300"
          />
        </div>

        {/* In Service? */}
        <div className="flex items-center space-x-2">
          <label className="block text-sm font-medium">onTrip?</label>
          <input
            type="checkbox"
            name="inService"
            checked={formData.inService}
            onChange={(e) =>
              setFormData({ ...formData, inService: e.target.checked })
            }
            className="h-5 w-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        {/* Upload Vehicles Document */}
        <div className="mt-2">
          <label htmlFor="assetFiles" className="block text-sm font-medium">
            Upload Vehicles Document
            {/* <PaperClipIcon className="h-5 w-5 text-gray-600" /> */}
          </label>
          <input
            id="assetFiles"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            multiple
            onChange={handleFileChange}
            ref={(ref) => setFileInputRef(ref)} // Set the file input reference
            className="flex items-center space-x-2"
          />
        </div>

        {/* File Previews */}
        {filePreviews.length > 0 && (
          <div className="mt-4 flex">
            {filePreviews.map((file, index) => (
              <div
                key={index}
                className="my-4 w-[180px] h-[180px] flex flex-col justify-center items-center border rounded-md p-2 relative"
              >
                {file.preview ? (
                  file.name.endsWith(".pdf") ? (
                    <iframe
                      src={file.preview}
                      title={`PDF Preview ${index}`}
                      className="mt-2 w-full h-64 border rounded-md"
                    ></iframe>
                  ) : (
                    <img
                      src={file.preview}
                      alt={`File Preview ${index}`}
                      className="mt-2 w-32 h-32 object-cover rounded-md border"
                    />
                  )
                ) : (
                  <p className="text-gray-500 mt-2">No preview available</p>
                )}
                <p className="text-sm font-medium mt-2">{file.name}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 ${
              isSubmitting ? "bg-gray-400" : "bg-blue-600"
            } text-white rounded-md`}
          >
            {isSubmitting
              ? "Updating..."
              : mode === "edit"
              ? "Update Vehicle"
              : "Add Vehicle"}
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default VehiclesEntry;
