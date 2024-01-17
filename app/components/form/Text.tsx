import { joinClasses } from '~/functions';

type GenericFormInputProps = {
    label: string;
    value: string | number;
    formKey: string;
    editable: boolean;
    maxLength?: number;
    showError?: boolean;
    errorMessage?: string;
    onFocusFunc?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeFunc?: (event: React.ChangeEvent<HTMLInputElement>) => unknown;
} & React.HTMLProps<HTMLDivElement>;

export default function Text({
    label = '',
    value,
    formKey,
    editable = false,
    onChangeFunc,
    className = '',
    maxLength,
    showError = false,
    errorMessage = '',
    onFocusFunc,
    ...props
}: GenericFormInputProps) {
    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (onChangeFunc) {
            onChangeFunc(event);
        }
    }

    return (
        <div
            {...props}
            className={joinClasses('input-wrapper floating ', className)}
        >
            {showError && errorMessage ? (
                <span className="warning" aria-live="assertive" role="alert">
                    {errorMessage}
                </span>
            ) : null}
            {editable ? (
                <>
                    <input
                        type="text"
                        name={formKey}
                        value={value}
                        placeholder={label}
                        onChange={handleOnChange}
                        maxLength={maxLength}
                        className="input"
                        onFocus={onFocusFunc}
                    />
                    <label>{label}</label>
                </>
            ) : (
                <p>{value}</p>
            )}
        </div>
    );
}
