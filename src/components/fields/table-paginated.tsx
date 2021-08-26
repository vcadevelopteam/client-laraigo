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
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { TableConfig, Pagination } from '@types'
// import ButtonExport from './buttonexport';

import clsx from 'clsx';

import { 
    FirstPage, 
    LastPage, 
    NavigateNext, 
    NavigateBefore,
    Search as SearchIcon,
    GetApp as GetAppIcon,
    // Refresh as RefreshIcon,
    ArrowDownward as ArrowDownwardIcon,
    ArrowUpward as ArrowUpwardIcon,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';

import RefreshIcon from "@material-ui/icons/Refresh";


import Menu from '@material-ui/core/Menu';

import {
    useTable,
    useFilters,
    useGlobalFilter,
    usePagination
} from 'react-table'
import { Range } from 'react-date-range';
import DateRange from './daterange';

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
    }
}));

export const optionsMenu = [
    { key: 'equals', value: 'Igual', type: 'string' },
    { key: 'noequals', value: 'No Igual', type: 'string' },
    { key: 'greater', value: 'Mayor que', type: 'onlynumber' },
    { key: 'greaterequal', value: 'Mayor igual', type: 'onlynumber' },
    { key: 'smaller', value: 'Menor que', type: 'onlynumber' },
    { key: 'smallerequal', value: 'Menor igual', type: 'onlynumber' },
    { key: 'contains', value: 'Contiene', type: 'onlystring' },
    { key: 'nocontains', value: 'No Contiene', type: 'onlystring' },
    { key: 'empty', value: 'Vacio', type: 'onlystring' },
    { key: 'noempty', value: 'Con valor', type: 'onlystring' },
];

const DefaultColumnFilter = ({ header, setFilters, filters, firstvalue }: any) => {
    const [value, setValue] = useState('');

    const [operator, setoperator] = useState("contains");

    useEffect(() => {
        if (typeof firstvalue === "number")
            setoperator("equals");
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

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClickMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickItemMenu = (op: any) => {
        setAnchorEl(null);
        setoperator(op)
    };

    useEffect(() => {
        if (Object.keys(filters).length === 0) setValue('');
    }, [filters]);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input
                style={{ fontSize: '15px', minWidth: '100px' }}
                type={typeof firstvalue === "number" ? "number" : "text"}
                fullWidth
                onKeyDown={keyPress}
                value={value}
                onChange={e => setValue(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                    </InputAdornment>
                }
            />
            <MoreVertIcon
                style={{ cursor: 'pointer' }}
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClickMenu}
                color="action"
                fontSize="small"
            />
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleCloseMenu}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {typeof firstvalue === "number" ?

                    optionsMenu.filter(x => x.type !== 'onlystring').map((option) => (
                        <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                            {option.value}
                        </MenuItem>
                    ))
                    :
                    optionsMenu.filter(x => x.type !== 'onlynumber').map((option) => (
                        <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                            {option.value}
                        </MenuItem>
                    ))}
            </Menu>
        </div>
    )
}

const TableZyx = React.memo(({
    columns,
    data,
    filterrange,
    totalrow,
    fetchData,
    pageCount: controlledPageCount,
    titlemodule,
    methodexport,
    exportPersonalized
}: TableConfig) => {
    const classes = useStyles();
    const [pagination, setPagination] = useState<Pagination>({ sorts: {}, filters: {}, pageIndex: 0 });
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
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 20 },
            manualPagination: true, // Tell the usePagination
            pageCount: controlledPageCount,
            useControlledState: (state: any) => {
                return useMemo(() => ({
                    ...state,
                    pageIndex: pagination.pageIndex,
                // eslint-disable-next-line react-hooks/exhaustive-deps
                }), [state, pagination.pageIndex])
            },
        },
        useFilters,
        useGlobalFilter,
        usePagination,
    )

    const setFilters = (filters: any, page: number) => {
        setPagination(prev => {
            const pageIndex = !page ? prev.pageIndex : page;
            return { ...prev, filters, pageIndex: pageIndex }
        });
    };
    const setPageIndex = (page: number) => {
        setPagination(prev => ({ ...prev, pageIndex: page }));
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

        setPagination(prev => ({ ...prev, sorts: newsorts }))
    }

    const handleRefresh = () => {
        setPagination({
            ...pagination,
            sorts: {},
            filters: {}
        });
    }

    const [dateRange, setdateRange] = useState<Range[]>([
        {
            startDate: new Date(new Date().setDate(0)),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
            key: 'selection'
        }
    ]);

    useEffect(() => {
        /*fetchData && fetchData({
            ...pagination, pageSize, daterange: {
                startDate: dateRange[0].startDate.toISOString().substring(0, 10),
                endDate: dateRange[0].endDate.toISOString().substring(0, 10)
            }
        });*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize, pagination, dateRange])

    return (
        <>
            <Box display="grid" gridGap="10px" mb={1}>
                <Typography variant="h6" style={{ marginRight: '1rem', gridRow: "1", gridColumn: "1" }} id="tableTitle" component="div" color="inherit">
                    {titlemodule}
                </Typography>
                {filterrange && (
                    <div style={{ gridRow: "2", gridColumn: "1" }}>
                        <DateRange
                            label="Filtrar Rango de Fecha"
                            dateRangeinit={dateRange}
                            setDateRangeExt={setdateRange}
                        />
                    </div>
                )}
                <div style={{ gridRow: "1 / 3", gridColumn: "2", textAlign: "right" }}>
                    <Fab
                        size="small"
                        aria-label="add"
                        color="primary"
                        onClick={() => handleRefresh()}
                    >
                        <RefreshIcon />
                    </Fab>
                    {exportPersonalized &&
                        <Fab
                            style={{marginLeft: '1rem'}}
                            size="small"
                            aria-label="add"
                            color="primary"
                            onClick={exportPersonalized}
                        >
                            <GetAppIcon />
                        </Fab>
                    }
                    {/* {methodexport && (
                         <ButtonExport
                             fileName={titlemodule}
                             datatosend={{ method: methodexport, data: { ...pagination, origin: titlemodule.toLowerCase(), daterange: dateRange[0], offset: (new Date().getTimezoneOffset() / 60) * -1 } }}
                         />
                    )} */}
                </div>
            </Box>

            <TableContainer style={{ position: "relative" }}>
                <Box overflow="auto">
                    <MaUTable width="90%" {...getTableProps()} aria-label="enhanced table" size="small" aria-labelledby="tableTitle">
                        <TableHead>
                            {headerGroups.map((headerGroup, index) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            <th style={{width: "0px"}} key="header-floating"></th> :
                                            <TableCell
                                                key={ii}
                                            >
                                                {column.isComponent ?
                                                    column.render('Header')
                                                    :
                                                    (
                                                        <>
                                                            <Box
                                                                component="div"
                                                                {...column.getHeaderProps()}
                                                                onClick={() => handleClickSort(column.id)}
                                                                style={{
                                                                    whiteSpace: 'nowrap',
                                                                    wordWrap: 'break-word',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                {column.render('Header')}
                                                                {pagination.sorts[column.id]
                                                                    ? pagination.sorts[column.id] === "asc"
                                                                        ? <ArrowDownwardIcon />
                                                                        : <ArrowUpwardIcon />
                                                                    : ''}
                                                            </Box>
                                                            {!column.NoFilter &&
                                                                <DefaultColumnFilter
                                                                    header={column.id}
                                                                    firstvalue={data && data.length > 0 ? data[0][column.id] : null}
                                                                    filters={pagination.filters}
                                                                    setFilters={setFilters}
                                                                />
                                                            }
                                                        </>
                                                    )
                                                }
                                            </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody {...getTableBodyProps()}>
                            {page.map((row: any) => {
                                prepareRow(row);
                                return (
                                    <TableRow {...row.getRowProps()} className={classes.trdynamic}>
                                        {row.cells.map((cell: any, i: number) =>
                                            <TableCell
                                                {...cell.getCellProps()}
                                                align={typeof cell.value === "number" ? "right" : "left"}
                                                className={clsx({
                                                    [classes.containerfloat]: headerGroups[0].headers[i].activeOnHover
                                                })}
                                            >
                                                {headerGroups[0].headers[i].isComponent ?
                                                    <Box m={0} width={1} whiteSpace="nowrap">
                                                        {cell.render('Cell')}
                                                    </Box>
                                                    :
                                                    (cell.value?.length > 100 ?
                                                        <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                                            <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={400}>
                                                                {cell.render('Cell')}
                                                            </Box>
                                                        </Tooltip>
                                                        :
                                                        <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={1}>
                                                            {cell.render('Cell')}
                                                        </Box>
                                                    )
                                                }
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
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
                            Página <Box fontWeight="700" component="span">{pageIndex + 1}</Box> de <Box fontWeight="700" component="span">{pageOptions.length}</Box>
                        </Box >

                    </Box>
                    <Box>
                        Mostrando {page.length} registros de {totalrow}
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
                            Registros por Página
                        </Box>
                    </Box>
                </Box>
            </TableContainer>
        </>
    )
})

export default TableZyx;