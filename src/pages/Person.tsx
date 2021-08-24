import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { DateRangePicker, ListPaginated, TitleDetail } from 'components';
import { getPaginatedPerson } from 'common/helpers';
import { IPerson } from "@types";
import { getCollectionPaginated, resetCollectionPaginated } from 'store/main/actions';
import { Avatar, Box, Divider, Grid, ListItem, Button, makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import { DownloadIcon, DownloadReverseIcon, EMailInboxIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Range } from 'react-date-range';

interface PersonItemProps {
    person: IPerson;
}

const arrayBread = [
    { id: "view-1", name: "Domains" },
    { id: "view-2", name: "Domain detail" }
];

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
    accountPhoto: {
        height: 40,
        width: 40,
    },
}));

const PersonItem: FC<PersonItemProps> = ({ person }) => {
    const classes = useStyles();

    const Photo: FC = () => {
        if (!person.imageurldef || person.imageurldef == "") {
            return <AccountCircle className={classes.accountPhoto} />;
        }
        return <Avatar alt={person.name} src={person.imageurldef} className={classes.accountPhoto} />;
    }

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
                <Grid container direction="column">
                    <Grid container direction="row" spacing={1}>
                        <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                            <Grid container direction="row" className={classes.gridRow}>
                                <Photo />
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
                                    <label className={classes.label}>Email</label>
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
                                    <label className={classes.label}>Phone</label>
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
                                    <label className={classes.label}>Department</label>
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
                                    <label className={classes.label}>Address</label>
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
                                <label>Ticket Created On:</label>
                                <div style={{ height: 4 }} />
                                <label>{person.educationlevel || "-"}</label>
                            </Grid>
                        </Grid>
                        <Grid item sm={3} xl={3} xs={3} md={3} lg={3}>
                            <Grid container direction="column">
                                <label>Last Connection:</label>
                                <div style={{ height: 4 }} />
                                <label>{person.civilstatus || "-"}</label>
                            </Grid>
                        </Grid>
                        <Grid item sm={4} xl={4} xs={4} md={4} lg={4} />
                        <Grid item sm={2} xl={2} xs={2} md={2} lg={2}>
                            <Button className={classes.btn} variant="contained" color="primary" disableElevation>
                                <label style={{ fontSize: 10, fontWeight: 400 }}>Active</label>
                            </Button>
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
    const { t } = useTranslation();
    const [openRangeModal, setOpenRangeModal] = useState(false);
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
        console.log("sss");
        const skip = pageSize * page;
        fetchData(skip, pageSize);

        // return () => {
        //     dispatch(resetCollectionPaginated());
        // };
    }, [pageSize, page, dateRange]);

    useEffect(() => {
        console.log("Effect", mainPaginated);
    }, [mainPaginated]);

    const format = (date: Date) => date.toISOString().split('T')[0];
    console.log("Person antes de renderizar", mainPaginated);
    return (
        <div>
            <Grid container direction="row">
                <Grid item xs={6}>
                    <TitleDetail title={t(langKeys.person, { count: 2 })} />
                </Grid>
                <Grid item xs={6}>
                    <Grid container direction="row-reverse">
                        <Button
                            // className={classes.button}
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
                            // className={classes.button}
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
                            open={openRangeModal}
                            setOpen={setOpenRangeModal}
                            range={dateRange}
                            onSelect={setDateRange}>
                            <Button onClick={() => setOpenRangeModal(!openRangeModal)}>
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
            />
        </div>
    );
}

export default Person;
