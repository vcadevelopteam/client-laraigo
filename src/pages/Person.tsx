import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DateRangePicker, ListPaginated, Title } from 'components';
import { getPaginatedPerson } from 'common/helpers';
import { IPerson } from "@types";
import { getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { Avatar, Box, Divider, Grid, ListItem, Button, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { DownloadIcon, DownloadReverseIcon, EMailInboxIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Range } from 'react-date-range';
import { Skeleton } from '@material-ui/lab';

interface PersonItemProps {
    person: IPerson;
}

interface PhotoProps {
    src?: string;
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

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
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

const Person: FC = () => {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 2, 0);
    const initialDateRange: Range = { startDate, endDate, key: 'selection' };

    const dispatch = useDispatch();
    const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const mainPaginated = useSelector(state => state.main.mainPaginated);

    const fetchData = (skip: number, take: number) => dispatch(getCollectionPaginated(getPaginatedPerson({
        startdate: format(dateRange.startDate!),
        enddate: format(dateRange.endDate!),
        skip,
        take,
        sorts: {},
        filters: {},
    })));

    useEffect(() => {
        const skip = pageSize * page;
        fetchData(skip, pageSize);

        return () => {
            dispatch(resetCollectionPaginated());
        };
    }, [pageSize, page, dateRange]);

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

export default Person;
