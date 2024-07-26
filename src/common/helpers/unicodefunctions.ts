type StyleMap = { [key: string]: string };
import {string_to_unicode_variant} from "string-to-unicode-variant";

const boldMap: StyleMap = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆',
    'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍',
    'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔',
    'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
    'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠',
    'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧',
    'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮',
    'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔',
    '7': '𝟕', '8': '𝟖', '9': '𝟗',
    '!': '𝗇', '"': '𝖆', '#': '𝖇', '$': '𝖈', '%': '𝖉', '&': '𝖊', '\'': '𝖋',
    '(': '𝖌', ')': '𝖍', '*': '𝖎', '+': '𝖏', ',': '𝖐', '-': '𝖑', '.': '𝖒',
    '/': '𝖓', ':': '𝖔', ';': '𝖕', '<': '𝖖', '=': '𝖗', '>': '𝖘', '?': '𝖙',
    '@': '𝖚', '[': '𝖛', '\\': '𝖜', ']': '𝖝', '^': '𝖞', '_': '𝖟', '`': '𝖠',
    '{': '𝖡', '|': '𝖢', '}': '𝖣', '~': '𝖤', ' ': ' '
};

const italicMap: StyleMap = {
    'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺',
    'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁',
    'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈',
    'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍',
    'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔',
    'h': '𝑖', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛',
    'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢',
    'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
    '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨',
    '7': '𝟩', '8': '𝟪', '9': '𝟫',
    '!': '!', '"': '"', '#': '#', '$': '$', '%': '%', '&': '&', '\'': '\'',
    '(': '(', ')': ')', '*': '*', '+': '+', ',': ',', '-': '-', '.': '.',
    '/': '/', ':': ':', ';': ';', '<': '<', '=': '=', '>': '>', '?': '?',
    '@': '@', '[': '[', '\\': '\\', ']': ']', '^': '^', '_': '_', '`': '`',
    '{': '{', '|': '|', '}': '}', '~': '~', ' ': ' '
};

const monospacedMap: StyleMap = {
    'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶',
    'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
    'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄',
    'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉', 'a': '𝚊', 'b': '𝚋',
    'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒',
    'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙',
    'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠',
    'x': '𝚡', 'y': '𝚢', 'z': '𝚣', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
    '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿', '!': '！',
    '"': '＂', '#': '＃', '$': '＄', '%': '％', '&': '＆', '\'': '＇', '(': '（',
    ')': '）', '*': '＊', '+': '＋', ',': '，', '-': '－', '.': '．', '/': '／',
    ':': '：', ';': '；', '<': '＜', '=': '＝', '>': '＞', '?': '？', '@': '＠',
    '[': '［', '\\': '＼', ']': '］', '^': '＾', '_': '＿', '`': '｀', '{': '｛',
    '|': '｜', '}': '｝', '~': '～', ' ': ' '
};

export function formatTextToUnicode({text = '', bold = false, italic = false, underline = false, strikethrough = false, monospaced = false} = {}) {    
    let formattedText = text;
    let variant = ""
    let combinings = []
    if (bold) {
        variant += "bold "
    }
    if (italic) {
        variant += "italic "
        formattedText = formattedText.split('').map(char => italicMap[char] || char).join('');
    }
    if (underline) {
        combinings.push("underline")
    }
    if (strikethrough) {
        combinings.push("strike")
    }
    if (monospaced) {
        variant += "monospace"
    }
    return string_to_unicode_variant(text, variant.trim(), combinings);
}

export const removeUnicodeStyle = (text: string, style: 'bold' | 'italic' | 'strikethrough' | 'monospaced' | 'underline'): string => {
    let map: StyleMap;
    switch (style) {
        case 'bold':
            map = boldMap;
            break;
        case 'italic':
            map = italicMap;
            break;
        case 'strikethrough':
            return text.replace(/[\u0336]/g, '');
        case 'underline':
            return text.replace(/[\u0332]/g, '');
        case 'monospaced':
            map = monospacedMap;
            break;
        default:
            return text;
    }

    if (map) {
        const reversedMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
        console.log(`Reversed Map: ${JSON.stringify(reversedMap)}`);

        let result = '';
        for (let i = 0; i < text.length; i++) {
            const codePoint = text.codePointAt(i);
            if (codePoint !== undefined) {
                const char = String.fromCodePoint(codePoint);
                const originalChar = reversedMap[char] || char;
                result += originalChar;
                if (codePoint > 0xFFFF) {
                    i++;
                }
            }
        }
        return result;
    }
    return text;
};