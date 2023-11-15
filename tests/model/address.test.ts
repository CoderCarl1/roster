import { addresses } from '~/lib/placeholder-data';
import { createAddress } from '~/models/address.server';

describe('createAddress', () => {
    it('creates an address successfully', async () => {
        const mockData = addresses[0];
        const createdRecord = await createAddress(mockData);
        expect(createdRecord).toMatchObject({
            id: expect.any(String),
            customerId: mockData.customerId,
            number: mockData.number,
            line1: mockData.line1,
            line2: mockData.line2,
            suburb: mockData.suburb,
            archived: expect.any(Boolean),
        });
    });
});
