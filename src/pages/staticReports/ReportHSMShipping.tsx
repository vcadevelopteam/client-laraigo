import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { convertLocalDate, dateToLocalDate, getCampaignReportExport, getCommChannelLst, getDateCleaned, getHSMShipping, getHSMShippingDetail } from 'common/helpers';
import { Dictionary } from "@types";
import { getCollectionAux, getCollectionAux2, getMultiCollection, resetCollectionPaginated, resetMainAux } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { TemplateBreadcrumbs, DialogZyx, FieldSelect, DateRangePicker, FieldMultiSelect } from 'components';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import TableZyx from 'components/fields/table-simple';
import { Range } from 'react-date-range';
import { CalendarIcon } from 'icons';
import { Search as SearchIcon } from '@material-ui/icons';
import { CellProps } from 'react-table';
import { FieldErrors, useForm } from "react-hook-form";
import AssessmentIcon from '@material-ui/icons/Assessment';
import DialogInteractions from 'components/inbox/DialogInteractions';
import Graphic from 'components/fields/Graphic';
import SettingsIcon from '@material-ui/icons/Settings';

interface DetailProps {
    setViewSelected: (view: string) => void;
    setValue: Dictionary
    getValues: Dictionary,
    errors: FieldErrors
}


interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    columns: Dictionary[];
}
const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, columns }) => {
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<any>({
        defaultValues: {
            graphictype: 'BAR',
            column: '',
            columntext: ''
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
        setView("GRID")
        setView(`CHART-${data.graphictype}-${data.column}-${data.columntext}`);
        setOpenModal(false);

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
                    data={[{ key: 'BAR', value: 'BAR' }, { key: 'PIE', value: 'PIE' }, { key: 'LINE', value: 'LINEA' }]}
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
                    onChange={(value) => {
                        setValue('column', value?.accessor || '');
                        setValue('columntext', value?.Header || '');
                    }}
                    data={columns}
                    optionDesc="Header"
                    optionValue="accessor"
                />
            </div>
        </DialogZyx>
    )
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
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    itemFlex: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        justifyContent: 'end',
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
}));

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

export const ReportHSMShippingDetail: React.FC<{ row: any, arrayBread: any, setViewSelected: (view: string) => void; }> = ({ setViewSelected, row, arrayBread }) => {
    const { t } = useTranslation();
    const multidata = useSelector(state => state.main.multiData);
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const [openModal, setOpenModal] = useState(false);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [maindata, setMaindata] = useState<any>([]);
    const [showDialogGraphic, setShowDialogGraphic] = useState(false);
    const [view, setView] = useState('GRID');
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_number),
                accessor: 'ticketnum',
                showGroupedBy: true,
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    if (row && row.ticketnum) {
                        return (
                            <label
                                className={classes.labellink}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDialogInteractions(row)
                                }}
                            >
                                {row.ticketnum}
                            </label>
                        );
                    } else {
                        return "";
                    }
                },
            },
            {
                Header: t(langKeys.shippingdate),
                accessor: 'createdate',
                type: 'date',
                showGroupedBy: true,
                showColumn: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <div>{row && row.createdate ? dateToLocalDate(row.createdate) : ''}</div>
                    );
                }
                //Cell: cell
            },
            {
                Header: t(langKeys.dashboard_operationalpush_hsmrank_senthour),
                accessor: 'createhour',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: `${t(langKeys.name)} ${t(langKeys.campaign).toLocaleLowerCase()}`,
                accessor: 'campaignname',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.recipient),
                accessor: 'contact',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.origin),
                accessor: 'origin',
                showGroupedBy: true,
                showColumn: true,
                helpText: t(langKeys.origin_helpText)
                //Cell: cell
            },
            {
                Header: t(langKeys.shipment),
                accessor: 'satisfactory',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.read_singular),
                accessor: 'seen',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.contestedagain),
                accessor: 'answered',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: "Log",
                accessor: 'log',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
        ],
        []
    );

    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.ticketnum })
    }, [mainResult]);

    useEffect(() => {
        if (!multidata.loading && !multidata.error) {
            const stdby = multidata?.data?.[0]?.data || []
            setMaindata(stdby.map(x => {
                x.log = x.satisfactory ? '[Success,{"error"...}]' : x.log
                x.failed = x.failed ? "Ok" : "Fail"
                x.satisfactory = x.satisfactory ? "Ok" : "Fail"
                x.seen = x.seen ? "Ok" : "Fail"
                x.answered = x.answered ? "Ok" : "Fail"
                return x;
            }) || [])
        }
    }, [multidata]);

    return (<div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-3", name: (t('report_hsmshipping') + " " + t(langKeys.detail)) }]}
                    handleClick={setViewSelected}
                />
            </div>
        </div>
        {view !== "GRID" && <div className={classes.containerFilters}>
            <div className={classes.itemFlex}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={multidata.loading || !(multidata?.data?.[0]?.data?.length || 0 > 0)}
                    onClick={() => setShowDialogGraphic(true)}
                    startIcon={<SettingsIcon />}
                >
                    {t(langKeys.configuration)}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setView('GRID')}
                    startIcon={<ListIcon />}
                >
                    {t(langKeys.grid_view)}
                </Button>
            </div>
        </div>}
        {view === "GRID" && <div style={{ position: 'relative', height: '100%' }}>
            <TableZyx
                columns={columns}
                titlemodule={row.row.templatename}
                ButtonsElement={() => (<div className={classes.itemFlex}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={multidata.loading || !(multidata?.data?.[0]?.data?.length || 0 > 0)}
                        onClick={() => setShowDialogGraphic(true)}
                        startIcon={<AssessmentIcon />}
                    >
                        {t(langKeys.graphic_view)}
                    </Button>
                </div>)}
                data={maindata}
                loading={multidata.loading}
                download={true}
                filterGeneral={false}
                groupedBy={true}
                showHideColumns={true}
            />
        </div>}
        {view !== "GRID" && (
            <>
                <div style={{ fontWeight: 500, padding: 16 }}>
                    {t(langKeys.graphic_report_of, { report: t(langKeys.report_hsmshipping), column: t((view.split("-")?.[3] || "summary")) })}
                </div>
                <Graphic
                    graphicType={view.split("-")?.[1] || "BAR"}
                    column={view.split("-")?.[2] || "summary"}
                    openModal={showDialogGraphic}
                    setOpenModal={setShowDialogGraphic}
                    daterange={{}}
                    setView={setView}
                    withFilters={false}
                    withButtons={false}
                    data={maindata}
                    loading={multidata.loading}
                    handlerSearchGraphic={() => null}
                    columnDesc={view.split("-")?.[3] || "summary"}
                />
            </>
        )}
        <SummaryGraphic
            openModal={showDialogGraphic}
            setOpenModal={setShowDialogGraphic}
            setView={setView}
            columns={columns}
        />
        <DialogInteractions
            openModal={openModal}
            setOpenModal={setOpenModal}
            ticket={rowSelected}
        />
    </div>
    )
}
export const ReportHSMShipping: React.FC<DetailProps> = ({ setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainAux = useSelector(state => state.main.mainAux2);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitExport, setWaitExport] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [viewSelected2, setViewSelected2] = useState("view-2");

    const arrayBread = [
        { id: "view-1", name: t(langKeys.report_plural) },
        { id: "view-2", name: t('report_hsmshipping') }
    ];

    const filterChannel = useSelector((state) => state.main.mainAux)
    const multiaux = useSelector((state) => state.main.multiDataAux)
    console.log(multiaux)


    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.templatename),
                accessor: 'templatename',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.templatecategory),
                accessor: 'category',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.sent_plural),
                accessor: 'total',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.successful_plural),
                accessor: 'satisfactory',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.failed_plural),
                accessor: 'failed',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.read),
                accessor: 'seen',
                type: 'number',
                sortType: 'number',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
            {
                Header: t(langKeys.contested),
                type: 'number',
                sortType: 'number',
                accessor: 'answered',
                showGroupedBy: true,
                showColumn: true,
                //Cell: cell
            },
        ],
        []
    );

    const fetchData = () => {
        dispatch(showBackdrop(true))
        dispatch(getCollectionAux2(getHSMShipping(
            {
                startdate: dateRangeCreateDate.startDate,
                enddate: dateRangeCreateDate.endDate,
                communicationchannelid: selectedChannel || 0,
                userSid: selectedUser || ""
            }
        )));
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
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    useEffect(() => {
        if (!mainAux.loading && !mainAux.error) {
            dispatch(showBackdrop(false));
        }
    }, [mainAux]);


    const [selectedChannel, setSelectedChannel] = useState(0);
    const [selectedUser, setSelectedUser] = useState("");
    const fetchFiltersChannels = () => dispatch(getCollectionAux(getCommChannelLst()))

    const handleEdit = (row: Dictionary) => {
        setViewSelected2("view-3");
        dispatch(getMultiCollection([
            getHSMShippingDetail(
                {
                    startdate: dateRangeCreateDate.startDate,
                    enddate: dateRangeCreateDate.endDate,
                    communicationchannelid: selectedChannel || 0,
                    messagetemplateid: row.messagetemplateid
                }
            )
        ]))
        setRowSelected({ row, edit: true });
    };
    const setView = (e: string) => {
        if (e === "view-1") {
            setViewSelected(e)
            setViewSelected2("view-2");
        } else {
            setViewSelected2(e)
        }
    }
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



                    <TableZyx
                        columns={columns}
                        data={mainAux.data}
                        groupedBy={true}
                        showHideColumns={true}
                        loading={mainAux.loading}
                        onClickRow={handleEdit}
                        download={true}
                        ButtonsElement={() => (
                            <>
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
                                        data={filterChannel.data.filter(x => x.type.includes("WHA")) || []}
                                        valueDefault={selectedChannel}
                                        onChange={(value) => setSelectedChannel(value?.communicationchannelid || 0)}
                                        optionDesc="communicationchanneldesc"
                                        optionValue="communicationchannelid"
                                    />
                                    <FieldMultiSelect
                                        label={t(langKeys.user)}
                                        className={classes.filterComponent}
                                        valueDefault={selectedUser}
                                        onChange={(value) => setSelectedUser(value ? value.map((o: Dictionary) => o.userid).join() : '')}
                                        variant="outlined"
                                        data={[{ userid: -1, userdesc: "EXTERNAL" }, ...(multiaux?.data?.[3]?.data || [])]}
                                        optionDesc="userdesc"
                                        optionValue="userid"
                                        disabled={multiaux.loading}
                                    />


                                    <Button
                                        disabled={mainAux.loading}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SearchIcon style={{ color: 'white' }} />}
                                        style={{ width: 120, backgroundColor: "#55BD84" }}
                                        onClick={() => fetchData()}
                                    >
                                        {t(langKeys.search)}
                                    </Button>

                                </div>
                            </>
                        )}
                        filterGeneral={false}
                    />
                </div>

                {openModal && <ModalReport
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    row={rowSelected}
                />}
            </div>
        )
    } else if (viewSelected2 === "view-3") {
        return <ReportHSMShippingDetail
            row={rowSelected}
            arrayBread={arrayBread}
            setViewSelected={setView}
        />
    } else {
        return <div>error</div>
    }
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    row: any;
}

const ModalReport: React.FC<ModalProps> = ({ openModal, setOpenModal, row }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const mainAux = useSelector(state => state.main.mainAux);
    const [waitView, setWaitView] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
            }
        ],
        []
    );

    const handleCancelModal = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        if (row !== null) {
            dispatch(getCollectionAux(getCampaignReportExport(
                [{
                    campaignid: row.id.split('_')[0],
                    rundate: row.id.split('_')[1],
                }]
            )))
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!mainAux.loading && !mainAux.error) {
                setWaitView(false);
            }
        }
    }, [mainAux, waitView]);

    return (
        <DialogZyx
            maxWidth="md"
            open={openModal}
            title={`${row.title} ${convertLocalDate(row.rundate).toLocaleString()}`}
            button1Type="button"
            buttonText1={t(langKeys.close)}
            handleClickButton1={handleCancelModal}
        >
            <div className="row-zyx">
                <TableZyx
                    columns={columns}
                    data={mainAux.data}
                    loading={mainAux.loading}
                    filterGeneral={false}
                    download={false}
                />
            </div>
        </DialogZyx>
    )
}   