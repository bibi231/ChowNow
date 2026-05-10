import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

function generatePickupCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, total, paymentRef } = await req.json();
    if (!items || !items.length || typeof total === 'undefined') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        items,
        total,           // cart already includes delivery fee
        pickupCode: generatePickupCode(),
        paymentMethod: paymentRef ? 'Card (Test)' : 'Bank Transfer',
        paymentRef: paymentRef || null,
      },
    });

    return NextResponse.json({ message: 'Order created', orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
