import { useCallback } from 'react';

type TextStyle = 'bold' | 'italic' | 'strikethrough' | 'monospaced';

const getSymbols = (style: TextStyle) => {
    switch (style) {
        case 'bold':
            return ['*', '*'];
        case 'italic':
            return ['_', '_'];
        case 'strikethrough':
            return ['~', '~'];
        case 'monospaced':
            return ['`', '`'];
        default:
            return ['', ''];
    }
};

export const useSymbolToggleTextStyle = (
    text: string,
    setText: (text: string) => void,
    inputRef: React.RefObject<HTMLDivElement>,
    appliedStyles: { [key in TextStyle]?: boolean },
    setAppliedStyles: (styles: { [key in TextStyle]?: boolean }) => void
) => {
    return useCallback((style: TextStyle) => {
        const inputElement = inputRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!inputElement) {
            console.error('Textarea element not found');
            return;
        }

        const { value, selectionStart, selectionEnd } = inputElement;
        const selectedText = value.slice(selectionStart, selectionEnd);
        const beforeText = value.slice(0, selectionStart);
        const afterText = value.slice(selectionEnd);

        if (selectedText) {
            const [startSymbol, endSymbol] = getSymbols(style);
            let newText = selectedText;

            if (appliedStyles[style]) {
                const regex = new RegExp(`\\${startSymbol}|\\${endSymbol}`, 'g');
                newText = selectedText.replace(regex, '');
                setAppliedStyles({ ...appliedStyles, [style]: false });
            } else {
                newText = `${startSymbol}${selectedText}${endSymbol}`;
                setAppliedStyles({ ...appliedStyles, [style]: true });
            }

            const newValue = `${beforeText}${newText}${afterText}`;
            setText(newValue);

            const selectionLengthDiff = newText.length - selectedText.length;
            const newSelectionStart = selectionStart;
            const newSelectionEnd = selectionEnd + selectionLengthDiff;

            setTimeout(() => {
                inputElement.setSelectionRange(newSelectionStart, newSelectionEnd);
                inputElement.focus();
            }, 0);
        }
    }, [text, setText, inputRef, appliedStyles, setAppliedStyles]);
};