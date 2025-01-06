import { faker } from '@faker-js/faker';
import { UserSubscriptionType } from '@prisma/client';
import { User, UserInfo } from '../types';
import { USER_IDS } from '../constants';

export const generateUser = (index: number, tenantId: string): User => {
  const subscriptionType = faker.helpers.arrayElement(Object.values(UserSubscriptionType));
  
  return {
    id: USER_IDS[index],
    tenantId,
    expiresAt: faker.date.future(),
    name: faker.person.fullName(),
    remainingSlots: subscriptionType === UserSubscriptionType.Slots ? 
      faker.number.int({ min: 0, max: 100 }) : null,
    status: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    subscriptionType
  };
};

export const generateUserInfo = (userId: string, tenantId: string): UserInfo => {
  return {
    userId,
    tenantId,
    birthDate: faker.date.past({ years: 50 }),
    address: faker.location.streetAddress(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number(),
    birthPlace: faker.location.city(),
    ssn: faker.string.numeric(9),
    nationality: faker.location.country(),
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    emergencyContact: faker.phone.number(),
    notes: faker.lorem.paragraph(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  };
};