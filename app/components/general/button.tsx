import { joinClasses } from "~/functions";

type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'default';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = 'default',
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button className={joinClasses('button', variant, className)} {...props}>
            {children}
        </button>
    );
}
