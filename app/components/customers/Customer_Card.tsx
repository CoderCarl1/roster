import React, { useState } from 'react';
import { log, useError, useToggle } from '@functions';
import { TCustomer } from '@types';
import { Text, Card, Checkbox } from '~/components';

type props = {
    customer: TCustomer;
    clearCustomer: () => void;
} & React.HTMLProps<HTMLDivElement>;

function Customer_card({ customer, clearCustomer, ...rest }: props) {
    const [formData, setFormData] =
        useState<Partial<TCustomer | null>>(customer);

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();
    const { showError, handleError } = useError({ firstName: false, lastName: false, contact: false, suspended: false});
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // TODO: add a submit that calls update customer
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        log('fake submission of customer card form', { data: formData });
    };

    // TODO: add basic styling
    return (
        <div className="customer single" {...rest}>
            <Card
                onSubmit={handleSubmit}
                toggleEditable={toggleEditable}
                editable={editable}
                closeFunc={clearCustomer}
            >
                <Text
                    label="First Name"
                    value={formData?.firstName ?? ''}
                    formKey={'firstName'}
                    editable={editable}
                    showError={showError.fullName}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                <Text
                    label="Last Name"
                    value={formData?.lastName ?? 'Last Name'}
                    formKey={'lastName'}
                    editable={editable}
                    showError={showError.lastName}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                <Text
                    label="contact"
                    value={formData?.contact ?? 'contact'}
                    formKey={'contact'}
                    editable={editable}
                    showError={showError.contact}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                <Checkbox
                    label="suspended"
                    checked={formData?.suspended || false}
                    formKey={'suspended'}
                    editable={editable}
                    showError={showError.suspended}
                    errorMessage=''
                    onChangeFunc={handleChange}
                />
                {/* Make a note field */}
            </Card>
        </div>
    );
}

export default Customer_card;
