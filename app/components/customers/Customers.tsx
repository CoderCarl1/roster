import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Customer_Card, useCustomers } from '@components';
import { TCustomer } from '@types';
import { loaderType } from '~/routes/_index';
import Table, { Caption, Row, TD, TH } from '../table/table';
import { addFullName } from '@functions';

function Main() {
    const data = useLoaderData<loaderType>();
    const customersLoaderData = data.customersLoaderData as TCustomer[];

    const { setCustomer, currentCustomer, customersData, setCustomers } =
        useCustomers();

    useEffect(() => {
        console.log("customers use effect running")

        const customersArray = customersLoaderData.map(customer => addFullName(customer)) as TCustomer[];
        setCustomers(customersArray);
    }, []);

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
                <TH>Name</TH>
                <TH>Contact</TH>
                {/* <TH>Note</TH> */}
                {customers
                    ? customers.map((customer) => {
                          const { id, fullName, contact } = customer;
                          return (
                              <Row
                                  key={id}
                                  cb={() => setCustomer(id)}
                              >
                                  <TD>{fullName}</TD>
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
