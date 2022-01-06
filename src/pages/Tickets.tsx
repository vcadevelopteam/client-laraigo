/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { convertLocalDate, getListUsers, getClassificationLevel1, getCommChannelLst, getComunicationChannelDelegate, getPaginatedTicket, getTicketExport, getValuesFromDomainLight, insConversationClassificationMassive, reassignMassiveTicket, getUserSel, getHistoryStatusConversation, getCampaignLst } from 'common/helpers';
import { getCollectionPaginated, exportData, getMultiCollection, resetAllMain, execute, getCollectionAux, resetMainAux } from 'store/main/actions';
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
import TableZyx from 'components/fields/table-simple';
import { DialogInteractions } from 'components';
import { useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { CloseTicketIcon, HistoryIcon, TipifyIcon, ReassignIcon } from 'icons';
import { massiveCloseTicket, getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, emitEvent } from 'store/inbox/actions';
import { Button, ListItemIcon } from '@material-ui/core';

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
        width: '250px'
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
            buttonText2={t(langKeys.save)}
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
    const multiData = useSelector(state => state.main.multiData);
    const userList = useSelector(state => state.main.mainAux);
    const reassigningRes = useSelector(state => state.inbox.triggerReassignTicket);
    const [groupsList, setGroupsList] = useState<Dictionary[]>([]);
    const user = useSelector(state => state.login.validateToken.user);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<{
        newUserId: number;
        observation: string;
        newUserGroup: string;
    }>();

    useEffect(() => {
        if (waitReassign) {
            if (!reassigningRes.loading && !reassigningRes.error) {
                const touserid = getValues('newUserGroup') !== "" && getValues('newUserId') === 0 ? 3 : getValues('newUserId');
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
                        wasanswered: true,
                        newuserid: touserid,
                        newUserGroup: getValues('newUserGroup'),
                        lastmessage: `${user?.firstname} ${user?.lastname} reasignó este ticket ${touserid === 3 ? 'HOLDING(' + getValues('newUserGroup') + ")" : ''}`
                    }
                })))
                fetchData();
            } else if (reassigningRes.error) {
                dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.error_unexpected_error) }))
                dispatch(showBackdrop(false));
                setWaitReassign(false);
            }
        }
    }, [reassigningRes, waitReassign])

    useEffect(() => {
        if (openModal) {
            reset({
                newUserId: 0,
                observation: '',
                newUserGroup: '',
            })
            register('newUserId');
            register('observation');
            register('newUserGroup');

            const groupsList = multiData?.data[6]?.data || [];
            if (rowWithDataSelected.length === 1) {
                const { ticketgroup } = rowWithDataSelected[0];
                setGroupsList(ticketgroup ? groupsList.filter(group => group.domainvalue !== ticketgroup) : groupsList);
            } else {
                setGroupsList(groupsList);
            }
            dispatch(getCollectionAux(getListUsers()));
        } else {
            dispatch(resetMainAux());
        }
    }, [openModal])

    const onSubmit = handleSubmit((data) => {
        if (data.newUserId === 0 && !data.newUserGroup) {
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.least_user_or_group) }))
            return;
        }
        const listConversation = rowWithDataSelected.map(x => x.conversationid).join();

        dispatch(execute(reassignMassiveTicket(listConversation, data.newUserId, data.observation, data.newUserGroup)));
        dispatch(showBackdrop(true));
        setWaitReassign(true);

    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reassign_ticket)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.reassign)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.agent_plural)}
                    className="col-12"
                    valueDefault={"" + getValues('newUserId')}
                    onChange={(value) => setValue('newUserId', value ? value.userid : 0)}
                    error={errors?.newUserId?.message}
                    data={userList.data.filter(x => x.status === 'ACTIVO')}
                    loading={userList.loading}
                    optionDesc="displayname"
                    optionValue="userid"
                />
                <FieldSelect
                    label={t(langKeys.group_plural)}
                    className="col-12"
                    valueDefault={getValues('newUserGroup')}
                    onChange={(value) => setValue('newUserGroup', value ? value.domainvalue : '')}
                    error={errors?.newUserGroup?.message}
                    data={groupsList}
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
            register('classificationid2');
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
        dispatch(execute(insConversationClassificationMassive(rowWithDataSelected.map(x => x.conversationid).join(), data.classificationid3 || data.classificationid2 || data.classificationid1)))
        setWaitTipify(true)
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.tipify_ticket) + "s"}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
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

const IconOptions: React.FC<{
    disabled?: boolean,
    onHandlerReassign?: (e?: any) => void;
    onHandlerClassify?: (e?: any) => void;
    onHandlerClose?: (e?: any) => void;
    onHandlerShowHistory?: (e?: any) => void;
}> = ({ onHandlerReassign, onHandlerClassify, onHandlerClose, onHandlerShowHistory, disabled }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t } = useTranslation();

    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"
                disabled={disabled}
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
                {onHandlerReassign &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerReassign();
                    }}>
                        <ListItemIcon color="inherit">
                            <ReassignIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.reassign_ticket)}
                    </MenuItem>
                }
                {onHandlerClassify &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerClassify();
                    }}>
                        <ListItemIcon>
                            <TipifyIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.tipify_ticket)}
                    </MenuItem>
                }
                {onHandlerClose &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerClose();
                    }}>
                        <ListItemIcon>
                            <CloseTicketIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.close_ticket)}
                    </MenuItem>
                }
                {onHandlerShowHistory &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerShowHistory();
                    }}>
                        <ListItemIcon>
                            <HistoryIcon width={18} style={{ fill: '#2E2C34' }} />
                        </ListItemIcon>
                        {t(langKeys.status_history)}
                    </MenuItem>
                }
            </Menu>
        </>
    )
}

const DialogHistoryStatus: React.FC<{ ticket: Dictionary | null, openModal: boolean, setOpenModal: (param: any) => void }> = ({ ticket, openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const resultHistory = useSelector(state => state.main.mainAux);

    useEffect(() => {
        if (openModal) {
            if (ticket) {
                dispatch(getCollectionAux(getHistoryStatusConversation(ticket.personid, ticket.conversationid, ticket.communicationchannelid)))
            }
        }
    }, [ticket, openModal])

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.status),
                accessor: 'status',
            },
            {
                Header: t(langKeys.changeDate),
                accessor: 'createdate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.person_who_modified),
                accessor: 'fullname',
            },
        ],
        []
    );

    return (
        <DialogZyx
            open={openModal}
            maxWidth="md"
            title={`${t(langKeys.status_history)} ticket ${ticket?.numeroticket}`}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
        >
            <TableZyx
                columns={columns}
                // titlemodule={t(langKeys.hi, { count: 2 })}
                data={resultHistory.data}
                filterGeneral={false}
                download={false}
                loading={resultHistory.loading}
                register={false}
            />
        </DialogZyx>
    )
}

const Tickets = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const dispatch = useDispatch();

    const [allParameters, setAllParameters] = useState<Dictionary>({});
    const [openDialogTipify, setOpenDialogTipify] = useState(false);
    const [openDialogClose, setOpenDialogClose] = useState(false);
    const [openDialogReassign, setOpenDialogReassign] = useState(false);
    const [openDialogShowHistory, setOpenDialogShowHistory] = useState(false);

    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    const resExportData = useSelector(state => state.main.exportData);
    const [rowToSend, setRowToSend] = useState<Dictionary[]>([]);
    const [waitSave, setWaitSave] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [userList, setUserList] = useState<Dictionary[]>([])
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
                accessor: 'leadid',
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const ticket = props.cell.row.original;

                    return (
                        <IconOptions
                            onHandlerReassign={ticket.estadoconversacion === "CERRADO" ? undefined : () => {
                                setRowToSend([ticket]);
                                setOpenDialogReassign(true);
                            }}
                            onHandlerClassify={ticket.estadoconversacion === "CERRADO" ? undefined : () => {
                                setRowToSend([ticket]);
                                setOpenDialogTipify(true);
                            }}
                            onHandlerClose={ticket.estadoconversacion === "CERRADO" ? undefined : () => {
                                setRowToSend([ticket]);
                                setOpenDialogClose(true);
                            }}
                            onHandlerShowHistory={() => {
                                setOpenDialogShowHistory(true);
                                setRowSelected(ticket);
                                setRowToSend([ticket]);
                            }}
                        />
                    )
                }
            },
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
                Header: t(langKeys.ticket_communicationchanneldescription),
                accessor: 'communicationchanneldescription'
            },
            {
                Header: t(langKeys.ticket_name),
                accessor: 'name',
            },
            {
                Header: t(langKeys.ticket_phone),
                accessor: 'phone'
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
                Header: t(langKeys.status),
                accessor: 'estadoconversacion'
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: 'tipocierre'
            },
            {
                Header: t(langKeys.ticket_duracionreal),
                accessor: 'duracionreal',
                helpText: t(langKeys.ticket_help_duracionreal),
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_duracionpausa),
                accessor: 'duracionpausa',
                helpText: t(langKeys.ticket_duracionpausa_help),
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_duraciontotal),
                helpText: t(langKeys.ticket_duraciontotal_help),
                accessor: 'duraciontotal',

                type: 'time'
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                helpText: t(langKeys.ticket_fechahandoff_help),
                accessor: 'fechahandoff',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechahandoff ? convertLocalDate(row.fechahandoff).toLocaleString() : ''
                }
            },
            {
                Header: t(langKeys.ticket_fechaultimaconversacion),
                helpText: t(langKeys.ticket_fechaultimaconversacion_help),
                accessor: 'fechaultimaconversacion',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return row.fechaultimaconversacion ? convertLocalDate(row.fechaultimaconversacion).toLocaleString() : ''
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
                Header: t(langKeys.campaign),
                accessor: 'campaign'
            },
            {
                Header: t(langKeys.ticket_tmoasesor),
                helpText: t(langKeys.ticket_tmoasesor_help),
                accessor: 'tmoasesor',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuesta),
                helpText: t(langKeys.ticket_tiempopromediorespuesta_help),
                accessor: 'tiempopromediorespuesta',
                type: 'time',
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestaasesor),
                helpText: t(langKeys.ticket_tiempopromediorespuestaasesor_help),
                accessor: 'tiempopromediorespuestaasesor',
                type: 'time',
            },
            {
                Header: t(langKeys.ticket_tiempoprimerarespuestaasesor),
                helpText: t(langKeys.ticket_tiempoprimerarespuestaasesor_help),
                accessor: 'tiempoprimerarespuestaasesor',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tiempoprimeraasignacion),
                helpText: t(langKeys.ticket_tiempoprimeraasignacion_help),
                accessor: 'tiempoprimeraasignacion',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_tdatime),
                helpText: t(langKeys.ticket_tdatime_help),
                accessor: 'tdatime',
                type: 'time'
            },
            {
                Header: t(langKeys.ticket_classification),
                accessor: 'tipification'
            },

            {
                Header: t(langKeys.ticket_documenttype),
                accessor: 'documenttype'
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: 'dni'
            },
            {
                Header: t(langKeys.ticket_email),
                accessor: 'email'
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
                Header: t(langKeys.ticket_balancetimes),
                accessor: 'balancetimes',
                type: 'number',
                sortType: 'number',
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
                Header: t(langKeys.ticket_labels),
                accessor: 'labels'
            },
        ],
        []
    );

    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: row.name, ticketnum: row.numeroticket })
    }, [mainResult]);

    const triggerExportData = ({ filters, sorts, daterange }: IFetchData) => {
        const columnsExport = columns.filter(x => !x.isComponent).map(x => ({
            key: x.accessor,
            alias: x.Header
        }))
        dispatch(exportData(getTicketExport({
            filters: {
                ...filters,
            },
            sorts,
            startdate: daterange.startDate!,
            enddate: daterange.endDate!,
            ...allParameters
        }), "", "excel", false, columnsExport));
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
            },
            ...allParameters
        })))
    };

    const fetchDataAux2 = () => {
        fetchData(fetchDataAux);
    };

    useEffect(() => {
        dispatch(getMultiCollection([
            getCommChannelLst(),
            getValuesFromDomainLight("GRUPOS"),
            getValuesFromDomainLight("MOTIVOCIERRE"),
            getComunicationChannelDelegate(""),
            getClassificationLevel1("TIPIFICACION"),
            getUserSel(0),
            getValuesFromDomainLight("GRUPOS"),
            getCampaignLst(),
        ]));

        return () => {
            dispatch(resetAllMain());
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

    useEffect(() => {
        if (!mainResult?.multiData.loading && !mainResult?.multiData.error) {
            setUserList(mainResult?.multiData?.data[5] ? mainResult?.multiData?.data[5].data.map(x => ({
                ...x,
                fullname: `${x.firstname} ${x.lastname}`
            })).sort((a, b) => a.fullname.localeCompare(b.fullname)) : [])
        }
    }, [mainResult?.multiData])

    return (
        <div className={classes.container}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" style={{ gap: 8 }}>
                <div className={classes.title}>
                    {t(langKeys.ticket_plural)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                        startIcon={<ReassignIcon width={24} style={{ fill: '#FFF' }} />}
                        onClick={() => {
                            setRowToSend(rowWithDataSelected);
                            setOpenDialogReassign(true);
                        }}
                    >
                        {t(langKeys.reassign)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                        startIcon={<TipifyIcon width={24} style={{ fill: '#FFF' }} />}
                        onClick={() => {
                            setRowToSend(rowWithDataSelected);
                            setOpenDialogTipify(true);
                        }}
                    >
                        {t(langKeys.ticket_typify)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                        startIcon={<CloseTicketIcon width={24} style={{ fill: '#FFF' }} />}
                        onClick={() => {
                            setRowToSend(rowWithDataSelected);
                            setOpenDialogClose(true);
                        }}
                    >
                        {t(langKeys.close)}
                    </Button>
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
                filterRangeDate="today"
                FiltersElement={React.useMemo(() => (
                    <>
                        <FieldMultiSelect
                            label={t(langKeys.channel)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_channel"
                            valueDefault={allParameters["channel"] || ""}
                            onChange={(value) => setValue("channel", value ? value.map((o: Dictionary) => o.communicationchannelid).join() : '')}
                            variant="outlined"
                            data={mainResult?.multiData?.data[0]?.data.sort((a, b) => (a.communicationchanneldesc || "").localeCompare(b.communicationchanneldesc)) || []}
                            optionDesc="communicationchanneldesc"
                            optionValue="communicationchannelid"
                            disabled={mainPaginated.loading}
                        />
                        <FieldMultiSelect
                            label={t(langKeys.group)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_group"
                            valueDefault={allParameters["usergroup"] || ""}
                            onChange={(value) => setValue("usergroup", value ? value.map((o: Dictionary) => o.domainvalue).join() : '')}
                            variant="outlined"
                            data={mainResult?.multiData?.data[1]?.data || []}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            disabled={mainPaginated.loading}
                        />
                        <FieldMultiSelect
                            label={t(langKeys.agent)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_user"
                            valueDefault={allParameters["lastuserid"] || ""}
                            onChange={(value) => setValue("lastuserid", value ? value.map((o: Dictionary) => o.userid).join() : '')}
                            variant="outlined"
                            data={userList}
                            optionDesc="fullname"
                            optionValue="userid"
                            disabled={mainPaginated.loading}
                        />
                        <FieldMultiSelect
                            label={t(langKeys.campaign)}
                            className={classes.filterComponent}
                            key="fieldMultiSelect_campaign"
                            valueDefault={allParameters["campaignid"] || ""}
                            onChange={(value) => setValue("campaignid", value ? value.map((o: Dictionary) => o.id).join() : '')}
                            variant="outlined"
                            data={mainResult?.multiData?.data[7]?.data || []}
                            optionDesc="title"
                            optionValue="id"
                            disabled={mainPaginated.loading}
                        />
                    </>
                ), [allParameters, mainResult.multiData, mainPaginated, userList])}
            />
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <DialogHistoryStatus
                openModal={openDialogShowHistory}
                setOpenModal={setOpenDialogShowHistory}
                ticket={rowSelected}
            />
            <DialogTipifications
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowToSend}
                openModal={openDialogTipify}
                setOpenModal={setOpenDialogTipify}
            />
            <DialogCloseticket
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowToSend}
                openModal={openDialogClose}
                setOpenModal={setOpenDialogClose}
            />
            <DialogReassignticket
                fetchData={fetchDataAux2}
                rowWithDataSelected={rowToSend}
                openModal={openDialogReassign}
                setOpenModal={setOpenDialogReassign}
            />
        </div>
    )
}

export default Tickets;