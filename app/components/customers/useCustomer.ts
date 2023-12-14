import { useState } from 'react';
import { TCustomer } from '@types';

function useCustomers(customersArray?: TCustomer[]) {
    const [currentCustomer, setCurrentCustomer] = useState<null | TCustomer>(
        null
    );

    function setCustomer(customerId?: string) {
        let data = null;
        if (customerId && customersArray) {
            data =
                customersArray.find((customer) => customer.id === customerId) ??
                null;
        }
        setCurrentCustomer(data);
    }

    function extractFullName(customerObj: TCustomer) {
        return `${customerObj.firstName} ${customerObj.lastName}`;
    }

    return { setCustomer, currentCustomer, extractFullName };
}

export { useCustomers as default };
