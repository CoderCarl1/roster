import { createId } from '@paralleldrive/cuid2';
import { Customer } from '@prisma/client';
import {
    TAddress_data_for_creation,
    TAppointment_data_for_creation,
    TCustomer_Appointments_Addresses_for_creation,
    TCustomer_data_for_creation,
    inclusionTypes,
} from '@types';
import { prisma } from '~/db.server';
import { log } from '~/functions/helpers/functions';

/**
 * CREATE
 */

/**
 * Creates a new customer with optional associated address and appointment data.
 *
 * @param customerData - The data for creating the customer.
 * @param addressData - An array of addresses to be associated.
 * @param appointmentData - An array of appointments to be associated.
 *
 * @returns {Promise<Customer | CustomerOperationError>} A promise that resolves to the created customer or rejects with a `CustomerOperationError`.
 *
 * @throws {CustomerOperationError} Throws an error if customer creation fails.
 */
export async function customer_create(
    customerData: TCustomer_data_for_creation,
    addressData?: TAddress_data_for_creation,
    // AppointmentData shouldnt be provided from client, this is for seeding only
    appointmentData?: TAppointment_data_for_creation
): Promise<Customer | CustomerOperationError> {
    try {
        const customer = await prisma.$transaction(async (tx) => {
            const customerId = createId();
            await tx.customer.create({
                data: {
                    id: customerId,
                    ...customerData,
                },
            });

            if (addressData) {
                const addressId = createId();
                await tx.address.create({
                    data: {
                        id: addressId,
                        customerId: customerId,
                        ...addressData,
                    },
                });

                if (appointmentData) {
                    const appointmentId = createId();
                    await tx.appointment.create({
                        data: {
                            id: appointmentId,
                            customerId: customerId,
                            addressId,
                            ...appointmentData,
                        },
                    });
                }
            }
            const createdCustomer = await tx.customer.findUnique({
                where: { id: customerId },
                include: {
                    appointments: true,
                    addresses: true,
                },
            });
            return createdCustomer;
        });

        if (!customer) {
            log('red', 'Failed Creating Customer, dumping data');
            console.log(customerData);
            if (addressData) console.log(addressData);
            if (appointmentData) console.log(appointmentData);
            throw new Error();
        }
        return customer;
    } catch (err) {
        throw new CustomerOperationError('Failed creating customer', err);
    }
}

export async function customer_create_many(
    customerDataArray: TCustomer_Appointments_Addresses_for_creation[]
): Promise<Customer[] | CustomerOperationError> {
    const createdCustomers = await Promise.all(
        customerDataArray.map(async (data) => {
            const createdCustomer = await customer_create(data);
            if (createdCustomer instanceof CustomerOperationError) {
                throw new CustomerOperationError(
                    'error creating customer',
                    data
                );
            }
            return createdCustomer;
        })
    );
    return createdCustomers;
}

/**
 * READ
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

export async function customer_find_Many(
    includeSuspended = false,
    include?: inclusionTypes,
    skip?: number,
    take?: number
): Promise<Customer[] | CustomerOperationError> {
    let customers;

    if (skip && take) {
        customers = await prisma.customer.findMany({
            where: { suspended: includeSuspended },
            skip,
            take,
            include,
        });
    } else {
        customers = await prisma.customer.findMany({
            where: { suspended: includeSuspended },
            include,
        });
    }

    if (!customers || customers.length === 0) {
        return new CustomerOperationError('No customers found');
    }
    return customers;
}

/**
 * UPDATE
 */
type UpdateCustomerData = {
    firstName?: string;
    lastName?: string;
    contact?: string;
    note?: string;
};

type UpdateAddressData = {
    id: string;
    number?: string;
    line1?: string;
    line2?: string;
    suburb?: string;
    note?: string;
};

type UpdateAppointmentData = {
    id: string;
    start?: string;
    end?: string;
    completed?: boolean;
    note?: string;
};

export async function customer_update(
    customerId: string,
    customerData: UpdateCustomerData,
    addressData?: UpdateAddressData[],
    appointmentData?: UpdateAppointmentData[]
): Promise<Customer | CustomerOperationError> {
    try {
        const updatedCustomer = await prisma.$transaction(async (tx) => {
            let include = {};

            await tx.customer.update({
                where: { id: customerId },
                data: customerData,
            });

            if (addressData) {
                include = { ...include, addresses: true };
                for (const address of addressData) {
                    const updatedAddress = await tx.address.update({
                        where: { id: address.id },
                        data: address,
                    });
                    if (!updatedAddress) {
                        throw new CustomerOperationError(
                            "Failed Updating customers' address",
                            address
                        );
                    }
                }
                if (appointmentData) {
                    include = { ...include, appointments: true };
                    for (const appointment of appointmentData) {
                        const updatedAppointment = await tx.appointment.update({
                            where: { id: appointment.id },
                            data: appointment,
                        });
                        if (!updatedAppointment) {
                            throw new CustomerOperationError(
                                "Failed Updating customers' appointment",
                                appointment
                            );
                        }
                    }
                }
            }

            const updatedCustomer = await tx.customer.findUnique({
                where: { id: customerId },
                include,
            });
            return updatedCustomer;
        });
        if (!updatedCustomer) {
            log('red', 'Failed Updating Customer, dumping data');
            console.log(customerData);
            if (addressData) console.log(addressData);
            if (appointmentData) console.log(appointmentData);
            throw new Error();
        }
        return updatedCustomer;
    } catch (err) {
        throw new CustomerOperationError('Failed creating customer', err);
    }
}

export async function customer_suspension_remove(customerId: string) {
    const customer = await prisma.customer.update({
        where: { id: customerId },
        data: {
            suspended: false,
            suspendedAt: null,
        },
    });

    return customer;
}

/**
 DELETE
 */
export async function customer_suspension(customerId: string) {
    const suspendedCustomer = await prisma.customer.update({
        where: { id: customerId },
        data: {
            suspended: true,
            suspendedAt: new Date(),
        },
    });

    return suspendedCustomer;
}

export async function customer_delete(string: string) {
    await prisma.customer
        .deleteMany({ where: { contact: { endsWith: string } } })
        .then(() =>
            log('magenta', `DELETED all records containing the words ${string}`)
        )
        .catch((err) => {
            log('red', 'error deleting customers', err);
        });
}

export async function customer_delete_many(string = 'impossibru') {
    await prisma.customer
        .deleteMany({ where: { contact: { endsWith: string } } })
        .then(() =>
            log('magenta', `DELETED all records containing the words ${string}`)
        )
        .catch((err) => {
            log('red', 'error deleting customers', err);
        });
}
