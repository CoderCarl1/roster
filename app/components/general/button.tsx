import { joinClasses } from "~/functions";

type ButtonProps = {
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'default' | 'icon';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    children,
    variant = 'default',
    className = '',
    ...props
}: ButtonProps) {

    const classNames = joinClasses('button', variant, className);

    if (variant === 'icon') {
        return (
            <IconButton className={classNames} {...props}>
                {children}
            </IconButton>
        )
    }

    return (
        <DefaultButton className={classNames} {...props}>
            {children}
        </DefaultButton>
    )
}

type commonButtonProps = {
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function DefaultButton({ children, className = '', ...props }: commonButtonProps) {

    return (
        <button className={joinClasses('button', className)} {...props}>
            {children}
        </button>
    )
}

type IconButtonProps = {

} & commonButtonProps;
export function IconButton({ children, className = '', ...props }: IconButtonProps) {
    return (
        <DefaultButton className={joinClasses('icon', className)} {...props}>
            {children}
        </DefaultButton>
    )
}