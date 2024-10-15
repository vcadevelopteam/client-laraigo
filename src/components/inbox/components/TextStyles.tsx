import { useCallback, useEffect } from 'react';

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
            return ['', ''];
        default:
            return ['', ''];
    }
};

const checkAppliedStyles = (text: string, selectionStart: number, selectionEnd: number) => {
    const checkStyle = (regex: RegExp, text: string) => {
        const matches = Array.from(text.matchAll(regex));
        return matches.some(({index, 0: match}) => {
            const startIndex = index;
            const endIndex = index + match.length;
            return (selectionStart >= startIndex && selectionStart < endIndex) ||
                   (selectionEnd > startIndex && selectionEnd <= endIndex) ||
                   (selectionStart < startIndex && selectionEnd > endIndex);
        });
    };
    const styles = {
        bold: checkStyle(/\*[^*]+\*/g, text),
        italic: checkStyle(/_[^_]+_/g, text),
        strikethrough: checkStyle(/~[^~]+~/g, text),
        monospaced: checkStyle(/[^]+/g, text),
    };
    return styles;
};

export const useSymbolToggleTextStyle = (
    text: string,
    setText: (text: string) => void,
    inputRef: React.RefObject<HTMLDivElement>,
    appliedStyles: { [key in TextStyle]?: boolean },
    setAppliedStyles: (styles: { [key in TextStyle]?: boolean }) => void
) => {
    const handleSelectionChange = useCallback(() => {
        const inputElement = inputRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!inputElement) {
            return;
        }    
        const { value, selectionStart, selectionEnd } = inputElement;
        if (selectionStart === selectionEnd) {
            if (!(value[selectionStart - 1] && value[selectionStart] && /\S/.test(value.slice(selectionStart - 1, selectionEnd + 1)))) {
                setAppliedStyles({
                    bold: false,
                    italic: false,
                    strikethrough: false,
                    monospaced: false
                });
            } else {
                const newAppliedStyles = checkAppliedStyles(value, selectionStart, selectionEnd);
                setAppliedStyles(newAppliedStyles);
            }
        } else {
            const newAppliedStyles = checkAppliedStyles(value, selectionStart, selectionEnd);
            setAppliedStyles(newAppliedStyles);
        }
    }, [inputRef, setAppliedStyles]);
    
    
    useEffect(() => {
        const inputElement = inputRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!inputElement) {
            return;
        }
    
        const events = ['select', 'click', 'keyup'];
        events.forEach(event => {
            inputElement.addEventListener(event, handleSelectionChange);
        });
    
        return () => {
            events.forEach(event => {
                inputElement.removeEventListener(event, handleSelectionChange);
            });
        };
    }, [handleSelectionChange, inputRef]);
    
    return useCallback((style: TextStyle) => {
        const inputElement = inputRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;
        if (!inputElement) {
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