/* eslint-disable react-hooks/exhaustive-deps */
import CalendarPostHistory from 'components/fields/CalendarPostHistory';
import EditHistoryPost from './EditHistoryPost';
import React, { FC, useEffect, useState } from "react";
import SchedulePostHistory from 'components/fields/SchedulePostHistory';

import { AntTab, FieldSelect, TemplateBreadcrumbs } from 'components';
import { Button, Tabs } from "@material-ui/core";
import { Dictionary } from '@types';
import { getChannelsByOrg, getPostHistorySel } from "common/helpers/requestBodies";
import { getCollection, getMultiCollection, resetAllMain } from 'store/main/actions';
import { getDateToday } from 'common/helpers';
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Range } from 'react-date-range';
import { Refresh as RefreshIcon } from '@material-ui/icons';
import { showBackdrop } from 'store/popus/actions';
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

const PostCreatorCalendar: FC<{ setViewSelected: (id: string) => void }> = ({ setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.main.mainData);

    const classes = useStyles();

    const [dataPublication, setDataPublication] = useState<Dictionary[]>([]);
    const [filters, setfilters] = useState<any>({ type: "", status: "", publishtatus: "", communicationchannelid: 0 });
    const [dataselected, setdataselected] = useState<any>({ row: "", edit: true });
    const [firstCall, setfirstCall] = useState(true);
    const [pageSelected, setPageSelected] = useState(0);
    const [betweenViews, setBetweenViews] = useState("bet-1");
    const multiResult = useSelector(state => state.main.multiData);
    const [arrayBread, setArrayBread] = useState<any>(getArrayBread(t('postcreator_calendar'), t(langKeys.postcreator_title)));
    const [dateRange, setDateRange] = useState<Range>({
        startDate: getDateToday(),
        endDate: new Date(new Date().setDate(getDateToday().getDate() + 7)),
        key: 'selection',
    });
    const handleSelectedString = (key: string) => {
        if (key.includes("view")) {
            setViewSelected(key);
        } else if (key === "bet-1") {
            setArrayBread(getArrayBread(t('postcreator_calendar'), t(langKeys.postcreator_title)));
            setdataselected({ row: "", edit: true })
            setBetweenViews(key)
        } else {
            let temparraybread = getArrayBread(t('postcreator_calendar'), t(langKeys.postcreator_title))
            setArrayBread([...temparraybread, { id: "bet-2", name: t(langKeys.postcreator_posthistorydetail) }])
            setBetweenViews(key)
        }
    }
    const [waitLoad, setWaitLoad] = useState(false);

    const fetchData = () => {
        dispatch(getCollection(getPostHistorySel({ communicationchannelid: filters.communicationchannelid, type: filters.type, status: filters.status, publishtatus: filters.publishtatus, datestart: null, dateend: null })));
        dispatch(showBackdrop(true));
        setWaitLoad(true);
    }

    useEffect(() => {
        if (betweenViews === "bet-1") {
            setArrayBread(getArrayBread(t('postcreator_calendar'), t(langKeys.postcreator_title)));
        }
    }, [betweenViews]);

    useEffect(() => {
        fetchData();
        setfirstCall(false);
        dispatch(getMultiCollection([
            getChannelsByOrg(),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.loading && !firstCall) {
            fetchData();
        }
    }, [filters]);

    useEffect(() => {
        if (waitLoad) {
            if (!mainResult.loading && !mainResult.error) {
                dispatch(showBackdrop(false));
                setDataPublication(mainResult.data || []);
            } else if (mainResult.error) {
                dispatch(showBackdrop(false));
            }
        }
    }, [mainResult, waitLoad])

    return (
        <React.Fragment>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={handleSelectedString}
            />
            {betweenViews === "bet-1" &&
                <div style={{ width: '100%' }}>
                    <Tabs
                        indicatorColor="primary"
                        onChange={(_, value) => setPageSelected(value)}
                        style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                        textColor="primary"
                        value={pageSelected}
                        variant="fullWidth"
                    >
                        <AntTab label={t(langKeys.postcreatorcalendar_monthly)} />
                        <AntTab label={t(langKeys.postcreatorcalendar_weekly)} />
                    </Tabs>
                    <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <FieldSelect
                                data={[
                                    { description: t(langKeys.posthistory_post), value: "POST" },
                                    { description: t(langKeys.posthistory_story), value: "STORY" },
                                ]}
                                label={t(langKeys.posthistory_posttype)}
                                loading={false}
                                onChange={(value) => { setfilters({ ...filters, type: value?.value || "" }) }}
                                optionDesc="description"
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
                            <FieldSelect
                                data={multiResult?.data?.[0]?.data || []}
                                label={t(langKeys.channel)}
                                loading={multiResult.loading}
                                onChange={(value) => { setfilters({ ...filters, communicationchannelid: value?.communicationchannelid || 0 }) }}
                                optionDesc="description"
                                optionValue="communicationchannelid"
                                size="small"
                                style={{ maxWidth: 300, minWidth: 200 }}
                                valueDefault={filters.communicationchannelid}
                                variant="outlined"
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => { fetchData() }}
                                startIcon={<RefreshIcon style={{ color: 'white' }} />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.refresh)}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                onClick={() => { setViewSelected("postcreator_publish") }}
                                style={{ backgroundColor: "#8b1bb2", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                variant="contained"
                            >
                                {t(langKeys.postcreator_publish)}
                            </Button>
                            <Button
                                className={classes.button}
                                color="primary"
                                onClick={() => { setViewSelected("postcreator_posthistory") }}
                                style={{ backgroundColor: "#8b1bb2", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                variant="contained"
                            >
                                {t(langKeys.postcreator_posthistory)}
                            </Button>

                        </div>
                    </div>
                    {pageSelected === 0 &&
                        <div style={{ marginTop: 4 }}>
                            <div style={{ width: "100%" }}>
                                <SchedulePostHistory
                                    data={dataPublication}
                                    notPreviousDays={true}
                                    setViewSelected={handleSelectedString}
                                    setDataSelected={setdataselected}
                                />
                            </div>
                        </div>
                    }
                    {pageSelected === 1 &&
                        <div style={{ marginTop: 4 }}>
                            <div style={{ width: "100%" }}>
                                <CalendarPostHistory
                                    data={dataPublication}
                                    date={dateRange.startDate!!}
                                    setDateRange={setDateRange}
                                    setViewSelected={handleSelectedString}
                                    setDataSelected={setdataselected}
                                />
                            </div>
                        </div>
                    }
                </div>
            }
            {betweenViews === "bet-2" &&
                <EditHistoryPost
                    data={dataselected}
                    setViewSelected={setBetweenViews}
                    fetchData={fetchData}
                />
            }
        </React.Fragment>
    )
}

export default PostCreatorCalendar;