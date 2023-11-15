import { Customer } from '@prisma/client';
import { customers } from '../mocks/model_data';
import { createCustomer, findCustomer, customers_deleteAll, findAllCustomers, updateCustomer, suspendCustomer } from '~/models/customer.server';
import { log } from '~/functions/helpers/functions';

describe('Customer model', () => {
    let customerId: string | undefined;

    beforeAll(() => {
        customers_deleteAll('test.com');
      });
      
    it('creates a customer successfully', async () => {
        const mockData = customers[0];
        const createdRecord = await createCustomer(mockData);
        customerId = createdRecord.id;

        expect(createdRecord).toMatchObject({
            id: expect.any(String),
            firstName: mockData.firstName,
            lastName: mockData.lastName,
            contact: mockData.contact,
            suspended: false,
            suspendedAt: null,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
        });
    });

    it('finds a customer by ID', async () => {
        if (!customerId) {
            throw new Error('customerId is not set.');
        }
        const mockData = customers[0];
        const foundCustomer = await findCustomer(customerId);

        expect(foundCustomer).toBeTruthy();
        expect(foundCustomer).toMatchObject({
            firstName: mockData.firstName,
            lastName: mockData.lastName,
            contact: mockData.contact,
        });
    });

    it('updates a customer', async() => {
        if (!customerId) {
            throw new Error('customerId is not set.');
        }
        const mockData_old = customers[0];
        const mockData_updated = customers[1];
        const customer = await updateCustomer(customerId, customers[1]);

        expect(customer).not.toMatchObject({
            firstName: mockData_old.firstName,
            lastName: mockData_old.lastName,
            contact: mockData_old.contact,
        });
        expect(customer).toMatchObject({
            firstName: mockData_updated.firstName,
            lastName: mockData_updated.lastName,
            contact: mockData_updated.contact,
        });
    })
    it('suspends a customer by ID', async () => {
        if (!customerId) {
            throw new Error('customerId is not set.');
        }

        const customer = await suspendCustomer(customerId);
        expect(customer).toMatchObject({
            suspended: true,
            suspendedAt: expect.any(Date),
        });
    })
});

describe('reading Customers', () => {
    it('findAllCustomers returns all customers', async () => {
        const customers = await findAllCustomers();

        expect(Array.isArray(customers)).toBe(true);
        expect(findAllCustomers).toHaveBeenCalled;
    })
})
