import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoses";
import User from "@/models/users";
import { requireAuth } from "@/lib/auth";

// GET /api/users/me - Get current logged-in user
export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const user = await User.findById(session.user.id)
      .select("-password")
      .populate("wishlist")
      .populate("cartId");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

// PUT /api/users/me - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();
    await connectDB();

    const updates = await req.json();
    
    // Prevent updating sensitive fields
    delete updates._id;
    delete updates.role;
    delete updates.createdAt;

    // Hash password if provided
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    updates.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}