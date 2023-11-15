import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import * as dbServer from '~/db.server';

let prismaMock!: DeepMockProxy<PrismaClient>; // non-null assertion

jest.mock('~/db.server', () => {
    const originalModule = jest.requireActual('~/db.server');
    return {
        ...originalModule,
        prisma: mockDeep<PrismaClient>(),
    };
});

beforeAll(() => {
    prismaMock = dbServer.prisma as unknown as DeepMockProxy<PrismaClient>;
});

beforeEach(() => {
    mockReset(prismaMock);
});

export default prismaMock;
