import { makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import React, { FC, useCallback, useEffect, useState } from "react";
import { Dictionary } from "@types";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { calculateDateFromWeek, dayNames2, selBookingCalendar } from "common/helpers";
import { useDispatch } from "react-redux";
import { getCollectionAux } from "store/main/actions";
import { useSelector } from "hooks";

interface HourDayProp {
    date: Date;
    dateString: string;
    dow: number;
    dom: number;
    isCurrent?: boolean;
    hourstart: number;
    hourend: number;
    type: string;
    data?: Dictionary[]
}
interface DayProp {
    date: Date;
    dateString: string;
    dow: number;
    dom: number;
    isToday?: boolean;
    type: string;
}

const hour24: number[] = Array.from(Array(24).keys())

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        height: 40,
        position: "relative",
        borderBottom: '1px solid #e0e0e0',
        fontSize: 12, color: "white",
        '&:after': {
            content: '""',
            height: "100%",
            width: 1,
            position: "absolute",
            left: 0,
            bottom: 0,
            backgroundColor: "#e1e1e1",
        },
    },
    boxDayHover: {
        cursor: 'pointer',
        '&:hover': {
            padding: 6,
            backgroundColor: '#eef5ff',
            border: '2px solid #5593ff'
        }
    },
    boxDayForbidden: {
        backgroundColor: '#dbdbdb3d',
        '& > div': {
            color: '#767676'
        }
    },
    isToday: {
        fontWeight: 'bold',
        backgroundColor: '#e1e1e1',
        textAlign: 'center',
        borderRadius: '50%',
    },
    dow: {
        fontWeight: 'bold',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
    },
    container: {
        minWidth: '1100px',
        maxWidth: "100%",
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        backgroundColor: '#fff',
        display: "flex",
        flexDirection: "column"
    },
    wrapper: {
        display: 'grid',
        gridTemplateRows: 'repeat(24, 1fr)',
        gridTemplateColumns: '50px repeat(7, 1fr)',
        gridAutoFlow: 'column',
        borderTop: '1px solid #e0e0e0',
    },
    wrapperDays: {
        display: 'grid',
        gridTemplateColumns: '50px repeat(7, 1fr)',
    },
    dowHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#767676',
        padding: '12px 0',
        fontSize: 16,
        position: "relative",
        textTransform: 'uppercase',
        '&:before': {
            content: '""',
            height: "40%",
            width: 1,
            position: "absolute",
            left: 0,
            bottom: 0,
            backgroundColor: "#e1e1e1",
        },
    },
    dowHeader2: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#767676',
        padding: '12px 0',
        fontSize: 16,
        position: "relative",
        textTransform: 'uppercase',
    },
    containerInfo: {
        // border: '1px solid #e0e0e0',
        borderBottom: "none",
        padding: theme.spacing(1),
        display: 'grid',
        gridTemplateColumns: '1fr 120px',
    },
    containerInfoTitle: {
        fontWeight: 'bold',
        fontSize: 22,
    },
    containerButtons: {
        borderRadius: 10,
        border: '1px solid #e0e0e0',
        display: 'flex',
        height: 40,
        justifySelf: 'center',
        alignSelf: 'center',
        width: '100%'
    },
    buttonMonth: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    timeDate: {
        fontSize: 14,
        display: 'flex',
        fontFamily: 'Calibri',
        justifyContent: 'center'
    },
    centerInput: {
        display: 'flex',
        alignItems: 'center'
    },
    infoBox: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    itemBooking: {
        wordBreak: "break-word",
        overflow: "hidden",
        maxWidth: 135,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        height: 35,
        padding: 4,
        borderRadius: 5,
        cursor: "pointer"
    }
}));

const BoxDay: FC<{
    hourDay: HourDayProp;
    handleClick: (event: any) => void;
}> = ({ hourDay, handleClick }) => {
    const classes = useScheduleStyles();

    return (
        <div
            className={classes.boxDay}
            style={{ borderBottom: hourDay.hourstart === 23 ? "none" : "1px solid #e1e1e1" }}
        >
            {hourDay.data?.map(x => (
                <div
                    key={x.calendarbookinguuid}
                    className={classes.itemBooking}
                    style={{ backgroundColor: x.color || "#e1e1e1" }}
                    title={`${x.name} - ${x.personname}`}
                    onClick={(e: any) => handleClick(x)}
                >{x.personname}</div>
            ))}

        </div>
    )
}

const CalendarWithInfo: FC<{
    calendarEventID: number;
    selectBooking: (p: any) => void;
    booking: Dictionary;
    date: Date;
}> = ({ calendarEventID, selectBooking, date }) => {
    const classes = useScheduleStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dataBooking = useSelector(state => state.main.mainAux);
    const [daysToShow, setDaysToShow] = useState<HourDayProp[]>([]);
    const [rangeDates, setRangeDates] = useState<DayProp[]>([]);

    const fetchData = (newStartDate: Date) => {
        const newRangeDates = calculateDateFromWeek(newStartDate) as DayProp[];
        setRangeDates(newRangeDates)
        dispatch(getCollectionAux(selBookingCalendar(
            newRangeDates[0].dateString,
            newRangeDates[6].dateString || "",
            calendarEventID
        )))
    }

    useEffect(() => {
        fetchData(date)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!dataBooking.loading && !dataBooking.error) {
            setDaysToShow(rangeDates.reduce((acc: HourDayProp[], item: DayProp) => ([
                ...acc,
                ...Array.from(Array(24).keys()).map(x => ({
                    ...item,
                    hourstart: x,
                    hourend: x + 1,
                    data: dataBooking.data.filter(y => y.monthdate === item.dateString && parseInt(y.hourstart.split(":")[0]) === x)
                }))
            ]), []));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataBooking])

    const handleChangeWeek = useCallback((manage: number) => {
        const previewDate = new Date(rangeDates[0].date);
        fetchData(new Date(previewDate.setDate(previewDate.getDate() + 1 + manage * 7)))
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                <div style={{ position: "relative", height: 40 }}>
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
                            handleClick={selectBooking}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CalendarWithInfo;