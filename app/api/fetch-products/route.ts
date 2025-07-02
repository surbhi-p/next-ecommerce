import { connectDB } from "../db/connectDB";
import Product from "../model/product.model";

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find({}).sort({createdAt: -1});
    return Response.json({products}, {status: 200})
  }catch (error: any) {
    console.error("Error fetching products:", error);
    return Response.json({error: error.message}, {status: 400});
  }
};