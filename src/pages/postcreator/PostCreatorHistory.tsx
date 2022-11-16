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
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
        marginLeft: '4px',
        marginRight: '4px',
    },
    containerLeft: {
        [theme.breakpoints.down('xs')]: {
            minWidth: '100vw',
            height: '100vh',
        },
        flex: 1,
        overflowY: 'auto',
        margin: 4,
        border: '1px solid #762AA9',
        borderRadius: '4px',
        marginBottom: '28px',
    },
    itemDate: {
        minHeight: 40,
        height: 40,
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)'
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
                    value={pageSelected}
                    indicatorColor="primary"
                    variant="fullWidth"
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                >
                    <AntTab label={t(langKeys.published)} />
                    <AntTab label={t(langKeys.history_scheduled)} />
                    <AntTab label={t(langKeys.drafts)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'PUBLISHED'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'SCHEDULED'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory dataChannel={null} publishType={'DRAFT'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}
const initialRange = {
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection'
}

const PublishedHistory: React.FC<{ dataChannel: any, publishType: string }> = ({ dataChannel, publishType }) => {
    const dispatch = useDispatch();

    const classes = useStyles();

    const mainResult = useSelector(state => state.main);
    const { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false)
    const [firstCall, setfirstCall] = useState(true)
    const [waitDelete, setWaitDelete] = useState(false)
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const multiResult = useSelector(state => state.main.multiData);
    const [filters, setfilters] = useState<any>({
        type: ""
    });

    const fetchData = () => dispatch(getCollection(getPostHistorySel({ type: filters.type, status: publishType, datestart: dateRangeCreateDate.startDate, dateend: dateRangeCreateDate.endDate })));

    useEffect(() => {
        fetchData();
        setfirstCall(false)
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
            Header: t(langKeys.title),
            accessor: 'posthistoryid',
            width: 200,
            isComponent: true,
            NoFilter: true,
            Cell: (props: any) => {
                const { texttitle, communicationchanneldesc, medialink, communicationchanneltype } = props.cell.row.original;
                return (
                    <div style={{ display: "flex", gap: 5 }}>
                        <div>
                            {(!!medialink?.[0]?.thumbnail) ?
                                <img width={50} height={50} src={medialink?.[0]?.thumbnail || ""}></img>
                                :
                                <div style={{ width: 50, height: 50, backgroundColor: "#c4c4c4" }}></div>
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
    ],
        []
    );

    useEffect(() => {
        if (waitDelete) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            } else if (multiResult.error) {
                const errormessage = t(multiResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [multiResult, waitDelete])

    const handleclose = () => {
        const todelete = mainResult.mainData.data.filter(x => Object.keys(selectedRows).includes(`${x[selectionKey]}`)) || []
        let allRequestBody: IRequestBody[] = [];
        todelete.forEach(x => {
            allRequestBody.push(postHistoryIns({ ...x, status: "DELETED", operation: "UPDATE" }))
        });
        setWaitDelete(true);
        dispatch(getMultiCollection(allRequestBody))
    }

    return (

        <div style={{ height: '100%', width: 'inherit' }}>
            <TableZyx
                columns={columns}
                data={mainResult.mainData.data}
                heightWithCheck={65}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                initialSelectedRows={selectedRows}
                onClickRow={() => { }}
                cleanSelection={cleanSelected}
                setCleanSelection={setCleanSelected}
                register={false}
                download={false}
                loading={mainResult.mainData.loading}
                ButtonsElement={() => (
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: 10 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            <FieldSelect
                                onChange={(value) => { setfilters({ ...filters, type: value?.value || "" }) }}
                                size="small"
                                label={t(langKeys.posttype)}
                                style={{ maxWidth: 300, minWidth: 200 }}
                                variant="outlined"
                                loading={false}
                                data={[
                                    { value: "POST" },
                                    { value: "STORY" },
                                ]}
                                optionValue="value"
                                optionDesc="value"
                                valueDefault={filters.type}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={Object.keys(selectedRows).length === 0}
                                style={{ marginLeft: '5px' }}
                                onClick={handleclose}
                            >
                                <CloseIcon />{t(langKeys.close)}
                            </Button>

                        </div>
                        <div style={{ display: "flex" }}>
                            <DateRangePicker
                                open={openDateRangeCreateDateModal}
                                setOpen={setOpenDateRangeCreateDateModal}
                                range={dateRangeCreateDate}
                                onSelect={setDateRangeCreateDate}
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