/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { convertLocalDate, getListUsers, getClassificationLevel1, getCommChannelLst, getComunicationChannelDelegate, getPaginatedTicket, getTicketExport, getValuesFromDomain, insConversationClassificationMassive, reassignMassiveTicket } from 'common/helpers';
import { getCollectionPaginated, exportData, getMultiCollection, resetMultiMain, resetCollectionPaginated, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData } from '@types'
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box/Box';
import { DialogZyx, FieldMultiSelect, FieldSelect, FieldEditMulti } from 'components';
import clsx from 'clsx';
import { DialogInteractions } from 'components';
import { useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { massiveCloseTicket, getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, emitEvent } from 'store/inbox/actions';

const selectionKey = 'conversationid';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
        color: theme.palette.text.primary,
    },

    containerFilter: {
        width: '100%',
        marginBottom: theme.spacing(2),
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
    },
    filterComponent: {
        width: '300px',
        backgroundColor: '#FFF'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    filterStatus: {
        fontWeight: 500,
        fontSize: 16,
        cursor: 'pointer'
    },
    filterStatusActive: {
        color: theme.palette.primary.main,
    }
}));

const DialogCloseticket: React.FC<{ fetchData: () => void, setOpenModal: (param: any) => void, openModal: boolean, rowWithDataSelected: Dictionary[] }> = ({ setOpenModal, openModal, rowWithDataSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const closingRes = useSelector(state => state.inbox.triggerMassiveCloseTicket);
    
    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitClose) {
            if (!closingRes.loading && !closingRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                fetchData()
                setWaitClose(false);
            } else if (closingRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.error_unexpected_error) }))
                dispatch(showBackdrop(false));
                setWaitClose(false);
            }
        }
    }, [closingRes, waitClose])

    useEffect(() => {
        if (openModal) {
            reset({
                motive: '',
                observation: ''
            })
            register('motive', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('observation');
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        // rowWithDataSelected
        const listTicketsToClose = rowWithDataSelected.map(row => ({
            conversationid: row.conversationid,
            asesoridfinal: row.asesoridfinal,
            numeroticket: row.numeroticket,
            communicationchannelsite: row.communicationchannelsite,
            personcommunicationchanneltype: row.personcommunicationchanneltype,
            personcommunicationchannel: row.personcommunicationchannel,
            communicationchannelid: row.communicationchannelid,
        }));
        dispatch(massiveCloseTicket({
            motive: data.motive,
            observation: data.observation,
            listTickets: listTicketsToClose,
        }))
        dispatch(showBackdrop(true));
        setWaitClose(true);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.close_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.closing_reason)}
                    className="col-12"
                    valueDefault={getValues('motive')}
                    onChange={(value) => setValue('motive', value ? value.domainvalue : '')}
                    error={errors?.motive?.message}
                    data={multiData?.data[2] && multiData?.data[2].data}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEditMulti
                    label={t(langKeys.observation)}
                    valueDefault={getValues('observation')}
                    className="col-12"
                    onChange={(value) => setValue('observation', value)}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const DialogReassignticket: React.FC<{ fetchData: () => void, setOpenModal: (param: any) => void, openModal: boolean, rowWithDataSelected: Dictionary[] }> = ({ setOpenModal, openModal, rowWithDataSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitReassign, setWaitReassign] = useState(false);

    const [agentsConnected, setAgentsConnected] = useState<Dictionary[]>([]);
    const multiData = useSelector(state => state.main.multiData);
    const reassigningRes = useSelector(state => state.inbox.triggerReassignTicket);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<{
        newUserId: number;
        observation: string;
    }>();

    useEffect(() => {
        if (waitReassign) {
            if (!reassigningRes.loading && !reassigningRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_reasign_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitReassign(false);

                rowWithDataSelected.map(ticket => ({
                    ticketnum: ticket.numeroticket,
                    displayname: ticket.name,
                    lastmessage: "",
                    personcommunicationchannel: ticket.personcommunicationchannel,
                    conversationid: ticket.conversationid,
                    personid: ticket.personid,
                    communicationchannelid: ticket.communicationchannelid,
                    interactionid: 0,
                    communicationchanneltype: ticket.personcommunicationchanneltype,
                    imageurldef: ticket.imageurldef,
                    communicationchannelsite: ticket.communicationchannelsite,
                    lastuserid: ticket.asesoridfinal,
                    firstconversationdate: ticket.fechainicio,
                    userid: ticket.asesoridfinal,
                    status: "ASIGNADO",
                    countnewmessages: 0,
                    channelicon: ticket.channelicon,
                    coloricon: ticket.coloricon,
                    newConversation: true,
                    postexternalid: ticket.postexternalid,
                    commentexternalid: ticket.commentexternalid,
                    replyexternalid: ticket.replyexternalid,
                    tdatime: ticket.tdatime,
                    isAnswered: false,
                })).forEach(ticket => dispatch(emitEvent({
                    event: 'reassignTicket',
                    data: {
                        ...ticket,
                        newuserid: getValues('newUserId'),
                    }
                })))
            } else if (reassigningRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.error_unexpected_error) }))
                dispatch(showBackdrop(false));
                setWaitReassign(false);
            }
        }
    }, [reassigningRes, waitReassign])

    useEffect(() => {
        if (multiData && multiData?.data[3])
            setAgentsConnected(multiData?.data[3].data)
    }, [multiData])

    useEffect(() => {
        if (openModal) {
            reset({
                newUserId: 0,
                observation: ''
            })
            register('newUserId', { validate: (value) => ((value && value > 0) || (t(langKeys.field_required) + "")) });
            register('observation');
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        const listConversation = rowWithDataSelected.map(x => x.conversationid).join();

        dispatch(execute(reassignMassiveTicket(listConversation, data.newUserId, data.observation)));
        dispatch(showBackdrop(true));
        setWaitReassign(true);

    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reassign_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.user_plural)}
                    className="col-12"
                    valueDefault={"" + getValues('newUserId')}
                    onChange={(value) => setValue('newUserId', value ? value.userid : 0)}
                    error={errors?.newUserId?.message}
                    data={agentsConnected}
                    optionDesc="displayname"
                    optionValue="userid"
                />
                <FieldEditMulti
                    label={t(langKeys.observation)}
                    valueDefault={getValues('observation')}
                    className="col-12"
                    onChange={(value) => setValue('observation', value)}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const DialogTipifications: React.FC<{ fetchData: () => void, setOpenModal: (param: any) => void, openModal: boolean, rowWithDataSelected: Dictionary[] }> = ({ setOpenModal, openModal, rowWithDataSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitTipify, setWaitTipify] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const tipificationLevel2 = useSelector(state => state.inbox.tipificationsLevel2);
    const tipificationLevel3 = useSelector(state => state.inbox.tipificationsLevel3);

    const tipifyRes = useSelector(state => state.main.execute);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitTipify) {
            if (!tipifyRes.loading && !tipifyRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_tipify_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitTipify(false);
                fetchData()
            } else if (tipifyRes.error) {
                const message = t(tipifyRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message }))
                dispatch(showBackdrop(false));
                setWaitTipify(false);
            }
        }
    }, [tipifyRes, waitTipify])

    useEffect(() => {
        if (openModal) {
            dispatch(resetGetTipificationLevel2())
            dispatch(resetGetTipificationLevel3())
            reset({
                classificationid1: 0,
                path1: '',
                classificationid2: 0,
                path2: '',
                classificationid3: 0,
                path3: '',
            })
            register('path1');
            register('classificationid1', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('path2');
            register('classificationid2', { validate: (value) => ((value && value > 0) || t(langKeys.field_required)) });
            register('path3');
            register('classificationid3');

        }
    }, [openModal])

    const onChangeTipificationLevel1 = (value: Dictionary) => {
        setValue('classificationid1', value ? value.classificationid : '');
        setValue('path1', value ? value.path : '');
        setValue('classificationid2', 0);
        setValue('path2', '');
        setValue('classificationid3', 0);
        setValue('path3', '');

        if (value)
            dispatch(getTipificationLevel2(value.classificationid))
        else
            dispatch(resetGetTipificationLevel2())
    }

    const onChangeTipificationLevel2 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '');
        setValue('path2', value ? value.path : '');
        setValue('classificationid3', 0);
        setValue('path3', '');
        if (value)
            dispatch(getTipificationLevel3(value.classificationid))
        else
            dispatch(resetGetTipificationLevel3())
    }

    const onChangeTipificationLevel3 = (value: Dictionary) => {
        setValue('classificationid2', value ? value.classificationid : '')
        setValue('path2', value ? value.path : '')
    }

    const onSubmit = handleSubmit((data) => {
        dispatch(showBackdrop(true));
        dispatch(execute(insConversationClassificationMassive(rowWithDataSelected.map(x => x.conversationid).join(), data.classificationid3 || data.classificationid2)))
        setWaitTipify(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.tipify_ticket) + "s"}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.continue)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 1`}
                    className="col-12"
                    valueDefault={getValues('classificationid1')}
                    onChange={onChangeTipificationLevel1}
                    error={errors?.classificationid1?.message}
                    data={multiData?.data[4] && multiData?.data[4].data}
                    optionDesc="path"
                    optionValue="classificationid"
                />
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 2`}
                    className="col-12"
                    valueDefault={getValues('classificationid2')}
                    onChange={onChangeTipificationLevel2}
                    loading={tipificationLevel2.loading}
                    error={errors?.classificationid2?.message}
                    data={tipificationLevel2.data}
                    optionDesc="path"
                    optionValue="classificationid"
                />
                <FieldSelect
                    label={`${t(langKeys.tipification)} ${t(langKeys.level)} 3`}
                    className="col-12"
                    valueDefault={getValues('classificationid3')}
                    onChange={onChangeTipificationLevel3}
                    loading={tipificationLevel3.loading}
                    error={errors?.classificationid3?.message}
                    data={tipificationLevel3.data}
                    optionDesc="path"
                    optionValue="classificationid"
                />
            </div>
        </DialogZyx>)
}

const Tickets = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);

    const [allParameters, setAllParameters] = useState({});
    //const format = (date: Date) => date.toISOString().split('T')[0];

    const [filterStatus, setFilterStatus] = useState('')

    const [openDialogTipify, setOpenDialogTipify] = useState(false);
    const [openDialogClose, setOpenDialogClose] = useState(false);
    const [openDialogReassign, setOpenDialogReassign] = useState(false);

    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [waitSave, setWaitSave] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [fetchDataAux, setfetchDataAux] = useState<IFetchData>({ pageSize: 0, pageIndex: 0, filters: {}, sorts: {}, daterange: null })

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => mainPaginated.data.find(y => y.conversationid === parseInt(x)) || p.find(y => y.conversationid === parseInt(x)) || {}))
        }
    }, [selectedRows])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_numeroticket),
                accessor: 'numeroticket',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => openDialogInteractions(row)}
                        >
                            {row.numeroticket}
                        </label>
                    )
                }
            },
            {
                Header: t(langKeys.ticket_fecha),
                accessor: 'fecha',
                type: 'date',
            },
            {
                Header: t(langKeys.ticket_firstusergroup),
                accessor: 'firstusergroup'
            },
            {
                Header: t(langKeys.ticket_ticketgroup),
                accessor: 'ticketgroup'
            },
            {
                Header: t(langKeys.ticket_communicationchanneldescription),
                accessor: 'communicationchanneldescription'
            },
            {
                Header: t(langKeys.ticket_name),
                accessor: 'name'
            },
            {
                Header: t(langKeys.ticket_canalpersonareferencia),
                accessor: 'canalpersonareferencia'
            },
            {
                Header: t(langKeys.ticket_fechainicio),
                accessor: 'fechainicio',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.fechainicio).toLocaleString()
                }
            },
            {
                Header: t(langKeys.ticket_fechafin),
                accessor: 'fechafin',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechafin ? convertLocalDate(row.fechafin).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.ticket_fechaprimeraconversacion),
                accessor: 'fechaprimeraconversacion',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechaprimeraconversacion ? convertLocalDate(row.fechaprimeraconversacion).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.ticket_fechaultimaconversacion),
                accessor: 'fechaultimaconversacion',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechaultimaconversacion ? convertLocalDate(row.fechaultimaconversacion).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                accessor: 'fechahandoff',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechahandoff ? convertLocalDate(row.fechahandoff).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.ticket_asesorinicial),
                accessor: 'asesorinicial'
            },
            {
                Header: t(langKeys.ticket_asesorfinal),
                accessor: 'asesorfinal'
            },
            {
                Header: t(langKeys.ticket_supervisor),
                accessor: 'supervisor'
            },
            {
                Header: t(langKeys.ticket_empresa),
                accessor: 'empresa'
            },
            {
                Header: t(langKeys.ticket_attentiongroup),
                accessor: 'attentiongroup'
            },
            {
                Header: t(langKeys.ticket_classification),
                accessor: 'classification'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuesta),
                accessor: 'tiempopromediorespuesta',
                type: 'time',
            },
            {
                Header: t(langKeys.ticket_tiempoprimerarespuestaasesor),
                accessor: 'tiempoprimerarespuestaasesor',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestaasesor),
                accessor: 'tiempopromediorespuestaasesor',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestapersona),
                accessor: 'tiempopromediorespuestapersona',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_duraciontotal),
                accessor: 'duraciontotal',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_duracionreal),
                accessor: 'duracionreal',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_duracionpausa),
                accessor: 'duracionpausa',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tmoasesor),
                accessor: 'tmoasesor',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tiempoprimeraasignacion),
                accessor: 'tiempoprimeraasignacion',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_estadoconversacion),
                accessor: 'estadoconversacion'
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: 'tipocierre'
            },
            {
                Header: t(langKeys.ticket_tipification),
                accessor: 'tipification'
            },
            {
                Header: t(langKeys.ticket_firstname),
                accessor: 'firstname'
            },
            {
                Header: t(langKeys.ticket_contact),
                accessor: 'contact'
            },
            {
                Header: t(langKeys.ticket_lastname),
                accessor: 'lastname'
            },
            {
                Header: t(langKeys.ticket_email),
                accessor: 'email'
            },
            {
                Header: t(langKeys.ticket_phone),
                accessor: 'phone'
            },
            {
                Header: t(langKeys.ticket_balancetimes),
                accessor: 'balancetimes',
                type: 'number',
                sortType: 'number',
            },
            {
                Header: t(langKeys.ticket_documenttype),
                accessor: 'documenttype'
            }
            ,
            {
                Header: t(langKeys.ticket_dni),
                accessor: 'dni'
            },
            {
                Header: t(langKeys.ticket_abandoned),
                accessor: 'abandoned',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.abandoned ? t(langKeys.affirmative) : t(langKeys.negative)
                }
            },
            {
                Header: t(langKeys.ticket_enquiries),
                accessor: 'enquiries'
            },
            {
                Header: t(langKeys.ticket_labels),
                accessor: 'labels'
            },
            {
                Header: t(langKeys.ticket_tdatime),
                accessor: 'tdatime',
                type: 'time'
            }
        ],
        []
    );

    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        dispatch(exportData(getTicketExport({
            filters: {
                ...filters,
                ...(filterStatus ? {
                    estadoconversacion: {
                        value: filterStatus,
                        operator: "equals"
                    }
                } : {})
            },
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            ...allParameters
        })));
        dispatch(showBackdrop(true));
        setWaitSave(true);
    };

    const fetchData = ({ pageSize, pageIndex, filters, sorts, daterange }: IFetchData) => {
        setfetchDataAux({ pageSize, pageIndex, filters, sorts, daterange })
        dispatch(getCollectionPaginated(getPaginatedTicket({
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            take: pageSize,
            skip: pageIndex * pageSize,
            sorts: sorts,
            filters: {
                ...filters,
                ...(filterStatus ? {
                    estadoconversacion: {
                        value: filterStatus,
                        operator: "equals"
                    }
                } : {})
            },
            ...allParameters
        })))
    };

    const fetchDataAux2 = () => {
        fetchData(fetchDataAux);
    };

    useEffect(() => {
        if (fetchDataAux.pageSize) {
            fetchData(fetchDataAux);
        }
    }, [filterStatus])

    useEffect(() => {
        dispatch(getMultiCollection([
            getCommChannelLst(),
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("MOTIVOCIERRE"),
            getComunicationChannelDelegate(""),
            getClassificationLevel1("TIPIFICACION"),
            getListUsers(),
        ]));

        return () => {
            dispatch(resetCollectionPaginated());
            dispatch(resetMultiMain());
        };
    }, []);

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated])

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
    }, [resExportData, waitSave])

    return (
        <div className={classes.container}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" style={{ gap: 8 }}>
                <div>
                    <div className={classes.title}>
                        {t(langKeys.ticket_plural)}
                    </div>
                    <div style={{ display: 'flex', gap: 32 }}>
                        <div
                            className={clsx(classes.filterStatus, {
                                [classes.filterStatusActive]: filterStatus === '',
                            })}
                            onClick={() => setFilterStatus('')}
                        >{t(langKeys.all)}
                        </div>
                        <div
                            className={clsx(classes.filterStatus, {
                                [classes.filterStatusActive]: filterStatus === 'ASIGNADO',
                            })}
                            onClick={() => setFilterStatus('ASIGNADO')}
                        >{t(langKeys.assigned)}
                        </div>
                        <div
                            className={clsx(classes.filterStatus, {
                                [classes.filterStatusActive]: filterStatus === 'CERRADO',
                            })}
                            onClick={() => setFilterStatus('CERRADO')}
                        >{t(langKeys.closed)}
                        </div>
                        <div
                            className={clsx(classes.filterStatus, {
                                [classes.filterStatusActive]: filterStatus === 'PENDIENTE',
                            })}
                            onClick={() => setFilterStatus('PENDIENTE')}
                        >{t(langKeys.pending)}
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {mainResult?.multiData?.data[0]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.channel_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_channel"
                                onChange={(value) => setValue("channel", value ? value.map((o: Dictionary) => o.communicationchannelid).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[0]?.data}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                                disabled={mainPaginated.loading}
                            />
                        }

                        {mainResult?.multiData?.data[1]?.data &&
                            <FieldMultiSelect
                                label={t(langKeys.group_plural)}
                                className={classes.filterComponent}
                                key="fieldMultiSelect_group"
                                onChange={(value) => setValue("usergroup", value ? value.map((o: Dictionary) => o.domainvalue).join() : '')}
                                variant="outlined"
                                data={mainResult?.multiData?.data[1]?.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                disabled={mainPaginated.loading}
                            />
                        }
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            disabled={rowWithDataSelected.length === 0}
                            color="primary"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
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
                            onClose={handleClose}
                        >
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                setOpenDialogReassign(true)
                            }}>{t(langKeys.reassign_ticket)}
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                setOpenDialogClose(true)
                            }}>{t(langKeys.close_ticket)}
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                setAnchorEl(null)
                                setOpenDialogTipify(true)
                            }}>{t(langKeys.tipify_ticket)}
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </Box>
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
                useSelection={true}
                selectionFilter={{ key: 'estadoconversacion', value: 'ASIGNADO' }}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
            />

            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <DialogTipifications
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowWithDataSelected}
                openModal={openDialogTipify}
                setOpenModal={setOpenDialogTipify}
            />
            <DialogCloseticket
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowWithDataSelected}
                openModal={openDialogClose}
                setOpenModal={setOpenDialogClose}
            />
            <DialogReassignticket
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowWithDataSelected}
                openModal={openDialogReassign}
                setOpenModal={setOpenDialogReassign}
            />
        </div>
    )
}

export default Tickets;