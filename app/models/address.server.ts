import { Address, Prisma } from '@prisma/client';
import { AddressOperationError } from '~/functions/errors';
import { TAddress_data_for_creation } from '@types';
import { prisma } from '~/db.server';
import { log } from '~/functions';
/**
 * CREATE
 */

/**
 * Creates a new address.
 * @param addressData - A single address.
 * @returns A promise that resolves to the created address or rejects with a `AddressOperationError`.
 */
export async function address_create(
    addressData: TAddress_data_for_creation
): Promise<Address | AddressOperationError> {
    try {
        const createdAddress = await prisma.address.create({
            data: addressData,
        });

        if (!createdAddress) {
            log({ color: 'red' }, 'Failed Creating Address, dumping data', {
                data: addressData,
            });
            throw new Error(JSON.stringify(addressData));
        }

        return createdAddress;
    } catch (err) {
        return new AddressOperationError('Failed creating address', err);
    }
}

export async function address_create_many(
    addressDataArray: TAddress_data_for_creation[]
): Promise<Address[] | AddressOperationError> {
    try {
        const results = await Promise.all(
            addressDataArray.map(async (data) => {
                return await address_create(data);
            })
        );
        const errors = results.filter(
            (result) => result instanceof AddressOperationError
        );

        if (errors.length) {
            throw new AddressOperationError(
                'create many addresses failed',
                errors
            );
        }
        return results as Address[];
    } catch (err) {
        return new AddressOperationError('create many addresses failed', err);
    }
}

/**
 * Retrieves an address by its ID.
 *
 * @param addressId - The ID of the address to retrieve.
 * @returns A promise that resolves to the retrieved address or an AddressOperationError.
 */
export async function address_get(
    addressId: string
): Promise<Address | AddressOperationError> {
    try {
        return await prisma.address.findFirstOrThrow({
            where: { id: addressId },
        });
    } catch (err) {
        return new AddressOperationError('no address by that ID', err);
    }
}

/**
 * Finds addresses that match the given search string.
 *
 * @param searchString - The search string to match against address fields.
 * @returns A promise that resolves to an array of matching addresses or an AddressOperationError.
 */
export async function address_find(
    searchString: string
): Promise<Address[] | AddressOperationError> {
    try {
        if (typeof searchString !== 'string' || searchString.length < 1) {
            throw new Error('did not recieve a string to search');
        }
        const capitalizeFirstLetter = (str: string) =>
            str.charAt(0).toUpperCase() + str.slice(1);
        const searchStringRegex = new RegExp(
            `(${searchString}|${capitalizeFirstLetter(searchString)})`,
            'i'
        );

        const possibleAddress = await prisma.address.findMany({
            where: {
                OR: [
                    { number: { contains: searchStringRegex.source } },
                    { line1: { contains: searchStringRegex.source } },
                    { line2: { contains: searchStringRegex.source } },
                    { suburb: { contains: searchStringRegex.source } },
                ],
            },
        });

        return possibleAddress;
    } catch (err) {
        return new AddressOperationError(
            'searchString must be a non-null string',
            err
        );
    }
}

/**
 * Retrieves all non-archived addresses from the database.
 *
 * @returns A promise that resolves to an array of addresses or an AddressOperationError.
 */
export async function address_find_all(
    include?: Prisma.AddressInclude | undefined,
    includeArchived = false,
    whereBlock?: Prisma.AddressWhereInput | undefined
): Promise<Address[] | AddressOperationError> {
    try {
        const addresses = await prisma.address.findMany({
            where: { archived: includeArchived, ...whereBlock },
            include,
        });
        if (!addresses) {
            throw new Error('no addresses found');
        }
        return addresses;
    } catch (err) {
        return new AddressOperationError('unable to return all addresses', err);
    }
}

/**
 * Retrieves all addresses associated with a specific customer from the database.
 *
 * @param customerId - The ID of the customer for whom to retrieve addresses.
 * @returns A promise that resolves to an array of addresses associated with the specified customer or an AddressOperationError.
 */
export async function address_findby_customer(
    customerId: string
): Promise<Address[] | AddressOperationError> {
    try {
        if (!customerId || typeof customerId !== 'string') {
            throw new Error(`invalid customerId: ${customerId}`);
        }
        const addresses = await prisma.address.findMany({
            include: { customer: true },
            where: {
                customerId: customerId,
            },
        });
        return addresses;
    } catch (err) {
        return new AddressOperationError(
            `unable to return addresses for customer ${customerId}`,
            err
        );
    }
}

/**
 * Updates an address with the specified ID.
 *
 * @param id - The ID of the address to update.
 * @param addressData - The partial data with which to update the address.
 * @returns  A promise that resolves to the updated address or an AddressOperationError if the update fails.
 */
export async function address_update(
    id: string,
    addressData: Partial<Address>
): Promise<Address | AddressOperationError> {
    try {
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: addressData,
        });

        return updatedAddress;
    } catch (err) {
        return new AddressOperationError(
            'Updating of address not possible',
            err
        );
    }
}

/**
 * Archives an address by updating its 'archived' status.
 *
 * @param addressId - The ID of the address to be archived.
 * @returns A promise that resolves to the updated address if successful,
 *   or an instance of AddressOperationError if an error occurs.
 */
export async function address_archive(addressId: string) {
    return await address_update(addressId, { archived: true });
}
/**
 * Un-Archives an address by updating its 'archived' status.
 *
 * @param addressId - The ID of the address to be un-archived.
 * @returns A promise that resolves to the updated address if successful,
 *   or an instance of AddressOperationError if an error occurs.
 */
export async function address_archive_remove(addressId: string) {
    return await address_update(addressId, { archived: false });
}

/**
 * Deletes an address by its ID.
 *
 * @param addressId - The ID of the address to be deleted.
 * @returns A promise that resolves to undefined if deletion is successful,
 *   or an instance of AddressOperationError if an error occurs.
 */
export async function address_delete(
    addressId: string
): Promise<void | AddressOperationError> {
    try {
        await prisma.address.delete({ where: { id: addressId } });
    } catch (err) {
        return new AddressOperationError(`unable to delete ${addressId}`, err);
    }
}
