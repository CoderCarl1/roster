import { Await, useLoaderData } from '@remix-run/react';
import React, { Suspense, useState } from 'react';

import type { homeLoaderDataType } from './loader'

import {
    Appointments,
    Customers,
    LoadingComponent,
} from '@components';

import Providers from '@contexts';


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
