
import clientPromise from './db/mongodb';
import { ObjectId } from 'mongodb';
// dashboard queries


// other queries

const ITEMS_PER_PAGE = 20;

export async function fetchUsersPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    const count = await collection.countDocuments({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { user_role: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of users.");
  }
}

export async function fetchFilteredUsers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");

    const users = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { user_role: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return users.map(user => ({
      name: user.name,
      user_role: user.user_role,
      email: user.email,
      contact: user.contact,
      address: user.address,
      image_url: user.image_url,
      id: user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch users.");
  }
}

export async function fetchUserById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("users");


    //
    const fetched_user = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_user) {
      throw new Error("User not found.");
    }

    const user = {
      name: fetched_user.name,
      user_role: fetched_user.user_role,
      email: fetched_user.email,
      contact: fetched_user.contact,
      address: fetched_user.address,
      image_url: fetched_user.image_url,
      id: fetched_user._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}



export async function fetchOfficesPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const count = await collection.countDocuments({
      $or: [
        { office_name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { contact: { $regex: query, $options: "i" } },
        { manager: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of offices.");
  }
}

export async function fetchOffices() {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const offices = await collection.find({}).toArray();

    // Convert `_id` to string
    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchFilteredOffices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const offices = await collection
      .find({
        $or: [
          { office_name: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
          { contact: { $regex: query, $options: "i" } },
          { manager: { $regex: query, $options: "i" } },
          { code: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ office_name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return offices.map(office => ({
      office_name: office.office_name,
      address: office.address,
      contact: office.contact,
      manager: office.manager,
      
      id: office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch offices.");
  }
}

export async function fetchOfficeById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("offices");

    const fetched_office = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_office) {
      throw new Error("Office not found.");
    }

    const office = {
      office_name: fetched_office.office_name,
      address: fetched_office.address,
      contact: fetched_office.contact,
      manager: fetched_office.manager,
      code: fetched_office.code,
      id: fetched_office._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return office;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch office.");
  }
}

export async function fetchBookingsPages(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const count = await collection.countDocuments({
      $or: [
        { customer: { $regex: query, $options: "i" } },
        { vehicle: { $regex: query, $options: "i" } },
        { driver: { $regex: query, $options: "i" } },
        { pickup_address: { $regex: query, $options: "i" } },
        { dropoff_address: { $regex: query, $options: "i" } },
        { payment_status: { $regex: query, $options: "i" } },
        { booking_status: { $regex: query, $options: "i" } },
        { booking_type: { $regex: query, $options: "i" } },
        { note: { $regex: query, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of bookings.");
  }
}

export async function fetchFilteredBookings(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const bookings = await collection
      .find({
        $or: [
          { customer: { $regex: query, $options: "i" } },
          { vehicle: { $regex: query, $options: "i" } },
          { driver: { $regex: query, $options: "i" } },
          { pickup_address: { $regex: query, $options: "i" } },
          { dropoff_address: { $regex: query, $options: "i" } },
          { payment_status: { $regex: query, $options: "i" } },
          { booking_status: { $regex: query, $options: "i" } },
          { booking_type: { $regex: query, $options: "i" } },
          { note: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ pickup_dt: -1 }) // newest bookings first
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return bookings.map(booking => ({
      id: booking._id.toString(), // ObjectId to string
      customer: booking.customer,
      vehicle: booking.vehicle,
      driver: booking.driver,
      pickup_address: booking.pickup_address,
      dropoff_address: booking.dropoff_address,
      pickup_dt: booking.pickup_dt,
      dropoff_dt: booking.dropoff_dt,
      return_pickup_dt: booking.return_pickup_dt,
      return_dropoff_dt: booking.return_dropoff_dt,
      passenger_num: booking.passenger_num,
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      booking_type: booking.booking_type,
      note: booking.note,
      
      _id: undefined, // optional: hide the original _id if you want clean objects
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

export async function fetchBookingById(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("bookings");

    const fetched_booking = await collection.findOne({ _id: new ObjectId(id) });

    if (!fetched_booking) {
      throw new Error("Booking not found.");
    }

    const booking = {
      customer: fetched_booking.customer,
      vehicle: fetched_booking.vehicle,
      driver: fetched_booking.driver,
      pickup_address: fetched_booking.pickup_address,
      dropoff_address: fetched_booking.dropoff_address,
      pickup_dt: fetched_booking.pickup_dt,
      dropoff_dt: fetched_booking.dropoff_dt,
      passenger_num: fetched_booking.passenger_num,
      payment_status: fetched_booking.payment_status,
      booking_status: fetched_booking.booking_status,
      booking_type: fetched_booking.booking_type,
      note: fetched_booking.note,
      id: fetched_booking._id.toString(), // Convert ObjectId to string
      _id: undefined, // Optionally remove the original `_id` field
    };

    return booking;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch booking.");
  }
}

export async function fetchFilteredInventories(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await clientPromise;
    const db = client.db("uzma");
    const collection = db.collection("parts");

    const inventories = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { type: { $regex: query, $options: "i" } },
          { vehicle: { $regex: query, $options: "i" } },
          { condition: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .skip(offset)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return inventories.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      type: item.type,
      vehicle: item.vehicle,
      condition: item.condition,
      quantity: item.quantity,
      price: item.price,
      expire_date: item.expire_date,
      created_at: item.created_at,
      updated_at: item.updated_at,
      _id: undefined,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch inventories.");
  }
}







