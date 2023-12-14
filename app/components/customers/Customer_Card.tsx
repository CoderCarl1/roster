import React, { useState } from 'react';
import { useToggle } from '@functions';
import { TCustomer } from '@types';
import { Input, Card } from '~/components';

type props = {
    customer: TCustomer;
    clearCustomer: () => void;
} & React.HTMLProps<HTMLDivElement>;

function Customer_card({ customer, clearCustomer, ...rest }: props) {
    const [formData, setFormData] =
        useState<Partial<TCustomer | null>>(customer);

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // TODO: add a submit that calls update customer
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('fake submission of customer card form');
        console.dir(formData);
    };

    // TODO: add basic styling
    return (
        <div className="customer single" {...rest}>
            <Card
                onSubmit={handleSubmit}
                toggleEditable={toggleEditable}
                editable={editable}
                closeFunc={() => clearCustomer()}
            >
                <Input
                    editable={editable}
                    label="First Name"
                    formKey={'firstName'}
                    value={formData?.firstName ?? 'First Name'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="Last Name"
                    formKey={'lastName'}
                    value={formData?.lastName ?? 'Last Name'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="contact"
                    formKey={'contact'}
                    value={formData?.contact ?? 'contact'}
                    onChangeFunc={handleChange}
                />
                <Input
                    type="checkbox"
                    editable={editable}
                    label="suspended"
                    formKey={'suspended'}
                    value={String(formData?.suspended)}
                    onChangeFunc={handleChange}
                />
                {/* Make a note field */}
            </Card>
        </div>
    );
}

export default Customer_card;
