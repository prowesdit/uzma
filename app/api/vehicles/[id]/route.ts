import {
  getVehicleById,
  deleteVehicleById,
} from "@/app/lib/controller/vehicleController";
import { updateVehicleById } from "@/app/lib/models/vehicle";
import { NextResponse } from "next/server";

// Fetching and Updating a Vehicle
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicle = await getVehicleById(params.id);
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
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const vehicleData = await req.json();

  const existingVehicle = await getVehicleById(id);
  if (!existingVehicle) {
    return NextResponse.json(
      { message: "Vehicle not found." },
      { status: 404 }
    );
  }

  const updatedVehicle = await updateVehicleById(id, vehicleData);
  return NextResponse.json(updatedVehicle, { status: 200 });
}

// Deleting a Vehicle
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const result = await deleteVehicleById(id);
    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 400 });
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
