import {
    addFullAddress /**, getAddressesFromCustomerArray */,
} from './helpers/addresses';
import { addFullAddressToAppointment } from './helpers/appointments';
import { addFullName } from './helpers/customers';
import { formatDate, startOfWeek } from './helpers/dates';
import { removePropertiesFromObject } from './helpers/objects';
import useToggle from './helpers/useToggle';
// import {getAppointmentsFromCustomerArray} from "./helpers/appointments";

export {
    addFullName,
    addFullAddress,
    addFullAddressToAppointment,
    formatDate,
    startOfWeek,
    // getAppointmentsFromCustomerArray,
    // getAddressesFromCustomerArray,
    removePropertiesFromObject,
    useToggle,
};
