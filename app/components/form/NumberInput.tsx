type numberInputProps = {
    label?: string;
    value: string | number;
    maxLength?: number;
    min?: number;
    max?: number;
    editable: boolean;
    formKey: string;
    showError: boolean;
    errorMessage?: string;
    onChangeFunc?: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void | Promise<void> | any;
} & React.HTMLProps<HTMLInputElement>;

export default function NumberInput({
    label,
    value,
    maxLength,
    editable = false,
    formKey,
    showError = false,
    errorMessage = '',
    onChangeFunc,
    className = '',
    ...props
}: numberInputProps) {
    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    }

    return (
        <div className={'input-wrapper floating ' + className}>
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
                    <input
                        type="number"
                        name={formKey}
                        value={value}
                        placeholder={label && label}
                        onChange={handleOnChange}
                        maxLength={maxLength}
                        className="input number"
                        {...props} 
                    />
                    {label && <label>{label}</label>}
                </>
            ) : (
                <span>{value}</span>
            )}
        </div>
    );
}
