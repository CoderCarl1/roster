import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { Customer_Card, useCustomers } from '@components';
import { TCustomer } from '@types';
import { loaderType } from '~/routes/_index';
import Table, { Caption, Row, TD, TH } from '../table/table';
import { addFullName, log } from '@functions';

function Main(props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
    const data = useLoaderData<loaderType>();
    const customersLoaderData = data.customersLoaderData as unknown as TCustomer[];
    customersLoaderData.length = 1;

    const { setCustomer, currentCustomer, customersData, setCustomers } =
        useCustomers();

    useEffect(() => {
        const customersArray = customersLoaderData.map(customer => addFullName(customer)) as TCustomer[];
        setCustomers(customersArray);
    }, []);

    return (
        <Customers setCustomer={setCustomer} customers={customersData as any} {...props} >
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
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Customers({ customers, setCustomer, children, ...props }: customersProps) {
    return (
        <section {...props}>
            {children}
            <Table>
                <Caption>Customers</Caption>
                <TH>Name</TH>
                {customers
                    ? customers.map((customer) => {
                          const { id, fullName, contact } = customer;
                          return (
                              <Row
                                  key={id}
                                  cb={() => setCustomer(id)}
                              >
                                  <TD>{fullName}</TD>
                              </Row>
                          );
                      })
                    : null}
            </Table>
        </section>
    );
}

export default Main;
