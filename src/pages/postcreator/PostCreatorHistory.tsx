/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from '@material-ui/icons/Close';
import EditHistoryPost from './EditHistoryPost';
import React, { FC, useEffect, useState } from "react";
import TableZyx from "components/fields/table-simple";
import Tooltip from "@material-ui/core/Tooltip";

import { AntTab, FieldSelect, DateRangePicker, GetIconColor, TemplateBreadcrumbs } from 'components';
import { Avatar, Button, Tabs } from "@material-ui/core";
import { CalendarIcon } from "icons";
import { Dictionary, IRequestBody } from "@types";
import { getCollection, getMultiCollection, resetAllMain, setMemoryTable, cleanMemoryTable } from "store/main/actions";
import { getDateCleaned } from "common/helpers/functions";
import { getPostHistorySel, postHistoryIns } from "common/helpers/requestBodies";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Range } from 'react-date-range';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";

const getArrayBread = (temporalName: string, viewName: string) => ([
    { id: "view-1", name: viewName || "Post Creator" },
    { id: "bet-1", name: temporalName }
]);

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
const PostCreatorHistory: FC<{ setViewSelected: (id: string) => void, modeSelected: number }> = ({ setViewSelected, modeSelected }) => {
    const { t } = useTranslation();

    const [pageSelected, setPageSelected] = useState(modeSelected ? modeSelected : 0);
    const [betweenViews, setBetweenViews] = useState("bet-1");
    const [arrayBread, setArrayBread] = useState<any>(getArrayBread(t('postcreator_posthistory'), t(langKeys.postcreator_title)));

    const handleSelectedString = (key: string) => {
        if (key.includes("view")) {
            setViewSelected(key);
        } else if (key === "bet-1") {
            setArrayBread(getArrayBread(t('postcreator_posthistory'), t(langKeys.postcreator_title)));
            setBetweenViews(key)
        } else {
            setBetweenViews(key)
        }
    }

    return (
        <React.Fragment>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={handleSelectedString}
            />
            <div style={{ width: '100%' }}>
                {betweenViews === "bet-1" &&
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
                }
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'PUBLISHED'} setArrayBread={setArrayBread} betweenViews={betweenViews} setBetweenViews={setBetweenViews} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'SCHEDULED'} setArrayBread={setArrayBread} betweenViews={betweenViews} setBetweenViews={setBetweenViews} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'DRAFT'} setArrayBread={setArrayBread} betweenViews={betweenViews} setBetweenViews={setBetweenViews} />
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

const IDPUBLISHEDHISTORY = "IDPUBLISHEDHISTORY";
const PublishedHistory: React.FC<{ publishType: string, setArrayBread: (value: any) => void, betweenViews: any, setBetweenViews: (value: any) => void }> = ({ publishType, setArrayBread, betweenViews, setBetweenViews }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const memoryTable = useSelector(state => state.main.memoryTable);
    const multiResult = useSelector(state => state.main.multiData);

    const [cleanSelected, setCleanSelected] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [filters, setfilters] = useState<any>({ type: "", publishtatus: "" });
    const [firstCall, setfirstCall] = useState(true);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [waitDelete, setWaitDelete] = useState(false);
    const [rowSelected, setRowSelected] = useState<{ row: Dictionary | null, edit: boolean }>({ row: null, edit: false });

    const fetchData = () => dispatch(getCollection(getPostHistorySel({ type: filters.type, publishtatus: filters.publishtatus, status: publishType, datestart: dateRangeCreateDate.startDate, dateend: dateRangeCreateDate.endDate })));

    useEffect(() => {
        fetchData();
        setfirstCall(false);

        dispatch(setMemoryTable({
            id: IDPUBLISHEDHISTORY
        }))

        return () => {
            dispatch(resetAllMain());
            dispatch(cleanMemoryTable());
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
            accessor: 'texttitle',
            width: 500,
            isComponent: true,
            NoFilter: true,
            Cell: (props: any) => {
                const { texttitle, communicationchanneldesc, medialink, communicationchanneltype } = props.cell.row.original;
                return (
                    <div style={{ display: "flex", gap: 5 }}>
                        <div>
                            {(!!medialink?.[0]?.thumbnail) ?
                                <img loading='eager' alt="" width={60} height={60} src={medialink?.[0]?.thumbnail || ""}></img>
                                :
                                <img loading='eager' alt="" width={60} height={60} src="https://via.placeholder.com/150"></img>
                            }
                            <div style={{ position: "absolute", top: 48, left: 138 }}>
                                <Avatar variant="rounded" style={{ width: 23, height: 23, backgroundColor: "white" }}><GetIconColor channelType={communicationchanneltype} /></Avatar>
                            </div>
                        </div>
                        <div style={{ position: "absolute", left: 180 }}>
                            <div style={{ display: "flex", fontSize: "1em", marginBottom: 1, marginTop: 10 }}>{texttitle}</div>
                            <div style={{ display: "flex", fontSize: "0.8em", gap: 5 }}><Avatar style={{ width: 16, height: 16, backgroundColor: 'black' }} />{communicationchanneldesc}</div>
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
                const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
                return (
                    <div style={{ height: 37, fontSize: "0.9em" }}>
                        {locale ? new Date(publishdate).toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' }) : new Date(publishdate).toDateString()}
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
                    <div style={{ height: 58, textAlign: "center" }}>
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
                    <div style={{ height: 50, textAlign: "center" }}>
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
                    <div style={{ height: 53, textAlign: "center" }}>
                        {Object.keys(reactions || {}).map((x) => {
                            return <div>{x.toLocaleUpperCase()}: {reactions[x]} </div>
                        })}
                    </div>)
            }
        },
        {
            Header: t(langKeys.publishstatus),
            accessor: 'publishstatus',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { publishtatus, publishmessage } = props.cell.row.original;
                return (
                    <div style={{ height: 53, textAlign: "center" }}>
                        {
                            publishtatus ? (
                                publishtatus === 'PUBLISHED' ?
                                    <Tooltip title={publishmessage}>
                                        <p style={{ color: 'green' }}> {t(langKeys.publishedHistory)} </p>
                                    </Tooltip>
                                    :
                                    <Tooltip title={publishmessage}>
                                        <p style={{ color: 'red' }}>{t(langKeys.publishedError)}</p>
                                    </Tooltip>) : (
                                <Tooltip title={publishmessage}>
                                    <p> {t(langKeys.pending)} </p>
                                </Tooltip>
                            )
                        }
                    </div>
                )
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
            allRequestBody.push(postHistoryIns({ ...x, medialink: JSON.stringify(x.medialink), status: "DELETED", operation: "UPDATE" }));
        });
        setWaitDelete(true);
        dispatch(showBackdrop(true));
        dispatch(getMultiCollection(allRequestBody));
    }

    const handleView = (row: Dictionary) => {
        setBetweenViews("bet-2");
        let temparraybread = getArrayBread(t('postcreator_posthistory'), t(langKeys.postcreator_title))
        setArrayBread([...temparraybread, { id: "bet-2", name: t(langKeys.postcreator_posthistorydetail) }])
        setRowSelected({ row: row, edit: false });
    }

    if (betweenViews === "bet-1") {
        return (
            <div style={{ height: '100%', width: 'inherit' }}>
                <TableZyx
                    cleanSelection={cleanSelected}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={false}
                    heightWithCheck={84}
                    initialSelectedRows={selectedRows}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleView}
                    register={false}
                    selectionKey={selectionKey}
                    setCleanSelection={setCleanSelected}
                    setSelectedRows={setSelectedRows}
                    useSelection={true}
                    checkHistoryCenter={true}
                    ButtonsElement={() => (
                        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: 10 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <FieldSelect
                                    data={[
                                        { description: t(langKeys.posthistory_post), value: "POST" },
                                        { description: t(langKeys.posthistory_story), value: "STORY" },
                                    ]}
                                    label={t(langKeys.posthistory_posttype)}
                                    loading={false}
                                    onChange={(value) => { setfilters({ ...filters, type: value?.value || "" }) }}
                                    optionDesc="value"
                                    optionValue="value"
                                    size="small"
                                    style={{ maxWidth: 300, minWidth: 200 }}
                                    valueDefault={filters.type}
                                    variant="outlined"
                                />
                                <FieldSelect
                                    data={[
                                        { description: t(langKeys.posthistory_published), value: "PUBLISHED" },
                                        { description: t(langKeys.posthistory_error), value: "ERROR" },
                                    ]}
                                    label={t(langKeys.posthistory_publishstatus)}
                                    loading={false}
                                    onChange={(value) => { setfilters({ ...filters, publishtatus: value?.value || "" }) }}
                                    optionDesc="value"
                                    optionValue="value"
                                    size="small"
                                    style={{ maxWidth: 300, minWidth: 200 }}
                                    valueDefault={filters.publishtatus}
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
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { fetchData() }}
                                    startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                    style={{ backgroundColor: "#55BD84" }}
                                >{t(langKeys.refresh)}
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
                    pageSizeDefault={IDPUBLISHEDHISTORY === memoryTable.id ? memoryTable.pageSize === -1 ? 5 : memoryTable.pageSize : 5}
                    initialPageIndex={IDPUBLISHEDHISTORY === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDPUBLISHEDHISTORY === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                />
            </div>
        )
    }
    else {
        return (
            <EditHistoryPost
                data={rowSelected}
                setViewSelected={setBetweenViews}
                fetchData={fetchData}
            />
        )
    }
}

export default PostCreatorHistory;