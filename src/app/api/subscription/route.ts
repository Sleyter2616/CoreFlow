import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic workout tracking", "Limited analytics", "Email support"],
  },
  pro: {
    name: "Pro",
    price: 9.99,
    features: ["Unlimited workouts", "Advanced analytics", "Priority support"],
  },
  elite: {
    name: "Elite",
    price: 19.99,
    features: ["Everything in Pro", "Personal trainer", "Custom meal plans"],
  },
} as const;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
            status: true,
            currentPeriodEnd: true,
          }
        }
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const currentPlan = PLANS[user.subscription?.plan as keyof typeof PLANS] || PLANS.free;

    return NextResponse.json({
      currentPlan: {
        ...currentPlan,
        status: user.subscription?.status || 'inactive',
        periodEnd: user.subscription?.currentPeriodEnd,
      },
      availablePlans: PLANS,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!PLANS[plan as keyof typeof PLANS]) {
      return new NextResponse("Invalid plan", { status: 400 });
    }

    // Here you would typically:
    // 1. Create a checkout session with your payment provider (e.g., Stripe)
    // 2. Return the checkout URL to redirect the user
    // For now, we'll just update the user's plan directly
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscription: {
          upsert: {
            create: {
              plan,
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
            update: {
              plan,
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }
          }
        }
      },
      select: {
        subscription: true
      }
    });

    return NextResponse.json({
      success: true,
      plan: PLANS[plan as keyof typeof PLANS],
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
