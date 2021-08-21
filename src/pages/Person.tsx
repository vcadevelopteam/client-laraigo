import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { ListPaginated } from 'components';
import { getPaginatedPerson } from 'common/helpers';
import { IPerson } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { getCollectionPaginated } from 'store/main/actions';
import { Box, Divider, ListItem } from '@material-ui/core';
import { Facebook } from '@material-ui/icons';
import clsx from 'clsx';
import { EMailInboxIcon, PhoneIcon, PinLocationIcon, PortfolioIcon } from 'icons';

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
    }
}));

const PersonItem: FC<PersonItemProps> = ({ person }) => {
    const classes = useStyles();

    return (
        <ListItem className={classes.personList}>
            <Box className={classes.personItemRoot}>
                <div className={clsx(classes.itemRow, classes.itemTop)}>
                    <div className={clsx(classes.itemRow, classes.spacing)}>
                        <Facebook />
                        <div style={{ width: 8 }} />
                        <div className={classes.itemColumn}>
                            <label className={clsx(classes.label, classes.value)}>{person.name}</label>
                            <label className={classes.label}>{`ID# ${person.personid}`}</label>
                        </div>
                    </div>
                    <div className={clsx(classes.itemRow, classes.spacing)}>
                        <EMailInboxIcon className={classes.propIcon} />
                        <div style={{ width: 8 }} />
                        <div className={classes.itemColumn}>
                            <label className={classes.label}>Email</label>
                            <label className={clsx(classes.label, classes.value)}>{person.email || "-"}</label>
                        </div>
                    </div>
                    <div className={clsx(classes.itemRow, classes.spacing)}>
                        <PhoneIcon className={classes.propIcon} />
                        <div style={{ width: 8 }} />
                        <div className={classes.itemColumn}>
                            <label className={classes.label}>Phone</label>
                            <label className={clsx(classes.label, classes.value)}>{person.phone || "-"}</label>
                        </div>
                    </div>
                    <div className={clsx(classes.itemRow, classes.spacing)}>
                        <PortfolioIcon className={classes.propIcon} />
                        <div style={{ width: 8 }} />
                        <div className={classes.itemColumn}>
                            <label className={classes.label}>Department</label>
                            <label className={clsx(classes.label, classes.value)}>{person.region || '-'}</label>
                        </div>
                    </div>
                    <div className={clsx(classes.itemRow, classes.spacing)}>
                        <PinLocationIcon className={classes.propIcon} />
                        <div style={{ width: 8 }} />
                        <div className={classes.itemColumn}>
                            <label className={classes.label}>Address</label>
                            <label className={clsx(classes.label, classes.value)}>{person.province || '-'}</label>
                        </div>
                    </div>
                </div>
                <Divider style={{ margin: '10px 0' }} />
                <div className={classes.itemRow}>
                    <div className={classes.itemColumn}>
                        <label>Ticket Created On:</label>
                        <label>{person.educationlevel || "-"}</label>
                    </div>
                    <div className={classes.itemColumn}>
                        <label>Last Connection:</label>
                        <label>{person.civilstatus || "-"}</label>
                    </div>
                    <div style={{ flexGrow: 6 }} />
                    <Button className={classes.btn} variant="contained" color="primary" disableElevation>
                        <label style={{ fontSize: 10, fontWeight: 400 }}>Active</label>
                    </Button>
                </div>
            </Box>
        </ListItem>
    );
}

const Person: FC = () => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const mainPaginated = useSelector(state => state.main.mainPaginated);
    
    const fetchData = (skip: number, take: number) => dispatch(getCollectionPaginated(getPaginatedPerson({
        startdate: '2021-06-01',
        enddate: '2021-08-30',
        skip,
        take,
        sorts: {},
        filters: {},
    })));

    useEffect(() => {
        console.log("ww");
        const skip = pageSize * page;
        fetchData(skip, pageSize);
    }, [pageSize, page]);

    return (
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
    );
}

export default Person;
