import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import Products from "@/models/products";
import { ObjectId } from 'mongodb';
import "@/models/categories";
import { requireAuth } from "@/lib/auth";

// GET /api/products/<id> - Fetch product by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    requireAuth();
    await connectDB();
    const products = await Products.findOne({_id: new ObjectId(id)})
    .select("name slug price discount finalPrice currency description categoryId brand images stock isActive ratingAvg ratingCount")
    .populate("categoryId", "name -_id");
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}