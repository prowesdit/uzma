
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







