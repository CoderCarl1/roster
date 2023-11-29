import { createId } from '@paralleldrive/cuid2';
import { Address, Customer } from '@prisma/client';
import {
    TAddress_data_for_creation,
    TCustomerDataWithAddresses_for_creation,
    TCustomer_data_for_creation,
    inclusionTypes,
} from '@types';
import { CustomerOperationError } from '~/functions/errors';
import { prisma } from '~/db.server';
import { log } from '~/functions/helpers/functions';

/**
 * Creates a new customer with optional associated address and appointment data.
 *
 * @param customerData - The data for creating the customer.
 * @param addressData - An array of addresses to be associated.
 *
 * @returns {Promise<Customer | CustomerOperationError>} A promise that resolves to the created customer or rejects with a `CustomerOperationError`.
 *
 * @throws {CustomerOperationError} Throws an error if customer creation fails.
 */

export async function customer_create(
    customerData: TCustomer_data_for_creation,
    addressData?: Omit<TAddress_data_for_creation, 'customerId'>[],
): Promise<Customer | CustomerOperationError> {
    try {
        const customerId = createId();
        const createdCustomer = await prisma.$transaction(async (tx) => {
            let customer = await tx.customer.create({ data: { ...customerData, id: customerId } });
            if (addressData && addressData.length) {
                const addresses = await Promise.all(addressData.map(async (address) => {
                    return await tx.address.create({ data: { ...address, customerId } });
                }));
                if (!addresses) {
                    throw new Error("Customer_create: Error creating Address/s");
                }
                customer = await tx.customer.findFirstOrThrow({
                    where: { id: customer.id },
                    include: {
                        addresses: true
                    }
                })
            }

            return customer;

        })

        if (!createdCustomer) {
            log('red', 'Failed Creating Customer, dumping data');
            console.log(customerData);
            if (addressData) {
                console.log("Address data:", addressData)
            } else {
                console.log("no address data was given to include")
            };
            throw new Error();
        }
        return createdCustomer;
    } catch (err) {
        return new CustomerOperationError('Failed creating customer', err);
    }
}

export const customer_create_many = async (
    customerDataArray: TCustomerDataWithAddresses_for_creation[]
): Promise<(Customer | CustomerOperationError)[]> => {
    return await Promise.all(customerDataArray.map(async (data) => await customer_create(data)));
}

/**
 * Retrieves a customer by their ID.
 * @param customerId - The unique identifier of the customer.
 * @param [include] - Optional. Specify the related entities to include in the result.
 * @returns {Promise<Customer | CustomerOperationError>} A promise that resolves to the found customer or an error if not found.
 * @throws {CustomerOperationError} Throws a CustomerOperationError if the customer is not found or an error occurs during the operation.
 */
export async function customer_find(
    customerId: string,
    include?: inclusionTypes
): Promise<Customer | CustomerOperationError> {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include,
        });

        if (!customer) throw new Error();

        return customer;
    } catch (err) {
        return new CustomerOperationError(
            'No customer found with this id',
            err
        );
    }
}


/**
 * Retrieves a list of customers with optional pagination.
 *
 * @param include - Optional. Specify the related entities to include in the result.
 * @param skip - Optional. The number of customers to skip for pagination.
 * @param take - Optional. The number of customers to take for pagination.
 * @param includeSuspended - Optional. If true, includes suspended customers.
 * @returns {Promise<Customer[] | CustomerOperationError>} A promise that resolves to an array of customers or an error if an issue occurs.
 * @throws {CustomerOperationError} Throws a CustomerOperationError if an error occurs during the operation.
 */
export async function customer_find_many(
    include?: inclusionTypes,
    skip?: number,
    take?: number,
    includeSuspended = false,
): Promise<Customer[] | CustomerOperationError> {
    try {
        return await prisma.customer.findMany({
            where: { suspended: includeSuspended },
            skip,
            take,
            include,
        });

    } catch (err) {
        return new CustomerOperationError(
            'Error while retrieving customers',
            err
        );
    }
}


type UpdateCustomerData = Partial<Customer>;
type UpdateAddressData = { id: string } & Partial<Address>

/**
 * Updates a customer and associated addresses.
 *
 * @param customerId - The ID of the customer to update.
 * @param customerData - The partial data for updating the customer.
 * @param addressData - An optional array of partial data for updating associated addresses.
 * @returns A promise that resolves to the updated customer or an error if the update fails.
 */

export async function customer_update(
    customerId: string,
    customerData: UpdateCustomerData,
    addressData?: UpdateAddressData[],
): Promise<Customer | CustomerOperationError> {
    try {
        if (!customerId) {
            throw new Error("customer_update: customerId is required");
        }
        const updatedCustomer = await prisma.$transaction(async (tx) => {
            let customer = await tx.customer.update({
                where: { id: customerId },
                data: customerData,
            });


            if (addressData && addressData.length) {
                const updatedAddresses = await Promise.all(addressData.map(
                    async (address) => {
                        return await tx.address.update({ where: { id: address.id }, data: { ...address, customerId } });
                    }));

                if (!updatedAddresses) {
                    throw new Error();
                }
                customer = await tx.customer.findFirstOrThrow({
                    where: { id: customerId },
                    include: { addresses: true },
                });
            }
            return customer;
        });
        if (!updatedCustomer) {
            log('red', 'Failed Updating Customer, dumping data');
            console.log(customerData);
            if (addressData) console.log(addressData);
            throw new Error();
        }
        return updatedCustomer;
    } catch (err) {
        return new CustomerOperationError('Failed updating customer', err);
    }
}

/**
* Suspends a customer by updating the 'suspended' and 'suspendedAt' fields.
*
* @param customerId - The id of the customer to be suspended.
* @returns A promise that resolves to the updated customer with suspension details or a CustomerOperationError.
* @example
* const suspendedCustomer = await customer_suspension(customerId);
*/
export const customer_suspension = async (customerId: string): Promise<Customer | CustomerOperationError> =>
    await customer_update(customerId, {
        suspended: true,
        suspendedAt: new Date(),
    });

/**
* Removes suspension for a customer by updating the 'suspended' and 'suspendedAt' fields.
*
* @param customerId - The id of the customer to be suspended.
* @returns A promise that resolves to the updated customer with suspension details or a CustomerOperationError.
* @example
* const suspendedCustomer = await customer_suspension(customerId);
*/
export const customer_suspension_remove = async (customerId: string): Promise<Customer | CustomerOperationError> =>
    await customer_update(customerId, {
        suspended: false,
        suspendedAt: null,
    });

/**
 * @param customerId - The unique identifier of the customer to be deleted.
 * @returns Promise<void | CustomerOperationError> A promise that resolves when the deletion is successful.
 * @example
 * await customer_delete(customerId);
 */

export async function customer_delete(customerId: string): Promise<void | CustomerOperationError> {
    try {
        const deletedCustomer = await prisma.customer
            .delete({ where: { id: customerId } });

        if (!deletedCustomer) throw new Error();

    } catch (err) {
        return new CustomerOperationError(`unable to delete ${customerId}`, err)
    }
}

/**
 * Deletes multiple customer records based on a string match in the contact field.
 *
 * @param - The string to match in the 'contact' field for deletion.
 * @returns Promise<void | CustomerOperationError> A promise that resolves after the deletion operation is completed.
 * @example
 * // Delete all customer records where the 'contact' field ends with 'example.com'
 * await customer_delete_many('example.com');
 */
export async function customer_delete_many(string = 'impossibru'): Promise<void | CustomerOperationError> {
    try {
        const deletedCustomers = await prisma.customer
            .deleteMany({ where: { contact: { endsWith: string } } })
        if (deletedCustomers) {
            log('magenta', `DELETED all records containing the words ${string}`)
        } else {
            throw new Error();
        }

    } catch (err) {
        return new CustomerOperationError(`unable to delete customers with contact including:  ${string}`, err)
    }
}
