import { User } from "@prisma/client";

export function checkAccess(user: User): boolean {
  // Basic example checks (implement your actual logic here)
  const now = new Date();
  const expiryDate = new Date(user.expiresAt);

  // 1. Check if user is active
  if (!user.status) return false;

  // 2. Check if subscription has expired
  if (expiryDate < now) return false;

  // 3. Check remaining slots for Slots subscription type
  if (user.subscriptionType === 'Slots' && (user.remainingSlots ?? 0) <= 0) {
    return false;
  }

  // Add more checks as needed for your business logic
  
  return true;
}