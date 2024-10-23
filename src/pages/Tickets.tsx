import React, { useState, useEffect, useCallback, FC } from 'react'
import { convertLocalDate, getListUsers, getClassificationLevel1, getCommChannelLst, getComunicationChannelDelegate, getPaginatedTicket, getTicketExport, getValuesFromDomainLight, insConversationClassificationMassive, reassignMassiveTicket, getHistoryStatusConversation, getCampaignLst, getPropertySelByName, exportExcel, templateMaker, getAnalyticsIA, getUserAsesorByOrgID, getCustomVariableSelByTableName } from 'common/helpers';
import { getCollectionPaginated, exportData, getMultiCollection, resetAllMain, execute, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import TablePaginated from 'components/fields/table-paginated';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { Dictionary, IFetchData } from '@types'
import { langKeys } from 'lang/keys';
import { Trans, useTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box/Box';
import { DialogZyx, FieldMultiSelect, FieldSelect, FieldEditMulti, FieldMultiSelectVirtualized, AntTab, AntTabPanel, TitleDetail, TemplateBreadcrumbs, FieldView } from 'components';
import TableZyx from 'components/fields/table-simple';
import { useForm } from 'react-hook-form';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { CloseTicketIcon, HistoryIcon, TipifyIcon, ReassignIcon, CallRecordIcon, DashboardIAIcon } from 'icons';
import { massiveCloseTicket, getTipificationLevel2, resetGetTipificationLevel2, resetGetTipificationLevel3, getTipificationLevel3, emitEvent, importTicket } from 'store/inbox/actions';
import { Button, ListItemIcon, Tabs, Tooltip } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import { VoximplantService } from 'network';
import DialogInteractions from 'components/inbox/DialogInteractions';
import { CellProps } from 'react-table';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import ClearIcon from "@material-ui/icons/Clear";
import VisibilityIcon from '@material-ui/icons/Visibility';
const isIncremental = window.location.href.includes("incremental")

const selectionKey = 'conversationid';

const useStyles = makeStyles((theme) => ({
    container: {
        gap: 8,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
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
    filterComponentVirtualized: {
        width: '300px'
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
    },
    flex_1: {
        flex: 1
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    containerDetail: {
        marginTop: theme.spacing(2),       
        padding: theme.spacing(2),
        background: "#fff",
    },
}));

const DialogCloseticket: React.FC<{ fetchData: () => void, setOpenModal: (param: any) => void, openModal: boolean, rowWithDataSelected: Dictionary[] }> = ({ setOpenModal, openModal, rowWithDataSelected, fetchData }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitClose, setWaitClose] = useState(false);
    const multiData = useSelector(state => state.main.multiData);
    const closingRes = useSelector(state => state.inbox.triggerMassiveCloseTicket);
    const user = useSelector(state => state.login.validateToken.user);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (waitClose) {
            if (!closingRes.loading && !closingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_close_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                fetchData()
                setWaitClose(false);
            } else if (closingRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_unexpected_error) }))
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
        let closeticket=false
        const emptyTipification = rowWithDataSelected.some(x => !x.tipification || x.tipification.trim() === "");
        if(user?.properties?.obligatory_tipification_close_ticket && emptyTipification){
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.tipification_necesary) }))
        }else{
            closeticket=true;
        }
        if(closeticket){
            dispatch(massiveCloseTicket({
                motive: data.motive,
                observation: data.observation,
                listTickets: listTicketsToClose,
            }))
            dispatch(showBackdrop(true));
            setWaitClose(true);
        }
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_reasign_ticket) }))
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
                    // channelicon: ticket.channelicon,
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
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_unexpected_error) }))
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
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.least_user_or_group) }))
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_tipify_ticket) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitTipify(false);
                fetchData()
            } else if (tipifyRes.error) {
                const message = t(tipifyRes.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message }))
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
    onHandlerCallRecord?: (e?: any) => void;
    onHandlerAnalyticsIA?: (e?: any) => void;
    onHandlerView?: (e?: any) => void;
}> = ({ onHandlerReassign, onHandlerClassify, onHandlerClose, onHandlerShowHistory, onHandlerCallRecord, onHandlerAnalyticsIA, disabled, onHandlerView }) => {
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
                onClick={(e) => {e.stopPropagation();setAnchorEl(e.currentTarget)}}
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
                {onHandlerView &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerView();
                    }}>
                        <ListItemIcon color="inherit">
                            <VisibilityIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.posthistory_seedetail)}
                    </MenuItem>
                }
                {onHandlerReassign &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerReassign();
                    }}>
                        <ListItemIcon color="inherit">
                            <ReassignIcon width={18} style={{ fill: '#7721AD' }} />
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
                            <TipifyIcon width={18} style={{ fill: '#7721AD' }} />
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
                            <CloseTicketIcon width={18} style={{ fill: '#7721AD' }} />
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
                            <HistoryIcon width={22} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {t(langKeys.status_history)}
                    </MenuItem>
                }
                {onHandlerAnalyticsIA &&
                    <MenuItem onClick={() => {
                        setAnchorEl(null);
                        onHandlerAnalyticsIA();
                    }}>
                        <ListItemIcon>
                            <DashboardIAIcon width={22} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        {"Analytics IA"}
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
                Cell: (props: CellProps<Dictionary>) => {
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
                data={resultHistory.data}
                filterGeneral={false}
                download={false}
                loading={resultHistory.loading}
                register={false}
            />
        </DialogZyx>
    )
}
const DialogAnalyticsIA: React.FC<{ ticket: Dictionary | null, openModal: boolean, setOpenModal: (param: any) => void }> = ({ ticket, openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    const classes = useStyles();

    const resultAnalyticsIA = useSelector(state => state.main.mainAux);
    useEffect(() => {
        if (openModal) {
            if (ticket) {
                dispatch(getCollectionAux(getAnalyticsIA(ticket.conversationid)))
            }
        }
    }, [ticket, openModal])
    const trimmedData = React.useMemo(() => {
        if (resultAnalyticsIA.data && resultAnalyticsIA.data[0]?.interactiontext) {
            return resultAnalyticsIA.data.map((row: any) => {
                return {
                    ...row,
                    interactiontext: row.interactiontext.length > 65
                        ? row.interactiontext.substring(0, 65) + "..."
                        : row.interactiontext
                }
            })
        }
        return []
    }, [resultAnalyticsIA.data])

    const columnsWNLU = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_interaction_interactiontext),
                accessor: 'interactiontext',
                NoFilter: true,
            },
            {
                Header: t(langKeys.type),
                accessor: 'oustype',
                NoFilter: true,
            },
            {
                Header: t(langKeys.anger),
                accessor: 'wnluanger',
                NoFilter: true,
            },
            {
                Header: t(langKeys.dislike),
                accessor: 'wnludisgust',
                NoFilter: true,
            },
            {
                Header: t(langKeys.fear),
                accessor: 'wnlufear',
                NoFilter: true,
            },
            {
                Header: t(langKeys.happiness),
                accessor: 'wnlujoy',
                NoFilter: true,
            },
            {
                Header: t(langKeys.sadness),
                accessor: 'wnlusadness',
                NoFilter: true,
            },
            {
                Header: t(langKeys.feeling),
                accessor: 'wnlusentiment',
                NoFilter: true,
            },
        ],
        []
    );

    const columnsWA = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_interaction_interactiontext),
                accessor: 'interactiontext',
                NoFilter: true,
            },
            {
                Header: t(langKeys.type),
                accessor: 'oustype',
                NoFilter: true,
            },
            {
                Header: t(langKeys.intention),
                accessor: 'waintent',
                NoFilter: true,
            },
            {
                Header: t(langKeys.entityname),
                accessor: 'waentityname',
                NoFilter: true,
            },
            {
                Header: t(langKeys.entityvalue),
                accessor: 'waentityvalue',
                NoFilter: true,
            },
        ],
        []
    );
    const columnsRasa = React.useMemo(
        () => [
            {
                Header: t(langKeys.report_interaction_interactiontext),
                accessor: 'interactiontext',
                NoFilter: true,
            },
            {
                Header: t(langKeys.type),
                accessor: 'oustype',
                NoFilter: true,
            },
            {
                Header: t(langKeys.intention),
                accessor: 'rasintent',
                NoFilter: true,
            },
            {
                Header: t(langKeys.entityname),
                accessor: 'rasentityname',
                NoFilter: true,
            },
            {
                Header: t(langKeys.entityvalue),
                accessor: 'rasentityvalue',
                NoFilter: true,
            },
        ],
        []
    );

    return (
        <DialogZyx
            open={openModal}
            maxWidth="md"
            title={`Analytics IA`}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
        >
            <Tabs
                value={tabIndex}
                onChange={(_, i) => setTabIndex(i)}
                className={classes.tabs}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Natural Language Understanding (NLU)</div>
                    )}
                />
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Watson Assistant</div>
                    )}
                />
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>Rasa IA</div>
                    )}
                />
            </Tabs>
            <AntTabPanel index={0} currentIndex={tabIndex}>
                <TableZyx
                    columns={columnsWNLU}
                    data={trimmedData}
                    filterGeneral={false}
                    download={false}
                    loading={resultAnalyticsIA.loading}
                    register={false}
                />
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <TableZyx
                    columns={columnsWA}
                    data={trimmedData}
                    filterGeneral={false}
                    download={false}
                    loading={resultAnalyticsIA.loading}
                    register={false}
                />
            </AntTabPanel>
            <AntTabPanel index={2} currentIndex={tabIndex}>
                <TableZyx
                    columns={columnsRasa}
                    data={trimmedData}
                    filterGeneral={false}
                    download={false}
                    loading={resultAnalyticsIA.loading}
                    register={false}
                />
            </AntTabPanel>
        </DialogZyx>
    )
}

const DialogLoadTickets: React.FC<{
    setOpenModal: (param: any) => void,
    openModal: boolean,
    fetchData: () => void
}> = ({ setOpenModal, openModal, fetchData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitUpload, setWaitUpload] = useState(false);
    const mainResult = useSelector(state => state.main);
    const importRes = useSelector(state => state.inbox.triggerImportTicket)

    const [channelsite, setChannelsite] = useState<string>('');
    const [fileList, setFileList] = useState<File[]>([])

    const { handleSubmit } = useForm<{
        filename: string;
    }>();

    useEffect(() => {
        if (waitUpload) {
            if (!importRes.loading && !importRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_import) }))
                setOpenModal(false);
                dispatch(showBackdrop(false));
                setWaitUpload(false);
                fetchData();
            } else if (importRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(importRes.code || "error_unexpected_error") }))
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            }
        }
    }, [importRes, waitUpload])

    useEffect(() => {
        if (openModal) {
            setChannelsite('');
            setFileList([]);
        }
    }, [openModal])

    const onSubmit = handleSubmit(async () => {
        if (!!channelsite) {
            if (!!fileList && fileList?.length > 0) {
                const fd = new FormData();
                fd.append('channelsite', channelsite);
                for (let i = 0; i < fileList.length; i++) {
                    fd.append(fileList[i].name, fileList[i], fileList[i].name);
                }
                dispatch(importTicket(fd));
                dispatch(showBackdrop(true));
                setWaitUpload(true);
            }
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_files_selected) }))
            }
        }
        else {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_channel_selected) }))
        }

    });

    const handleUpload = async (files: any) => {
        if (Array.from<File>(files).length > 10) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.max_limit_file_per_upload, { n: 10 }) }))
        }
        else {
            setFileList(Array.from<File>(files));
        }
    }

    const handleTemplate = () => {
        const data = [
            {},
            {},
            {},
            {},
            { 'CLIENT': 'CLIENT', 'BOT': 'BOT' }
        ];
        const header = [
            'date',
            'personname',
            'personphone',
            'interactiontext',
            'interactionfrom'
        ];
        exportExcel(`${t(langKeys.template)} ${t(langKeys.ticket)}`, templateMaker(data, header));
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.upload_conversation_plural)}
            buttonText0={t(langKeys.template)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.import)}
            handleClickButton0={() => handleTemplate()}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '10px'
                }}
            >
                <FieldSelect
                    label={t(langKeys.channel)}
                    className={classes.flex_1}
                    valueDefault={channelsite}
                    onChange={(value) => setChannelsite(value?.communicationchannelsite)}
                    variant="outlined"
                    data={mainResult?.multiData?.data[0]?.data.sort((a, b) => (a.communicationchanneldesc || "").localeCompare(b.communicationchanneldesc)) || []}
                    optionDesc="communicationchanneldesc"
                    optionValue="communicationchannelid"
                />
                <input
                    name="file"
                    accept="text/csv,.zip,.rar,.xls,.xlsx"
                    id="laraigo-upload-csv-file"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => handleUpload(e.target.files)}
                    multiple
                />
                <label htmlFor="laraigo-upload-csv-file">
                    <Button
                        className={classes.button}
                        variant="contained"
                        component="span"
                        color="primary"
                        style={{ backgroundColor: "#55BD84" }}
                    >{t(langKeys.select)}
                    </Button>
                </label>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginTop: "10px"
            }}>
                {fileList && fileList?.map((x, i) => (
                    <div>{i + 1}. {x.name}</div>
                )
                )}
            </div>
        </DialogZyx>)
}

interface RowSelected {
    row: Dictionary | null,
    columnid: string | null,
    open: boolean
}

const TicketDetail: FC<{ row:RowSelected, setViewSelected:(x:string)=>void, openDialogInteractions:(x:any)=>void }> = ({ row, setViewSelected,openDialogInteractions }) => {
    const multiDataResult = useSelector(state => state.main.multiData);
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState(0);
    const classes = useStyles();
    const [tableDataVariables, setTableDataVariables] = useState<Dictionary[]>([]);
    
    
    const arrayBread = [
        { id: "view-1", name: t(langKeys.ticket) }, { id: "view-2", name: t(langKeys.ticket) + " " + t(langKeys.detail)}
    ];

    useEffect(() => {
        if(!multiDataResult.loading && !multiDataResult.error){
            if (multiDataResult.data[9]) {
                const variableDataList = multiDataResult.data[9].data ||[]
                setTableDataVariables(variableDataList.map(x=>({...x,value: row?.row?.variablecontext?.[x.variablename]||""})))
            }
        }
    }, [multiDataResult,row]);
    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variablename',
                NoFilter: true,
                sortType: 'string'
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                sortType: 'string',
            },
            {
                Header: t(langKeys.datatype),
                accessor: 'variabletype',
                NoFilter: true,
                sortType: 'string',
                prefixTranslation: 'datatype_',
                Cell: (props: any) => {
                    const { variabletype } = props.cell.row.original || {}; 
                    return (t(`datatype_${variabletype}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.value),
                accessor: 'value',
                NoFilter: true,
                type: 'string',
                editable: true,
                width: 250,
                maxWidth: 250
            },
        ],
        []
    )
    
    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={t(langKeys.ticket) + " " + t(langKeys.detail)}
                    />
                </div>
                <Button
                    color="primary"
                    onClick={() => setViewSelected("view-1")}
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    type="button"
                    variant="contained"
                >
                    {t(langKeys.back)}
                </Button>
            </div>
            <Tabs
                value={tabIndex}
                onChange={(_, i) => setTabIndex(i)}
                className={classes.tabs}
                textColor="primary"
                indicatorColor="primary"
                variant="fullWidth"
            >
                <AntTab
                    label={(
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{t(langKeys.generalinformation)}</div>
                    )}
                />
                <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <Trans i18nKey={langKeys.customvariables} />
                                <Tooltip title={<div style={{ fontSize: 12 }}>{t(langKeys.customvariableslist_helper_lead)}</div>} arrow placement="top" >
                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                </Tooltip>
                            </div>
                        )}
                />
            </Tabs>
            <AntTabPanel index={0} currentIndex={tabIndex}>
                <div className={classes.containerDetail}>   
                    <div className='row-zyx'>
                        <div className={"col-4"}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.ticket_numeroticket)}
                            </Box>
                            <label
                                className={classes.labellink}
                                onClick={(e) => {e.stopPropagation();openDialogInteractions(row?.row)}}
                            >
                                {row?.row?.numeroticket}
                            </label>
                        </div>
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_communicationchanneldescription)}
                            value={row?.row?.communicationchanneldescription || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_name)}
                            value={row?.row?.name || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.origin)}
                            value={row?.row?.origin || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_firstusergroup)}
                            value={row?.row?.firstusergroup || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_ticketgroup)}
                            value={row?.row?.ticketgroup || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_fechainicio)}
                            value={row?.row?.fechainicio?convertLocalDate(row.row.fechainicio).toLocaleString(): "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_fechafin)}
                            value={row?.row?.fechafin?convertLocalDate(row.row.fechafin).toLocaleString(): "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.status)}
                            value={row?.row?.estadoconversacion || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tipocierre)}
                            tooltip={t(langKeys.report_productivity_closetype_help)}
                            value={row?.row?.tipocierre || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_duracionreal)}
                            tooltip={t(langKeys.ticket_help_duracionreal)}
                            value={row?.row?.duracionreal || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_duracionpausa)}
                            value={row?.row?.duracionpausa || "-"}
                            tooltip={t(langKeys.ticket_duracionpausa_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_duraciontotal)}
                            value={row?.row?.duraciontotal || "-"}
                            tooltip={t(langKeys.ticket_duraciontotal_help)}
                            />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_fechahandoff)}
                            tooltip={t(langKeys.ticket_fechahandoff_help)}
                            value={row?.row?.fechahandoff?convertLocalDate(row.row.fechahandoff).toLocaleString(): "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_fechaultimaconversacion)}
                            tooltip={t(langKeys.ticket_fechaultimaconversacion_help)}
                            value={row?.row?.fechaultimaconversacion?convertLocalDate(row.row.fechaultimaconversacion).toLocaleString(): "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_asesorinicial)}
                            value={row?.row?.asesorinicial || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_asesorfinal)}
                            value={row?.row?.asesorfinal || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_supervisor)}
                            value={row?.row?.supervisor || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_agentrol)}
                            value={row?.row?.rolasesor || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_empresa)}
                            value={row?.row?.empresa || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.campaign)}
                            value={row?.row?.campaign || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tmoasesor)}
                            value={row?.row?.tmoasesor || "-"}
                            tooltip={t(langKeys.ticket_tmoasesor_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tiempopromediorespuesta)}
                            value={row?.row?.tiempopromediorespuesta || "-"}
                            tooltip={t(langKeys.ticket_tiempopromediorespuesta_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tiempopromediorespuestaasesor)}
                            value={row?.row?.tiempopromediorespuestaasesor || "-"}
                            tooltip={t(langKeys.ticket_tiempopromediorespuestaasesor_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tiempoprimerarespuestaasesor)}
                            value={row?.row?.tiempoprimerarespuestaasesor || "-"}
                            tooltip={t(langKeys.ticket_tiempoprimerarespuestaasesor_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tiempopromediorespuestapersona)}
                            value={row?.row?.tiempopromediorespuestapersona || "-"}
                            tooltip={t(langKeys.ticket_tiempopromediorespuestapersona_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tiempoprimeraasignacion)}
                            value={row?.row?.tiempoprimeraasignacion || "-"}
                            tooltip={t(langKeys.ticket_tiempoprimeraasignacion_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_tdatime)}
                            value={row?.row?.tdatime || "-"}
                            tooltip={t(langKeys.ticket_tdatime_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_holdingwaitingtime)}
                            value={row?.row?.holdingwaitingtime || "-"}
                            tooltip={t(langKeys.ticket_holdingwaitingtime_help)}
                            />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.supervisionduration)}
                            value={row?.row?.supervisionduration || "-"}
                            />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_classification)}
                            value={row?.row?.tipification || "-"}
                            tooltip={t(langKeys.ticket_tipification_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_documenttype)}
                            value={row?.row?.documenttype || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.documentnumber)}
                            value={row?.row?.dni || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_email)}
                            value={row?.row?.email || "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_balancetimes)}
                            value={row?.row?.balancetimes || "0"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_abandoned)}
                            value={row?.row?.abandoned? t(langKeys.affirmative) : t(langKeys.negative)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_labels)}
                            value={row?.row?.labels || "-"}
                            tooltip={t(langKeys.ticket_labels_help)}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_originalpublishdate)}
                            value={row?.row?.originalpublicationdate?convertLocalDate(row.row.originalpublicationdate).toLocaleString(): "-"}
                        />
                        <FieldView
                            className={"col-4"}
                            label={t(langKeys.ticket_followercount)}
                            value={row?.row?.numberfollowers || "0"}
                        />
                    </div>
                </div>
            </AntTabPanel>
            <AntTabPanel index={1} currentIndex={tabIndex}>
                <div className={classes.containerDetail}>   
                    <TableZyx
                        columns={columns}
                        data={tableDataVariables}
                        filterGeneral={false}
                        download={false}
                        loading={multiDataResult.loading}
                        register={false}
                    />
                </div>
            </AntTabPanel>
        </div>
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
    const [openDialogShowAnalyticsIA, setOpenDialogShowAnalyticsIA] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowDetail, setRowDetail] = useState<RowSelected>({ row: null, columnid: null, open: false });

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

    const user = useSelector(state => state.login.validateToken.user);
    const [openUploadTickets, setOpenUploadTickets] = useState(false);

    const [waitDownloadRecord, setWaitDownloadRecord] = useState(false);
    const getCallRecordRes = useSelector(state => state.voximplant.requestGetCallRecord);

    const setValue = (parameterName: any, value: any) => {
        setAllParameters({ ...allParameters, [parameterName]: value });
    }

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error){
            if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
                setRowWithDataSelected(p => Object.keys(selectedRows).map(x => mainPaginated.data.find(y => y.conversationid === parseInt(x)) || p.find(y => y.conversationid === parseInt(x)) || {}))
            }
        }
    }, [selectedRows, mainPaginated])

    const downloadCallRecord = async (ticket: Dictionary) => {
        // dispatch(getCallRecord({call_session_history_id: ticket.postexternalid}));
        // setWaitDownloadRecord(true);
        try {
            const axios_result = await VoximplantService.getCallRecord({ call_session_history_id: ticket.postexternalid });
            if (axios_result.status === 200) {
                let buff = Buffer.from(axios_result.data, 'base64');
                const blob = new Blob([buff], { type: axios_result.headers['content-type'].split(';').find((x: string) => x.includes('audio')) });
                const objectUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.download = ticket.numeroticket;
                a.click();
            }
        }
        catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
        }
    }

    useEffect(() => {
        if (waitDownloadRecord) {
            if (!getCallRecordRes.loading && !getCallRecordRes.error) {
                if (getCallRecordRes.data) {
                    window.open(getCallRecordRes.data)
                }
                setWaitDownloadRecord(false)
            } else if (getCallRecordRes.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.ticket_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitDownloadRecord(false)
            }
        }
    }, [getCallRecordRes, waitDownloadRecord])

    const columns = React.useMemo(
        () => [
            {
                accessor: "leadid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const ticket = props.cell.row.original;
                    return (
                        <IconOptions
                            onHandlerView={()=>{
                                setRowDetail({ row:ticket, columnid:null, open: true });
                                setViewSelected("view-2");
                            }}
                            onHandlerReassign={
                                ticket && ticket.estadoconversacion === "CERRADO"
                                    ? undefined
                                    : () => {
                                        setRowToSend([ticket]);
                                        setOpenDialogReassign(true);
                                    }
                            }
                            onHandlerClassify={
                                ticket && ticket.estadoconversacion === "CERRADO"
                                    ? undefined
                                    : () => {
                                        setRowToSend([ticket]);
                                        setOpenDialogTipify(true);
                                    }
                            }                            
                            onHandlerClose={
                                ticket && ticket.estadoconversacion === "CERRADO"
                                    ? undefined
                                    : () => {
                                        setRowToSend([ticket]);
                                        setOpenDialogClose(true);
                                    }
                            }
                            onHandlerShowHistory={() => {
                                setOpenDialogShowHistory(true);
                                setRowSelected(ticket);
                                setRowToSend([ticket]);
                            }}
                            onHandlerAnalyticsIA={() => {
                                setOpenDialogShowAnalyticsIA(true);
                                setRowSelected(ticket);
                                setRowToSend([ticket]);
                            }}
                        />
                    );
                },
            },
            {
                accessor: "voxiid",
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (
                        row &&
                        row.communicationchanneltype === "VOXI" &&
                        row.postexternalid &&
                        row.callrecording &&
                        row.callanswereddate
                    ) {
                        return (
                            <Tooltip title={t(langKeys.download_record) || ""}>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {e.stopPropagation();downloadCallRecord(row)}}
                                >
                                    <CallRecordIcon style={{ fill: "#7721AD" }} />
                                </IconButton>
                            </Tooltip>
                        );
                    } else {
                        return null;
                    }
                },                
            },
            {
                Header: t(langKeys.ticket_numeroticket),
                accessor: "numeroticket",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.numeroticket) {
                        return (
                            <label
                                className={classes.labellink}
                                onClick={(e) => {e.stopPropagation();openDialogInteractions(row)}}
                            >
                                {row.numeroticket}
                            </label>
                        );
                    } else {
                        return "";
                    }
                },
                
            },
            {
                Header: t(langKeys.ticket_communicationchanneldescription),
                accessor: "communicationchanneldescription",
            },
            {
                Header: t(langKeys.ticket_name),
                accessor: "name",
            },
            {
                Header: t(langKeys.origin),
                accessor: "origin",
            },
            {
                Header: t(langKeys.ticket_firstusergroup),
                accessor: "firstusergroup",
            },
            {
                Header: t(langKeys.ticket_ticketgroup),
                accessor: "ticketgroup",
            },
            {
                Header: t(langKeys.ticket_phone),
                accessor: "phone",
            },
            {
                Header: t(langKeys.ticket_fechainicio),
                accessor: "fechainicio",
                type: "date",
                sortType: "datetime",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.fechainicio) {
                        return convertLocalDate(row.fechainicio).toLocaleString();
                    } else {
                        return null; 
                    }
                },
                
            },
            {
                Header: t(langKeys.ticket_fechafin),
                accessor: "fechafin",
                type: "date",
                sortType: "datetime",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    if (row && row.fechafin) {
                        return convertLocalDate(row.fechafin).toLocaleString();
                    } else {
                        return ""; 
                    }
                },                
            },
            {
                Header: t(langKeys.status),
                accessor: "estadoconversacion",
            },
            {
                Header: t(langKeys.ticket_tipocierre),
                accessor: "tipocierre",
                helpText: t(langKeys.report_productivity_closetype_help),
            },
            {
                Header: t(langKeys.ticket_duracionreal),
                accessor: "duracionreal",
                helpText: t(langKeys.ticket_help_duracionreal),
                type: "time",
            },
            {
                Header: t(langKeys.ticket_duracionpausa),
                accessor: "duracionpausa",
                helpText: t(langKeys.ticket_duracionpausa_help),
                type: "time",
            },
            {
                Header: t(langKeys.ticket_duraciontotal),
                helpText: t(langKeys.ticket_duraciontotal_help),
                accessor: "duraciontotal",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_fechahandoff),
                helpText: t(langKeys.ticket_fechahandoff_help),
                accessor: "fechahandoff",
                type: "date",
                sortType: "datetime",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.fechahandoff) {
                        return convertLocalDate(row.fechahandoff).toLocaleString();
                    } else {
                        return "";
                    }
                },
                
            },
            {
                Header: t(langKeys.ticket_fechaultimaconversacion),
                helpText: t(langKeys.ticket_fechaultimaconversacion_help),
                accessor: "fechaultimaconversacion",
                type: "date",
                sortType: "datetime",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.fechaultimaconversacion) {
                        return convertLocalDate(row.fechaultimaconversacion).toLocaleString();
                    } else {
                        return "";
                    }
                },                
            },
            {
                Header: t(langKeys.ticket_asesorinicial),
                accessor: "asesorinicial",
            },
            {
                Header: t(langKeys.ticket_asesorfinal),
                accessor: "asesorfinal",
            },
            {
                Header: t(langKeys.ticket_supervisor),
                accessor: "supervisor",
            },
            {
                Header: t(langKeys.ticket_agentrol),
                accessor: "rolasesor",
            },
            {
                Header: t(langKeys.ticket_empresa),
                accessor: "empresa",
            },
            {
                Header: t(langKeys.campaign),
                accessor: "campaign",
            },
            {
                Header: t(langKeys.ticket_tmoasesor),
                helpText: t(langKeys.ticket_tmoasesor_help),
                accessor: "tmoasesor",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuesta),
                helpText: t(langKeys.ticket_tiempopromediorespuesta_help),
                accessor: "tiempopromediorespuesta",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestaasesor),
                helpText: t(langKeys.ticket_tiempopromediorespuestaasesor_help),
                accessor: "tiempopromediorespuestaasesor",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tiempoprimerarespuestaasesor),
                helpText: t(langKeys.ticket_tiempoprimerarespuestaasesor_help),
                accessor: "tiempoprimerarespuestaasesor",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tiempopromediorespuestapersona),
                helpText: t(langKeys.ticket_tiempopromediorespuestapersona_help),
                accessor: "tiempopromediorespuestapersona",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tiempoprimeraasignacion),
                helpText: t(langKeys.ticket_tiempoprimeraasignacion_help),
                accessor: "tiempoprimeraasignacion",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_tdatime),
                helpText: t(langKeys.ticket_tdatime_help),
                accessor: "tdatime",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_holdingwaitingtime),
                helpText: t(langKeys.ticket_holdingwaitingtime_help),
                accessor: "holdingwaitingtime",
                type: "time",
            },
            {
                Header: t(langKeys.supervisionduration),
                accessor: "supervisionduration",
                type: "time",
            },
            {
                Header: t(langKeys.ticket_classification),
                helpText: t(langKeys.ticket_tipification_help),
                accessor: "tipification",
            },

            {
                Header: t(langKeys.ticket_documenttype),
                accessor: "documenttype",
            },
            {
                Header: t(langKeys.documentnumber),
                accessor: "dni",
            },
            {
                Header: t(langKeys.ticket_email),
                accessor: "email",
            },
            {
                Header: t(langKeys.ticket_balancetimes),
                accessor: "balancetimes",
                type: "number",
                sortType: "number",
            },
            {
                Header: t(langKeys.ticket_abandoned),
                accessor: "abandoned",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && typeof row.abandoned !== 'undefined') {
                        return row.abandoned ? t(langKeys.affirmative) : t(langKeys.negative);
                    } else {
                        return ""; 
                    }
                },
                
            },
            {
                Header: t(langKeys.ticket_labels),
                helpText: t(langKeys.ticket_labels_help),
                accessor: "labels",
            },
            {
                Header: t(langKeys.ticket_originalpublishdate),
                accessor: 'originalpublicationdate',
                type: 'date',
                sortType: 'datetime',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.originalpublicationdate) {
                        return convertLocalDate(row.originalpublicationdate).toLocaleString();
                    } else {
                        return ""; 
                    }
                },                
            },
            {
                Header: t(langKeys.ticket_followercount),
                accessor: 'numberfollowers',
                type: 'number'
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
        if (fetchDataAux.daterange) {
            fetchData(fetchDataAux);
        }
    };

    useEffect(() => {
        dispatch(getMultiCollection([
            getCommChannelLst(),
            getValuesFromDomainLight("GRUPOS"),
            getValuesFromDomainLight("MOTIVOCIERRE"),
            getComunicationChannelDelegate(""),
            getClassificationLevel1("TIPIFICACION"),
            getUserAsesorByOrgID(),
            getValuesFromDomainLight("GRUPOS"),
            getCampaignLst(),
            getPropertySelByName('CARGARCONVERSACIONES'),
            getCustomVariableSelByTableName("conversation")
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
        if (!mainResult?.multiData.loading && !mainResult?.multiData.error) {
            setUserList((mainResult?.multiData?.data[5]?.data || []).map(x => ({
                ...x,
                fullname: `${x.userdesc}`
            })).sort((a, b) => a.fullname.localeCompare(b.fullname)))
        }
    }, [mainResult?.multiData])

    const FilterElements = React.useMemo(() => (
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
            <FieldMultiSelectVirtualized
                label={t(langKeys.campaign)}
                className={classes.filterComponentVirtualized}
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
    ), [allParameters, mainResult.multiData, mainPaginated, userList])
    
    return (
        <div className={classes.container}>
            {(viewSelected === "view-1") && <>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" style={{ gap: 8 }}>
                    <div className={classes.title}>
                        {t(langKeys.ticket_plural)}
                    </div>
                    {!isIncremental &&
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
                    }
                </Box>
                <TablePaginated
                    columns={columns}
                    data={mainPaginated.data}
                    totalrow={totalrow}
                    loading={mainPaginated.loading}
                    pageCount={pageCount}
                    filterrange={true}
                    download={true}
                    ButtonsElement={() => (
                        <>
                            {
                                ((user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v)))
                                && mainResult?.multiData?.data?.[8]?.data?.[0]?.propertyvalue === '1'
                                && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    disabled={mainPaginated.loading}
                                    onClick={() => setOpenUploadTickets(true)}
                                    startIcon={<PublishIcon />}
                                >
                                    {t(langKeys.upload_conversation_plural)}
                                </Button>
                            }
                        </>
                    )}
                    fetchData={fetchData}
                    exportPersonalized={triggerExportData}
                    useSelection={true}
                    selectionFilter={{ key: 'estadoconversacion', value: 'ASIGNADO' }}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    filterRangeDate="today"
                    FiltersElement={FilterElements}
                />
            </>}
            {(viewSelected === "view-2") && 
            <TicketDetail row={rowDetail} setViewSelected={setViewSelected} openDialogInteractions={openDialogInteractions}/>}
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
            <DialogAnalyticsIA
                openModal={openDialogShowAnalyticsIA}
                setOpenModal={setOpenDialogShowAnalyticsIA}
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
            <DialogLoadTickets
                fetchData={fetchDataAux2}
                openModal={openUploadTickets}
                setOpenModal={setOpenUploadTickets}
            />
        </div>
    )
}

export default Tickets;