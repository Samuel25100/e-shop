import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import { ObjectId } from "mongodb";
import Cart from "@/models/cart";
import { requireAuth } from "@/lib/auth";

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const { item, totalItems, totalPrice} = await req.json();

    let cart = await Cart.findOne({ userId: new ObjectId(session.user.id) });
    if (!cart) {
      cart = new Cart({ userId: new ObjectId(session.user.id), items: [ item ], totalItems, totalPrice });
      await cart.save();
      return NextResponse.json({ success: true, cart }, { status: 201 });
    }

    if (!item.productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const existingItemIndex = cart.items.findIndex(
      (cartItem: any) => cartItem.productId.toString() === item.productId
    ) || 0;

    if (existingItemIndex !== -1) {
      return NextResponse.json(
        { success: false, message: "Item already in cart", product: {productId: cart.items[existingItemIndex].productId, quantity: cart.items[existingItemIndex].quantity} },
        { status: 201 }
      );
    }
    cart.items.push(item);
    cart.totalItems += totalItems ;
    cart.totalPrice += totalPrice;
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

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const cart = await Cart.findOne({ userId: new ObjectId(session.user.id) }).populate('items.productId', 'name slug price images stock isActive currency brand');
    if (!cart) {
      return NextResponse.json({ success: true, cart: null });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}