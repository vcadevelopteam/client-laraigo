import React, { useEffect, useState, MouseEventHandler, useRef } from 'react';
import Table from '@material-ui/core/Table';
import { Divider, FormControlLabel, Grid, ListItemIcon, Paper, Popper, Radio, TableSortLabel, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import { exportExcel, getLocaleDateString, localesLaraigo } from 'common/helpers';
import { setMemoryTable } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import AllInboxIcon from '@material-ui/icons/AllInbox'; 
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import {
    FirstPage,
    LastPage,
    NavigateNext,
    NavigateBefore,
    MoreVert as MoreVertIcon,
    Refresh as RefreshIcon,
    Add as AddIcon
} from '@material-ui/icons';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import DeleteIcon from "@material-ui/icons/Delete";
import { Dictionary, TableConfig } from '@types'
import { DialogZyx, SearchField } from 'components';
import { DownloadIcon } from 'icons';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Checkbox from '@material-ui/core/Checkbox';
import {
    useTable,
    TableInstance,
    TableOptions,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,    
    Row,
    FilterProps,
    CellProps,   
    useExpanded,
    useGroupBy,
} from 'react-table'
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Skeleton } from '@material-ui/lab';
import { FixedSizeList } from 'react-window';
import DateFnsUtils from '@date-io/date-fns';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { TableFooter } from '@material-ui/core';

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
    name: string
    onAdd?: (instance: TableInstance<T>) => MouseEventHandler
    onDelete?: (instance: TableInstance<T>) => MouseEventHandler
    onEdit?: (instance: TableInstance<T>) => MouseEventHandler
    onClick?: (row: Row<T>) => void
}

const useStyles = makeStyles((theme) => ({
    footerTable: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: "space-between",
        },
        '& > div': {
            display: 'block',
            textAlign: 'center',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',
                alignItems: "center",
            },
        }
    },
    trdynamic: {
        '&:hover': {
            boxShadow: '0 11px 6px -9px rgb(84 84 84 / 78%)',
            "& $containerfloat": {
                visibility: 'visible'
            }
        },
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: `${theme.spacing(1)}px`,
    },
    containerfloat: {
        borderBottom: 'none',
        backgroundColor: 'white',
        marginTop: '1px',
        position: 'absolute',
        zIndex: 9999,
        left: 0,
        visibility: 'hidden'
    },
    iconOrder: {
        width: 20,
        height: 20,
        color: theme.palette.text.primary,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    containerButtons: {
        gridGap: theme.spacing(1),
        display: 'grid',
        gridAutoFlow: 'column',
        alignItems: 'center',
        alignSelf: "flex-start"
    },
    containerHeader: {
        display: 'block',
        flexWrap: 'wrap',
        gap: 8,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        }
    },
    containerHeaderColumn: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
    headerIcon: {
        '& svg': {
          width: 16,
          height: 16,
          marginTop: -2,
          marginRight: 4,
          marginLeft: -6
        },
    },
    iconDirectionAsc: {
        transform: 'rotate(90deg)',
    },
    iconDirectionDesc: {
        transform: 'rotate(180deg)',
    },
    cellIcon: {
        '& svg': {
          width: 16,
          height: 16,
          marginTop: -2,
          marginRight: 4,
          marginLeft: -6
        },
    },
}));

declare module "react-table" {
    // eslint-disable-next-line
    interface UseTableColumnProps<D extends object> {
        listSelectFilter: Dictionary;
        helpText?: string;
    }
}

export const stringOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'contains', value: 'contains' },
    { key: 'notcontains', value: 'notcontains' },
    { key: 'isempty', value: 'isempty' },
    { key: 'isnotempty', value: 'isnotempty' },
    // { key: 'isnull', value: 'isnull' },
    // { key: 'isnotnull', value: 'isnotnull' },
];

export const numberOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'greater', value: 'greater' },
    { key: 'greaterorequals', value: 'greaterorequals' },
    { key: 'less', value: 'less' },
    { key: 'lessorequals', value: 'lessorequals' },
    { key: 'isempty', value: 'isempty' },
    { key: 'isnotempty', value: 'isnotempty' },
    // { key: 'isnull', value: 'isnull' },
    // { key: 'isnotnull', value: 'isnotnull' },
];

export const dateOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'after', value: 'after' },
    { key: 'afterequals', value: 'afterequals' },
    { key: 'before', value: 'before' },
    { key: 'beforeequals', value: 'beforeequals' },
    // { key: 'isnull', value: 'isnull' },
    // { key: 'isnotnull', value: 'isnotnull' },
];

export const booleanOptionsMenu = [
    { key: 'all', value: 'all' },
    { key: 'istrue', value: 'istrue' },
    { key: 'isfalse', value: 'isfalse' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];

export const BooleanOptionsMenuComponent: React.FC<{ value: any; handleClickItemMenu: (key: any) => void }> = ({ value, handleClickItemMenu }) => {
    const { t } = useTranslation();

    return (
        <Select
            value={value || 'all'}
            onChange={(e) => handleClickItemMenu(e.target.value)}
        >
            {booleanOptionsMenu.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                    {t(option.value)}
                </MenuItem>
            ))}
        </Select>
    )
}

export const SelectFilterTmp: React.FC<{ value: any; data: any[]; handleClickItemMenu: (key: any) => void }> = ({ value, data, handleClickItemMenu }) => {
    const { t } = useTranslation();
    return (
        <Select
            value={value || '_ALL'}
            onChange={(e) => handleClickItemMenu(e.target.value)}
        >
            <MenuItem value='_ALL'>
                {t(langKeys.all)}
            </MenuItem>
            {data.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {t(option.key)}
                </MenuItem>
            ))}
        </Select>
    )
}

export const DateOptionsMenuComponent = ({value, handleDate}:any) => {
    const { t } = useTranslation();
    const [value2, setvalue2] = useState(null)

    useEffect(() => {
        if (value === 'isnull' || value === 'isnotnull') {
            setvalue2(null)
        }
    }, [value])

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo() as any)[navigator.language.split('-')[0]]}>
            <KeyboardDatePicker
                invalidDateMessage={t(langKeys.invalid_date_format)}
                format={getLocaleDateString()}
                value={value2}
                onChange={(e: any) => {
                    const date = new Date(e);
                    if(!e) {
                        handleDate(e)
                        setvalue2(e)
                    } else if(!isNaN(date.getTime())){
                        date.setHours(10)
                        handleDate(date);
                        setvalue2(e)
                    }
                }}
                style={{ minWidth: '150px' }}
            />
        </MuiPickersUtilsProvider>
    )
}

export const TimeOptionsMenuComponent = ({value, handleTime}:any) => {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo())[navigator.language.split('-')[0]]}>
            <KeyboardTimePicker
                ampm={false}
                views={['hours', 'minutes', 'seconds']}
                format="HH:mm:ss"
                error={false}
                helperText={''}
                value={value === '' ? null : value}
                onChange={(e: any) => handleTime(e)}
                style={{ minWidth: '150px' }}
            />
        </MuiPickersUtilsProvider>

    )
}

export const OptionsMenuComponent = (type: string, operator: string, handleClickItemMenu: (key: any) => void) => {
    const { t } = useTranslation();
    switch (type) {
        case "number": case "number-centered":
            return (
                numberOptionsMenu.map((option) => (
                    <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                        {t(option.value)}
                    </MenuItem>
                ))
            )
        case "date": case "datetime-local": case "time":
            return (
                dateOptionsMenu.map((option) => (
                    <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                        {t(option.value)}
                    </MenuItem>
                ))
            )
        case "string": case "color":
        default:
            return (
                stringOptionsMenu.map((option) => (
                    <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                        {t(option.value)}
                    </MenuItem>
                ))
            )
    }
}

const TableZyx = React.memo(({
    titlemodule,
    columns,
    data,
    fetchData,
    download = false,
    importData = false,
    importDataFunction,
    deleteData = false,
    deleteDataFunction,
    register,
    handleRegister,
    calculate = false,
    handleCalculate,
    HeadComponent,
    ButtonsElement,
    triggerExportPersonalized,
    exportPersonalized,
    pageSizeDefault = 20,
    importCSV,
    handleTemplate,
    filterGeneral = true,
    loading = false,
    useSelection,
    selectionKey,
    initialSelectedRows,
    setSelectedRows,
    allRowsSelected,
    setAllRowsSelected,
    onClickRow,
    toolsFooter = true,
    initialPageIndex = 0,
    helperText = "",
    initialStateFilter,
    registertext,
    setDataFiltered,
    useFooter = false,
    heightWithCheck = 43,
    checkHistoryCenter = false,
    showHideColumns,
    groupedBy,
    ExtraMenuOptions,
    acceptTypeLoad = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv",
    cleanImport,
    defaultGlobalFilter,
    setOutsideGeneralFilter
}: TableConfig) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [initial, setInitial] = useState(true);
    const showExtraButtonIcon = showHideColumns || groupedBy || ExtraMenuOptions;
    const [isGroupedByModalOpen, setGroupedByModalOpen] = useState(false);   
    const [isShowColumnsModalOpen, setShowColumnsModalOpen] = useState(false); 
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);
    const [columnGroupedBy, setColumnGroupedBy] = useState<string[]>([]);
    const [activeColumn, setActiveColumn] = useState(localStorage.getItem('activeColumn') || null);

    const initialColumnVisibility = columns.reduce((acc, column) => {
        acc[column.id] = true; 
        return acc;
    }, {});

    const [columnVisibility, setColumnVisibility] = useState(() => {
        const storedColumnVisibility = localStorage.getItem('columnVisibility');
        if (storedColumnVisibility) {
            return JSON.parse(storedColumnVisibility);
        } else {
            return initialColumnVisibility;
        }
    });
  
    const handleColumnVisibilityChange = (columnId, isVisible) => {
        const updatedVisibility = {
            ...columnVisibility,
            [columnId]: isVisible,
        };
        setColumnVisibility(updatedVisibility);
        localStorage.setItem('columnVisibility', JSON.stringify(updatedVisibility));    
        const columnInstance = allColumns.find(column => column.id === columnId);
        if (columnInstance) {
            columnInstance.toggleHidden(!isVisible);
        }
    }

    useEffect(() => {
        allColumns.forEach(column => {
            const isVisible = columnVisibility[column.id] ?? true; 
            column.toggleHidden(!isVisible); 
        });
    }, []); 

    useEffect(() => {
        localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    
   
    
    
   
    const handleClickSeButtons = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElSeButtons(anchorElSeButtons ? null : event.currentTarget);
        setOpenSeButtons((prevOpen) => !prevOpen);
    }; 

    const handleOpenGroupedByModal = () => {
        setGroupedByModalOpen(true);
        if (openSeButtons) {
            setAnchorElSeButtons(null);
            setOpenSeButtons(false);
        }
    };

    const handleOpenShowColumnsModal = () => {
        setShowColumnsModalOpen(true);
        if (openSeButtons) {
            setAnchorElSeButtons(null);
            setOpenSeButtons(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (!isGroupedByModalOpen && !isShowColumnsModalOpen && anchorElSeButtons && !anchorElSeButtons.contains(target)) {
                setAnchorElSeButtons(null);
                setOpenSeButtons(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isGroupedByModalOpen, isShowColumnsModalOpen, anchorElSeButtons, setOpenSeButtons]);

    const handleRadioClick = (columnId: string) => {
        setColumnGroupedBy((prevGroupedBy) => {
            const isColumnActive = prevGroupedBy.includes(columnId);
            const updatedGroupedBy = isColumnActive ? [] : [columnId];
    
            prevGroupedBy.forEach((prevColumn) => {
                if (prevColumn !== columnId) {
                    toggleGroupBy(prevColumn, false);
                }
            });    
            setActiveColumn(isColumnActive ? null : columnId);    
            localStorage.setItem('columnGroupedBy', JSON.stringify(updatedGroupedBy));    
            localStorage.setItem('activeColumn', isColumnActive ? '' : columnId);    
            if (!isColumnActive) {
                const columnToToggle = allColumns.find((column) => column.id === columnId);
                if (columnToToggle && columnToToggle.canGroupBy) {
                    toggleGroupBy(columnId);
                }
            } else {
                toggleGroupBy(columnId, false);
            }
    
            return updatedGroupedBy;
        });
    };
        
    useEffect(() => {
        const activeColumn = localStorage.getItem('activeColumn');
        if (activeColumn) {
            setActiveColumn(activeColumn);
        }
    }, []);    
    
    useEffect(() => {
        //console.log('Columna activa recuperada del localStorage:', activeColumn);
    }, [activeColumn]);
    
    useEffect(() => {
        const storedColumnGroupedBy = localStorage.getItem('columnGroupedBy');
        if (storedColumnGroupedBy) {
            setColumnGroupedBy(JSON.parse(storedColumnGroupedBy));
        }
    }, [activeColumn]);

    

    const DefaultColumnFilter = ({
        column: { id: header, setFilter: $setFilter, listSelectFilter = [], type = "string" },
    }: any) => {
        const iSF = initialStateFilter?.filter(x => x.id === header)[0];
        const [value, setValue] = useState(iSF?.value.value || '');
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const [operator, setoperator] = useState(iSF?.value.operator || "contains");
        const [valueOnFocus, setValueOnFocus] = useState(''); // El valor cuando el input recibió el foco

        const setFilter = (filter: any) => {
            $setFilter(filter);

            dispatch(setMemoryTable({
                filter: {
                    [header]: {
                        value: filter.value,
                        operator: filter.operator,
                        type: filter.type
                    }
                }
            }));
        }

        const handleCloseMenu = () => {
            setAnchorEl(null);
        };
        const handleClickItemMenu = (op: any) => {
            setAnchorEl(null);
            if (type === 'boolean') {
                setoperator(op)
                setValue(op);
                setFilter({ value: op, operator: op, type });
            } else if (type === "select") {
                setValue(op);
                setFilter({ value: op, operator: op, type });
            } else {
                if (['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(op) || !!value) {
                    setFilter({ value, operator: op, type });
                }
                setoperator(op)
            }
        };
        const handleClickMenu = (event: any) => {
            setAnchorEl(event.currentTarget);
        };
        const keyPress = React.useCallback((e) => {
            if (e.keyCode === 13) {
                setFilter({ value, operator, type });
            }
        }, [value, operator])

        const onBlur = () => {
            if (value !== valueOnFocus) {
                setFilter({ value, operator, type });
            }
        }

        const handleDate = (date: Date) => {
            if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
                setValue(date?.toISOString() || '');
                setFilter({
                    value: date?.toISOString().split('T')[0] || '',
                    operator,
                    type
                })
            }
        }
        const handleTime = (date: Date) => {
            if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
                setValue(date?.toISOString() || '');
                setFilter({
                    value: date?.toLocaleTimeString(),
                    operator,
                    type
                })
            }
        }

        useEffect(() => {
            if (!initialStateFilter?.filter(x => x.id === header)[0]) {
                switch (type) {
                    case "number": case "number-centered":
                    case "date":
                    case "datetime-local":
                    case "time":
                    case "select":
                        setoperator("equals");
                        break;
                    case "boolean":
                        setoperator("all");
                        break;
                    case "string": case "color":
                    default:
                        setoperator("contains");
                        break;
                }
            }
        }, [type]);

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {type === 'boolean' ? (
                    <BooleanOptionsMenuComponent
                        value={value}
                        handleClickItemMenu={handleClickItemMenu}
                    />)
                    : (type === "select" ?
                        <SelectFilterTmp
                            value={value}
                            handleClickItemMenu={handleClickItemMenu}
                            data={listSelectFilter}
                        /> :
                        <React.Fragment>
                            {type === 'date' &&
                                <DateOptionsMenuComponent
                                    value={value}
                                    handleDate={handleDate} />
                            }
                            {type === 'time' &&
                                <TimeOptionsMenuComponent
                                    value={value}
                                    handleTime={handleTime} />
                            }
                            {!['date', 'time'].includes(type) &&
                                <Input
                                    onBlur={onBlur}
                                    onFocus={e => setValueOnFocus(e.target.value)}
                                    type={type}
                                    style={{ fontSize: '15px', minWidth: '100px' }}
                                    fullWidth
                                    value={value}
                                    onKeyDown={keyPress}
                                    onChange={e => {
                                        setValue(e.target.value || '');
                                        if (['date'].includes(type)) {
                                            setFilter({ value: e.target.value, operator, type });
                                        }
                                    }}
                                />}
                            <IconButton
                                onClick={handleClickMenu}
                                size="small"
                            >
                                <MoreVertIcon
                                    style={{ cursor: 'pointer' }}
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    color="action"
                                    fontSize="small"
                                />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                    style: {
                                        maxHeight: 48 * 4.5,
                                        width: '20ch',
                                    },
                                }}
                            >
                                {OptionsMenuComponent(type, operator, handleClickItemMenu)}
                            </Menu>
                        </React.Fragment>)
                }
            </div>
        );
    }

    const filterCellValue = React.useCallback((rows, id, filterValue) => {
        const { value, operator, type } = filterValue;
        return rows.filter((row: any) => {
            const cellvalue = row.values[id] === null || row.values[id] === undefined ? "" : row.values[id];

            if (value === '' && !['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(operator))
                return true;

            switch (type) {
                case "number": case "number-centered":
                    switch (operator) {
                        case 'greater':
                            return cellvalue > Number(value);
                        case 'greaterorequals':
                            return cellvalue >= Number(value);
                        case 'less':
                            return cellvalue < Number(value);
                        case 'lessorequals':
                            return cellvalue <= Number(value);
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'notequals':
                            return cellvalue !== Number(value);
                        case 'equals':
                        default:
                            return cellvalue === Number(value);
                    }
                case "date": case "datetime-local": case "time":
                    switch (operator) {
                        case 'after':
                            return cellvalue > value;
                        case 'afterequals':
                            return cellvalue >= value;
                        case 'before':
                            return cellvalue < value;
                        case 'beforeequals':
                            return cellvalue <= value;
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'notequals':
                            return cellvalue !== value;
                        case 'equals':
                        default:
                            return cellvalue === value;
                    }
                case "boolean":
                    switch (operator) {
                        case 'istrue':
                            return typeof (cellvalue) === 'string' ? cellvalue === 'true' : cellvalue === true;
                        case 'isfalse':
                            return typeof (cellvalue) === 'string' ? cellvalue === 'false' : cellvalue === false;
                        case 'isnull':
                            return cellvalue === "";
                        case 'isnotnull':
                            return cellvalue !== "";
                        case 'all':
                        default:
                            return true;
                    }
                case "select":
                    switch (operator) {
                        default:
                            return value === '_ALL' ? true : cellvalue === value;
                    }
                case "string":
                default:
                    switch (operator) {
                        case 'equals':
                            return cellvalue === value;
                        case 'notequals':
                            return cellvalue !== value;
                        case 'isempty':
                            return cellvalue === '';
                        case 'isnotempty':
                            return cellvalue !== '';
                        case 'isnull':
                            return cellvalue === null;
                        case 'isnotnull':
                            return cellvalue !== null;
                        case 'notcontains':
                            return !(`${cellvalue}`).toLowerCase().includes(value.toLowerCase());
                        case 'contains':
                        default:
                            return (`${cellvalue}`).toLowerCase().includes(value.toLowerCase());
                    }
            }
        });
    }, []);

    const defaultColumn = React.useMemo(
        () => ({          
            Filter: (props: FilterProps<Dictionary>) => DefaultColumnFilter({ ...props, data }),
            filter: filterCellValue,
        }),
        []
    );


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        globalFilteredRows,
        setGlobalFilter,
        allColumns,
        state: { pageIndex, pageSize, selectedRowIds  },
        toggleAllRowsSelected,
        toggleGroupBy,
    } = useTable({
        columns,
        data,
        initialState: { 
            pageSize: pageSizeDefault, 
            selectedRowIds: initialSelectedRows || {}, 
            filters: initialStateFilter || [],
            globalFilter: defaultGlobalFilter || "",         
        },
        defaultColumn,
        getRowId: (row, relativeIndex: number, parent?: Row<Dictionary>) => selectionKey
            ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
            : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex),
    },
        useFilters,       
        useGlobalFilter,
        useGroupBy,
        useSortBy,       
        useExpanded,     
        usePagination,
        useRowSelect,
        hooks => {
            useSelection && hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    width: 80,
                    disableGroupBy: true,
                    Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
                        <div style={{ textAlign: 'right' }}>
                            <Checkbox
                                color="primary"
                                style={{ padding: 0 }}
                                {...getToggleAllPageRowsSelectedProps()}
                            />
                        </div>
                    ),
                    Cell: ({ row }: CellProps<Dictionary>) => (
                        <div style={{ textAlign: 'right' }}>
                            {checkHistoryCenter === true ? <Checkbox
                                color="primary"
                                style={{ padding: 0 }}
                                checked={row.isSelected}
                                onChange={(e) => row.toggleRowSelected()}
                            /> :
                                <Checkbox
                                    color="primary"
                                    style={{ padding: 0 }}
                                    checked={row.isSelected}
                                    onChange={(e) => row.toggleRowSelected()}
                                />}
                        </div>
                    ),
                    NoFilter: true,
                } as any,
                ...columns,
            ])
            hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
                // fix the parent group of the selection button to not be resizable
                const selectionGroupHeader = headerGroups[0]?.headers[0]
                if (selectionGroupHeader) {
                    selectionGroupHeader.canResize = false
                }
            })
        }
    )
    const fileInputRef = useRef(null);

    function setIsFiltering(param: string){
        setGlobalFilter(param)
        if(filterGeneral && setOutsideGeneralFilter){
            setOutsideGeneralFilter(param)
        }
    }

    const handleCheckboxChange = (columnId: any) => {
        const updatedVisibility = {
            ...columnVisibility,
            [columnId]: !columnVisibility[columnId],
        };
        setColumnVisibility(updatedVisibility);
        localStorage.setItem('columnVisibility', JSON.stringify(updatedVisibility));
    };   

    useEffect(() => {
        const storedColumnVisibility = localStorage.getItem('columnVisibility');
        if (storedColumnVisibility) {
            setColumnVisibility(JSON.parse(storedColumnVisibility));
        }
    }, []);
    
    useEffect(() => {
        allColumns.forEach(column => {
            const isVisible = columnVisibility[column.id] ?? true;
            column.toggleHidden(!isVisible);
        });
    }, [columnVisibility, allColumns]);

    useEffect(() => {
        if(pageIndex === 0 && initialPageIndex){
            gotoPage(initialPageIndex);
        }
    }, [data, pageIndex])

    useEffect(() => {
        if (fetchData) {
            fetchData();
        }
    }, [fetchData])

    useEffect(() => {
        setSelectedRows && setSelectedRows(selectedRowIds)
    }, [selectedRowIds]);

    useEffect(() => {
        setDataFiltered && setDataFiltered(globalFilteredRows.map(x => x.original));
    }, [globalFilteredRows])

    useEffect(() => {
        if (allRowsSelected) {
            toggleAllRowsSelected(true);
            setAllRowsSelected && setAllRowsSelected(false);
        }
    }, [allRowsSelected])
    
    useEffect(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [cleanImport])

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            style = { ...style, display: 'flex', alignItems: 'flex-end', cursor: onClickRow ? 'pointer' : 'default' }
            const row = page[index]
            prepareRow(row);
            return (
                <TableRow
                    {...row.getRowProps({ style })}
                    hover
                >
                    {row.cells.map((cell, index) =>
                        <TableCell
                            key={index}
                            {...cell.getCellProps({
                                style: {
                                    ...(cell.column.width === 'auto' ? {
                                        flex: 1,
                                    } : {
                                        minWidth: cell.column.minWidth,
                                        width: cell.column.width,
                                        maxWidth: cell.column.maxWidth,
                                    }),
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    paddingRight: cell.column.type === "number"?54:24,
                                    textAlign: cell.column.type === "number" ? "right" : (cell.column.type?.includes('centered') ? "center" : "left"),
                                },
                            })}                            
                            onClick={() => cell.column.id !== "selection" ? (onClickRow && onClickRow(row.original, cell?.column?.id)) : null}
                        >
                            {cell.render('Cell')}
                           
                        </TableCell>
                    )}
                </TableRow>
            )
        },
        [headerGroups, prepareRow, page]
    )
    return (
        <Box width={1} style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                {titlemodule ? <span className={classes.title}>
                    {titlemodule}
                    {helperText !== "" ? <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                    </Tooltip> : ""}
                </span> : (<div style={{ flexGrow: 1 }}>
                    {typeof ButtonsElement === 'function' ? (
                        ButtonsElement()
                        ) : (
                        ButtonsElement
                    )}
                </div>)}
                <span className={classes.containerButtons}>
                    {fetchData && (
                        <Tooltip title="Refresh">
                            <Fab
                                size="small"
                                aria-label="add"
                                color="primary"
                                disabled={loading}
                                style={{ marginLeft: '1rem' }}
                                onClick={() => fetchData && fetchData({})}
                            >
                                <RefreshIcon />
                            </Fab>
                        </Tooltip>
                    )}
                    {(ButtonsElement && !!titlemodule) && <ButtonsElement />}
                    {importCSV && (
                        <>
                            <input
                                name="file"
                                accept={acceptTypeLoad}
                                id="laraigo-upload-csv-file"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    importCSV(e.target.files)}}
                                ref={fileInputRef}
                            />
                            <label htmlFor="laraigo-upload-csv-file">
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    disabled={loading}
                                    startIcon={<BackupIcon color="secondary" />}
                                    style={{ backgroundColor: "#55BD84" }}
                                ><Trans i18nKey={langKeys.import} />
                                </Button>
                            </label>
                            {
                                handleTemplate &&
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    component="span"
                                    color="primary"
                                    disabled={loading}
                                    startIcon={<ListAltIcon color="secondary" />}
                                    onClick={handleTemplate}
                                    style={{ backgroundColor: "#55BD84" }}
                                ><Trans i18nKey={langKeys.template} />
                                </Button>
                            }
                        </>
                    )}
                    {register && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={<AddIcon color="secondary" />}
                            onClick={handleRegister}
                            style={{ backgroundColor: "#55BD84" }}
                        ><Trans i18nKey={registertext || langKeys.register} />
                        </Button>
                    )}
                    {calculate && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={<RefreshIcon color="secondary" />}
                            onClick={handleCalculate}
                            style={{ backgroundColor: "#55BD84" }}
                        ><Trans i18nKey={langKeys.calculate} />
                        </Button>
                    )}
                    {download && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={() => triggerExportPersonalized ? exportPersonalized && exportPersonalized() : exportExcel(String(titlemodule || '') + "Report", globalFilteredRows.map(x => x.original), columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                            startIcon={<DownloadIcon />}
                        ><Trans i18nKey={langKeys.download} />
                        </Button>
                    )}
                    {showExtraButtonIcon && (
                        <div>
                             <IconButton
                                aria-label="more"
                                id="long-button"
                                onClick={(event) => handleClickSeButtons(event)}
                                style={{ backgroundColor: openSeButtons ? '#F6E9FF' : undefined, color: openSeButtons ? '#7721AD' : undefined }}
                            >
                                <MoreVertIcon />
                            </IconButton>

                            <div style={{ display: 'flex', gap: 8 }}>
                                <Popper
                                    open={openSeButtons}
                                    anchorEl={anchorElSeButtons}
                                    placement="bottom"
                                    transition
                                    style={{marginRight:'1rem'}}
                                >
                                    {({ TransitionProps }) => (
                                        <Paper {...TransitionProps} elevation={5}>                                           
                                            {showHideColumns && (
                                                <>
                                                <MenuItem 
                                                    style={{padding:'0.7rem 1rem', fontSize:'0.96rem'}}
                                                    onClick={handleOpenShowColumnsModal}                                           
                                                >
                                                    <ListItemIcon>
                                                        <ViewWeekIcon fontSize="small" style={{ fill: 'grey', height:'25px' }}/>
                                                    </ListItemIcon>
                                                    <Typography variant="inherit">{t(langKeys.showHideColumns)}</Typography>
                                                </MenuItem>
                                                <Divider />
                                                </>
                                            )}
                                             {groupedBy && (
                                                <div>
                                                    <MenuItem 
                                                        style={{padding:'0.7rem 1rem', fontSize:'0.96rem'}} 
                                                        onClick={handleOpenGroupedByModal}
                                                    >
                                                        <ListItemIcon>
                                                            <AllInboxIcon fontSize="small" style={{ fill: 'grey', height:'23px' }}/>
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">{t(langKeys.groupedBy)}</Typography>
                                                    </MenuItem>
                                                    <Divider />
                                                </div>
                                            )}
                                            {ExtraMenuOptions}
                                        </Paper>
                                    )}
                                </Popper>
                            </div>
                                     
                        </div>  
                    )}
                    {deleteData && (
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            disabled={loading}
                            onClick={deleteDataFunction}
                            startIcon={<DeleteIcon color='secondary' />}
                            style={{ backgroundColor: "#FB5F5F", color: "white", }}
                        ><Trans i18nKey={langKeys.deletedata} />
                        </Button>
                    )}
                    {importData && (
                        <>
                            <input
                              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                              id="uploadfile"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                importDataFunction && importDataFunction(e.target.files)
                              }}
                                onClick={(event) => {
                                    // @ts-ignore
                                    event.target.value = null;
                                }
                            }
                           />
                           <label htmlFor="uploadfile">
                              <Button
                                 className={classes.button}
                                 variant="contained"
                                 component="span"
                                 color="secondary"
                                 startIcon={<BackupIcon color="secondary" />}
                                 style={{
                                    backgroundColor: "#55BD84",
                                    color: "white",
                                    
                                 }}
                              >
                                <Trans i18nKey={langKeys.import} />
                              </Button>
                           </label>
                        </>
                    )}
                </span>
            </Box>
            {filterGeneral && (
                <Box className={classes.containerFilterGeneral}>
                    <span></span>
                    <div className={classes.containerSearch}>
                        <SearchField
                            disabled={loading}
                            colorPlaceHolder='#FFF'
                            handleChangeOther={setIsFiltering}
                            defaultGlobalFilter={defaultGlobalFilter}
                            lazy
                        />
                    </div>
                </Box>
            )}

            {isShowColumnsModalOpen && (
                <DialogZyx 
                    open={isShowColumnsModalOpen} 
                    title={t(langKeys.showHideColumns)} 
                    buttonText2={t(langKeys.close)}       
                    handleClickButton2={() => setShowColumnsModalOpen(false)}                  
                    maxWidth="sm"
                    buttonStyle1={{marginBottom:'0.3rem'}}
                    buttonStyle2={{marginRight:'1rem', marginBottom:'0.3rem'}}
                >                              
                    <Grid container spacing={1} style={{ marginTop: '0.5rem' }}>
                    {allColumns.filter(column => {
                        const isColumnInstance = 'accessor' in column && 'Header' in column;
                        return isColumnInstance && 'showColumn' in column && column.showColumn === true;
                    })
                    .map((column) => (
                        <Grid item xs={4} key={column.id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={columnVisibility[column.id] ?? true}
                                        onChange={(e) => handleColumnVisibilityChange(column.id, e.target.checked)}
                                    />
                                }
                                label={t(column.Header as string)}
                            />
                        </Grid>
                    ))}
                    </Grid>

                </DialogZyx>               
            )}

            {isGroupedByModalOpen && (
                <DialogZyx 
                    open={isGroupedByModalOpen}
                    title={t(langKeys.groupedBy)}
                    buttonText2={t(langKeys.close)}
                    handleClickButton2={() => setGroupedByModalOpen(false)}
                    maxWidth="sm"
                    buttonStyle1={{ marginBottom: '0.3rem' }}
                    buttonStyle2={{ marginRight: '1rem', marginBottom: '0.3rem' }}
                >                     
                    <Grid container spacing={1} style={{ marginTop: '0.5rem' }}>
                        {columns
                            .filter((column: any) => column.showGroupedBy === true)
                            .map((column: any) => (
                            <Grid item xs={4} key={column.accessor}>
                                <FormControlLabel
                                    control={
                                        <Radio
                                            color="primary"
                                            checked={columnGroupedBy.includes(column.accessor)}
                                            onClick={() => handleRadioClick(column.accessor)}
                                            
                                        />
                                    }
                                    label={column.Header}
                                />
                            </Grid>
                            ))}
                    </Grid>
                </DialogZyx>
            )} 

            {HeadComponent && <HeadComponent />}

            <TableContainer style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
                <Box overflow="auto" style={{ flex: 1 }}>
                    <Table size="small" {...getTableProps()} aria-label="enhanced table" aria-labelledby="tableTitle">
                        <TableHead style={{ display: 'table-header-group' }}>
                            {headerGroups.map((headerGroup, index) => ( 
                                <TableRow {...headerGroup.getHeaderGroupProps()} key={index} style={useSelection ? { display: 'flex' } : {}}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            
                                            <th style={{ width: "0px" }} key="header-floating"></th> : 
                                            <TableCell key={ii} style={useSelection ? {
                                                ...(column.width === 'auto' ? {
                                                    flex: 1,
                                                } : {
                                                    minWidth: column.minWidth,
                                                    width: column.width,
                                                    maxWidth: column.maxWidth, 
                                                })
                                            } : {}}>
                                                {column.isComponent ?
                                                    column.render('Header') :
                                                    (<>
                                                        <div className={classes.containerHeaderColumn}>

                                                        { activeColumn === column.id && (
                                                                <Tooltip title={''}>
                                                                    <div style={{ whiteSpace: 'nowrap', wordWrap: 'break-word', display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
                                                                        {column.canGroupBy === true && (
                                                                            <TableSortLabel
                                                                                active
                                                                                direction={column.isGrouped ? 'desc' : 'asc'}
                                                                                IconComponent={KeyboardArrowRight}
                                                                                className={classes.headerIcon}
                                                                                {...column.getHeaderProps(column.getGroupByToggleProps({
                                                                                    title: column.isGrouped ? 'Desagrupar' : 'Agrupar'
                                                                                }))}                                                                            
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        }

                                                            <Box
                                                                {...column.getHeaderProps(column.getSortByToggleProps({ title: 'Ordenar' }))}
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    wordWrap: 'break-word',
                                                                    display: 'flex',
                                                                    cursor: 'pointer',
                                                                    alignItems: 'center',                                                                    
                                                                }}
                                                            >                                                              
                                                                {column.render('Header')}
                                                                {column.isSorted && (
                                                                    column.isSortedDesc ?
                                                                        <ArrowDownwardIcon className={classes.iconOrder} color="action" />
                                                                        :
                                                                        <ArrowUpwardIcon className={classes.iconOrder} color="action" />
                                                                )}
                                                               
                                                            </Box>

                                                            {!!column.helpText && (
                                                                <Tooltip title={<div style={{ fontSize: 12 }}>{column.helpText}</div>} arrow placement="top" >
                                                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                        <div>{!column.NoFilter && column.render('Filter')}</div>
                                                    </>)
                                                }
                                            </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody
                            {...getTableBodyProps()}
                            style={{ backgroundColor: 'white' }}
                        >
                            {loading && <LoadingSkeleton columns={headerGroups[0].headers.length} />}
                            {(!loading && useSelection) && (
                                <FixedSizeList
                                    style={{ overflowX: 'hidden' }}
                                    direction="vertical"
                                    width="auto"
                                    height={page.length * heightWithCheck}
                                    itemCount={page.length}
                                    itemSize={heightWithCheck}
                                >
                                    {RenderRow}
                                </FixedSizeList>
                            )}
                            {(!loading && !useSelection) && page.map(row => {
                                prepareRow(row);
                                return ( //eslint-disable-next-line
                                    <TableRow
                                        {...row.getRowProps()}
                                        hover
                                        style={{ cursor: onClickRow ? 'pointer' : 'default' }}
                                    >
                                        {row.cells.map((cell) => //eslint-disable-next-line
                                            <TableCell
                                                {...cell.getCellProps({
                                                    style: {
                                                        minWidth: cell.column.minWidth,
                                                        width: cell.column.width,
                                                        maxWidth: cell.column.maxWidth,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        paddingRight: cell.column.type === "number"?54:24,
                                                        ...(toolsFooter ? {} : { padding: '0px' }),
                                                        textAlign: cell.column.type === "number" ? "right" : (cell.column.type?.includes('centered') ? "center" : "left"),
                                                    },
                                                })}
                                                onClick={() => {
                                                    if(cell.column.id !== "selection"){
                                                        if(row?.subRows?.length){
                                                            row.toggleRowExpanded();
                                                        }else{
                                                            onClickRow && onClickRow(row.original, cell?.column?.id)
                                                        }
                                                    }}
                                                }
                                            >
                                               {cell.isGrouped ? (
                                                    <>
                                                        <TableSortLabel
                                                            classes={{
                                                                iconDirectionAsc: classes.iconDirectionAsc,
                                                                iconDirectionDesc: classes.iconDirectionDesc,
                                                            }}
                                                            active
                                                            direction={row.isExpanded ? 'desc' : 'asc'}
                                                            IconComponent={KeyboardArrowUp}
                                                            {...row.getToggleRowExpandedProps()}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                row.toggleRowExpanded();
                                                            }}
                                                            className={classes.cellIcon}
                                                        />{' '}
                                                        {cell.render('Cell', { editable: false })} ({row.subRows.length})
                                                    </>
                                                ) : (
                                                    columns.isGrouped ? ( 
                                                        cell.isAggregated ? (
                                                            cell.render('Aggregated')
                                                        ) : cell.isPlaceholder ? null : (
                                                            cell.render('Cell')
                                                        )
                                                    ) : (
                                                        cell.render('Cell')
                                                    )
                                                )}


                                                
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        {useFooter && <TableFooter>
                            {footerGroups.map(group => ( //eslint-disable-next-line
                                <TableRow {...group.getFooterGroupProps()}>
                                    {group.headers.map(column => ( //eslint-disable-next-line
                                        <TableCell {...column.getFooterProps({
                                            style: {
                                                fontWeight: "bold",
                                                color: "black",
                                                textAlign: column.type === "number" ? "right" : (column.type?.includes('centered') ? "center" : "left"),
                                            }
                                        })}>
                                            {column.render('Footer')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableFooter>}
                    </Table>
                </Box>
                
                {toolsFooter && (
                    <Box className={classes.footerTable}>
                        <Box>
                            <IconButton
                                onClick={() => {
                                    gotoPage(0);
                                    dispatch(setMemoryTable({
                                        page: 0
                                    }));
                                }}
                                disabled={!canPreviousPage || loading}
                            >
                                <FirstPage />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    previousPage();
                                    dispatch(setMemoryTable({
                                        page: pageIndex - 1
                                    }));
                                }}
                                disabled={!canPreviousPage || loading}
                            >
                                <NavigateBefore />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    nextPage();
                                    dispatch(setMemoryTable({
                                        page: pageIndex + 1
                                    }));
                                }}
                                disabled={!canNextPage || loading}
                            >
                                <NavigateNext />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    gotoPage(pageCount - 1);
                                    dispatch(setMemoryTable({
                                        page: pageCount - 1
                                    }));
                                }}
                                disabled={!canNextPage || loading}
                            >
                                <LastPage />
                            </IconButton>
                            <Box component="span" fontSize={14}>
                                <Trans
                                    i18nKey={langKeys.tablePageOf}
                                    values={{ currentPage: (pageOptions.length === 0 ? 0 : pageIndex + 1), totalPages: pageOptions.length }}
                                    components={[<Box fontWeight="700" component="span" key={"ke4e1"}></Box>, <Box fontWeight="700" component="span" key={"ke4e2"}></Box>]}
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Trans
                                i18nKey={(globalFilteredRows || []).length === 100000 ? langKeys.tableShowingRecordOfMore : langKeys.tableShowingRecordOf}
                                values={{ itemCount: page.length, totalItems: globalFilteredRows.length }}
                            />
                        </Box>
                        <Box>
                            <Select
                                disableUnderline
                                style={{ display: 'inline-flex' }}
                                value={pageSize}
                                disabled={loading}
                                onChange={e => {
                                    setPageSize(Number(e.target.value));
                                    dispatch(setMemoryTable({
                                        pageSize: Number(e.target.value)
                                    }));
                                }}
                            >
                                {[5, 10, 20, 50, 100].map(pageSize => (
                                    <MenuItem key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </MenuItem >
                                ))}
                            </Select>
                            <Box fontSize={14} display="inline" style={{ marginRight: '1rem' }}>
                                <Trans i18nKey={langKeys.recordPerPage} count={pageSize} />
                            </Box>
                        </Box>
                    </Box>
                )}
            </TableContainer>
        </Box>
    )
});
TableZyx.displayName = "TableZyx";
export default TableZyx;

const LoadingSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < columns; i++) {
        items.push(<TableCell key={`table-simple-skeleton-${i}`}><Skeleton /></TableCell>);
    }
    return (
        <>
            <TableRow key="1aux1">
                {items}
            </TableRow>
            <TableRow key="2aux2">
                {items}
            </TableRow>
        </>
    );
};