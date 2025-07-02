import cloudinary from "@/utils/cloudinary";
import { connectDB } from "../../db/connectDB";
import Product from "../../model/product.model";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  await connectDB();
  const productId = (await params).productId;
  console.log("Fetching product with ID:", productId);
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return Response.json({ message: "Product not found" }, {status: 404});
    }
    return Response.json({product}, {status: 200});
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return Response.json({ message: "Failed to fetch product" }, {status: 400});
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
){
  await connectDB();
  const productId = (await params).productId;

  try {
    const product = await Product.findById(productId);
    if(!product){
      return Response.json({message: "Product not found"}, {status: 400});
    }

    // Delete the product image from cloudinary
    const parts = product.image.split("/");
    const filename = parts[parts.length - 1];
    const imageId = filename.split(".")[0];

    cloudinary.uploader.destroy(`watches/${imageId}`).then((result) => {
      console.log("Image deleted from Cloudinary: ", result);
    });

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);
    return Response.json({message: "Product deleted successfully"}, {status: 200});

  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ message: "Failed to delete product" }, {status: 400});
  }
}
