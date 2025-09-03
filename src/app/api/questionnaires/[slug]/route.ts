import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found' }, { status: 404 });
    }

    // Authorization check
    if (questionnaire.visibility !== 'PUBLIC') {
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscriptions: { where: { status: 'active' } } },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (user.role !== 'admin' && questionnaire.visibility === 'PLAN_GATED') {
        const userPlans = user.subscriptions.map((sub) => sub.plan).filter(Boolean) as string[];
        const requiredPlans = questionnaire.requiredPlans.split(',').map(p => p.trim()).filter(Boolean);

        if (requiredPlans.length > 0 && !requiredPlans.some(p => userPlans.includes(p))) {
          return NextResponse.json({ error: 'Forbidden: Insufficient plan' }, { status: 403 });
        }
      }
    }

    return NextResponse.json(questionnaire);
  } catch (error) {
    console.error(`Failed to fetch questionnaire ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
