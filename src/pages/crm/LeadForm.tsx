import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, IconButton, Checkbox, AppBar, Tabs, Tab, Avatar, Paper } from '@material-ui/core';
import { EmojiPickerZyx, FieldEdit, FieldMultiSelectFreeSolo, FieldSelect, FieldView, TitleDetail } from 'components';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import { insLead2, getOneLeadSel, adviserSel, getPaginatedPerson as getPersonListPaginated1, leadLogNotesSel, leadActivitySel, leadLogNotesIns, leadActivityIns, getValuesFromDomain } from 'common/helpers';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { getAdvisers, getLead, getLeadActivities, getLeadLogNotes, getLeadPhases, resetGetLead, resetGetLeadActivities, resetGetLeadLogNotes, resetGetLeadPhases, resetSaveLead, resetSaveLeadActivity, resetSaveLeadLogNote, saveLead as saveLeadBody, saveLeadActivity, saveLeadLogNote } from 'store/lead/actions';
import { ICrmLead, IcrmLeadActivity, ICrmLeadActivitySave, IDomain, IFetchData, IPerson } from '@types';
import { showSnackbar } from 'store/popus/actions';
import { Rating } from '@material-ui/lab';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TableZyx from 'components/fields/table-paginated';
import { Add, AttachFile, Clear, Close, GetApp, Create, Done, FileCopy, Info, Mood } from '@material-ui/icons';
import { getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';
import clsx from 'clsx';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain } from 'store/main/actions';

const tagsOptions = [
    { title: "Information"},
    { title: "Design"},
    { title: "Product"},
    // crear mas
];

interface TabPanelProps {
    value: string;
    index: string;
}

const useTabPanelStyles = makeStyles(theme => ({
    root: {
        border: '#A59F9F 1px solid',
        borderRadius: 6,
    },
}));

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    const classes = useTabPanelStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={1}>
                {children}
            </Box>
        </div>
    );
}

const urgencyLevels = ['','LOW','MEDIUM','HIGH']
  
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
            priority: 'LOW', } as ICrmLead
    );
    const [tabIndex, setTabIndes] = useState('0');
    const [openPersonModal, setOpenPersonmodal] = useState(false);
    const lead = useSelector(state => state.lead.lead);
    const advisers = useSelector(state => state.lead.advisers);
    const saveLead = useSelector(state => state.lead.saveLead);
    const phases = useSelector(state => state.lead.leadPhases);

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
            conversationid:  0,
            columnid: match.params.columnid,
            column_uuid: match.params.columnuuid,
            index: 0,
            phone: '',
            email: '',
            operation: "INSERT",
            userid: 0,
            phase: '',
        }
    });

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('expected_revenue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('date_deadline', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('tags', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('phone', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('email', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('personcommunicationchannel', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('userid', { validate: (value) => ((value && value > 0) ? true : t(langKeys.field_required) + "") });
        register('phase', { validate: (value) => ((value && value.length) || t(langKeys.field_required) + "") });
    }, [register, t]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        const body = insLead2(data, data.operation);
        dispatch(saveLeadBody(body));
    }, e => console.log(e));

    useEffect(() => {
        if (edit === true) {
            const leadId = match.params.id;
            dispatch(getLead(getOneLeadSel(leadId)));
        }

        dispatch(getAdvisers(adviserSel()));
        dispatch(getLeadPhases(getValuesFromDomain("ESTADOSOPORTUNIDAD")));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetSaveLead());
            dispatch(resetGetPersonListPaginated());
            dispatch(resetGetLeadPhases());
        };
    }, [edit, match.params.id, dispatch]);

    useEffect(() => {
        if (!edit) return;
        if (lead.loading) return;
        if (lead.error) {
            dispatch(showSnackbar({
                success: false,
                message: lead.message || "Error",
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
            })
        }
    }, [lead, edit, dispatch]);

    useEffect(() => {
        if (advisers.loading) return;
        if (advisers.error) {
            dispatch(showSnackbar({
                success: false,
                message: advisers.message || "Error",
                show: true,
            }));
        }
    }, [advisers, dispatch]);

    useEffect(() => {
        if (saveLead.loading) return;
        if (saveLead.error) {
            dispatch(showSnackbar({
                success: false,
                message: saveLead.message || "Error",
                show: true,
            }));
        } else if (saveLead.success) {
            dispatch(showSnackbar({
                success: true,
                message: "Se guardo la oportunidad con éxito",
                show: true,
            }));
            if (!edit) history.push(paths.CRM);
        }
    }, [saveLead, edit, history, dispatch]);

    if (edit === true && lead.loading && advisers.loading) {
        return <Loading />;
    } else if (edit === true && (lead.error)) {
        console.log('error')
        return <div>ERROR</div>;
    }
    console.log('getValue', getValues('userid'))
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
                    <TitleDetail title={edit ? getValues('description') : t(langKeys.newLead)} />
                    <div style={{ flexGrow: 1 }} />
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => history.push(paths.CRM)}
                    >
                        <Trans i18nKey={langKeys.back} />
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        <Trans i18nKey={langKeys.save} />
                    </Button>
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
                                // valueDefault={values?.description || ""}
                                error={errors?.description?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.email)}
                                className={classes.field}
                                onChange={(value) => setValue('email', value)}
                                valueDefault={getValues('email')}
                                error={errors?.email?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.expected_revenue)}
                                className={classes.field}
                                type="number"
                                onChange={(value) => setValue('expected_revenue', value)}
                                valueDefault={getValues('expected_revenue')}
                                error={errors?.expected_revenue?.message}
                            />
                            <FieldMultiSelectFreeSolo
                                label={t(langKeys.tags)}
                                className={classes.field}
                                valueDefault={getValues('tags')}
                                onChange={(value) => { setValue('tags', value.map((o: any) => o.title || o).join() ) }}
                                error={errors?.tags?.message}
                                loading={false}
                                data={tagsOptions.concat(getValues('tags').split(',').filter((i:any) => (tagsOptions.findIndex(x => x.title === i)) < 0).map((title:any) => ({title})))}
                                optionDesc="title"
                                optionValue="title"
                            />
                            { (!!getValues('userid') || !edit) && 
                                <FieldSelect
                                    label={t(langKeys.advisor)}
                                    className={classes.field}
                                    // valueDefault={(!advisers.loading && !lead.loading) ? getValues('userid') : ''}
                                    valueDefault={getValues('userid')}
                                    loading={advisers.loading}
                                    data={advisers.data}
                                    optionDesc="firstname"
                                    optionValue="userid"
                                    onChange={(value) => setValue('userid', value ? value.userid : '')}
                                    error={errors?.userid?.message}
                                />
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            {edit ? 
                                (<FieldView
                                    label="Customer"
                                    className={classes.field}
                                    value={lead.value?.displayname}
                                />) : 
                                (<div style={{ display: 'flex', flexDirection: 'column'  }} className={classes.field} >
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <FieldView
                                                label="Customer"
                                                value={values?.displayname}
                                            />
                                        </div>
                                        <IconButton color="primary" onClick={() => setOpenPersonmodal(true)} size="small">
                                            <Add style={{ height: 22, width: 22 }} />
                                        </IconButton>
                                    </div>
                                    <div style={{ flexGrow: 1, marginTop: (errors?.personcommunicationchannel?.message) ? '29px' : '3px' }} />
                                    <div style={{ borderBottom: `solid ${(errors?.personcommunicationchannel?.message) ? '2px rgba(250,0,0,1)' : '1px rgba(0,0,0,0.42)'} `, marginBottom:'4px'}}></div>
                                    <div style={{ display: (errors?.personcommunicationchannel?.message) ? 'inherit' : 'none', color:'red', fontSize: '0.75rem' }}>{errors?.personcommunicationchannel?.message}</div>
                                </div>)
                            }
                            <FieldEdit
                                label={t(langKeys.phone)}
                                className={classes.field}
                                onChange={(value) => setValue('phone', value)}
                                valueDefault={getValues('phone')}
                                error={errors?.phone?.message}
                            />
                            <FieldEdit
                                label={t(langKeys.endDate)}
                                className={classes.field}
                                type="date"
                                onChange={(value) => setValue('date_deadline', value)}
                                valueDefault={getValues('date_deadline')?.substring(0,10)}
                                error={errors?.date_deadline?.message}
                            />
                            <div className={classes.field}>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                    Priority
                                </Box>
                                <Rating
                                    name="simple-controlled"
                                    max={3}
                                    defaultValue={lead.value?.priority === 'LOW' ? 1 : lead.value?.priority === 'MEDIUM' ? 2 : lead.value?.priority === 'HIGH' ? 3 : 1}
                                    onChange={(event, newValue) => {
                                        const priority =  (newValue) ? urgencyLevels[newValue] : 'LOW';
                                        setValue('priority', priority)
                                    }}
                                />
                            </div>
                            <FieldSelect
                                uset
                                label="State"
                                className={classes.field}
                                data={phases.data}
                                prefixTranslation="type_phaselead_"
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                loading={phases.loading}
                                valueDefault={getValues('phase')}
                                onChange={(v: IDomain) => setValue('phase', v?.domainvalue || "")}
                                error={errors?.phase?.message}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
            {/* </Grid> */}
            <div style={{ height: '1em' }} />
            {edit && (
            <>
                <AppBar position="static" elevation={0}>
                    <Tabs
                        value={tabIndex}
                        onChange={(_, i: string) => setTabIndes(i)}
                        className={classes.tabs}
                        TabIndicatorProps={{ style: { display: 'none' } }}
                    >
                        <Tab
                            className={clsx(classes.tab, tabIndex === "0" && classes.activetab)}
                            label={<Trans i18nKey={langKeys.logNote} count={2} />}
                            value="0"
                        />
                        <Tab
                            className={clsx(classes.tab, tabIndex === "1" && classes.activetab)}
                            label={(
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <AccessTimeIcon style={{ width: 22, height: 22 }} />
                                    <div style={{ width: 6 }}  />
                                    <Trans i18nKey={langKeys.scheduleActivity} count={2} />
                                </div>
                            )}
                            value="1"
                        />
                    </Tabs>
                </AppBar>
                {lead.value && <TabPanel value="0" index={tabIndex}><TabPanelLogNote lead={lead.value!} /></TabPanel>}
                {lead.value && <TabPanel value="1" index={tabIndex}><TabPanelScheduleActivity lead={lead.value!} /></TabPanel>}
            </>
            )}
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
        maxHeight:"80%",
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
    }, [fetchData, dispatch]);

    useEffect(() => {
        if (personList.loading) return;
        if (personList.error) {
            dispatch(showSnackbar({
                message: personList.message || "Error",
                success: false,
                show: true,
            }));
        } else {
            setPageCount(Math.ceil(personList.count / pageSize));
            settotalrow(personList.count);
        }
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
        padding: theme.spacing(1),
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

export const TabPanelLogNote: FC<{ lead: ICrmLead }> = ({ lead }) => {
    const classes = useTabPanelLogNoteStyles();
    const dispatch = useDispatch();
    const [noteDescription, setNoteDescription] = useState("");
    const [media, setMedia] = useState<File | null>(null);
    const leadNotes = useSelector(state => state.lead.leadLogNotes);
    const saveLeadNote = useSelector(state => state.lead.saveLeadNote);

    useEffect(() => {
        dispatch(getLeadLogNotes(leadLogNotesSel(lead.leadid)));
        return () => {
            dispatch(resetGetLeadLogNotes());
            dispatch(resetSaveLeadLogNote());
        };
    }, [dispatch]);

    useEffect(() => {
        if (saveLeadNote.loading) return;
        if (saveLeadNote.error) {
            dispatch(showSnackbar({
                message: saveLeadNote.message || "Error",
                success: false,
                show: true,
            }));
        } else if (saveLeadNote.success) {
            dispatch(showSnackbar({
                message: "Se registró la nota",
                success: true,
                show: true,
            }));
            dispatch(getLeadLogNotes(leadLogNotesSel(lead.leadid)));
            setNoteDescription("");
        }
    }, [saveLeadNote]);

    const handleSubmit = useCallback(() => {
        handleCleanMediaInput();
        const body = leadLogNotesIns({
            leadid: lead.leadid,
            leadnotesid: 0,
            description: noteDescription,
            type: "NINGUNO",
            status: "ACTIVO",
            media,
            username: null,
            operation: "INSERT",
        });
        dispatch(saveLeadLogNote(body));
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

    if (leadNotes.loading) {
        return <Loading />;
    }

    return (
        <div className={clsx(classes.root, classes.column)}>
            <div className={clsx(classes.paper, classes.column)}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.column}>
                        <TextField
                            placeholder="Log an internal note"
                            minRows={4}
                            fullWidth
                            value={noteDescription}
                            onChange={e => setNoteDescription(e.target.value)}
                            disabled={saveLeadNote.loading}
                        />
                        <div style={{ height: '0.7em' }} />
                        {media && <FilePreview src={media} onClose={handleCleanMediaInput} />}
                        {media && <div style={{ height: '0.5em' }} />}
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
                                    <IconButton color="primary" onClick={onClick}>
                                        <Mood />
                                    </IconButton>
                                )}
                            />
                            <div style={{ width: '0.5em' }} />
                            <IconButton onClick={handleInputMedia} color="primary" disabled={media !== null}>
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
                        disabled={saveLeadNote.loading || (noteDescription.length === 0 && media === null)}
                    >
                        Log
                    </Button>
                </div>
            </div>
            <div style={{ height: '2.3em' }} />
            {leadNotes.data.map((note, index) => (
                <div key={`lead_note_${index}`}>
                    <div className={classes.paper}>
                        <div className={classes.row}>
                            <Avatar className={classes.avatar} />
                            <div style={{ width: '1em' }} />
                            <div className={classes.logTextContainer}>
                                <div className={clsx(classes.row, classes.centerRow)}>
                                    <span className={classes.logOwnerName}>{note.createby}</span>
                                    <div style={{ width: '1em' }} />
                                    <span className={classes.logDate}>{note.createdate}</span>
                                </div>
                                <div style={{ height: 4 }} />
                                <span>{note.description}</span>
                                {note.media && <div style={{ height: 4 }} />}
                                {note.media && <FilePreview src={note.media} />}
                            </div>
                        </div>
                    </div>
                    {index !== leadNotes.data.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
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

export const TabPanelScheduleActivity: FC<{ lead: ICrmLead }> = ({ lead }) => {
    const classes = useTabPanelScheduleActivityStyles();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState<{ value: boolean, payload: IcrmLeadActivity | null }>({ value: false, payload: null });
    const leadActivities = useSelector(state => state.lead.leadActivities);
    const saveActivity = useSelector(state => state.lead.saveLeadActivity);

    useEffect(() => {
        dispatch(getLeadActivities(leadActivitySel(lead.leadid)));
        return () => {
            dispatch(resetGetLeadActivities());
        };
    }, [dispatch]);

    if (leadActivities.loading) {
        return <Loading />;
    }

    return (
        <div className={clsx(classes.root, classes.column)}>
            <div className={classes.header}>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={saveActivity.loading}
                    onClick={() => setOpenModal({ value: true, payload: null })}
                >
                    Nueva actividad
                </Button>   
            </div>
            <div style={{ height: '1.34em' }} />
            {leadActivities.data.map((activity, index) => (
                <div key={`lead_activity${index}`}>
                    <div className={classes.paper}>
                        <div className={classes.row}>
                            <Avatar className={classes.avatar} />
                            <div style={{ width: '1em' }} />
                            <div className={classes.column}>
                                <div className={clsx(classes.row, classes.centerRow)}>
                                    <span className={classes.activityDate}>{`Due in ${activity.duedate}`}</span>
                                    <div style={{ width: '1em' }} />
                                    <span className={classes.activityName}>{`"${activity.description}"`}</span>
                                    <div style={{ width: '1em' }} />
                                    <span className={classes.activityFor}>{`for ${activity.assignto}`}</span>
                                    <div style={{ width: '0.5em' }} />
                                    <Info style={{ height: 18, width: 18, fill: 'grey' }} />
                                </div>
                                <div style={{ height: 4 }} />
                                <div className={clsx(classes.row, classes.unselect)}>
                                    <div style={{ width: '1em' }} />
                                    {activity.status !== "ELIMINADO" && (
                                        <div
                                            className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                            onClick={() => {
                                                const body = leadActivityIns({
                                                    ...activity,
                                                    username: null,
                                                    status: "REALIZADO",
                                                    operation: "UPDATE",
                                                });
                                                dispatch(saveLeadActivity(body));
                                            }}
                                            style={{ marginRight: '1em' }}
                                        >
                                            <Done style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                            <span>Mark Done</span>
                                        </div>
                                    )}
                                    <div
                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                        onClick={() => setOpenModal({ value: true, payload: activity })}
                                        style={{ marginRight: '1em' }}
                                    >
                                        <Create style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                        <span>Edit</span>
                                    </div>
                                    {activity.status !== "ELIMINADO" && <div
                                        className={clsx(classes.activityFor, classes.row, classes.centerRow, classes.hoverCursor)}
                                        onClick={() => {
                                            const body = leadActivityIns({
                                                ...activity,
                                                username: null,
                                                status: "ELIMINADO",
                                                operation: "UPDATE",
                                            });
                                            dispatch(saveLeadActivity(body));
                                        }}
                                    >
                                        <Clear style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                        <span>Cancel</span>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    {index !== leadActivities.data.length - 1 && <div style={{ backgroundColor: 'grey', height: 1 }} />}
                </div>
            ))}
            <SaveActivityModal
                onClose={() => setOpenModal({ value: false, payload: null })}
                open={openModal.value}
                activity={openModal.payload}
                leadid={lead.leadid}
            />
        </div>
    );
}

interface SaveActivityModalProps {
    open: boolean;
    activity: IcrmLeadActivity | null;
    leadid: number;
    onClose: () => void;
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

const SaveActivityModal: FC<SaveActivityModalProps> = ({ open, onClose, activity, leadid }) => {
    console.log('SaveActivityModal', activity);
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
            dispatch(resetSaveLeadActivity());
        };
    }, [dispatch]);

    useEffect(() => {
        if (saveActivity.loading) return;
        if (saveActivity.error) {
            dispatch(showSnackbar({
                message: saveActivity.message || "Error",
                success: false,
                show: true,
            }));
        } else if (saveActivity.success) {
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
    }, [saveActivity, leadid, dispatch]);

    const { getValues, setValue, formState: { errors }, reset, handleSubmit, register } = useForm<ICrmLeadActivitySave>({
        defaultValues: {
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            type: activity?.type || "",
            status: activity?.status || "ACTIVO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
        },
    });

    useEffect(() => {
        const mandatoryStrField = (value: string) => {
            return value.length === 0 ? t(langKeys.field_required) : undefined;
        }

        register('description', { validate: mandatoryStrField });
        register('duedate', { validate: mandatoryStrField });
        register('assignto', { validate: mandatoryStrField });
        register('type', { validate: mandatoryStrField });
    }, [register, t]);

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
        });
    }, [reset]);

    useEffect(() => {
        reset({
            leadid: leadid,
            leadactivityid: activity?.leadactivityid || 0,
            description: activity?.description || "",
            duedate: activity?.duedate || "",
            assignto: activity?.assignto || "",
            type: activity?.type || "",
            status: activity?.status || "ACTIVO",
            username: null,
            operation: activity ? "UPDATE" : "INSERT",
        });
    }, [activity, reset]);

    const handleSave = useCallback((values: ICrmLeadActivitySave, status: "PROGRAMADO" | "REALIZADO" | "DESCARTADO") => {
        handleSubmit(() => {
            const body = leadActivityIns({
                ...values,
                status,
            });
            dispatch(saveLeadActivity(body));
        })();
    }, [handleSubmit, dispatch]);

    console.log("EER", getValues());
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={modalClasses.root}>
                <TitleDetail title="Schedule activity" />
                <div style={{ height: '1em' }} />
                <Grid container direction="row">
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <Grid container direction="column">
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldSelect
                                    uset
                                    label="Activity type"
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
                                    label="Summary"
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
                                    label="Due date"
                                    className={classes.field}
                                    type="date"
                                    valueDefault={getValues('duedate')?.substring(0, 10)}
                                    onChange={(value) => setValue('duedate', value)}
                                    error={errors?.duedate?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FieldSelect
                                    label="Assigned to"
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
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave(getValues(), "PROGRAMADO");
                        }}
                    >
                        Schedule
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        onClick={() => {
                            mustCloseOnSubmit.current = true;
                            handleSave(getValues(), "REALIZADO");
                        }}
                    >
                        Mark as Done
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        onClick={() => {
                            mustCloseOnSubmit.current = false;
                            handleSave(getValues(), "REALIZADO");
                        }}
                    >
                        {'Done & Schedule next'}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.footerBtn}
                        onClick={() => {
                            onClose();
                            resetValues();
                        }}
                    >
                        Discard
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
        alignItems: 'center',
        width: 'fit-content',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
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
                <span style={{ fontWeight: 'bold' }}>{getFileName()}</span>
                <span>{getFileExt()}</span>
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
                    <a href={src as string} target="_blank" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}