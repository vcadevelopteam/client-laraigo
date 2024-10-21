import React, { useState, useEffect, useMemo, MouseEventHandler } from 'react';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import { TableConfig, Pagination, Dictionary, ITablePaginatedFilter } from '@types'
import { Trans } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { langKeys } from 'lang/keys';
import { DownloadIcon, CalendarIcon } from 'icons';
import BackupIcon from '@material-ui/icons/Backup';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import clsx from 'clsx';
import { Skeleton } from '@material-ui/lab';
import {
    FirstPage,
    LastPage,
    NavigateNext,
    NavigateBefore,
    Search as SearchIcon,
    Add as AddIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import Menu from '@material-ui/core/Menu';

import {
    useTable,
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    TableInstance,
    TableOptions,
    Row,
    useSortBy,
    useExpanded,
    useGroupBy,
    ColumnInstance,
    Cell,
    useColumnOrder,    
} from 'react-table'
import { Range } from 'react-date-range';
import { DialogZyx, DateRangePicker } from 'components';
import { Checkbox, Divider, FormControlLabel, Grid, ListItemIcon, Paper, Popper, Radio, TableSortLabel, Typography } from '@material-ui/core';
import { BooleanOptionsMenuComponent, DateOptionsMenuComponent, SelectFilterTmp, OptionsMenuComponent, TimeOptionsMenuComponent } from './table-simple';
import { getDateToday, getFirstDayMonth, getLastDayMonth, getDateCleaned } from 'common/helpers';

interface Column {
    Header: string;
    accessor: string;
    showColumn?: boolean;
    showGroupedBy?: boolean;
}

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
    name: string
    onAdd?: (instance: TableInstance<T>) => MouseEventHandler
    onDelete?: (instance: TableInstance<T>) => MouseEventHandler
    onEdit?: (instance: TableInstance<T>) => MouseEventHandler
    onClick?: (row: Row<T>) => void
}

declare module "react-table" {
    // eslint-disable-next-line
    interface UseTableColumnProps<D extends object> {
        listSelectFilter: Dictionary;
        helpText?: string;
    }
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
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
    },
    containerButtonsNoFilters: {
        display: 'flex',
        width: '100%',
        justifyContent: 'end',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
    },
    iconOrder: {
        width: 20,
        height: 20,
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
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

const DefaultColumnFilter = ({ header, type, setFilters, filters, listSelectFilter }: any) => {
    const [value, setValue] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [operator, setoperator] = useState("contains");
    const [valueOnFocus, setValueOnFocus] = useState(''); // El valor cuando el input recibió el foco

    useEffect(() => {
        switch (type) {
            case "number": case "number-centered": case "date": case "datetime-local": case "time": case "select":
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
    }, [type])

    useEffect(() => {
        if (['number', 'number-centered'].includes(type))
            setoperator("equals");
    }, [type])

    const keyPress = (e: any) => {
        if (e.keyCode === 13) {
            setValueOnFocus(value)
            if (value || operator === "noempty" || operator === "empty")
                setFilters({
                    ...filters,
                    [header]: {
                        value,
                        operator
                    },
                }, 0)
            else {
                setFilters({
                    ...filters,
                    [header]: undefined,
                }, 0)
            }
        }
    }

    const onBlur = () => {
        if (value !== valueOnFocus) {
            if (value || operator === "noempty" || operator === "empty")
                setFilters({
                    ...filters,
                    [header]: {
                        value: value,
                        operator
                    },
                }, 0)
            else {
                setFilters({
                    ...filters,
                    [header]: undefined,
                }, 0)
            }
        }
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleClickItemMenu = (op: any) => {
        setAnchorEl(null);
        setoperator(op)
        if (type === 'boolean') {
            setValue(op);
            setFilters({
                ...filters,
                [header]: {
                    value: op,
                    operator: op
                },
            }, 0)
        } else if (type === "select") {
            setValue(op);
            setFilters({
                ...filters,
                [header]: op === "_ALL" ? undefined : {
                    value: op,
                    operator: "equals"
                },
            }, 0)
        } else if (type === "text" || !type) {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters({
                    ...filters,
                    [header]: {
                        value: '',
                        operator: op
                    },
                }, 0)
            } else if (value) {
                setFilters({
                    ...filters,
                    [header]: {
                        value: value,
                        operator: op
                    },
                }, 0)
            }
        } else if (['number', 'number-centered'].includes(type)) {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters({
                    ...filters,
                    [header]: {
                        value: '',
                        operator: op
                    },
                }, 0)
            } else if (value) {
                setFilters({
                    ...filters,
                    [header]: {
                        value: value,
                        operator: op
                    },
                }, 0)
            }
        } else {
            if (op === 'isempty' ||
                op === 'isnotempty' ||
                op === 'isnull' ||
                op === 'isnotnull') {
                setFilters({
                    ...filters,
                    [header]: {
                        value: '',
                        operator: op
                    },
                }, 0)
            } else if (value !== '') {
                setFilters({
                    ...filters,
                    [header]: {
                        value: value,
                        operator: op
                    },
                }, 0)
            }
        }
    };
    const handleClickMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDate = (date: Date) => {
        if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
            setValue(date?.toISOString() || '');
            if (date || ['isnull', 'isnotnull'].includes(operator)) {
                setFilters({
                    ...filters,
                    [header]: {
                        value: date?.toISOString().split('T')[0] || '',
                        operator
                    },
                }, 0)
            }
            else {
                setFilters({
                    ...filters,
                    [header]: undefined,
                }, 0)
            }
        }
    }

    const handleTime = (date: Date) => {
        if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
            setValue(date?.toISOString() || '');
            if (date || ['isnull', 'isnotnull'].includes(operator)) {
                setFilters({
                    ...filters,
                    [header]: {
                        value: date?.toLocaleTimeString(),
                        operator
                    },
                }, 0)
            }
            else {
                setFilters({
                    ...filters,
                    [header]: undefined,
                }, 0)
            }
        }
    }

    useEffect(() => {
        if (Object.keys(filters).length === 0) setValue('');
        else if (header in filters) {
            setValue(filters?.[header]?.value || '');
            if (filters?.[header]) setoperator(filters[header].operator);
        }
    }, [filters]);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {type === 'boolean' ?
                <BooleanOptionsMenuComponent
                    value={value}
                    handleClickItemMenu={handleClickItemMenu}
                />
                :
                (type === "select" ?
                    <SelectFilterTmp
                        value={value}
                        handleClickItemMenu={handleClickItemMenu}
                        data={listSelectFilter || []}
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
                                style={{ fontSize: '15px', minWidth: '100px' }}
                                type={['number', 'number-centered'].includes(type) ? "number" : "text"}
                                fullWidth
                                value={value}
                                onFocus={e => setValueOnFocus(e.target.value)}
                                onBlur={onBlur}
                                onKeyDown={keyPress}
                                onChange={e => setValue(e.target.value)}
                            />
                        }
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
                            {OptionsMenuComponent(type || 'string', operator, handleClickItemMenu)}
                        </Menu>
                    </React.Fragment>)}
        </div>
    )
}

const TableZyx = React.memo(({
    titlemodule,
    columns,
    data,
    fetchData,
    filterrange,
    totalrow,
    pageCount: controlledPageCount,
    download,
    register,
    handleRegister,
    HeadComponent,
    ButtonsElement,
    exportPersonalized,
    pageSizeDefault = 20,
    loading,
    importCSV,
    autotrigger = false,
    autoRefresh,
    useSelection,
    selectionKey,
    selectionFilter,
    initialSelectedRows,
    cleanSelection,
    setCleanSelection,
    setSelectedRows,
    onClickRow,
    FiltersElement,
    filterRangeDate = "month",
    onFilterChange,
    initialEndDate = null,
    initialStartDate = null,
    initialFilters = {},
    initialPageIndex = 0,
    groupedBy,
    showHideColumns,
    ExtraMenuOptions,
    fillterAllDate=false,
}: TableConfig) => {
    const classes = useStyles();
    const [pagination, setPagination] = useState<Pagination>({ sorts: {}, filters: initialFilters, distinct: "", pageIndex: initialPageIndex });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(autotrigger);
    const [tFilters, setTFilters] = useState<ITablePaginatedFilter>({
        startDate: initialStartDate,
        endDate: initialEndDate,
        page: initialPageIndex,
        filters: initialFilters,
    });
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        setPageSize,
        toggleAllRowsSelected,
        allColumns,
        state: { pageIndex, pageSize, selectedRowIds },
        setColumnOrder
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: initialPageIndex, pageSize: pageSizeDefault, selectedRowIds: initialSelectedRows || {} },
            manualPagination: true, // Tell the usePagination
            pageCount: controlledPageCount,
            useControlledState: (state: any) => {
                return useMemo(() => ({
                    ...state,
                    pageIndex: pagination.pageIndex,
                }), [state, pagination.pageIndex])
            },
            autoResetSelectedRows: false,
            getRowId: (row, relativeIndex: any, parent: any) => selectionKey
                ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
                : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex),
            stateReducer: (newState, action) => {
                switch (action.type) {
                    case 'toggleAllRowsSelected':
                        return {
                            ...newState,
                            selectedRowIds: {},
                        };
                    default:
                        return newState;
                }
            }
        },
        useColumnOrder,
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
                    Header: ({ getToggleAllPageRowsSelectedProps, filteredRows }: any) => (
                        !selectionFilter
                            ?
                            <div style={{ textAlign: 'right' }}>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: 0 }}
                                    {...getToggleAllPageRowsSelectedProps()}
                                />
                            </div>
                            :
                            <div style={{ textAlign: 'right' }}>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: 0 }}
                                    checked={filteredRows
                                        .filter((p: any) => p.original[selectionFilter?.key] === selectionFilter?.value)
                                        .every((p: any) => p.isSelected)
                                    }
                                    onChange={() => {
                                        filteredRows
                                            .filter((p: any) => p.original[selectionFilter?.key] === selectionFilter?.value)
                                            .forEach((p: any) => {
                                                p.toggleRowSelected();
                                            })
                                    }}
                                />
                            </div>
                    ),
                    Cell: ({ row }: any) => (
                        !selectionFilter || row.original[selectionFilter?.key] === selectionFilter?.value
                            ? <div style={{ textAlign: 'right' }}>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: 0 }}
                                    checked={row.isSelected}
                                    onChange={(e) => row.toggleRowSelected()}
                                />
                            </div>
                            : null
                    ),
                    NoFilter: true,
                    isComponent: true
                } as any,
                ...columns,
            ])
            hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
                const selectionGroupHeader = headerGroups[0].headers[0]
                selectionGroupHeader.canResize = false
            })
        }
    )
    const setFilters = (filters: any, page: number) => {
        setPagination(prev => {
            return { ...prev, filters, pageIndex: 0, trigger: true }
        });
    };
    const setPageIndex = (page: number) => {
        setPagination(prev => ({ ...prev, pageIndex: page, trigger: true }));
        setTFilters(prev => ({ ...prev, page }));
    }
    const handleClickSort = (column: string) => {
        let newsorts: any = {};
        if (Object.keys(pagination.sorts).includes(column)) {
            newsorts = {
                ...pagination.sorts
            }
        }

        if (newsorts[column] === "desc") {
            delete newsorts[column]
        }
        else {
            if (newsorts[column] === "asc") {
                newsorts[column] = "desc";
            }
            else {
                newsorts[column] = "asc";
            }
        }

        setPagination(prev => ({ ...prev, sorts: newsorts, trigger: true }))
    }

    const [dateRange, setdateRange] = useState<Range>({
        startDate: initialStartDate ? new Date(initialStartDate) : filterRangeDate === "month" ? getFirstDayMonth() : getDateToday(),
        endDate: initialEndDate ? new Date(initialEndDate) : filterRangeDate === "month" ? getLastDayMonth() : getDateToday(),
        key: 'selection'
    });

    
    const triggertmp = (fromButton: boolean = false) => {
        if (fromButton)
            setPagination(prev => ({ ...prev, pageIndex: initialPageIndex, trigger: false }));

        if (!fetchData) return;
        fetchData({
            ...pagination,
            pageSize,
            pageIndex: fromButton ? initialPageIndex : pagination.pageIndex,
            daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null,
            }
        });
        setTFilters(prev => ({
            ...prev,
            page: fromButton ? initialPageIndex : pagination.pageIndex,
            startDate: dateRange.startDate ? (new Date(dateRange.startDate.setHours(10))).getTime() : null,
            endDate: dateRange.endDate ? (new Date(dateRange.endDate.setHours(10))).getTime() : null,
        }));
    }

    useEffect(() => {
        if (cleanSelection) {
            toggleAllRowsSelected(false)
            setSelectedRows && setSelectedRows({})
            setCleanSelection && setCleanSelection(false)
        }
    }, [cleanSelection])

    useEffect(() => {
        if (pagination?.trigger) {
            triggertmp()
        }
    }, [pagination, triggerSearch])

    useEffect(() => {
        if (triggerSearch) {
            triggertmp()
        }
    }, [pageSize])

    useEffect(() => {
        if (triggerSearch) {
            triggerSearch && triggertmp(true);
        }
    }, [triggerSearch])

    useEffect(() => {
        if (autoRefresh?.value) {
            triggertmp();
            autoRefresh?.callback(false);
        }
    }, [autoRefresh])

    useEffect(() => {
        setSelectedRows && setSelectedRows(selectedRowIds)
    }, [selectedRowIds]);

    useEffect(() => {
        onFilterChange?.(tFilters);
    }, [tFilters]);

    const exportData = () => {
        exportPersonalized && exportPersonalized({
            ...pagination,
            daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
            }
        })
    }

    const { t } = useTranslation();
    const showExtraButtonIcon = showHideColumns || groupedBy || ExtraMenuOptions;
    const [anchorElSeButtons, setAnchorElSeButtons] = React.useState<null | HTMLElement>(null);
    const [openSeButtons, setOpenSeButtons] = useState(false);
    const [isGroupedByModalOpen, setGroupedByModalOpen] = useState(false);
    const [isShowColumnsModalOpen, setShowColumnsModalOpen] = useState(false);  
    const [columnGroupedBy, setColumnGroupedBy] = useState<string[]>([]);
    const [filterApplied, setFilterApplied] = useState(false);  

    const [rowByToggleActive, setRowByToggleActive] = useState(false);

    useEffect(() => {
        const storedPageIndex = localStorage.getItem('currentPageIndex');
        if (storedPageIndex === null) {
            localStorage.setItem('currentPageIndex', '0');
        }
        return () => {
            localStorage.removeItem('currentPageIndex'); 
        };
    }, []); 
    
    const handlePageSizeChange = (newPageSize) => {
        setPageSize(Number(newPageSize));
        setPageIndex(0); 
    };

    const handleFirstPageClick = () => {
        setPageIndex(0);
        if (!rowByToggleActive) { 
            localStorage.setItem('currentPageIndex', '0');
        }
    };
    
    const handlePrevPageClick = () => {
        const prevPageIndex = pagination.pageIndex - 1;
        setPageIndex(prevPageIndex);
        if (!rowByToggleActive) { 
            localStorage.setItem('currentPageIndex', prevPageIndex.toString());
        }
    };
    
    const handleNextPageClick = () => {
        const nextPageIndex = pagination.pageIndex + 1;
        setPageIndex(nextPageIndex);
        if (!rowByToggleActive) {
            localStorage.setItem('currentPageIndex', nextPageIndex.toString());
        }
    };
    
    const handleLastPageClick = () => {
        setPageIndex(pageCount - 1);
        if (!rowByToggleActive) {
            localStorage.setItem('currentPageIndex', (pageCount - 1).toString());
        }
    };
    
    const initialColumnVisibility = allColumns.reduce((acc, column) => {
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

    const handleColumnVisibilityChange = (columnId: any, isVisible: any) => {
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

    useEffect(() => {
        const storedPageSize = localStorage.getItem('pageSize');
        if (storedPageSize) {
            setPageSize(Number(storedPageSize));
        }
    }, []);

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

    const handleColumnByToggle = (column: ColumnInstance, activate = true) => {
        const columnName = column.id as string;       
        setRowByToggleActive(false); 

        setFilterApplied(false); 
        setPagination(prev => ({ ...prev, distinct: activate ? columnName : "", filters: initialFilters, pageIndex: 0, trigger: true }));
        setColumnOrder?.(prev => {
            const newArray = [...prev];
            const columnIndex = newArray.findIndex(id => id === columnName);    
            if (activate) {
                newArray.splice(columnIndex, 1); // Remueve la columna del lugar actual
                newArray.unshift(columnName); // Inserta la columna al inicio
            } else {
                newArray.splice(columnIndex, 1); // Remueve la columna del lugar actual
            }    
            return newArray;
        });     
    };    

    const handleOrderReset = React.useCallback(()=>{
        setColumnOrder(columns.map(column=>column.accessor))     
    },[columns])
    
    const handleChangePage = () => {
        const storedPageIndex = localStorage.getItem('currentPageIndex');
        if (storedPageIndex !== null) {
            setPagination(prev => ({ ...prev, pageIndex: parseInt(storedPageIndex) }));            
        }
    };

    const handleRadioClick = (columnId: string) => {
        setColumnGroupedBy((prevGroupedBy) => {
            const isColumnActive = prevGroupedBy.includes(columnId);
            const updatedGroupedBy = isColumnActive ? [] : [columnId];
            localStorage.setItem('columnGroupedBy', JSON.stringify(updatedGroupedBy));

    
            if (!isColumnActive) {
                const columnToToggle = allColumns.find(column => column.id === columnId);
                if (columnToToggle && columnToToggle.canGroupBy) {
                    handleColumnByToggle(columnToToggle);
                }
            } else {       
                setPagination(prev => ({ 
                    ...prev, 
                    distinct: "",   
                    filters: initialFilters,              
                    pageIndex: 0, 
                    trigger: true 
                }));
                handleOrderReset();
            }
    
            return updatedGroupedBy;
        });       
    };    

    useEffect(() => {
        const storedColumnGroupedBy = localStorage.getItem('columnGroupedBy');
        if (storedColumnGroupedBy) {
            setColumnGroupedBy(JSON.parse(storedColumnGroupedBy));
        }
    }, []);    

    const handleNoGroupedBy = (column: Column) => {     
        return columnGroupedBy.includes(column.accessor);
    };    

    const handleRowByToggle = (cell: Cell, column: ColumnInstance) => {          

        const columnName = column.id as string;
        const selectedRowValue = cell.row.original[columnName] as string;
        setFilterApplied(true);

        setPagination(prev => ({
            ...prev,
            distinct: "",
            filters: {
                ...prev.filters,
                [columnName]: {
                    "value": selectedRowValue || "", 
                    "operator": selectedRowValue === "" || selectedRowValue === null ? "isempty" : "equals" 
                }
            },
            pageIndex: 0,
            trigger: true
        }));         
        setRowByToggleActive(true); 
    };    
                   
    return (
        <Box width={1} style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {titlemodule && <div className={classes.title}>{titlemodule}</div>}
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center">
                <div className={clsx({
                    [classes.containerButtons]: Boolean(FiltersElement),
                    [classes.containerButtonsNoFilters]: !FiltersElement
                })}>
                    {filterrange && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <DateRangePicker
                                fillterAllDate={fillterAllDate}
                                open={openDateRangeModal}
                                setOpen={setOpenDateRangeModal}
                                range={dateRange}
                                onSelect={setdateRange}
                            >
                                <Button
                                    disabled={loading}
                                    style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                                >
                                    {getDateCleaned(dateRange.startDate!) + " - " + getDateCleaned(dateRange.endDate!)}
                                </Button>
                            </DateRangePicker>
                            {FiltersElement}
                            <Button
                                disabled={loading}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ backgroundColor: '#55BD84', width: 120 }}
                                onClick={() => {
                                    if (triggerSearch)
                                        triggertmp(true)
                                    setTriggerSearch(true)
                                }}
                            >
                                <Trans i18nKey={langKeys.search} />
                            </Button>
                        </div>
                    )}
                    {(!filterrange && Boolean(FiltersElement)) && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {FiltersElement}
                            <Button
                                disabled={loading}
                                variant="contained"
                                color="primary"
                                startIcon={<SearchIcon style={{ color: 'white' }} />}
                                style={{ backgroundColor: '#55BD84', width: 120 }}
                                onClick={() => {
                                    if (triggerSearch)
                                        triggertmp(true)
                                    setTriggerSearch(true)
                                }}
                            >
                                <Trans i18nKey={langKeys.search} />
                            </Button>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {typeof ButtonsElement === 'function' ? (
                            (<ButtonsElement />)
                        ) : (
                            ButtonsElement
                        )}
                        {importCSV && (
                            <>
                                <input
                                    name="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    id="laraigo-upload-csv-file"
                                    type="file"
                                    value={""}
                                    style={{ display: 'none' }}    
                                    onChange={(e) => {importCSV(e.target.files)}}
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
                            ><Trans i18nKey={langKeys.register} />
                            </Button>
                        )}
                        {download && (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={exportData}
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
                                        style={{ marginRight: '1rem' }}
                                    >
                                        {({ TransitionProps }) => (
                                            <Paper {...TransitionProps} elevation={5}>
                                                {showHideColumns && (
                                                    <MenuItem
                                                        style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                        onClick={handleOpenShowColumnsModal}
                                                    >
                                                        <ListItemIcon>
                                                            <ViewWeekIcon fontSize="small" style={{ fill: 'grey', height: '25px' }} />
                                                        </ListItemIcon>
                                                        <Typography variant="inherit">{t(langKeys.showHideColumns)}</Typography>
                                                    </MenuItem>
                                                )}

                                                {groupedBy && (
                                                    <div>
                                                        <MenuItem
                                                            style={{ padding: '0.7rem 1rem', fontSize: '0.96rem' }}
                                                            onClick={handleOpenGroupedByModal}
                                                        >
                                                            <ListItemIcon>
                                                                <AllInboxIcon fontSize="small" style={{ fill: 'grey', height: '23px' }} />
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

                        {isShowColumnsModalOpen && (
                            <DialogZyx
                                open={isShowColumnsModalOpen}
                                title={t(langKeys.showHideColumns)}
                                buttonText2={t(langKeys.close)}
                                handleClickButton2={() => setShowColumnsModalOpen(false)}
                                maxWidth="sm"
                                buttonStyle1={{ marginBottom: '0.3rem' }}
                                buttonStyle2={{ marginRight: '1rem', marginBottom: '0.3rem' }}
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

                    </div>
                </div>
            </Box>

            {HeadComponent && <HeadComponent />}

            <TableContainer style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
                <Box overflow="auto" style={{ flex: 1 }}>
                    <MaUTable {...getTableProps()} aria-label="enhanced table" size="small" aria-labelledby="tableTitle">
                        <TableHead>
                            {headerGroups.map((headerGroup, index) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            <th style={{ width: "0px" }} key="header-floating"></th> :
                                            <TableCell
                                                key={ii}
                                            >
                                                {column.isComponent ?
                                                    column.render('Header')
                                                    :
                                                    (<>
                                                        <div className={classes.containerHeaderColumn}>
                                                        {column.id !== pagination.distinct && !(pagination.filters && column.id in pagination.filters) && handleNoGroupedBy({ ...column, accessor: column.id, Header: column.Header as string }) && (
                                                            <Tooltip title={''}>
                                                                <div style={{ whiteSpace: 'nowrap', wordWrap: 'break-word', display: 'flex', cursor: 'pointer', alignItems: 'center' }}>
                                                                    {column.canGroupBy === true && (
                                                                        <TableSortLabel
                                                                            active
                                                                            direction={column.isGrouped ? 'desc' : 'asc'}
                                                                            IconComponent={KeyboardArrowRight}
                                                                            className={classes.headerIcon}
                                                                            {...column.getHeaderProps( column.getGroupByToggleProps(
                                                                                { 
                                                                                    title: 'Agrupar', 
                                                                                    onClick: () => {
                                                                                        handleColumnByToggle(column) 
                                                                                    }   
                                                                                }
                                                                            ))}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </Tooltip>                                                           
                                                        )}


                                                            <div
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => {
                                                                    setPagination(prev => ({
                                                                        ...prev,
                                                                        distinct: "",
                                                                        filters: {},
                                                                        pageIndex: 0,
                                                                        trigger: true
                                                                    }));
                                                                    handleOrderReset()
                                                                }}
                                                            >
                                                            {(column.id === pagination.distinct || (pagination.filters && column.id in pagination.filters)) && (
                                                                    <KeyboardArrowRightIcon 
                                                                    fontSize="small"
                                                                    color="action"
                                                                    />
                                                                )}
                                                            </div>

                                                            
                                                            <Box
                                                                component="div"
                                                                {...column.getHeaderProps()}
                                                                onClick={() => !column.NoSort && handleClickSort(column.id)}
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    wordWrap: 'break-word',
                                                                    display: 'flex',
                                                                    cursor: 'pointer',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                {column.render('Header')}
                                                                {pagination.sorts[column.id] && (pagination.sorts[column.id] === "asc" ?
                                                                    <ArrowUpwardIcon className={classes.iconOrder} color="action" />
                                                                    : <ArrowDownwardIcon className={classes.iconOrder} color="action" />)
                                                                }
                                                            </Box>
                                                            {column.helpText && (
                                                                <Tooltip title={<div style={{ fontSize: 12, whiteSpace: 'break-spaces' }}>{column.helpText}</div>} arrow placement="top" >
                                                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                        {!column.NoFilter &&
                                                            <DefaultColumnFilter
                                                                header={column.id}
                                                                listSelectFilter={column.listSelectFilter || []}
                                                                type={column.type}
                                                                filters={pagination.filters}
                                                                setFilters={(filters: any, page: number) => {
                                                                    setFilters(filters, page);
                                                                    setTFilters(prev => ({
                                                                        ...prev,
                                                                        filters,
                                                                        page,
                                                                    }));
                                                                }}
                                                            />
                                                        }
                                                    </>)
                                                }
                                            </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()} style={{ backgroundColor: 'white' }}>
                            {loading ?
                                <LoadingSkeleton columns={headerGroups[0].headers.length} /> :
                                page.map((row: any) => {
                                    prepareRow(row);
                                    return ( //eslint-disable-next-line
                                        <TableRow
                                            {...row.getRowProps()}
                                            hover
                                            style={{ cursor: onClickRow ? 'pointer' : 'default' }}
                                        >
                                            {row.cells.map((cell: any, index: number) => 

                                            <TableCell
                                                key={index}
                                                {...cell.getCellProps({
                                                    style: {
                                                        minWidth: cell.column.minWidth,
                                                        width: cell.column.width,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        textAlign: cell.column.type === "number" ? "right" : (cell.column.type?.includes('centered') ? "center" : "left"),
                                                    },
                                                })}
                                                onClick={
                                                    () => cell.column.id !== "selection" ? onClickRow && onClickRow(row.original) : null
                                                }
                                            >
                                                {(filterApplied && pagination.filters && cell.column.id in pagination.filters) ? (
                                                   <>
                                                        <TableSortLabel
                                                            className={classes.headerIcon}
                                                            active
                                                            direction={'asc'}
                                                            IconComponent={KeyboardArrowRight}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (cell.column.id !== "selection") {
                                                                    onClickRow && onClickRow(row.original);
                                                                    handleRowByToggle(cell, cell.column);
                                                                    handleColumnByToggle(cell.column);
                                                                    handleChangePage()

                                                                }
                                                            }}
                                                            
                                                        />
                                                        {''}
                                                        {cell.render('Cell')}
                                                    </>
                                                ) : (
                                                    <>
                                                        {(cell.isGrouped || cell.column.id === pagination.distinct) ? (
                                                            <>
                                                                <TableSortLabel
                                                                    classes={{
                                                                        iconDirectionAsc: classes.iconDirectionAsc,
                                                                        iconDirectionDesc: classes.iconDirectionDesc,
                                                                    }}
                                                                    active
                                                                    direction={row.isExpanded ? 'desc' : 'asc'}
                                                                    IconComponent={KeyboardArrowUp}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (cell.column.id !== "selection") {
                                                                            onClickRow && onClickRow(row.original);
                                                                            handleRowByToggle(cell, cell.column);
                                                                        }
                                                                    }}
                                                                    className={classes.cellIcon}
                                                                />
                                                                {' '} {cell.render('Cell')} {' '}
                                                                ({row.original.countdistinct})
                                                            </>
                                                        ) : ((cell.column.id !== pagination.distinct && pagination.distinct) ? null : cell.render('Cell'))}
                                                    </>
                                                )}
                                                {
                                                    
                                                }
                                            </TableCell>

                                            )}
                                            
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </MaUTable>
                </Box>
                <Box className={classes.footerTable}>
                    <Box>    
                                         
                        <IconButton onClick={handleFirstPageClick} disabled={!canPreviousPage}>
                            <FirstPage />
                        </IconButton>
                        <IconButton onClick={handlePrevPageClick} disabled={!canPreviousPage}>
                            <NavigateBefore />
                        </IconButton>
                        <IconButton onClick={handleNextPageClick} disabled={!canNextPage}>
                            <NavigateNext />
                        </IconButton>
                        <IconButton onClick={handleLastPageClick} disabled={!canNextPage}>
                            <LastPage />
                        </IconButton>

                        <Box component="span" fontSize={14}>
                            <Trans
                                i18nKey={langKeys.tablePageOf}
                                values={{ currentPage: pageOptions.length === 0 ? 0 : pageIndex + 1, totalPages: pageOptions.length }}
                                components={[<Box fontWeight="700" component="span"></Box>, <Box fontWeight="700" component="span"></Box>]}
                            />
                        </Box >

                    </Box>
                    <Box>
                        <Trans
                            i18nKey={(totalrow || 0) === 100000 ? langKeys.tableShowingRecordOfMore : langKeys.tableShowingRecordOf}
                            values={{ itemCount: page.length, totalItems: totalrow }}
                        />
                    </Box>
                    <Box>
                        <Select
                            disableUnderline
                            style={{ display: 'inline-flex' }}
                            value={pageSize}
                            onChange={e => {
                                handlePageSizeChange(e.target.value);
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
            </TableContainer >
        </Box >
    )

    
    
})
TableZyx.displayName = 'TableZyx';
export default TableZyx;
TableZyx.displayName = "TableZyx"

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

interface IQueryMap {
    [key: string]: {
        value: string;
        operator: string;
    }
}

interface IFilters {
    startDate: number;
    endDate: number;
    page: number;
    filters: IQueryMap;
}

interface IOptions {
    ignore?: string[];
}

export function useQueryParams(query: URLSearchParams, options: IOptions = { ignore: [] }) {
    return useMemo(() => {
        const map: IFilters = {
            endDate: Number(query.get('endDate')),
            startDate: Number(query.get('startDate')),
            page: Number(query.get('page')),
            filters: {},
        };
        const { ignore } = options;

        query.forEach((value, key) => {
            if (key === "endDate" ||
                key === "startDate" ||
                key === "page" ||
                key.includes('-operator') ||
                (ignore || []).includes(key)) {
                return;
            }

            const name = `${key}-operator`;
            map.filters[key] = { value, operator: query.get(name)! };
        });

        return map;
    }, [options, query]);
}

export function buildQueryFilters(
    filters: ITablePaginatedFilter,
    init?: string | string[][] | Record<string, string>,
) {
    const params = new URLSearchParams(init);

    for (const key in filters) {
        const value = (filters as any)[key];
        if (key === 'filters' || value === undefined || value === null) continue;
        params.set(key, String(value));
    }

    const colFilters = filters.filters;
    for (const key in colFilters) {
        if (typeof colFilters[key] === 'object' && 'value' in colFilters[key] && 'operator' in colFilters[key]) {
            params.set(key, String(colFilters[key].value));
            params.set(`${key}-operator`, String(colFilters[key].operator));
        }
    }

    return params;
}
