import { PrismaClient } from '@prisma/client'
import { AddressOperationError, AppointmentOperationError, CustomerOperationError } from '@errors';
import { TAddress_No_ID, TAppointment_No_ID, TCustomer, TCustomer_No_ID } from '@types'
import { log } from '~/functions/helpers/functions';
import { appointment_create } from '~/models/appointment.server';
import { customer_create, customer_delete_many } from '~/models/customer.server';
import { singleton } from '~/singleton.server';
import { firstNames, lastNames, addressLine2Types, streetNames, streetTypes, suburbs } from '../app/lib/placeholder-data';

const seedingFlagIndex = process.argv.indexOf('--seeding') + 1
if (seedingFlagIndex !== -1) {
    process.env.SEEDING = process.argv[ seedingFlagIndex ] || 'false'
}

const prisma = singleton(
    'prismaScriptFile',
    (seeding: string | undefined) =>
        new PrismaClient({
            log: seeding === 'true' ? [] : [ 'query', 'info', 'warn', 'error' ],
        }),
    process.env.SEEDING
)



try {
    main();
} catch (err) {
    if (process.env.SEEDING === 'true') {
        log('red', 'SEEDING ERROR', err)
    } else {
        log('red', 'Error', err)
    }
} finally {
    async () => {
        await prisma.$disconnect().then(() => log('yellow', 'disconnected'))
    }
}

async function main() {
    await deleteAll();
    if (process.env.SEEDING === 'true') {
        await seed();
    }
}

async function deleteAll() {
    try {
        log('magenta', '================== \n - Cleaning DB before Seeding ');
        await Promise.all([ customer_delete_many('example.com'), customer_delete_many('test.com') ]);
        log('red', 'Deleted');
        log('magenta', '==================');
        return Promise.resolve();
    } catch (err) {
        console.log("error occured deleting records");
    }
}

async function seed(numberOfCustomersToCreate = 30) {
    log('magenta', '================== \n - CREATING Customers - ')

    for (let i = 0; i < numberOfCustomersToCreate; i++) {
        const result = await createMockCustomer();
        const { id, addresses } = result as TCustomer;
        if (addresses && addresses.length) {
            for (let i = 0; i < addresses.length; i++) {
                const appointmentData = randomAppointment();
                const appointment = await appointment_create(id, addresses[ i ].id, appointmentData);

                if (appointment && !(appointment instanceof AppointmentOperationError) && appointment.frequency) {
                    const numberOfAppointments = appointmentsPerYear(appointment.frequency);
                    let currentNumberOfAppointmentsBooked = 1;
                    const startDate = new Date(appointmentData.start);
                    const endDate = new Date(appointmentData.end);

                    for (currentNumberOfAppointmentsBooked; currentNumberOfAppointmentsBooked < numberOfAppointments; currentNumberOfAppointmentsBooked++) {
                        const newStartDateTime = addWeeks(startDate, currentNumberOfAppointmentsBooked);
                        const newEndDateTime = addWeeks(endDate, currentNumberOfAppointmentsBooked);
                        const updatedAppointmentData = { ...appointmentData, start: newStartDateTime, end: newEndDateTime }

                        await appointment_create(id, addresses[ i ].id, updatedAppointmentData);
                    }
                }
            }
        }
    }
    log('green', `Database has been seeded. 🌱`)
    log('magenta', '==================')
    return Promise.resolve();
}

function addWeeks(date: Date, weeks: number) {
    const dateCopy = new Date(date);
    dateCopy.setDate(date.getDate() + 7 * weeks);
    return dateCopy.toISOString();
}
function appointmentsPerYear(appointmentFrequency: number) {
    const daysInYear = 365;
    return Math.floor(daysInYear / appointmentFrequency);
}

function randomNumber(ceiling: number) {
    return Math.floor(Math.random() * ceiling) + 1;
}

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
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}


function generateRandomFullName() {
    const firstName = firstNames[ randomNumber(firstNames.length - 1) ];
    const lastName = lastNames[ randomNumber(lastNames.length - 1) ];
    return [ firstName, lastName ];
}

async function createMockCustomer() {
    try {
        const customerData = randomCustomerData();

        const numberOfAddresses = randomNumber(100) > 17 ? 1 : 2;
        const addressesData = [] as TAddress_No_ID[];

        for (let i = 0; i < numberOfAddresses; i++) {
            addressesData.push(randomAddress());
        }
        const result = await customer_create(customerData, addressesData);
        if (result instanceof CustomerOperationError || result instanceof AddressOperationError) {
            return await createMockCustomer();
        }
        return result;
    } catch (err) {
        if (err instanceof CustomerOperationError || err instanceof AddressOperationError) {
            return await createMockCustomer();
        } else {
            console.log("unknown error happened while generating a mock customer", err);
            throw err;
        }
    }
}
function randomCustomerData() {
    const customer = {} as TCustomer_No_ID;
    const [ first, last ] = generateRandomFullName();
    console.log("GENERATING DATA FOR  ", first, last)
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

    address.number = randomNumber(100) + "";
    address.line1 = streetNames[ randomNumber(streetNames.length) - 1 ] + " " + streetTypes[ randomNumber(streetTypes.length) - 1 ];
    if (randomNumber(100) <= 17) {
        address.line2 = addressLine2Types[ randomNumber(addressLine2Types.length) - 1 ];
    } else {
        address.line2 = null;
    }
    address.suburb = suburbs[ randomNumber(suburbs.length) - 1 ];
    address.archived = randomNumber(10) <= 3;
    address.createdAt = randomDateInPast(90);
    address.updatedAt = randomDateBetween(new Date(address.createdAt), new Date());
    return address;
}

function randomAppointment() {
    const appointment = {} as TAppointment_No_ID;

    appointment.completed = randomNumber(10) <= 7;
    const appointmentLength = randomNumber(2);
    // start time of appointments betwen 8:00 and 15:00
    const startHour = 8 + randomNumber(7);
    const startMinutes = (randomNumber(4) * 15 ) - 15;
    if (appointment.completed) {
        const startDate = randomDateInPast(90);
        const intermediaryDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startHour,
            startMinutes
        )
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
        )
        appointment.start = intermediaryDate.toISOString();

        const endDate = new Date(appointment.start);
        endDate.setHours(endDate.getHours() + appointmentLength);
        appointment.end = endDate.toISOString();

        appointment.completedAt = null;
    }

    appointment.recurring = randomNumber(100) > 50;
    appointment.frequency = appointment.recurring ? appointment.frequency = randomNumber(4) * 7 : null;
    appointment.createdAt = randomDateInPast(90);
    appointment.updatedAt = randomDateBetween(new Date(appointment.createdAt), new Date());
    return appointment;
}