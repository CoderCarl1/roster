import { Address, Appointment, Customer } from '@prisma/client';
import {
    TAddress_data_for_creation,
    TAppointment_data_for_creation,
    TCustomer_data_for_creation,
} from '@types';

const customers: TCustomer_data_for_creation[] = [
    {
        firstName: 'John',
        lastName: 'Doe',
        contact: 'john.doe@test.com',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        contact: 'jane.smith@test.com',
    },
    {
        firstName: 'Bob',
        lastName: 'Johnson',
        contact: 'bob.johnson@test.com',
    },
    {
        firstName: 'Alice',
        lastName: 'Williams',
        contact: 'alice.williams@test.com',
    },
    {
        firstName: 'Charlie',
        lastName: 'Brown',
        contact: 'charlie.brown@test.com',
    },
    {
        firstName: 'Eva',
        lastName: 'Davis',
        contact: 'eva.davis@test.com',
    },
    {
        firstName: 'Frank',
        lastName: 'Miller',
        contact: 'frank.miller@test.com',
    },
    {
        firstName: 'Grace',
        lastName: 'Wilson',
        contact: 'grace.wilson@test.com',
    },
    {
        firstName: 'Henry',
        lastName: 'Thomas',
        contact: 'henry.thomas@test.com',
    },
    {
        firstName: 'Ivy',
        lastName: 'Moore',
        contact: 'ivy.moore@test.com',
    },
];
const addresses: TAddress_data_for_creation[] = [
    {
        number: '123',
        line1: 'Main Street',
        line2: 'Apt 4',
        suburb: 'Cityville',
        archived: false,
    },
    {
        number: '456',
        line1: 'Oak Avenue',
        line2: '',
        suburb: 'Suburbia',
        archived: false,
    },
    {
        number: '789',
        line1: 'Pine Street',
        line2: 'Suite 10',
        suburb: 'Townsville',
        archived: false,
    },
    {
        number: '1011',
        line1: 'Cedar Road',
        line2: '',
        suburb: 'Villageland',
        archived: false,
    },
    {
        number: '1213',
        line1: 'Maple Lane',
        line2: 'Unit 7',
        suburb: 'Hamlet City',
        archived: false,
    },
    {
        number: '1415',
        line1: 'Birch Avenue',
        line2: '',
        suburb: 'Countryside',
        archived: false,
    },
    {
        number: '1617',
        line1: 'Spruce Street',
        line2: 'Apt 3',
        suburb: 'Meadowland',
        archived: false,
    },
    {
        number: '1819',
        line1: 'Redwood Road',
        line2: '',
        suburb: 'Hometown',
        archived: false,
    },
    {
        number: '2021',
        line1: 'Fir Lane',
        line2: 'Suite 5',
        suburb: 'Greenfield',
        archived: false,
    },
    {
        number: '2223',
        line1: 'Holly Street',
        line2: '',
        suburb: 'Cottageville',
        archived: false,
    },
];
const appointments: TAppointment_data_for_creation[] = [
    {
        recurring: false,
        frequency: null,
        customerIsOwner: false,

        start: '2023-10-31T10:00:00Z',
        end: '2023-10-31T11:00:00Z',
    },
    {
        recurring: true,
        frequency: 7,
        customerIsOwner: false,

        start: '2023-11-01T14:00:00Z',
        end: '2023-11-01T15:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        customerIsOwner: false,

        start: '2023-11-02T09:00:00Z',
        end: '2023-11-02T10:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        customerIsOwner: false,

        start: '2023-11-03T15:30:00Z',
        end: '2023-11-03T16:30:00Z',
    },
    {
        recurring: false,
        frequency: null,
        customerIsOwner: false,

        start: '2023-11-04T12:00:00Z',
        end: '2023-11-04T13:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        customerIsOwner: false,
        start: '2023-11-05T11:00:00Z',
        end: '2023-11-05T12:00:00Z',
    },
];

/**
 * Generates a random date within the range of 1 to 7 days ago from the current date.
 *
 * @returns A random date within the specified range.
 */
function generateRandomDate(): Date {
    const currentDate = new Date();
    const randomDifference = Math.floor(Math.random() * 7 + 1);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - randomDifference);
    return newDate;
}

export { customers, addresses, appointments };
