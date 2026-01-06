import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import { ObjectId } from "mongodb";
import Cart from "@/models/cart";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
    const session = await requireAuth();
    await connectDB();

    const cart = await Cart.findOne({ userId: new ObjectId(session.user.id) }).populate('items.productId', 'name');
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, items: cart.items });
    } catch (error: any) {
        const status = error.message === "Unauthorized" ? 401 : 500;
        return NextResponse.json(
            { success: false, message: error.message },
            { status }
        );
    }
}