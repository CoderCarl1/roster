import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Customer_Card, useCustomers } from '@components';
import { TCustomer } from '@types';
import { loaderType } from '~/routes/_index';
import Table, { Caption, Row, TD, TH } from '../table/table';

function Main() {
    const { customersLoaderData } = useLoaderData<loaderType>();

    const { setCustomer, currentCustomer, customersData, setCustomers } =
        useCustomers();

    useEffect(() => {
        console.log(' useEffect setCustomers');
        setCustomers(customersLoaderData as any);
    }, [setCustomers, customersLoaderData]);

    return (
        <Customers setCustomer={setCustomer} customers={customersData as any}>
            {currentCustomer ? (
                <Customer_Card
                    clearCustomer={setCustomer}
                    customer={currentCustomer}
                />
            ) : null}
        </Customers>
    );
}

type customersProps = {
    customers: TCustomer[];
    setCustomer: (customerId?: string) => void;
    children?: React.ReactNode;
};

function Customers({ customers, setCustomer, children }: customersProps) {
    return (
        <section className="section-wrapper">
            {children}
            <Table>
                <Caption>Customers</Caption>
                <TH>First Name</TH>
                <TH>Last Name</TH>
                <TH>Contact</TH>
                {/* <TH>Note</TH> */}
                {customers
                    ? customers.map((customer) => {
                          const { id, firstName, lastName, contact } = customer;
                          return (
                              <Row
                                  key={id + firstName + lastName}
                                  cb={() => setCustomer(id)}
                              >
                                  <TD>{firstName}</TD>
                                  <TD>{lastName}</TD>
                                  <TD>{contact}</TD>
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
