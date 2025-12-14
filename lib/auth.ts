import { auth } from "@/auth/authOptions";
import { NextRequest } from "next/server";

export async function getServerSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  
  if (session.user.role !== "admin") {
    throw new Error("Admin access required");
  }
  
  return session;
}
