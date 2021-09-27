import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DateRangePicker, ListPaginated, TemplateIcons, Title } from 'components';
import { getChannelListByPersonBody, getTicketListByPersonBody, getPaginatedPerson, getOpportunitiesByPersonBody } from 'common/helpers';
import { IPerson, IPersonChannel, IPersonConversation } from "@types";
import { Avatar, Box, Divider, Grid, ListItem, Button, makeStyles, AppBar, Tabs, Tab, Collapse, IconButton, BoxProps, Breadcrumbs, Link } from '@material-ui/core';
import clsx from 'clsx';
import { BuildingIcon, DownloadIcon, DownloadReverseIcon, EMailInboxIcon, GenderIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Range } from 'react-date-range';
import { Skeleton } from '@material-ui/lab';
import { useHistory, useLocation } from 'react-router';
import paths from 'common/constants/paths';
import { ArrowDropDown } from '@material-ui/icons';
import { getChannelListByPerson, getPersonListPaginated, resetGetPersonListPaginated, resetGetChannelListByPerson, getTicketListByPerson, resetGetTicketListByPerson, getOpportunitiesByPerson, resetGetOpportunitiesByPerson } from 'store/person/actions';
import { FixedSizeList as List } from 'react-window';

interface PersonItemProps {
    person: IPerson;
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

    const goToPersonDetail = () =>{
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
                                        <Photo src={person.imageurldef}/>
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
                                            <label className={clsx(classes.label, classes.value)}>{person.province || '-'}</label>
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
                                        <label>{person.firstcontact || "-"}</label>
                                    </Grid>
                                </Grid>
                                <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                                    <Grid container direction="column">
                                        <label><Trans i18nKey={langKeys.lastConnection} />:</label>
                                        <div style={{ height: 4 }} />
                                        <label>{person.lastcontact || "-"}</label>
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
    const personList = useSelector(state => state.person.personList);

    useEffect(() => {
        return () => {
            dispatch(resetGetPersonListPaginated());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(getPersonListPaginated(getPaginatedPerson({
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
                            disabled={personList.loading}
                            onClick={() => { }}
                            startIcon={<DownloadIcon />}
                        >
                            <Trans i18nKey={langKeys.download} />
                        </Button>
                        <div style={{ width: 9 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={personList.loading}
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
                                disabled={personList.loading}
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
                data={personList.data as IPerson[]}
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

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wrapped-tabpanel-${index}`}
            aria-labelledby={`wrapped-tab-${index}`}
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
    },
    leadingContainer: {
        height: 24,
        width: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
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
            {icon && <div style={{ width: 8 }} />}
            <div className={classes.contentContainer}>
                <label className={classes.propTitle}>{title}</label>
                <div style={{ height: 4 }} />
                <p className={classes.propSubtitle}>{subtitle || "-"}</p>
            </div>
        </Box>
    );
}

const usePersonDetailStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "100%",
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
    },
}));

export const PersonDetail: FC = () => {
    const history = useHistory();
    const location = useLocation<IPerson>();
    const classes = usePersonDetailStyles();
    const [tabIndex, setTabIndex] = useState('0');

    const person = location.state as IPerson | null;

    useEffect(() => {
        if (!person) {
            history.push(paths.PERSON);
        }
    }, [history, person]);

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
            <h1>{person.name}</h1>
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
                                label={<div><Trans i18nKey={langKeys.communicationchannel} /> {' & '} <Trans i18nKey={langKeys.extra} count={2} /></div>}
                                value="0"
                            />
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "1" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.audit} />}
                                value="1"
                            />
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "2" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.conversation} count={2} />}
                                value="2"
                            />
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "3" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.opportunity} count={2} />}
                                value="3"
                            />
                            <Tab
                                className={clsx(classes.tab, classes.label, tabIndex === "4" && classes.activetab)}
                                label={<Trans i18nKey={langKeys.claim} count={2} />}
                                value="4"
                            />
                        </Tabs>
                    </AppBar>
                    <TabPanel value="0" index={tabIndex}><CommunicationChannelsTab person={person} /></TabPanel>
                    <TabPanel value="1" index={tabIndex}><AuditTab person={person} /></TabPanel>
                    <TabPanel value="2" index={tabIndex}><ConversationsTab person={person} /></TabPanel>
                    <TabPanel value="3" index={tabIndex}><OpportunitiesTab person={person} /></TabPanel>
                    <TabPanel value="4" index={tabIndex}>qqq</TabPanel>
                </div>
                <Divider style={{ backgroundColor: '#EBEAED' }} orientation="vertical" flexItem />
                <div className={classes.profile}>
                    <label className={classes.label}>Overview</label>
                    <div style={{ height: 16 }} />
                    <Photo src={person.imageurldef} radius={50} />
                    <h2>{person.name}</h2>
                    <Property
                        icon={<EMailInboxIcon />}
                        title={<Trans i18nKey={langKeys.phone} />}
                        subtitle={person.phone}
                        mt={1}
                        mb={1}
                    />
                    <Property
                        icon={<PhoneIcon />}
                        title={<Trans i18nKey={langKeys.email} />}
                        subtitle={person.email}
                        mt={1}
                        mb={1} />
                    <Property
                        icon={<PortfolioIcon />}
                        title={<Trans i18nKey={langKeys.document} />}
                        subtitle={person.documenttype}
                        mt={1}
                        mb={1}
                    />
                    <Property
                        icon={<PortfolioIcon />}
                        title={<Trans i18nKey={langKeys.docNumber} />}
                        subtitle={person.documentnumber}
                        mt={1}
                        mb={1}
                    />
                    <Property
                        icon={<GenderIcon />}
                        title={<Trans i18nKey={langKeys.gender} />}
                        subtitle={person.gender}
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
            </div>
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

    console.log(channel);
    return (
        <div className={classes.root}>
            <Grid container direction="row">
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property
                        title={<Trans i18nKey={langKeys.communicationchannel} />}
                        subtitle={channel.typedesc}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Property
                        title={<Trans i18nKey={langKeys.internalIdentifier} />}
                        subtitle={channel.personcommunicationchannel}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.firstConnection} />}
                        subtitle={channel.firstcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.lastConnection} />}
                        subtitle={channel.lastcontact}
                        m={1}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
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
}

const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const channelList = useSelector(state => state.person.personChannelList);
    // const additionalInfo = useSelector(state => state.person.personAdditionInfo);

    useEffect(() => {
        dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
        // dispatch(getAdditionalInfoByPerson(getAdditionalInfoByPersonBody(person.personid)));
        return () => {
            dispatch(resetGetChannelListByPerson());
            // dispatch(resetgetAdditionalInfoByPerson());
        };
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container direction="row">
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.personType} />}
                                subtitle={person.type}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.civilStatus} />}
                                subtitle={person.civilstatus}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.educationLevel} />}
                                subtitle={person.educationlevel}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.occupation} />}
                                subtitle={person.occupation}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.group} count={2} />}
                                subtitle={person.groups}
                                mt={1} mb={1}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    <Grid container direction="column">
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativePhone} />}
                                subtitle={person.alternativephone}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.alternativeEmail} />}
                                subtitle={person.alternativeemail}
                                mt={1} mb={1}
                            />
                        </Grid>
                        <Grid item sm={12} xl={12} xs={12} md={12} lg={12}>
                            <Property
                                title={<Trans i18nKey={langKeys.referredBy} />}
                                subtitle={person.referringpersonname}
                                mt={1} mb={1}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
                            subtitle={person.firstcontact}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastContactDate} />}
                            subtitle={person.lastcontact}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            title={<Trans i18nKey={langKeys.lastCommunicationChannel} />}
                            subtitle={`${person.communicationchannelname} - ${person.lastcommunicationchannelid}`}
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
                            subtitle={person.createdate}
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
                            subtitle={person.changedate}
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

const ConversationsTab: FC<ConversationsTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.person.personTicketList);

    useEffect(() => {
        dispatch(getTicketListByPerson(getTicketListByPersonBody(person.personid)));
        return () => {
            dispatch(resetGetTicketListByPerson());
        };
    }, [dispatch, person]);

    if (conversations.data.length <= 100) {
        return (
            <div>
                {conversations.data.map((e, i) => (
                    <ConversationItem conversation={e} key={`conversation_item_${i}`} />
                ))}
            </div>
        );
    }
    return (
        <List
            direction="vertical"
            width="100%"
            height={600}
            itemCount={conversations.data.length}
            itemSize={82}
        >
            {({ index, style }) => {
                return (
                    <div style={style}>
                        <ConversationItem
                            conversation={conversations.data[index]}
                            key={`conversation_item_${index}`}
                        />
                    </div>
                );
            }}
        </List>
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
                        subtitle={conversation.fechainicio}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        title={<Trans i18nKey={langKeys.endDate} />}
                        subtitle={conversation.fechafin}
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
    const opportunityList = useSelector(state => state.person.personOpportunityList);

    useEffect(() => {
        dispatch(getOpportunitiesByPerson(getOpportunitiesByPersonBody(person.personid)));
        return () => {
            dispatch(resetGetOpportunitiesByPerson());
        };
    }, [dispatch, person]);

    // console.log(opportunityList);

    return (
        <div>
            <OpportunityItem opportunity={{}} />
            {/* {opportunityList.data.map((e, i) => <OpportunityItem opportunity={e} key={`opportunity_item_${i}`} />)} */}
        </div>
    );
}
const useOpportunityItemStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        justifyContent: 'stretch',
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

interface OpportunityItemProps {
    opportunity: any;
}

const OpportunityItem: FC<OpportunityItemProps> = ({ opportunity }) => {
    const classes = useOpportunityItemStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <div className={classes.rootItem}>
                <Grid container direction="row">
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title="Ticket #" subtitle="#0000006" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.opportunity} />} subtitle="-" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.creationDate} />} subtitle="24/02/1189" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.salesperson} />} subtitle="William Sam" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Property title={<Trans i18nKey={langKeys.lastUpdate} />} subtitle="-" />
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
