import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: { isAvailable: true },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Fetch menu items error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
