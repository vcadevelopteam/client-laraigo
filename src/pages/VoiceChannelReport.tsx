/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { DialogZyx, FieldSelect } from 'components';
import { getPaginatedReportVoiceCall, getRecordHSMGraphic, getRecordHSMReport, getReportGraphic, getVoiceCallReportExport } from 'common/helpers';
import { Dictionary, IFetchData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanViewChange, exportData, getCollectionPaginated, getMainGraphic, getMultiCollectionAux2, resetMultiMain, setViewChange } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import InfoIcon from '@material-ui/icons/Info';
import ClearIcon from '@material-ui/icons/Clear';
import {
    Search as SearchIcon,
} from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import Graphic from 'components/fields/Graphic';
import AssessmentIcon from '@material-ui/icons/Assessment';
import TablePaginated from 'components/fields/table-paginated';
import { IconButton, Tooltip } from '@material-ui/core';
import { CallRecordIcon } from 'icons';
import { VoximplantService } from 'network';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailVoiceChannelReportProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
}

const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}
const useStyles = makeStyles((theme) => ({
    containerHeader: {
        padding: theme.spacing(1),
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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

const columnsTemp = [
    "ticketnum",
    "channel",
    "ticketdate",
    "tickettime",
    "finishtime",
    "handoffdate",
    "agent",
    "name",
    "phone",
    "origin",
    "closetype",
    "classification",
    "totalduration",
    "agentduration",
    "customerwaitingduration",
    "holdingtime",
    "transferduration"
]

const DetailVoiceChannelReport: React.FC<DetailVoiceChannelReportProps> = ({ data: { row }, setViewSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiDataAux2 = useSelector(state => state.main.multiDataAux2);

    function search(){
        dispatch(showBackdrop(true))
        dispatch(getMultiCollectionAux2([
            getRecordHSMReport({
                name: row?.name || "",
                from: row?.from || "",
                date: row?.shippingdate || "",
                type: row?.type || "",
            })
        ]))
    }
    useEffect(() => {
        if (!multiDataAux2.loading){
            dispatch(showBackdrop(false))
        }
    }, [multiDataAux2])

    useEffect(() => {
        search()
    }, [])
    

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.recipientsname),
                accessor: 'clientname',
                NoFilter: false
            },
            {
                Header: t(langKeys.contact),
                accessor: 'contact',
                NoFilter: false
            },
            {
                Header: `${t(langKeys.channel)}`,
                accessor: 'channel',
                NoFilter: false
            },
            {
                Header: `${t(langKeys.origin)}`,
                accessor: 'origin',
                NoFilter: false
            },
            {
                Header: t(langKeys.group),
                accessor: 'group',
                NoFilter: false
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: false,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.communicationtemplate),
                accessor: 'templatename',
                NoFilter: false
            },
            {
                Header: t(langKeys.body),
                accessor: 'body',
                NoFilter: false
            },
            {
                Header: t(langKeys.log),
                accessor: 'log',
                NoFilter: false
            },
        ],
        [t]
    );

    return (
        <div style={{width: '100%'}}>
            <div className={classes.containerDetail}>
                <TableZyx
                    titlemodule={`${row?.name_translated} (${row?.shippingdate})` || `${t(langKeys.recordhsmreport)} ${t(langKeys.detail)}`}
                    ButtonsElement={() => (
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    columns={columns}
                    data={multiDataAux2.data[0]?.data||[]}
                    download={true}
                    loading={multiDataAux2.loading}
                    register={false}
                    filterGeneral={false}
                // fetchData={fetchData}
                />
            </div>
        </div>
    );
}

const VoiceChannelReport: FC = () => {
    
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const multiData = useSelector(state => state.main.multiData);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [openModal, setOpenModal] = useState(false);
    const [view, setView] = useState('GRID');
    const classes = useStyles()

    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })

    useEffect(() => {
        dispatch(setViewChange("voicecallreport"))
        return () => {
            dispatch(cleanViewChange());
        }
    }, [])
    
    const downloadCallRecord = async (ticket: Dictionary) => {
        // dispatch(getCallRecord({call_session_history_id: ticket.postexternalid}));
        // setWaitDownloadRecord(true);
        try {
            const axios_result = await VoximplantService.getCallRecord({call_session_history_id: ticket.postexternalid});
            if (axios_result.status === 200) {
                let buff = Buffer.from(axios_result.data, 'base64');
                const blob = new Blob([buff], {type: axios_result.headers['content-type'].split(';').find((x: string) => x.includes('audio'))});
                const objectUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.download = ticket.ticketnum;
                a.click();
            }
        }
        catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
        }
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'postexternalid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.postexternalid
                        && row.callanswereddate ?
                        <Tooltip title={t(langKeys.download_record) || ""}>
                            <IconButton size="small" onClick={() => downloadCallRecord(row)}
                            >
                                <CallRecordIcon style={{ fill: '#7721AD' }} />
                            </IconButton>
                        </Tooltip>
                        : null
                    )
                }
            },
            {
                Header: `N° ${t(langKeys.ticket_numeroticket)}`,
                accessor: 'ticketnum',
                NoFilter: false,
            },
            {
                Header: t(langKeys.channel),
                accessor: 'channel',
                NoFilter: false
            },
            {
                Header: t(langKeys.date),
                accessor: 'ticketdate',
                NoFilter: false, 
                type: 'date'
            },
            {
                Header: `${t(langKeys.starttimecall)}`,
                accessor: 'tickettime',
                NoFilter: false,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.tickettime||"00:00:00")
                }
            },
            {
                Header: `${t(langKeys.finishtimecall)}`,
                accessor: 'finishtime',
                NoFilter: false,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.finishtime||"00:00:00")
                }
            },
            {
                Header: t(langKeys.transfertimecall),
                accessor: 'handoffdate',
                NoFilter: false,
                helpText: t(langKeys.transfertimecall_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.handoffdate||"00:00:00")
                }
            },
            {
                Header: t(langKeys.lastadvisername),
                accessor: 'agent',
                NoFilter: false,
            },
            {
                Header: t(langKeys.person),
                accessor: 'name',
                NoFilter: false
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone',
                NoFilter: false
            },
            {
                Header: t(langKeys.origin),
                accessor: 'origin',
                NoFilter: false
            },
            {
                Header: t(langKeys.closetype),
                accessor: 'closetype',
                NoFilter: false
            },
            {
                Header: t(langKeys.tipification),
                accessor: 'classification',
                NoFilter: false,
                helpText: t(langKeys.tipification_tooltip)
            },
            {
                Header: t(langKeys.totalTime),
                accessor: 'totalduration',
                NoFilter: false,
                helpText: t(langKeys.totalTime_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.totalduration||"00:00:00")
                }
            },
            {
                Header: t(langKeys.advisorattentiontime),
                accessor: 'agentduration',
                NoFilter: false,
                helpText: t(langKeys.advisorattentiontime_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.agentduration||"00:00:00")
                }
            },
            {
                Header: t(langKeys.customerwaitingtime),
                accessor: 'customerwaitingduration',
                NoFilter: false,
                helpText: t(langKeys.customerwaitingtime_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.customerwaitingduration||"00:00:00")
                }
            },
            {
                Header: t(langKeys.callwaitingtime),
                accessor: 'holdingtime',
                NoFilter: false,
                helpText: t(langKeys.callwaitingtime_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.holdingtime||"00:00:00")
                }
            },
            {
                Header: t(langKeys.transfertime),
                accessor: 'transferduration',
                NoFilter: false,
                helpText: t(langKeys.transfertime_tooltip),
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (row.transferduration||"00:00:00")
                }
            },
        ],
        [t]
    );

    useEffect(() => {
        if (!multiData.loading){
            dispatch(showBackdrop(false));
        }
    }, [multiData])

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedReportVoiceCall({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
            },
        })))
    };
    
    useEffect(() => {
        return () => {
            dispatch(resetMultiMain());
        }
    }, [])

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);
    
    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

    
    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.map(x => ({
            key: x.accessor,
            alias: x.Header,
        }));
        dispatch(exportData(getVoiceCallReportExport(
            {
                startdate: daterange.startDate!,
                enddate: daterange.endDate!,
                sorts,
                filters: filters,
            }), "", "excel", false, columnsExport));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitSave) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                resExportData.url?.split(",").forEach(x => window.open(x, '_blank'))
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resExportData, waitSave])
    
    useEffect(() => {
        dispatch(setViewChange("recordhsmreport"))
        return () => {
            dispatch(cleanViewChange());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handlerSearchGraphic = (daterange: any, column: string) => {
        setfetchDataAux(prev => ({ ...prev, daterange }));
        dispatch(getMainGraphic(getReportGraphic(
            "UFN_REPORT_VOICECALL_GRAPHIC",
            "voicecall",
            {
                filters: {},
                sorts: {},
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column,
                summarization: 'COUNT',
            }
        )));
    }

    if (viewSelected === "view-1") {

        return (
            <React.Fragment>
                <div style={{ height: 10 }}></div>
                {view === "GRID" ? (
                    <TablePaginated
                        //onClickRow={handleView}    
                        columns={columns}
                        fetchData={fetchData}
                        data={mainPaginated.data}
                        totalrow={totalrow}
                        download={true}
                        pageCount={pageCount}
                        autotrigger={true}
                        filterrange={true}
                        filterGeneral={false}
                        exportPersonalized={triggerExportData}
                        loading={mainPaginated.loading}
                        register={false}
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
                    />
                ) : (
                    <Graphic
                        graphicType={view.split("-")?.[1] || "BAR"}
                        column={view.split("-")?.[2] || "summary"}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        daterange={fetchDataAux.daterange}
                        setView={setView}
                        row={{origin: 'voicecall'}}
                        handlerSearchGraphic={handlerSearchGraphic}
                    />
                )}
                <SummaryGraphic
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    setView={setView}
                    daterange={fetchDataAux.daterange}
                    columns={columnsTemp.map(c => ({
                        key: c, value: `report_voicecall_${c}`
                    }))}
                    columnsprefix='report_voicecall_'
                />
            </React.Fragment>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailVoiceChannelReport
                data={rowSelected}
                setViewSelected={setViewSelected}
            />
        )
    } 
    else
        return null;

}

interface SummaryGraphicProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    setView: (value: string) => void;
    row?: Dictionary | null;
    daterange: any;
    filters?: Dictionary;
    columns: any[];
    columnsprefix: string;
}

const SummaryGraphic: React.FC<SummaryGraphicProps> = ({ openModal, setOpenModal, setView, row, daterange, filters, columns, columnsprefix }) => {
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
        dispatch(getMainGraphic(getRecordHSMGraphic(
            {
                startdate: daterange?.startDate!,
                enddate: daterange?.endDate!,
                column: data.column,
                summarization: 'COUNT'
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
                    data={columns}
                    optionDesc="value"
                    optionValue="key"
                    uset={true}
                    prefixTranslation=""
                />
            </div>
        </DialogZyx>
    )
}

export default VoiceChannelReport;