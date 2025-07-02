import { NextRequest } from "next/server";
import { connectDB } from "../db/connectDB";
import Product from "../model/product.model";

export async function GET(request: NextRequest){
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("searchTerm");

    const products = await Product.find({name: {$regex: searchTerm, $options: "i"}}).sort({createdAt: -1});
    return Response.json({products}, {status: 200});
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    return Response.json({ message: error.message }, { status: 400 });
  }
}