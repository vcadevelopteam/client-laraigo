import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, makeStyles, Breadcrumbs, Grid, Button, CircularProgress, Box, TextField, Modal, Typography, IconButton, Checkbox, Chip } from '@material-ui/core';
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
import { Add } from '@material-ui/icons';
import { getPersonListPaginated, resetGetPersonListPaginated } from 'store/person/actions';

const tagsOptions = [
    { title: "Information"},
    { title: "Design"},
    { title: "Product"},
    // crear mas
];

  
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
}));

export const LeadForm: FC<{ edit?: boolean }> = ({ edit = false }) => {
    const classes = useLeadFormStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch<{ id: string, columnid: string, columnuuid: string }>();
    const [values, setValues] = useState<ICrmLead>({
            column_uuid: match.params.columnuuid,
            columnid: Number(match.params.columnid) } as ICrmLead
    );
    const [openPersonModal, setOpenPersonmodal] = useState(false);
    const lead = useSelector(state => state.lead.lead);
    const advisers = useSelector(state => state.lead.advisers);
    const saveLead = useSelector(state => state.lead.saveLead);
    
    const datePickerFormat = (value: string): string => {
        // "2017-05-24T10:30"
        if (!value) return "";
        const [date, time] = value.split(" ");
        const [hours, minutes] = time.split(":");
        return `${date}T${hours}:${minutes}`;
    }

    const validateForm = useCallback((values: ICrmLead, cb: (values: ICrmLead) => void) => {
        if (
            !values.personcommunicationchannel || values.personcommunicationchannel.length === 0 ||
            !values.expected_revenue || values.expected_revenue.length === 0 ||
            // !values.tags || values.tags.length === 0 ||
            !values.userid || values.userid === 0 ||
            !values.description || values.description.length === 0 ||
            !values.date_deadline || values.date_deadline.length === 0 ||
            !values.priority || values.priority.length === 0
        ) {
            dispatch(showSnackbar({
                success: false,
                message: t(langKeys.formMandatoryFields),
                show: true,
            }));
            return;
        }
        cb(values);
    }, [t, dispatch]);

    const handleSubmit = useCallback(() => {
        // validate edit
        const params = edit ?
            { ...lead.value, ...values } :
            { ...values, id: 0, status: "ACTIVO", type: "NINGUNO", conversationid: 0, username: null, index: 0, leadid: 0 };

        validateForm(params, (values) => {
            const body = insLead2(params, edit ? "UPDATE" : "INSERT");
            console.log(body);
            dispatch(saveLeadBody(body));
        });
    }, [lead, values, dispatch]);

    const onTagsChange = (event: any, tags: string[]) => {
        console.log(tags);
        setValues(prev => ({ ...prev, tags: tags.join(',') }));
    };

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
            console.log("getOneLeadSel", lead.value);
            setValues(lead.value!);
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

    if (edit === true && lead.loading) {
        return <CircularProgress />;
    } else if (edit === true && (lead.error || !lead.value)) {
        return <div>ERROR</div>;
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={classes.root}>
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
                <TitleDetail title={edit ? (values?.description || '-') : t(langKeys.newLead)} />
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
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={handleSubmit}
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
                            valueDefault={values?.description || ""}
                            onChange={v => setValues(prev => ({ ...prev, description: v }))}
                        />
                        <FieldEdit
                            label={t(langKeys.email)}
                            className={classes.field}
                            valueDefault={values?.email || ""}
                            onChange={v => setValues(prev => ({ ...prev, email: v }))}
                        />
                        <FieldEdit
                            label={t(langKeys.expectedRevenue)}
                            className={classes.field}
                            type="number"
                            valueDefault={lead.value?.expected_revenue || ""}
                            onChange={v => setValues(prev => ({ ...prev, expected_revenue: v }))}
                        />
                        <FieldMultiSelectFreeSolo
                            label={'Tags'}
                            valueDefault={lead.value?.tags || ""}
                            className={classes.field}
                            onChange={(value) => { setValues((p) => ({ ...p, tags: value.map((o: any) => o.title || o).join() })) }}
                            data={tagsOptions}  
                            optionDesc="title"
                            optionValue="title"
                        />
                        <FieldSelect
                            label={t(langKeys.advisor)}
                            className={classes.field}
                            valueDefault={lead.value?.userid}
                            data={advisers.data}
                            optionDesc="firstname"
                            optionValue="userid"
                            onChange={v => setValues(prev => ({ ...prev, userid: v.userid }))}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        {edit ? 
                            (<FieldView
                                label={t(langKeys.person)}
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
                                <div style={{ flexGrow: 1 }} />
                                <div style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.42)' }} />
                            </div>)
                        }
                        <FieldEdit
                            label={t(langKeys.person)}
                            className={classes.field}
                            valueDefault={values?.phone || ""}
                            onChange={v => setValues(prev => ({ ...prev, phone: v }))}
                        />
                        <div className={classes.field}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.expectedClosing)}
                            </Box>
                            <KeyboardDateTimePicker
                                disableToolbar
                                variant="inline"
                                format="yyyy-MM-dd HH:mm:ss"
                                id="date-picker-inline"
                                value={values?.date_deadline || "" /*new Date('2014-08-18T21:11:54')*/}
                                onChange={(_, v) => setValues(prev => ({ ...prev, date_deadline: v || "" }))}
                                fullWidth
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </div>
                        <div className={classes.field}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                {t(langKeys.priority)}
                            </Box>
                            <Rating
                                name="simple-controlled"
                                defaultValue={lead.value?.priority === 'LOW' ? 1 : lead.value?.priority === 'MEDIUM' ? 2 : lead.value?.priority === 'HIGH' ? 3 : 1}
                                max={3}
                                onChange={(event, newValue) => {
                                    const priority = newValue === 1 ? 'LOW' : newValue === 2 ? 'MEDIUM' : newValue === 3 ? 'HIGH' : undefined;
                                    setValues(prev => ({ ...prev, priority }));
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        <SelectPersonModal
            open={openPersonModal}
            onClose={() => setOpenPersonmodal(false)}
            onClick={(v) => setValues(prev => ({
                ...prev,
                personcommunicationchannel: v.personcommunicationchannel,
                displayname: v.displayname,
                email: v.email as string,
                phone: v.phone as string,
            }))}
        />
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
