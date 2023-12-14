import Form from '../form/Form';
import Button from './button';

type cardProps = {
    toggleEditable: (event: React.SyntheticEvent | React.MouseEvent) => boolean;
    editable: boolean | Event;
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
        <Form className="card" autoComplete="on" {...props}>
            <div className="card_controls">
                <Button className="capitalize" onClick={toggleEditable}>
                    Edit
                </Button>
                {editable ? <Button type="submit">Save</Button> : null}
                <Button type="button" onClick={closeFunc}>
                    {' '}
                    X{' '}
                </Button>
            </div>

            {children}
        </Form>
    );
}
