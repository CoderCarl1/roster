import { TCustomer } from "@types";

export function addFullName(customerObj: TCustomer) {
  return {
    ...customerObj,
    fullName: `${customerObj.firstName} ${customerObj.lastName}`,
  };
}
