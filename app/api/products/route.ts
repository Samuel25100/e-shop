import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import Products from "@/models/products";
import "@/models/categories";
import { requireAuth } from "@/lib/auth";


// GET /api/products - Fetch all products
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Products.find({}).select("name slug price discount finalPrice currency categoryId brand images stock isActive ratingAvg ratingCount").populate("categoryId", "name -_id");
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

