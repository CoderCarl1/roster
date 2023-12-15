import {
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import {
    Addresses,
    Appointments,
    Customers,
    LoadingComponent,
    useAddresses,
    useAppointments,
    useCustomers,
} from '@components';
import {
    CustomerProvider,
    AppointmentProvider,
    AddressProvider,
} from '@contexts';
import {
    getAppointmentsFromCustomerArray,
    getAddressesFromCustomerArray
} from '@functions';
import {
    AddressOperationError,
    AppointmentOperationError,
    CustomerOperationError,
} from '@errors';
import { customer_find_many } from '~/models/customer.server';
import { Suspense } from 'react';

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
    const customersLoaderData = await customer_find_many({
        addresses: true,
        appointments: true,
    });

    if (
        !customersLoaderData ||
        customersLoaderData instanceof CustomerOperationError ||
        customersLoaderData instanceof AddressOperationError ||
        customersLoaderData instanceof AppointmentOperationError
    ) {
        throw new Response('Customers Not Found', { status: 404 });
    }

    const appointmentsLoaderData = getAppointmentsFromCustomerArray(customersLoaderData);
    if (
        !appointmentsLoaderData ||
        appointmentsLoaderData instanceof CustomerOperationError ||
        appointmentsLoaderData instanceof AddressOperationError ||
        appointmentsLoaderData instanceof AppointmentOperationError
    ) {
        throw new Response('Appointments Not Found', { status: 404 });
    }

    const addressesLoaderData = getAddressesFromCustomerArray(customersLoaderData);
    if (
        !addressesLoaderData ||
        addressesLoaderData instanceof CustomerOperationError ||
        addressesLoaderData instanceof AddressOperationError ||
        addressesLoaderData instanceof AppointmentOperationError
    ) {
        throw new Response('addresses Not Found', { status: 404 });
    }

    console.log("about to return data")

    return json({ customersLoaderData, addressesLoaderData, appointmentsLoaderData });
};

export type loaderType = typeof loader;

export default function Index() {
    const { customersLoaderData, addressesLoaderData, appointmentsLoaderData } = useLoaderData<loaderType>();

    return (
        <main>
            <div className="dashboard">
                <CustomerProvider>
                    <AppointmentProvider>
                        <AddressProvider>
        
                            <Suspense fallback={<LoadingComponent />}>
                                <Await resolve={customersLoaderData}>
                                    <Customers />
                                </Await>
                            </Suspense>

                            <Suspense fallback={<LoadingComponent />}>
                                <Await resolve={appointmentsLoaderData}>
                                    <Appointments />
                                </Await>
                            </Suspense>

                            <Suspense fallback={<LoadingComponent />}>
                                <Await resolve={addressesLoaderData}>
                                    <Addresses />
                                </Await>
                            </Suspense>

                        </AddressProvider>
                    </AppointmentProvider>
                </CustomerProvider>
            </div>
        </main>
    );
}
