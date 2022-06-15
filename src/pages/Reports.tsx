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
import TableZyx from 'components/fields/table-simple';
import Graphic from 'components/fields/Graphic';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { TemplateBreadcrumbs, SearchField, FieldSelect, FieldMultiSelect, SkeletonReportCard, DialogZyx, DateRangePicker } from 'components';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData, MultiData, IRequestBody } from "@types";
import { getReportSel, getReportTemplateSel, getValuesFromDomain, getReportColumnSel, getReportFilterSel, getPaginatedForReports, getReportExport, insertReportTemplate, convertLocalDate, getTableOrigin, getReportGraphic, getConversationsWhatsapp, getDateCleaned } from 'common/helpers';
import { getCollection, getCollectionAux, execute, resetMain, getCollectionPaginated, resetCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetMainAux, getMultiCollectionAux, getMainGraphic } from 'store/main/actions';
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
import ReportPersonalized, { IReport } from 'components/personalizedreport/ReportPersonalized'
import Heatmap from './Heatmap';
import RecordHSMRecord from './RecordHSMReport';
import { useForm } from 'react-hook-form';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import ReportInvoice from 'components/report/ReportInvoice';
import TicketvsAdviser from 'components/report/TicketvsAdviser';

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
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
    },
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
    const [allParameters, setAllParameters] = useState<any>({});
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState('GRID');

    // const columns = React.useMemo(() => [{ Header: 'null', accessor: 'null', type: 'null' }] as any, []);
    const columns = React.useMemo(() => reportColumns.map(x => {
        switch (x.proargtype) {
            case "bigint":
                if (x.proargnames.includes('year') || x.proargnames.includes('month') || x.proargnames.includes('week') || x.proargnames.includes('day') || x.proargnames.includes('hour')) {
                    return {
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        type: "number-centered"
                    }
                }
                else {
                    return {
                        Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                        accessor: x.proargnames,
                        helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
                        type: "number"
                    }

                }
            case "boolean":
                return {
                    Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
                    type: "boolean",
                    Cell: (props: any) => {
                        const column = props.cell.column;
                        const row = props.cell.row.original;
                        return (t(`${row[column.id]}`.toLowerCase()) || "").toUpperCase()
                    }
                }
            case "timestamp without time zone":
                return {
                    Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
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
                }
            case "date":
                return {
                    Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                    accessor: x.proargnames,
                    helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
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
                }
            default:
                switch (row?.origin) {
                    case "loginhistory":
                        switch (x.proargnames) {
                            case "status":
                                return {
                                    Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
                                    type: "string",
                                    Cell: (props: any) => {
                                        const { status } = props.cell.row.original;
                                        return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                                    }
                                }
                            default:
                                return {
                                    Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                                    accessor: x.proargnames,
                                    helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
                                    type: "string"
                                }
                        }
                    default:
                        return {
                            Header: t('report_' + row?.origin + '_' + x.proargnames || ''),
                            accessor: x.proargnames,
                            helpText: t('report_' + row?.origin + '_' + x.proargnames + "_help") === ('report_' + row?.origin + '_' + x.proargnames + "_help")? "" : t('report_' + row?.origin + '_' + x.proargnames + "_help"),
                            type: "string"
                        }
                }
        }
    }), [reportColumns]);

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


    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux(prev => ({ ...prev, daterange }));
        dispatch(getMainGraphic(getReportGraphic(
            row?.methodgraphic || '',
            row?.origin || '',
            {
                filters: {},
                sorts: {},
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column,
                summarization: 'COUNT',
                ...allParameters
            }
        )));
    }


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
                                {view === "GRID" ? (
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
                                                            valueDefault={allParameters[filtro.values[0].parameterName]}
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
                                                            valueDefault={allParameters[filtro.values[0].parameterName]}    
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
                                        ButtonsElement={() => (
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                disabled={mainPaginated.loading || !(mainPaginated.data.length > 0)}
                                                onClick={() => setOpenModal(true)}
                                                startIcon={<AssessmentIcon />}
                                            >
                                                {t(langKeys.graphic_view)}
                                            </Button>
                                        )}
                                        download={true}
                                        fetchData={fetchData}
                                        exportPersonalized={triggerExportData}
                                    />
                                ) : (
                                    <Graphic
                                        graphicType={view.split("-")?.[1] || "BAR"}
                                        column={view.split("-")?.[2] || "summary"}
                                        openModal={openModal}
                                        setOpenModal={setOpenModal}
                                        daterange={fetchDataAux.daterange}
                                        setView={setView}
                                        row={row!!}
                                        handlerSearchGraphic={handlerSearchGraphic}
                                        FiltersElement={(
                                            <>
                                                {!allFilters ? null : allFilters.map(filtro => (
                                                    (filtro.values[0].multiselect ?
                                                        <FieldMultiSelect
                                                            valueDefault={allParameters[filtro.values[0].parameterName]}
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
                                                            valueDefault={allParameters[filtro.values[0].parameterName]}
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
                                    />
                                )}
                            </div>
                        </>
                    }
                </>
                :
                <SkeletonReport />
            }
            <SummaryGraphic
                openModal={openModal}
                setOpenModal={setOpenModal}
                setView={setView}
                row={row}
                daterange={fetchDataAux.daterange}
                filters={fetchDataAux.filters}
                columns={reportColumns.map(x => x.proargnames)}
                columnsprefix={'report_' + row?.origin + '_'}
                allParameters={allParameters}
            />
        </div>
    );
}

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row: Dictionary | null;
    daterange: any;
    filters: Dictionary;
    columns: string[];
    columnsprefix: string;
    allParameters?: any;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, row, daterange, filters, columns, columnsprefix, allParameters = {} }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            graphictype: 'BAR',
            column: ''
        }
    });

    useEffect(() => {
        register('graphictype', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('column', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    const handleAcceptModal = handleSubmit((data) => {
        triggerGraphic(data);
    });

    const triggerGraphic = (data: any) => {
        setView(`CHART-${data.graphictype}-${data.column}`);
        setOpenModal(false);
        dispatch(getMainGraphic(getReportGraphic(
            row?.methodgraphic || '',
            row?.origin || '',
            {
                filters,
                sorts: {},
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column: data.column,
                summarization: 'COUNT',
                ...allParameters
            }
        )));
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.graphic_configuration)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.accept)}
            handleClickButton2={handleAcceptModal}
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_type)}
                    className="col-12"
                    valueDefault={getValues('graphictype')}
                    error={errors?.graphictype?.message}
                    onChange={(value) => setValue('graphictype', value?.key)}
                    data={[{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }]}
                    uset={true}
                    prefixTranslation="graphic_"
                    optionDesc="value"
                    optionValue="key"
                />
            </div>
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.graphic_view_by)}
                    className="col-12"
                    valueDefault={getValues('column')}
                    error={errors?.column?.message}
                    onChange={(value) => setValue('column', value?.key)}
                    data={columns.map(x => ({ key: x, value: x }))}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation={columnsprefix}
                />
            </div>
        </DialogZyx>
    )
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const ReportConversationWhatsapp: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const multiData = useSelector(state => state.main.multiData);
    const [gridData, setGridData] = useState<any[]>([]);

    const classes = useStyles()
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);

    const search = () => {
        dispatch(showBackdrop(true))
        dispatch(getMultiCollection([
            getConversationsWhatsapp(
                {
                    startdate: dateRangeCreateDate.startDate,
                    enddate: dateRangeCreateDate.endDate
                }
            )
        ]))
    }

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])

    useEffect(() => {
        if (!multiData.loading){
            dispatch(showBackdrop(false));
            setGridData((multiData.data[0]?.data || []).map(d => ({
                ...d,
                conversationstart: d.conversationstart ? new Date(d.conversationstart).toLocaleString() : '',
                conversationend: d.conversationend ? new Date(d.conversationend).toLocaleString() : ''
            })))
        }
    }, [multiData])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.personIdentifier),
                accessor: 'personcommunicationchannel',
            },
            {
                Header: t(langKeys.phone),
                accessor: 'personcommunicationchannelowner',
            },
            {
                Header: t(langKeys.ticket_number),
                accessor: 'ticketnum',
            },
            {
                Header: "Iniciado por",
                accessor: 'initiatedby',
            },
            {
                Header: "Fecha de inicio",
                accessor: 'conversationstart',
                // Cell: (props: any) => {
                //     const { conversationstart } = props.cell.row.original;
                //     return (
                //         <div>{conversationstart ? new Date(conversationstart).toLocaleString() : ''}</div>
                //     )
                // }
            },
            {
                Header: "Fecha de fin",
                accessor: 'conversationend',
                // Cell: (props: any) => {
                //     const { conversationend } = props.cell.row.original;
                //     return (
                //         <div>{conversationend ? new Date(conversationend).toLocaleString() : ''}</div>
                //     )
                // }
            },
            {
                Header: t(langKeys.countrycode),
                accessor: 'country',
            },
            {
                Header: t(langKeys.amount),
                accessor: 'cost',
                type: 'number'
            },
            {
                Header: t(langKeys.paymentmethod),
                accessor: 'paymenttype',
                Cell: (props: any) => {
                    const { paymenttype } = props.cell.row.original;
                    return (t(`${paymenttype}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <TableZyx
                columns={columns}
                data={gridData}
                ButtonsElement={() => (
                    <div className={classes.containerHeader} style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', gap: 8}}>
                            <DateRangePicker
                                open={openDateRangeCreateDateModal}
                                setOpen={setOpenDateRangeCreateDateModal}
                                range={dateRangeCreateDate}
                                onSelect={setDateRangeCreateDate}
                            >
                                <Button
                                    className={classes.itemDate}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                >
                                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                </Button>
                            </DateRangePicker>
                            {/* <FieldSelect
                                onChange={(value) => setshippingtype(value?.domainvalue||"")}
                                label={t(langKeys.shippingtype)}
                                loading={multiDataAux.loading}
                                variant="outlined"
                                valueDefault={shippingtype}
                                style={{width: "170px"}}
                                data={shippingTypesData}
                                optionValue="domainvalue"
                                optionDesc="domainvalue"
                                uset={true}
                                prefixTranslation='type_shippingtype_'
                            /> */}
                            <div>
                                <Button
                                    disabled={multiData.loading}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SearchIcon style={{ color: 'white' }} />}
                                    style={{ width: 120, backgroundColor: "#55BD84" }}
                                    onClick={() => search()}
                                >{t(langKeys.search)}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                download={true}
                filterGeneral={false}
                loading={multiData.loading}
                register={false}
            />
        </React.Fragment>
    )
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
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = user?.roledesc === "SUPERADMIN"

    const fetchData = () => {
        dispatch(getCollection(getReportSel('')))
        dispatch(getCollectionAux(getReportTemplateSel()))
    };

    useEffect(() => {
        if (!reportsResult.mainData.loading && !reportsResult.mainData.error && !reportsResult.mainAux.loading && !reportsResult.mainAux.error && reportsResult.mainAux.key === "UFN_REPORTTEMPLATE_SEL") {
            if (searchValue === null || searchValue.trim().length === 0) {
                if (allReports.length === 0 || !waitSave) {
                    const rr = [
                        ...reportsResult.mainData.data,
                        ...reportsResult.mainAux.data.map(x => ({
                            ...x,
                            columns: x.columnjson ? JSON.parse(x.columnjson) : [],
                            filters: x.filterjson ? JSON.parse(x.filterjson) : [],
                            summaries: x.summaryjson ? JSON.parse(x.summaryjson) : [],
                        }))
                    ].filter(x => superadmin ? true : !['invoice'].includes(x.origin));
                    setAllReports(rr);
                    setallReportsToShow(rr);
                }
            }
        }

    }, [reportsResult.mainAux, reportsResult.mainData, waitSave])

    useEffect(() => {
        if (searchValue.length >= 3 || searchValue.length === 0) {
            let temparray = allReports.filter((el: any) => (t((langKeys as any)[`report_${el.origin}`]) + "").toLowerCase().includes(searchValue.toLowerCase()))
            setallReportsToShow(temparray)
        }
    }, [searchValue]);

    useEffect(() => {
        setallReportsToShow(allReports);
    }, [viewSelected])

    useEffect(() => {
        fetchData();

        dispatch(getMultiCollectionAux([
            getValuesFromDomain("ESTADOGENERICO"),
            getTableOrigin(),
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

    const reportSwitch = (report: any, index: number) => {
        switch (report.reportname) {
            case 'HEATMAP':
                return (
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
                )
            case 'RECORDHSMREPORT':
                return (
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
                )
            case 'CONVERSATIONWHATSAPP':
                return (
                    <Grid item key={"reportconversationwhatsapp"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                        <Card >
                            <CardActionArea onClick={() => handleSelectedString("reportconversationwhatsapp")}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    className={classes.media}
                                    image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/whatsapp_PNG95151.png'}
                                    title={t(langKeys.conversation_plural) + " Whatsapp"}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {t(langKeys.conversation_plural) + " Whatsapp"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                )
            case 'INVOICE':
                return (
                    superadmin && <Grid item key={"invoice"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                        <Card >
                            <CardActionArea onClick={() => handleSelectedString("reportinvoice")}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    className={classes.media}
                                    image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png'}
                                    title={t(langKeys.invoice)}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {t(langKeys.invoice)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                )
            case 'TICKETVSADVISER':
                return (
                    superadmin && <Grid item key={"report_ticketvsasesor"} xs={12} md={4} lg={3} style={{ minWidth: 360 }}>
                        <Card >
                            <CardActionArea onClick={() => handleSelectedString("report_ticketvsasesor")}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    className={classes.media}
                                    image={'https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/03reportepersonalizado.png'}
                                    title={t(langKeys.report_ticketvsasesor)}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {t(langKeys.report_ticketvsasesor)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                )
            default:
                return (
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
                )
        }
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
                                >{t(langKeys.create_custom_report)}
                                </Button>
                            </div>
                        </Box>
                        <div className={classes.containerDetails}>
                            <Grid container spacing={3} >
                                {allReportsToShow.filter(x => !!x.image).map((report, index) => (
                                    reportSwitch(report, index)
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
                                    <MenuItem
                                        onClick={() => {
                                            setAnchorEl(null)
                                            setViewSelected("view-5");
                                        }}
                                    >
                                        {t(langKeys.duplicate)}
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleDelete(rowReportSelected?.row)}>
                                        {t(langKeys.delete)}
                                    </MenuItem>
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
                fetchData={fetchData}
            />
        )
    } else if (viewSelected === "view-5") { //duplicate
        return (
            <DetailReportDesigner
                data={{ ...rowReportSelected, row: { ...rowReportSelected?.row, reporttemplateid: 0, description: rowReportSelected?.row?.description + "-v1" } }}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
            />
        )
    } else if (viewSelected === "view-4") {
        return (
            <ReportPersonalized
                item={rowReportSelected.row!! as IReport}
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
    } else if (viewSelected === "reportconversationwhatsapp") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t(langKeys.conversation_plural) + " Whatsapp", t(langKeys.report_plural))}
                        handleClick={handleSelectedString}
                    />
                    <ReportConversationWhatsapp />
                </div>
            </>
        )
    } else if (viewSelected === "reportinvoice") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('report_invoice'), t(langKeys.report_plural))}
                        handleClick={handleSelectedString}
                    />
                    <ReportInvoice />
                </div>
            </>
        )
    } else if (viewSelected === "report_ticketvsasesor") {
        return (
            <>
                <div style={{ width: '100%' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={getArrayBread(t('report_ticketvsasesor'), t(langKeys.report_plural))}
                        handleClick={handleSelectedString}
                    />
                    <TicketvsAdviser />
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