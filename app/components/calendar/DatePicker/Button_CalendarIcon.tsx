import { CalendarSVG } from '@icons';
import { IconButton } from '~/components/general/button';

export default function Button_CalendarIcon({
    onClick,
}: {
    onClick: () => void;
}) {
    return (
        <IconButton className="icon--calendar" onClick={onClick}>
            <CalendarSVG />
        </IconButton>
    );
}
