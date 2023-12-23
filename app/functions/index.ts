import {
    addFullAddress /**, getAddressesFromCustomerArray */,
} from './helpers/addresses';
import { addFullName } from './helpers/customers';
import {
    dayNumberFromDate,
    endOfWeek,
    formatDate,
    getDayName,
    getDaysInMonth,
    getNumberOfDays,
    incrementDayByOne,
    startOfWeek,
} from './helpers/dates';
import { log } from './helpers/functions';
import { removePropertiesFromObject } from './helpers/objects';
import { isAddress, isAppointment, isCustomer } from './helpers/typechecks';
import useToggle from './helpers/useToggle';
// import {getAppointmentsFromCustomerArray} from "./helpers/appointments";

const dates = {
    formatDate,
    startOfWeek,
    endOfWeek,
    dayNumberFromDate,
    getDaysInMonth,
    getNumberOfDays,
    incrementDayByOne,
    getDayName,
};
export {
    addFullName,
    addFullAddress,
    isCustomer,
    isAddress,
    isAppointment,
    log,
    // getAppointmentsFromCustomerArray,
    // getAddressesFromCustomerArray,
    removePropertiesFromObject,
    useToggle,
    dates,
};
