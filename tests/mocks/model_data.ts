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
    },
    {
        number: '456',
        line1: 'Oak Avenue',
        line2: '',
        suburb: 'Suburbia',
    },
    {
        number: '789',
        line1: 'Pine Street',
        line2: 'Suite 10',
        suburb: 'Townsville',
    },
    {
        number: '1011',
        line1: 'Cedar Road',
        line2: '',
        suburb: 'Villageland',
    },
    {
        number: '1213',
        line1: 'Maple Lane',
        line2: 'Unit 7',
        suburb: 'Hamlet City',
    },
    {
        number: '1415',
        line1: 'Birch Avenue',
        line2: '',
        suburb: 'Countryside',
    },
    {
        number: '1617',
        line1: 'Spruce Street',
        line2: 'Apt 3',
        suburb: 'Meadowland',
    },
    {
        number: '1819',
        line1: 'Redwood Road',
        line2: '',
        suburb: 'Hometown',
    },
    {
        number: '2021',
        line1: 'Fir Lane',
        line2: 'Suite 5',
        suburb: 'Greenfield',
    },
    {
        number: '2223',
        line1: 'Holly Street',
        line2: '',
        suburb: 'Cottageville',
    },
];
const appointments: TAppointment_data_for_creation[] = [
    {
        recurring: false,
        frequency: null,
        start: '2023-10-31T10:00:00Z',
        end: '2023-10-31T11:00:00Z',
    },
    {
        recurring: true,
        frequency: 7,
        start: '2023-11-01T14:00:00Z',
        end: '2023-11-01T15:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-02T09:00:00Z',
        end: '2023-11-02T10:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-03T15:30:00Z',
        end: '2023-11-03T16:30:00Z',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-04T12:00:00Z',
        end: '2023-11-04T13:00:00Z',
    },
    {
        recurring: false,
        frequency: null,
        start: '2023-11-05T11:00:00Z',
        end: '2023-11-05T12:00:00Z',
    },
];

export { customers, addresses, appointments };
