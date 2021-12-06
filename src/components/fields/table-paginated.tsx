import React, { useState, useEffect, useMemo } from 'react';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import { TableConfig, Pagination } from '@types'
import { Trans } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { langKeys } from 'lang/keys';
import { DownloadIcon, CalendarIcon } from 'icons';
import BackupIcon from '@material-ui/icons/Backup';
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
// import RefreshIcon from "@material-ui/icons/Refresh";
import Menu from '@material-ui/core/Menu';

import {
    useTable,
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect
} from 'react-table'
import { Range } from 'react-date-range';
import { DateRangePicker } from 'components';
import { Checkbox } from '@material-ui/core';
import { BooleanOptionsMenuComponent, DateOptionsMenuComponent, OptionsMenuComponent, TimeOptionsMenuComponent } from './table-simple';

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
    containerfloat: {
        borderBottom: 'none',
        padding: '4px 24px 4px 16px',
        backgroundColor: 'white',
        marginTop: '1px',
        position: 'absolute',
        zIndex: 9999,
        left: 0,
        visibility: 'hidden'
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
    iconOrder: {
        width: 20,
        height: 20,
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    }
}));

const format = (date: Date) => date.toISOString().split('T')[0];

const DefaultColumnFilter = ({ header, type, setFilters, filters, firstvalue }: any) => {
    const [value, setValue] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [operator, setoperator] = useState("contains");

    useEffect(() => {
        switch (type) {
            case "number": case "date": case "datetime-local": case "time":
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
        if (!type && typeof firstvalue === "number")
            setoperator("equals");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstvalue])

    const keyPress = (e: any) => {
        if (e.keyCode === 13) {
            if (value || operator === "noempty" || operator === "empty")
                setFilters({
                    ...filters,
                    [header]: {
                        value,
                        operator
                    },
                }, 0)
            else
                setFilters({
                    ...filters,
                    [header]: undefined,
                }, 0)
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
        }
    };
    const handleClickMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDate = (date: Date) => {
        if (date === null || (date instanceof Date && !isNaN(date.valueOf()))) {
            setValue(date?.toISOString() || '');
            if (!!date || ['isnull', 'isnotnull'].includes(operator)) {
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
            if (!!date || ['isnull', 'isnotnull'].includes(operator)) {
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
    }, [filters]);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {type === 'boolean' ?
                <BooleanOptionsMenuComponent
                    value={value}
                    handleClickItemMenu={handleClickItemMenu}
                />
                : <React.Fragment>
                    {type === 'date' && DateOptionsMenuComponent(value, handleDate)}
                    {type === 'time' && TimeOptionsMenuComponent(value, handleTime)}
                    {!['date', 'time'].includes(type) &&
                        <Input
                            style={{ fontSize: '15px', minWidth: '100px' }}
                            type={type ? type : (typeof firstvalue === "number" ? "number" : "text")}
                            fullWidth
                            value={value}
                            onKeyDown={keyPress}
                            onChange={e => setValue(e.target.value)}
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
                        {OptionsMenuComponent(type ? type : typeof firstvalue, operator, handleClickItemMenu)}
                    </Menu>
                </React.Fragment>}
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
    loading,
    importCSV,
    autotrigger = false,
    autoRefresh,
    useSelection,
    selectionKey,
    selectionFilter,
    initialSelectedRows,
    setSelectedRows,
    onClickRow,
}: TableConfig) => {
    const classes = useStyles();
    const [pagination, setPagination] = useState<Pagination>({ sorts: {}, filters: {}, pageIndex: 0 });
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(autotrigger);
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
        state: { pageIndex, pageSize, selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 20, selectedRowIds: initialSelectedRows || {} },
            manualPagination: true, // Tell the usePagination
            pageCount: controlledPageCount,
            useControlledState: (state: any) => {
                return useMemo(() => ({
                    ...state,
                    pageIndex: pagination.pageIndex,
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }), [state, pagination.pageIndex])
            },
            autoResetSelectedRows: false,
            getRowId: (row, relativeIndex: any, parent: any) => selectionKey
                ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
                : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex),
        },
        useFilters,
        useGlobalFilter,
        usePagination,
        useRowSelect,
        hooks => {
            useSelection && hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    width: 80,
                    Header: ({ getToggleAllPageRowsSelectedProps, filteredRows }: any) => (
                        !selectionFilter
                            ?
                            <div>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: '0 24px 0 16px' }}
                                    {...getToggleAllPageRowsSelectedProps()}
                                />
                            </div>
                            :
                            <div>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: '0 24px 0 16px' }}
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
                            ? <div>
                                <Checkbox
                                    color="primary"
                                    style={{ padding: '0 24px 0 16px' }}
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
        }
    )

    const setFilters = (filters: any, page: number) => {
        setPagination(prev => {
            const pageIndex = !page ? prev.pageIndex : page;
            return { ...prev, filters, pageIndex: pageIndex, trigger: true }
        });
    };
    const setPageIndex = (page: number) => {
        setPagination(prev => ({ ...prev, pageIndex: page, trigger: true }));
    }
    const handleClickSort = (column: string) => {
        const newsorts: any = {
            ...pagination.sorts
        }

        let currentsort = "";

        if (newsorts[column] === "desc") {
            delete newsorts[column]
        } else {
            if (newsorts[column] === "asc")
                currentsort = "desc";
            else
                currentsort = "asc";
            newsorts[column] = currentsort
        }

        setPagination(prev => ({ ...prev, sorts: newsorts, trigger: true }))
    }

    const [dateRange, setdateRange] = useState<Range>({
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        key: 'selection'
    });

    const triggertmp = () => {
        fetchData && fetchData({
            ...pagination, pageSize, daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
            }
        });
    }

    useEffect(() => {
        if (pagination?.trigger) {
            triggertmp()
        } else {
            triggerSearch && triggertmp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, pagination, dateRange, triggerSearch])

    useEffect(() => {
        if (autoRefresh?.value) {
            triggertmp();
            autoRefresh?.callback(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRefresh])

    useEffect(() => {
        setSelectedRows && setSelectedRows(selectedRowIds)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowIds]);

    const exportData = () => {
        exportPersonalized && exportPersonalized({
            ...pagination,
            daterange: {
                startDate: dateRange.startDate ? new Date(dateRange.startDate.setHours(10)).toISOString().substring(0, 10) : null,
                endDate: dateRange.endDate ? new Date(dateRange.endDate.setHours(10)).toISOString().substring(0, 10) : null
            }
        })
    }

    return (
        <Box width={1}>
            {titlemodule && <div className={classes.title}>{titlemodule}</div>}
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center">
                <div className={classes.containerButtons}>
                    {filterrange && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <DateRangePicker
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
                                    {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                                </Button>
                                <Button
                                    disabled={loading}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                                    style={{ backgroundColor: '#55BD84', width: 120 }}
                                    onClick={() => {
                                        if (triggerSearch)
                                            triggertmp()
                                        setTriggerSearch(true)
                                    }}
                                >
                                    <Trans i18nKey={langKeys.search} />
                                </Button>
                            </DateRangePicker>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {ButtonsElement && <ButtonsElement />}
                        {importCSV && (
                            <>
                                <input
                                    name="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    id="laraigo-upload-csv-file"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => importCSV(e.target.files)}
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
                                // exportPersonalized
                                startIcon={<DownloadIcon />}
                            ><Trans i18nKey={langKeys.download} />
                            </Button>
                        )}
                    </div>
                </div>
            </Box>

            {HeadComponent && <HeadComponent />}

            <TableContainer style={{ position: "relative" }}>
                <Box overflow="auto">
                    <MaUTable {...getTableProps()} aria-label="enhanced table" size="small" aria-labelledby="tableTitle">
                        <TableHead>
                            {headerGroups.map((headerGroup) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
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
                                                        <Box
                                                            component="div"
                                                            {...column.getHeaderProps()}
                                                            onClick={() => !column.NoSort && handleClickSort(column.id)}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                wordWrap: 'break-word',
                                                                cursor: 'pointer',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            {column.render('Header')}
                                                            {pagination.sorts[column.id]
                                                                && (pagination.sorts[column.id] === "asc"
                                                                    ? <ArrowUpwardIcon className={classes.iconOrder} color="action" />
                                                                    : <ArrowDownwardIcon className={classes.iconOrder} color="action" />)
                                                            }
                                                        </Box>
                                                        {!column.NoFilter &&
                                                            <DefaultColumnFilter
                                                                header={column.id}
                                                                type={column.type}
                                                                firstvalue={data && data.length > 0 ? data[0][column.id] : null}
                                                                filters={pagination.filters}
                                                                setFilters={setFilters}
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
                                    return (
                                        <TableRow
                                            {...row.getRowProps()}
                                            hover
                                            style={{ cursor: onClickRow ? 'pointer' : 'default' }}
                                        >
                                            {row.cells.map((cell: any, i: number) =>
                                                <TableCell
                                                    {...cell.getCellProps({
                                                        style: {
                                                            minWidth: cell.column.minWidth,
                                                            width: cell.column.width,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        },
                                                    })}
                                                    onClick={() => cell.column.id !== "selection" ? onClickRow && onClickRow(row.original) : null}
                                                >
                                                    {cell.render('Cell')}
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
                        <IconButton onClick={() => setPageIndex(0)} disabled={!canPreviousPage} >
                            <FirstPage />
                        </IconButton>
                        <IconButton onClick={() => setPageIndex(pagination.pageIndex - 1)} disabled={!canPreviousPage} >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton onClick={() => setPageIndex(pagination.pageIndex + 1)} disabled={!canNextPage} >
                            <NavigateNext />
                        </IconButton>
                        <IconButton onClick={() => setPageIndex(pageCount - 1)} disabled={!canNextPage} >
                            <LastPage />
                        </IconButton>
                        <Box component="span" fontSize={14}>
                            <Trans
                                i18nKey={langKeys.tablePageOf}
                                values={{ currentPage: pageIndex + 1, totalPages: pageOptions.length }}
                                components={[<Box fontWeight="700" component="span"></Box>, <Box fontWeight="700" component="span"></Box>]}
                            />
                        </Box >

                    </Box>
                    <Box>
                        <Trans
                            i18nKey={langKeys.tableShowingRecordOf}
                            values={{ itemCount: page.length, totalItems: totalrow }}
                        />
                    </Box>
                    <Box>
                        <Select
                            disableUnderline
                            style={{ display: 'inline-flex' }}
                            value={pageSize}
                            onChange={e => {
                                setPageSize(Number(e.target.value))
                            }}
                        >
                            {[10, 20, 50, 100].map(pageSize => (
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
            </TableContainer>
        </Box>
    )
})

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