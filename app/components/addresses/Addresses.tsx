import { Await, useLoaderData } from '@remix-run/react';
import React, { Suspense } from 'react';
import { LoadingComponent, useAddresses, Address_Card } from '@components';
import { TAddressWithCustomerNameAndFullAddress } from '@types';
import { loaderType } from '~/routes/_index';
import Note from '../note/note';
import Table, { Caption, Row, TD, TH } from '../table/table';

function Main() {
    const { addresses } = useLoaderData<loaderType>();
    const { setAddress, currentAddress } = useAddresses(addresses as any);

    return (
        <Suspense fallback={<LoadingComponent />}>
            <Await resolve={addresses}>
                <Addresses setAddress={setAddress} addresses={addresses as any}>
                    {currentAddress ? (
                        <Address_Card
                            clearAddress={setAddress}
                            address={currentAddress}
                        />
                    ) : null}
                </Addresses>
            </Await>
        </Suspense>
    );
}

type addressesProps = {
    addresses: null | TAddressWithCustomerNameAndFullAddress[];
    setAddress: (addressId?: string) => void;
    children?: React.ReactNode;
};

function Addresses({ addresses = [], setAddress, children }: addressesProps) {
    return (
        <section className="section-wrapper">
            {children}
            <Table>
                <Caption>Addresses</Caption>
                <TH>Customer Name</TH>
                <TH>Address</TH>
                {/* <TH>Note</TH> */}
                {addresses
                    ? addresses.map((address) => {
                          const { id, fullName, fullAddress, note } = address;
                          return (
                              <Row
                                  key={id + fullName}
                                  cb={() => setAddress(id)}
                              >
                                  <TD>{fullName}</TD>
                                  <TD>{fullAddress}</TD>
                                  {/* <TD>{note ? <Note note={note} /> : null}</TD> */}
                              </Row>
                          );
                      })
                    : null}
            </Table>
        </section>
    );
}

export default Main;
