/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react';
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
import { TemplateBreadcrumbs, SearchField, FieldSelect, FieldMultiSelect, SkeletonReportCard } from 'components';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData, MultiData, IRequestBody } from "@types";
import { getReportSel, getReportTemplateSel, getValuesFromDomain, getTagsChatflow, getCommChannelLst, getReportColumnSel, getReportFilterSel, getPaginatedForReports, getReportExport, insertReportTemplate, convertLocalDate, getTableOrigin } from 'common/helpers';
import { getCollection, getCollectionAux, execute, resetMain, getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetMainAux, getMultiCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { reportsImage } from '../icons/index';
import AssessorProductivity from 'components/report/AssessorProductivity';
import DetailReportDesigner from 'pages/ReportTemplate';
import { SkeletonReport } from 'components';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ReportPersonalized from 'components/personalizedreport/ReportPersonalized'
import Heatmap from './Heatmap';
import RecordHSMRecord from './RecordHSMReport';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}


interface ItemProps {
    setViewSelected: (view: string) => void;
    setSearchValue: (searchValue: string) => void;
    row: Dictionary | null;
    multiData: MultiData[];
    allFilters: Dictionary[];
    customReport: boolean;
}


const getArrayBread = (nametmp: string, nameView1: string) => ([
    { id: "view-1", name: nameView1 || "Reports" },
    { id: "view-2", name: nametmp }
]);

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%'
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },
    media: {
        objectFit: "contain"
    },
    containerSearch: {
        width: '100%',
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
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
        minWidth: '220px',
        maxWidth: '260px'
    },
    containerFilterGeneral: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
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
    const columns = React.useMemo(() => [{ Header: 'null', accessor: 'null', type: 'null' }] as any, []);
    const [allParameters, setAllParameters] = useState({});

    if (multiData.length > 0) {
        reportColumns.forEach(x => {
            switch (x.proargtype) {
                case "bigint":
                    columns.push({
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        type: "number"
                    });
                    break;
                case "boolean":
                    columns.push({
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        type: "boolean",
                        Cell: (props: any) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original;
                            return (t(`${row[column.id]}`.toLowerCase()) || "").toUpperCase()
                        }
                    });
                    break;
                case "timestamp without time zone":
                    columns.push({
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        type: "date",
                        Cell: (props: any) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original;
                            return (<div>
                                {convertLocalDate(row[column.id]).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                    hour12: false
                                })}
                            </div>)
                        }
                    });
                    break;
                case "date":
                    columns.push({
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        type: "date",
                        Cell: (props: any) => {
                            const column = props.cell.column;
                            const row = props.cell.row.original;
                            return (<div>
                                {new Date(
                                    row[column.id].split('-')[0],
                                    row[column.id].split('-')[1] - 1,
                                    row[column.id].split('-')[2]
                                ).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit"
                                })}
                            </div>)
                        }
                    });
                    break;
                default:
                    switch (row?.origin) {
                        case "loginhistory":
                            switch (x.proargnames) {
                                case "status":
                                    columns.push({
                                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                                        accessor: x.proargnames,
                                        type: "string",
                                        Cell: (props: any) => {
                                            const { status } = props.cell.row.original;
                                            return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                                        }
                                    });
                                    break;
                                default:
                                    columns.push({
                                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                                        accessor: x.proargnames,
                                        type: "string"
                                    });
                                    break;
                            }
                            break;
                        default:
                            columns.push({
                                Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                                accessor: x.proargnames,
                                type: "string"
                            });
                            break;
                    }
                    break;
            }
        });
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
        const columnsExport = columns.map((x: Dictionary) => ({
            key: x.accessor,
            alias: x.Header
        }));
        dispatch(exportData(getReportExport(
            row?.methodexport || '',
            row?.origin || '',
            {
                filters,
                sorts,
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                ...allParameters
            }), "", "excel", false, columnsExport));
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
                breadcrumbs={getArrayBread(t('report_' + row?.origin), t(langKeys.report_plural))}
                handleClick={handleSelected}
            />
            <div style={{ height: 10 }}></div>
            {multiData.length > 0 ?
                <>
                    {customReport ?
                        <AssessorProductivity
                            row={row}
                            multiData={multiData}
                            allFilters={allFilters}
                        />
                        :
                        <>
                            <div className={classes.container}>
                                <TablePaginated
                                    columns={columns}
                                    data={mainPaginated.data}
                                    totalrow={totalrow}
                                    loading={mainPaginated.loading}
                                    pageCount={pageCount}
                                    filterrange={true}
                                    FiltersElement={(
                                        <>
                                            {!allFilters ? null : allFilters.map(filtro => (
                                                (filtro.values[0].multiselect ?
                                                    <FieldMultiSelect
                                                        limitTags={1}
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
                                            ))}
                                        </>
                                    )}
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
    const [rowReportSelected, setRowReportSelected] = useState<RowSelected>({ row: null, edit: false });
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const [allReports, setAllReports] = useState<Dictionary[]>([]);
    const [allReportsToShow, setallReportsToShow] = useState<Dictionary[]>([]);

    const fetchData = () => {
        dispatch(getCollection(getReportSel('')))
        dispatch(getCollectionAux(getReportTemplateSel()))
    };

    useEffect(() => {
        if (!reportsResult.mainData.loading && !reportsResult.mainData.error && !reportsResult.mainAux.loading && !reportsResult.mainAux.error && reportsResult.mainAux.key === "UFN_REPORTTEMPLATE_SEL") {
            if (searchValue === null || searchValue.trim().length === 0) {
                if (allReports.length === 0 || !waitSave) {
                    const rr = [...reportsResult.mainData.data, ...reportsResult.mainAux.data.map(x => ({
                        ...x,
                        columns: x.columnjson ? JSON.parse(x.columnjson) : [],
                        filters: x.filterjson ? JSON.parse(x.filterjson) : [],
                        summary: x.summaryjson ? JSON.parse(x.summaryjson) : [],
                    }))];
                    setAllReports(rr);
                    setallReportsToShow(rr);
                }
            }
        }

    }, [reportsResult.mainAux, reportsResult.mainData, waitSave])

    useEffect(() => {
        let temparray = allReports.filter((el: any) => String(t((langKeys as any)[`report_${el.origin}`])).toLowerCase().includes(searchValue.toLowerCase()))
        setallReportsToShow(temparray)
    }, [searchValue]);

    useEffect(() => {
        setallReportsToShow(allReports);
    }, [viewSelected])

    useEffect(() => {
        fetchData();

        dispatch(getMultiCollectionAux([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesFromDomain("GRUPOS"),
            getTagsChatflow(),
            getCommChannelLst(),
            getTableOrigin()
        ]));

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

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const handleDelete = (row: Dictionary | null) => {
        setAnchorEl(null)
        if (!row)
            return null;
        const callback = () => {
            dispatch(execute(insertReportTemplate({ ...row!!, operation: 'DELETE', status: 'ELIMINADO', id: row!!.reporttemplateid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleSelectedString = (key: string) => {
        setViewSelected(key);
    }

    if (viewSelected === "view-1") {
        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                    <span className={classes.title}>
                        {t(langKeys.report_plural)} ({allReportsToShow.length})
                    </span>
                </Box>
                {(reportsResult.mainData.loading || reportsResult.mainAux.loading) ? (
                    <SkeletonReportCard />
                ) : (
                    <>
                        <Box className={classes.containerFilterGeneral}>
                            <span></span>
                            <div className={classes.containerSearch}>
                                <div style={{ flex: 1 }}>
                                    <SearchField
                                        colorPlaceHolder='#FFF'
                                        handleChangeOther={handleFiend}
                                        lazy
                                    />
                                </div>
                                <Button
                                    // className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    // disabled={loading}
                                    startIcon={<AddIcon color="secondary" />}
                                    onClick={() => {
                                        setViewSelected("view-3");
                                        setRowReportSelected({ row: null, edit: true });
                                    }}
                                    style={{ backgroundColor: "#55BD84" }}
                                >{t(langKeys.register)}
                                </Button>
                            </div>
                        </Box>
                        <div className={classes.containerDetails}>
                            <Grid container spacing={3} >
                                {allReportsToShow.filter(x => !!x.image).map((report, index) => (
                                    report.reportname === 'HEATMAP' ?
                                        <Grid item key={"heatmap"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                            <Card >
                                                <CardActionArea onClick={() => handleSelectedString("heatmap")}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        className={classes.media}
                                                        image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/01mapadecalor.png'}
                                                        title={t(langKeys.heatmap)}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h6" component="div">
                                                            {t(langKeys.heatmap)}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                        :
                                        report.reportname === 'RECORDHSMREPORT' ?
                                            <Grid item key={"recordhsmreport"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                                <Card >
                                                    <CardActionArea onClick={() => handleSelectedString("recordhsmreport")}>
                                                        <CardMedia
                                                            component="img"
                                                            height="140"
                                                            className={classes.media}
                                                            image="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/02reportehsm.png"
                                                            title={t(langKeys.recordhsmreport)}
                                                        />
                                                        <CardContent>
                                                            <Typography gutterBottom variant="h6" component="div">
                                                                {t(langKeys.recordhsmreport)}
                                                            </Typography>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                            :
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
                                ))}
                                {allReportsToShow.filter(x => !x.image).map((report, index) => (
                                    <Grid item key={"report_" + report.reporttemplateid + "_" + index} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                                        <Card style={{ position: 'relative' }}>
                                            <CardActionArea
                                                onClick={() => {
                                                    setViewSelected("view-4");
                                                    setRowReportSelected({ row: report, edit: true });
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    className={classes.media}
                                                    image='https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png'
                                                    title={report.description}
                                                />

                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {report.description}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                            <IconButton
                                                aria-label="settings"
                                                aria-describedby={`${report?.reporttemplateid}reporttemplate`}
                                                aria-haspopup="true"
                                                style={{ position: 'absolute', right: 0, top: 0 }}
                                                onClick={(e) => {
                                                    setRowReportSelected({ row: report, edit: true });
                                                    setAnchorEl(e.currentTarget)
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Card>
                                    </Grid>
                                ))}
                                <Menu
                                    anchorEl={anchorEl}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null)
                                            setViewSelected("view-3");
                                        }}
                                    >
                                        {t(langKeys.edit)}
                                    </MenuItem>
                                    <MenuItem onClick={(e) => handleDelete(rowReportSelected?.row)}>{t(langKeys.delete)}</MenuItem>
                                </Menu>
                            </Grid>
                        </div>
                    </>
                )}
            </div>
        );
    } else if (viewSelected === "view-3") {
        return (
            <DetailReportDesigner
                data={rowReportSelected}
                setViewSelected={setViewSelected}
                multiData={reportsResult.multiDataAux.data}
                fetchData={fetchData}
            />
        )
    } else if (viewSelected === "view-4") {
        return (
            <ReportPersonalized
                item={rowReportSelected.row!!}
                multiData={reportsResult.multiDataAux.data}
                setViewSelected={setViewSelected}
            />
        )
    } else if (viewSelected === "heatmap") {
        return (

            <Fragment>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('report_heatmap'), t(langKeys.report_plural))}
                        handleClick={handleSelectedString}
                    />
                    <Heatmap />
                </div>
            </Fragment>
        )
    } else if (viewSelected === "recordhsmreport") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('report_recordhsmreport'), t(langKeys.report_plural))}
                        handleClick={handleSelectedString}
                    />
                    <RecordHSMRecord />
                </div>
            </>
        )
    }
    else {
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