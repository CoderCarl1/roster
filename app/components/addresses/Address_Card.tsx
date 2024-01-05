import React, { useState } from 'react';
import { Text, Card, Checkbox, NumberInput } from '@components';
import { log, useToggle, useError } from '@functions';
import { TAddressWithCustomerNameAndFullAddress } from '@types';

type props = {
    address: TAddressWithCustomerNameAndFullAddress;
    clearAddress: () => void;
} & React.HTMLProps<HTMLDivElement>;

function Address_card({ address, clearAddress, ...rest }: props) {
    const [ formData, setFormData ] =
        useState<Partial<TAddressWithCustomerNameAndFullAddress>>(
            address
        );

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();
    const { showError, handleError } = useError({ fullName: false, number: false, line1: false, line2: false, suburb: false, archived: false });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [ name ]: value });
    };

    // TODO: add a submit that calls update address
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        log('fake submission of address card form', { data: formData });
    };

    // TODO: add basic styling
    return (
        <div className="address single" {...rest}>
            <Card
                onSubmit={handleSubmit}
                toggleEditable={toggleEditable}
                editable={editable}
                closeFunc={clearAddress}
            >
                <Text
                    editable={editable}
                    label="full Name"
                    formKey={'fullName'}
                    value={formData.fullName ?? ''}
                    onChangeFunc={handleChange}
                    showError={showError.fullName}
                    errorMessage=''
                />
                <NumberInput
                    label="number"
                    value={formData?.number ?? ''}
                    editable={editable}
                    formKey={'number'}
                    showError={showError.number}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                <Text
                    editable={editable}
                    label="line 1"
                    formKey={'line1'}
                    value={formData?.line1 ?? ''}
                    onChangeFunc={handleChange}
                    showError={showError.line1}
                    errorMessage=''
                />
                <Text
                    editable={editable}
                    label="line 2"
                    formKey={'line2'}
                    value={formData?.line2 ?? ''}
                    onChangeFunc={handleChange}
                    showError={showError.line2}
                    errorMessage=''
                />
                <Text
                    editable={editable}
                    label="suburb"
                    formKey={'suburb'}
                    value={formData?.suburb ?? ''}
                    onChangeFunc={handleChange}
                    showError={showError.suburb}
                    errorMessage=''
                />
                <Checkbox
                    label="archived"
                    checked={formData?.archived || false}
                    editable={editable}
                    formKey={'archived'}
                    showError={showError.archived}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                {/* Make a note field */}
            </Card>
        </div>
    );
}

export default Address_card;
