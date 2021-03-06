import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Dictionary } from "@types";

type ColumnTmp = {
    Header: string;
    accessor: string;
}

export function exportExcel(filename: string, csvData: Dictionary[], columnsexport: ColumnTmp[]): void {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    let datafromtable = csvData;
    if(columnsexport) {
        datafromtable = csvData.map((x: any) => {
            const newx: Dictionary = {};
            columnsexport.forEach((y: ColumnTmp) => newx[y.Header] = x[y.accessor]);
            return newx;
        });
    }
    const ws = XLSX.utils.json_to_sheet(datafromtable);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, filename + fileExtension);
}