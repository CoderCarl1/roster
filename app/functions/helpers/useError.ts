import { useState, useEffect, useRef } from 'react';

/**
 * Result object returned by the useError hook.
 * @property {UseErrorResult['handleError']} handleError - Function to handle errors based on input name.
 * @property {UseErrorResult['showError']} showError - A record of error states for each input.
 */
interface UseErrorResult {
    /**
     * Function to handle errors and manage their display states.
     * @param {string} inputName - The name of the input associated with the error.
     */
    handleError: (inputName: string) => void;

    /**
     * A record of error states for each input.
     */
    showError: Record<string, boolean>;
}

/**
 * Custom hook for managing errors and their display states.
 * @param {Record<string, boolean>} [initialState={}] - Initial error states for each input.
 * @param {boolean} [autoClearTimeouts] - Whether to automatically clear timeouts for error display.
 * @returns {UseErrorResult} Result object containing showError and handleError.
 */
const useError = (
    initialState: Record<string, boolean> = {},
    autoClearTimeouts = true
): UseErrorResult => {
    const errorTimeouts = useRef<Record<string, null | NodeJS.Timeout>>({});
    const [showError, setShowError] =
        useState<Record<string, boolean>>(initialState);

    /**
     * Function to handle errors and manage their display states.
     * @param inputName - The name of the input associated with the error.
     */
    const handleError = (inputName: string): void => {
        if (
            autoClearTimeouts &&
            errorTimeouts.current &&
            errorTimeouts.current[inputName]
        ) {
            clearTimeout(errorTimeouts.current[inputName] as NodeJS.Timeout);
        }

        if (showError[inputName] === true) {
            setShowError((prevShowError) => ({
                ...prevShowError,
                [inputName]: false,
            }));

            return;
        }

        setShowError((prevShowError) => ({
            ...prevShowError,
            [inputName]: true,
        }));

        if (autoClearTimeouts) {
            console.log('autocleartimeouts is true');
            const showErrorTimeout = setTimeout(() => {
                setShowError((prevShowError) => ({
                    ...prevShowError,
                    [inputName]: false,
                }));
            }, 3000);

            errorTimeouts.current[inputName] = showErrorTimeout;
        }
    };

    /**
     * Cleanup effect to clear all timeouts on unmount.
     */
    useEffect(() => {
        return () => {
            Object.values(errorTimeouts.current).forEach((timeout) => {
                if (timeout) {
                    clearTimeout(timeout);
                }
            });
        };
    }, []);

    return { showError, handleError };
};

export default useError;
