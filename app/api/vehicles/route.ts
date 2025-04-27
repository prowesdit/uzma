import { NextResponse } from "next/server";
import { createVehicle } from "@/app/lib/controller/vehicleController";
import cloudinary from "@/app/lib/cloudinary.config";
import { PassThrough } from "stream";

//cloudinary upload logic

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const vehicleData: any = {};

    // Extract text fields
    formData.forEach((value, key) => {
      if (key === "assetFile") return; // Skip file for now
      vehicleData[key] = value;
    });

    // Handle file upload to Cloudinary
    const file = formData.get("assetFile") as File | null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Create a PassThrough stream
      const stream = new PassThrough();
      stream.end(buffer);

      // Upload to Cloudinary
      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "vehicles",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as { secure_url: string });
              }
            }
          );
          console.log(uploadStream);

          stream.pipe(uploadStream);
        }
      );

      vehicleData.assetFileUrl = uploadResult.secure_url; // Save the Cloudinary URL
    }

    // Save vehicle data to the database
    const result = await createVehicle(vehicleData);
    console.log(result);
    if (result.success) {
      return NextResponse.json(
        { message: "Vehicle added successfully!", id: result.insertedId },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: result.error || "Failed to add vehicle." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
