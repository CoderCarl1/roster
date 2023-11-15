import { customers } from '~/lib/placeholder-data';
import { createCustomer } from '~/models/customer.server';

describe('createCustomer', () => {
    it('creates a customer successfully', async () => {
        const mockData = customers[0];
        const createdRecord = await createCustomer(mockData);
        expect(createdRecord).toMatchObject({
            id: expect.any(String),
            firstName: mockData.firstName,
            lastName: mockData.lastName,
            contact: mockData.contact,
            suspended: mockData.suspended,
            suspendedAt: mockData.suspendedAt,
        });
    });
});
