import { PrismaClient } from '@prisma/client'
import { TAddress_No_ID, TAppointment_No_ID, TCustomer_No_ID } from '@types'
import { log } from '~/functions/helpers/functions'
import { customers_deleteAll } from '~/models/customer.server'
import { singleton } from '~/singleton.server'
import { customers, addresses, appointments } from '../app/lib/placeholder-data'

const seedingFlagIndex = process.argv.indexOf('--seeding') + 1
if (seedingFlagIndex !== -1) {
    process.env.SEEDING = process.argv[seedingFlagIndex] || 'false'
}

const prisma = singleton(
    'prismaScriptFile',
    (seeding: string | undefined) =>
        new PrismaClient({
            log: seeding === 'true' ? [] : ['query', 'info', 'warn', 'error'],
        }),
    process.env.SEEDING
)

async function main() {
    if (process.env.SEEDING === 'true') {
        await seed()
    }
}

main()
    .catch((error) => {
        if (process.env.SEEDING === 'true') {
            log('red', 'SEEDING ERROR', error)
        } else {
            log('red', 'Error', error)
        }
    })
    .finally(async () => {
        await prisma.$disconnect().then(() => log('yellow', 'disconnected'))
    })

async function seed() {
    log('magenta', '==================')
    log('magenta', 'Cleaning DB before Seeding')
    customers_deleteAll('example.com')
    log('magenta', 'CREATING Customers')

    for (const customer of customers) {
        const addressArray = addresses.filter(
            (address) => address.customerId === customer.id
        )
        const customerAppointments = appointments.filter(
            (appointment) => appointment.customerId === customer.id
        )

        const customerData: TCustomer_No_ID = prepareDataForSeeding(customer)

        if (addressArray) {
            const addressData: TAddress_No_ID[] = addressArray.map((address) =>
                prepareDataForSeeding(address)
            )
            Object.assign(customerData, { addresses: { create: addressData } })
        }

        const createdCustomer = await prisma.customer.create({
            data: customerData,
        })
        if (createdCustomer !== null) {
            const customerAddresses = await prisma.address.findMany({
                include: { Customer: true },
                where: {
                    customerId: createdCustomer.id,
                },
            })

            for (const appointment of customerAppointments) {
                const appointmentData: TAppointment_No_ID =
                    prepareDataForSeeding(appointment)
                await prisma.appointment.create({
                    data: {
                        ...appointmentData,
                        customerId: createdCustomer.id,
                        addressId: customerAddresses[0].id,
                    },
                })
            }
        }
    }
    log('green', `Database has been seeded. 🌱`)
    log('magenta', '==================')
    return null
}

function prepareDataForSeeding<T extends object>(obj: T) {
    if ('id' in obj) {
        delete obj['id']
    }
    if ('addressId' in obj) {
        delete obj['addressId']
    }
    if ('customerId' in obj) {
        delete obj['customerId']
    }
    if ('createdAt' in obj) {
        delete obj['createdAt']
    }
    if ('updatedAt' in obj) {
        delete obj['updatedAt']
    }
    return obj
}
