import { isCustomer, log, randomNumber } from '@functions';
import {
    TAddress_No_ID,
    TAppointment_No_ID,
    TCustomer,
    TCustomer_No_ID,
} from '@types';
import {
    AddressOperationError,
    AppointmentOperationError,
    CustomerOperationError,
} from '~/functions/errors';
import { appointment_create } from '~/models/appointment.server';
import { customer_create } from '~/models/customer.server';
import {
    addressLine2Types,
    firstNames,
    lastNames,
    streetNames,
    streetTypes,
    suburbs,
} from './placeholder-data';

function randomDateInPast(days: number) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - randomNumber(days));
    return pastDate;
}

function randomDateInFuture(days: number) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + randomNumber(days));
    return futureDate;
}

function randomDateBetween(startDate: Date, endDate: Date) {
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    const randomTimestamp =
        startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}

function appointmentsPerYear(appointmentFrequency: number) {
    const daysInYear = 365;
    return Math.floor(daysInYear / appointmentFrequency);
}

function generateRandomFullName() {
    const firstName = firstNames[randomNumber(firstNames.length - 1)];
    const lastName = lastNames[randomNumber(lastNames.length - 1)];
    return [firstName, lastName];
}

export async function createCustomers(numberOfCustomersToCreate: number) {
    const customers: Pick<TCustomer, 'id' | 'addresses'>[] = [];

    for (let i = 0; i < numberOfCustomersToCreate; i++) {
        const result = (await createMockCustomer()) as TCustomer;
        if (isCustomer(result)) {
            const { id, addresses } = result;
            customers.push({ id, addresses });
        }
    }
    return Promise.resolve(customers);
}

async function createMockCustomer(
    retriesLeft = 1
): Promise<TCustomer | CustomerOperationError | AddressOperationError> {
    try {
        const customerData = randomCustomerData();
        const numberOfAddresses = randomNumber(100) > 17 ? 1 : 2;
        const addressesData = Array.from(
            { length: numberOfAddresses },
            randomAddress
        );

        const result = await customer_create(customerData, addressesData);

        // There is a tiny chance that there will be a duplicate customer name so retry it once
        if (
            result instanceof CustomerOperationError ||
            result instanceof AddressOperationError
        ) {
            if (retriesLeft > 0) {
                return await createMockCustomer(retriesLeft - 1);
            } else {
                throw result;
            }
        }

        return result;
    } catch (err) {
        log(
            { color: 'red' },
            'unknown error happened while generating a mock customer',
            { errorData: err }
        );
        throw err;
    }
}

export async function createAppointments(
    customers: Pick<TCustomer, 'id' | 'addresses'>[]
) {
    const appointmentsPromises = customers.flatMap(
        async ({ id, addresses }) => {
            const nestedAppointmentsPromises = [];

            if (addresses) {
                for (const address of addresses) {
                    const appointmentData = randomAppointment();
                    const appointment = await appointment_create(
                        id,
                        address.id,
                        appointmentData
                    );

                    if (
                        appointment &&
                        !(appointment instanceof AppointmentOperationError) &&
                        appointment.frequency
                    ) {
                        const appointmentsToCreate =
                            appointmentsPerYear(appointment.frequency) - 1;
                        const nestedAppointmentData = Array.from(
                            { length: appointmentsToCreate },
                            () => ({
                                ...randomAppointment(),
                                frequency: appointment.frequency,
                            })
                        );

                        const nestedPromises = nestedAppointmentData.map(
                            (nestedAppointment) =>
                                appointment_create(
                                    id,
                                    address.id,
                                    nestedAppointment
                                )
                        );

                        nestedAppointmentsPromises.push(...nestedPromises);
                    }
                }
            }

            return nestedAppointmentsPromises;
        }
    );

    return await Promise.all(appointmentsPromises);
}

function randomCustomerData() {
    const customer = {} as TCustomer_No_ID;
    const [first, last] = generateRandomFullName();
    customer.firstName = first;
    customer.lastName = last;
    customer.contact = `${customer.firstName}.${customer.lastName}@example.com`;
    customer.suspended = randomNumber(100) <= 17;
    if (customer.suspended) {
        const createdAt = randomDateInPast(90);
        customer.suspendedAt = randomDateBetween(createdAt, new Date());
    } else {
        customer.suspendedAt = null;
    }
    customer.createdAt = randomDateInPast(90);
    customer.updatedAt = customer.suspended
        ? customer.suspendedAt
        : randomDateBetween(new Date(customer.createdAt), new Date());

    return customer;
}

function randomAddress() {
    const address = {} as TAddress_No_ID;

    address.number = randomNumber(100) + '';
    address.line1 =
        streetNames[randomNumber(streetNames.length) - 1] +
        ' ' +
        streetTypes[randomNumber(streetTypes.length) - 1];
    if (randomNumber(100) <= 17) {
        address.line2 =
            addressLine2Types[randomNumber(addressLine2Types.length) - 1] +
            ' example';
    } else {
        address.line2 = 'example';
    }
    address.suburb = suburbs[randomNumber(suburbs.length) - 1];
    address.archived = randomNumber(10) <= 3;
    address.createdAt = randomDateInPast(90);
    address.updatedAt = randomDateBetween(
        new Date(address.createdAt),
        new Date()
    );
    return address;
}

function randomAppointment() {
    const appointment = {} as TAppointment_No_ID;

    appointment.completed = randomNumber(10) <= 7;
    const appointmentLength = randomNumber(2);
    // start time of appointments betwen 8:00 and 15:00
    const startHour = 8 + randomNumber(7);
    const startMinutes = randomNumber(4) * 15 - 15;
    if (appointment.completed) {
        const startDate = randomDateInPast(90);
        const intermediaryDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startHour,
            startMinutes
        );
        appointment.start = intermediaryDate.toISOString();

        const endDate = new Date(appointment.start);
        endDate.setHours(endDate.getHours() + appointmentLength);
        appointment.end = endDate.toISOString();

        appointment.completedAt = intermediaryDate;
    } else {
        const startDate = randomDateInFuture(90);
        const intermediaryDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startHour,
            startMinutes
        );
        appointment.start = intermediaryDate.toISOString();

        const endDate = new Date(appointment.start);
        endDate.setHours(endDate.getHours() + appointmentLength);
        appointment.end = endDate.toISOString();

        appointment.completedAt = null;
    }

    appointment.recurring = randomNumber(100) > 50;
    appointment.frequency = appointment.recurring
        ? (appointment.frequency = randomNumber(4) * 7)
        : null;
    appointment.createdAt = randomDateInPast(90);
    appointment.updatedAt = randomDateBetween(
        new Date(appointment.createdAt),
        new Date()
    );
    return appointment;
}
