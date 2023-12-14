type formProps = {
    children?: React.ReactNode;
    handleSubmit?: React.FormEventHandler<Element>;
} & React.HTMLProps<HTMLFormElement>;

function Form({ handleSubmit, children }: formProps) {
    function innerHandleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!handleSubmit) return;

        handleSubmit(e);
    }

    return (
        <form onSubmit={innerHandleSubmit}>
            <fieldset>{children}</fieldset>
        </form>
    );
}

export { Form as default };
