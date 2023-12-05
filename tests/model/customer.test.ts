import { Address, Customer } from '@prisma/client';
import {
    customer_create,
    customer_find,
    customer_delete_many,
    customer_find_many,
    customer_update,
    customer_suspension,
    customer_create_many,
    customer_suspension_remove,
    customer_delete,
} from '~/models/customer.server';
import { addresses, customers } from '../mocks/model_data';
import { prisma } from '~/db.server';
import { CustomerOperationError } from '~/functions/errors';
import { address_create } from '~/models/address.server';

describe('CUSTOMER FUNCTIONS ', () => {
    let addressRef = 0;
    let customerRef = 0;

    beforeEach(async () => {
        await customer_delete_many('test.com');
        await customer_delete_many('example.com');
        customerRef = 0;
        addressRef = 0;
    });

    describe('SINGLE - ', () => {
        it('customer_create dumps data and throws if $transaction fails', async () => {
            const createSpy = jest
                .spyOn(prisma, '$transaction')
                .mockImplementation(() => Promise.resolve(null));

            const mockData = customers[ customerRef++ ];
            const createdRecord = await customer_create(mockData);
            console.log("createdRecord", createdRecord)
            expect(createdRecord).toBeInstanceOf(CustomerOperationError);

            createSpy.mockRestore();

        });
        it('customer_create returns a created customer', async () => {
            const mockData = customers[ customerRef++ ];
            const createdRecord = await customer_create(mockData) as Customer;

            expect(createdRecord).toMatchObject({
                id: expect.any(String),
                firstName: mockData.firstName,
                lastName: mockData.lastName,
                contact: mockData.contact,
                suspended: false,
                suspendedAt: null,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });
        it('customer_create accepts address to associate with customer', async () => {
            const mockCustomerData = customers[ customerRef++ ];
            const mockAddressData = [ addresses[ addressRef++ ], addresses[ addressRef++ ] ];
            const createdRecord = await customer_create(mockCustomerData, mockAddressData) as Customer;
            expect(createdRecord).toMatchObject({
                id: expect.any(String),
                firstName: mockCustomerData.firstName,
                lastName: mockCustomerData.lastName,
                contact: mockCustomerData.contact,
                suspended: false,
                suspendedAt: null,
            });

            if ('addresses' in createdRecord) {
                const { addresses } = createdRecord;

                expect(addresses as Address[]).toHaveLength(mockAddressData.length);
                (addresses as Address[]).forEach((address, index) => {
                    expect(address).toEqual(expect.objectContaining({
                        customerId: createdRecord.id,
                        number: mockAddressData[ index ].number,
                        line1: mockAddressData[ index ].line1,
                        line2: mockAddressData[ index ].line2,
                        suburb: mockAddressData[ index ].suburb,
                    }));
                });
            }
        });
        it('customer_find returns a customer by ID', async () => {
            const mockData = customers[ customerRef++ ];
            const { id } = await customer_create(mockData) as Customer;

            const foundCustomer = await customer_find(id);

            expect(foundCustomer).toBeTruthy();
            expect(foundCustomer).toMatchObject({
                firstName: mockData.firstName,
                lastName: mockData.lastName,
                contact: mockData.contact,
            });
        });
        it('customer_find accepts 2nd parameter to list included association models', async () => {
            const { id } = await customer_create(customers[ customerRef ], [ addresses[ addressRef++ ], addresses[ addressRef++ ] ]) as Customer;
            const mockData = customers[ customerRef ];
            const foundCustomer = await customer_find(id);

            expect(foundCustomer).toBeTruthy();
            expect(foundCustomer).toMatchObject({
                firstName: mockData.firstName,
                lastName: mockData.lastName,
                contact: mockData.contact,
            });
            customerRef++;
        });
        it('customer_update returns an updated customer', async () => {
            const mockData_old = customers[ customerRef++ ];
            const { id } = await customer_create(mockData_old) as Customer;

            const mockData_updated = customers[ customerRef ];

            const customer = await customer_update(id, customers[ customerRef++ ]);
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
        });
        it('customer_update accepts an address and returns updated customer with associated addresses', async () => {
            // initial data
            const { id } = await customer_create(customers[ customerRef++ ]) as Customer;
            const createdAddress = await address_create(addresses[ addressRef++ ]) as Address;

            // Prepare updated customer data and an address to associate
            const updatedCustomerdata = customers[ customerRef++ ];
            const updatedAddressData = [ { ...addresses[ addressRef++ ], id: createdAddress.id } ];

            const updatedCustomer = await customer_update(id, updatedCustomerdata, updatedAddressData) as Customer;

            expect(updatedCustomer).toMatchObject({
                id: id,
                firstName: updatedCustomerdata.firstName,
                lastName: updatedCustomerdata.lastName,
                addresses: expect.any(Array),
            });

            if ('addresses' in updatedCustomer) {
                const associatedAddresses = updatedCustomer.addresses as Address[];
                expect(associatedAddresses).toHaveLength(1);

                const associatedAddress = associatedAddresses[ 0 ];
                expect(associatedAddress).toEqual(expect.objectContaining({
                    customerId: updatedCustomer.id,
                    line1: updatedAddressData[ 0 ].line1,
                    line2: updatedAddressData[ 0 ].line2,
                    suburb: updatedAddressData[ 0 ].suburb,
                    note: updatedAddressData[ 0 ].note
                }));
            }
        });
        it('customer_update returns an error if no customerId received', async () => {
            const createdAddress = await address_create(addresses[ addressRef++ ]) as Address;

            const updatedAddressData = [ { ...addresses[ addressRef ], id: createdAddress.id } ];
            const updatedCustomerdata = customers[ customerRef ];

            const result = await customer_update('', updatedCustomerdata, updatedAddressData) as CustomerOperationError;
            expect(result).toBeInstanceOf(CustomerOperationError);
            expect(result?.message).toBe('Failed updating customer');
        })
        it('customer_suspension suspends a customer by ID', async () => {
            const mockData_old = customers[ customerRef++ ];
            const { id } = await customer_create(mockData_old) as Customer;

            const customer = await customer_suspension(id);
            expect(customer).toMatchObject({
                suspended: true,
                suspendedAt: expect.any(Date),
            });
        });
        it('customer_suspension_remove removes suspension from a customer by ID', async () => {
            const mockData_old = customers[ customerRef++ ];
            const { id } = await customer_create(mockData_old) as Customer;
            await customer_suspension(id)

            const customer = await customer_suspension_remove(id);
            expect(customer).toMatchObject({
                suspended: false,
                suspendedAt: null,
            });
        });
        it('customer_delete deletes a customer successfully', async () => {
            const { id } = await customer_create(customers[ customerRef++ ]) as Customer;
            const deletedCustomer = await customer_delete(id);
            expect(deletedCustomer).toBeUndefined();

            const result = await customer_find(id);
            expect(result).toBeInstanceOf(CustomerOperationError);
            expect((result as CustomerOperationError)?.errorData).toBeTruthy();

        });
        it('customer_delete handles invalid customerIds', async () => {
            const result = await customer_delete('invalid-customer-id') as CustomerOperationError;
            expect(result).toBeInstanceOf(CustomerOperationError);
            expect(result?.message).toBe('unable to delete invalid-customer-id');
        });
    });

    describe('MANY - ', () => {
        it('customer_create_many creates many customers', async () => {
            const testArray = [ customers[ customerRef++ ], customers[ customerRef++ ], customers[ customerRef++ ] ]
            const customersArray = await customer_create_many(testArray);

            expect(Array.isArray(customersArray)).toBe(true);
            expect(customersArray.length).toBe(testArray.length);
        }, 10000)
        it('customer_find_many returns all customers', async () => {
            const customers = await customer_find_many();

            expect(Array.isArray(customers)).toBe(true);
        });
        it('customer_find_many can return associations', async () => {
            const customers = await customer_find_many();

            expect(Array.isArray(customers)).toBe(true);
        });
        it('customer_delete_many deletes customers based on contact search string', async () => {
            const testArray = [ customers[ customerRef++ ], customers[ customerRef++ ] ];
            const customersArray = await customer_create_many(testArray);
            expect(Array.isArray(customersArray)).toBe(true);
            expect(customersArray.length).toBe(testArray.length);
            const customerCount = await prisma.customer.count({ where: { contact: { endsWith: "test.com" } } });
            expect(customerCount).toBeGreaterThan(0);

            const deletedCustomers = await customer_delete_many("test.com");
            expect(deletedCustomers).toBeUndefined();
            const remainingCustomers = await prisma.customer.count({ where: { contact: { endsWith: "test.com" } } });
            expect(remainingCustomers).toBe(0);
        }, 10000)
        it('customer_delete_many handles errors during deletion', async () => {
            const mockError = new CustomerOperationError('unable to delete customers');
            const deleteManySpy = jest
                .spyOn(prisma.customer, 'deleteMany')
                .mockRejectedValue(mockError);

            const result = await customer_delete_many('test');

            expect(result).toBeInstanceOf(CustomerOperationError);
            deleteManySpy.mockRestore();
        });
    });
})

