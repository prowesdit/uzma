import { NextRequest, NextResponse } from "next/server";
import {
  getVehicleById,
  deleteVehicleById,
  updateVehicleById,
} from "@/app/lib/controller/vehicleController";
import { updateVehicle, deleteVehicle } from "@/app/lib/models/vehicle";

// GET Handler
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ message: "Vehicle not found." }, { status: 404 });
    }
    return NextResponse.json(vehicle, { status: 200 });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to fetch vehicle." },
      { status: 500 }
    );
  }
}

// PUT Handler
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const vehicleData = await request.json();
    const { _id, ...updateData } = vehicleData;

    const result = await updateVehicleById(id, updateData);

    if (!result.success) {
      return NextResponse.json({ message: "Failed to update vehicle" }, { status: 400 });
    }

    return NextResponse.json({ message: "Vehicle updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json({ message: "Failed to update vehicle." }, { status: 500 });
  }
}

// DELETE Handler
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const result = await deleteVehicle(id);

    if (!result.success) {
      return NextResponse.json({ message: result.error || "Failed to delete vehicle" }, { status: 400 });
    }

    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("API: Error in DELETE handler:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
