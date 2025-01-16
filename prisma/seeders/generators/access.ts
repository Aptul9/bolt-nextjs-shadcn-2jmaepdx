import { faker } from "@faker-js/faker";
import { AccessLog } from "../types";

export const generateAccessLog = (
  tenantId: string,
  userId: string
): AccessLog => {
  return {
    id: faker.string.uuid(),
    timestamp: faker.date.recent(),
    tenantId,
    userId,
    door: faker.number.int({ min: 1, max: 10 }),
    createdAt: faker.date.recent(),
    success: faker.datatype.boolean(),
  };
};

export const generateAccessLogsForUser = (
  tenantId: string,
  userId: string,
  count: number
): AccessLog[] => {
  return Array.from({ length: count }, () =>
    generateAccessLog(tenantId, userId)
  );
};
