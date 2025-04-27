import { insertVehicle } from "@/app/lib/models/vehicle";

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
