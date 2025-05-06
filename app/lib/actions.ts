"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import clientPromise from "./db/mongodb";
import { ObjectId } from "mongodb";


// types and schemas

const UserFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write a name.",
  }),
  email: z.string({
    invalid_type_error: "Please write an email.",
  }),
  password: z
    .string()
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value ?? ""
        ),
      "Password should have 1 small and 1 capital letter, 1 number, 1 special character without dot(.). It has to be minimum of length 8."
    ),
  contact: z.string({
    invalid_type_error: "Please write a phone number.",
  }),
  user_role: z.string({
    invalid_type_error: "Please select a role for the user.",
  }),
  address: z.string({
    invalid_type_error: "Please write an address.",
  }),
  date: z.string(),
});

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    contact?: string[];
    user_role?: string[];
    address?: string[];
  };
  message?: string | null;
};

const OfficeFormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please write a name.",
  }),
  address: z.string({
    invalid_type_error: "Please write an address.",
  }),
  manager: z.string({
    invalid_type_error: "Please write manager name.",
  }),
  contact: z.string({
    invalid_type_error: "Please write contact info.",
  }),
  date: z.string(),
});

export type OfficeState = {
  errors?: {
    name?: string[];
    address?: string[];
    manager?: string[];
    contact?: string[];
  };
  message?: string | null;
};

const BookingFormSchema = z.object({
  id: z.string(),
  customer: z.string({
    invalid_type_error: "Please provide customer name.",
  }),
  vehicle: z.string({
    invalid_type_error: "Please provide vehicle info.",
  }),
  driver: z.string({
    invalid_type_error: "Please provide driver info.",
  }),
  pickup_address: z.string({
    invalid_type_error: "Please provide pickup address.",
  }),
  dropoff_address: z.string({
    invalid_type_error: "Please provide dropoff address.",
  }),
  pickup_dt: z.string({
    invalid_type_error: "Please provide pickup date & time.",
  }),
  dropoff_dt: z.string({
    invalid_type_error: "Please provide dropoff date & time.",
  }),
  return_pickup_dt: z.string().optional(),
  return_dropoff_dt: z.string().optional(),
  passenger_num: z.coerce.number({
    invalid_type_error: "Please provide number of passengers.",
  }),
  payment_status: z.enum(["pending", "paid"]),
  booking_status: z.enum(["upcoming", "pending", "completed"]),
  booking_type: z.enum(["oneway", "return"]),
  note: z.string().optional(),
});

export type BookingState = {
  errors?: {
    customer?: string[];
    vehicle?: string[];
    driver?: string[];
    pickup_address?: string[];
    dropoff_address?: string[];
    pickup_dt?: string[];
    dropoff_dt?: string[];
    return_pickup_dt?: string[];
    return_dropoff_dt?: string[];
    passenger_num?: string[];
    payment_status?: string[];
    booking_status?: string[];
    booking_type?: string[];
  };
  message?: string | null;
};


// functions

const CreateUser = UserFormSchema.omit({ id: true, date: true });
export async function createUser(prevState: UserState, formData: FormData) {
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    contact: formData.get("contact"),
    user_role: formData.get("user_role"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  const { name, email, password, contact, user_role, address } =
    validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const image_url = "/customers/evil-rabbit.png";
  const date = new Date().toISOString().split("T")[0];

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      contact,
      user_role,
      address,
      image_url,
      created_at: date,
    });

    revalidatePath("/dashboard/users");
    return { message: "User created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create User." };
  }
}

export async function deleteUser(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/users");
    return { message: "Deleted User." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete User." };
  }
}


const CreateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function createOffice(prevState: OfficeState, formData: FormData) {
  const validatedFields = CreateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
  });

  if (!validatedFields.success) {
    console.log("error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Office.",
    };
  }

  const { name, address, manager, contact } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.insertOne({
      office_name: name,
      address,
      manager,
      contact,
      created_at: new Date(),
    });

    revalidatePath("/dashboard/offices");
    return { message: "Office created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Office." };
  }
}

const UpdateOffice = OfficeFormSchema.omit({ id: true, date: true });
export async function updateOffice(
  id: string,
  prevState: OfficeState,
  formData: FormData
) {
  const validatedFields = UpdateOffice.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    manager: formData.get("manager"),
    contact: formData.get("contact"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Office.",
    };
  }

  const { name, address, manager, contact } = validatedFields.data;
  console.log(id, name, address, manager, contact)

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          office_name: name,
          address,
          manager,
          contact,
        },
      }
    );

    revalidatePath("/dashboard/offices");
    return { message: "Office edited successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Office." };
  }
}

export async function deleteOffice(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    await collection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/offices");
    return { message: "Deleted office." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete Office." };
  }
}


const CreateBooking = BookingFormSchema.omit({ id: true });
export async function createBooking(prevState: BookingState, formData: FormData) {
  const validatedFields = CreateBooking.safeParse({
    customer: formData.get("customer"),
    vehicle: formData.get("vehicle"),
    driver: formData.get("driver"),
    pickup_address: formData.get("pickup_address"),
    dropoff_address: formData.get("dropoff_address"),
    pickup_dt: formData.get("pickup_dt"),
    dropoff_dt: formData.get("dropoff_dt"),
    return_pickup_dt: formData.get("return_pickup_dt") || undefined,
    return_dropoff_dt: formData.get("return_dropoff_dt") || undefined,
    passenger_num: formData.get("passenger_num"),
    payment_status: formData.get("payment_status"),
    booking_status: formData.get("booking_status"),
    booking_type: formData.get("booking_type"),
    note: formData.get("note") || undefined,
  });

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Booking.",
    };
  }

  const {
    customer,
    vehicle,
    driver,
    pickup_address,
    dropoff_address,
    pickup_dt,
    dropoff_dt,
    return_pickup_dt,
    return_dropoff_dt,
    passenger_num,
    payment_status,
    booking_status,
    booking_type,
    note,
  } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    await collection.insertOne({
      customer,
      vehicle,
      driver,
      pickup_address,
      dropoff_address,
      pickup_dt: new Date(pickup_dt),
      dropoff_dt: new Date(dropoff_dt),
      return_pickup_dt: return_pickup_dt ? new Date(return_pickup_dt) : null,
      return_dropoff_dt: return_dropoff_dt ? new Date(return_dropoff_dt) : null,
      passenger_num,
      payment_status,
      booking_status,
      booking_type,
      note: note || "",
      created_at: new Date(),
    });

    revalidatePath("/dashboard/bookings");
    return { message: "Booking created successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Create Booking." };
  }
}

const UpdateBooking = BookingFormSchema.omit({ id: true });
export async function updateBooking(
  id: string,
  prevState: BookingState,
  formData: FormData
) {
  const validatedFields = UpdateBooking.safeParse({
    customer: formData.get("customer"),
    vehicle: formData.get("vehicle"),
    driver: formData.get("driver"),
    pickup_address: formData.get("pickup_address"),
    dropoff_address: formData.get("dropoff_address"),
    pickup_dt: formData.get("pickup_dt"),
    dropoff_dt: formData.get("dropoff_dt"),
    return_pickup_dt: formData.get("return_pickup_dt") || undefined,
    return_dropoff_dt: formData.get("return_dropoff_dt") || undefined,
    passenger_num: formData.get("passenger_num"),
    payment_status: formData.get("payment_status"),
    booking_status: formData.get("booking_status"),
    booking_type: formData.get("booking_type"),
    note: formData.get("note") || undefined,
  });

  if (!validatedFields.success) {
    console.log("Validation error:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Booking.",
    };
  }

  const {
    customer,
    vehicle,
    driver,
    pickup_address,
    dropoff_address,
    pickup_dt,
    dropoff_dt,
    return_pickup_dt,
    return_dropoff_dt,
    passenger_num,
    payment_status,
    booking_status,
    booking_type,
    note,
  } = validatedFields.data;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          customer: customer,
          vehicle,
          driver,
          pickup_address,
          dropoff_address,
          pickup_dt,
          dropoff_dt,
          return_pickup_dt,
          return_dropoff_dt,
          passenger_num,
          payment_status,
          booking_status,
          booking_type,
          note,
        },
      }
    );

    revalidatePath("/dashboard/bookings");
    return { message: "Booking edited successfully." };
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Update Booking." };
  }
}





// authentication
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
