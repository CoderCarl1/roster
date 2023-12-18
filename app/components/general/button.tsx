type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = 'default',
    ...props
}: ButtonProps) {
    return (
        <button className={`button ${variant}`} {...props}>
            {children}
        </button>
    );
}
