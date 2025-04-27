import clientPromise from "@/app/lib/db/mongodb";

export async function insertVehicle(vehicleData: {
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
  {
    try {
      const client = await clientPromise;
      const db = client.db("uzma");
      const collection = db.collection("vehicles");

      const result = await collection.insertOne({
        ...vehicleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return result;
    } catch (error) {
      console.error("Error inserting vehicle:", error);
      throw new Error("Database Error: Failed to insert vehicle.");
    }
  }
}
