import { faker } from '@faker-js/faker';
import { TenantSubscriptionType } from '@prisma/client';
import { Tenant, TenantInfo } from '../types';
import { TENANT_IDS } from '../constants';

export const generateTenant = (index: number): Tenant => {
  const now = new Date();
  const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  
  return {
    id: TENANT_IDS[index],
    expiresAt: oneYearFromNow,
    ownerId: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    subscriptionType: faker.helpers.arrayElement([
      TenantSubscriptionType.Standard,
      TenantSubscriptionType.Premium
    ])
  };
};

export const generateTenantInfo = (tenantId: string): TenantInfo => {
  return {
    id: tenantId, // Using the same ID as tenant due to 1-1 relationship
    address: faker.location.streetAddress(),
    vatNumber: faker.string.alphanumeric({ length: 11 }).toUpperCase(),
    documents: JSON.stringify([
      faker.system.filePath(),
      faker.system.filePath()
    ]),
    phoneNumber: faker.phone.number(),
    website: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
};