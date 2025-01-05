import prisma from "@/lib/api/prisma";

interface AccessValidationResult {
  isValid: boolean;
  error?: string;
  remainingSlots?: number | undefined | null;
}

export async function validateUserAccess(
  userId: string,
  tenantId: string
): Promise<AccessValidationResult> {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      tenantId: tenantId,
    },
  });

  if (!user) {
    return { isValid: false, error: "User not found" };
  }

  // Check if user is active
  if (!user.status) {
    return { isValid: false, error: "User is inactive" };
  }

  // Check if subscription is expired
  if (user.expiresAt < new Date()) {
    return { isValid: false, error: "Subscription expired" };
  }

  // Check remaining slots if they exist
  if (user.remainingSlots !== null && user.remainingSlots <= 0) {
    return { isValid: false, error: "No remaining slots available" };
  }

  return { isValid: true, remainingSlots: user.remainingSlots };
}