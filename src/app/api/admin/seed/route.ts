import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'assets', 'data', 'menu.json');
    const fileData = fs.readFileSync(dataPath, 'utf8');
    const menuItems = JSON.parse(fileData);

    const results = [];
    for (const item of menuItems) {
      const res = await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category,
          image: item.image,
        },
      });
      results.push(res);
    }
    return NextResponse.json({ success: true, count: results.length, items: results });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ message: 'Seed failed', error: error.message }, { status: 500 });
  }
}
