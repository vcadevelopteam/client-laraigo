import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, Typography, IconButton, Checkbox, Chip, AppBar, Tabs, Tab, Avatar, Divider } from '@material-ui/core';
import { FieldEdit, FieldMultiSelect, FieldMultiSelectFreeSolo, FieldSelect, FieldView, Title, TitleDetail } from 'components';
import { langKeys } from 'lang/keys';
import paths from 'common/constants/paths';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router';
import { insLead2, getOneLeadSel, getPaginatedPerson, adviserSel, paginatedPersonWithoutDateSel, getPaginatedPerson as getPersonListPaginated1 } from 'common/helpers';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { getAdvisers, getLead, resetGetLead, resetSaveLead, saveLead as saveLeadBody } from 'store/lead/actions';
import { ICrmLead, ICRmSaveLead, IFetchData, IPerson } from '@types';
import { showSnackbar } from 'store/popus/actions';
import { Autocomplete, Rating } from '@material-ui/lab';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import TableZyx from 'components/fields/table-paginated';
import { Add, Clear, Create, Done, Info } from '@material-ui/icons';
import { getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';
import clsx from 'clsx';
import { AccessTime as AccessTimeIcon } from '@material-ui/icons';
import { useForm } from 'react-hook-form';

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

     const { control, register, handleSubmit, setValue, getValues, formState: { errors }, reset, trigger } = useForm<any>({
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
            userid: 0
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
    }, [edit, register]);

    const onSubmit = handleSubmit((data) => {
        // dispatch(saveLeadBody(data));
        const body = insLead2(data, data.operation);
        dispatch(saveLeadBody(body));
    });

    // const onTagsChange = (event: any, tags: string[]) => {
    //     console.log(tags);
    //     setValues(prev => ({ ...prev, tags: tags.join(',') }));
    // };

    useEffect(() => {
        if (edit === true) {
            const leadId = match.params.id;
            dispatch(getLead(getOneLeadSel(leadId)));
        }

        dispatch(getAdvisers(adviserSel()));

        return () => {
            dispatch(resetGetLead());
            dispatch(resetSaveLead());
            dispatch(resetGetPersonListPaginated());
        };
    }, [dispatch]);

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
            })
            // dispatch(getAdvisers(adviserSel()));
        }
    }, [lead, dispatch]);

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
    }, [saveLead]);

    if (edit === true && lead.loading && advisers.loading) {
        return <CircularProgress />;
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
                    <TitleDetail title={edit ? t(langKeys.leadDetail) : t(langKeys.newLead)} />
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
                                data={tagsOptions}
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
                            <div className={classes.field}>
                                <FieldEdit
                                    label={t(langKeys.endDate)}
                                    className={classes.field}
                                    type={'date'}
                                    onChange={(value) => setValue('date_deadline', value)}
                                    valueDefault={getValues('date_deadline')?.substring(0,10)}
                                    error={errors?.date_deadline?.message}
                                />
                            </div>
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
                <TabPanel value="0" index={tabIndex}><TabPanelLogNote /></TabPanel>
                <TabPanel value="1" index={tabIndex}><TabPanelScheduleActivity /></TabPanel>
            </>
            )}
            <SelectPersonModal
                open={openPersonModal}
                onClose={() => setOpenPersonmodal(false)}
                onClick={(value) => {
                    setValue('personcommunicationchannel', value.personcommunicationchannel)
                    setValue('email', value.email)
                    setValue('phone', value.phone)
                    setValues(prev => ({ ...prev, displayname: value.displayname }))
                }}
            />
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default LeadForm;

interface SelectPersonModal {
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

const SelectPersonModal: FC<SelectPersonModal> = ({ open, onClose, onClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useSelectPersonModalStyles();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [totalrow, settotalrow] = useState(0);
    const [pageSize, setPageSize] = useState(10);
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
        []
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
    }, []);

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

export const TabPanelLogNote: FC = () => {
    const classes = useTabPanelLogNoteStyles();

    return (
        <div className={clsx(classes.root, classes.column)}>
            <div className={clsx(classes.paper, classes.column)}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <TextField
                        placeholder="Log an internal note"
                        minRows={4}
                        fullWidth
                    />
                </div>
                <div style={{ height: 12 }} />
                <div>
                    <Button variant="contained" color="primary">
                        Log
                    </Button>
                </div>
            </div>
            <div style={{ height: '2.3em' }} />
            <div className={classes.paper}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.logTextContainer}>
                        <div className={clsx(classes.row, classes.centerRow)}>
                            <span className={classes.logOwnerName}>Mitchell Admin</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.logDate}>now</span>
                        </div>
                        <div style={{ height: 4 }} />
                        <span>Log de prueba</span>
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: 'grey', height: 1 }} />
            <div className={classes.paper}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.logTextContainer}>
                        <div className={clsx(classes.row, classes.centerRow)}>
                            <span className={classes.logOwnerName}>Mitchell Admin</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.logDate}>now</span>
                        </div>
                        <div style={{ height: 4 }} />
                        <span>Log de prueba</span>
                    </div>
                </div>
            </div>
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
}));

export const TabPanelScheduleActivity: FC = () => {
    const classes = useTabPanelScheduleActivityStyles();

    return (
        <div className={clsx(classes.root, classes.column)}>
            <div className={classes.paper}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.column}>
                        <div className={clsx(classes.row, classes.centerRow)}>
                            <span className={classes.activityDate}>Due in 2 days</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.activityName}>"call para seguimiento"</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.activityFor}>for Mitchell Admin</span>
                            <div style={{ width: '0.5em' }} />
                            <Info style={{ height: 18, width: 18, fill: 'grey' }} />
                        </div>
                        <div style={{ height: 4 }} />
                        <div className={classes.row}>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Done style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Mark Done</span>
                            </div>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Create style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Edit</span>
                            </div>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Clear style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Cancel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: 'grey', height: 1 }} />
            <div className={classes.paper}>
                <div className={classes.row}>
                    <Avatar className={classes.avatar} />
                    <div style={{ width: '1em' }} />
                    <div className={classes.column}>
                        <div className={clsx(classes.row, classes.centerRow)}>
                            <span className={classes.activityDate}>Due in 2 days</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.activityName}>"call para seguimiento"</span>
                            <div style={{ width: '1em' }} />
                            <span className={classes.activityFor}>for Mitchell Admin</span>
                            <div style={{ width: '0.5em' }} />
                            <Info style={{ height: 18, width: 18, fill: 'grey' }} />
                        </div>
                        <div style={{ height: 4 }} />
                        <div className={classes.row}>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Done style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Mark Done</span>
                            </div>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Create style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Edit</span>
                            </div>
                            <div style={{ width: '1em' }} />
                            <div className={clsx(classes.activityFor, classes.row, classes.centerRow)}>
                                <Clear style={{ height: 18, width: 18, fill: 'grey', marginRight: 4 }} />
                                <span>Cancel</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
