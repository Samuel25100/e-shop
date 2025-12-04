import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoses";
import User from "@/models/users";

function removePassword(user: any) {
  const {password, ...userObj} = user.toObject();
  return userObj;
}

// POST /api/users/register - Create new user account
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, phone, addresses } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength validation (min 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      addresses,
      role: "user", // Default role
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Remove password from response
    const userResponse = removePassword(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}