import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function PATCH(req: Request, context: any) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { status } = await req.json();

    if (!Object.values(OrderStatus).includes(status)) {
       return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    // Handle Promise-based params for Next.js 15 or synchronous params for older versions contextually 
    // by using "any" type context and awaiting if it's a promise
    const resolvedParams = await context.params;
    const orderId = resolvedParams.id;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
