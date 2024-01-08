import Form from '../form/Form';
import Button from './button';

type cardProps = {
    toggleEditable: (event: React.SyntheticEvent | React.MouseEvent) => boolean;
    editable: boolean;
    closeFunc: () => void;
    children?: React.ReactNode;
} & React.HTMLProps<HTMLFormElement>;

export default function Card({
    toggleEditable,
    editable,
    closeFunc,
    children,
    ...props
}: cardProps) {
    // TODO: update to use icons
    return (
        <Form
            {...props}
            className={'card ' + props?.className}
            autoComplete="on"
        >
            <div className="card__controls">
                {!editable ? (
                    <Button
                        className="uppercase primary"
                        onClick={toggleEditable}
                    >
                        Edit
                    </Button>
                ) : (
                    <Button type="submit" className="uppercase primary">
                        Save
                    </Button>
                )}
                <Button
                    type="button"
                    className="button secondary"
                    onClick={closeFunc}
                >
                    X
                </Button>
            </div>

            {children}
        </Form>
    );
}
