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
  taxTokenExpirationDate: string;
  routePermitExpirationDate: string;
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

// Function to get a vehicle by ID
export async function getVehicle(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    // Try both ObjectId and string queries
    const query = { _id: new ObjectId(id) };

    // console.log("Database query:", query);
    const vehicle = await collection.findOne(query);
    // console.log("Database query result:", vehicle);

    return vehicle;
  } catch (error) {
    console.error("Error fetching vehicle from database:", error);
    throw new Error(`Database Error: Failed to fetch vehicle. ${error}`);
  }
}
//update vehicle by id
export async function updateVehicle(id: string, vehicleData: any) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    // console.log("Model: Updating vehicle:", id);
    // console.log("Model: Update data:", vehicleData);

    const { _id, ...updateData } = vehicleData;

    const query = {
      $or: [{ _id: new ObjectId(id) }, { _id: id }],
    };

    // Perform the update
    const result = await collection.updateOne(query, {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    // console.log("Update result:", result);
    // const result = await collection.updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: { ...vehicleData, updatedAt: new Date() } }
    // );
    if (result.matchedCount === 0) {
      const vehicle = await collection.findOne(query);
      if (!vehicle) {
        console.error(`No vehicle found with id: ${id}`);
        throw new Error(`Vehicle not found with id: ${id}`);
      }
      // throw new Error("Vehicle not found");
    }
    if (result.modifiedCount === 0) {
      console.warn("Vehicle found but no changes made");
    }
    // console.log("Update result:", result); // Log the update result
    return {
      success: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  } catch (error) {
    console.error("Model: Error updating vehicle:", error);
    throw new Error("Database Error: Failed to update vehicle.");
  }
}

// Function to delete a vehicle by ID
export async function deleteVehicle(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("vehicles");

    // console.log("Model: Starting delete operation for ID:", id);

    // Try both ObjectId and string queries
    const query = {
      $or: [{ _id: new ObjectId(id) }, { _id: id }],
    };

    // First check if vehicle exists
    const vehicle = await collection.findOne(query);
    if (!vehicle) {
      console.log("Model: No vehicle found with ID:", id);
      return { success: false, error: "Vehicle not found" };
    }

    // console.log("Model: Found vehicle:", vehicle);

    // Perform deletion
    const result = await collection.deleteOne({ _id: vehicle._id });
    // console.log("Model: Delete result:", result);

    return {
      success: result.deletedCount > 0,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    // console.error("Model: Error in deleteVehicle:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
