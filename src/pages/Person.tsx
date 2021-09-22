import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DateRangePicker, ListPaginated, TemplateIcons, Title } from 'components';
import { getPaginatedPerson } from 'common/helpers';
import { IPerson } from "@types";
import { getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { Avatar, Box, Divider, Grid, ListItem, Button, makeStyles, AppBar, Tabs, Tab, Collapse, IconButton } from '@material-ui/core';
import clsx from 'clsx';
import { DownloadIcon, DownloadReverseIcon, EmailIcon, EMailInboxIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Range } from 'react-date-range';
import { Skeleton } from '@material-ui/lab';
import { useHistory } from 'react-router';
import paths from 'common/constants/paths';
import { ArrowDropDown } from '@material-ui/icons';

interface PersonItemProps {
    person: IPerson;
}

interface PhotoProps {
    src?: string;
}

interface TabPanelProps {
    value: string;
    index: string;
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
    },
    itemColumn: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
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
        stroke: '#8F92A1'
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

const Photo: FC<PhotoProps> = ({ src }) => {
    const classes = usePhotoClasses();

    if (!src || src === "") {
        return <AccountCircle className={classes.accountPhoto} />;
    }
    return <Avatar alt={src} src={src} className={classes.accountPhoto} />;
}

const PersonItem: FC<PersonItemProps> = ({ person }) => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TemplateIcons
                        editFunction={() => history.push(paths.PERSON_DETAIL.resolve(person.personid))}
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
                                        <EMailInboxIcon className={classes.propIcon} />
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
                                        <PhoneIcon className={classes.propIcon} />
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
                                        <PortfolioIcon className={classes.propIcon} />
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
                                        <PinLocationIcon className={classes.propIcon} />
                                        <div style={{ width: 8 }} />
                                        <div className={classes.itemColumn}>
                                            <label className={classes.label}>
                                                <Trans i18nKey={langKeys.address} />
                                            </label>
                                            <div style={{ height: 4 }} />
                                            <label className={clsx(classes.label, classes.value)}>{person.province || '-'}</label>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Divider style={{ margin: '10px 0' }} />
                            <Grid container direction="row" spacing={1}>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="column">
                                        <label><Trans i18nKey={langKeys.ticketCreatedOn} />:</label>
                                        <div style={{ height: 4 }} />
                                        <label>{person.educationlevel || "-"}</label>
                                    </Grid>
                                </Grid>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="column">
                                        <label><Trans i18nKey={langKeys.lastConnection} />:</label>
                                        <div style={{ height: 4 }} />
                                        <label>{person.civilstatus || "-"}</label>
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
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 0);
    const initialDateRange: Range = { startDate, endDate, key: 'selection' };

    const dispatch = useDispatch();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const mainPaginated = useSelector(state => state.main.mainPaginated);

    useEffect(() => {
        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCollectionPaginated(getPaginatedPerson({
            startdate: format(dateRange.startDate!),
            enddate: format(dateRange.endDate!),
            skip: pageSize * page,
            take: pageSize,
            sorts: {},
            filters: {},
        })));
    }, [dispatch, pageSize, page, dateRange]);

    const format = (date: Date) => date.toISOString().split('T')[0];

    return (
        <div style={{ height: '100%' }}>
            <Grid container direction="row">
                <Grid item xs={6}>
                    <Title><Trans i18nKey={langKeys.person} count={2} /></Title>
                </Grid>
                <Grid item xs={6}>
                    <Grid container direction="row-reverse" spacing={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            onClick={() => { }}
                            startIcon={<DownloadIcon />}
                        >
                            <Trans i18nKey={langKeys.download} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<DownloadReverseIcon color="secondary" />}
                            onClick={() => { }}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            <Trans i18nKey={langKeys.import} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <DateRangePicker
                            open={openDateRangeModal}
                            setOpen={setOpenDateRangeModal}
                            range={dateRange}
                            onSelect={setDateRange}
                        >
                            <Button
                                disabled={mainPaginated.loading}
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
                currentPage={page}
                data={mainPaginated.data as IPerson[]}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                loading={mainPaginated.loading}
                totalItems={mainPaginated.count}
                builder={(e, i) => <PersonItem person={e} key={`person_item_${i}`} />}
                skeleton={i => <PersonItemSkeleton key={`person_item_skeleton_${i}`} />}
            />
        </div>
    );
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            // className={classes.root}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
            style={{ display: value === index ? 'block' : 'none' }}
        >
            <Box p={3}>
                {children}
            </Box>
        </div>
    );
}

const usepropertyStyles = makeStyles(theme => ({
    propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 12,
        color: '#B6B4BA',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 14,
        margin: 0,
    },
}));

interface PropertyProps {
    icon?: React.ReactNode;
    title: React.ReactNode;
    subtitle: React.ReactNode;
}

const Property: FC<PropertyProps> = ({ icon, title, subtitle }) => {
    const classes = usepropertyStyles();

    return (
        <div className={classes.propertyRoot}>
            {icon}
            {icon && <div style={{ width: 8 }} />}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label className={classes.propTitle}>{title}</label>
                <p className={classes.propSubtitle}>{subtitle}</p>
            </div>
        </div>
    );
}

const usePersonDetailStyles = makeStyles(theme => ({
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
    },
}));

export const PersonDetail: FC = () => {
    const classes = usePersonDetailStyles();
    const [tabIndex, setTabIndex] = useState('0');

    return (
        <Box component="div" height="100%">
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: "100%" }}>
                <div style={{ flexGrow: 1 }}>
                    <AppBar position="static" elevation={0}>
                        <Tabs
                            value={tabIndex}
                            onChange={(_, i: string) => setTabIndex(i)}
                            className={classes.tabs}
                            TabIndicatorProps={{ style: { display: 'none' } }}
                        >
                            <Tab className={clsx(classes.tab, classes.label, tabIndex === "0" && classes.activetab)} label={<Trans i18nKey={langKeys.interface} />} value="0" />
                            <Tab className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)} label={<Trans i18nKey={langKeys.color} count={2} />} value="1" />
                            <Tab className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)} label={<Trans i18nKey={langKeys.form} />} value="2" />
                            <Tab className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)} label={<Trans i18nKey={langKeys.bubble} />} value="3" />
                            <Tab className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)} label={<Trans i18nKey={langKeys.extra} count={2} />} value="4" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}><CommunicationChannelsTab /></TabPanel>
                    <TabPanel value="1" index={tabIndex}><AuditTab /></TabPanel>
                    <TabPanel value="2" index={tabIndex}><ConversationsTab /></TabPanel>
                    <TabPanel value="3" index={tabIndex}>qqq</TabPanel>
                    <TabPanel value="4" index={tabIndex}>qqq</TabPanel>
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                <div className={classes.profile}>
                    <label className={classes.label}>Overview</label>
                    <Photo />
                    <h2>francisco F.</h2>
                    <Property icon={<EMailInboxIcon />} title="Email" subtitle="aa@g.com" />
                </div>
            </div>
        </Box>
    );
}

const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        padding: theme.spacing(2),
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

const ChannelItem: FC = () => {
    const classes = useChannelItemStyles();

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                    <Box className={classes.item} m={1}>
                        <label className={classes.itemLabel}>Communication channel</label>
                        <p className={classes.itemText}>Web Messwenger</p>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                    <Box className={classes.item}  m={1}>
                        <label className={classes.itemLabel}>Internal identifier</label>
                        <p className={classes.itemText}>Web Messwenger</p>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                    <Box className={classes.item}  m={1}>
                        <label className={classes.itemLabel}>First connection</label>
                        <p className={classes.itemText}>Web Messwenger</p>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                    <Box className={classes.item}  m={1}>
                        <label className={classes.itemLabel}>Last connection</label>
                        <p className={classes.itemText}>Web Messwenger</p>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                    <Box className={classes.item}  m={1}>
                        <label className={classes.itemLabel}>Converesations</label>
                        <p className={classes.itemText}>Web Messwenger</p>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

const CommunicationChannelsTab: FC = () => {
   
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property title="Email" subtitle="aa@g.com" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property title="Email" subtitle="aa@g.com" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <div style={{ height: 12 }} />
            <ChannelItem />
        </div>
    );
}

const AuditTab: FC = () => {
    return (
        <Grid container direction="row">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Fecha de primer contacto" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Fecha de último contacto" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Último canal de comunicación" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Creado por" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Fecha de creación" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Modificado por" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Box m={1}>
                            <Property title="Fecha de módificación" subtitle="8/4/2021" />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const useConversationsTabStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
    },
    collapseContainer: {
        marginTop: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
    },
}));

const ConversationsTab: FC = () => {
    const classes = useConversationsTabStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="Ticket #" subtitle="#0000006" />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="Advisor" subtitle="#0000006" />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property title="Channel" subtitle="#0000006" />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="Start date" subtitle="#0000006" />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property title="end date" subtitle="#0000006" />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <IconButton onClick={() => setOpen(!open)}>
                        <ArrowDropDown />
                    </IconButton>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <div className={classes.collapseContainer}>
                    <Divider orientation="horizontal" />
                    <h3>Ticket information</h3>
                    <Grid container direction="column">
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    First ticket assign time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    First ticket assign time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    First ticket assign time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    First ticket assign time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    First ticket assign time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    Total time
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    00:00:03
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider orientation="horizontal" />
                        <h3>Close</h3>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    Type
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    Resolved
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Grid container direction="row">
                                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    Type
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} xl={10}>
                                    Resolved
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
}