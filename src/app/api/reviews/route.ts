import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET: fetch reviews for a menuItemId
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const menuItemId = searchParams.get('menuItemId');
  if (!menuItemId) return NextResponse.json({ message: 'menuItemId required' }, { status: 400 });

  try {
    const reviews = await prisma.review.findMany({
      where: { menuItemId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const avgRating = reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    return NextResponse.json({ reviews, avgRating, count: reviews.length });
  } catch (e) {
    console.error('Review GET error:', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST: submit or update a review
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Log in to leave a review' }, { status: 401 });
  }
  try {
    const { menuItemId, rating, comment } = await req.json();
    if (!menuItemId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Invalid review data' }, { status: 400 });
    }
    const existing = await prisma.review.findFirst({
      where: { userId: session.user.id, menuItemId },
    });
    const review = existing
      ? await prisma.review.update({
          where: { id: existing.id },
          data: { rating, comment: comment || '' },
        })
      : await prisma.review.create({
          data: { menuItemId, userId: session.user.id, rating, comment: comment || '' },
        });
    return NextResponse.json({ review }, { status: 201 });
  } catch (e) {
    console.error('Review POST error:', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
