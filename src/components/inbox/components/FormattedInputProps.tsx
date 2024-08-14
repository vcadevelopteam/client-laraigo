import React, { useRef, useEffect } from 'react';

interface FormattedInputProps {
    id: string;
    fullWidth?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
    minRows?: number;
    maxRows?: number;
    inputProps?: React.HTMLAttributes<HTMLDivElement>;
    onPaste?: React.ClipboardEventHandler<HTMLDivElement>;
    onSelect?: React.ReactEventHandler<HTMLDivElement>;
}

const formatText = (text: string) => {
    console.log("Formatting text:", text);
    const boldPattern = /\*([^\*]+)\*/g;
    const italicPattern = /_([^_]+)_/g;
    const underlinePattern = /z([^z]+)z/g;
    const strikethroughPattern = /~([^~]+)~/g;
    const inlinePattern = /\\([^\\]+)\\/g;

    let formattedText = text.replace(boldPattern, '<b>$1</b>');
    formattedText = formattedText.replace(italicPattern, '<i>$1</i>');
    formattedText = formattedText.replace(underlinePattern, '<u>$1</u>');
    formattedText = formattedText.replace(strikethroughPattern, '<s>$1</s>');
    formattedText = formattedText.replace(inlinePattern, '<code>$1</code>');

    console.log("Formatted text:", formattedText);
    return formattedText;
};

const FormattedInput: React.FC<FormattedInputProps> = ({
    id,
    fullWidth,
    value,
    onChange,
    placeholder,
    onKeyPress,
    minRows,
    maxRows,
    inputProps,
    onPaste,
    onSelect,
}) => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current) {
            console.log("Updating innerHTML of divRef with formatted text");
            divRef.current.innerHTML = formatText(value);
        }
    }, [value]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerText;
        console.log("Content on input:", content);
        onChange(content);
    };

    return (
        <div
            id={id}
            ref={divRef}
            contentEditable
            style={{
                width: fullWidth ? '100%' : undefined,
                maxHeight: '144px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
            }}
            placeholder={placeholder}
            onInput={handleInput}
            onKeyPress={onKeyPress}
            onPaste={onPaste}
            onSelect={onSelect}
            {...inputProps}
        />
    );
};

export default FormattedInput;