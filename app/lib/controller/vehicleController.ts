import {
  insertVehicle,
  getVehicles,
  getVehicle,
  updateVehicleById,
  deleteVehicle,
} from "@/app/lib/models/vehicle";

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
  initialMileage: number;
  averageMileage: number;
  inService: boolean;
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
      !licenseExpirationDate
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

export async function getVehicleById(id: string) {
  try {
    const vehicle = await getVehicle(id);
    return vehicle;
  } catch (error) {
    console.error("Error in getVehicleById controller:", error);
    throw new Error("Failed to fetch vehicle.");
  }
}

export async function updateVehicle(id: string, vehicleData: any) {
  try {
    const result = await updateVehicleById(id, vehicleData);
    return result;
  } catch (error) {
    console.error("Error in updateVehicle controller:", error);
    return { success: false, error: "Failed to update vehicle." };
  }
}

// Function to delete a vehicle by ID
export async function deleteVehicleById(id: string) {
  try {
    const result = await deleteVehicle(id);
    return result;
  } catch (error) {
    console.error("Error in deleteVehicleById controller:", error);
    return { success: false, error: "Failed to delete vehicle." };
  }
}

// Function to get a vehicle by ID
// export async function getVehicleById(vehicleId: string) {
//   try {
//     const vehicle = await getVehicles(vehicleId);
//     return vehicle;
//   } catch (error) {
//     console.error("Error in getVehicleById controller:", error);
//     throw new Error("Failed to fetch vehicle.");
//   }
// }
// // Function to update a vehicle by ID
// export async function updateVehicleById(
//   vehicleId: string,
//   vehicleData: {
//     model?: string;
//     registrationNumber?: string;
//     type?: string;
//     manufacturingYear?: number;
//     engineNumber?: string;
//     chassisNumber?: string;
//     fuelType?: string;
//     ownerName?: string;
//     ownerAddress?: string;
//     carryingCapacity?: number;
//     fitnessExpirationDate?: string;
//     licenseExpirationDate?: string;
//     initialMileage?: number;
//     averageMileage?: number;
//     inService?: boolean;
//   }
// ) {
//   try {
//     const result = await insertVehicle(vehicleId, vehicleData);
//     return result;
//   } catch (error) {
//     console.error("Error in updateVehicleById controller:", error);
//     throw new Error("Failed to update vehicle.");
//   }
// }
