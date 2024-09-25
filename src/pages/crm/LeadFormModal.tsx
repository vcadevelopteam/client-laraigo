/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles, CircularProgress, Box, IconButton, Tabs, Avatar, Paper, InputAdornment, Button } from '@material-ui/core';
import { FieldEdit, FieldMultiSelectFreeSolo, AntTabPanel, FieldMultiSelectVirtualized, DialogZyx } from 'components';
import { langKeys } from 'lang/keys';
import { Trans, useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { getDomainsByTypename } from 'store/person/actions';
import {
    leadLogNotesSel, getLeadsSel} from 'common/helpers';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
    getLead, getLeadLogNotes, resetGetLead, 
    resetGetLeadLogNotes, 
    resetGetLeadProductsDomain, getLeadProductsDomain
} from 'store/lead/actions';
import { ICrmLeadNote, ICrmLeadNoteSave } from '@types';
import { showSnackbar } from 'store/popus/actions';
import { Rating } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Close, GetApp, FileCopy } from '@material-ui/icons';
import clsx from 'clsx';
import { Note as NoteIcon } from '@material-ui/icons';
import { AntTab } from 'components';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';

const useLeadFormModalStyles = makeStyles(theme => ({
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
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    }
}));

function returnNumberprio(prio: string) {
    switch (prio) {
        case 'HIGH':
            return 3
        case 'MEDIUM':
            return 2
        default:
            return 1
    }
}
export const LeadFormModal: FC<{ openModal: boolean, setOpenModal: (x: boolean) => void, leadId: number, phase: string }> = ({ openModal, setOpenModal, leadId, phase }) => {
    const classes = useLeadFormModalStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const match = useRouteMatch<{ id: string, columnid?: string, columnuuid?: string }>();
    const edit = false
    const [tabIndex, setTabIndex] = useState(0);
    const lead = useSelector(state => state.lead.lead);
    const user = useSelector(state => state.login.validateToken.user);
    const leadNotes = useSelector(state => state.lead.leadLogNotes);
    const leadProductsDomain = useSelector(state => state.lead.leadProductsDomain);
    const history = useHistory();

    useEffect(() => {
        dispatch(getDomainsByTypename());
    }, []);

    useEffect(() => {
        dispatch(getLead(getLeadsSel({
            id: Number(leadId),
            campaignid: 0,
            fullname: '',
            leadproduct: '',
            tags: '',
            userid: "",
            supervisorid: user?.userid || 0, // Obligatorio sin ser cero
            ordertype: '',
            orderby: '',
            persontype: "",
            all: false,
        })));
        dispatch(getLeadLogNotes(leadLogNotesSel(leadId)));
        dispatch(getLeadProductsDomain());

        return () => {
            dispatch(resetGetLead());
            dispatch(resetGetLeadLogNotes());
            dispatch(resetGetLeadProductsDomain());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, match.params.id, dispatch]);

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

    useEffect(() => {
        if (leadProductsDomain.loading) return;
        if (leadProductsDomain.error) {
            const errormessage = t(leadProductsDomain.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                severity: "error",
                show: true,
            }));
        }
    }, [leadProductsDomain, match.params.id, edit, t, dispatch]);

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
                            <FieldEdit
                                label={t(langKeys.phase)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={phase}
                            />
                        </div>
                        <div className='col-3'>
                            <FieldEdit
                                label={t(langKeys.phone)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.phone}
                            />
                        </div>
                        <div className='col-3'>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                <Trans i18nKey={langKeys.priority} />
                            </Box>
                            <Rating
                                name="simple-controlled"
                                max={3}
                                disabled={true}
                                value={returnNumberprio(lead.value?.priority || "")}
                            />
                        </div>
                        <div className='col-6'>
                            <FieldEdit
                                label={t(langKeys.customer)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.displayname}
                            />
                        </div>
                        <div className='col-3'>
                            <FieldEdit
                                label={t(langKeys.expected_revenue)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.expected_revenue}
                                type="number"
                                InputProps={{
                                    startAdornment: !user ? null : (
                                        <InputAdornment position="start">
                                            {user!.currencysymbol}
                                        </InputAdornment>
                                    ),
                                    style: { textAlign: 'right' },
                                }}
                                inputProps={{
                                    style: { textAlign: 'right' },
                                }}
                            />
                        </div>
                        <div className='col-3'>
                            <FieldEdit
                                label={t(langKeys.ticket)}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.ticketnum}
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
                        <div className='col-6'>
                            <FieldMultiSelectVirtualized
                                label={t(langKeys.product, { count: 2 })}
                                className={classes.field}
                                disabled={true}
                                valueDefault={lead.value?.leadproduct}
                                data={leadProductsDomain.data}
                                loading={leadProductsDomain.loading}
                                optionDesc="title"
                                optionValue="productid"
                            />
                        </div>
                        <div className='col-6'>
                                <FieldMultiSelectFreeSolo
                                    label={t(langKeys.tags)}
                                    className={classes.field}
                                    disabled={true}
                                    valueDefault={lead?.value?.tags}
                                    loading={false}
                                    data={lead?.value?.tags.split(',').map(word => ({ domaindesc: word }))||[]}
                                    optionDesc="domaindesc"
                                    optionValue="domaindesc"
                                />
                        </div>
                    </div>
                    <div style={{ height: '1em' }} />
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
                            readOnly={true}
                            loading={leadNotes.loading}
                            notes={leadNotes.data}
                            leadId={Number(match.params.id)}
                        />
                    </AntTabPanel>
                </div>
                <div style={{gap:10, display: "flex",justifyContent: "end"}}>                
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
                        onClick={() => {history.push(paths.CRM_EDIT_LEAD.resolve(leadId))}}
                    >
                        {t(langKeys.gotolead)}
                    </Button>
                </div> 
            </MuiPickersUtilsProvider>
        </DialogZyx>
    );
}

export default LeadFormModal;

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
    readOnly: boolean;
    loading?: boolean;
    notes: ICrmLeadNote[];
    leadId: number;
    onSubmit?: (newNote: ICrmLeadNoteSave) => void;
    AdditionalButtons?: () => JSX.Element | null;
}

export const TabPanelLogNote: FC<TabPanelLogNoteProps> = ({ notes, loading, readOnly, leadId, onSubmit, AdditionalButtons }) => {
    const classes = useTabPanelLogNoteStyles();

    return (
        <div className={clsx(classes.root, classes.column)}>
            {!readOnly && <div style={{ height: '1.3em' }} />}
            {loading ? <Loading /> :
                (notes.length === 0 && readOnly) ? <NoData /> :
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
                                            <span className={classes.logDate}>{formatDate(note.createdate, { withTime: true, modhours: -5 })}</span>
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
    modhours?: number
}

const formatDate = (strDate: string = "", options: Options = { withTime: true, modhours: 0 }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(typeof strDate === "number" ? strDate : strDate.replace("Z", ""));
    date.setHours(date.getHours() + (options?.modhours || 0));
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}
