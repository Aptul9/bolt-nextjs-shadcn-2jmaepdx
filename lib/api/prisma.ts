import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types';

export type PaginatedData<T> = {
	data: T[];
	meta: PageNumberPagination & PageNumberCounters;
};

const prismaClientSingleton = () => {
	return new PrismaClient().$extends(
		pagination({
			pages: {
				limit: 10,
				includePageCount: true,
			},
		})
	);
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = global.prisma ?? prismaClientSingleton();

export default prisma;