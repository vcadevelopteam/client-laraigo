type StyleMap = { [key: string]: string };
import {string_to_unicode_variant} from "string-to-unicode-variant";

export function formatTextToUnicode({text = '', bold = false, italic = false, underline = false, strikethrough = false, monospaced = false} = {}) {    
    let resulttext = text;
    if (monospaced) {
        resulttext = string_to_unicode_variant(text, "monospace")
    }
    if (bold) {
        resulttext = string_to_unicode_variant(text, "bold")
    }
    if (italic) {
        resulttext = string_to_unicode_variant(text, "italic")
    }
    if (underline) {
        resulttext = string_to_unicode_variant(text, "", "underline")
    }
    if (strikethrough) {
        resulttext = string_to_unicode_variant(text, "", "strike")
    }
    return resulttext
}

export const removeUnicodeStyle = (text: string): string => {
    return text.normalize('NFKC')
};