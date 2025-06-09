import { NextResponse } from "next/server"
import db from "../../../lib/db"

export async function POST(request) {
  try {
    const { userId, packageId, status = "active" } = await request.json()

    // Create subscription record
    const subscription = await db.subscription.create({
      data: {
        userId,
        packageId,
        status,
        startDate: new Date(),
        // For free package, no end date. For paid, calculate based on billing cycle
        endDate: packageId === "free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    // Update user's package limits
    await db.user.update({
      where: { id: userId },
      data: {
        currentPackage: packageId,
        packageLimits: getPackageLimits(packageId),
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Failed to create subscription",
        error,
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const subscription = await db.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(subscription)
    }

    const subscriptions = await db.subscription.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Failed to fetch subscriptions",
        error,
      },
      { status: 500 },
    )
  }
}

function getPackageLimits(packageId) {
  const limits = {
    free: {
      products: 10,
      images_per_product: 3,
      categories: 2,
      monthly_orders: 50,
      support: "email",
      analytics: "basic",
      transaction_fee: 0.05,
    },
    basic: {
      products: 100,
      images_per_product: 10,
      categories: 10,
      monthly_orders: 500,
      support: "chat",
      analytics: "advanced",
      transaction_fee: 0.03,
    },
    pro: {
      products: 500,
      images_per_product: 20,
      categories: "unlimited",
      monthly_orders: 2000,
      support: "24/7",
      analytics: "professional",
      transaction_fee: 0.02,
    },
    enterprise: {
      products: "unlimited",
      images_per_product: "unlimited",
      categories: "unlimited",
      monthly_orders: "unlimited",
      support: "dedicated",
      analytics: "custom",
      transaction_fee: 0.01,
    },
  }

  return limits[packageId] || limits.free
}
