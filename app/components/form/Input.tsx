import { useState } from "react";
import { isNumber } from "~/functions/helpers/typechecks";

type GenericFormInputProps = {
    label: string;
    value: string | number;
    formKey: string;
    type?: string;
    editable: boolean;
    maxLength?: number;
    onChangeFunc?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.HTMLProps<HTMLDivElement>;

export default function Input({
    label,
    value,
    type = 'text',
    formKey,
    editable = false,
    onChangeFunc,
    className = "",
    maxLength,
    ...props
}: GenericFormInputProps) {

    const [ showWarning, setShowWarning ] = useState(false);

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { min, max } = props;
        
        const length = event.currentTarget.value.length;
        
        let value = event.currentTarget.value;
        
        // TODO: make sure someone cant press backspace too many times and break it.
        if (length < 0) {
            console.log("here", length)
            console.log("here", value)
            return;
        }
        if (maxLength && length > maxLength) {
            showWarningAndFadeItOut();
            event.currentTarget.value = value.slice(0, maxLength);
        }
        const valueAsNumber = parseInt(value, 10);
        if (min !== undefined && isNumber(valueAsNumber)) {
            if (valueAsNumber < +min) {
                event.currentTarget.value = `${min}`;
            }
        }
    
        // If a max value is provided and the input is a number
        if (max !== undefined && isNumber(valueAsNumber)) {
            if (valueAsNumber > +max) {
                event.currentTarget.value = `${max}`;
            }
        }
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    }
    function showWarningAndFadeItOut() {
        setShowWarning(true);
        setTimeout(() => {
            setShowWarning(false);

        }, 2000);
    }

    return (
        <div {...props} className={"input " + className}>
            {showWarning && <p className={showWarning ? "warning" : "visually-hidden"} aria-live="assertive" role="alert">Limit reached. You can only use {maxLength} characters in this field.</p>}
            {/* <p className={"warning" } aria-live="assertive" role="alert">Limit reached. You can only use {maxLength} characters in this field.</p> */}

            {editable ? (
                <>
                    <input
                        type={type}
                        name={formKey}
                        value={value}
                        placeholder={label}
                        onChange={handleOnChange}
                        maxLength={maxLength}
                    />
                    <label>{label}</label>
                </>
            ) : (
                <p>{value}</p>
            )}

        </div>
    );
}
