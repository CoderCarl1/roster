import { addFullAddress } from './helpers/addresses';
import { randomHSLValues } from './helpers/colours';
import { addFullName } from './helpers/customers';
import dates from './helpers/dates';
import log from './helpers/log';
import { randomNumber } from './helpers/numbers';
import { removePropertiesFromObject } from './helpers/objects';
import { joinClasses } from './helpers/strings';
import { isAddress, isAppointment, isCustomer } from './helpers/typechecks';
import useCaptureFocus from './helpers/useCaptureFocus';
import useClickOutside from './helpers/useClickOutside';
import useError from './helpers/useError';
import useToggle from './helpers/useToggle';

export {
    addFullName,
    addFullAddress,
    dates,
    joinClasses,
    isCustomer,
    isAddress,
    isAppointment,
    log,
    randomNumber,
    randomHSLValues,
    removePropertiesFromObject,
    useCaptureFocus,
    useClickOutside,
    useError,
    useToggle,
};
