type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = 'default',
    ...props
}: ButtonProps) {
    const {className = '', ...attributes} = props;
    return (
        <button className={`button ${variant} ${className}`} {...attributes}>
            {children}
        </button>
    );
}
