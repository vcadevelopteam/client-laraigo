/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DateRangePicker, FieldSelect, ListPaginated, TemplateIcons, Title } from 'components';
import { getChannelListByPersonBody, getTicketListByPersonBody, getPaginatedPerson, getOpportunitiesByPersonBody, editPersonBody, getReferrerByPersonBody, insPersonUpdateLocked, getPersonExport, exportExcel, templateMaker, uploadExcel, insPersonBody, insPersonCommunicationChannel } from 'common/helpers';
import { Dictionary, IDomain, IObjectState, IPerson, IPersonChannel, IPersonCommunicationChannel, IPersonConversation, IPersonDomains, IPersonImport, IPersonLead, IPersonReferrer } from "@types";
import { Avatar, Box, Divider, Grid, ListItem, Button, makeStyles, AppBar, Tabs, Tab, Collapse, IconButton, BoxProps, Breadcrumbs, Link, CircularProgress, TextField, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import { BuildingIcon, DocNumberIcon, DocTypeIcon, DownloadIcon, CalendarIcon, EMailInboxIcon, GenderIcon, PhoneIcon, PinLocationIcon, PortfolioIcon, TelephoneIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Range } from 'react-date-range';
import { Skeleton } from '@material-ui/lab';
import { useHistory, useLocation } from 'react-router';
import paths from 'common/constants/paths';
import { ArrowDropDown, Add as AddIcon } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BackupIcon from '@material-ui/icons/Backup';
import { getChannelListByPerson, getPersonListPaginated, resetGetPersonListPaginated, resetGetChannelListByPerson, getTicketListByPerson, resetGetTicketListByPerson, getLeadsByPerson, resetGetLeadsByPerson, getDomainsByTypename, resetGetDomainsByTypename, resetEditPerson, editPerson, getReferrerListByPerson, resetGetReferrerListByPerson } from 'store/person/actions';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useForm, UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { execute, exportData } from 'store/main/actions';

interface PersonItemProps {
    person: IPerson;
}

interface SelectFieldProps {
    defaultValue?: string;
    onChange: (value: string, desc: string) => void;
    data: IDomain[];
    loading: boolean;
}

const DomainSelectField: FC<SelectFieldProps> = ({ defaultValue, onChange, data, loading }) => {
    return (
        <TextField
            select
            defaultValue={defaultValue}
            fullWidth
            variant="standard"
            disabled={loading}
        >
            {data.map((option) => (
                <MenuItem
                    key={option.domainid}
                    value={option.domainvalue}
                    onClick={() => onChange(option.domainvalue, option.domaindesc)}
                >
                    {option.domaindesc}
                </MenuItem>
            ))}
        </TextField>
    );
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        // maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    personList: {
        display: 'flex',
        paddingLeft: theme.spacing(0),
        paddingRight: theme.spacing(0),
        paddingBottom: theme.spacing(1),
    },
    personItemRoot: {
        padding: theme.spacing(2.5),
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    itemRow: {
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1,
        alignItems: 'center',
    },
    gridRow: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: '100%',
    },
    itemColumn: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        alignSelf: 'flex-start',
    },
    itemTop: {
        justifyContent: 'space-between',
        minWidth: 480,
        flexWrap: 'wrap',
    },
    spacing: {
        padding: theme.spacing(1),
    },
    label: {
        overflowWrap: 'anywhere',
        fontWeight: 400,
        fontSize: 12,
        color: '#B6B4BA',
    },
    value: {
        fontSize: 14,
        fontWeight: 400,
        color: '#2E2C34',
    },
    propIcon: {
        stroke: '#8F92A1',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        minWidth: 56,
        minHeight: 26,
        maxHeight: 26,
        maxWidth: 56,
        padding: 0,
        backgroundColor: '#55BD84',
        float: 'right',
    },
}));

const usePhotoClasses = makeStyles(theme => ({
    accountPhoto: {
        height: 40,
        width: 40,
    },
}));

interface PhotoProps {
    src?: string;
    radius?: number;
}

const Photo: FC<PhotoProps> = ({ src, radius }) => {
    const classes = usePhotoClasses();
    const width = radius && radius * 2;
    const height = radius && radius * 2;

    if (!src || src === "") {
        return <AccountCircle className={classes.accountPhoto} style={{ width, height }} />;
    }
    return <Avatar alt={src} src={src} className={classes.accountPhoto} style={{ width, height }} />;
}

const PersonItem: FC<PersonItemProps> = ({ person }) => {
    const classes = useStyles();
    const history = useHistory();

    const goToPersonDetail = () => {
        history.push({
            pathname: paths.PERSON_DETAIL.resolve(person.personid),
            state: person,
        });
    }

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TemplateIcons
                        editFunction={goToPersonDetail}
                    />
                    <div style={{ width: 8 }} />
                    <div style={{ flexGrow: 1, marginLeft: 8 }}>
                        <Grid container direction="column">
                            <Grid container direction="row" spacing={1}>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="row" className={classes.gridRow}>
                                        <Photo src={person.imageurldef} />
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={clsx(classes.label, classes.value)}>{person.name}</label>
                                            <label className={classes.label}>{`ID# ${person.personid}`}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item sm={2} xl={2} xs={2} md={2} lg={2}>
                                    <Grid container direction="row" className={classes.gridRow}>
                                        <div className={classes.propIcon}><EMailInboxIcon /></div>
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={classes.label}>
                                                <Trans i18nKey={langKeys.email} />
                                            </label>
                                            <div style={{ height: 4 }} />
                                            <label className={clsx(classes.label, classes.value)}>{person.email || "-"}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item sm={2} xl={2} xs={2} md={2} lg={2}>
                                    <Grid container direction="row" className={classes.gridRow}>
                                        <div className={classes.propIcon}><PhoneIcon /></div>
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={classes.label}>
                                                <Trans i18nKey={langKeys.phone} />
                                            </label>
                                            <div style={{ height: 4 }} />
                                            <label className={clsx(classes.label, classes.value)}>{person.phone || "-"}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item sm={2} xl={2} xs={2} md={2} lg={2}>
                                    <Grid container direction="row" className={classes.gridRow}>
                                        <div className={classes.propIcon}><PortfolioIcon /></div>
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={classes.label}>
                                                <Trans i18nKey={langKeys.department} />
                                            </label>
                                            <div style={{ height: 4 }} />
                                            <label className={clsx(classes.label, classes.value)}>{person.region || '-'}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="row" className={classes.gridRow}>
                                        <div className={classes.propIcon}><PinLocationIcon /></div>
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={classes.label}>
                                                <Trans i18nKey={langKeys.address} />
                                            </label>
                                            <div style={{ height: 4 }} />
                                            <label className={clsx(classes.label, classes.value)}>{person.address || '-'}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider style={{ margin: '10px 0' }} />
                            <Grid container direction="row" spacing={1}>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="column">
                                        <label><Trans i18nKey={langKeys.firstConnection} />:</label>
                                        <div style={{ height: 4 }} />
                                        <label>{person.firstcontact ? new Date(person.firstcontact).toLocaleString() : "-"}</label>
                                    </Grid>
                                </Grid>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="column">
                                        <label><Trans i18nKey={langKeys.lastConnection} />:</label>
                                        <div style={{ height: 4 }} />
                                        <label>{person.lastcontact ? new Date(person.lastcontact).toLocaleString() : "-"}</label>
                                    </Grid>
                                </Grid>
                                <Grid item sm={4} xl={4} xs={4} md={4} lg={4} />
                                <Grid item sm={2} xl={2} xs={2} md={2} lg={2}>
                                    <Button className={classes.btn} variant="contained" color="primary" disableElevation>
                                        <label style={{ fontSize: 10, fontWeight: 400 }}>
                                            <Trans i18nKey={langKeys.active} />
                                        </label>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Box>
        </ListItem>
    );
}

const PersonItemSkeleton: FC = () => {
    const classes = useStyles();

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
                <Grid container direction="column">
                    <Grid container direction="row" spacing={1}>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Skeleton />
                        </Grid>
                    </Grid>
                    <Divider style={{ margin: '10px 0' }} />
                    <Grid container direction="row" spacing={1}>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Skeleton />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ListItem>
    );
}

export const Person: FC = () => {
    const history = useHistory();
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 0);
    const initialDateRange: Range = { startDate, endDate, key: 'selection' };

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const [filters, setFilters] = useState<Dictionary>({});
    const personList = useSelector(state => state.person.personList);
    const domains = useSelector(state => state.person.editableDomains);

    const resExportData = useSelector(state => state.main.exportData);
    const executeResult = useSelector(state => state.main.execute);
    const [waitExport, setWaitExport] = useState(false);
    const [waitImport, setWaitImport] = useState(false);

    const columns = [
        { Header: t(langKeys.name), accessor: 'name' },
        { Header: t(langKeys.email), accessor: 'email' },
        { Header: t(langKeys.phone), accessor: 'phone' },
        { Header: t(langKeys.department), accessor: 'region' },
        { Header: t(langKeys.province), accessor: 'province' },
        { Header: t(langKeys.firstConnection), accessor: 'firstcontact' },
        { Header: t(langKeys.lastConnection), accessor: 'lastcontact' }
    ]

    useEffect(() => {
        dispatch(getDomainsByTypename());
    }, [])

    useEffect(() => {
        return () => {
            dispatch(resetGetPersonListPaginated());
        };
    }, [dispatch]);
    
    const fetchData = () => {
        dispatch(getPersonListPaginated(getPaginatedPerson({
            startdate: format(dateRange.startDate!),
            enddate: format(dateRange.endDate!),
            skip: pageSize * page,
            take: pageSize,
            sorts: {},
            filters: filters,
        })));
    }

    useEffect(() => {
        fetchData();
    }, [dispatch, pageSize, page, dateRange, filters]);

    const format = (date: Date) => date.toISOString().split('T')[0];

    const triggerExportData = () => {
        dispatch(exportData(getPersonExport(
            {
                startdate: format(dateRange.startDate!),
                enddate: format(dateRange.endDate!),
                sorts: {},
                filters: filters
            })));
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(resExportData.url, '_blank');
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

    const handleTemplate = () => {
        const data = [
            {},
            {},
            domains.value?.docTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_documenttype_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            domains.value?.personGenTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_persontype_${d.domaindesc?.toLowerCase()}`) }), {}),
            domains.value?.personTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_personlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            {},
            {},
            {},
            {},
            {},
            domains.value?.genders.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_gender_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.educationLevels.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_educationlevel_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.civilStatuses.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_civilstatus_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.occupations.reduce((a, d) => ({ ...a, [d.domainvalue]: t(`type_ocupation_${d.domainvalue?.toLowerCase()}`) }), {}),
            domains.value?.groups.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            domains.value?.channelTypes.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            {},
            {},
            {}
        ];
        const header = [
            'firstname',
            'lastname',
            'documenttype',
            'documentnumber',
            'persontype',
            'type',
            'phone',
            'alternativephone',
            'email',
            'alternativeemail',
            'birthday',
            'gender',
            'educationlevel',
            'civilstatus',
            'occupation',
            'groups',
            'channeltype',
            'personcommunicationchannel',
            'personcommunicationchannelowner',
            'displayname'
        ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    const handleUpload = async (e: any) => {
        const file = e.target?.files?.item(0);
        if (file) {
            let excel: any = await uploadExcel(file, undefined);
            let data: IPersonImport[] = excel.filter((f: IPersonImport) =>
                (f.documenttype === undefined || Object.keys(domains.value?.docTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.documenttype))
                && (f.persontype === undefined || Object.keys(domains.value?.personGenTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.persontype))
                && (f.type === undefined || Object.keys(domains.value?.personTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.type))
                && (f.gender === undefined || Object.keys(domains.value?.genders.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.gender))
                && (f.educationlevel === undefined || Object.keys(domains.value?.educationLevels.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.educationlevel))
                && (f.civilstatus === undefined || Object.keys(domains.value?.civilStatuses.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.civilstatus))
                && (f.occupation === undefined || Object.keys(domains.value?.occupations.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {})).includes('' + f.occupation))
                && (f.groups === undefined || Object.keys(domains.value?.groups.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.groups))
                && (f.channeltype === undefined || Object.keys(domains.value?.channelTypes.reduce((a: any, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {})).includes('' + f.channeltype))
            );
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                let table: Dictionary = data.reduce((a: any, d: IPersonImport) => ({
                    ...a,
                    [`${d.documenttype}_${d.documentnumber}`]: {
                        id: 0,
                        firstname: d.firstname || null,
                        lastname: d.lastname || null,
                        documenttype: d.documenttype,
                        documentnumber: d.documentnumber,
                        persontype: d.persontype || null,
                        type: d.type || '',
                        phone: d.phone || null,
                        alternativephone: d.alternativephone || null,
                        email: d.email || null,
                        alternativeemail: d.alternativeemail || null,
                        birthday: d.birthday || null,
                        gender: d.gender || null,
                        educationlevel: d.educationlevel || null,
                        civilstatus: d.civilstatus || null,
                        occupation: d.occupation || null,
                        groups: d.groups || null,
                        status: 'ACTIVO',
                        personstatus: 'ACTIVO',
                        referringpersonid: 0,
                        geographicalarea: null,
                        age: null,
                        sex: null,
                        operation: 'INSERT',
                        pcc: data
                            .filter((c: IPersonImport) => `${c.documenttype}_${c.documentnumber}` === `${d.documenttype}_${d.documentnumber}`
                                && !['', null, undefined].includes(c.channeltype)
                                && !['', null, undefined].includes(c.personcommunicationchannel)
                            )
                            .map((c: IPersonImport) => ({
                                type: c.channeltype,
                                personcommunicationchannel: c.personcommunicationchannel || null,
                                personcommunicationchannelowner: c.personcommunicationchannelowner || null,
                                displayname: c.displayname || null,
                                status: 'ACTIVO',
                                operation: 'INSERT'
                            }))
                    }
                }), {});
                Object.values(table).forEach((p: IPersonImport) => {
                    dispatch(execute({
                        header: insPersonBody({ ...p }),
                        detail: [
                            ...p.pcc.map((x: IPersonCommunicationChannel) => insPersonCommunicationChannel({ ...x })),
                        ]
                    }, true));
                });
                setWaitImport(true)
            }
        }
    }

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_edit) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport])

    return (
        <div style={{ height: '100%', width: 'inherit' }}>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <Title><Trans i18nKey={langKeys.person} count={2} /></Title>
                </Grid>
                <Grid item>
                    <Grid container direction="row-reverse" spacing={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading}
                            startIcon={<DownloadIcon />}
                            onClick={triggerExportData}
                        >
                            <Trans i18nKey={langKeys.download} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading}
                            startIcon={<AddIcon color="secondary" />}
                            onClick={() => {
                                history.push({
                                    pathname: paths.PERSON_DETAIL.resolve(0),
                                    state: {},
                                });
                            }}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            <Trans i18nKey={langKeys.register} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading}
                            startIcon={<ListAltIcon color="secondary" />}
                            onClick={handleTemplate}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            <Trans i18nKey={langKeys.template} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <input
                            name="file"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv"
                            id="laraigo-upload-csv-file"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => handleUpload(e)}
                        />
                        <label htmlFor="laraigo-upload-csv-file">
                            <Button
                                variant="contained"
                                component="span"
                                color="primary"
                                disabled={personList.loading}
                                startIcon={<BackupIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >
                                <Trans i18nKey={langKeys.import} />
                            </Button>
                        </label>
                        <div style={{ width: 9 }} />
                        <DateRangePicker
                            open={openDateRangeModal}
                            setOpen={setOpenDateRangeModal}
                            range={dateRange}
                            onSelect={(e) => {
                                setPage(0);
                                setDateRange(e);
                            }}
                        >
                            <Button
                                disabled={personList.loading}
                                style={{ border: '1px solid #bfbfc0', borderRadius: 4, color: 'rgb(143, 146, 161)' }}
                                startIcon={<CalendarIcon />}
                                onClick={() => setOpenDateRangeModal(!openDateRangeModal)}
                            >
                                {format(dateRange.startDate!) + " - " + format(dateRange.endDate!)}
                            </Button>
                        </DateRangePicker>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ height: 30 }} />
            <ListPaginated
                dateRange={dateRange}
                currentPage={page}
                columns={columns}
                data={personList.data as IPerson[]}
                onFilterChange={setFilters}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                loading={personList.loading}
                totalItems={personList.count}
                builder={(e, i) => <PersonItem person={e} key={`person_item_${i}`} />}
                skeleton={i => <PersonItemSkeleton key={`person_item_skeleton_${i}`} />}
            />
        </div>
    );
}

interface TabPanelProps {
    value: string;
    index: string;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${value}`}
            aria-labelledby={`wrapped-tab-${value}`}
            style={{ display: value === index ? 'block' : 'none', overflowY: 'auto' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

const usePropertyStyles = makeStyles(theme => ({
    propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
}));

interface PropertyProps extends Omit<BoxProps, 'title'> {
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
}

const Property: FC<PropertyProps> = ({ icon, title, subtitle, ...boxProps }) => {
    const classes = usePropertyStyles();

    return (
        <Box className={classes.propertyRoot} {...boxProps}>
            {icon && <div className={classes.leadingContainer}>{icon}</div>}
            {icon && <div style={{ width: 8, minWidth: 8 }} />}
            <div className={classes.contentContainer}>
                <label className={classes.propTitle}>{title}</label>
                <div style={{ height: 4 }} />
                <div className={classes.propSubtitle}>{subtitle || "-"}</div>
            </div>
        </Box>
    );
}

const usePersonDetailStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
        width: 'inherit',
        // overflowY: 'hidden',
    },
    rootContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        flexGrow: 1,
        overflowY: 'hidden',
    },
    tabs: {
        backgroundColor: '#EBEAED',
        color: '#989898',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 'inherit',
    },
    tab: {
        color: theme.palette.text.primary,
        backgroundColor: '#EBEAED',
        flexGrow: 1,
        maxWidth: 'unset',
    },
    activetab: {
        backgroundColor: 'white',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
    },
    profile: {
        color: theme.palette.text.primary,
        maxWidth: 343,
        width: 343,
        minWidth: 180,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
}));


export const PersonDetail: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const location = useLocation<IPerson>();
    const classes = usePersonDetailStyles();
    const [tabIndex, setTabIndex] = useState('0');
    const domains = useSelector(state => state.person.editableDomains);
    const edit = useSelector(state => state.person.editPerson);
    const executeResult = useSelector(state => state.main.execute);
    const [waitLock, setWaitLock] = useState(false);

    const user = useSelector(state => state.login.validateToken.user);
    const person = location.state as IPerson | null;

    const { setValue, getValues, trigger, register, formState: { errors } } = useForm<any>({
        defaultValues: { ...person } || {},
    });


    useEffect(() => {
        console.log(person);
        if (!person) {
            history.push(paths.PERSON);
        } else {
            if (!person.personid) {
                person.corpdesc = user?.corpdesc || '';
                person.orgdesc = user?.orgdesc || '';
                person.personid = 0;
                person.groups = '';
                person.status = 'ACTIVO';
                person.type = '';
                person.persontype = '';
                person.personstatus = '';
                person.phone = '';
                person.email = '';
                person.birthday = null;
                person.alternativephone = '';
                person.alternativeemail = '';
                person.documenttype = '';
                person.documentnumber = '';
                person.firstname = '';
                person.lastname = '';
                person.sex = '';
                person.gender = '';
                person.civilstatus = '';
                person.occupation = '';
                person.educationlevel = '';
                person.referringpersonid = 0;

                register('firstname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('lastname', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('personcommunicationchannel', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('personcommunicationchannelowner', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
                register('channeltype', { validate: (value) => (value && value.length) ? true : t(langKeys.field_required) + "" });
            }
            dispatch(getDomainsByTypename());
        }

        return () => {
            dispatch(resetGetDomainsByTypename());
            dispatch(resetEditPerson());
        };
    }, [history, person, dispatch]);

    useEffect(() => {
        if (domains.loading) return;
        if (domains.error === true) {
            dispatch(showSnackbar({
                message: domains.message!,
                show: true,
                success: false,
            }));
        }
    }, [domains, dispatch]);

    useEffect(() => {
        if (edit.loading) return;

        if (edit.error === true) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: edit.message!,
                show: true,
                success: false,
            }));
        } else if (edit.success) {
            dispatch(showBackdrop(false));
            dispatch(showSnackbar({
                message: t(langKeys.successful_edit),
                show: true,
                success: true,
            }));
            if (!person?.personid) {
                history.push(paths.PERSON);
            }
        }
    }, [edit, dispatch]);


    const handleEditPerson = async () => {
        const allOk = await trigger(); //para q valide el formulario
        if (allOk) {
            const values = getValues();
            const callback = () => {
                const payload = editPersonBody(values);
                console.log("handleEditPerson", payload);

                dispatch(editPerson(payload.parameters.personid ? payload : {
                    header: editPersonBody({ ...person, ...values }),
                    detail: [
                        insPersonCommunicationChannel({
                            personcommunicationchannel: values.personcommunicationchannel,
                            personcommunicationchannelowner: values.personcommunicationchannelowner,
                            displayname: `${values.firstname} ${values.lastname}`,
                            type: values.channeltype,
                            operation: 'INSERT',
                            status: 'ACTIVO'
                        })
                    ]
                }, !payload.parameters.personid));

                dispatch(showBackdrop(true));
            }

            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }))
        }
    }

    const handleLock = () => {
        if (person) {
            const callback = () => {
                setValue('locked', !getValues('locked'));
                trigger('locked');
                dispatch(execute(insPersonUpdateLocked({ ...person, locked: !person.locked })));
                dispatch(showBackdrop(true));
                setWaitLock(true);
            }

            dispatch(manageConfirmation({
                visible: true,
                question: getValues('locked') ? t(langKeys.confirmation_person_unlock) : t(langKeys.confirmation_person_lock),
                callback
            }))
        }
    }

    useEffect(() => {
        if (waitLock) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_transaction) }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitLock(false);
            }
        }
    }, [executeResult, waitLock]);

    if (!person) {
        return <div />;
    }

    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    underline="hover"
                    color="inherit"
                    href="/"
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(paths.PERSON);
                    }}
                >
                    <Trans i18nKey={langKeys.person} count={2} />
                </Link>
                <Link
                    underline="hover"
                    color="textPrimary"
                    href={location.pathname}
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Trans i18nKey={langKeys.personDetail} />
                </Link>
            </Breadcrumbs>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h1>{person.name}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!!person.personid &&
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={getValues('locked') ? <LockOpenIcon color="secondary" /> : <LockIcon color="secondary" />}
                            onClick={handleLock}
                        >
                            {getValues('locked') ? t(langKeys.unlock) : t(langKeys.lock)}
                        </Button>
                    }
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={(e) => {
                            e.preventDefault();
                            history.push(paths.PERSON);
                        }}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEditPerson}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        <Trans i18nKey={langKeys.save} />
                    </Button>
                </div>
            </div>
            <div style={{ height: 7 }} />
            <div className={classes.rootContent}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                    <AppBar position="static" elevation={0}>
                        <Tabs
                            value={tabIndex}
                            onChange={(_, i: string) => setTabIndex(i)}
                            className={classes.tabs}
                            TabIndicatorProps={{ style: { display: 'none' } }}
                        >
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "0" && classes.activetab)}
                                label={<div><Trans i18nKey={langKeys.generalinformation} /></div>}
                                value="0"
                            />
                            {!!person.personid && 
                                    <Tab
                                        className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)}
                                        label={<div><Trans i18nKey={langKeys.communicationchannel} /></div>}
                                        value="1"
                                    />
                            }
                            {!!person.personid && 
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.audit} />}
                                value="2"
                            />
                            }
                            {!!person.personid && 
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.conversation} count={2} />}
                                value="3"
                            />
                            }
                            {!!person.personid && 
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.opportunity} count={2} />}
                                value="4"
                            />
                            }
                            {/* <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.claim} count={2} />}
                                value="4"
                            /> */}
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}>
                        <GeneralInformationTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            domains={domains}
                            errors={errors}
                        />
                    </TabPanel>
                    <TabPanel value="1" index={tabIndex}>
                        <CommunicationChannelsTab
                            getValues={getValues}
                            setValue={setValue}
                            person={person}
                            domains={domains}
                        />
                    </TabPanel>
                    <TabPanel value="2" index={tabIndex}>
                        <AuditTab person={person} />
                    </TabPanel>
                    <TabPanel value="3" index={tabIndex}>
                        <ConversationsTab person={person} />
                    </TabPanel>
                    <TabPanel value="4" index={tabIndex}>
                        <OpportunitiesTab person={person} />
                    </TabPanel>
                    {/* <TabPanel value="4" index={tabIndex}>qqq</TabPanel> */}
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                {!!person.personid &&
                    <div className={classes.profile}>
                        <label className={classes.label}>Overview</label>
                        <div style={{ height: 16 }} />
                        <Photo src={person.imageurldef} radius={50} />
                        <h2>{person.name}</h2>
                        <Property
                            icon={<TelephoneIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.phone} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.phone)}
                                    defaultValue={person.phone}
                                    onChange={e => setValue('phone', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<EMailInboxIcon />}
                            title={<Trans i18nKey={langKeys.email} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.email)}
                                    defaultValue={person.email}
                                    onChange={e => setValue('email', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1} />
                        <Property
                            icon={<DocTypeIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.document} />}
                            subtitle={(
                                <DomainSelectField
                                    defaultValue={person.documenttype}
                                    onChange={(value) => {
                                        setValue('documenttype', value);
                                    }}
                                    loading={domains.loading}
                                    data={domains.value?.docTypes || []}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<DocNumberIcon fill="inherit" stroke="inherit" width={20} height={20} />}
                            title={<Trans i18nKey={langKeys.docNumber} />}
                            subtitle={(
                                <TextField
                                    fullWidth
                                    placeholder={t(langKeys.docNumber)}
                                    defaultValue={person.documentnumber}
                                    onChange={e => setValue('documentnumber', e.target.value)}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<GenderIcon />}
                            title={<Trans i18nKey={langKeys.gender} />}
                            subtitle={(
                                <DomainSelectField
                                    defaultValue={person.gender}
                                    onChange={(value, desc) => {
                                        setValue('gender', value);
                                        setValue('genderdesc', desc)
                                    }}
                                    loading={domains.loading}
                                    data={domains.value?.genders || []}
                                />
                            )}
                            mt={1}
                            mb={1}
                        />
                        <Property
                            icon={<BuildingIcon />}
                            title={<Trans i18nKey={langKeys.organization} />}
                            subtitle={person.orgdesc}
                            mt={1}
                            mb={1}
                        />
                    </div>
                }
            </div>
        </div>
    );
}

const useReferrerItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
}));

interface ReferrerItemProps {
    referrer: IPersonReferrer;
}

const ReferrerItem: FC<ReferrerItemProps> = ({ referrer }) => {
    const classes = useReferrerItemStyles();

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.name} />}
                        subtitle={referrer.name}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.docType} />}
                        subtitle={referrer.documenttype}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.docNumber} />}
                        subtitle={referrer.documentnumber}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

interface GeneralInformationTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: any;
    domains: IObjectState<IPersonDomains>;
    errors: any;
}

const GeneralInformationTab: FC<GeneralInformationTabProps> = ({ person, getValues, setValue, domains, errors }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const referrerList = useSelector(state => state.person.personReferrerList);

    useEffect(() => {
        if (person.referringpersonid) {
            dispatch(getReferrerListByPerson(getReferrerByPersonBody(person.referringpersonid)));
            return () => {
                dispatch(resetGetReferrerListByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.corporation} />}
                                subtitle={person.corpdesc}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.organization} />}
                                subtitle={person.orgdesc}
                                m={1}
                            />
                        </Grid>

                        <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.firstname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.firstname)}
                                        defaultValue={person.firstname}
                                        onChange={e => setValue('firstname', e.target.value)}
                                        error={errors?.firstname?.message ? true : false}
                                        helperText={errors?.firstname?.message || null}
                                    />
                                )}

                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.lastname} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.lastname)}
                                        defaultValue={person.lastname}
                                        onChange={e => setValue('lastname', e.target.value)}
                                        error={errors?.lastname?.message ? true : false}
                                        helperText={errors?.lastname?.message || null}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>

                        {!person.personid &&
                            <>
                                <Grid item sm={6} xl={6} xs={6} md={6} lg={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.personIdentifier} />}
                                        subtitle={(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.personIdentifier)}
                                                onChange={e => setValue('personcommunicationchannel', e.target.value)}
                                                error={errors?.personcommunicationchannel?.message ? true : false}
                                                helperText={errors?.personcommunicationchannel?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                                        subtitle={(
                                            <TextField
                                                fullWidth
                                                placeholder={t(langKeys.internalIdentifier)}
                                                onChange={e => setValue('personcommunicationchannelowner', e.target.value)}
                                                error={!!errors?.personcommunicationchannelowner?.message}
                                                helperText={errors?.personcommunicationchannelowner?.message || null}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Property
                                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                                        subtitle={(
                                            <FieldSelect
                                                onChange={(value) => {
                                                    setValue('channeltype', value?.domainvalue);
                                                }}
                                                loading={domains.loading}
                                                data={domains.value?.channelTypes || []}
                                                optionValue="domainvalue"
                                                optionDesc="domaindesc"
                                                error={errors?.channeltype?.message}
                                            />
                                        )}
                                        m={1}
                                    />
                                </Grid>
                            </>
                        }

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.fullname} />}
                                subtitle={person.name}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.document} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.documenttype}
                                        onChange={(value) => {
                                            setValue('documenttype', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.docTypes || []}
                                        prefixTranslation="type_documenttype_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.docNumber} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.docNumber)}
                                        defaultValue={person.documentnumber}
                                        onChange={e => setValue('documentnumber', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.personType} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.persontype}
                                        onChange={(value) => {
                                            setValue('persontype', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.personGenTypes || []}
                                        prefixTranslation="type_persontype_"
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.type} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.type}
                                        onChange={(value) => {
                                            setValue('type', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.personTypes || []}
                                        prefixTranslation="type_personlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.phone} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.phone)}
                                        defaultValue={person.phone}
                                        onChange={e => setValue('phone', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativePhone} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.alternativePhone)}
                                        defaultValue={person.alternativephone}
                                        onChange={e => setValue('alternativephone', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.email} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.email)}
                                        defaultValue={person.email}
                                        onChange={e => setValue('email', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativeEmail} />}
                                subtitle={(
                                    <TextField
                                        fullWidth
                                        placeholder={t(langKeys.alternativeEmail)}
                                        defaultValue={person.alternativeemail}
                                        onChange={e => setValue('alternativeemail', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.birthday} />}
                                subtitle={(
                                    <TextField
                                        type="date"
                                        fullWidth
                                        placeholder={t(langKeys.birthday)}
                                        defaultValue={person.birthday}
                                        onChange={e => setValue('birthday', e.target.value)}
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.gender} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.gender}
                                        onChange={(value) => {
                                            setValue('gender', value?.domainvalue);
                                            setValue('genderdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.genders || []}
                                        prefixTranslation="type_gender_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.educationLevel} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.educationlevel}
                                        onChange={(value) => {
                                            setValue('educationlevel', value?.domainvalue);
                                            setValue('educationleveldesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.educationLevels || []}
                                        prefixTranslation="type_educationlevel_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.civilStatus} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.civilstatus}
                                        onChange={(value) => {
                                            setValue('civilstatus', value?.domainvalue);
                                            setValue('civilstatusdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.civilStatuses || []}
                                        prefixTranslation="type_civilstatus_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.occupation} />}
                                subtitle={(
                                    <FieldSelect
                                        uset={true}
                                        valueDefault={person.occupation}
                                        onChange={(value) => {
                                            setValue('occupation', value?.domainvalue);
                                            setValue('occupationdesc', value?.domaindesc)
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.occupations || []}
                                        prefixTranslation="type_ocupation_"
                                        optionValue="domainvalue"
                                        optionDesc="domainvalue"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Property
                                title={<Trans i18nKey={langKeys.group} count={2} />}
                                subtitle={(
                                    <FieldSelect
                                        valueDefault={person.groups || ""}
                                        onChange={(value) => {
                                            setValue('groups', value?.domainvalue);
                                        }}
                                        loading={domains.loading}
                                        data={domains.value?.groups || []}
                                        optionValue="domainvalue"
                                        optionDesc="domaindesc"
                                    />
                                )}
                                m={1}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ height: 12 }} />
            <label>{t(langKeys.referredBy)}</label>
            {referrerList.data.map((e, i) => <ReferrerItem referrer={e} key={`referrer_item_${i}`} />)}
        </div>
    );
}

const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
}));

interface ChannelItemProps {
    channel: IPersonChannel;
}

const ChannelItem: FC<ChannelItemProps> = ({ channel }) => {
    const classes = useChannelItemStyles();

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                        subtitle={channel.typedesc}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.displayname} />}
                        subtitle={channel.displayname}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.personIdentifier} />}
                        subtitle={channel.personcommunicationchannel}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Property
                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                        subtitle={channel.personcommunicationchannelowner}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.firstConnection} />}
                        subtitle={channel.firstcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.lastConnection} />}
                        subtitle={channel.lastcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Property
                        title={<Trans i18nKey={langKeys.conversation} count={2} />}
                        subtitle={channel.conversations || '0'}
                        m={1}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

interface ChannelTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: UseFormSetValue<IPerson>;
    domains: IObjectState<IPersonDomains>;
}

const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person, getValues, setValue, domains }) => {
    const dispatch = useDispatch();
    const channelList = useSelector(state => state.person.personChannelList);
    // const additionalInfo = useSelector(state => state.person.personAdditionInfo);

    useEffect(() => {
        if (person.personid && person.personid !== 0) {
            dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
            // dispatch(getAdditionalInfoByPerson(getAdditionalInfoByPersonBody(person.personid)));
            return () => {
                dispatch(resetGetChannelListByPerson());
                // dispatch(resetgetAdditionalInfoByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 12 }} />
            {channelList.data.map((e, i) => <ChannelItem channel={e} key={`channel_item_${i}`} />)}
        </div>
    );
}

interface AuditTabProps {
    person: IPerson;
}

const AuditTab: FC<AuditTabProps> = ({ person }) => {
    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.firstContactDate} />}
                            subtitle={new Date(person.firstcontact).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastContactDate} />}
                            subtitle={new Date(person.lastcontact).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastCommunicationChannel} />}
                            subtitle={`${person.communicationchannelname || ''} - ${person.lastcommunicationchannelid || ''}`}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.createdBy} />}
                            subtitle={person.createby}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.creationDate} />}
                            subtitle={new Date(person.createdate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modifiedBy} />}
                            subtitle={person.changeby}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.modificationDate} />}
                            subtitle={new Date(person.changedate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}



interface ConversationsTabProps {
    person: IPerson;
}

const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        height: '100%',
    },
}));

const ConversationsTab: FC<ConversationsTabProps> = ({ person }) => {
    const classes = useConversationsTabStyles();
    const dispatch = useDispatch();
    const firstCall = useRef(true);
    const [page, setPage] = useState(0);
    const [list, setList] = useState<IPersonConversation[]>([]);
    const conversations = useSelector(state => state.person.personTicketList);

    const fetchTickets = useCallback(() => {
        if (person.personid && person.personid !== 0) {
            const params = {
                filters: {},
                sorts: {},
                take: 20,
                skip: 20 * page,
                offset: 0,
            };
            dispatch(getTicketListByPerson(getTicketListByPersonBody(person.personid, params)))
        }
    }, [page, person, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetGetTicketListByPerson());
        };
    }, [dispatch]);

    useEffect(() => {
        const myDiv = document.getElementById("wrapped-tabpanel-2");
        if (myDiv) {
            myDiv.onscroll = () => {
                if (!firstCall.current && list.length >= conversations.count) return;
                if (conversations.loading) return;
                if (myDiv.offsetHeight + myDiv.scrollTop + 1 >= myDiv.scrollHeight) {
                    console.log("Scroll finalizó");
                    setPage(prevPage => prevPage + 1);
                }
            };
        }
    }, [list, conversations, setPage]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    useEffect(() => {
        if (firstCall.current) firstCall.current = false;
        if (conversations.loading) return;
        if (conversations.error === true) {
            dispatch(showSnackbar({
                message: conversations.message || 'Error',
                show: true,
                success: false,
            }));
        } else {
            setList(prevList => [...prevList, ...conversations.data]);
        }
    }, [conversations, setList, dispatch]);

    return (
        <div className={classes.root}>
            {list.map((e, i) => {
                if (list.length < conversations.count && i === list.length - 1) {
                    return [
                        <ConversationItem conversation={e} key={`conversation_item_${i}`} />,
                        <div
                            style={{ width: 'inherit', display: 'flex', justifyContent: 'center' }}
                            key={`conversation_item_${i}_loader`}
                        >
                            <CircularProgress />
                        </div>
                    ];
                }
                return <ConversationItem conversation={e} key={`conversation_item_${i}`} />;
            })}
        </div>
    );
}

const useConversationsItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    collapseContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        fontSize: 14,
        fontWeight: 400,
    },
    infoLabel: {
        fontWeight: 500,
        fontSize: 14,
    },
    totalTime: {
        fontWeight: 700,
        fontSize: 16,
    },
    icon: {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

interface ConversationItemProps {
    conversation: IPersonConversation;
}

const ConversationItem: FC<ConversationItemProps> = ({ conversation }) => {
    const classes = useConversationsItemStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="Ticket #" subtitle={conversation.ticketnum} />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.advisor} />}
                        subtitle={conversation.asesorfinal}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property
                        title={<Trans i18nKey={langKeys.channel} />}
                        subtitle={conversation.personcommunicationchannel}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.startDate} />}
                        subtitle={new Date(conversation.fechainicio).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.endDate} />}
                        subtitle={conversation.fechafin && new Date(conversation.fechafin).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <div className={classes.icon}>
                        <IconButton size="medium" onClick={() => setOpen(!open)}>
                            <ArrowDropDown />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <div className={classes.collapseContainer}>
                    <Divider orientation="horizontal" />
                    <h3><Trans i18nKey={langKeys.ticketInformation} /></h3>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.firstTicketassignTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.fechainicio}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.firstReply} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.firstreplytime}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.pauseTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.totalpauseduration}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.avgResponseTimeOfAdvisor} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.tiempopromediorespuestaasesor}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.avgResponseTimeOfClient} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.tiempopromediorespuestapersona}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.totalTime}>
                                        <Trans i18nKey={langKeys.totalTime} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    <label className={classes.totalTime}>{conversation.totalduration}</label>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" />
                        <h3>Close</h3>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.type} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.closetype}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <label className={classes.infoLabel}>
                                        <Trans i18nKey={langKeys.status} />
                                    </label>
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    {conversation.status}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
}

interface OpportunitiesTabProps {
    person: IPerson;
}

const OpportunitiesTab: FC<OpportunitiesTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const leads = useSelector(state => state.person.personLeadList);

    useEffect(() => {
        dispatch(getLeadsByPerson(getOpportunitiesByPersonBody(person.personid)));
        return () => {
            dispatch(resetGetLeadsByPerson());
        };
    }, [dispatch, person]);

    useEffect(() => {
        console.log(leads);
    }, [leads]);

    return (
        <div>
            {leads.data.map((e, i) => <LeadItem lead={e} key={`leads_item_${i}`} />)}
        </div>
    );
}
const useLeadItemStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        justifyContent: 'stretch',
        width: 'inherit',
    },
    rootItem: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
    },
    collapseRoot: {
        display: 'flex',
        flexDirection: 'column',
    },
    opportunityContainer: {
        backgroundColor: '#381052',
        border: '#381052 solid 1px',
        borderRadius: 5,
        padding: theme.spacing(1),
    },
    opportunitySubContainer: {
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 700,
        fontSize: 14,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    opportunityValue: {
        fontSize: 32,
    },
    infoSubtitle: {
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: 16,
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(1),
        marginTop: 0,
        marginBottom: 0,
    },
    infoTitle: {
        fontSize: 18,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
}));

interface LeadItemProps {
    lead: IPersonLead;
}

const LeadItem: FC<LeadItemProps> = ({ lead }) => {
    const classes = useLeadItemStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <div className={classes.rootItem}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title="Ticket #" subtitle="#0000006" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.opportunity} />} subtitle={lead.description} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.creationDate} />} subtitle={lead.createdate} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.salesperson} />} subtitle="William Sam" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.lastUpdate} />} subtitle={lead.changedate} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                        <Property title={<Trans i18nKey={langKeys.phase} />} subtitle="Won" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                        <IconButton onClick={() => setOpen(!open)}>
                            <ArrowDropDown />
                        </IconButton>
                    </Grid>
                </Grid>
            </div>
            <Collapse in={open}>
                <div className={classes.collapseRoot}>
                    <div style={{ height: 15 }} />
                    <div className={classes.opportunityContainer}>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Box className={classes.opportunitySubContainer} m={1}>
                                    <label className={classes.opportunityValue}>$175</label>
                                    <div style={{ width: '10%', minWidth: 4 }} />
                                    <label><Trans i18nKey={langKeys.expectedRevenue} /></label>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Box className={classes.opportunitySubContainer} m={1}>
                                    <label className={classes.opportunityValue}>55%</label>
                                    <div style={{ width: '10%', minWidth: 4 }} />
                                    <label><Trans i18nKey={langKeys.probability} /></label>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Box className={classes.opportunitySubContainer} m={1}>
                                    <label className={classes.opportunityValue}>35:15</label>
                                    <div style={{ width: '10%', minWidth: 4 }} />
                                    <label><Trans i18nKey={langKeys.expectedClosing} /></label>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <Box className={classes.opportunitySubContainer} m={1}>
                                    <label className={classes.opportunityValue}>X</label>
                                    <div style={{ width: '10%', minWidth: 4 }} />
                                    <label><Trans i18nKey={langKeys.priority} /></label>
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                    <div style={{ height: 15 }} />
                    <div className={classes.rootItem}>
                        <h3 className={clsx(classes.infoSubtitle, classes.infoTitle)}>
                            <Trans i18nKey={langKeys.extraInformation} />
                        </h3>
                        <div style={{ height: 2 }} />
                        <h4 className={classes.infoSubtitle}>
                            <Trans i18nKey={langKeys.contactInformation} />
                        </h4>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Grid container direction="column">
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Company name" subtitle="NATURAL PRODUCTS" m={1} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Language" subtitle="English" m={1} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Mobile" subtitle="(456) 589 5621" m={1} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Grid container direction="column">
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Address" subtitle="45 1st St.Louisiana" m={1} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Contact name" subtitle="Sam White" m={1} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Grid container direction="column">
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Website" subtitle="www.naturalproducts.net" m={1} />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Property title="Job position" subtitle="manager" m={1} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <div style={{ height: 2 }} />
                        <h4 className={classes.infoSubtitle}>MARKETING</h4>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Campaign" subtitle="Promotion" m={1} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Medium" subtitle="Social media" m={1} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Source" subtitle="Facebook" m={1} />
                            </Grid>
                        </Grid>
                        <div style={{ height: 2 }} />
                        <h4 className={classes.infoSubtitle}>MISC</h4>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Days to assign" subtitle="0.00" m={1} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Days to close" subtitle="1.00" m={1} />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                <Property title="Referred by" subtitle="Website" m={1} />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Collapse>
        </div>
    );
}
