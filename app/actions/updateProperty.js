"use server";
import connectDB from "../../config/database";
import Property from "../../models/Property";
import { getSessionUser } from "../../utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateProperty(propertyId, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User Id is required");
  }

  const { userId } = sessionUser;

  const existingProperty = await Property.findById(propertyId);

  //Verify Ownership
  if (existingProperty.owner.toString() !== userId) {
    throw new Error("Current User Does Not Own This Property");
  }

  const amenities = formData.getAll("amenities");

  const propertyData = {
    owner: userId,
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: parseInt(formData.get("beds")),
    baths: parseInt(formData.get("baths")),
    square_feet: parseInt(formData.get("square_feet")),
    rates: {
      nightly: parseInt(formData.get("rates.nightly")),
      weekly: parseInt(formData.get("rates.weekly")),
      monthly: parseInt(formData.get("rates.monthly")),
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
    amenities,
  };

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    propertyData
  );
  revalidatePath("/", "layout");

  redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;
