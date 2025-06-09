import db from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          data: null,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          data: null,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        package: user.currentPackage,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        data: {
          user: userWithoutPassword,
          token,
        },
        message: "Login successful",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        data: null,
        message: "Server Error: Something went wrong",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
