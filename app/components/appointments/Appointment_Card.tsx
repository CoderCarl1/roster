import React, { useState } from 'react';
import { Input, Card } from '@components';
import { useToggle } from '@functions';
import { TAppointmentWithCustomerName } from '@types';

type props = {
    appointment: TAppointmentWithCustomerName;
    clearAppointment: () => void;
} & React.HTMLProps<HTMLDivElement>;

function Appointment_card({ appointment, clearAppointment, ...rest }: props) {
    const [formData, setFormData] =
        useState<Partial<TAppointmentWithCustomerName | null>>(appointment);

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // TODO: add a submit that calls update customer
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('fake submission of appointment card form');
        console.dir(formData);
    };

    // TODO: add basic styling
    return (
        <div className="appointment single" {...rest}>
            <Card
                onSubmit={handleSubmit}
                toggleEditable={toggleEditable}
                editable={editable}
                closeFunc={() => clearAppointment()}
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
                    label="start"
                    formKey={'start'}
                    value={formData?.start ?? 'start'}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="end"
                    formKey={'end'}
                    value={formData?.end ?? 'end'}
                    onChangeFunc={handleChange}
                />
                <Input
                    type="checkbox"
                    editable={editable}
                    label="recurring"
                    formKey={'recurring'}
                    value={String(formData?.recurring)}
                    onChangeFunc={handleChange}
                />
                <Input
                    editable={editable}
                    label="frequency"
                    formKey={'frequency'}
                    value={String(formData?.frequency) ?? '0'}
                    onChangeFunc={handleChange}
                />
                <Input
                    type="checkbox"
                    editable={editable}
                    label="completed"
                    formKey={'completed'}
                    value={String(formData?.completed)}
                    onChangeFunc={handleChange}
                />
                {/* Make a note field */}
            </Card>
        </div>
    );
}

export default Appointment_card;
