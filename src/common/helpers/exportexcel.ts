import FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
import { Dictionary } from "@types";
import i18n from 'i18next';

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