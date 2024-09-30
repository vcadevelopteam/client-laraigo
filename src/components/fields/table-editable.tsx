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

import { Dictionary, TableConfig } from '@types'
import { SearchField } from 'components';
import { OnlyCheckbox } from 'components/fields/templates';
import { DownloadIcon } from 'icons';

import {
    useTable,
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
} from 'react-table'
import { FixedSizeList } from 'react-window';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Skeleton } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
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
        padding: theme.spacing(2),
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

const TableZyxEditable = React.memo(({
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
    filterGeneral = true,
    loading = false,
    updateCell,
    updateColumn,
    skipAutoReset = false,
}: TableConfig) => {
    const classes = useStyles();

    const DefaultColumnFilter = (
    {
        column: { id: columnid, setFilter, type = "string" },
        page,
    }: any
    ) => {
        const [value, setValue] = useState<any>('');
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const [operator, setoperator] = useState<string>('contains');
        
        const handleCloseMenu = () => {
            setAnchorEl(null);
        };
        const handleClickItemMenu = (operator: any) => {
            setAnchorEl(null);
            setoperator(operator)
            if (type === 'boolean') {
                setValue(operator);
            }
            setFilter({ value, operator, type });
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
        }, [type]);

        const [allBoolean, setAllBoolean] = useState<any>(false);
        const hasFalse = page.map((p: Dictionary) => p.values[columnid]).includes(false);
        const effectBoolean = hasFalse && type === 'boolean';
        
        useEffect(() => {
            setAllBoolean(!effectBoolean);
        }, [effectBoolean]);

        const setColumnBoolean = (value: boolean, columnid: string) => {
            updateColumn && updateColumn(page.map((p: Dictionary) => p.index), columnid, value);
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {type === 'boolean' ?
                <React.Fragment>
                    <OnlyCheckbox
                        label=""
                        valueDefault={allBoolean}
                        disabled={loading}
                        onChange={(value) => {
                            setColumnBoolean(value, columnid);
                        }}
                    />
                    {BooleanOptionsMenuComponent(value, handleClickItemMenu)}
                </React.Fragment>
                :
                <React.Fragment>
                    {type === 'date' && DateOptionsMenuComponent(value, handleDate)}
                    {type === 'time' && TimeOptionsMenuComponent(value, handleTime)}
                    {!['date','time'].includes(type) &&
                    <Input
                        // disabled={loading}
                        type={type === 'color' ? 'text' : type}
                        style={{ fontSize: '15px', minWidth: '100px' }}
                        fullWidth
                        value={value}
                        onKeyDown={keyPress}
                        onChange={e => {
                            setValue(e.target.value || '');
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
                        {OptionsMenuComponent(type, operator, handleClickItemMenu)}
                    </Menu>
                </React.Fragment>
                }
            </div>
        );
    }

    // Create an editable cell renderer
    const EditableCell = ({
        value: initialValue,
        row,
        column,
        updateCell, // This is a custom function that we supplied to our table instance
    }: {
        value: any,
        row: any,
        column: any,
        updateCell: (index: number, id: any, value: any) => void
    }) => {
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState(initialValue)
        
        const onChange = (e: any) => {
            setValue(e.target.value)
        }
        
        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            updateCell(row.index, column.id, value)
        }

        const onChecked = (value: any) => {
            updateCell(row.index, column.id, value)
        }

        const onBlurColor = () => {
            const rex = new RegExp(/#[0-9A-Fa-f]{6}/, 'g');
            if (rex.test(value)) {
                setColorValue(value)
                updateCell(row.index, column.id, value)
            }
            else {
                setColorValue('#000000')
                updateCell(row.index, column.id, '#000000')
            }
        }

        const [colorValue, setColorValue] = React.useState<any>(initialValue)

        // If the initialValue is changed external, sync it up with our state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        if (column.editable) {
            switch (column.type) {
                case 'color':
                    return (
                        <div style={{display: 'flex'}}>
                            <TextField
                                style={{flex: 1}}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlurColor}
                                inputProps={{ style: {fontSize: '14px'} }}
                            >
                            </TextField>
                            <div
                                style={{flexGrow: 0}}
                                onBlur={() => {onChecked(colorValue)}}
                            >
                                <input
                                    type="color"
                                    value={colorValue}
                                    style={{border: 'none', background: 'transparent'}}
                                    onChange={(e) => setColorValue(e.target.value)}
                                />
                            </div>
                        </div>
                    )
                case 'number':
                    return <TextField
                        type="number"
                        style={{fontSize: '14px'}}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputProps={{ style: {fontSize: '14px'}, min: 0, step: 1 }}
                    />
                case 'boolean':
                    return <OnlyCheckbox
                        style={{ width: '100%', textAlign: 'center' }}    
                        label=""
                        valueDefault={value}
                        onChange={(value) => onChecked(value)}
                    />
                default:
                    return <TextField
                        fullWidth
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputProps={{ style: {fontSize: '14px'} }}
                    >
                    </TextField>
            }
        }
        else {
            return (value?.length > 100 ?
                <Tooltip TransitionComponent={Zoom} title={value}>
                    <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={200}>
                        {value}
                    </Box>
                </Tooltip>
                :
                <Box m={0} overflow="hidden" textOverflow="ellipsis" width={1}>
                    {value}
                </Box>
            )
        }
    }

    const filterCellValue = React.useCallback((rows, id, filterValue) => {
        const { value, operator, type } = filterValue;
        
        return rows.filter((row: any) => {
            const cellvalue = row.values[id];
            if (cellvalue === null || cellvalue === undefined) {
                return false;
            }
            if (!(['isempty','isnotempty','isnull','isnotnull'].includes(operator) || type === 'boolean')
                && (value || '') === '')
                return true;
            switch (type) {
                case "number":
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'notequals':
                            return cellvalue !== Number(value);
                        case 'equals':
                        default:
                            return cellvalue === Number(value);
                    }
                case "date": case "datetime-local":
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'notequals':
                            return cellvalue !== value;
                        case 'equals':
                        default:
                            return cellvalue === value;
                    }
                case "boolean":
                    switch (operator) {
                        case 'istrue':
                            return typeof(cellvalue) === 'string' ? cellvalue === 'true' : cellvalue === true;
                        case 'isfalse':
                            return typeof(cellvalue) === 'string' ? cellvalue === 'false' : cellvalue === false;
                        case 'isnull':
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'all':
                        default:
                            return true;
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
                            return cellvalue == null;
                        case 'isnotnull':
                            return cellvalue != null;
                        case 'notcontains':
                            return !cellvalue.toLowerCase().includes(value.toLowerCase());
                        case 'contains':
                        default:
                            return cellvalue.toLowerCase().includes(value.toLowerCase());
                    }
            }
        });
    }, []);

    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: (props: any) => DefaultColumnFilter({ ...props, data }),
            filter: filterCellValue,
            Cell: EditableCell
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
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: pageSizeDefault },
        defaultColumn,
        autoResetFilters: !skipAutoReset,
        autoResetGlobalFilter: !skipAutoReset,
        autoResetSortBy: !skipAutoReset,
        autoResetPage: !skipAutoReset,
        autoResetRowState: !skipAutoReset,
        updateCell,
        updateColumn
    },
        useFlexLayout,    
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    )

    // const currentPage = React.useRef(pageIndex + 1);
    // const totalPages = React.useRef(pageOptions.length);

    useEffect(() => {
        let next = true;
        if (fetchData && next) {
            fetchData();
        }
    }, [fetchData])

    const RenderRow = React.useCallback(
        ({ index, style }) => {
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
                                    maxWidth: cell.column.maxWidth,
                                },
                            })}
                        >
                            {headerGroups[0].headers[i].isComponent ?
                                cell.render('Cell')
                                :
                                (cell.value?.length > 20 ?
                                    <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {cell.render('Cell')}
                                        </div>
                                    </Tooltip>
                                    :
                                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {cell.render('Cell')}
                                    </div>
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
        <Box width={1} style={{ height: '100%' }}>
            <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb="30px">
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
                    {typeof ButtonsElement === 'function' ? (
                        (<ButtonsElement />)
                        ) : (
                        ButtonsElement
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
                <Box overflow="auto" style={{height: 'calc(100vh - 365px)', overflowY: 'hidden'}}>
                    <Table component="div" stickyHeader size="small" {...getTableProps()} aria-label="enhanced table" aria-labelledby="tableTitle">
                        <TableHead component="div">
                            {headerGroups.map((headerGroup) => (
                                <TableRow component="div" {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            <th style={{ width: "0px" }} key="header-floating"></th> :
                                            <TableCell component="div" key={ii} style={{flex: `${column.width} 0 auto`, minWidth: 0, width: `${column.width}px`, maxWidth: `${column.maxWidth}px`}}>
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
                            <LoadingSkeleton columns={headerGroups[0].headers.length} />
                            :    
                            <FixedSizeList
                                style={{overflowX: 'hidden'}}
                                direction="vertical"
                                width="auto"
                                height={window.innerHeight - 470}
                                itemCount={page.length}
                                itemSize={43}
                                >
                                {RenderRow}
                            </FixedSizeList>
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
                            i18nKey={(preGlobalFilteredRows || []).length === 100000 ? langKeys.tableShowingRecordOfMore : langKeys.tableShowingRecordOf}
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
            </TableContainer>
        </Box>
    )
});

export default TableZyxEditable;

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
            <TableRow component="div" key="3aux3">
                {items}
            </TableRow>
            <TableRow component="div" key="4aux4">
                {items}
            </TableRow>
            <TableRow component="div" key="5aux5">
                {items}
            </TableRow>
        </>
    );
};