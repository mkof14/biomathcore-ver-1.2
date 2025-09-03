import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { z } from 'zod';

// A more specific schema for validating incoming answers.
const answerSchema = z.object({
  questionId: z.string().cuid(), // Expect a CUID for the question ID
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
  ]),
});

const submitBodySchema = z.array(answerSchema);

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const slug = params.slug;
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const body = await request.json();
  const parsedAnswers = submitBodySchema.safeParse(body);

  if (!parsedAnswers.success) {
    return NextResponse.json(
      { error: 'Invalid answers format', issues: parsedAnswers.error.issues },
      { status: 400 }
    );
  }

  try {
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { slug },
      select: { id: true, visibility: true, requiredPlans: true },
    });

    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found' }, { status: 404 });
    }

    // Authorization check
    if (questionnaire.visibility === 'PLAN_GATED') {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { subscriptions: { where: { status: 'active' } } },
        });
        if (!user || user.role !== 'admin') {
            const userPlans = user?.subscriptions.map(s => s.plan).filter(Boolean) as string[] || [];
            const requiredPlans = questionnaire.requiredPlans.split(',').map(p => p.trim()).filter(Boolean);
            if (requiredPlans.length > 0 && !requiredPlans.some(p => userPlans.includes(p))) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }
    }

    const newInstance = await prisma.questionnaireInstance.create({
        data: {
            questionnaireId: questionnaire.id,
            userId: session.user.id,
            status: 'COMPLETED',
            completedAt: new Date(),
            answers: {
                create: parsedAnswers.data.map(answer => ({
                    questionId: answer.questionId,
                    value: JSON.stringify(answer.value),
                })),
            },
        },
        include: {
            answers: true,
        }
    });

    return NextResponse.json({ success: true, instanceId: newInstance.id }, { status: 201 });

  } catch (error) {
    console.error(`Failed to submit questionnaire ${slug}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
