import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import { ObjectId } from "mongodb";
import Cart from "@/models/cart";
import { requireAuth } from "@/lib/auth";

// GET /api/cart/num - Get cart item count
export async function GET(req: NextRequest) {
    try {
        const session = await requireAuth();
        await connectDB();

        const cart = await Cart.findOne({ userId: new ObjectId(session.user.id) });
        const itemCount = cart ? cart.totalItems : 0;
        return NextResponse.json({ success: true, itemCount });

    } catch (error: any) {
        const status = error.message === "Unauthorized" ? 401 : 500;
        return NextResponse.json(
          { success: false, message: error.message },
          { status }
        );
      }
}