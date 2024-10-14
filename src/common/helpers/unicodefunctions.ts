import { useCallback } from "react";
import { string_to_unicode_variant } from "string-to-unicode-variant";

export type TextStyle = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'monospaced';

export function formatTextToUnicode({ text = '', style }: { text: string, style: TextStyle }) {
    switch (style) {
        case 'bold':
            return string_to_unicode_variant(text, "bold");
        case 'italic':
            return string_to_unicode_variant(text, "italic");
        case 'underline':
            return text.split('').map(char => char + '\u0332').join('');
        case 'strikethrough':
            return string_to_unicode_variant(text, "", "strike");
        case 'monospaced':
            return string_to_unicode_variant(text, "monospace");
        default:
            return text;
    }
}

export const removeUnicodeStyle = (text: string): string => {
    const underlineRegex = /[\u0332]/g;
    const strikethroughRegex = /[\u0336]/g;
    return text.normalize('NFKC').replace(underlineRegex, '').replace(strikethroughRegex, '');
};

export const useUnicodeToggleTextStyle = (
    text: string,
    setText: (text: string) => void,
    inputRef: React.RefObject<HTMLDivElement>,
    appliedStyle: TextStyle | null,
    setAppliedStyle: (style: TextStyle | null) => void
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
            let newText = selectedText;

            if (appliedStyle) {
                newText = removeUnicodeStyle(selectedText);
            }

            if (appliedStyle !== style) {
                newText = formatTextToUnicode({ text: newText, style });
                setAppliedStyle(style);
            } else {
                setAppliedStyle(null);
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
    }, [text, setText, inputRef, appliedStyle, setAppliedStyle]);
};