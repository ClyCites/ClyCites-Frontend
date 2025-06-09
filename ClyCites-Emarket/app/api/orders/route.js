import { NextResponse } from "next/server"
import db from "../../../lib/db"

export async function POST(request) {
  try {
    const orderData = await request.json()

    const newOrder = await db.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: orderData.userId,
        items: orderData.items,
        totalAmount: Number.parseFloat(orderData.totalAmount),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        status: "pending",
      },
    })

    return NextResponse.json(newOrder)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Failed to create Order",
        error,
      },
      { status: 500 },
    )
  }
}

export async function GET(request) {
  try {
    const orders = await db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Failed to Fetch Orders",
        error,
      },
      { status: 500 },
    )
  }
}
