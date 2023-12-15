import { TCustomer } from "@types";
import { createContext, useState, useContext } from "react";

type CustomerContextType = {
  customersData: TCustomer[];
  setCustomersData: React.Dispatch<React.SetStateAction<TCustomer[]>>;
  currentCustomer: TCustomer | null;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<TCustomer | null>>
}
const CustomersContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [ customersData, setCustomersData ] = useState<TCustomer[]>([]);
  const [ currentCustomer, setCurrentCustomer ] = useState<null | TCustomer>(
    null
  );

  const value = { customersData, setCustomersData, currentCustomer, setCurrentCustomer };
  return <CustomersContext.Provider value={value}>
    {children}
  </CustomersContext.Provider>
}

export function useCustomerContext() {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider')
  }
  return context
}