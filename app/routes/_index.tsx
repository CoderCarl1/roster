import {
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from '@remix-run/node';
import {
    Addresses,
    Appointments,
    Customers,
    useAddresses,
    useAppointments,
} from '@components';
import {
    AddressOperationError,
    AppointmentOperationError,
    CustomerOperationError,
} from '@errors';
import { customer_find_many } from '~/models/customer.server';

export const meta: MetaFunction = () => {
    return [
        { title: 'Schedule App' },
        {
            name: 'description',
            content: 'An app to schedule gardening appointments',
        },
    ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const customers = await customer_find_many({
        addresses: true,
        appointments: true,
    });

    if (
        !customers ||
        customers instanceof CustomerOperationError ||
        customers instanceof AddressOperationError ||
        customers instanceof AppointmentOperationError
    ) {
        throw new Response('Not Found', { status: 404 });
    }

    const appointments =
        useAppointments.getAppointmentsFromCustomerArray(customers);
    const addresses = useAddresses.getAddressesFromCustomerArray(customers);

    return json({ customers, addresses, appointments });
};

export type loaderType = typeof loader;

export default function Index() {
    return (
        <main>
            <div className="dashboard">
                <Customers />
                <Appointments />
                <Addresses />
            </div>
        </main>
    );
}
