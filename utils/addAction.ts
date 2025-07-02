"use server";

import { connectDB } from "@/app/api/db/connectDB";
import cloudinary from "./cloudinary";
import Product from "@/app/api/model/product.model";
// import Product from "@/app/api/models/product.model";

export async function addAction(formData: FormData) {
  try {
    const image = formData.get("image") as any;
    const name = formData.get("name") as string;
    const price = formData.get("price"); // Assuming price is a number
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;

    if (!image || !name || !price || !link || !description) {
      console.log("All fields are required");
      // throw new Error("All fields are required and price must be a number.");
      return { error: "All fields are required and price must be a number." };
    }

    await connectDB();

    // Image processes
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const imageResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: "watches",
          },
          async (error, result) => {
            if (error) {
              return reject(error.message);
            }
            return resolve(result);
          }
        )
        .end(buffer);
    });

    console.log("Image response: ", imageResponse);

    // Store in DB
    await Product.create({
      image: imageResponse.secure_url,
      name,
      price,
      link,
      description,
    });

    return { success: "Product added successfully!" };
    
  } catch (error) {
    console.error("Error adding product:", error);
  }
}