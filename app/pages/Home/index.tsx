import { Await, useLoaderData } from '@remix-run/react';
import { Suspense} from 'react';

import { Appointments, Customers, LoadingComponent } from '@components';

import Providers from '@contexts';
import type { homeLoaderDataType } from './loader';

export default function Home() {
    const { customersLoaderData, addressesLoaderData, appointmentsLoaderData } =
        useLoaderData<homeLoaderDataType>();

    return (
        <main>
            <div className="dashboard">
                <Providers>
                    <Suspense fallback={<LoadingComponent />}>
                        <Await resolve={customersLoaderData}>
                            <Customers className="dashboard__section customers" />
                        </Await>
                    </Suspense>

                    <Suspense fallback={<LoadingComponent />}>
                        <Await resolve={appointmentsLoaderData}>
                            <Appointments className="dashboard__section appointments" />
                        </Await>
                    </Suspense>

                    {/* <Suspense fallback={<LoadingComponent />}>
                                    <Await resolve={addressesLoaderData}>
                                        <Addresses />
                                    </Await>
                                </Suspense>  */}
                </Providers>
            </div>
        </main>
    );
}
