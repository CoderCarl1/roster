import { PrismaClient } from '@prisma/client'
import { log } from '~/functions/helpers/functions';
import { customer_delete_many } from '~/models/customer.server';
import { singleton } from '~/singleton.server';
import { createAppointments, createCustomers } from '~/lib';

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
        log({color: 'red'}, 'SEEDING ERROR', {errorData: err})
    } else {
        log({color: 'red'}, 'Error',  {errorData: err})
    }
} finally {
    async () => {
        await prisma.$disconnect().then(() => log({color: 'yellow'}, 'disconnected'))
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
        log({color: 'magenta'}, '================== \n 🧹 🗑️ Cleaning DB before Seeding ');
        await Promise.all([ 
            customer_delete_many('example.com'), 
            customer_delete_many('test.com'), 
            prisma.address.deleteMany({where: {line2: {endsWith: "example"}}})]);
        log({color: 'red'}, 'Deleted');
        log({color: 'magenta'}, '==================');
        return Promise.resolve();
    } catch (err) {
        log({color: 'red'}, "error occured deleting records");
    }
}


async function seed(numberOfCustomersToCreate = 30) {
    log({color:'magenta'}, '================== \n - CREATING Customers - ');

    const customers = await createCustomers(numberOfCustomersToCreate);
    if (customers && customers.length) {
        const appointments = await createAppointments(customers);

        if (appointments && appointments.length) {
            log({color: 'green'}, `Database has been seeded. 🌱`);
            log({color: 'magenta'}, '==================');
        }
    }
}






