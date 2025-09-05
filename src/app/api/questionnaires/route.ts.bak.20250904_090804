import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const allQuestionnaires = await prisma.questionnaire.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { title: 'asc' },
    });

    if (!session || !session.user) {
      const publicQuestionnaires = allQuestionnaires.filter(
        (q) => q.visibility === 'PUBLIC'
      );
      return NextResponse.json(publicQuestionnaires);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        subscriptions: {
          where: { status: 'active' },
        },
      },
    });

    if (!user) {
      // This can happen if a user is authenticated but not yet in the DB.
      // Returning an empty array is safe.
      return NextResponse.json([]);
    }

    const userIsAdmin = user.role === 'admin';
    const userPlans = user.subscriptions.map((sub) => sub.plan).filter(Boolean) as string[];

    const availableQuestionnaires = allQuestionnaires.filter((q) => {
      if (userIsAdmin) {
        return true;
      }

      switch (q.visibility) {
        case 'PUBLIC':
          return true;
        case 'LOGGED_IN':
          return true;
        case 'PLAN_GATED':
          if (!q.requiredPlans || q.requiredPlans.length === 0) {
            return true;
          }
          const requiredPlans = q.requiredPlans.split(',').map(p => p.trim());
          return requiredPlans.some(requiredPlan => userPlans.includes(requiredPlan));
        default:
          return false;
      }
    });

    return NextResponse.json(availableQuestionnaires);

  } catch (error) {
    console.error('Failed to fetch questionnaires:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
