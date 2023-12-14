import { Await, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { LoadingComponent, Customer_Card, useCustomers } from '@components';
import { TCustomer } from '@types';
import { loaderType } from '~/routes/_index';
import Note from '../note/note';
import Table, { Caption, Row, TD, TH } from '../table/table';

function Main() {
    const { customers } = useLoaderData<loaderType>();
    const { setCustomer, currentCustomer } = useCustomers(customers as any);

    return (
        <Suspense fallback={<LoadingComponent />}>
            <Await resolve={customers}>
                <Customers
                    setCustomer={setCustomer}
                    customers={customers as any}
                >
                    {currentCustomer ? (
                        <Customer_Card
                            clearCustomer={setCustomer}
                            customer={currentCustomer}
                        />
                    ) : null}
                </Customers>
            </Await>
        </Suspense>
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
                          const { id, firstName, lastName, contact, note } =
                              customer;
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
