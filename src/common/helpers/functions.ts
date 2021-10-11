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
    if (typeof items[0][field] === 'number') {
        return items.filter(it => it[field] === value);
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