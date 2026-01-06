import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import { ObjectId } from "mongodb";
import Cart from "@/models/cart";
import { requireAuth } from "@/lib/auth";

// UPDATE /api/cart - Update cart item quantities
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { itemUpdates, totalItems, totalPrice } = await req.json();

    const cart = await Cart.findOne({ userId: new ObjectId(session.user.id) });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    /* itemUpdates.forEach((update: any) => {
      const itemIndex = cart.items.findIndex(
        (cartItem: any) => cartItem.productId.toString() === update.productId
      );
      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity = update.quantity;
      }
    }); */
    cart.items = itemUpdates;

    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;
    cart.updatedAt = new Date();
    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}