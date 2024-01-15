import { useEffect, useState } from 'react';
import CheckMark from '~/icons/checkmark';

type CheckboxProps = {
    label: string;
    checked?: boolean;
    editable?: boolean;
    formKey: string;
    showError?: boolean;
    errorMessage?: string;
    onChangeFunc?: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void | Promise<void> | any;
} & React.HTMLProps<HTMLDivElement>;

export default function Checkbox({
    label = '',
    checked = false,
    editable = false,
    formKey,
    showError = false,
    errorMessage = '',
    onChangeFunc,
    className = '',
    ...props
}: CheckboxProps) {
    const [isChecked, setIsChecked] = useState(checked);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked((prev) => !prev);
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    };
    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    if (editable) {
        return (
            <div
                className={`checkbox__wrapper ${className ? className : ''}`}
                {...props}
            >
                {showError && errorMessage ? (
                    <span
                        className="warning"
                        aria-live="assertive"
                        role="alert"
                    >
                        {errorMessage}
                    </span>
                ) : null}
                <input
                    type="checkbox"
                    className="input checkbox"
                    name={formKey}
                    checked={isChecked}
                    onChange={handleOnChange}
                    id={formKey}
                />
                <CheckMark className="transparent" />
                <label htmlFor={formKey} className="checkbox__label">
                    {label}
                </label>
            </div>
        );
    }

    return (
        <div
            className={`checkbox__wrapper ${className ? className : ''}`}
            {...props}
        >
            <input
                type="checkbox"
                className="input checkbox"
                name={formKey}
                checked={checked}
                id={formKey}
                disabled
            />
            <CheckMark className="transparent" />
            <label htmlFor={formKey} className="checkbox__label">
                {label}
            </label>
        </div>
    );
}
