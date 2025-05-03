import clientPromise from "@/app/lib/db/mongodb";
import { ObjectId } from "mongodb";
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
  initialMileage: number;
  averageMileage: number;
  inService: boolean;
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

// Function to get all vehicles from the database
export async function getVehicles() {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    const vehicles = await collection.find({}).toArray();
    // console.log("Fetched vehicles from database:", vehicles); // Debugging log

    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw new Error("Database Error: Failed to fetch vehicles.");
  }
}

export async function getVehicle(id: string) {
  try {
    console.log("Before Converting ID to ObjectId:", id); // Log the ID before conversion
    // const objectId = new ObjectId(id);
    // console.log("After Converting ID to ObjectId:", objectId); // Log the converted ID
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    // Check if the ID is a valid ObjectId
    const objectId = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id }; // Fallback to string-based query

    const vehicle = await collection.findOne({ _id: objectId });
    console.log("Database query result:", vehicle); // Log the database result

    return vehicle;
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    throw new Error("Database Error: Failed to fetch vehicle.");
  }
}

export async function updateVehicle(id: string, vehicleData: any) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    const { _id, ...updateData } = vehicleData;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    console.log("Update result:", result); // Log the update result
    return { success: result.modifiedCount > 0 };
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw new Error("Database Error: Failed to update vehicle.");
  }
}

// Function to delete a vehicle by ID
export async function deleteVehicle(id: ObjectId) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");
    console.log("Deleting vehicle with ID:", id); // Log the ID being deleted
    const result = await collection.deleteOne({ _id: id });
    return { success: result.deletedCount > 0 };
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    throw new Error("Database Error: Failed to delete vehicle.");
  }
}
