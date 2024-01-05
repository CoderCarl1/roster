type formProps = {
    children?: React.ReactNode;
    handleSubmit?: React.FormEventHandler<Element>;
} & React.HTMLProps<HTMLFormElement>;

function Form({ handleSubmit, children, ...props }: formProps) {
    
    function innerHandleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!handleSubmit) return;

        handleSubmit(e);
    }

    return (
        <form onSubmit={innerHandleSubmit} {...props}>
            <fieldset>{children}</fieldset>
        </form>
    );
}

export { Form as default };
