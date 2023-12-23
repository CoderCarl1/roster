import { useCustomerContext } from '@contexts';
import { TCustomer } from '@types';
import { log } from '~/functions';

function useCustomers() {
    const {
        customersData,
        setCustomersData,
        currentCustomer,
        setCurrentCustomer,
    } = useCustomerContext();

    function setCustomer(customerId?: string) {
        let data = null;
        if (customerId && customersData) {
            data =
                customersData.find((customer) => customer.id === customerId) ??
                null;
        }
        setCurrentCustomer(data);
    }

    function setCustomers(customers: TCustomer[]) {
        log('set customers invoked');
        setCustomersData(customers);
    }

    return { setCustomers, customersData, setCustomer, currentCustomer };
}

export { useCustomers as default };
