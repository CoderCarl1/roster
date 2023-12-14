const DEFAULT_VARIANT: 'default' = 'default';

type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | typeof DEFAULT_VARIANT;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = DEFAULT_VARIANT,
    ...props
}: ButtonProps) {
    return (
        <button className={`button ${variant}`} {...props}>
            {children}
        </button>
    );
}
