import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Box, Select, MenuItem, Theme, List } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from '@material-ui/icons';
import Input from '@material-ui/core/Input';
import { Dictionary } from '@types';
import { SearchField } from 'components';

interface IColumns {
    Header: string;
    accessor: string;
    filter?: boolean;
}
interface PaginatedListProps<T> {
    builder: (item: T, index: number) => React.ReactNode;
    onFilterChange?: (filter: any) => void;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    skeleton?: (index: number) => React.ReactNode;
    dateRange?: any;
    data: T[];
    columns: IColumns[];
    filterGeneral?: boolean;
    currentPage: number;
    pageSize: number;
    totalItems: number;
    loading?: boolean;
    pageSizeOptions?: number[];
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',
        width: '100%',
        overflowY: 'overlay' as any,
    },
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
    loading: {

    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: `${theme.spacing(2)}px`,
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
}));

/*const useNoDataStyles = makeStyles(theme => ({
    noDataRoot: {
        height: '100%',
        flexDirection: 'column',
        display: 'flex',
        padding: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        color: '#DDE0E6',
    }
}));*/

function PaginatedList<T>(props: PaginatedListProps<T>): JSX.Element {
    const {
        dateRange,
        data,
        builder,
        columns,
        filterGeneral = true,
        loading = false,
        pageSize,
        totalItems,
        currentPage,
        onFilterChange,
        onPageChange,
        onPageSizeChange,
        pageSizeOptions = [10, 20, 50, 100],
        skeleton,
    } = props;
    const classes = useStyles();
    const pageCount = totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize); // total pages
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < pageCount - 1;
    const [filters, setFilters] = useState<Dictionary>(columns.reduce((a, c) => ({...a, [c.accessor]: ''}), {}));

    console.assert(data.length <= pageSize, "PaginatedList: la propiedad 'data' tiene más elementos de lo especificado en 'pageSize'");
    
    const keyPress = (e: any) => {
        if (e.keyCode === 13) {
            onPageChange(0);
            onFilterChange && onFilterChange(
                Object.keys(filters).reduce((a: any, f: string) => ({
                    ...a,
                    [f]: {operator: 'contains', value: filters[f]}
                }), {})
            );
        }
    };

    const setGlobalFilter = (value: string) => {
        if (value === '') {
            setFilters({});
            onFilterChange && onFilterChange({});
        }
        else {
            setFilters(columns.reduce((a: any, c: IColumns) => ({
                ...a,
                [c.accessor]: value
            }), {}));
            onPageChange(0);
            onFilterChange && onFilterChange(
                columns.reduce((a: any, c: IColumns) => ({
                    ...a,
                    [c.accessor]: {operator: 'or', value: value}
                }), {})
            );
        }
    }

    const skeletonData = (): React.ReactNode[] => {
        const data: React.ReactNode[] = [];
        for (let i = 0; i < 3; i++) data.push(skeleton?.(i));
        return data;
    };

    useEffect(() => {
        setFilters({});
    }, [dateRange])

    // if (!loading && totalItems === 0) return <NoData />;

    return (
        <Box width={1} style={{ height: '100%' }}>
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
            <div style={{display: 'flex', gap: '20px'}}>
                {loading ? null : columns.map((c, i) => {
                    if (c.filter) {
                        return (
                        <div key={`filter_${i}`}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{c.Header}</Box>
                            <Input
                                value={filters[c.accessor] || ''}
                                onKeyDown={keyPress}
                                onChange={e => setFilters({...filters, [c.accessor]: e.target.value})}
                            />
                        </div>
                        )
                    }
                    else {
                        return null
                    }
                })}
            </div>
            <List>
                {loading && skeleton ? skeletonData() : data.map((e, i) => builder(e, i))}
            </List>
            <Box className={classes.footerTable}>
                <Box>
                    <IconButton
                        onClick={() => onPageChange(0)}
                        disabled={!canPreviousPage || loading}
                    >
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canPreviousPage || loading}
                    >
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canNextPage || loading}
                    >
                        <NavigateNext />
                    </IconButton>
                    <IconButton
                        onClick={() => onPageChange(pageCount - 1)}
                        disabled={!canNextPage || loading}
                    >
                        <LastPage />
                    </IconButton>
                    <Box component="span" fontSize={14}>
                        <Trans 
                            i18nKey={langKeys.tablePageOf}
                            values={{currentPage: currentPage + 1, totalPages: pageCount}}
                            components={[<Box fontWeight="700" component="span"></Box>, <Box fontWeight="700" component="span"></Box>]}
                        />
                    </Box>
                </Box>
                <Box>
                    <Trans
                        i18nKey={langKeys.tableShowingRecordOf}
                        values={{ itemCount: data.length, totalItems }}
                    />
                </Box>
                <Box>
                    <Select
                        disableUnderline
                        style={{ display: 'inline-flex' }}
                        value={pageSize}
                        disabled={loading}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                    >
                        {pageSizeOptions.map(pageSize => (
                            <MenuItem key={pageSize} value={pageSize}>
                                {pageSize}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box fontSize={14} display="inline" style={{ marginRight: '1rem' }}>
                        <Trans i18nKey={langKeys.recordPerPage} count={pageSize} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PaginatedList;
