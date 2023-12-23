import { createContext, useState, useContext } from 'react';
import { TAddress, TAddressWithCustomerNameAndFullAddress } from '@types';

type AddressContextType = {
    addresses: TAddressWithCustomerNameAndFullAddress[];
    setAddresses: React.Dispatch<
        React.SetStateAction<TAddressWithCustomerNameAndFullAddress[]>
    >;
    currentAddress: TAddressWithCustomerNameAndFullAddress | null;
    setCurrentAddress: React.Dispatch<
        React.SetStateAction<TAddressWithCustomerNameAndFullAddress | null>
    >;
};
const AddressContext = createContext<AddressContextType | null>(null);

export function AddressProvider({ children }: { children: React.ReactNode }) {
    const [addresses, setAddresses] = useState<
        TAddressWithCustomerNameAndFullAddress[]
    >([]);
    const [currentAddress, setCurrentAddress] =
        useState<null | TAddressWithCustomerNameAndFullAddress>(null);

    const value = {
        addresses,
        setAddresses,
        currentAddress,
        setCurrentAddress,
    };
    return (
        <AddressContext.Provider value={value}>
            {children}
        </AddressContext.Provider>
    );
}

export function useAddressContext() {
    const context = useContext(AddressContext);

    if (!context) {
        throw new Error(
            'useAddressContext must be used within an AddressProvider'
        );
    }
    return context;
}
