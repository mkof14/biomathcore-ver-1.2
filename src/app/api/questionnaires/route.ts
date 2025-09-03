import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  try {
    const allQuestionnaires = await prisma.questionnaire.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { title: 'asc' },
    });

    if (!session || !session.user) {
      // Not logged in, return only public questionnaires
      const publicQuestionnaires = allQuestionnaires.filter(
        (q) => q.visibility === 'PUBLIC'
      );
      return NextResponse.json(publicQuestionnaires);
    }

    // User is logged in, determine their plan and role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        subscriptions: {
          where: { status: 'active' }, // only consider active subscriptions
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userIsAdmin = user.role === 'admin';
    const userPlans = user.subscriptions.map((sub) => sub.plan).filter(Boolean) as string[];

    const availableQuestionnaires = allQuestionnaires.filter((q) => {
      if (userIsAdmin) {
        return true; // Admins see everything
      }

      switch (q.visibility) {
        case 'PUBLIC':
          return true;
        case 'LOGGED_IN':
          return true; // Already checked for logged in user
        case 'PLAN_GATED':
          if (q.requiredPlans.length === 0) {
            return true; // No specific plan required
          }
          // Check if user has any of the required plans
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
  } finally {
    await prisma.$disconnect();
  }
}
