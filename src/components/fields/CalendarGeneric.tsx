import React, { FC, useCallback, useEffect, useState } from "react";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { calculateDateFromWeek, dayNames2, selBookingCalendar, timetomin } from "common/helpers";
import { Dictionary } from "@types";
import { getCollectionAux } from "store/main/actions";
import { langKeys } from 'lang/keys';
import { makeStyles } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useTranslation } from 'react-i18next';

interface HourDayProp {
    data?: Dictionary[]
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
    hourend: number;
    hourstart: number;
    isCurrent?: boolean;
    type: string;
}

interface DayProp {
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
    isToday?: boolean;
    type: string;
}

const hour24: number[] = Array.from(Array(24).keys())

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        '&:after': {
            content: '""',
            height: "100%",
            width: 1,
            position: "absolute",
            left: 0,
            bottom: 0,
            backgroundColor: "#e1e1e1",
        },
        borderBottom: '1px solid #e0e0e0',
        color: "white",
        fontSize: 12,
        height: 41,
        position: "relative",
    },
    boxDayHover: {
        '&:hover': {
            padding: 6,
            backgroundColor: '#eef5ff',
            border: '2px solid #5593ff'
        },
        cursor: 'pointer',
    },
    boxDayForbidden: {
        '& > div': {
            color: '#767676'
        },
        backgroundColor: '#dbdbdb3d',
    },
    isToday: {
        backgroundColor: '#e1e1e1',
        borderRadius: '50%',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dow: {
        alignItems: 'center',
        display: 'flex',
        fontSize: 13,
        fontWeight: 'bold',
        height: 24,
        justifyContent: 'center',
        width: 24,
    },
    container: {
        backgroundColor: '#fff',
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        minWidth: '1100px',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    wrapper: {
        borderTop: '1px solid #e0e0e0',
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '50px repeat(7, 1fr)',
        gridTemplateRows: 'repeat(24, 1fr)',
    },
    wrapperDays: {
        display: 'grid',
        gridTemplateColumns: '50px repeat(7, 1fr)',
    },
    dowHeader: {
        '&:before': {
            content: '""',
            height: "40%",
            width: 1,
            position: "absolute",
            left: 0,
            bottom: 0,
            backgroundColor: "#e1e1e1",
        },
        color: '#767676',
        fontSize: 16,
        fontWeight: 'bold',
        padding: '12px 0',
        position: "relative",
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    dowHeader2: {
        color: '#767676',
        fontSize: 16,
        fontWeight: 'bold',
        padding: '12px 0',
        position: "relative",
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    containerInfo: {
        borderBottom: "none",
        display: 'grid',
        gridTemplateColumns: '1fr 120px',
        padding: theme.spacing(1),
    },
    containerInfoTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    containerButtons: {
        alignSelf: 'center',
        border: '1px solid #e0e0e0',
        borderRadius: 10,
        display: 'flex',
        height: 40,
        justifySelf: 'center',
        width: '100%'
    },
    buttonMonth: {
        alignItems: 'center',
        cursor: 'pointer',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
    },
    timeDate: {
        display: 'flex',
        fontFamily: 'Calibri',
        fontSize: 14,
        justifyContent: 'center',
    },
    centerInput: {
        alignItems: 'center',
        display: 'flex',
    },
    infoBox: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    itemBooking: {
        borderBottom: "2px solid white",
        borderLeft: "1px solid white",
        borderRadius: 4,
        cursor: "pointer",
        fontWeight: "bold",
        overflow: "hidden",
        paddingLeft: 8,
        paddingTop: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: 135,
        wordBreak: "break-word",
        zIndex: 2,
    }
}));

const BookingTime: FC<{ item: Dictionary; handleClick: (event: any) => void; }> = ({ item, handleClick }) => {
    const classes = useScheduleStyles();

    return (
        <div
            className={classes.itemBooking}
            style={{
                backgroundColor: item.color || "#e1e1e1",
                height: `${item.totalTime}%`,
                position: "absolute",
                top: `${item.initTime}%`
            }}
            title={`${item.name} - ${item.personname}`}
            onClick={() => handleClick(item)}
        >{item.personname}</div>
    )
}

const BoxDay: FC<{ hourDay: HourDayProp; handleClick: (event: any) => void; }> = ({ hourDay, handleClick }) => {
    const classes = useScheduleStyles();

    return (
        <div
            className={classes.boxDay}
            style={{ borderBottom: hourDay.hourstart === 23 ? "none" : "1px solid #e1e1e1", position: "relative" }}
        >
            {hourDay.data?.map(x => (
                <BookingTime
                    handleClick={handleClick}
                    item={x}
                    key={x.calendarbookinguuid}
                />
            ))}
        </div>
    )
}

const CalendarGeneric: FC<{ calendarEventID: number; selectBooking: (p: any) => void; booking: Dictionary; date: Date; setDateRange: (p: any) => void }> = ({ calendarEventID, selectBooking, date, setDateRange }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const dataBooking = useSelector(state => state.main.mainAux);
    const classes = useScheduleStyles();

    const [daysToShow, setDaysToShow] = useState<HourDayProp[]>([]);
    const [rangeDates, setRangeDates] = useState<DayProp[]>([]);

    const fetchData = (newStartDate: Date) => {
        const newRangeDates = calculateDateFromWeek(newStartDate) as DayProp[];
        dispatch(getCollectionAux(selBookingCalendar(
            newRangeDates[0].dateString,
            newRangeDates[6].dateString || "",
            calendarEventID,
        )))
        setRangeDates(newRangeDates);
    }

    useEffect(() => {
        fetchData(date);
    }, [])

    useEffect(() => {
        if (!dataBooking.loading && !dataBooking.error) {
            const aa = rangeDates.reduce((acc: HourDayProp[], item: DayProp) => ([
                ...acc,
                ...Array.from(Array(24).keys()).map(x => ({
                    ...item,
                    hourstart: x,
                    hourend: x + 1,
                    data: dataBooking
                        .data.filter(y => y.monthdate === item.dateString && parseInt(y.hourstart.split(":")[0]) === x)
                        .map(y => ({
                            ...y,
                            totalTime: (timetomin(y.hourend) - timetomin(y.hourstart)) * 100 / 60,
                            initTime: (parseInt(y.hourstart.split(":")[1])) * 100 / 60,
                        }))
                }))
            ]), [])
            setDaysToShow(aa);
        }
    }, [dataBooking])

    const handleChangeWeek = useCallback((manage: number) => {
        const previewDate = new Date(rangeDates[0].date);
        fetchData(new Date(previewDate.setDate(previewDate.getDate() + 1 + manage * 7)));
    }, [rangeDates])

    return (
        <div className={classes.container}>
            <div className={classes.containerInfo}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className={classes.containerInfoTitle}>
                        {t((langKeys as Dictionary)[`month_${("" + (rangeDates[0]?.date.getMonth() + 1)).padStart(2, "0")}`])} {rangeDates[0]?.date.getFullYear()}
                    </div>
                </div>
                <div className={classes.containerButtons}>
                    <div
                        className={classes.buttonMonth}
                        onClick={() => handleChangeWeek(-1)}
                    >
                        <NavigateBeforeIcon />
                    </div>
                    <div
                        className={classes.buttonMonth}
                        style={{ borderLeft: '1px solid #e0e0e0' }}
                        onClick={() => handleChangeWeek(1)}
                    >
                        <NavigateNextIcon />
                    </div>
                </div>
            </div>
            <div className={classes.wrapperDays} style={{ flex: 1 }}>
                <div className={classes.dowHeader2}></div>
                {dayNames2.map((day, index) => (
                    <div key={index} className={classes.dowHeader}>
                        <div>{(t((langKeys as Dictionary)[day])).substring(0, 3)}</div>
                        <div>
                            {rangeDates[index]?.dom}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", overflowY: "auto", marginRight: -8, height: 500 }}>
                <div className={classes.wrapper} style={{ flex: 1 }}>
                    {hour24.map((x) => {
                        if (x === 0)
                            return <div key={x}></div>
                        return (
                            <div key={x}>
                                <div style={{ position: "relative", height: 41 }}>
                                    <div style={{ position: "absolute", top: -1, right: 0 }}>
                                        <div style={{ width: 10, height: 1, backgroundColor: "#e1e1e1" }}></div>
                                    </div>
                                    <div style={{ position: "absolute", top: -7, left: 6, fontSize: 10, color: "#878787" }}>
                                        {x.toString().padStart(2, "0")}:00
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {daysToShow.map((day, index) => (
                        <BoxDay
                            key={index}
                            hourDay={day}
                            handleClick={(e) => {
                                selectBooking(e);
                                setDateRange({
                                    startDate: rangeDates[0].date,
                                    endDate: rangeDates[1].date,
                                    key: 'selection',
                                })
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CalendarGeneric;