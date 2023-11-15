import { appointments } from '~/lib/placeholder-data';
import { createAppointment } from '~/models/appointment.server';

describe('createAppointment', () => {
    it('creates an appointment successfully', async () => {
        const mockData = appointments[0];
        const createdRecord = await createAppointment(mockData);

        expect(createdRecord).toMatchObject({
            id: expect.any(String),
            customerId: mockData.customerId,
            recurring: mockData.recurring,
            frequency: mockData.frequency,
            customerIsOwner: mockData.customerIsOwner,
            addressId: mockData.addressId,
            start: mockData.start,
            end: mockData.end,
            completed: mockData.completed,
        });
    });
});
