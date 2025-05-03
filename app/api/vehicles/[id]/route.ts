import {
  getVehicleById,
  deleteVehicleById,
  updateVehicleById,
} from "@/app/lib/controller/vehicleController";
import { updateVehicle } from "@/app/lib/models/vehicle";
import { NextResponse } from "next/server";

// Fetching and Updating a Vehicle
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const vehicle = await getVehicleById(id);
    console.log("Fetched vehicle:", vehicle); // Log the fetched vehicle
    if (!vehicle) {
      return NextResponse.json(
        { message: "Vehicle not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { message: "Failed to fetch vehicle." },
      { status: 500 }
    );
  }
}

//Update a Vehicle
/*export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const vehicleData = await req.json();

  const existingVehicle = await updateVehicleById(id, vehicleData);
  if (!existingVehicle) {
    return NextResponse.json(
      { message: "Vehicle not found." },
      { status: 404 }
    );
  }

  const updatedVehicle = await updateVehicle(id, vehicleData);
  return NextResponse.json(updatedVehicle, { status: 200 });
}*/

// Deleting a Vehicle
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const result = await deleteVehicleById(id);
    if (!result.success) {
      const errorMessage = "error" in result ? result.error : "Unknown error";
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Vehicle deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { message: "Failed to delete vehicle." },
      { status: 500 }
    );
  }
}

// Updating a Vehicle
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const result = await updateVehicleById(params.id, body);
    if (!result.success) {
      return NextResponse.json(
        { message: "error" in result ? result.error : "Unknown error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Vehicle updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { message: "Failed to update vehicle." },
      { status: 500 }
    );
  }
}
