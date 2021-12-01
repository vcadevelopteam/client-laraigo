import { Dictionary } from "@types";
import * as XLSX from 'xlsx';

export function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
}

export function isJson(s: string): boolean {
    try {
        JSON.parse(s);
    } catch (e) {
        return false;
    }
    return true;
}

export function extractVariables(text: string, array: string[] = []): string[] {
    let rex = new RegExp(/{{[\w\s\u00C0-\u00FF]+?}}/, 'g');
    return Array.from(new Set([...array, ...Array.from(text.matchAll(rex), (m: any[]) => m[0].replace(/[{]{2}/, '').replace(/[}]{2}/, ''))]));
}

export function extractVariablesFromArray(data: any[], key: string, array: string[] = []): string[] {
    return data.reduce((a: any[], d: any) => {
        a = Array.from(new Set([...a, ...extractVariables(d[key], array)]))
        return a;
    }, []);
}

export function dictToArrayKV(dict: Dictionary, key: string = 'key', value: string = 'value') {
    return Object.entries(dict).reduce((a: any[], [k, v]) => {
        a.push({ [key]: k, [value]: v });
        return a;
    }, []);
}

export function richTextToString(data: Dictionary[]) {
    try {
        return data.reduce((ac: Dictionary[], c: Dictionary) => (
            [...ac, ...c?.children?.map((m: Dictionary) => (
                m?.children ? `- ${m?.children[0]?.text}` : m?.text
            ))]
        ), []).join('\n')
    } catch (error) {
        return JSON.stringify(data)
    }
}

export function filterPipe(items: Dictionary[], field: string, value: any, inv?: string) {
    // If there are not items return empty//
    if (!items) return [];
    // If '%' contains wildcard and value is empty return items//
    if (inv === '%' && (!value || value === '')) return items;
    // If filter === '' return empty//
    if (value === '') return [];
    // If there are not filter value return all items//
    if (!value || value.length === 0) return [];
    // If the filter value is a number//
    if (items.length > 0 && typeof items[0][field] === 'number') {
        return items.filter(it => it[field].toString() === value.toString());
    }
    // If '%' contains wildcard is a string contains//
    else if (inv === '%') {
        return items.filter(it => it[field]?.toLowerCase().includes(value.toLowerCase()));
    }
    // If '!' inverter filter is a string not equals//
    else if (inv === '!') {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) === -1);
    }
    // If the filter value is a string is a string equals//
    else {
        return items.filter(it => it[field]?.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    }
}

export function filterIf(data: Dictionary[], rif?: string, rifvalue?: string) {
    return data.filter(d => [null, undefined].includes(d.rif) || (d.rif === rif && d.rifvalue === rifvalue));
}

export function downloadCSV(filename: string, data: Dictionary[]) {
    let columns = Object.keys(data[0]);
    let headers = columns.join(';');
    let csv = headers;
    data.forEach(dt => {
        csv += '\r\n';
        csv += Object.values(dt).join(';');
    });
    let BOM = "\uFEFF";
    var blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export const downloadJson = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function uploadCSV(file: any, owner: any = {}) {
    var reader = new FileReader();
    reader.readAsText(file);
    return new Promise((res, rej) => {
        reader.onload = (event: any) => {
            let csv = event.target.result.toString();
            if (csv !== null) {
                let allTextLines = csv.split(/\r\n|\n/);
                let headers = allTextLines[0].split(';');
                let lines = [];
                for (let i = 1; i < allTextLines.length; i++) {
                    if (allTextLines[i].split(';').length === headers.length) {
                        const line = allTextLines[i].split(';')
                        const data = {
                            ...headers.reduce((ad: any, key: any, j: number) => ({
                                ...ad,
                                [key]: line[j]
                            }), {}),
                            ...owner
                        }
                        lines.push(data)
                    }
                }
                res(lines);
            }
            res(null);
        };
    });
}

export function uploadExcel(file: any, owner: any = {}) {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    return new Promise((res, rej) => {
        reader.onload = (event: any) => {
            var data = event.target.result;
            let workbook = XLSX.read(data, { type: 'binary' });
            const wsname = workbook.SheetNames[0];
            // const ws = workbook.Sheets[wsname];
            // sheet_to_row_object_array
            let rowsx = XLSX.utils.sheet_to_json(
                workbook.Sheets[wsname]
            );
            res(rowsx)
        };
    });
}

export const dateToLocalDate = (date: string, returnType = 'string'): string | Date => {
    if (!date) return new Date().toLocaleDateString();
    const nn = new Date(date)
    const dateCleaned = new Date(nn.getTime() + (nn.getTimezoneOffset() * 60 * 1000));
    if (returnType === 'string')
        return dateCleaned.toLocaleDateString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
    else
        return dateCleaned;
}

export const todayDate = (): Date => {
    return new Date(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substring(0,10) + "T00:00:00");
}

export const convertLocalDate = (date: string | null | undefined, validateWithToday: boolean = false, subtractHours: boolean = true): Date => {
    if (!date) return new Date()
    const dateCleaned = new Date(date)
    // const dateCleaned = new Date(nn.getTime() + (subtractHours ? (nn.getTimezoneOffset() * 60 * 1000 * -1) : 0));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned) : dateCleaned;
}

export const toTime12HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${(hint > 12 ? 24 - hint : hint).toString().padStart(2, "0")}:${m}:${hint > 11 ? "PM" : "AM"}`
}

export const toTime24HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${hint.toString().padStart(2, "0")}:${m}`
}

export const secondsToTime = (seconds: number): string => {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds / 60) % 60);
    const ss = Math.floor(seconds % 60);
    return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export const getSecondsUntelNow = (date: Date): number => Math.floor((new Date().getTime() - date.getTime()) / 1000);

export const getDateCleaned = (date: Date): string => new Date(date.setHours(10)).toISOString().substring(0, 10)

export const cleanedRichResponse = (data: Dictionary[], variablesContext: Dictionary = {}): Dictionary[] => {
    return  data.filter((x: Dictionary) => ["content", "structured message", "action"].includes(x.plugincategory) && !["closestlocation"].includes(x.pluginid)).map((y: Dictionary) => {
        let content = y.stringsmooch;
        if (y.config.randomlist) {
            if (y.config.multiple) {
                const rn = Math.floor(Math.random() * (y.config.randomlist.Count));
                content = y.config.randomlist[rn].value;
            }
            else
                content = y.config.randomlist[0].value;;
        }
        const variableToReplace = y.variablereplace ? y.variablereplace : [];

        variableToReplace.forEach((varr: any) => {
            const varrtmp = varr.split("&&&")[0];
            const valueFound = variablesContext!![varrtmp]?.value || "";
            content = content.replace('{{' + varrtmp + '}}', valueFound);
        });

        return {
            type: y.pluginid === "url" ? "text" : y.pluginid,
            content,
        }
    });
}

export const capitalize = (text: string) => {
    const lower = text.toLowerCase();
    return text.charAt(0).toUpperCase() + lower.slice(1);
}

export const object_trimmer = (data: any) => {
    if (!data) {
        return Object.keys(data).reduce((k, v) => (
            {
                ...k,
                [v]: typeof data[v] === 'string' ? data[v]?.trim() : data[v]
            }
        ), {})
    }
    else {
        return {};
    }
}

export const array_trimmer = (data: any[]) => {
    if (Array.isArray(data)) {
        return data.reduce((a: any[], e: any) => (
            [
                ...a,
                Object.keys(e).reduce((k, v) => (
                    {
                        ...k,
                        [v]: typeof e[v] === 'string' ? e[v]?.trim() : e[v]
                    }
                ), {})
            ]
        ), []);
    }
    else {
        return [];
    }
}

export const randomInterval = (min: number, max: number) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomText = (length = 8, use_upper = false, use_number = false, use_especial = false) => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJkLMNOPQRSTUVWXYZ';
    const number = '0123456789';
    const especial = String.raw`!"#$%&'()*+,-./\\:;<=>?@[]\`^_{|}~`;
    let chars = lower.split('');
    if (use_upper)
        chars = [...chars, ...upper.split('')];
    if (use_number)
        chars = [...chars, ...number.split('')];
    if (use_especial)
        chars = [...chars, ...especial.split('')];
    return Array(length).fill(null).reduce((r, e, i) => {
        let c = '';
        if (i > 0)
            c = chars.filter(c => c !== r[i - 1])[randomInterval(0, chars.filter(c => c !== r[i - 1]).length - 1)]
        else
            c = chars[randomInterval(0, chars.length - 1)]
        r.push(c);
        return r;
    }, []).join('');
}

export const templateMaker = (data: any[], header: string[]) => {
    const max = Math.max(...data.map((d: Dictionary) => Object.keys(d).length));
    let temp: any[] = new Array(max).fill(0).map(() => ({}));
    for (let i = 0; i < max; i++) {
        header.forEach((d, j) => {
            let datakey = Object.keys(data[j] || {})[i];
            if (datakey === data[j][datakey])
                temp[i][d] = Object.keys(data[j] || {})[i]
            else
                temp[i][d] = `${datakey} - ${data[j][datakey]}`
        })
    }
    return temp;
}

export const getLocaleDateString = () => {
    const formats: any = {
      "af-ZA": "yyyy/MM/dd",
      "am-ET": "d/M/yyyy",
      "ar-AE": "dd/MM/yyyy",
      "ar-BH": "dd/MM/yyyy",
      "ar-DZ": "dd-MM-yyyy",
      "ar-EG": "dd/MM/yyyy",
      "ar-IQ": "dd/MM/yyyy",
      "ar-JO": "dd/MM/yyyy",
      "ar-KW": "dd/MM/yyyy",
      "ar-LB": "dd/MM/yyyy",
      "ar-LY": "dd/MM/yyyy",
      "ar-MA": "dd-MM-yyyy",
      "ar-OM": "dd/MM/yyyy",
      "ar-QA": "dd/MM/yyyy",
      "ar-SA": "dd/MM/yy",
      "ar-SY": "dd/MM/yyyy",
      "ar-TN": "dd-MM-yyyy",
      "ar-YE": "dd/MM/yyyy",
      "arn-CL": "dd-MM-yyyy",
      "as-IN": "dd-MM-yyyy",
      "az-Cyrl-AZ": "dd.MM.yyyy",
      "az-Latn-AZ": "dd.MM.yyyy",
      "ba-RU": "dd.MM.yy",
      "be-BY": "dd.MM.yyyy",
      "bg-BG": "dd.M.yyyy",
      "bn-BD": "dd-MM-yy",
      "bn-IN": "dd-MM-yy",
      "bo-CN": "yyyy/M/d",
      "br-FR": "dd/MM/yyyy",
      "bs-Cyrl-BA": "d.M.yyyy",
      "bs-Latn-BA": "d.M.yyyy",
      "ca-ES": "dd/MM/yyyy",
      "co-FR": "dd/MM/yyyy",
      "cs-CZ": "d.M.yyyy",
      "cy-GB": "dd/MM/yyyy",
      "da-DK": "dd-MM-yyyy",
      "de-AT": "dd.MM.yyyy",
      "de-CH": "dd.MM.yyyy",
      "de-DE": "dd.MM.yyyy",
      "de-LI": "dd.MM.yyyy",
      "de-LU": "dd.MM.yyyy",
      "dsb-DE": "d. M. yyyy",
      "dv-MV": "dd/MM/yy",
      "el-GR": "d/M/yyyy",
      "en": "MM/dd/yyyy",
      "en-029": "MM/dd/yyyy",
      "en-AU": "d/MM/yyyy",
      "en-BZ": "dd/MM/yyyy",
      "en-CA": "dd/MM/yyyy",
      "en-GB": "dd/MM/yyyy",
      "en-IE": "dd/MM/yyyy",
      "en-IN": "dd-MM-yyyy",
      "en-JM": "dd/MM/yyyy",
      "en-MY": "d/M/yyyy",
      "en-NZ": "d/MM/yyyy",
      "en-PH": "M/d/yyyy",
      "en-SG": "d/M/yyyy",
      "en-TT": "dd/MM/yyyy",
      "en-US": "M/d/yyyy",
      "en-ZA": "yyyy/MM/dd",
      "en-ZW": "M/d/yyyy",
      "es": "dd/MM/yyyy",
      "es-419": "dd/MM/yyyy",
      "es-AR": "dd/MM/yyyy",
      "es-BO": "dd/MM/yyyy",
      "es-CL": "dd-MM-yyyy",
      "es-CO": "dd/MM/yyyy",
      "es-CR": "dd/MM/yyyy",
      "es-DO": "dd/MM/yyyy",
      "es-EC": "dd/MM/yyyy",
      "es-ES": "dd/MM/yyyy",
      "es-GT": "dd/MM/yyyy",
      "es-HN": "dd/MM/yyyy",
      "es-MX": "dd/MM/yyyy",
      "es-NI": "dd/MM/yyyy",
      "es-PA": "MM/dd/yyyy",
      "es-PE": "dd/MM/yyyy",
      "es-PR": "dd/MM/yyyy",
      "es-PY": "dd/MM/yyyy",
      "es-SV": "dd/MM/yyyy",
      "es-US": "M/d/yyyy",
      "es-UY": "dd/MM/yyyy",
      "es-VE": "dd/MM/yyyy",
      "et-EE": "d.MM.yyyy",
      "eu-ES": "yyyy/MM/dd",
      "fa-IR": "MM/dd/yyyy",
      "fi-FI": "d.M.yyyy",
      "fil-PH": "M/d/yyyy",
      "fo-FO": "dd-MM-yyyy",
      "fr-BE": "d/MM/yyyy",
      "fr-CA": "yyyy-MM-dd",
      "fr-CH": "dd.MM.yyyy",
      "fr-FR": "dd/MM/yyyy",
      "fr-LU": "dd/MM/yyyy",
      "fr-MC": "dd/MM/yyyy",
      "fy-NL": "d-M-yyyy",
      "ga-IE": "dd/MM/yyyy",
      "gd-GB": "dd/MM/yyyy",
      "gl-ES": "dd/MM/yy",
      "gsw-FR": "dd/MM/yyyy",
      "gu-IN": "dd-MM-yy",
      "ha-Latn-NG": "d/M/yyyy",
      "he-IL": "dd/MM/yyyy",
      "hi-IN": "dd-MM-yyyy",
      "hr-BA": "d.M.yyyy.",
      "hr-HR": "d.M.yyyy",
      "hsb-DE": "d. M. yyyy",
      "hu-HU": "yyyy. MM. dd.",
      "hy-AM": "dd.MM.yyyy",
      "id-ID": "dd/MM/yyyy",
      "ig-NG": "d/M/yyyy",
      "ii-CN": "yyyy/M/d",
      "is-IS": "d.M.yyyy",
      "it-CH": "dd.MM.yyyy",
      "it-IT": "dd/MM/yyyy",
      "iu-Cans-CA": "d/M/yyyy",
      "iu-Latn-CA": "d/MM/yyyy",
      "ja-JP": "yyyy/MM/dd",
      "ka-GE": "dd.MM.yyyy",
      "kk-KZ": "dd.MM.yyyy",
      "kl-GL": "dd-MM-yyyy",
      "km-KH": "yyyy-MM-dd",
      "kn-IN": "dd-MM-yy",
      "ko-KR": "yyyy. MM. dd",
      "kok-IN": "dd-MM-yyyy",
      "ky-KG": "dd.MM.yy",
      "lb-LU": "dd/MM/yyyy",
      "lo-LA": "dd/MM/yyyy",
      "lt-LT": "yyyy.MM.dd",
      "lv-LV": "yyyy.MM.dd.",
      "mi-NZ": "dd/MM/yyyy",
      "mk-MK": "dd.MM.yyyy",
      "ml-IN": "dd-MM-yy",
      "mn-MN": "yy.MM.dd",
      "mn-Mong-CN": "yyyy/M/d",
      "moh-CA": "M/d/yyyy",
      "mr-IN": "dd-MM-yyyy",
      "ms-BN": "dd/MM/yyyy",
      "ms-MY": "dd/MM/yyyy",
      "mt-MT": "dd/MM/yyyy",
      "nb-NO": "dd.MM.yyyy",
      "ne-NP": "M/d/yyyy",
      "nl-BE": "d/MM/yyyy",
      "nl-NL": "d-M-yyyy",
      "nn-NO": "dd.MM.yyyy",
      "nso-ZA": "yyyy/MM/dd",
      "oc-FR": "dd/MM/yyyy",
      "or-IN": "dd-MM-yy",
      "pa-IN": "dd-MM-yy",
      "pl-PL": "dd.MM.yyyy",
      "prs-AF": "dd/MM/yy",
      "ps-AF": "dd/MM/yy",
      "pt-BR": "d/M/yyyy",
      "pt-PT": "dd-MM-yyyy",
      "qut-GT": "dd/MM/yyyy",
      "quz-BO": "dd/MM/yyyy",
      "quz-EC": "dd/MM/yyyy",
      "quz-PE": "dd/MM/yyyy",
      "rm-CH": "dd/MM/yyyy",
      "ro-RO": "dd.MM.yyyy",
      "ru-RU": "dd.MM.yyyy",
      "rw-RW": "M/d/yyyy",
      "sa-IN": "dd-MM-yyyy",
      "sah-RU": "MM.dd.yyyy",
      "se-FI": "d.M.yyyy",
      "se-NO": "dd.MM.yyyy",
      "se-SE": "yyyy-MM-dd",
      "si-LK": "yyyy-MM-dd",
      "sk-SK": "d. M. yyyy",
      "sl-SI": "d.M.yyyy",
      "sma-NO": "dd.MM.yyyy",
      "sma-SE": "yyyy-MM-dd",
      "smj-NO": "dd.MM.yyyy",
      "smj-SE": "yyyy-MM-dd",
      "smn-FI": "d.M.yyyy",
      "sms-FI": "d.M.yyyy",
      "sq-AL": "yyyy-MM-dd",
      "sr-Cyrl-BA": "d.M.yyyy",
      "sr-Cyrl-CS": "d.M.yyyy",
      "sr-Cyrl-ME": "d.M.yyyy",
      "sr-Cyrl-RS": "d.M.yyyy",
      "sr-Latn-BA": "d.M.yyyy",
      "sr-Latn-CS": "d.M.yyyy",
      "sr-Latn-ME": "d.M.yyyy",
      "sr-Latn-RS": "d.M.yyyy",
      "sv-FI": "d.M.yyyy",
      "sv-SE": "yyyy-MM-dd",
      "sw-KE": "M/d/yyyy",
      "syr-SY": "dd/MM/yyyy",
      "ta-IN": "dd-MM-yyyy",
      "te-IN": "dd-MM-yy",
      "tg-Cyrl-TJ": "dd.MM.yy",
      "th-TH": "d/M/yyyy",
      "tk-TM": "dd.MM.yy",
      "tn-ZA": "yyyy/MM/dd",
      "tr-TR": "dd.MM.yyyy",
      "tt-RU": "dd.MM.yyyy",
      "tzm-Latn-DZ": "dd-MM-yyyy",
      "ug-CN": "yyyy-M-d",
      "uk-UA": "dd.MM.yyyy",
      "ur-PK": "dd/MM/yyyy",
      "uz-Cyrl-UZ": "dd.MM.yyyy",
      "uz-Latn-UZ": "dd/MM yyyy",
      "vi-VN": "dd/MM/yyyy",
      "wo-SN": "dd/MM/yyyy",
      "xh-ZA": "yyyy/MM/dd",
      "yo-NG": "d/M/yyyy",
      "zh-CN": "yyyy/M/d",
      "zh-HK": "d/M/yyyy",
      "zh-MO": "d/M/yyyy",
      "zh-SG": "d/M/yyyy",
      "zh-TW": "yyyy/M/d",
      "zu-ZA": "yyyy/MM/dd",
    };
  
    return formats[navigator.language] || "dd/MM/yyyy";
  }