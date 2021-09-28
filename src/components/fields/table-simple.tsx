import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Menu from '@material-ui/core/Menu';
import { exportExcel } from 'common/helpers';
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
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import BackupIcon from '@material-ui/icons/Backup';
import { TableConfig } from '@types'
import { SearchField } from 'components';
import { DownloadIcon } from 'icons';
import { optionsMenu } from './table-paginated';
import Checkbox from '@material-ui/core/Checkbox';
import {
    useTable,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
} from 'react-table'
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Skeleton } from '@material-ui/lab';
import { FixedSizeList } from 'react-window';

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
        padding: `${theme.spacing(2)}px`,
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
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    containerButtons: {
        gridGap: theme.spacing(1),
        display: 'grid',
        gridAutoFlow: 'column',
    },
    containerHeader: {
        display: 'block',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    }
}));

const TableZyx = React.memo(({
    columns,
    titlemodule,
    fetchData,
    data,
    download = true,
    register,
    handleRegister,
    HeadComponent,
    ButtonsElement,
    pageSizeDefault = 20,
    importCSV,
    filterGeneral = true,
    loading = false,
    useSelection,
    selectionKey,
    initialSelectedRows,
    setSelectedRows,
    allRowsSelected,
    setAllRowsSelected
}: TableConfig) => {
    const classes = useStyles();

    const SelectColumnFilter = ({
        column: { setFilter, type },
    }: any) => {
        const [value, setValue] = useState('');
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const [operator, setoperator] = useState("contains");
        const handleCloseMenu = () => {
            setAnchorEl(null);
        };
        const handleClickItemMenu = (op: any) => {
            setAnchorEl(null);
            setoperator(op)
        };
        const handleClickMenu = (event: any) => {
            setAnchorEl(event.currentTarget);
        };

        const keyPress = React.useCallback((e) => {
            if (e.keyCode === 13) {
                setFilter({ value, operator, type });
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value])

        useEffect(() => {
            if (type === "number")
                setoperator("equals");
        }, [type]);

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Input
                    disabled={loading}
                    type={type === "number" ? "number" : "text"}
                    style={{ fontSize: '15px', minWidth: '100px' }}
                    fullWidth

                    value={value}
                    onKeyDown={keyPress}
                    onChange={e => {
                        setValue(e.target.value || '');
                    }}
                />
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
                    {type === "number" ?
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
        );
    }

    const filterCellValue = React.useCallback((rows, id, filterValue) => {
        const { value, operator, type } = filterValue;

        return rows.filter((row: any) => {
            const cellvalue = row.values[id];
            if (cellvalue === null || cellvalue === undefined)
                return false;
            if (type === "number") {
                switch (operator) {
                    case 'greater':
                        return cellvalue > value;
                    case 'greaterequal':
                        return cellvalue >= value;
                    case 'smaller':
                        return cellvalue < value;
                    case 'smallerequal':
                        return cellvalue <= value;
                    case 'noequals':
                        return cellvalue !== value;
                    case 'equals':
                    default:
                        return cellvalue === value;
                }
            } else {
                switch (operator) {
                    case 'equals':
                        return (cellvalue + "") === value;
                    case 'noequals':
                        return (cellvalue + "") !== value;
                    case 'nocontains':
                        return !(cellvalue + "").toLowerCase().includes(value.toLowerCase());
                    case 'empty':
                        return cellvalue === '' || cellvalue == null;
                    case 'noempty':
                        return cellvalue !== '' && cellvalue != null;
                    case 'contains':
                    default:
                        return (cellvalue + "").toLowerCase().includes(value.toLowerCase());
                }
            }
        });
    }, []);

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: (props: any) => SelectColumnFilter({ ...props, data }),
            filter: filterCellValue,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

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
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        preGlobalFilteredRows,
        setGlobalFilter,
        state: { pageIndex, pageSize, selectedRowIds },
        toggleAllRowsSelected
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: pageSizeDefault, selectedRowIds: initialSelectedRows || {} },
        defaultColumn,
        getRowId: (row, relativeIndex: any, parent: any) => selectionKey
            ? (parent ? [row[selectionKey], parent].join('.') : row[selectionKey])
            : (parent ? [parent.id, relativeIndex].join('.') : relativeIndex),
    },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            useSelection && hooks.visibleColumns.push(columns => [
                {
                    id: 'selection',
                    width: 80,
                    Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
                        <div>
                            <Checkbox
                                {...getToggleAllPageRowsSelectedProps()}
                            />
                        </div>
                    ),
                    Cell: ({ row }: any) => (
                        <div>
                            <Checkbox
                                checked={row.isSelected}
                                onChange={(e) => row.toggleRowSelected()}
                            />
                        </div>
                    ),
                    NoFilter: true,
                } as any,
                ...columns,
            ])
        }
    )

    useEffect(() => {
        let next = true;
        if (fetchData && next) {
            fetchData();
        }
    }, [fetchData])

    useEffect(() => {
        setSelectedRows && setSelectedRows(selectedRowIds)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRowIds]);

    useEffect(() => {
        if (allRowsSelected) {
            toggleAllRowsSelected(true);
            setAllRowsSelected && setAllRowsSelected(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allRowsSelected])

    const RenderRow = React.useCallback(
        ({ index, style }) => {
            style = { ...style, display: 'flex' }
            const row = page[index]
            prepareRow(row);
            return (
                <TableRow
                    component="div"
                    {...row.getRowProps({ style })}
                    hover
                >
                    {row.cells.map((cell, i) =>
                        <TableCell
                            component="div"
                            {...cell.getCellProps({
                                style: {
                                    minWidth: cell.column.minWidth,
                                    width: cell.column.width,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                            })}
                        >
                            {headerGroups[0].headers[i].isComponent ?
                                cell.render('Cell')
                                :
                                (cell.value?.length > 50 ?
                                    <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                        <div style={{ width: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {cell.render('Cell')}
                                        </div>
                                    </Tooltip>
                                    :
                                    cell.render('Cell')
                                )
                            }
                        </TableCell>
                    )}
                </TableRow>
            )
        },
        [headerGroups, prepareRow, page]
    )

    return (
        <Box width={1} >
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                {titlemodule ? <span className={classes.title}>{titlemodule}</span> : <span></span>}
                <span className={classes.containerButtons}>
                    {fetchData && (
                        <Tooltip title="Refrescar">
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
                            onClick={() => exportExcel(String(titlemodule) + "Report", data, columns.filter((x: any) => (!x.isComponent && !x.activeOnHover)))}
                            startIcon={<DownloadIcon />}
                        ><Trans i18nKey={langKeys.download} />
                        </Button>
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
                            handleChangeOther={setGlobalFilter}
                            lazy
                        />
                    </div>
                </Box>
            )}

            {HeadComponent && <HeadComponent />}

            <TableContainer component="div" style={{ position: "relative" }}>
                <Box overflow="auto" >
                    <Table component="div" size="small" {...getTableProps()} aria-label="enhanced table" aria-labelledby="tableTitle">
                        <TableHead component="div" style={{ display: useSelection ? 'flex' : 'table-header-group' }}>
                            {headerGroups.map((headerGroup) => (
                                <TableRow component="div" {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            <th style={{ width: "0px" }} key="header-floating"></th> :
                                            <TableCell component="div" key={ii} style={useSelection ? { minWidth: `${column.width}px`, maxWidth: `${column.width}px` } : {}}>
                                                {column.isComponent ?
                                                    column.render('Header') :
                                                    (<>
                                                        <Box
                                                            component="div"
                                                            {...column.getHeaderProps(column.getSortByToggleProps({ title: 'ordenar' }))}
                                                            style={{
                                                                whiteSpace: 'nowrap',
                                                                wordWrap: 'break-word',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {column.render('Header')}
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ?
                                                                    <ArrowDownwardIcon className={classes.iconOrder} color="action" />
                                                                    :
                                                                    <ArrowUpwardIcon className={classes.iconOrder} color="action" />
                                                            )
                                                                :
                                                                null
                                                            }
                                                        </Box>
                                                        <div>{!column.NoFilter && column.render('Filter')}</div>
                                                    </>)
                                                }
                                            </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody
                            component="div"
                            {...getTableBodyProps()}
                            style={{ backgroundColor: 'white' }}
                        >
                            {loading ?
                                <LoadingSkeleton columns={headerGroups[0].headers.length} /> :
                                useSelection ?
                                    <FixedSizeList
                                        style={{ overflowX: 'hidden' }}
                                        direction="vertical"
                                        width="auto"
                                        height={window.innerHeight - 470}
                                        itemCount={page.length}
                                        itemSize={43}
                                    >
                                        {RenderRow}
                                    </FixedSizeList>
                                    :
                                    page.map(row => {
                                        prepareRow(row);
                                        return (
                                            <TableRow
                                                component="div"
                                                {...row.getRowProps()}
                                                hover
                                            >
                                                {row.cells.map((cell, i) =>
                                                    <TableCell
                                                        component="div"
                                                        {...cell.getCellProps({
                                                            style: {
                                                                minWidth: cell.column.minWidth,
                                                                width: cell.column.width,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                            },
                                                        })}
                                                    >
                                                        {headerGroups[0].headers[i].isComponent ?
                                                            cell.render('Cell')
                                                            :
                                                            (cell.value?.length > 50 ?
                                                                <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                                                    <div style={{ width: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        {cell.render('Cell')}
                                                                    </div>
                                                                </Tooltip>
                                                                :
                                                                cell.render('Cell')
                                                            )
                                                        }
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    })
                            }
                        </TableBody>
                    </Table>
                </Box>
                <Box className={classes.footerTable}>
                    <Box>
                        <IconButton
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage || loading}
                        >
                            <FirstPage />
                        </IconButton>
                        <IconButton
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage || loading}
                        >
                            <NavigateBefore />
                        </IconButton>
                        <IconButton
                            onClick={() => nextPage()}
                            disabled={!canNextPage || loading}
                        >
                            <NavigateNext />
                        </IconButton>
                        <IconButton
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage || loading}
                        >
                            <LastPage />
                        </IconButton>
                        <Box component="span" fontSize={14}>
                            <Trans
                                i18nKey={langKeys.tablePageOf}
                                values={{ currentPage: pageIndex + 1, totalPages: pageOptions.length }}
                                components={[<Box fontWeight="700" component="span"></Box>, <Box fontWeight="700" component="span"></Box>]}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Trans
                            i18nKey={langKeys.tableShowingRecordOf}
                            values={{ itemCount: page.length, totalItems: preGlobalFilteredRows.length }}
                        />
                    </Box>
                    <Box>
                        <Select
                            disableUnderline
                            style={{ display: 'inline-flex' }}
                            value={pageSize}
                            disabled={loading}
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
});

export default TableZyx;

const LoadingSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < columns; i++) {
        items.push(<TableCell component="div" key={`table-simple-skeleton-${i}`}><Skeleton /></TableCell>);
    }
    return (
        <>
            <TableRow component="div" key="1aux1">
                {items}
            </TableRow>
            <TableRow component="div" key="2aux2">
                {items}
            </TableRow>
        </>
    );
};