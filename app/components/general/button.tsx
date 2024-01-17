import { joinClasses } from '~/functions';


type commonButtonProps = {
    children?: React.ReactNode;
    ref?: React.MutableRefObject<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonProps = commonButtonProps & {
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
        );
    }

    return (
        <DefaultButton className={classNames} {...props}>
            {children}
        </DefaultButton>
    );
}


function DefaultButton({
    children,
    className = '',
    ref,
    ...props
}: commonButtonProps) {
    return (
        <button ref={ref} className={joinClasses('button', className)} {...props}>
            {children}
        </button>
    );
}

export function IconButton({
    children,
    className = '',
    ...props
}: commonButtonProps) {
    return (
        <DefaultButton className={joinClasses('icon', className)} {...props}>
            {children}
        </DefaultButton>
    );
}
