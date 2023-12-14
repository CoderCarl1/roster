import { Note } from '@prisma/client';

type TProps = {
    note: Note;
};
export default function note_card({ note }: TProps) {
    return <p>{note.content}</p>;
}
