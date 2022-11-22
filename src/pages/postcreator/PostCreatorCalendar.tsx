/* eslint-disable react-hooks/exhaustive-deps */
import CalendarPostHistory from 'components/fields/CalendarPostHistory';
import SchedulePostHistory from 'components/fields/SchedulePostHistory';
import React, { FC, useEffect, useState } from "react";

import { AntTab } from 'components';
import { Tabs } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { getDateToday } from 'common/helpers';
import { Range } from 'react-date-range';
import { Dictionary } from '@types';
import { getCollection, resetAllMain } from 'store/main/actions';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { getPostHistorySel } from "common/helpers/requestBodies";

const PostCreatorCalendar: FC<{ setViewSelected: (id: string) => void }> = ({ setViewSelected }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.main.mainData);

    const [dataPublication, setDataPublication] = useState<Dictionary[]>([]);
    const [filters, setfilters] = useState<any>({ type: "", status: "" });
    const [firstCall, setfirstCall] = useState(true);
    const [pageSelected, setPageSelected] = useState(0);
    const [dateRange, setDateRange] = useState<Range>({
        startDate: getDateToday(),
        endDate: new Date(new Date().setDate(getDateToday().getDate() + 7)),
        key: 'selection',
    });
    const [waitLoad, setWaitLoad] = useState(false);

    const fetchData = () => {
        dispatch(getCollection(getPostHistorySel({ type: filters.type, status: filters.status, datestart: null, dateend: null })));
        dispatch(showBackdrop(true));
        setWaitLoad(true);
    }

    useEffect(() => {
        fetchData();
        setfirstCall(false);

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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitLoad(false);

                setDataPublication(mainResult.data || []);
            } else if (mainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }));
                dispatch(showBackdrop(false));
                setWaitLoad(false);
            }
        }
    }, [mainResult, waitLoad])

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
                    <AntTab label={t(langKeys.postcreatorcalendar_monthly)} />
                    <AntTab label={t(langKeys.postcreatorcalendar_weekly)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <div style={{ width: "100%" }}>
                            <SchedulePostHistory
                                data={dataPublication}
                                notPreviousDays={true}
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
                            />
                        </div>
                    </div>
                }
            </div>
        </React.Fragment>
    )
}

export default PostCreatorCalendar;