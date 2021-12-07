import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, IconButton, Checkbox, Tabs, Avatar, Paper, InputAdornment } from '@material-ui/core';
import { EmojiPickerZyx, FieldEdit, FieldMultiSelectFreeSolo, FieldSelect, FieldView, PhoneFieldEdit, RadioGroudFieldEdit, TitleDetail, AntTabPanel } from 'components';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import { insLead2, getOneLeadSel, adviserSel, getPaginatedPerson as getPersonListPaginated1, leadLogNotesSel, leadActivitySel, leadLogNotesIns, leadActivityIns, getValuesFromDomain, getColumnsSel, insArchiveLead, leadHistorySel, updateLeadTagsIns } from 'common/helpers';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { archiveLead, getAdvisers, getLead, getLeadActivities, getLeadHistory, getLeadLogNotes, getLeadPhases, markDoneActivity, resetArchiveLead, resetGetLead, resetGetLeadActivities, resetGetLeadHistory, resetGetLeadLogNotes, resetGetLeadPhases, resetMarkDoneActivity, resetSaveLead, resetSaveLeadActivity, resetSaveLeadLogNote, saveLeadActivity, saveLeadLogNote, saveLeadWithFiles, updateLeadTags, saveLead as saveLeadAction } from 'store/lead/actions';
import { ICrmLead, IcrmLeadActivity, ICrmLeadActivitySave, ICrmLeadHistory, ICrmLeadNote, ICrmLeadNoteSave, ICrmLeadTagsSave, IDomain, IFetchData, IPerson } from '@types';
import { showSnackbar } from 'store/popus/actions';
import { Rating, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TableZyx from 'components/fields/table-paginated';
import { Add, AttachFile, Clear, Close, GetApp, Create, Done, FileCopy, Info, Mood } from '@material-ui/icons';
import { getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';
import clsx from 'clsx';
import { AccessTime as AccessTimeIcon, Archive as ArchiveIcon, Flag as FlagIcon, Cancel as CancelIcon, Note as NoteIcon, LocalOffer as LocalOfferIcon, LowPriority as LowPriorityIcon, Star as StarIcon, History as HistoryIcon } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain } from 'store/main/actions';
import { AntTab } from 'components';
import { EmailIcon, HSMIcon, SmsIcon } from 'icons';

const tagsOptions = [
    { title: "Information" },
    { title: "Design" },
    { title: "Product" },
    // crear mas
];

const urgencyLevels = ['', 'LOW', 'MEDIUM', 'HIGH']

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
        fontSize: 10,
    },
}));

export const LeadForm: FC<{ edit?: boolean }> = ({ edit = false }) => {
    const classes = useLeadFormStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string, columnid: string, columnuuid: string }>();
    const [values, setValues] = useState<ICrmLead>({
        column_uuid: match.params.columnuuid,
        columnid: Number(match.params.columnid),
        priority: 'LOW',
    } as ICrmLead
    );
    const [tabIndex, setTabIndex] = useState(0);
    const [openPersonModal, setOpenPersonmodal] = useState(false);
    const lead = useSelector(state => state.lead.lead);
    const advisers = useSelector(state => state.lead.advisers);
    // const saveLead = useSelector(state => state.lead.saveLead);
    const phases = useSelector(state => state.lead.leadPhases);
    const user = useSelector(state => state.login.validateToken.user);
    const archiveLeadProcess = useSelector(state => state.lead.archiveLead);
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);
    const saveNote = useSelector(state => state.lead.saveLeadNote);
    const leadActivities = useSelector(state => state.lead.leadActivities);
    const leadNotes = useSelector(state => state.lead.leadLogNotes);
    const saveLead = useSelector(state => state.lead.saveLead);
    const leadHistory = useSelector(state => state.lead.leadHistory);
    const updateLeadTagProcess = useSelector(state => state.lead.updateLeadTags);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, reset } = useForm<any>({
        defaultValues: {
            leadid: 0,
            description: '',
            status: 'ACTIVO',
            type: 'NINGUNO',
            expected_revenue: '',
            date_deadline: '',
            tags: '',
            personcommunicationchannel: '',
            priority: 'LOW',
            conversationid: 0,
            columnid: Number(match.params.columnid),
            column_uuid: match.params.columnuuid,
            index: 0,
            phone: '',
            email: '',
            operation: "INSERT",
            userid: 0,
            phase: '',

            activities: [] as ICrmLeadActivitySave[],
            notes: [] as ICrmLeadNoteSave[],

            feedback: '',
        }
    });

    const registerFormFieldOptions = useCallback(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('expected_revenue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('date_deadline', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('tags', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('personcommunicationchannel', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('userid', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });
        register('columnid', { validate: (value) => ((value !== null && value !== undefined && value !== '') || t(langKeys.field_required) + "") });
    }, [register, t]);

    React.useEffect(() => {
        registerFormFieldOptions();
    }, [registerFormFieldOptions]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        if (edit) {
            dispatch(saveLeadAction(insLead2(data, data.operation), false));
        } else {
            dispatch(saveLeadWithFiles(async (uploader) => {
                const notes = (data.notes || []) as ICrmLeadNoteSave[];
                for (let i = 0; i < notes.length; i++) {
                    if (notes[i].media && typeof notes[i].media === "object") {
                        const url = await uploader(notes[i].media as File);
                        notes[i].media = url;
                    }
                }

                return {
                    header: insLead2(data, data.operation),
                    detail: [
                        ...notes.map((x: ICrmLeadNoteSave) => leadLogNotesIns(x)),
                        ...(data.activities || []).map((x: ICrmLeadActivitySave) => leadActivityIns(x)),
                    ],
                };
            }, true));
        }
        // dispatch(saveLeadBody(body));
    }, e => console.log(e));

    useEffect(() => {
        if (edit === true) {
            const leadId = match.params.id;
            dispatch(getLead(getOneLeadSel(leadId)));
            dispatch(getLeadActivities(leadActivitySel(leadId)));
            dispatch(getLeadLogNotes(leadLogNotesSel(leadId)));
            dispatch(getLeadHistory(leadHistorySel(leadId)));
        }

        dispatch(getAdvisers(adviserSel()));
        // dispatch(getLeadPhases(getValuesFromDomain("ESTADOSOPORTUNIDAD")));
        dispatch(getLeadPhases(getColumnsSel(0, true)));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetSaveLead());
            dispatch(resetGetPersonListPaginated());
            dispatch(resetGetLeadPhases());
            dispatch(resetArchiveLead());
            dispatch(resetGetLeadActivities());
            dispatch(resetSaveLeadActivity());
            dispatch(resetGetLeadLogNotes());
            dispatch(resetSaveLeadLogNote());
            dispatch(resetGetLeadHistory());
        };
    }, [edit, match.params.id, dispatch]);

    useEffect(() => {
        if (!edit) return;
        if (lead.loading) return;
        if (lead.error) {
            const errormessage = t(lead.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                success: false,
                message: errormessage,
                show: true,
            }));
        } else if (lead.value && edit) {
            setValues(lead.value!);
            reset({
                description: lead.value?.description,
                status: lead.value?.status,
                type: 'NINGUNO',
                expected_revenue: lead.value?.expected_revenue,
                date_deadline: lead.value?.date_deadline,
                tags: lead.value?.tags,
                personcommunicationchannel: lead.value?.personcommunicationchannel,
                priority: lead.value?.priority,
                conversationid: lead.value?.conversationid,
                index: lead.value?.index,
                phone: lead.value?.phone,
                email: lead.value?.email,
                operation: "UPDATE",
                userid: lead.value?.userid,
                columnid: lead.value?.columnid,
                column_uuid: lead.value?.column_uuid,
                leadid: match.params.id,
                phase: lead.value?.phase,

                activities: [] as ICrmLeadActivitySave[],
                notes: [] as ICrmLeadNoteSave[],

                feedback: '',
            });
            registerFormFieldOptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lead, edit, dispatch]);

    useEffect(() => {
        if (advisers.loading) return;
        if (advisers.error) {
            const errormessage = t(advisers.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                success: false,
                message: errormessage,
                show: true,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [advisers, dispatch]);

    useEffect(() => {
        console.log(saveLead);
        if (saveLead.loading) return;
        if (saveLead.error) {
            const errormessage = t(saveLead.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                success: false,
                message: errormessage,
                show: true,
            }));
        } else if (saveLead.success === true) {
            dispatch(showSnackbar({
                success: true,
                message: "Se guardo la oportunidad con éxito",
                show: true,
            }));
            history.push(paths.CRM);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveLead, history, dispatch]);

    useEffect(() => {
        if (archiveLeadProcess.loading) return;
        if (archiveLeadProcess.error) {
            const errormessage = t(archiveLeadProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                success: false,
                message: errormessage,
                show: true,
            }));
        } else if (archiveLeadProcess.success) {
            dispatch(showSnackbar({
                success: true,
                message: "Se cerró la oportunidad con éxito",
                show: true,
            }));
            history.push(paths.CRM);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [archiveLeadProcess, history, dispatch]);

    useEffect(() => {
        if (leadActivities.loading) return;
        if (leadActivities.error) {
            const errormessage = t(leadActivities.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadActivities, dispatch]);

    useEffect(() => {
        if (saveActivity.loading) return;
        if (saveActivity.error) {
            const errormessage = t(saveActivity.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        } else if (saveActivity.success) {
            dispatch(showSnackbar({
                message: "Se guardó la actividad",
                success: true,
                show: true,
            }));
            dispatch(getLeadActivities(leadActivitySel(match.params.id)));
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveActivity, dispatch]);

    useEffect(() => {
        if (leadNotes.loading) return;
        if (leadNotes.error) {
            const errormessage = t(leadNotes.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadNotes, dispatch]);

    useEffect(() => {
        if (saveNote.loading) return;
        if (saveNote.error) {
            const errormessage = t(saveNote.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        } else if (saveNote.success) {
            dispatch(showSnackbar({
                message: "Se registró la nota",
                success: true,
                show: true,
            }));
            dispatch(getLeadLogNotes(leadLogNotesSel(match.params.id)));
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveNote, match.params.id, dispatch]);

    useEffect(() => {
        if (leadHistory.loading) return;
        if (leadHistory.error) {
            const errormessage = t(leadHistory.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leadHistory, dispatch]);

    useEffect(() => {
        if (updateLeadTagProcess.loading) return;
        if (updateLeadTagProcess.error) {
            const errormessage = t(updateLeadTagProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        } else if (updateLeadTagProcess.success && edit === true) {
            dispatch(getLeadHistory(leadHistorySel(match.params.id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateLeadTagProcess, match.params.id, edit, dispatch]);

    const handleCloseLead = useCallback(() => {
        if (!lead.value) return;
        dispatch(archiveLead(insArchiveLead(lead.value!)));
    }, [lead, dispatch]);

    const handleUpdateLeadTags = useCallback((tags: string, value: string, action: "NEWTAG" | "REMOVETAG") => {
        if (edit === false) return;

        const data: ICrmLeadTagsSave = {
            history_description: value,
            history_status: "ACTIVO",
            history_type: action,
            leadid: Number(match.params.id),
            tags,
        };

        dispatch(updateLeadTags(updateLeadTagsIns(data)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, dispatch]);

    const iSProcessLoading = useCallback(() => {
        return (
            saveLead.loading ||
            archiveLeadProcess.loading ||
            saveActivity.loading ||
            saveNote.loading
        );
    }, [saveLead, archiveLeadProcess, saveActivity, saveNote]);

    const isStatusClosed = useCallback(() => {
        return lead.value?.status === "CERRADO";
    }, [lead]);

    if (edit === true && lead.loading && advisers.loading) {
        return <Loading />;
    } else if (edit === true && (lead.error)) {
        return <div>ERROR</div>;
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.root}>
                <form onSubmit={onSubmit}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="hover"
                            color="inherit"
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                if (iSProcessLoading()) return;
                                history.push(paths.CRM);
                            }}
                        >
                            CRM
                        </Link>
                        <Link
                            underline="hover"
                            color="textPrimary"
                            href={history.location.pathname}
                            onClick={(e) => e.preventDefault()}
                        >
                            <Trans i18nKey={langKeys.opportunity} />
                        </Link>
                    </Breadcrumbs>

                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'row' }}>
                        <TitleDetail
                            variant="h1"
                            title={edit ?
                                (
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <span>{getValues('description')}</span>
                                        {isStatusClosed() && <div style={{ width: '0.63em' }} />}
                                        {isStatusClosed() && (
                                            <div className={classes.badge}>
                                                <Trans i18nKey={langKeys.closed2} />
                                            </div>
                                        )}
                                    </div>
                                ) :
                                <Trans i18nKey={langKeys.newLead} />
                            }
                        />
                        <div style={{ flexGrow: 1 }} />
                        {(!lead.loading) && <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => history.push(paths.CRM)}
                            disabled={iSProcessLoading()}
                        >
                            <Trans i18nKey={langKeys.back} />
                        </Button>}
                        {(edit && lead.value && !isStatusClosed()) && (
                            <Button
                                variant="contained"
                                type="button"
                                color="secondary"
                                startIcon={<ArchiveIcon />}
                                onClick={handleCloseLead}
                                disabled={iSProcessLoading()}
                            >
                                <Trans i18nKey={langKeys.close} />
                            </Button>
                        )}
                        {(!isStatusClosed() && !lead.loading) && <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                            disabled={iSProcessLoading()}
                        >
                            <Trans i18nKey={langKeys.save} />
                        </Button>}
                    </div>
                    <div style={{ height: '1em' }} />
                    <Grid container direction="row" style={{ backgroundColor: 'white', padding: '16px' }}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    className={classes.field}
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={getValues('description')}
                                    error={errors?.description?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.email)}
                                    className={classes.field}
                                    onChange={(value) => setValue('email', value)}
                                    valueDefault={getValues('email')}
                                    error={errors?.email?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.expected_revenue)}
                                    className={classes.field}
                                    type="number"
                                    onChange={(value) => setValue('expected_revenue', value)}
                                    valueDefault={getValues('expected_revenue')}
                                    error={errors?.expected_revenue?.message}
                                    InputProps={{
                                        startAdornment: !user ? null : (
                                            <InputAdornment position="start">
                                                {user!.currencysymbol}
                                            </InputAdornment>
                                        ),
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldMultiSelectFreeSolo
                                    label={t(langKeys.tags)}
                                    className={classes.field}
                                    valueDefault={getValues('tags')}
                                    onChange={(value: ({title: string} | string)[], value2: {action: "create-option" | "remove-option", option: {option: string}}) => {
                                        console.log('FieldMultiSelectFreeSolo:onChange', value, value2);
                                        const tags = value.map((o: any) => o.title || o).join();
                                        setValue('tags', tags);

                                        if (value2.action === "create-option") {
                                            handleUpdateLeadTags(tags, value2.option.option, "NEWTAG");
                                        } else {
                                            handleUpdateLeadTags(tags, value2.option.option, "REMOVETAG");
                                        }
                                    }}
                                    error={errors?.tags?.message}
                                    loading={false}
                                    data={tagsOptions.concat(getValues('tags').split(',').filter((i: any) => i !== '' && (tagsOptions.findIndex(x => x.title === i)) < 0).map((title: any) => ({ title })))}
                                    optionDesc="title"
                                    optionValue="title"
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                                {(!!getValues('userid') || !edit) &&
                                    <FieldSelect
                                        label={t(langKeys.advisor)}
                                        className={classes.field}
                                        valueDefault={getValues('userid')}
                                        loading={advisers.loading}
                                        data={advisers.data}
                                        optionDesc="firstname"
                                        optionValue="userid"
                                        onChange={(value) => setValue('userid', value ? value.userid : '')}
                                        error={errors?.userid?.message}
                                        readOnly={isStatusClosed() || iSProcessLoading()}
                                    />
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <Grid container direction="column">
                                {edit ?
                                    (<FieldView
                                        label={t(langKeys.customer)}
                                        className={classes.field}
                                        value={lead.value?.displayname}
                                    />) :
                                    (<div style={{ display: 'flex', flexDirection: 'column' }} className={classes.field} >
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <div style={{ flexGrow: 1 }}>
                                                <FieldView
                                                    label={t(langKeys.customer)}
                                                    value={values?.displayname}
                                                />
                                            </div>
                                            <IconButton
                                                color="primary"
                                                onClick={() => setOpenPersonmodal(true)}
                                                size="small"
                                                disabled={isStatusClosed() || iSProcessLoading()}
                                            >
                                                <Add style={{ height: 22, width: 22 }} />
                                            </IconButton>
                                        </div>
                                        <div style={{ flexGrow: 1, marginTop: (errors?.personcommunicationchannel?.message) ? '29px' : '3px' }} />
                                        <div style={{ borderBottom: `solid ${(errors?.personcommunicationchannel?.message) ? '2px rgba(250,0,0,1)' : '1px rgba(0,0,0,0.42)'} `, marginBottom: '4px' }}></div>
                                        <div style={{ display: (errors?.personcommunicationchannel?.message) ? 'inherit' : 'none', color: 'red', fontSize: '0.75rem' }}>{errors?.personcommunicationchannel?.message}</div>
                                    </div>)
                                }
                                <PhoneFieldEdit
                                    disableAreaCodes={true}
                                    value={getValues('phone')}
                                    label={t(langKeys.phone)}
                                    name="mobilephone"
                                    fullWidth
                                    defaultCountry={user!.countrycode.toLowerCase()}
                                    className={classes.field}
                                    onChange={(v: any) => setValue('phone', v)}
                                    error={errors?.phone?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <FieldEdit
                                    label={t(langKeys.endDate)}
                                    className={classes.field}
                                    type="date"
                                    onChange={(value) => setValue('date_deadline', value)}
                                    valueDefault={getValues('date_deadline')?.substring(0, 10)}
                                    error={errors?.date_deadline?.message}
                                    InputProps={{
                                        readOnly: isStatusClosed() || iSProcessLoading(),
                                    }}
                                />
                                <div className={classes.field}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        <Trans i18nKey={langKeys.priority} />
                                    </Box>
                                    <Rating
                                        name="simple-controlled"
                                        max={3}
                                        defaultValue={lead.value?.priority === 'LOW' ? 1 : lead.value?.priority === 'MEDIUM' ? 2 : lead.value?.priority === 'HIGH' ? 3 : 1}
                                        onChange={(event, newValue) => {
                                            const priority = (newValue) ? urgencyLevels[newValue] : 'LOW';
                                            setValue('priority', priority)
                                        }}
                                        readOnly={isStatusClosed() || iSProcessLoading()}
                                    />
                                </div>
                                <RadioGroudFieldEdit
                                    aria-label="columnid"
                                    value={Number(getValues('columnid'))}
                                    name="radio-buttons-group-columnid"
                                    className={classes.field}
                                    row
                                    optionDesc="description"
                                    optionValue="columnid"
                                    data={phases.data}
                                    onChange={(e) => {
                                        console.log('FormControlLabel', Number(e.columnid));
                                        setValue('column_uuid', e.column_uuid);
                                        setValue('columnid', Number(e.columnid));
                                        setValues(prev => ({ ...prev })); // refrescar
                                    }}
                                    label={<Trans i18nKey={langKeys.phase} />}
                                    error={errors?.columnid?.message}
                                    readOnly={isStatusClosed() || iSProcessLoading()}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
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
                    <AntTab
                        label={(
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <AccessTimeIcon style={{ width: 22, height: 22 }} />
                                <Trans i18nKey={langKeys.scheduleActivity} count={2} />
                            </div>
                        )}
                    />
                    {edit && (
                        <AntTab
                            label={(
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <AccessTimeIcon style={{ width: 22, height: 22 }} />
                                    <Trans i18nKey={langKeys.history} />
                                </div>
                            )}
                        />
                    )}
                </Tabs>
                <AntTabPanel index={0} currentIndex={tabIndex}>
                    <TabPanelLogNote
                        readOnly={isStatusClosed()}
                        loading={saveNote.loading || leadNotes.loading}
                        notes={edit ? leadNotes.data : getValues('notes')}
                        leadId={edit ? Number(match.params.id) : 0}
                        onSubmit={(newNote) => {
                            if (edit) {
                                const body = leadLogNotesIns(newNote);
                                dispatch(saveLeadLogNote(body));
                            } else {
                                newNote.createby = user?.firstname;
                                newNote.createdate = Date.now();
                                setValue('notes', [newNote, ...getValues('notes')]);
                                setValues(prev => ({ ...prev })); // refresh
                            }
                        }}
                    />
                </AntTabPanel>
                <AntTabPanel index={1} currentIndex={tabIndex}>
                    <TabPanelScheduleActivity
                        readOnly={isStatusClosed()}
                        leadId={edit ? Number(match.params.id) : 0}
                        loading={saveActivity.loading || leadActivities.loading}
                        activities={edit ? leadActivities.data : getValues('activities')}
                        onSubmit={(newActivity) => {
                            if (edit) {
                                const body = leadActivityIns(newActivity);
                                dispatch(saveLeadActivity(body));
                            } else {
                                setValue('activities', [...getValues('activities'), newActivity]);
                                setValues(prev => ({ ...prev })); // refresh
                            }
                        }}
                    />
                </AntTabPanel>
                <AntTabPanel index={2} currentIndex={tabIndex}>
                    <TabPanelLeadHistory
                        history={leadHistory.data}
                        loading={leadHistory.loading}
                    />
                </AntTabPanel>
                {edit === false && (
                    <SelectPersonModal
                        open={openPersonModal}
                        onClose={() => setOpenPersonmodal(false)}
                        onClick={(value) => {
                            setValue('personcommunicationchannel', value.personcommunicationchannel)
                            setValue('email', value.email || '')
                            setValue('phone', value.phone || '')
                            setValues(prev => ({ ...prev, displayname: value.displayname }))
                        }}
                    />
                )}
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default LeadForm;

interface SelectPersonModalProps {
    open: boolean;
    onClose: () => void;
    onClick: (person: IPerson) => void;
}

const useSelectPersonModalStyles = makeStyles(theme => ({
    root: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "80%",
        maxHeight: "80%",
        width: '80%',
        backgroundColor: 'white',
        padding: "16px",
        overflowY: 'auto',
    },
}));

const SelectPersonModal: FC<SelectPersonModalProps> = ({ open, onClose, onClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useSelectPersonModalStyles();
    const [pageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [pageSize] = useState(10);
    const personList = useSelector(state => state.person.personList);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <Checkbox
                            color="primary"
                            onClick={() => {
                                onClick(row);
                                onClose();
                            }}
                        />
                    );
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'displayname' as keyof IPerson,
            },
            {
                Header: t(langKeys.email),
                accessor: 'email' as keyof IPerson,
            },
            {
                Header: t(langKeys.phone),
                accessor: 'phone' as keyof IPerson,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [t],
    );

    const fetchData = useCallback(({ pageSize, pageIndex, filters, sorts }: IFetchData) => {
        dispatch(getPersonListPaginated(getPersonListPaginated1({
            skip: pageSize * pageIndex,
            startdate: '2021-01-01',
            enddate: '2025-01-01',
            take: pageSize,
            sorts: sorts,
            filters: filters,
        })));
    }, [dispatch]);

    useEffect(() => {
        fetchData({ pageSize, pageIndex, filters: {}, sorts: {}, daterange: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchData, dispatch]);

    useEffect(() => {
        if (personList.loading) return;
        if (personList.error) {
            const errormessage = t(personList.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        } else {
            setPageCount(Math.ceil(personList.count / pageSize));
            settotalrow(personList.count);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [personList]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.root}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.person, { count: 2 })}
                    data={personList.data}
                    loading={personList.loading}
                    fetchData={fetchData}
                    totalrow={totalrow}
                    pageCount={pageCount}
                    // pageSizeDefault={10}
                    hoverShadow
                    autotrigger
                />
            </Box>
        </Modal>
    );
}

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
    AdditionalButtons?: () => JSX.Element |null;
}

export const TabPanelLogNote: FC<TabPanelLogNoteProps> = ({ notes, loading, readOnly, leadId, onSubmit, AdditionalButtons }) => {
    const classes = useTabPanelLogNoteStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [noteDescription, setNoteDescription] = useState("");
    const [media, setMedia] = useState<File | null>(null);

    const handleSubmit = useCallback(() => {
        const newNote: ICrmLeadNoteSave = {
            leadid: leadId,
            leadnotesid: 0,
            description: noteDescription,
            type: "NINGUNO",
            status: "ACTIVO",
            media,
            username: null,
            operation: "INSERT",
        };
        onSubmit?.(newNote);
        handleCleanMediaInput();
        setNoteDescription("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteDescription, media, dispatch]);

    const handleInputMedia = useCallback(() => {
        const input = document.getElementById('noteMediaInput');
        input!.click();
    }, []);

    const onChangeMediaInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setMedia(e.target.files[0]);
    }, []);

    const handleCleanMediaInput = () => {
        if (media === null) return;
        const input = document.getElementById('noteMediaInput') as HTMLInputElement;
        input.value = "";
        setMedia(null);
    }

    return (
        <div className={clsx(classes.root, classes.column)}>
            {!readOnly && (
                <div className={clsx(classes.paper, classes.column)}>
                    <div className={classes.row}>
                        <Avatar className={classes.avatar} />
                        <div style={{ width: '1em' }} />
                        <div className={classes.column}>
                            <TextField
                                placeholder={t(langKeys.logAnInternalNote)}
                                minRows={4}
                                fullWidth
                                value={noteDescription}
                                onChange={e => setNoteDescription(e.target.value)}
                                disabled={loading}
                            />
                            <div style={{ height: 4 }} />
                            {media && <FilePreview src={media} onClose={handleCleanMediaInput} />}
                            {media && <div style={{ height: 4 }} />}
                            <input
                                accept="file/*"
                                style={{ display: 'none' }}
                                id="noteMediaInput"
                                type="file"
                                onChange={onChangeMediaInput}
                            />
                            <div className={classes.row}>
                                <EmojiPickerZyx
                                    style={{ zIndex: 10 }}
                                    onSelect={e => setNoteDescription(prev => prev.concat(e.native))}
                                    icon={onClick => (
                                        <IconButton color="primary" onClick={onClick} disabled={loading}>
                                            <Mood />
                                        </IconButton>
                                    )}
                                />
                                <div style={{ width: '0.5em' }} />
                                <IconButton onClick={handleInputMedia} color="primary" disabled={media !== null || loading}>
                                    <AttachFile />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: 12 }} />
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading || (noteDescription.length === 0 && media === null)}
                        >
                            {loading && <CircularProgress style={{ height: 28, width: 28, marginRight: '0.75em' }} />}
                            Log
                        </Button>
                        {AdditionalButtons && <AdditionalButtons />}
                    </div>
                </div>
            )}
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
                                            <span className={classes.logDate}>{formatDate(note.createdate)}</span>
                                        </div>
                                        <div style={{ height: 4 }} />
                                        <span>{note.description}</span>
                                        {note.media && <div style={{ height: 4 }} />}
                                        {note.media && <FilePreview src={note.media} />}
                                    </div>
                                </div>
                            </div>
                            {index !== notes.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                        </div>
                    ))}
        </div>
    );
}

const useTabPanelScheduleActivityStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    paper: {
        backgroundColor: 'white',
        padding: theme.spacing(2),
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    avatar: {
        height: 28,
        width: 28,
    },
    centerRow: {
        alignItems: 'center',
    },
    activityFor: {
        color: 'grey',
        fontSize: 12,
    },
    activityName: {
        fontWeight: 'bold',
    },
    activityDate: {
        fontWeight: 'bold',
        color: 'green',
    },
    unselect: {
        '-webkit-touch-callout': 'none', /* iOS Safari */
        '-webkit-user-select': 'none', /* Safari */
        '-khtml-user-select': 'none', /* Konqueror HTML */
        '-moz-user-select': 'none', /* Old versions of Firefox */
        '-ms-user-select': 'none', /* Internet Explorer/Edge */
        userSelect: 'none',
    },
    hoverCursor: {
        '&:hover': {
            cursor: 'pointer',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

interface TabPanelScheduleActivityProps {
    readOnly: boolean;
    loading?: boolean;
    activities: IcrmLeadActivity[];
    leadId: number;
    onSubmit?: (newActivity: ICrmLeadActivitySave) => void;
}

interface OpenModal {
    value: boolean;
    payload: IcrmLeadActivity | null;
}

export const TabPanelScheduleActivity: FC<TabPanelScheduleActivityProps> = ({ readOnly, activities, loading, leadId, onSubmit }) => {
    const classes = useTabPanelScheduleActivityStyles();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState<OpenModal>({ value: false, payload: null });
    const [openDoneModal, setOpenDoneModal] = useState<OpenModal>({ value: false, payload: null });

    return (
        <div className={clsx(classes.root, classes.column)}>
            {!readOnly && (
                <div className={classes.header}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={() => setOpenModal({ value: true, payload: null })}
                    >
                        <Trans i18nKey={langKeys.newActivity} />
                    </Button>
                </div>
            )}
            {!readOnly && <div style={{ height: 12 }} />}
            {loading ? <Loading /> :
                activities.length === 0 ? <NoData /> :
                    activities.map((activity, index) => (
                        <div key={`lead_activity${index}`}>
                            <div className={classes.paper}>
                                <div className={classes.row}>
                                    <Avatar className={classes.avatar} />
                                    <div style={{ width: '1em' }} />
                                    <div className={classes.column}>
                                        <div className={clsx(classes.row, classes.centerRow)}>
                                            <span className={classes.activityDate}>
                                                {`Due in ${formatDate(activity.duedate, { withTime: false })}`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityName}>
                                                {`"${activity.description}"`}
                                            </span>
                                            <div style={{ width: '1em' }} />
                                            <span className={classes.activityFor}>
                                                {`for ${activity.assignto}`}
                                            </span>
                                            <div style={{ width: '0.5em' }} />
                                            <Info style={{ height: 18, width: 18, fill: 'grey' }} />
                                        </div>
                                        {!readOnly && <div style={{ height: 4 }} />}
                                        {(!readOnly && leadId !== 0) && (
                                            <div className={clsx(classes.row, classes.unselect)}>
                                                <div style={{ width: '1em' }} />
                                                {activity.status === "PROGRAMADO" && (
                                                    <div
                                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                        onClick={() => {
                                                            setOpenDoneModal({ value: true, payload: activity });
                                                        }}
                                                        style={{ marginRight: '1em' }}
                                                    >
                                                        <Done style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                        <span><Trans i18nKey={langKeys.markDone} /></span>
                                                    </div>
                                                )}
                                                {activity.status === "PROGRAMADO" && (
                                                    <div
                                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                        onClick={() => setOpenModal({ value: true, payload: activity })}
                                                        style={{ marginRight: '1em' }}
                                                    >
                                                        <Create style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                        <span><Trans i18nKey={langKeys.edit} /></span>
                                                    </div>
                                                )}
                                                {activity.status === "PROGRAMADO" && <div
                                                    className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                                    onClick={() => {
                                                        const body = leadActivityIns({
                                                            ...activity,
                                                            username: null,
                                                            status: "ELIMINADO",
                                                            operation: "UPDATE",
                                                            feedback: '',
                                                        });
                                                        dispatch(saveLeadActivity(body));
                                                    }}
                                                >
                                                    <Clear style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                                    <span><Trans i18nKey={langKeys.cancel} /></span>
                                                </div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {index !== activities.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                        </div>
                    ))}
            <SaveActivityModal
                onClose={() => setOpenModal({ value: false, payload: null })}
                open={openModal.value}
                activity={openModal.payload}
                leadid={leadId}
                onSubmit={onSubmit}
            />
            <MarkDoneModal
                open={openDoneModal.value}
                onClose={() => setOpenDoneModal({ value: false, payload: null })}
                onNext={() => setOpenModal({ value: true, payload: null })}
                onSuccess={() => {
                    if (leadId !== 0) {
                        dispatch(getLeadActivities(leadActivitySel(leadId)));
                        dispatch(getLeadHistory(leadHistorySel(leadId)));
                    }
                }}
                onSubmit={(feedback, action) => {
                    if (action === "DISCARD" || !openDoneModal.payload) return;
                    const body = leadActivityIns({
                        ...openDoneModal.payload,
                        username: null,
                        status: "REALIZADO",
                        operation: "UPDATE",
                        feedback,
                    });
                    dispatch(markDoneActivity(body));
                }}
            />
        </div>
    );
}

interface SaveActivityModalProps {
    open: boolean;
    activity: IcrmLeadActivity | null;
    leadid: number;
    onClose: () => void;
    onSubmit?: (newActivity: ICrmLeadActivitySave) => void;
}

const useSaveActivityModalStyles = makeStyles(theme => ({
    field: {
        margin: theme.spacing(1),
        minHeight: 58,
    },
    footer: {
        marginTop: '1em',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    footerBtn: {
        marginRight: '0.6em',
    },
}));

export const SaveActivityModal: FC<SaveActivityModalProps> = ({ open, onClose, activity, leadid, onSubmit }) => {
    const modalClasses = useSelectPersonModalStyles();
    const classes = useSaveActivityModalStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mustCloseOnSubmit = useRef<boolean>(true);
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);
    const advisers = useSelector(state => state.lead.advisers);
    const domains = useSelector(state => state.main.mainData);

    useEffect(() => {
        dispatch(getCollection(getValuesFromDomain("TIPOACTIVIDADLEAD")));
        return () => {
            dispatch(resetMain());
        };
    }, [dispatch]);

    useEffect(() => {
        if (open !== true) return;

        if (saveActivity.loading || saveActivity.error) return;
        if (saveActivity.success) {
            dispatch(showSnackbar({
                message: "Se registró la actividad",
                success: true,
                show: true,
            }));
            dispatch(getLeadActivities(leadActivitySel(leadid)))
            if (mustCloseOnSubmit.current) {
                onClose();
            } else {
                resetValues();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveActivity, leadid, dispatch]);

    const { getValues, setValue, formState: { errors }, reset, handleSubmit, register } = useForm<ICrmLeadActivitySave>({
        defaultValues: {
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            type: activity?.type || "",
            status: activity?.status || "PROGRAMADO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
            feedback: '',
        },
    });

    const registerFormFieldOptions = useCallback(() => {
        const mandatoryStrField = (value: string) => {
            return value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        const validateDateFormat = (value: string) => {
            if (value.length === 0) return t(langKeys.field_required);
            if (value.split('-')[0].length > 4) return t(langKeys.date_format_error);

            return undefined;
        }

        register('description', { validate: mandatoryStrField });
        register('duedate', { validate: validateDateFormat });
        register('assignto', { validate: mandatoryStrField });
        register('type', { validate: mandatoryStrField });
    }, [register, t]);

    useEffect(() => {
        registerFormFieldOptions();
    }, [registerFormFieldOptions]);

    const resetValues = useCallback(() => {
        reset({
            leadid: leadid,
            leadactivityid: 0,
            description: "",
            duedate: "",
            assignto: "",
            type: "NINGUNO",
            status: "PROGRAMADO",
            username: null,
            operation: "INSERT",
            feedback: '',
        });
        registerFormFieldOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    useEffect(() => {
        reset({
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            type: activity?.type || "",
            status: activity?.status || "PROGRAMADO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
            feedback: '',
        });

        registerFormFieldOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activity, reset, register]);

    const handleSave = useCallback((status: "PROGRAMADO" | "REALIZADO" | "ELIMINADO") => {
        handleSubmit((values) => {
            values.status = status;
            onSubmit?.(values);
            if (leadid === 0 && mustCloseOnSubmit.current) {
                onClose();
            } else {
                resetValues();
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleSubmit, dispatch]);

    return (
        <Modal
            open={open}
            onClose={saveActivity.loading ? undefined : onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root}>
                <TitleDetail title={t(langKeys.scheduleActivity)} />
                <div style={{ height: '1em' }} />
                <Grid container direction="row">
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldSelect
                                    uset
                                    label={t(langKeys.activityType)}
                                    className={classes.field}
                                    data={domains.data}
                                    prefixTranslation="type_activitylead_"
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                    loading={domains.loading}
                                    valueDefault={getValues('type')}
                                    onChange={(v: IDomain) => setValue('type', v?.domainvalue || "")}
                                    error={errors?.type?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldEdit
                                    label={t(langKeys.summary)}
                                    className={classes.field}
                                    valueDefault={getValues('description')}
                                    onChange={v => setValue('description', v)}
                                    error={errors?.description?.message}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldEdit
                                    label={t(langKeys.dueDate)}
                                    className={classes.field}
                                    type="date"
                                    valueDefault={getValues('duedate')?.substring(0, 10)}
                                    onChange={(value) => setValue('duedate', value)}
                                    error={errors?.duedate?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldSelect
                                    label={t(langKeys.assignedTo)}
                                    className={classes.field}
                                    data={advisers.data}
                                    optionDesc="firstname"
                                    optionValue="firstname"
                                    loading={advisers.loading}
                                    valueDefault={getValues('assignto')}
                                    onChange={v => setValue('assignto', v?.firstname || "")}
                                    error={errors?.assignto?.message}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <div className={classes.footer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave("PROGRAMADO");
                        }}
                    >
                        <Trans i18nKey={!activity ? langKeys.schedule : langKeys.save} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave("REALIZADO");
                        }}
                    >
                        <Trans i18nKey={langKeys.markAsDone} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            mustCloseOnSubmit.current = false;
                            handleSave("REALIZADO");
                        }}
                    >
                        <Trans i18nKey={langKeys.doneAndScheduleNext} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={saveActivity.loading}
                        onClick={() => {
                            onClose();
                            resetValues();
                        }}
                    >
                        <Trans i18nKey={langKeys.discard} />
                    </Button>
                </div>
            </Box>
        </Modal>
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
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1] : "";
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop()?.toUpperCase() || "-";
        }
        return (src as File).name.split('.').pop()?.toUpperCase() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 190, whiteSpace: 'nowrap' }}>{getFileName()}</div>{getFileExt()}
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
                    <a href={src as string} target="_blank" rel="noreferrer" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}

interface MarkDoneModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (feedback: string, action: "DONE & NEXT" | "DONE" | "DISCARD") => void;
    onSuccess?: () => void;
    onNext: () => void;
}

const useMarkDoneModalStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        flexDirection: 'row',
    },
    footerBtn: {
        marginRight: '0.6em',
    },
}));

const MarkDoneModal: FC<MarkDoneModalProps> = ({ open, onClose, onSubmit, onNext, onSuccess }) => {
    const classes = useMarkDoneModalStyles();
    const modalClasses = useSelectPersonModalStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mustNext = useRef(false);
    const [feedback, setFeedBack] = useState("");
    const markDoneProcess = useSelector(state => state.lead.markDoneActivity);

    useEffect(() => {
        return () => {
            dispatch(resetMarkDoneActivity());
        };
    }, [dispatch]);

    useEffect(() => {
        if (open !== true) return;
        
        if (markDoneProcess.loading) return;
        if (markDoneProcess.error) {
            const errormessage = t(markDoneProcess.code || "error_unexpected_error", { module: t(langKeys.user).toLocaleLowerCase() });
            dispatch(showSnackbar({
                message: errormessage,
                success: false,
                show: true,
            }));
        } else if (markDoneProcess.success) {
            dispatch(showSnackbar({
                message: "Se marcó como hecho la actividad",
                success: true,
                show: true,
            }));
            onClose();
            if (mustNext.current) onNext();
            onSuccess?.();
            setFeedBack("");
            mustNext.current = false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markDoneProcess, dispatch]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root}>
                <TitleDetail title={<Trans i18nKey={langKeys.markDone} />} />
                <div style={{ height: '1.34em' }} />
                <FieldEdit
                    label={t(langKeys.writeFeedback)}
                    valueDefault={feedback}
                    onChange={setFeedBack}
                    InputProps={{
                        readOnly: markDoneProcess.loading,
                    }}
                />
                <div style={{ height: '2em' }} />
                <div className={classes.footer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() =>{
                            mustNext.current = true;
                            onSubmit(feedback, "DONE & NEXT");
                        }}
                    >
                        <Trans i18nKey={langKeys.doneAndScheduleNext} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() => {
                            mustNext.current = false;
                            onSubmit(feedback, "DONE");
                        }}
                    >
                        <Trans i18nKey={langKeys.done} />
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        disabled={markDoneProcess.loading}
                        onClick={() => {
                            mustNext.current = false;
                            setFeedBack("");
                            onClose();
                        }}
                    >
                        <Trans i18nKey={langKeys.discard} />
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

interface TabPanelLeadHistoryProps {
    history: ICrmLeadHistory[];
    loading: boolean;
}

const useTabPanelLeadHistoryStyles = makeStyles(theme => ({
    itemRoot: {
        borderRadius: 12,
        backgroundColor: '#e9e8e8',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',

        fontSize: 14,
        fontWeight: 400,
    },
    timelineItemBefore: {
        '&::before': {
            content: '""',
            flex: 0,
            display: 'none',
        }
    },
    timelineDot: {
        backgroundColor: 'blue',
    },
    itemHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    name: {
        color: 'blue',
        fontWeight: 'bold',
    },
    dateTime: {
        fontSize: 11,
        color: 'darkslategrey',
    },
}));

const TabPanelLeadHistory: FC<TabPanelLeadHistoryProps> = ({ history, loading }) => {
    const classes = useTabPanelLeadHistoryStyles();

    const Icon = useCallback(({ type }: { type: string }) => {
        switch (type) {
            case "NEWLEAD": return <StarIcon width={24} style={{ fill: 'white' }} />;
            case "NEWNOTE": return <NoteIcon width={24} style={{ fill: 'white' }} />;
            case "NEWACTIVITY": return <HistoryIcon width={24} style={{ fill: 'white' }} />;
            case "CHANGESTATUS": return <LowPriorityIcon width={24} style={{ fill: 'white' }} />;
            case "SENDHSM": return <HSMIcon width={24} style={{ fill: 'white' }} />;
            case "SENDMAIL": return <EmailIcon width={24} style={{ fill: 'white' }} />;
            case "SENDSMS": return <SmsIcon width={24} style={{ fill: 'white' }} />;
            case "NEWTAG": return <LocalOfferIcon width={24} style={{ fill: 'white' }} />;
            case "REMOVETAG": return <LocalOfferIcon width={24} style={{ fill: 'white' }} />;
            case "CLOSEDLEAD": return <CancelIcon width={24} style={{ fill: 'white' }} />;
            case "ACTIVITYDONE":
            case "ACTIVITYDISCARD":
            case "ACTIVITYCHANGESTATUS":
            case "ACTIVITYUPDATE":
            default: return <FlagIcon width={24} style={{ fill: 'white' }} />;
        }
    }, []);

    if (loading) {
        return <Loading />;
    }
    return (
        <Box>
            <Timeline align="left">
                {history.map((item, i) => (
                    <TimelineItem key={i} className={classes.timelineItemBefore}>
                        <TimelineSeparator>
                            <TimelineDot className={classes.timelineDot}>
                                <Icon type={item.type}  />
                            </TimelineDot>
                            <TimelineConnector className={classes.timelineDot} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <div className={classes.itemRoot}>
                                <div className={classes.itemHeader}>
                                    <span className={classes.name}>
                                        <Trans i18nKey={item.type} />
                                    </span>
                                    <div style={{ width: '1em' }} />
                                    <span className={classes.dateTime}>
                                        {formatDate(item.createdate)}
                                    </span>
                                </div>
                                {item.description && <span>{item.description}</span>}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
}

interface Options {
    withTime?: boolean;
}

const formatDate = (strDate: string, options: Options = { withTime: true }) => {
    if (!strDate || strDate === '') return '';

    const date = new Date(strDate);
    const day = date.toLocaleDateString("en-US", { day: '2-digit' });
    const month = date.toLocaleDateString("en-US", { month: '2-digit' });
    const year = date.toLocaleDateString("en-US", { year: 'numeric' });
    const time = date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
    return `${day}/${month}/${year}${options.withTime! ? time.split(',')[1] : ''}`;
}
