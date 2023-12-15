import { useAddressContext } from '@contexts';

function useAddresses() {
    const {addresses, setAddresses, currentAddress, setCurrentAddress} = useAddressContext();

    function setAddress(addressId?: string) {
        let data = null;
        if (addressId && addresses) {
            data = addresses.find((address) => address.id === addressId) ??
                null;
        }
        setCurrentAddress(data);
    }
    return { addresses, setAddresses, currentAddress, setAddress};
}

export { useAddresses as default };
