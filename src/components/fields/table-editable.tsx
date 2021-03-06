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
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Dictionary, TableConfig } from '@types'
import { OnlyCheckbox, SearchField } from 'components';
import { DownloadIcon } from 'icons';

import {
    useTable,
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
} from 'react-table'
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Skeleton } from '@material-ui/lab';
import { TextField } from '@material-ui/core';


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

export const stringOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'contains', value: 'contains' },
    { key: 'notcontains', value: 'notcontains' },
    { key: 'isempty', value: 'isempty' },
    { key: 'isnotempty', value: 'isnotempty' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];

export const numberOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'greater', value: 'greater' },
    { key: 'greaterorequals', value: 'greaterorequals' },
    { key: 'less', value: 'less' },
    { key: 'lessorequals', value: 'lessorequals' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];

export const dateOptionsMenu = [
    { key: 'equals', value: 'equals' },
    { key: 'notequals', value: 'notequals' },
    { key: 'after', value: 'after' },
    { key: 'afterequals', value: 'afterequals' },
    { key: 'before', value: 'before' },
    { key: 'beforeequals', value: 'beforeequals' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];

export const booleanOptionsMenu = [
    { key: 'all', value: 'all' },
    { key: 'istrue', value: 'istrue' },
    { key: 'isfalse', value: 'isfalse' },
    { key: 'isnull', value: 'isnull' },
    { key: 'isnotnull', value: 'isnotnull' },
];

const TableZyxEditable = React.memo(({
    columns,
    titlemodule,
    fetchData,
    data,
    download = true,
    register,
    handleRegister,
    HeadComponent,
    pageSizeDefault = 20,
    hoverShadow = false,
    filterGeneral = true,
    loading = false,
    updateMyData,
    skipAutoReset = false,
}: TableConfig) => {
    const classes = useStyles();
    const isBigScreen = useMediaQuery((theme: any) => theme.breakpoints.up('sm'));

    const DefaultColumnFilter = (
    {
        column: { id: columnid, setFilter, type = "string" },
        page,
    }: any
    ) => {
        const { t } = useTranslation();
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
        useEffect(() => {
            switch (type) {
                case "number": case "date":
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
            page.map((p: Dictionary) => updateMyData && updateMyData(p.index, columnid, value));
        };

        const optionsMenu = (type: string) => {
            switch (type) {
                case "number":
                    return (
                        numberOptionsMenu.map((option) => (
                            <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                                {t(option.value)}
                            </MenuItem>
                        ))
                    )
                case "date":
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

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {type === 'boolean' ?
                <React.Fragment>
                    <OnlyCheckbox
                        label=""
                        valueDefault={allBoolean}
                        onChange={(value) => {
                            setColumnBoolean(value, columnid);
                        }}
                    />
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
                </React.Fragment>
                :
                <React.Fragment>
                    <Input
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon color="action" fontSize="small" />
                            </InputAdornment>
                        }
                        disabled={loading}
                        type="text"
                        style={{ fontSize: '15px', minWidth: '100px' }}
                        fullWidth
                        value={value}
                        onKeyDown={keyPress}
                        onChange={e => {
                            setValue(e.target.value || '');
                        }}
                    />
                    <div style={{ width: '12px' }} />
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
                        {optionsMenu(type)}
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
        updateMyData, // This is a custom function that we supplied to our table instance
    }: {
        value: any,
        row: any,
        column: any,
        updateMyData: (index: number, id: any, value: any) => void
    }) => {
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = React.useState(initialValue)
        
        const onChange = (e: any) => {
            setValue(e.target.value)
        }
        
        // We'll only update the external data when the input is blurred
        const onBlur = () => {
            updateMyData(row.index, column.id, value)
        }

        const onChecked = (value: any) => {
            updateMyData(row.index, column.id, value)
        }

        const onBlurColor = () => {
            const rex = new RegExp(/#[0-9A-Fa-f]{6}/, 'g');
            if (rex.test(value)) {
                setColorValue(value)
                updateMyData(row.index, column.id, value)
            }
            else {
                setColorValue('#000000')
                updateMyData(row.index, column.id, '#000000')
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
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputProps={{ min: 0, step: 1 }}
                    />
                case 'boolean':
                    return <OnlyCheckbox
                        label=""
                        valueDefault={value}
                        onChange={(value) => onChecked(value)}
                    />
                default:
                    return <TextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
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
            if (cellvalue === null) {
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
                case "date":
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
        updateMyData
    },
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

            <TableContainer style={{ position: "relative" }}>
                <Box overflow="auto" style={{height: 'calc(100vh - 365px)'}}>
                    <Table stickyHeader size={isBigScreen ? "medium" : "small"} {...getTableProps()} aria-label="enhanced table" aria-labelledby="tableTitle">
                        <TableHead>
                            {headerGroups.map((headerGroup) => (
                                <TableRow {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column, ii) => (
                                        column.activeOnHover ?
                                            <th style={{ width: "0px" }} key="header-floating"></th> :
                                            <TableCell key={ii}>
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
                        <TableBody {...getTableBodyProps()} style={{ backgroundColor: 'white' }}>
                            {loading ?
                                <LoadingSkeleton columns={headerGroups[0].headers.length} /> :
                                page.map(row => {
                                    prepareRow(row);
                                    return (
                                        <TableRow
                                            {...row.getRowProps()}
                                            hover
                                        >
                                            {row.cells.map((cell, i) =>
                                                <TableCell
                                                    {...cell.getCellProps({
                                                        style: { minWidth: cell.column.minWidth, width: cell.column.width },
                                                    })}
                                                >
                                                    {headerGroups[0].headers[i].isComponent ?
                                                        cell.render('Cell')
                                                        :
                                                        (cell.value?.length > 100 ?
                                                            <Tooltip TransitionComponent={Zoom} title={cell.value}>
                                                                <Box m={0} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" width={200}>
                                                                    {cell.render('Cell')}
                                                                </Box>
                                                            </Tooltip>
                                                            :
                                                            <Box m={0} overflow="hidden" textOverflow="ellipsis" width={1}>
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

export default TableZyxEditable;

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