import FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import { Dictionary } from "@types";
import i18n from 'i18next';
import * as XLSX from 'xlsx';


type ColumnTmp = {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string
}

export function exportExcel(filename: string, csvData: Dictionary[], columnsexport?: ColumnTmp[]): void {
    import('xlsx').then(XLSX => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let datafromtable = csvData;
        if (columnsexport) {
            datafromtable = csvData.map((x: Dictionary) => {
                const newx: Dictionary = {};
                columnsexport.forEach((y: ColumnTmp) => {
                    newx[y.Header] = y.prefixTranslation !== undefined ? i18n.t(`${y.prefixTranslation}${x[y.accessor]?.toLowerCase()}`).toUpperCase() : (
                        y.type === "porcentage" ? `${(Number(x[y.accessor]) * 100).toFixed(0)}%` :
                            x[y.accessor])
                });
                return newx;
            });
        }
        const ws = XLSX.utils.json_to_sheet(datafromtable);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    });
}

export function exportExcelCustom(filename: string, csvData: Dictionary[], columns: ColumnTmp[]): void {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    
    const datafromtable = csvData.map((x: Dictionary) => {
        const newx: Dictionary = {};
        columns.forEach((col: ColumnTmp) => {
            newx[col.Header] = col.prefixTranslation !== undefined
                ? i18n.t(`${col.prefixTranslation}${x[col.accessor]?.toLowerCase()}`).toUpperCase()
                : (col.type === "porcentage"
                    ? `${(Number(x[col.accessor]) * 100).toFixed(0)}%`
                    : x[col.accessor]);
        });
        return newx;
    });

    const ws = XLSX.utils.json_to_sheet(datafromtable);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
}