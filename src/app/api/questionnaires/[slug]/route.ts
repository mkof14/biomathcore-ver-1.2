import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const session = await getServerSession(authOptions);

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { slug },
      include: { sections: { include: { questions: true } } },
    });
    if (!questionnaire) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (!session || !session.user) {
      if (questionnaire.visibility !== 'PUBLIC') {
        return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
      }
    } else if (questionnaire.visibility === 'PLAN_GATED') {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        include: { subscriptions: { where: { status: 'active' } } },
      });
      const plans = new Set((user?.subscriptions || []).map(s => s.plan).filter(Boolean) as string[]);
      const requiredPlans = (questionnaire.requiredPlans || '').split(',').map(p => p.trim()).filter(Boolean);
      const ok = requiredPlans.length === 0 || requiredPlans.some(p => plans.has(p));
      if (!ok) return NextResponse.json({ error: 'Required plan not active' }, { status: 403 });
    }

    return NextResponse.json(questionnaire);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export {};
