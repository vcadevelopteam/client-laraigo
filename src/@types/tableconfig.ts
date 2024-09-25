import { ReactElement } from "react";

export interface Dictionary {
  [key: string]: any;
}

export interface MultiData {
  data: Dictionary[];
  success: boolean;
  key?: string;
}

export interface BreadCrumb {
  id: string
  name: string
}
export interface TableConfig {
  columns: any;
  data: Dictionary[];
  filterrange?: boolean;
  filterRangeDate?: string;
  totalrow?: number;
  fetchData?(param?: any | undefined): void;
  pageCount?: number;
  titlemodule?: string;
  methodexport?: string;
  triggerExportPersonalized?: boolean;
  exportPersonalized?(param?: any): void;
  importCSV?: (param?: any) => void;
  handleTemplate?: (param?: any) => void;
  download?: boolean;
  deleteData?: boolean;
  deleteDataFunction?:() => void;
  importData?: boolean;
  importDataFunction?:(files: any) => Promise<void>;
  register?: boolean;
  handleRegister?(param: any): void;
  calculate?: boolean;
  handleCalculate?(param: any): void;
  HeadComponent?: () => JSX.Element | null;
  ButtonsElement?: (() => JSX.Element) | ReactElement;
  FiltersElement?: ReactElement;
  pageSizeDefault?: number;

  groupedBy?: boolean;  
  showHideColumns?: boolean;
  
  filterGeneral?: boolean;
  hoverShadow?: boolean;
  loading?: boolean;
  updateCell?(index: number, id: string, value: string): void;
  updateColumn?(index: number[], id: any, value: any): void;
  skipAutoReset?: boolean;
  useSelection?: boolean;
  selectionKey?: string;
  selectionFilter?: { key: string; value: string };
  initialSelectedRows?: any;
  cleanSelection?: boolean;
  setCleanSelection?: (value: boolean) => void;
  setSelectedRows?: (param?: any) => void;
  setDataFiltered?: (param?: any) => void;
  allRowsSelected?: boolean;
  setAllRowsSelected?: (value: boolean) => void;
  autotrigger?: boolean;
  toolsFooter?: boolean;
  heightWithCheck?: number;
  autoRefresh?: { value: boolean; callback: (value: boolean) => void };
  // onClickRow?: (param?: any) => void
  // autoRefresh?: {value: boolean, callback: (value: boolean) => void};
  onClickRow?: (param?: any, columnid?: any) => void;
  /**cualquier filtro */
  onFilterChange?: (filter: ITablePaginatedFilter) => void;
  checkHistoryCenter?: boolean;
  helperText?: string;
  acceptTypeLoad?: string;
  initialStateFilter?: {
    id: string;
    value: {
      value: any;
      type: string;
      operator: string;
    };
  }[];
  initialPageIndex?: number;
  initialStartDate?: number | null;
  initialEndDate?: number | null;
  initialFilters?: {
    [key: string]: IFilters;
  };
  registertext?: string;
  useFooter?: boolean;
  ExtraMenuOptions?: ReactElement;
  cleanImport?: Boolean
  defaultGlobalFilter?: string;
  setOutsideGeneralFilter?: (param: string)=>void; 
}

export interface Pagination {
  sorts: Dictionary;
  distinct?: string;
  filters: Dictionary;
  pageIndex: number;
  trigger?: boolean;
}

export interface IFetchData {
  sorts: Dictionary;
  distinct: any;
  filters: Dictionary;
  pageIndex: number;
  pageSize: number;
  daterange: any;
}

interface IFilters {
  value: any;
  operator: string;
  type?: string | null;
}

export interface ITablePaginatedFilter {
  /**timestamp */
  startDate: number | null;
  /**timestamp */
  endDate: number | null;
  page: number;
  filters: {
    [key: string]: IFilters;
  };
}
