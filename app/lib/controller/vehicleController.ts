import {
  insertVehicle,
  getVehicles,
  getVehicle,
  deleteVehicle,
  updateVehicle,
} from "@/app/lib/models/vehicle";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function createVehicle(vehicleData: {
  model: string;
  registrationNumber: string;
  type: string;
  manufacturingYear: number;
  engineNumber: string;
  chassisNumber: string;
  fuelType: string;
  ownerName: string;
  ownerAddress: string;
  carryingCapacity: number;
  fitnessExpirationDate: string;
  licenseExpirationDate: string;
  taxTokenExpirationDate: string;
  routePermitExpirationDate: string;
  initialMileage: number;
  averageMileage: number;
  inService: boolean;
  mobileNumber?: string;
  assetFileUrl?: string;
}) {
  try {
    // Validate required fields
    const {
      model,
      registrationNumber,
      type,
      manufacturingYear,
      engineNumber,
      chassisNumber,
      fuelType,
      ownerName,
      ownerAddress,
      carryingCapacity,
      fitnessExpirationDate,
      licenseExpirationDate,
      taxTokenExpirationDate,
      routePermitExpirationDate,
      initialMileage,
      averageMileage,
      inService,
      mobileNumber,
      assetFileUrl,
    } = vehicleData;

    if (
      !model ||
      !registrationNumber ||
      !type ||
      !manufacturingYear ||
      !engineNumber ||
      !chassisNumber ||
      !fuelType ||
      !ownerName ||
      !ownerAddress ||
      !carryingCapacity ||
      !fitnessExpirationDate ||
      !licenseExpirationDate ||
      !taxTokenExpirationDate ||
      !routePermitExpirationDate ||
      !initialMileage ||
      !averageMileage ||
      !mobileNumber ||
      inService === undefined // Check for inService explicitly
    ) {
      return { success: false, error: "All fields are required." };
    }

    // Call the model to insert the vehicle
    const result = await insertVehicle(vehicleData);

    return { success: true, insertedId: result.insertedId };
  } catch (error) {
    console.error("Error in createVehicle controller:", error);
    return { success: false, error: "Failed to create vehicle." };
  }
}

// Function to get all vehicles
export async function getAllVehicles() {
  try {
    const vehicles = await getVehicles();
    // console.log("Fetched vehicles from model:", vehicles); // Debugging log
    return vehicles;
  } catch (error) {
    console.error("Error in getAllVehicles controller:", error);
    throw new Error("Failed to fetch vehicles.");
  }
}
// Function to get a vehicle by ID
// This function is used to fetch a vehicle by its ID from the database
// export async function getVehicleById(id: string) {
//   try {
//     console.log("Fetching vehicle with ID:", id); // Log the ID being fetched
//     const vehicle = await getVehicle(id);
//     if (!vehicle) {
//       console.error("Vehicle not found for ID:", id); // Log missing vehicle
//       throw new Error("Vehicle not found.");
//     }
//     return vehicle;
//   } catch (error) {
//     console.error("Error in getVehicleById controller:", error);
//     throw new Error("Failed to fetch vehicle.");
//   }
// }

// export async function updateVehicleById(id: string, vehicleData: any) {
//   try {
//     console.log("Updating vehicle with ID:", id);
//     // const objectId = new ObjectId(id);
//     const result = await updateVehicleById(id, vehicleData);
//     if (!result) {
//       console.error("No vehicle was updated for ID:", id);
//       return { success: false, error: "Vehicle not found or no changes made." };
//     }
//     return { success: true, message: "Vehicle updated successfully." };
//   } catch (error) {
//     console.error("Error in updateVehicle controller:", error);
//     return { success: false, error: "Failed to update vehicle." };
//   }
// }

// Function to delete a vehicle by ID
export async function deleteVehicleById(id: string) {
  try {
    // const objectId = new ObjectId(id); // Convert to ObjectId

    const result = await deleteVehicle(id);
    return result;
  } catch (error) {
    console.error("Error in deleteVehicleById controller:", error);
    return { success: false, error: "Failed to delete vehicle." };
  }
}

// Function to get a vehicle by ID
export async function getVehicleById(vehicleId: string) {
  try {
    // console.log("Before Converting ID to ObjectId:", vehicleId);

    if (!ObjectId.isValid(vehicleId)) {
      console.error("Invalid ID format:", vehicleId);
      throw new Error("Invalid ID format.");
    }

    // Convert to ObjectId before querying
    const objId = new ObjectId(vehicleId);
    // console.log("After Converting ID to ObjectId:", objId);

    const vehicle = await getVehicle(vehicleId);
    if (!vehicle) {
      console.error("Vehicle not found for ID:", vehicleId);
      throw new Error("Vehicle not found.");
    }

    // console.log("Fetched vehicle:", vehicle);
    return vehicle;
  } catch (error) {
    console.error("Error in getVehicleById controller:", error);
    throw error; // Propagate the original error
  }
}
// Function to update a vehicle by ID
export async function updateVehicleById(
  vehicleId: string,
  vehicleData: {
    model?: string;
    registrationNumber?: string;
    type?: string;
    manufacturingYear?: number;
    engineNumber?: string;
    chassisNumber?: string;
    fuelType?: string;
    ownerName?: string;
    ownerAddress?: string;
    carryingCapacity?: number;
    fitnessExpirationDate?: string;
    licenseExpirationDate?: string;
    taxTokenExpirationDate: string; // <-- NEW
    routePermitExpirationDate: string; // <-- NEW
    initialMileage?: number;
    averageMileage?: number;
    inService?: boolean;
    assetFileUrl?: string;
  }
) {
  try {
    // Provide default values for missing properties
    const completeVehicleData = {
      model: vehicleData.model || "",
      registrationNumber: vehicleData.registrationNumber || "",
      type: vehicleData.type || "",
      manufacturingYear: vehicleData.manufacturingYear || 0,
      engineNumber: vehicleData.engineNumber || "",
      chassisNumber: vehicleData.chassisNumber || "",
      fuelType: vehicleData.fuelType || "",
      ownerName: vehicleData.ownerName || "",
      ownerAddress: vehicleData.ownerAddress || "",
      carryingCapacity: vehicleData.carryingCapacity || 0,
      fitnessExpirationDate: vehicleData.fitnessExpirationDate || "",
      licenseExpirationDate: vehicleData.licenseExpirationDate || "",
      taxTokenExpirationDate: vehicleData.taxTokenExpirationDate || "",
      routePermitExpirationDate: vehicleData.routePermitExpirationDate || "",
      initialMileage: vehicleData.initialMileage || 0,
      averageMileage: vehicleData.averageMileage || 0,
      inService: vehicleData.inService || false,
      assetFileUrl: vehicleData.assetFileUrl || "",
    };

    const result = await updateVehicle(vehicleId, completeVehicleData); // Pass the complete object
    return { success: true, data: result };
  } catch (error) {
    console.error("Controller : Error updating vehicle:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update vehicle",
    };
  }
}
