import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, height, weight, notifications, preferences } = body;

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        height,
        weight,
        settings: {
          upsert: {
            create: {
              notifications,
              preferences,
            },
            update: {
              notifications,
              preferences,
            },
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
