type GenericFormInputProps = {
    label: string;
    value: string;
    formKey: string;
    type?: string;
    editable: boolean | Event;
    onChangeFunc: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.HTMLProps<HTMLDivElement>;

export default function Input({
    label,
    value,
    type = 'text',
    formKey,
    editable = false,
    onChangeFunc,
    ...props
}: GenericFormInputProps) {
    return (
        <div {...props}>
            <label>{label}</label>
            {editable ? (
                <input
                    type={type}
                    name={formKey}
                    value={value}
                    onChange={onChangeFunc}
                />
            ) : (
                <p>{value}</p>
            )}
        </div>
    );
}
