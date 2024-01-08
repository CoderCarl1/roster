import React from 'react';

type CheckboxProps = {
    label: string;
    checked: boolean;
    editable: boolean;
    formKey: string;
    showError: boolean;
    errorMessage?: string;
    onChangeFunc?: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void | Promise<void> | any;
} & React.HTMLProps<HTMLDivElement>;

export default function Checkbox({
    label = '',
    checked,
    editable = false,
    formKey,
    showError = false,
    errorMessage = '',
    onChangeFunc,
    className = '',
    ...props
}: CheckboxProps) {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    };

    return (
        <div {...props} className={`${className}`}>
            {editable ? (
                <>
                    {showError && errorMessage ? (
                        <span
                            className="warning"
                            aria-live="assertive"
                            role="alert"
                        >
                            {errorMessage}
                        </span>
                    ) : null}
                    <label>
                        {/* unsure if this should have the input classname, future me decision */}
                        <input
                            type="checkbox"
                            className="input"
                            name={formKey}
                            checked={checked}
                            onChange={handleOnChange}
                        />
                        {label}
                    </label>
                </>
            ) : (
                <span>{checked ? 'Checked' : 'Not Checked'}</span>
            )}
        </div>
    );
}
