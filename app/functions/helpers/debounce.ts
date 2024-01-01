/**
 * Debounces a function to be called after a specified delay.
 *
 * @param func The function to debounce.
 * @param delay The delay (in milliseconds) before the debounced function is called.
 * @param args The arguments to pass to the debounced function.
 * @example
 * debounce(searchAddress, 300, searchString);
 */

type debounceProps<T> = {
    func: (args: T) => void;
    delay: number;
    args: T;
};
function debounce<T>({ func, delay, args }: debounceProps<T>): void {
    let debounceTimer: NodeJS.Timeout | null = null;

    function setTimer() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(() => {
            func(args);
        }, delay);
    }

    setTimer();
}
