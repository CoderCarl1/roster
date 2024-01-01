import { addFullAddress } from './helpers/addresses';
import { randomHSLValues } from './helpers/colours';
import { addFullName } from './helpers/customers';
import dates from './helpers/dates';
import log from './helpers/log';
import { randomNumber } from './helpers/numbers';
import { removePropertiesFromObject } from './helpers/objects';
import { isAddress, isAppointment, isCustomer } from './helpers/typechecks';
import useToggle from './helpers/useToggle';

export {
    addFullName,
    addFullAddress,
    isCustomer,
    isAddress,
    isAppointment,
    log,
    randomNumber,
    randomHSLValues,
    removePropertiesFromObject,
    useToggle,
    dates,
};

