import { Address, Customer } from '@prisma/client';
import { addresses, customers } from '../mocks/model_data';
import * as addressModule from '~/models/address.server'
import { address_archive, address_archive_remove, address_create, address_create_many, address_delete, address_find, address_find_all, address_findby_customer, address_get, address_update } from '~/models/address.server';
import { customer_create, customer_delete_many } from '~/models/customer.server';
import { AddressOperationError } from '~/functions/errors';
import { prisma } from '~/db.server';


describe('ADDRESS FUNCTIONS ', () => {
    let addressRef = 0;
    let customerRef = 0;
    beforeEach(async () => {
        await customer_delete_many('test.com');
        await customer_delete_many('example.com');
        addressRef = 0;
        customerRef = 0;
    });

    describe('SINGLE - ', () => {
        it('address_create returns an AddressOperationError if no address is created', async () => {
            const createSpy = jest.spyOn(prisma.address, 'create').mockResolvedValueOnce(null!);
            const newAddress = await address_create(addresses[ addressRef ]);
            expect(newAddress).toBeInstanceOf(AddressOperationError)
            createSpy.mockRestore();
        });
        it('address_create returns a created address', async () => {
            const mockData = addresses[ addressRef++ ];
            const createdRecord = await address_create(mockData) as Address;

            expect(createdRecord).toMatchObject({
                id: expect.any(String),
                customerId: null,
                number: mockData.number,
                line1: mockData.line1,
                line2: mockData.line2,
                suburb: mockData.suburb,
                archived: expect.any(Boolean),
            });
        });
        it('address_get gets an address by ID', async () => {
            const { id } = await address_create(addresses[ addressRef ]) as Address;
            const mockData = addresses[ addressRef++ ];
            const foundAddress = await address_get(id);

            expect(foundAddress).toBeTruthy();
            expect(foundAddress).toMatchObject({
                number: mockData.number,
                line1: mockData.line1,
                line2: mockData.line2,
                suburb: mockData.suburb,
            });
        });
        it('address_get returns AddressOperationError when address not found', async () => {
            const result = await address_get('fakeaddressIdThatDoesntExist');
            expect(result).toBeInstanceOf(AddressOperationError);
        });
        it('address_get returns AddressOperationError when search throws', async () => {
            const createSpy = jest.spyOn(prisma.address, 'findFirst').mockImplementation(() => { throw new Error() });
            const result = await address_get('fakeaddressId');
            expect(result).toBeInstanceOf(AddressOperationError);

            createSpy.mockRestore();
        });
        it('address_find finds an address by a string', async () => {

            const { line1 } = await address_create(addresses[ addressRef++ ]) as Address;

            const foundAddresses = await address_find(line1) as Address[];

            expect(Array.isArray(foundAddresses)).toBe(true);

            foundAddresses?.forEach(address => {
                [ 'number', 'line1', 'line2', 'suburb' ].forEach((key) => {
                    expect(address).toHaveProperty(key);
                });

            })
        });
        it('address_find handles case insensitivity', async () => {
            const { line1 } = await address_create(addresses[ addressRef++ ]) as Address;
            const foundAddresses = await address_find(line1.toLowerCase()) as Address[];

            expect(Array.isArray(foundAddresses)).toBe(true);

            foundAddresses?.forEach(address => {
                [ 'number', 'line1', 'line2', 'suburb' ].forEach((key) => {
                    expect(address).toHaveProperty(key);
                });

            })
        });
        it('address_find returns an empty array for a non-existent address', async () => {
            const nonExistentAddresses = await address_find('NonExistentStreet');
            expect(Array.isArray(nonExistentAddresses)).toBe(true);
            expect(nonExistentAddresses).toHaveLength(0);
        });
        it('address_find throws when receives invalid input', async () => {
            const invalidInputs = [ null, [], {}, '', ];

            for (const invalidArg of invalidInputs) {
                const result = await address_find(invalidArg as string);
                expect(result).toBeInstanceOf(AddressOperationError);
            }
        });
        it('address_findby_customer returns an empty array for a customers with no addresses', async () => {
            const { id } = await customer_create(customers[ customerRef++ ]) as Customer;
            const nonExistentAddresses = await address_findby_customer(id);
            expect(Array.isArray(nonExistentAddresses)).toBe(true);
            expect(nonExistentAddresses).toHaveLength(0);
        });
        it('address_findby_customer returns an array of addresses when there are addresses for the customer in the database', async () => {
            const addressesArg = [ addresses[ addressRef++ ], addresses[ addressRef++ ] ]
            const { id } = await customer_create(customers[ customerRef++ ], addressesArg) as Customer;

            const result = await address_findby_customer(id) as Address[];
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
        it('address_findby_customer handles errors during address retrieval and returns an AddressOperationError', async () => {
            const errorMessage = 'Test error message';
            jest.spyOn(prisma.address, 'findMany').mockRejectedValueOnce(new Error(errorMessage));

            const result = await address_findby_customer('nonexistentID') as AddressOperationError;
            expect(result).toBeInstanceOf(AddressOperationError);
            expect(result.message).toBe('unable to return addresses for customer nonexistentID');
            expect(result.errorData).toEqual(new Error(errorMessage));
        });
        it('address_update updates an address', async () => {
            const { id } = await address_create(addresses[ addressRef++ ]) as Address;
            const mockData_old = addresses[ addressRef++ ];
            const mockData_updated = addresses[ addressRef++ ];
            const updatedAddress = await address_update(id, mockData_updated);

            expect(updatedAddress).not.toMatchObject({
                number: mockData_old.number,
                line1: mockData_old.line1,
                line2: mockData_old.line2,
                suburb: mockData_old.suburb,
                note: mockData_old.note,
            });

            expect(updatedAddress).toMatchObject({
                number: mockData_updated.number,
                line1: mockData_updated.line1,
                line2: mockData_updated.line2,
                suburb: mockData_updated.suburb,
                note: mockData_updated.note,
            });
        });
        it('address_update returns an AddressOperationError if throws', async () => {
            const updateSpy = jest
                .spyOn(prisma.address, 'update')
                .mockImplementation(() => { throw new Error() });

            const { id } = await address_create(addresses[ addressRef++ ]) as Address;
            const mockData_updated = addresses[ addressRef + 1 ];
            const updatedAddress = await address_update(id, mockData_updated);
            console.log("++++++++ updatedAddress", updatedAddress)
            expect(updatedAddress).toBeInstanceOf(AddressOperationError);

            updateSpy.mockRestore();

        });
        it('address_archive archives an address by ID', async () => {

            const { id } = await address_create(addresses[ addressRef++ ]) as Address;

            const archivedAddress = await address_archive(id);
            expect(archivedAddress).toMatchObject({
                archived: true,
            });
        });
        it('address_archive_remove removes archive status from an address by ID', async () => {
            const { id } = await address_create(addresses[ addressRef++ ]) as Address;


            const archivedAddress = await address_archive_remove(id);
            expect(archivedAddress).toMatchObject({
                archived: false,
            });
        });
        it('address_delete deletes an address by ID', async () => {
            const { id } = await address_create(addresses[ addressRef ]) as Address;
            const result = await address_delete(id);
            const searchForDeletedAddress = await address_get(id);
            expect(result).toBe(undefined);
            expect(searchForDeletedAddress).toBeInstanceOf(AddressOperationError);
        });
        it('address_delete returns an AddressOperationError if address not found', async () => {
            const result = await address_delete('idThatDoesntExist');
            expect(result).toBeInstanceOf(AddressOperationError);
        });
    });

    describe('MANY - ', () => {
        afterEach(async () => {
            await customer_delete_many('test.com');
        });
        it('address_create_many returns an array of addresses', async () => {
            const addressArray = await address_create_many(addresses) as Address[];

            expect(Array.isArray(addressArray)).toBe(true);
            expect(addressArray.length === addresses.length).toBe(true);
            addressArray.forEach((createdAddress, index) => {
                const mockData = addresses[ index ];

                expect(createdAddress.number).toBe(mockData.number);
                expect(createdAddress.line1).toBe(mockData.line1);
                expect(createdAddress.line2).toBe(mockData.line2);
                expect(createdAddress.suburb).toBe(mockData.suburb);
                expect(createdAddress.note).toBe(mockData.note);
                // Check that specific properties are defined
                expect(createdAddress.id).toBeDefined();
                expect(createdAddress.customerId).toBeNull(); // customerId is null in the test data
                expect(createdAddress.archived).toBe(false); // archived is false by default
                expect(createdAddress.createdAt).toBeInstanceOf(Date);
                expect(createdAddress.updatedAt).toBeInstanceOf(Date);
            });
        })

        // it('address_find_all returns an array of all unarchived addresses', async () => {
        //     console.log("HERERERERERERE ++++++++++")
        //     await address_create_many(addresses) as Address[];

        //     const result = await address_find_all() as Address[];
        //     console.log("received ", {result})
        //     expect(Array.isArray(result)).toBe(true);
        //     expect(result.length).toBeGreaterThan(0);
        //     result.forEach(address => {
        //         expect(address.archived).toBe(false);
        //     })
        //     console.log("HERERERERERERE ++++++++++")
        // }, 10000)
        it('address_find_all returns an empty array when there are no addresses in the database', async () => {
            jest.spyOn(prisma.address, 'findMany').mockResolvedValueOnce([]);
            const result = await address_find_all() as Address[];
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });
        it('address_find_all handles errors during address retrieval and returns an AddressOperationError', async () => {
            const mockError = new Error('Test error message');
            jest.spyOn(prisma.address, 'findMany').mockRejectedValueOnce(mockError);

            const result = await address_find_all() as AddressOperationError;
            expect(result).toBeInstanceOf(AddressOperationError);
            expect(result.message).toBe('unable to return all addresses');
        });
    })

})
