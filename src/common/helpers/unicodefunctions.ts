type StyleMap = { [key: string]: string };
import {string_to_unicode_variant} from "string-to-unicode-variant";

export function formatTextToUnicode({text = '', bold = false, italic = false, underline = false, strikethrough = false, monospaced = false} = {}) {    
    let variant = ""
    let combinings = []
    if (monospaced) {
        variant += "m "
    }
    if (bold) {
        variant += "b "
    }
    if (italic) {
        variant += "i "
    }
    if (underline) {
        combinings.push("underline")
    }
    if (strikethrough) {
        combinings.push("strike")
    }
    return string_to_unicode_variant(text, variant.trim(), combinings);
}

export const removeUnicodeStyle = (text: string): string => {
    return text.normalize('NFKC')
};