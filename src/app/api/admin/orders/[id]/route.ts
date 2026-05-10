import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, context: { params: any }) {
  try {
    const params = await context.params;

    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();

    const validStatuses = ['PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ message: 'Status updated', status: updatedOrder.status }, { status: 200 });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
