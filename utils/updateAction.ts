"use server";

import { connectDB } from "@/app/api/db/connectDB";
import cloudinary from "./cloudinary";
import Product from "@/app/api/model/product.model";
// import Product from "@/app/api/models/product.model";

export async function updateAction(formData: FormData, id: string) {
  try {
    const image = formData.get("image") as any;
    const name = formData.get("name") as string;
    const price = formData.get("price"); // Assuming price is a number
    const link = formData.get("link") as string;
    const description = formData.get("description") as string;

    if (!name || !price || !link || !description) {
      console.log("All fields are required");
      // throw new Error("All fields are required and price must be a number.");
      return { error: "All fields are required and price must be a number." };
    }

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return { error: "Product not found." };
    }

    if (image.size === 0) {
      // Update without the image
      await Product.findByIdAndUpdate(id, {
        name,
        price,
        link,
        description,
      });
      return { success: "Product updated successfully!" };
    } else {
      // Delete the previous image from Cloudinary
      const parts = product.image.split("/");
      const filename = parts[parts.length - 1];
      const imageId = filename.split(".")[0];

      await cloudinary.uploader.destroy(`watches/${imageId}`).then((result) => {
        console.log("Image deleted from Cloudinary: ", result);
      });

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
      await Product.findByIdAndUpdate(id, {
        image: imageResponse.secure_url,
        name,
        price,
        link,
        description,
      });

      return { success: "Product added successfully!" };
    }
  } catch (error) {
    console.error("Error adding product:", error);
  }
}
