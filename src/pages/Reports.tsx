/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useMemo, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TablePaginated from 'components/fields/table-paginated';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { TemplateBreadcrumbs, SearchField, FieldSelect, FieldMultiSelect } from 'components';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData, MultiData, IRequestBody } from "@types";
import { getReportSel, getReportColumnSel, getReportFilterSel, getPaginatedForReports, getReportExport } from 'common/helpers';
import { getCollection, resetMain, getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { reportsImage } from '../icons/index';
import AssessorProductivity from 'components/report/AssessorProductivity';

import { SkeletonReport } from 'components';

interface ItemProps {
    setViewSelected: (view: string) => void;
    setSearchValue: (searchValue: string) => void;
    row: Dictionary | null;
    multiData: MultiData[];
    allFilters: Dictionary[];
    customReport: boolean;
}

const arrayBread = [
    { id: "view-1", name: "Reports" },
    { id: "view-2", name: "Reports detail" }
];

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },
    media: {
        objectFit: "none"
    },
    containerSearch: {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
    },
    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '220px'
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(2),
    },
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        fontWeight: 'bold',
        height: '48px',
        color: theme.palette.text.primary,
    },
    containerHeader: {
        display: 'block',
        marginBottom: 0,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    mb2: {
        marginBottom: theme.spacing(4),
    }
}));

const ReportItem: React.FC<ItemProps> = ({ setViewSelected, setSearchValue, row, multiData, allFilters, customReport }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const reportColumns = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })
    const columns = React.useMemo(() => [{ Header: 'null', accessor: 'null' }], []);
    const [allParameters, setAllParameters] = useState({});

    if (multiData.length > 0) {
        reportColumns.map(x => (
            columns.push({ Header: t('report_' + row?.origin + '_' + x.proargnames || ''), accessor: x.proargnames })
        )
        );
        columns.shift();
    }

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getReportExport(
            row?.methodexport || '',
            row?.origin || '',
            {
                filters,
                sorts,
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                ...allParameters
            })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange });
        dispatch(getCollectionPaginated(getPaginatedForReports(
            row?.methodcollection || '',
            row?.methodcount || '',
            row?.origin || '',
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                take: pageSize,
                skip: pageIndex * pageSize,
                sorts: sorts,
                filters: filters,
                ...allParameters
            }
        )));
    };

    const handleSelected = () => {
        dispatch(resetMainAux());
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setSearchValue('');
        setViewSelected("view-1");
    }

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={handleSelected}
            />
            {multiData.length > 0 ?
                <>
                    <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                        <span className={classes.title}>
                            {t('report_' + row?.origin)}
                        </span>
                    </Box>
                    {customReport ?
                        <AssessorProductivity
                            row={row}
                            multiData={multiData}
                            allFilters={allFilters}
                        />
                        :
                        <>
                            {allFilters &&
                                <div className={classes.containerFilter} >
                                    {
                                        allFilters.map(filtro => (
                                            (filtro.values[0].multiselect ?
                                                <FieldMultiSelect
                                                    label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                                    className={classes.filterComponent}
                                                    key={filtro.values[0].filter}
                                                    onChange={(value) => setValue(filtro.values[0].parameterName, value ? value.map((o: Dictionary) => o[filtro.values[0].optionValue]).join() : '')}
                                                    variant="outlined"
                                                    data={multiData[multiData.findIndex(x => x.key === filtro.values[0].filter)].data}
                                                    optionDesc={filtro.values[0].optionDesc}
                                                    optionValue={filtro.values[0].optionValue}
                                                />
                                                :
                                                <FieldSelect
                                                    label={t('report_' + row?.origin + '_filter_' + filtro.values[0].label || '')}
                                                    className={classes.filterComponent}
                                                    key={filtro.values[0].filter}
                                                    variant="outlined"
                                                    onChange={(value) => setValue(filtro.values[0].parameterName, value ? value[filtro.values[0].optionValue] : '')}
                                                    data={multiData[multiData.findIndex(x => x.key === filtro.values[0].filter)].data}
                                                    optionDesc={filtro.values[0].optionDesc}
                                                    optionValue={filtro.values[0].optionValue}
                                                />
                                            )
                                        )
                                        )
                                    }
                                </div>
                            }
                            <div className={classes.container}>
                                <TablePaginated
                                    columns={columns}
                                    data={mainPaginated.data}
                                    totalrow={totalrow}
                                    loading={mainPaginated.loading}
                                    pageCount={pageCount}
                                    filterrange={true}
                                    download={true}
                                    fetchData={fetchData}
                                    exportPersonalized={triggerExportData}
                                />
                            </div>
                        </>
                    }
                </>
                :
                <SkeletonReport />
            }
        </div>
    );
}

const Reports: FC = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const reportsResult = useSelector(state => state.main);
    const [rowSelected, setRowSelected] = useState<Dictionary>([]);
    const [searchValue, setSearchValue] = useState('');
    const [viewSelected, setViewSelected] = useState("view-1");
    const [customReport, setCustomReport] = useState(false);

    const fetchData = () => dispatch(getCollection(getReportSel('')));

    const allReports = useMemo(() =>
        reportsResult.mainData.data.filter(report => {
            if (searchValue === null || searchValue.trim().length === 0) {
                return reportsResult;
            } else {
                return t('report_' + report?.origin).toLowerCase().includes(searchValue.toLowerCase());
            }
        }), [searchValue, reportsResult]);

    useEffect(() => {
        dispatch(resetMainAux());
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        fetchData();

        return () => {
            dispatch(resetMainAux());
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
            dispatch(resetMain());
        };

    }, []);

    const handleFiend = (valor: string) => {
        setSearchValue(valor);
    }

    const handleSelected = (row: Dictionary, allFilters: Dictionary[]) => {
        dispatch(resetMainAux());
        dispatch(resetCollectionPaginated());
        dispatch(resetMultiMain());
        setRowSelected(row);

        let allRequestBody: IRequestBody[] = [];

        allRequestBody.push(getReportColumnSel(row?.methodcollection || ""));

        if (allFilters) {
            allFilters.sort((a, b) => a.order - b.order);
            allFilters.forEach(x => {
                allRequestBody.push(getReportFilterSel(
                    String(x.values[0].filter),
                    x.values[0].isListDomains ? String(x.values[0].filter) + "_" + x.values[0].domainname : String(x.values[0].filter),
                    x.values[0].isListDomains ? x.values[0].domainname : ""
                ))
            });
        }

        dispatch(getMultiCollection(allRequestBody));
        setViewSelected("view-2");
        setCustomReport(row.reportname === 'PRODUCTIVITY' ? true : false);
    }

    if (viewSelected === "view-1") {
        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" mb={1}>
                    <span className={classes.title}>
                        {t(langKeys.report_plural)}
                    </span>
                </Box>
                <Box className={classes.containerFilterGeneral}>
                    <span></span>
                    <div className={classes.containerSearch}>
                        <SearchField
                            colorPlaceHolder='#FFF'
                            handleChangeOther={handleFiend}
                            lazy
                        />
                    </div>
                </Box>
                <div className={classes.containerDetails}>
                    <Grid container spacing={3} style={{ justifyContent: 'center' }}>
                        {
                            allReports.map((report, index) => (
                                <Grid item key={"report_" + report.reportid + "_" + index} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                    <Card >
                                        <CardActionArea onClick={() => handleSelected(report, report.filters)}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                className={classes.media}
                                                image={reportsImage.find(x => x.name === report.image)?.image || 'no_data.png'}
                                                title={t('report_' + report?.origin)}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {t('report_' + report?.origin)}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </div>
            </div>
        );
    } else {
        return (
            <ReportItem
                setViewSelected={setViewSelected}
                row={rowSelected}
                multiData={reportsResult.multiData.data}
                allFilters={rowSelected.filters}
                customReport={customReport}
                setSearchValue={setSearchValue}
            />
        )
    }
}

export default Reports;