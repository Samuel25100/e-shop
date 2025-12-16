import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import User from "@/models/users";
import { requireAdmin } from "@/lib/auth";

// GET /api/users/:id - Admin: Get user details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();

    const paramsResolved = await params;
    const user: any = await User.findById(paramsResolved.id)
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
    const status = error.message === "Unauthorized" ? 401 : 
                   error.message === "Admin access required" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

// DELETE /api/users/:id - Admin: Delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 
                   error.message === "Admin access required" ? 403 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}