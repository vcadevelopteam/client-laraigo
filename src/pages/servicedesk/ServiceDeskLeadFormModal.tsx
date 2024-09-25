/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, Button, CircularProgress, IconButton, Tabs, Avatar, Paper } from '@material-ui/core';
import { FieldEdit, FieldMultiSelectFreeSolo, FieldSelect, AntTabPanel, DialogZyx } from 'components';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';;
import {
    leadLogNotesSel, getValuesFromDomain,
    getLeadsSDSel
} from 'common/helpers';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import {
    getLead, getLeadLogNotes, resetGetLead,
    resetGetLeadLogNotes
} from 'store/lead/actions';
import { ICrmLeadNote } from '@types';
import { showSnackbar } from 'store/popus/actions';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Close, GetApp, FileCopy } from '@material-ui/icons';
import clsx from 'clsx';
import { Note as NoteIcon } from '@material-ui/icons';
import { AntTab } from 'components';
import { getGroups, getImpact, getPriority, getUrgency, resetGetGroups, resetGetImpact, resetGetPriority, resetGetUrgency } from 'store/servicedesk/actions';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useLeadFormStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        color: theme.palette.text.primary,
    },
    subtitle: {
        padding: '0 8px',
        fontSize: 22,
        fontWeight: 500,
    },
    currency: {
        '&::before': {
            content: '"S/ "',
        },
    },
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
        width: "98%"
    },
    titleInput: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    tabs: {
        color: '#989898',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        // width: 130,
        height: 45,
        maxWidth: 'unset',
        border: '#A59F9F 1px solid',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
        color: 'black',
        fontWeight: 'bold',
    },
    activetab: {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    badge: {
        borderRadius: 12,
        color: 'white',
        backgroundColor: '#FFA000',
        padding: '4px 6px',
        fontWeight: 'bold',
        fontSize: 14,
    },
    fakeInputContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',

        borderBottom: `2px solid ${theme.palette.text.secondary}`,
        '&:hover': {
            borderBottom: `2px solid ${theme.palette.text.primary}`,
        },
    },
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));
const convertLocalDate = (date: string | null | undefined, validateWithToday: boolean = false, subtractHours: boolean = true): String => {
    if (!date) return ""
    const dateCleaned = new Date(date)
    // const dateCleaned = new Date(nn.getTime() + (subtractHours ? (nn.getTimezoneOffset() * 60 * 1000 * -1) : 0));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned).toLocaleString() : dateCleaned.toLocaleString();
}

export const ServiceDeskLeadFormModal: FC<{ openModal: boolean, setOpenModal: (x: boolean) => void, leadId: number }> = ({ openModal, setOpenModal, leadId }) => {
    const classes = useLeadFormStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [tabIndex, setTabIndex] = useState(0);
    const lead = useSelector(state => state.servicedesk.lead);
    const user = useSelector(state => state.login.validateToken.user);
    const leadNotes = useSelector(state => state.servicedesk.leadLogNotes);
    const dataUrgency = useSelector(state => state.servicedesk.urgency);
    const dataImpact = useSelector(state => state.servicedesk.impact);
    const dataPriority = useSelector(state => state.servicedesk.priority);
    const dataGroups = useSelector(state => state.servicedesk.groups);
    const history = useHistory();

    useEffect(() => {
        dispatch(getLead(getLeadsSDSel({
            id: Number(leadId),
            fullname: '',
            tags: '',
            leadproduct: '',
            supervisorid: user?.userid || 0,
            all: false,
            company: '',
            groups: '',
            startdate: "",
            enddate: "",
            offset: -5,
        })));
        dispatch(getLeadLogNotes(leadLogNotesSel(leadId)));
        dispatch(getGroups(getValuesFromDomain('GRUPOSSERVICEDESK')));
        dispatch(getUrgency(getValuesFromDomain('URGENCIA')));
        dispatch(getImpact(getValuesFromDomain('IMPACTO')));
        dispatch(getPriority(getValuesFromDomain('PRIORIDAD')));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetGetLeadLogNotes());
            dispatch(resetGetGroups());
            dispatch(resetGetUrgency());
            dispatch(resetGetImpact());
            dispatch(resetGetPriority());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadId, dispatch]);

    useEffect(() => {
        if (leadNotes.loading) return;
        if (leadNotes.error) {
            const errormessage = t(leadNotes.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadNotes, t, dispatch]);

    return (

        <DialogZyx
            open={openModal}
            title={""}
            maxWidth={"sm"}
        >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div className={classes.root}>
                    <div style={{ height: '1em' }} />
                    <div className='row-zyx'>
                        <div className='col-12'>
                            <FieldEdit
                                label={t(langKeys.description)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.description}
                            />
                        </div>
                        <div className='col-6'>
                            <FieldSelect
                                label={t(langKeys.type)}
                                className={classes.field}
                                valueDefault={lead.value?.type}
                                data={
                                    [{ domainvalue: "SS" }, { domainvalue: "INC" }]
                                }
                                disabled
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='col-6'>
                            <FieldEdit
                                label={t(langKeys.userwhoreported)}
                                className={classes.field}
                                valueDefault={lead.value?.displayname}
                                disabled={true}
                            />
                        </div>
                        <div className='col-6'>
                            <FieldEdit
                                label={t(langKeys.reportdate)}
                                className={classes.field}
                                valueDefault={(convertLocalDate(lead.value?.createdate || "").toLocaleString())}
                                disabled={true}
                            />
                        </div>
                        <div className='col-6'>
                            <FieldEdit
                                label={t(langKeys.email)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.email}
                            />
                        </div>
                        <div className='col-4'>
                            <FieldSelect
                                label={t(langKeys.urgency)}
                                className={classes.field}
                                valueDefault={lead.value?.urgency}
                                disabled
                                data={dataUrgency.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='col-4'>
                            <FieldSelect
                                label={t(langKeys.impact)}
                                className={classes.field}
                                valueDefault={lead.value?.impact}
                                disabled
                                data={dataImpact.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='col-4'>
                            <FieldSelect
                                label={t(langKeys.priority)}
                                className={classes.field}
                                valueDefault={lead.value?.priority}
                                disabled
                                data={dataPriority.data}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>
                        <div className='col-4'>
                            <FieldMultiSelectFreeSolo
                                label={t(langKeys.tags)}
                                className={classes.field}
                                valueDefault={lead.value?.tags}
                                disabled
                                data={lead?.value?.tags.split(',').map(word => ({ domaindesc: word })) || []}
                                optionDesc="domaindesc"
                                optionValue="domaindesc"
                            />
                        </div>
                        <div className='col-4'>
                            <FieldEdit
                                label={t(langKeys.ticket)}
                                className={classes.field}
                                valueDefault={lead.value?.ticketnum}
                                disabled
                            />
                        </div>
                        <div className='col-4'>
                            <FieldSelect
                                label={t(langKeys.group)}
                                className={classes.field}
                                valueDefault={lead.value?.leadgroups}
                                data={dataGroups.data}
                                disabled
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </div>

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
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <NoteIcon style={{ width: 22, height: 22 }} />
                                    <Trans i18nKey={langKeys.logNote} count={2} />
                                </div>
                            )}
                        />
                    </Tabs>
                    <AntTabPanel index={0} currentIndex={tabIndex}>
                        <TabPanelLogNote
                            loading={leadNotes.loading}
                            notes={leadNotes.data}
                        />
                    </AntTabPanel>
                </div>
                <div style={{ gap: 10, display: "flex", justifyContent: "end" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="secondary"
                        onClick={() => setOpenModal(false)}
                    >
                        {t(langKeys.cancel)}
                    </Button>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        endIcon={<ArrowForwardIcon color="secondary" />}
                        onClick={() => { history.push(paths.SERVICE_DESK_EDIT_LEAD.resolve(leadId)) }}
                    >
                        {t(langKeys.gotosd)}
                    </Button>
                </div>
            </MuiPickersUtilsProvider>
        </DialogZyx>
    );
}

export default ServiceDeskLeadFormModal;

const useTabPanelLogNoteStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1)
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '100%',
    },
    paper: {
        backgroundColor: 'white',
        padding: theme.spacing(2),
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    logTextContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    logOwnerName: {
        fontWeight: 'bold',
    },
    avatar: {
        height: 28,
        width: 28,
    },
    centerRow: {
        alignItems: 'center',
    },
    logDate: {
        color: 'grey',
        fontSize: 12,
    },
}));

interface TabPanelLogNoteProps {
    loading?: boolean;
    notes: ICrmLeadNote[];
}

export const TabPanelLogNote: FC<TabPanelLogNoteProps> = ({ notes, loading }) => {
    const classes = useTabPanelLogNoteStyles();

    return (
        <div className={clsx(classes.root, classes.column)}>
            {loading ? <Loading /> :
                (notes.length === 0) ? <NoData /> :
                    notes.map((note, index) => (
                        <div key={`lead_note_${index}`}>
                            <div className={classes.paper}>
                                <div className={classes.row}>
                                    <Avatar className={classes.avatar} />
                                    <div style={{ width: '1em' }} />
                                    <div className={classes.logTextContainer}>
                                        <div className={clsx(classes.row, classes.centerRow)}>
                                            <span className={classes.logOwnerName}>{note.createby}</span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.logDate}>{formatDate(note.createdate)}</span>
                                        </div>
                                        <div style={{ height: 4 }} />
                                        <span>{note.description}</span>
                                        {note.media && <div style={{ height: 4 }} />}
                                        {note.media && <FileCollectionPreview files={note.media} />}
                                    </div>
                                </div>
                            </div>
                            {index !== notes.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                        </div>
                    ))}
        </div>
    );
}

const Loading: FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <CircularProgress />
        </div>
    );
}

const NoData: FC = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 100 }}>
            <span style={{ color: 'grey' }}><Trans i18nKey={langKeys.noData} /></span>
        </div>
    );
}

interface FilePreviewProps {
    src: File | string;
    onClose?: () => void;
}

const useFilePreviewStyles = makeStyles(theme => ({
    root: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        maxWidth: 300,
        maxHeight: 80,
        alignItems: 'center',
        width: 'fit-content',
        overflow: 'hidden'
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'lightgrey',
    },
    filename: {
        fontWeight: 'bold',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        maxWidth: 190,
        whiteSpace: 'nowrap',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1].substring(18) : ""; // antes era de 13
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop() || "-";
        }
        return (src as File).name.split('.').pop() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div className={classes.filename}>
                        {getFileName()}
                    </div>
                    {getFileExt().toUpperCase()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={onClose}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a
                        href={src as string}
                        target="_blank"
                        rel="noreferrer"
                        download={`${getFileName()}.${getFileExt()}`}
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

interface FileCollectionPreviewProps {
    files: File[] | string;
    onCloseFile?: (file: File) => void;
}

const FileCollectionPreview: FC<FileCollectionPreviewProps> = ({ files, onCloseFile }) => {
    const buildFileChildren = useCallback((files: File[]) => {
        const children: React.ReactElement[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            children.push(<FilePreview key={i} src={file} onClose={() => onCloseFile?.(file)} />);
        }

        return children;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildStringChildren = useCallback((files: string) => {
        return files.split(',').map((file, i) => {
            return <FilePreview key={i} src={file} />;
        });
    }, []);

    const children = useMemo(() => {
        return typeof files === "string" ? buildStringChildren(files) : buildFileChildren(files);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
            {children}
        </div>
    )
}

interface Options {
    withTime?: boolean;
}

const formatDate = (strDate: string = "", options: Options = { withTime: true }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(typeof strDate === "number" ? strDate : strDate.replace("Z", ""));
    // date.setHours(date.getHours() + 5);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}
