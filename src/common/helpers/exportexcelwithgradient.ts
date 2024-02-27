import FileSaver from "file-saver";
import { Dictionary } from "@types";
import i18n from "i18next";


type ColumnTmp = {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string;
};


function gradient(num: number, rowcounter: number, rowmax: number, limit: number) {
    if (isNaN(num)) {
        return "FFFFFF";
    } else {
        let scale = 255 / (rowmax / 2);
        if (isNaN(scale) || rowmax === 0) scale = 0;

        if (rowcounter >= limit) {
            return "FFFFFF";
        }
        if (num <= rowmax / 2) {
            const number = Math.floor(num * scale).toString(16);
            return "00".slice(number.length) + number + "FF00";
        }
        if (rowmax === num) {
            return "FF0000";
        }
        const number = Math.floor(255 - (num - rowmax / 2) * scale).toString(16);
        return "FF" + "00".slice(number.length) + number + "00";
    }
}

export function exportexcelwithgradient(
    filename: string,
    csvData: Dictionary[],
    columnsexport: ColumnTmp[],
    limit: number,
    valueKey: string
): void {
    import("xlsx").then((XLSX) => {
        let rowmax = 0;

        const maxValuesForEachObject = csvData.map((obj) => {
            const dayValues = Object.keys(obj)
                .filter((key) => key.startsWith("day"))
                .map((key) => obj[key]);

            return Math.max(...dayValues);
        });

        rowmax = Math.max(...maxValuesForEachObject);
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        let datafromtable = csvData;
        if (columnsexport) {
            datafromtable = csvData.map((x: Dictionary) => {
                const newx: Dictionary = {};
                columnsexport.forEach((y: ColumnTmp) => {
                    newx[y.Header] =
                        y.prefixTranslation !== undefined
                            ? i18n.t(`${y.prefixTranslation}${x[y.accessor]?.toLowerCase()}`).toUpperCase()
                            : y.type === "porcentage"
                            ? `${(Number(x[y.accessor]) * 100).toFixed(0)}%`
                            : x[y.accessor];
                });
                return newx;
            });
        }
        const ws = XLSX.utils.json_to_sheet(datafromtable);

        // Loop through the cells and set background color
        datafromtable.forEach((row, rowIndex) => {
            columnsexport.forEach((column, colIndex) => {
                const cellKey = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
                const color = column.accessor.includes(valueKey)?gradient(parseInt(row[column.Header]), rowIndex, rowmax, limit):"FFFFFF" 
                ws[cellKey].s={ fill: { fgColor: { rgb: color } } }
            });
        });
        console.log(XLSX.version);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    });
}
