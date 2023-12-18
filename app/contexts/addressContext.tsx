import { createContext, useState, useContext } from 'react';
import { TAddress } from '@types';

type AddressContextType = {
    addresses: TAddress[];
    setAddresses: React.Dispatch<React.SetStateAction<TAddress[]>>;
    currentAddress: TAddress | null;
    setCurrentAddress: React.Dispatch<React.SetStateAction<TAddress | null>>;
};
const AddressContext = createContext<AddressContextType | null>(null);

export function AddressProvider({ children }: { children: React.ReactNode }) {
    const [addresses, setAddresses] = useState<TAddress[]>([]);
    const [currentAddress, setCurrentAddress] = useState<null | TAddress>(null);

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
