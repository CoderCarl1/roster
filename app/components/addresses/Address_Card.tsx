import React, { useState } from 'react';
import { Input, Card } from '@components';
import { log, useToggle } from '@functions';
import { TAddressWithCustomerNameAndFullAddress } from '@types';

type props = {
    address: TAddressWithCustomerNameAndFullAddress;
    clearAddress: () => void;
} & React.HTMLProps<HTMLDivElement>;

function Address_card({ address, clearAddress, ...rest }: props) {
    const [formData, setFormData] =
        useState<Partial<TAddressWithCustomerNameAndFullAddress | null>>(
            address
        );

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
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
                closeFunc={() => clearAddress()}
            >
                <Input
                    editable={editable}
                    label="full Name"
                    formKey={'fullName'}
                    value={formData?.fullName ?? 'full Name'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="number"
                    formKey={'number'}
                    value={formData?.number ?? 'number'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="line 1"
                    formKey={'line1'}
                    value={formData?.line1 ?? 'line 1'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="line 2"
                    formKey={'line2'}
                    value={formData?.line2 ?? 'line 2'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="suburb"
                    formKey={'suburb'}
                    value={formData?.suburb ?? 'suburb'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="suburb"
                    formKey={'suburb'}
                    value={formData?.suburb ?? 'suburb'}
                    onChangeFunc={handleChange}
                />
                <Input
                    type="checkbox"
                    editable={editable}
                    label="archived"
                    formKey={'archived'}
                    value={String(formData?.archived)}
                    onChangeFunc={handleChange}
                />
                {/* Make a note field */}
            </Card>
        </div>
    );
}

export default Address_card;
