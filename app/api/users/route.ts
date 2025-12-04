import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoses";
import User from "@/models/users";
import { requireAdmin } from "@/lib/auth";

// GET /api/users - Admin: List all users
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
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