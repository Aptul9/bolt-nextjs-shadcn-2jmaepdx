import prisma from "@/lib/api/prisma";

export async function logAccess(userId: string, tenantId: string, door?: number) {
  return prisma.accessLog.create({
    data: {
      userId,
      tenantId,
      door,
      timestamp: new Date(),
    },
  });
}