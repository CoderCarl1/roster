import { useState } from 'react';

/**
 * @param newState default is FALSE, accepts new boolean
 */

export default function useToggle(newState: boolean | Event = false) {
    const [toggle, setToggle] = useState<boolean>(
        typeof newState === 'boolean' ? newState : false
    );

    /**
     * Set the toggle state based on the provided value or toggle it if no value is provided.
     *
     * @param value - The value to set or an event triggering the toggle.
     * @return the value it is now set to
     */
    const setToggleStatus = (
        value: boolean | React.SyntheticEvent | React.MouseEvent
    ) => {
        let retval;
        if (typeof value === 'boolean') {
            setToggle(value);
            retval = value;
        } else {
            value.preventDefault();
            retval = Boolean(!toggle);
            setToggle((prev) =>!prev);
        }

        return retval;
    };

    return { toggle, setToggleStatus };
}

export { useToggle };
