import ExcelJs from "exceljs";
import { Dictionary } from "@types";


const timetonumber = (formattedTime: string) => {
    const regex = /(\d+h)?(\d+m)?(\d+s)?/;
    const matches = formattedTime.match(regex);

    const hours = parseInt(matches?.[1] || "0");
    const minutes = parseInt(matches?.[2] || "0");
    const seconds = parseInt(matches?.[3] || "0");

    return hours * 3600 + minutes * 60 + seconds;
};

function formatDuration(duration:string) {
    const timeArray = duration.split(':').map(Number);
    const hours = timeArray[0];
    const minutes = timeArray[1];
    const seconds = timeArray[2];
    let formattedDuration = '';
    if (hours > 0) {
        formattedDuration += hours + 'h ';
    }
    if (minutes > 0) {
        formattedDuration += minutes + 'm ';
    }
    if (seconds > 0) {
        formattedDuration += seconds + 's';
    }
    return formattedDuration.trim() || "00s";
}


const oldtimetonumber = (formattedTime: string) => {
    const hours = parseInt(formattedTime?.split(":")?.[0] || "0");
    const minutes = parseInt(formattedTime?.split(":")?.[1] || "0");
    const seconds = parseInt(formattedTime?.split(":")?.[2] || "0");
    

    return hours * 3600 + minutes * 60 + seconds;
};

function gradientTime(num: string, rules: Dictionary[]) {
    for (const item of rules) {
        if (oldtimetonumber(num) >= timetonumber(item.min) && oldtimetonumber(num) < timetonumber(item.max)) {
            return item.color;
        }
    }
    return "7721ad";
}
function gradientNumber(num: number, rules: Dictionary[]) {
    for (const item of rules) {
        if (num >= item.min && num < item.max) {
            return item.color;
        }
    }
    return "7721ad";
}
function gradient(num: number|string, rules: Dictionary[], rowcounter: number, type: string, rowcolimit?: number) {
    if (rowcolimit) {
        if (rowcounter >= rowcolimit) return "FFFFFF";
    }
    if(type==="time"){
        return gradientTime(num,rules)
    }else if( type==="percentage"){
        return gradientNumber(num*100,rules)
    }else{
        return gradientNumber(parseInt(num),rules)
    }
}

export function exportexcelwithgradient(
    filename: string,
    csvData: Dictionary[],
    columnsexport: Dictionary[],
    rules: Dictionary[],
    valueKey: string,
    type: string,
    limit?: number,
): void {

    const workbook = new ExcelJs.Workbook();
    const sheet = workbook.addWorksheet("data")
    const columns = columnsexport.map(x=>({header: x.Header, key: x.accessor}))
    sheet.columns = columns
    csvData.map((x,rowIndex)=>{
        const valueheader=columns.reduce((acc,x)=>[...acc,x.key],[])
        valueheader.forEach((y, colIndex) => {
            const cellValue = x[y];
            const color =y.includes(valueKey)?gradient(cellValue,rules,rowIndex,type,limit):"FFFFFF"
            sheet.getCell(rowIndex + 2, colIndex + 1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color.replace(/^#/, '') }
            };
            sheet.getCell(rowIndex + 2, colIndex + 1).value = type==="time"?formatDuration(cellValue): type==="percentage"?(cellValue*100) + "%":cellValue;
        });
    })

    workbook.xlsx.writeBuffer().then(dat => {
        const blob = new Blob([dat], {
            type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href=url;
        anchor.download = filename + '.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(url);
    })
}
