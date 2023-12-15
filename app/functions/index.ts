import { removePropertiesFromObject } from './helpers/objects';
import useToggle from './helpers/useToggle';
import {getAppointmentsFromCustomerArray} from "./helpers/appointments";
import {addFullAddress, getAddressesFromCustomerArray} from './helpers/addresses';
import {addFullName} from './helpers/customers';


export { 
  addFullName, 
  addFullAddress,
  removePropertiesFromObject, 
  useToggle, 
  getAppointmentsFromCustomerArray,
  getAddressesFromCustomerArray };
