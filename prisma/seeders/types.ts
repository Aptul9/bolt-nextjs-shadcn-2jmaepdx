import { Tenant, TenantInfo, User, UserInfo, AccessLog } from '@prisma/client';

// You can extend the types from Prisma if needed
export type { Tenant, TenantInfo, User, UserInfo, AccessLog };

// Additional types for your generators
export type GeneratedTenant = {
  tenant: Tenant;
  info: TenantInfo;
};

export type GeneratedUser = {
  user: User;
  info: UserInfo;
  accessLogs: AccessLog[];
};