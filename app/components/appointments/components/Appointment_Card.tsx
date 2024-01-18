import React, { useState } from 'react';
import { Text, Card, Checkbox, NumberInput } from '@components';
import { log, useToggle, useError, joinClasses } from '@functions';
import { TAppointmentWithCustomerNameAndFullAddress } from '@types';

type props = {
    appointment: TAppointmentWithCustomerNameAndFullAddress;
    clearAppointment: () => void;
    className?: string;
} & React.HTMLProps<HTMLFormElement>;

function Appointment_card({
    appointment,
    clearAppointment,
    className = '',
    ...props
}: props) {
    const [formData, setFormData] =
        useState<Partial<TAppointmentWithCustomerNameAndFullAddress | null>>(
            appointment
        );

    const { toggle: editable, setToggleStatus: toggleEditable } = useToggle();
    const { showError, handleError } = useError({
        fullName: false,
        start: false,
        end: false,
        recurring: false,
        frequency: false,
        completed: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // TODO: add a submit that calls update customer
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        log('fake submission of appointment card form', { data: formData });
    };

    return (
        <Card
            className={joinClasses('appointment single', className)}
            onSubmit={handleSubmit}
            toggleEditable={toggleEditable}
            editable={editable}
            closeFunc={clearAppointment}
            {...props}
        >
            {/* 
            Make this error out when no customer name is available  
            / not selected before submit
             - maybe make into a dropdown searchable field of customers
            */}
            <Text
                label="full Name"
                value={formData?.fullName ?? 'No Customer Name'}
                formKey={'fullName'}
                editable={editable}
                showError={showError.fullName}
                errorMessage=""
                onChangeFunc={handleChange}
            />
            {/* 
            Make this error out when no address is available 
            / not selected before submit
             - maybe make into a dropdown searchable field of customers*/}
            <Text
                label="address"
                value={formData?.fullAddress ?? 'No Address Provided'}
                formKey={'address'}
                editable={editable}
                showError={showError.fullName}
                errorMessage=""
                onChangeFunc={handleChange}
            />
            {/* TODO: make this use the Date Time picker */}
            <Text
                editable={editable}
                label="start"
                formKey={'start'}
                value={formData?.start ?? ''}
                onChangeFunc={handleChange}
                showError={showError.start}
                errorMessage=""
            />
            {/* TODO: make this use the Date Time picker */}
            <Text
                editable={editable}
                label="end"
                formKey={'end'}
                value={formData?.end ?? ''}
                onChangeFunc={handleChange}
                showError={showError.end}
                errorMessage=""
            />
            <Checkbox
                label="recurring"
                checked={formData?.recurring || false}
                editable={editable}
                formKey={'recurring'}
                showError={showError.recurring}
                errorMessage=""
                onChangeFunc={handleChange}
            />
            {/* should this just be disabled if recurring is false? */}
            {formData?.recurring ? (
                <NumberInput
                    label="frequency"
                    value={String(formData?.frequency) ?? ''}
                    maxLength={2}
                    min={1}
                    editable={editable}
                    formKey={'frequency'}
                    showError={showError.frequency}
                    errorMessage=""
                    onChangeFunc={handleChange}
                />
            ) : null}
            <Checkbox
                label="completed"
                checked={formData?.completed || false}
                formKey={'completed'}
                editable={editable}
                showError={showError.fullName}
                errorMessage=""
                onChangeFunc={handleChange}
            />
            {/* Make a note field */}
        </Card>
    );
}

export default Appointment_card;
