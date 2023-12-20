import {
    addFullAddress /**, getAddressesFromCustomerArray */,
} from './helpers/addresses';
import { addFullAddressToAppointment } from './helpers/appointments';
import { addFullName } from './helpers/customers';
import { dayNumberFromDate, endOfWeek, formatDate, getDayName, getDaysInMonth, getNumberOfDays, incrementDayByOne, startOfWeek } from './helpers/dates';
import { removePropertiesFromObject } from './helpers/objects';
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
    getDayName
}
export {
    addFullName,
    addFullAddress,
    addFullAddressToAppointment,
    // getAppointmentsFromCustomerArray,
    // getAddressesFromCustomerArray,
    removePropertiesFromObject,
    useToggle,
    dates
};
