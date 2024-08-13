import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import {
    convertLocalDate,
    getCommChannelLst,
    getDateCleaned, getLeadReportGraphicSel, getLeadsReportSel, getRecordVoicecallGraphic, getReportGraphic,
} from 'common/helpers';
import {Dictionary, IFetchData} from "@types";
import {
    getCollectionAux, getMainGraphic,
    getMultiCollectionAux3,
    resetCollectionPaginated
} from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import {TemplateBreadcrumbs, FieldSelect, DateRangePicker, DialogZyx} from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import {Button, ListItemIcon} from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';
import MenuItem from "@material-ui/core/MenuItem";
import CategoryIcon from "@material-ui/icons/Category";
import Typography from "@material-ui/core/Typography";
import AssessmentIcon from "@material-ui/icons/Assessment";
import {useForm} from "react-hook-form";
import Graphic from "../../components/fields/Graphic";

interface DetailProps {
    setViewSelected: (view: string) => void;
}

const useStyles = makeStyles((theme) => ({
    select: {
        width: '200px'
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        alignItems: 'left'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    filterComponent: {
        width: '180px'
    },
    containerFilters: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'end',
        gap: theme.spacing(1),
        marginTop: theme.spacing(1),
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
    },
    calendarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));
const columnsTemp = [
    "ticketnum",
    "createdate",
    "description",
    "lastchangestatusdate",
    "date_deadline",
    "displayname",
    "phone",
    "email",
    "expected_revenue",
    "estimatedimplementationdate",
    "estimatedbillingdate",
    "tags",
    "phase",
    "priority",
    "fullname",
    "products",

];


const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const OpportunityReport: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiAux3 = useSelector(state => state.main.multiDataAux3);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitExport, setWaitExport] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [viewSelected2, setViewSelected2] = useState("view-2");
    const [allParameters, setAllParameters] = useState<any>({});
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, distinct: {}, daterange: null })
    const [view] = useState('GRID');
    const multiData = useSelector((state) => state.main.multiData);




    const arrayBread = [
        { id: "view-1", name: t(langKeys.report_plural) },
        { id: "view-2", name: t(langKeys.report_crm) }
    ];

    const filterChannel = useSelector((state) => state.main.mainAux);

    const cell = (props: CellProps<Dictionary>) => {
        const column = props.cell.column;
        const row = props.cell.row.original;
        return (
            <div>
                {column.sortType === "datetime" && !!row[column.id]
                    ? convertLocalDate(row[column.id]).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric"
                    })
                    : row[column.id]}
            </div>
        );
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_opportunity_ticket),
                accessor: 'ticketnum',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_datehour),
                accessor: 'createdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { createdate } = props.cell.row.original || {};
                    return createdate ? new Date(createdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_op),
                accessor: 'description',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_lastupdate),
                accessor: 'lastchangestatusdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { lastchangestatusdate } = props.cell.row.original || {};
                    return lastchangestatusdate ? new Date(lastchangestatusdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_dateinopportunity),
                accessor: 'date_deadline',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { date_deadline } = props.cell.row.original || {};
                    return date_deadline ? new Date(date_deadline).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_customer),
                accessor: 'displayname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phone),
                accessor: 'phone',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_email),
                accessor: 'email',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedincome),
                accessor: 'expected_revenue',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_expectedimplementationdate),
                accessor: 'estimatedimplementationdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedimplementationdate } = props.cell.row.original || {};
                    return estimatedimplementationdate ? new Date(estimatedimplementationdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_expectedbillingdate),
                accessor: 'estimatedbillingdate',
                type: 'date',
                Cell: (props: CellProps<Dictionary>) => {
                    const { estimatedbillingdate } = props.cell.row.original || {};
                    return estimatedbillingdate ? new Date(estimatedbillingdate).toLocaleString() : null;
                },
            },
            {
                Header: t(langKeys.report_opportunity_tags),
                accessor: 'tags',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_phase),
                accessor: 'phase',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_priority),
                accessor: 'priority',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_assignedadviser),
                accessor: 'fullname',
                Cell: cell
            },
            {
                Header: t(langKeys.report_opportunity_products),
                accessor: 'products',
                Cell: cell
            },
        ],
        [t]
    );

    const fetchData = () => {
        dispatch(showBackdrop(true));
        dispatch(getMultiCollectionAux3([getLeadsReportSel(
            {
                communicationchannel: selectedChannel || 0,
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
            }
        ),
        ]));
    };

    useEffect(() => {
        dispatch(resetCollectionPaginated());
        fetchData();
        fetchFiltersChannels();
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, []);

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux(prev => ({ ...prev, daterange }));
        dispatch(getMainGraphic(getReportGraphic(
            "UFN_LEAD_REPORT_GRAPHIC_SEL", "report_crm",
            {
                filters: {},
                sorts: {},
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column,
                summarization: 'COUNT',
                ...allParameters,
            }
        )));
    }


    useEffect(() => {
        if (!multiAux3.loading && !multiAux3.error) {
            dispatch(showBackdrop(false));
        }
    }, [multiAux3]);

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    };

    const [selectedChannel, setSelectedChannel] = useState(0);

    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()));

    const setView = (e: string) => {
        if (e === "view-1") {
            setViewSelected(e);
            setViewSelected2("view-2");
        } else {
            setViewSelected2(e);
        }
    };

    if (viewSelected2 === "view-2") {
        return (
            <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setView}
                        />
                    </div>
                </div>
                <div style={{ position: 'relative', height: '100%' }}>

                    {view === "GRID" ? (
                        <TableZyx
                            columns={columns}
                            data={multiAux3?.data?.[0]?.data || []}
                            groupedBy={true}
                            showHideColumns={true}
                            loading={multiAux3.loading}
                            download={true}
                            ExtraMenuOptions={
                                <MenuItem
                                    style={{ padding: "0.7rem 1rem", fontSize: "0.96rem" }}
                                    onClick={() => setViewSelected2('calendar')}
                                >
                                    <CalendarIcon style={{ marginRight: "1rem" }}>
                                        <CategoryIcon fontSize="small" style={{ fill: "grey", height: "25px" }} />
                                    </CalendarIcon>
                                    <Typography variant="inherit">{ t(langKeys.report_opportunity_calendarview)}</Typography>
                                </MenuItem>
                            }
                            ButtonsElement={() => (
                                <div style={{ textAlign: 'left', display: 'flex', gap: '0.5rem', marginRight: 'auto', marginTop: 5 }}>
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

                                    <FieldSelect
                                        label={t(langKeys.channel)}
                                        variant="outlined"
                                        className={classes.filterComponent}
                                        data={filterChannel.data || []}
                                        valueDefault={selectedChannel}
                                        onChange={(value) => setSelectedChannel(value?.communicationchannelid || 0)}
                                        optionDesc="communicationchanneldesc"
                                        optionValue="communicationchannelid"
                                    />

                                    <Button
                                        disabled={multiAux3.loading}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                                        style={{ width: 120, backgroundColor: "#55BD84" }}
                                        onClick={() => fetchData()}
                                    >
                                        {t(langKeys.search)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        disabled={false}
                                        onClick={() => setOpenModal(true)}
                                        startIcon={<AssessmentIcon />}
                                    >
                                        {t(langKeys.graphic_view)}
                                    </Button>

                                </div>
                            )}
                            filterGeneral={false}
                        />
                    ): (
                        <Graphic
                            graphicType={view.split("-")?.[1] || "BAR"}
                            column={view.split("-")?.[2] || "summary"}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                            daterange={dateRangeCreateDate}
                            setView={setView}
                            row={{origin: 'report_crm'}}
                            handlerSearchGraphic={handlerSearchGraphic}
                            FiltersElement={
                                <FieldSelect
                                    valueDefault={allParameters["channel"]}
                                    label={t(langKeys.report_opportunity_channels)}
                                    className={classes.filterComponent}
                                    key={"UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"}
                                    variant="outlined"
                                    onChange={(value) => setValue("channel", value ? value["typedesc"] : "")}
                                    data={
                                        multiData?.data?.[
                                            multiData?.data.findIndex(
                                                (x) => x.key === "UFN_COMMUNICATIONCHANNEL_LST_TYPEDESC"
                                            )
                                            ]?.data
                                    }
                                    optionDesc={"type"}
                                    optionValue={"typedesc"}
                                />
                            }
                        />
                    )}
                    <SummaryGraphic
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        setView={setView}
                        daterange={dateRangeCreateDate}
                        columns={columnsTemp.map(c => ({
                            key: c, value: `report_opportunity_${c}`
                        }))}
                        columnsprefix='report_opportunity_'
                        allParameters={allParameters}
                    />
                </div>
            </div>
        );
    } else if (viewSelected2 === 'calendar') {
        return (
            <div style={{ width: '100%' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[{ id: "view-1", name: t(langKeys.report_plural) }, { id: "calendar", name: t(langKeys.report_crm) }]}
                    handleClick={setView}
                />
                <div className={classes.calendarContainer}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setViewSelected2("view-2")}
                    >
                        {t('Regresar')}
                    </Button>
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <p>ssssss</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return <div>error</div>;
    }
};

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row?: Dictionary | null;
    daterange: any;
    filters?: Dictionary;
    columns: any[];
    columnsprefix: string;
    allParameters?: any;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, row, daterange, filters, columns, columnsprefix, allParameters = {}, }) => {
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

        dispatch(getMainGraphic(getLeadReportGraphicSel(
            {
                communicationchannel: filters?.communicationchannel || 0,
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column: data.column,
                summarization: 'COUNT',
                ...allParameters,
            }
        )));
    }

    const excludeLeadsOpportunity= [
        "ticketnum",
        "createdate",
        "lastchangestatusdate",
        "date_deadline",
        "phone",
        "expected_revenue",
        "estimatedimplementationdate",
        "estimatedbillingdate",
        "email",
        "phase",
    ];

    const filteredColumns = columns.filter((column) => !excludeLeadsOpportunity.includes(column.key));



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
                    data={[{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }, { key: 'LINE', value: 'LINEA' },]}
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
                    data={filteredColumns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    )
}


export default OpportunityReport;