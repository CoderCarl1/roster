import { useEffect, useRef } from 'react';

type clickOutsideProps<T> = {
    cb: (value?: MouseEvent) => unknown;
    initialRef?: React.RefObject<T>;
    checkBeforeRunningCB?: boolean[];
};
/**
 * Monitors clicks outside of a specified DOM element and triggers the passed in callback when a click occurs outside of it.
 *
 * @param cb - The callback function to invoke when a click occurs outside the DOM element.
 * @param initialRef - The reference to the DOM element that you want to monitor for outside clicks.
 *
 * @returns A reference to the same DOM element.
 */
export function UseClickOutside<T extends HTMLElement>({
    cb,
    initialRef,
    checkBeforeRunningCB,
}: clickOutsideProps<T>): React.MutableRefObject<T | null> {
    const domRef = useRef(initialRef ? initialRef.current : null);

    useEffect(() => {
        function outsideClickHandler(event: MouseEvent) {
            if (checkBeforeRunningCB && !checkBeforeRunningCB.every(Boolean)) {
                return;
            }
            const target = event.target as HTMLElement;

            if (domRef.current && !domRef.current?.contains(target)) {
                cb();
                return;
            }
        }

        document.addEventListener('mousedown', outsideClickHandler, true);

        return () => {
            document.removeEventListener(
                'mousedown',
                outsideClickHandler,
                true
            );
        };
    }, [domRef, cb]);

    return domRef;
}

export default UseClickOutside;
