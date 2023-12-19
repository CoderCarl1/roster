import {
    json,
    type LoaderFunctionArgs,
    type MetaFunction,
} from '@remix-run/node';
import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
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
    CalendarProvider,
} from '@contexts';
import {
    AddressOperationError,
    AppointmentOperationError,
    CustomerOperationError,
} from '@errors';
import { address_find_all } from '~/models/address.server';
import { appointment_find_many } from '~/models/appointment.server';
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

    const appointmentsLoaderData = await appointment_find_many({
        address: true,
        customer: true,
    });
    if (
        !appointmentsLoaderData ||
        appointmentsLoaderData instanceof CustomerOperationError ||
        appointmentsLoaderData instanceof AddressOperationError ||
        appointmentsLoaderData instanceof AppointmentOperationError
    ) {
        throw new Response('Appointments Not Found', { status: 404 });
    }

    // const addressesLoaderData = [];
    const addressesLoaderData = await address_find_all({
        customer: true,
        appointments: true
    });
    if (
        !addressesLoaderData ||
        addressesLoaderData instanceof CustomerOperationError ||
        addressesLoaderData instanceof AddressOperationError ||
        addressesLoaderData instanceof AppointmentOperationError
    ) {
        throw new Response('addresses Not Found', { status: 404 });
    }

    console.log('about to return data');

    return json({
        customersLoaderData,
        addressesLoaderData,
        appointmentsLoaderData,
    });
};

export type loaderType = typeof loader;

export default function Index() {
    const { customersLoaderData, addressesLoaderData, appointmentsLoaderData } =
        useLoaderData<loaderType>();

    return (
        <main>
            <div className="dashboard">
                <CustomerProvider>
                    <AppointmentProvider>
                        <AddressProvider>
                            <CalendarProvider>
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
                            </CalendarProvider>
                        </AddressProvider>
                    </AppointmentProvider>
                </CustomerProvider>
            </div>
        </main>
    );
}
