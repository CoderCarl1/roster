import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { useAddresses, Address_Card } from '@components';
import { addFullAddress, addFullName, log } from '@functions';
import { homeLoaderDataType, TAddress, TAddressWithCustomerNameAndFullAddress } from '@types';
import Table, { Caption, Row, TD, TH } from '../../components/table/table';

function Main() {
    const data = useLoaderData<homeLoaderDataType>();
    const addressesData = data.addressesLoaderData as unknown as TAddress[];

    const { setAddress, currentAddress, setAddresses, addresses } =
        useAddresses();

    useEffect(() => {
        log('addresses use effect running');

        const addressesWithCustomerName: TAddressWithCustomerNameAndFullAddress[] =
            addressesData.map((address) => {
                const updatedAddress = addFullAddress(address);
                return addFullName(
                    updatedAddress
                ) as TAddressWithCustomerNameAndFullAddress;
            });

        setAddresses(addressesWithCustomerName);
    }, [addressesData]);

    return (
        <Addresses setAddress={setAddress} addresses={addresses}>
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
        <section className="dashboard__section-wrapper">
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
