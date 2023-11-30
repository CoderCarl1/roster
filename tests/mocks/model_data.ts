import { TmockAddressData, TmockAppointment, TmockCustomerData } from '@types';

const customers: TmockCustomerData[] = [
    {
        firstName: 'John',
        lastName: 'Doe',
        contact: 'john.doe@test.com',
        note: 'Note for John Doe',
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        contact: 'jane.smith@test.com',
        note: 'Note for Jane Smith',
    },
    {
        firstName: 'Bob',
        lastName: 'Johnson',
        contact: 'bob.johnson@test.com',
        note: 'Note for Bob Johnson',
    },
    {
        firstName: 'Alice',
        lastName: 'Williams',
        contact: 'alice.williams@test.com',
        note: 'Note for Alice Williams',
    },
    {
        firstName: 'Charlie',
        lastName: 'Brown',
        contact: 'charlie.brown@test.com',
        note: 'Note for Charlie Brown',
    },
    {
        firstName: 'Eva',
        lastName: 'Davis',
        contact: 'eva.davis@test.com',
        note: 'Note for Eva Davis',
    },
    {
        firstName: 'Frank',
        lastName: 'Miller',
        contact: 'frank.miller@test.com',
        note: 'Note for Frank Miller',
    },
    {
        firstName: 'Grace',
        lastName: 'Wilson',
        contact: 'grace.wilson@test.com',
        note: 'Note for Grace Wilson',
    },
    {
        firstName: 'Henry',
        lastName: 'Thomas',
        contact: 'henry.thomas@test.com',
        note: 'Note for Henry Thomas',
    },
    {
        firstName: 'Ivy',
        lastName: 'Moore',
        contact: 'ivy.moore@test.com',
        note: 'Note for Ivy Moore',
    },
];

const addresses: TmockAddressData[] = [
    {
        number: '123',
        line1: 'Main Street',
        line2: 'Apt 4',
        suburb: 'Cityville',
        note: 'Note for Address 123 Main Street',
        customerId: null,
    },
    {
        number: '456',
        line1: 'Oak Avenue',
        line2: '',
        suburb: 'Suburbia',
        note: 'Note for Address 456 Oak Avenue',
        customerId: null,
    },
    {
        number: '789',
        line1: 'Pine Street',
        line2: 'Suite 10',
        suburb: 'Townsville',
        note: 'Note for Address 789 Pine Street',
        customerId: null,
    },
    {
        number: '1011',
        line1: 'Cedar Road',
        line2: '',
        suburb: 'Villageland',
        note: 'Note for Address 1011 Cedar Road',
        customerId: null,
    },
    {
        number: '1213',
        line1: 'Maple Lane',
        line2: 'Unit 7',
        suburb: 'Hamlet City',
        note: 'Note for Address 1213 Maple Lane',
        customerId: null,
    },
    {
        number: '1415',
        line1: 'Birch Avenue',
        line2: '',
        suburb: 'Countryside',
        note: 'Note for Address 1415 Birch Avenue',
        customerId: null,
    },
    {
        number: '1617',
        line1: 'Spruce Street',
        line2: 'Apt 3',
        suburb: 'Meadowland',
        note: 'Note for Address 1617 Spruce Street',
        customerId: null,
    },
    {
        number: '1819',
        line1: 'Redwood Road',
        line2: '',
        suburb: 'Hometown',
        note: 'Note for Address 1819 Redwood Road',
        customerId: null,
    },
    {
        number: '2021',
        line1: 'Fir Lane',
        line2: 'Suite 5',
        suburb: 'Greenfield',
        note: 'Note for Address 2021 Fir Lane',
        customerId: null,
    },
    {
        number: '2223',
        line1: 'Holly Street',
        line2: '',
        suburb: 'Cottageville',
        note: 'Note for Address 2223 Holly Street',
        customerId: null,
    },
];

const appointments: TmockAppointment[] = [
    {
        recurring: false,
        frequency: null,
        start: '2023-10-31T10:00:00Z',
        end: '2023-10-31T11:00:00Z',
        note: 'Note for Appointment on 2023-10-31',
    },
    {
        recurring: true,
        frequency: 7,
        start: '2023-11-01T14:00:00Z',
        end: '2023-11-01T15:00:00Z',
        note: 'Note for Recurring Appointment on 2023-11-01',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-02T09:00:00Z',
        end: '2023-11-02T10:00:00Z',
        note: 'Note for Appointment on 2023-11-02',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-03T15:30:00Z',
        end: '2023-11-03T16:30:00Z',
        note: 'Note for Appointment on 2023-11-03',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-04T12:00:00Z',
        end: '2023-11-04T13:00:00Z',
        note: 'Note for Appointment on 2023-11-04',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-05T11:00:00Z',
        end: '2023-11-05T12:00:00Z',
        note: 'Note for Appointment on 2023-11-05',
    },
];

export { customers, addresses, appointments };
export default { customers, addresses, appointments };
