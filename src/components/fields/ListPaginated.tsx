import React, { FC } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Box, Select, MenuItem, Theme, List } from '@material-ui/core';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { FirstPage, LastPage, NavigateBefore, NavigateNext } from '@material-ui/icons';

interface PaginatedListProps<T> {
    builder: (item: T, index: number) => React.ReactNode;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    skeleton?: (index: number) => React.ReactNode;
    data: T[];
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
}));

const useNoDataStyles = makeStyles(theme => ({
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
}));

const NoData: FC = () => {
    const classes = useNoDataStyles();

    return (
        <Box width={1} className={classes.noDataRoot}>
            <img src="/no_data.png" alt="No Data" />
            <div style={{ height: 18 }} />
            <label className={classes.label}>No data</label>
        </Box>
    );
}

function PaginatedList<T>(props: PaginatedListProps<T>): JSX.Element {
    const {
        data,
        builder,
        loading = false,
        pageSize,
        totalItems,
        currentPage,
        onPageChange,
        onPageSizeChange,
        pageSizeOptions = [10, 20, 50, 100],
        skeleton,
    } = props;
    const classes = useStyles();
    const pageCount = totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize); // total pages
    const canPreviousPage = currentPage > 0;
    const canNextPage = currentPage < pageCount - 1;

    console.assert(data.length <= pageSize, "PaginatedList: la propiedad 'data' tiene más elementos de lo especificado en 'pageSize'");
    
    const skeletonData = (): React.ReactNode[] => {
        const data: React.ReactNode[] = [];
        for (let i = 0; i < 3; i++) data.push(skeleton?.(i));
        return data;
    };

    if (!loading && totalItems === 0) return <NoData />;

    return (
        <Box width={1} style={{ height: '100%' }}>
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
                        values={{ itemCount: pageSize, totalItems }}
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
