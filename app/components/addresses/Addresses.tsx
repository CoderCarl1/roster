import { useAddresses, Address_Card } from '@components';
import { TAddressWithCustomerNameAndFullAddress } from '@types';
import Table, { Caption, Row, TD, TH } from '../table/table';
import { useEffect } from 'react';
import { useLoaderData } from '@remix-run/react';
import { loaderType } from '~/routes/_index';

function Main() {
    const { addressesLoaderData } = useLoaderData<loaderType>();

    const { setAddress, currentAddress, setAddresses, addresses } = useAddresses();

    useEffect(() => {
        console.log(" useEffect setAddresses")
        setAddresses(addressesLoaderData as any);
    }, [ setAddresses, addressesLoaderData ]);
    
    return (
        <Addresses setAddress={setAddress} addresses={addresses as any}>
            {currentAddress ? (
                <Address_Card
                    address={currentAddress}
                    clearAddress={setAddress}
                />
            ) : null}
        </Addresses>
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
                        const { id, fullName, fullAddress } = address;
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
