import React, { useState } from 'react';
import Text from '../form/Text';


type filterBarProps = {
    cb: (text: string) => void;
    className?: string;
    onFocusFunc?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FilterBar({
    cb,
    onFocusFunc,
    className = '',
}: filterBarProps) {
    const [text, setText] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setText(e.currentTarget.value);
        cb(e.currentTarget.value);
    }
    return (
        <Text
            className={className}
            label={'search'}
            value={text}
            formKey={'search'}
            editable={true}
            onFocusFunc={onFocusFunc}
            onChangeFunc={handleChange}
        />
    );
}
