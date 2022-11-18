/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from '@material-ui/icons/Close';
import React, { FC, useEffect, useState } from "react";
import TableZyx from "components/fields/table-simple";

import { AntTab, FieldSelect, DateRangePicker, GetIconColor } from 'components';
import { Avatar, Button, Tabs } from "@material-ui/core";
import { CalendarIcon } from "icons";
import { Dictionary, IRequestBody } from "@types";
import { getCollection, getMultiCollection, resetAllMain } from "store/main/actions";
import { getDateCleaned } from "common/helpers/functions";
import { getPostHistorySel, postHistoryIns } from "common/helpers/requestBodies";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Range } from 'react-date-range';
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
    },
    containerLeft: {
        [theme.breakpoints.down('xs')]: {
            minWidth: '100vw',
            height: '100vh',
        },
        border: '1px solid #762AA9',
        borderRadius: '4px',
        flex: 1,
        margin: 4,
        marginBottom: '28px',
        overflowY: 'auto',
    },
    itemDate: {
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        height: 40,
        minHeight: 40,
    },
    root: {
        backgroundColor: 'white',
        flex: 1,
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 16,
        width: '100%',
    },
}));

const selectionKey = 'posthistoryid';
const PostCreatorHistory: FC = () => {
    const { t } = useTranslation();

    const [pageSelected, setPageSelected] = useState(0);

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <Tabs
                    indicatorColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    value={pageSelected}
                    variant="fullWidth"
                >
                    <AntTab label={t(langKeys.published)} />
                    <AntTab label={t(langKeys.history_scheduled)} />
                    <AntTab label={t(langKeys.drafts)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'PUBLISHED'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'SCHEDULED'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'DRAFT'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}
const initialRange = {
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection',
    startDate: new Date(new Date().setDate(1)),
}

const PublishedHistory: React.FC<{ publishType: string }> = ({ publishType }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiData);

    const [cleanSelected, setCleanSelected] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [filters, setfilters] = useState<any>({ type: "" });
    const [firstCall, setfirstCall] = useState(true);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [waitDelete, setWaitDelete] = useState(false);

    const fetchData = () => dispatch(getCollection(getPostHistorySel({ type: filters.type, status: publishType, datestart: dateRangeCreateDate.startDate, dateend: dateRangeCreateDate.endDate })));

    useEffect(() => {
        fetchData();
        setfirstCall(false);

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading && !firstCall) {
            fetchData();
        }
    }, [filters]);

    useEffect(() => {
        if (!mainResult.mainData.loading && !firstCall && !openDateRangeCreateDateModal) {
            fetchData();
        }
    }, [openDateRangeCreateDateModal]);

    const columns = React.useMemo(() => [
        {
            accessor: 'posthistoryid',
            Header: t(langKeys.title),
            isComponent: true,
            NoFilter: true,
            width: 200,
            Cell: (props: any) => {
                const { texttitle, communicationchanneldesc, medialink, communicationchanneltype } = props.cell.row.original;
                return (
                    <div style={{ display: "flex", gap: 5 }}>
                        <div>
                            {(!!medialink?.[0]?.thumbnail) ?
                                <img loading='eager' alt="" width={50} height={50} src={medialink?.[0]?.thumbnail || ""}></img>
                                :
                                <img loading='eager' alt="" width={50} height={50} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/41ba0151-31c6-4992-88b0-7d528db01de8/textonly.png"></img>
                            }
                            <div style={{ position: "absolute", top: 35, left: 125 }}>
                                <Avatar variant="rounded" style={{ width: 25, height: 25, backgroundColor: "white" }}><GetIconColor channelType={communicationchanneltype} /></Avatar>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: "flex", fontSize: "1.1em" }}>{texttitle}</div>
                            <div style={{ display: "flex", fontSize: "1em", gap: 5 }}><Avatar style={{ width: 20, height: 20 }} />{communicationchanneldesc}</div>
                        </div>
                    </div>
                )
            }
        },
        {
            Header: t(langKeys.publicationdate),
            accessor: 'publishdate',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { publishdate } = props.cell.row.original;
                return (
                    <div style={{ height: 31 }}>
                        {new Date(publishdate).toDateString()}
                    </div>)
            }
        },
        {
            Header: t(langKeys.scope),
            accessor: 'reach',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { reach } = props.cell.row.original;
                return (
                    <div style={{ height: 45, textAlign: "center" }}>
                        <div>
                            {reach || 0}
                        </div>
                        <div>
                            {t(langKeys.peoplereached)}
                        </div>
                    </div>)
            }
        },
        {
            Header: t(langKeys.interaction_plural),
            accessor: 'interactions',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { interactions } = props.cell.row.original;
                return (
                    <div style={{ height: 31, textAlign: "center" }}>
                        {interactions || 0}
                    </div>)
            }
        },
        {
            Header: t(langKeys.likesandreactions),
            accessor: 'likesandreactions',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { reactions } = props.cell.row.original;
                return (
                    <div style={{ height: 45, textAlign: "center" }}>
                        {Object.keys(reactions || {}).map((x) => {
                            return <div>{x.toLocaleUpperCase()}: {reactions[x]} </div>
                        })}
                        <div>
                            {reactions}
                        </div>
                    </div>)
            }
        },
    ], []);

    useEffect(() => {
        if (waitDelete) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                fetchData();
            } else if (multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(multiResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [multiResult, waitDelete])

    const handleclose = () => {
        const toDelete = mainResult.mainData.data.filter(x => Object.keys(selectedRows).includes(`${x[selectionKey]}`)) || [];
        let allRequestBody: IRequestBody[] = [];
        toDelete.forEach(x => {
            allRequestBody.push(postHistoryIns({ ...x, status: "DELETED", operation: "UPDATE" }));
        });
        setWaitDelete(true);
        dispatch(getMultiCollection(allRequestBody));
    }

    return (
        <div style={{ height: '100%', width: 'inherit' }}>
            <TableZyx
                cleanSelection={cleanSelected}
                columns={columns}
                data={mainResult.mainData.data}
                download={false}
                heightWithCheck={65}
                initialSelectedRows={selectedRows}
                loading={mainResult.mainData.loading}
                onClickRow={() => { }}
                register={false}
                selectionKey={selectionKey}
                setCleanSelection={setCleanSelected}
                setSelectedRows={setSelectedRows}
                useSelection={true}
                ButtonsElement={() => (
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: 10 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <FieldSelect
                                data={[
                                    { value: "POST" },
                                    { value: "STORY" },
                                ]}
                                label={t(langKeys.posttype)}
                                loading={false}
                                onChange={(value) => { setfilters({ ...filters, type: value?.value || "" }) }}
                                optionDesc="value"
                                optionValue="value"
                                size="small"
                                style={{ maxWidth: 300, minWidth: 200 }}
                                valueDefault={filters.type}
                                variant="outlined"
                            />
                            <Button
                                color="primary"
                                disabled={Object.keys(selectedRows).length === 0}
                                onClick={handleclose}
                                style={{ marginLeft: '5px' }}
                                variant="contained"
                            >
                                <CloseIcon />{t(langKeys.delete)}
                            </Button>
                        </div>
                        <div style={{ display: "flex" }}>
                            <DateRangePicker
                                onSelect={setDateRangeCreateDate}
                                open={openDateRangeCreateDateModal}
                                range={dateRangeCreateDate}
                                setOpen={setOpenDateRangeCreateDateModal}
                            >
                                <Button
                                    className={classes.itemDate}
                                    startIcon={<CalendarIcon />}
                                    onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                >
                                    {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                </Button>
                            </DateRangePicker>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default PostCreatorHistory;