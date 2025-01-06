import { PrismaClient } from '@prisma/client';
import { generateTenant, generateTenantInfo } from './seeders/generators/tenant';
import { generateUser, generateUserInfo } from './seeders/generators/user';
import { generateAccessLogsForUser } from './seeders/generators/access';
import { TENANT_IDS } from './seeders/constants';

const prisma = new PrismaClient();

async function main() {
  // Generate and insert tenants
  for (let i = 0; i < TENANT_IDS.length; i++) {
    const tenant = generateTenant(i);
    const tenantInfo = generateTenantInfo(tenant.id);
    
    await prisma.tenant.create({ data: tenant });
    await prisma.tenantInfo.create({ data: tenantInfo });
  }

  // Generate and insert users
  // First two users for first tenant, third user for second tenant
  const userDistribution = [
    { tenantIndex: 0, userIndices: [0, 1] },
    { tenantIndex: 1, userIndices: [2] }
  ];

  for (const { tenantIndex, userIndices } of userDistribution) {
    const tenantId = TENANT_IDS[tenantIndex];
    
    for (const userIndex of userIndices) {
      const user = generateUser(userIndex, tenantId);
      const userInfo = generateUserInfo(user.id, tenantId);
      const accessLogs = generateAccessLogsForUser(tenantId, user.id, 5);
      
      await prisma.user.create({ data: user });
      await prisma.userInfo.create({ data: userInfo });
      await prisma.accessLog.createMany({ 
        data: accessLogs 
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });