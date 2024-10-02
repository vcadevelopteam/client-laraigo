/* eslint-disable react-hooks/exhaustive-deps */
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { Button, makeStyles } from "@material-ui/core";
import { calculateDateFromWeek, dayNames2, timetomin } from "common/helpers";
import { Dictionary } from "@types";
import { FacebookColor, InstagramColor, LinkedInColor, TikTokColor, TwitterColor, YouTubeColor } from "icons";
import { FC, useCallback, useEffect, useState } from "react";
import { getFormattedDate } from "common/helpers";
import { langKeys } from 'lang/keys';
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
    button: {
        fontSize: '14px',
        fontWeight: 500,
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
    },
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
        width: '1100px',
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
        width: '100%',
        wordBreak: "break-word",
        zIndex: 2,
    }
}));

const PostHistoryTime: FC<{ item: Dictionary; hourData: HourDayProp, handleClick: (event: any) => void; index: number; totalEvents: number }> = ({ item, hourData, handleClick, index, totalEvents }) => {
    const classes = useScheduleStyles();

    return (
        <div
            className={classes.itemBooking}
            style={{
                backgroundColor: item.publishtatus === "ERROR" ? "#F12601" : (item.type === "POST" ? "#FFDC73" : "#BAFFC9"),
                color: item.publishtatus === "ERROR" ? "#FFFFFF" : "#000000",
                height: `${item.totalTime}%`,
                position: "absolute",
                top: `${item.initTime}%`,
                width: `${100 / totalEvents}%`,
                left: `${(index * 100) / totalEvents}%`,
                zIndex: 2
            }}
            title={item.texttitle}
            onClick={() => handleClick(hourData)}
        >
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flex: 'flex: 0 1 100%', width: '100%' }}>
                    <b style={{ marginRight: '4px' }}>{new Date(item.publishdate).toLocaleTimeString()?.slice(0, 5)}</b>{item.texttitle}
                </div>
                <div style={{ display: 'flex', flex: 'flex: 0 1 100%', width: '100%', justifyContent: 'right' }}>
                    {item.communicationchanneltype === 'FBWA' && <FacebookColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'INST' && <InstagramColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'LNKD' && <LinkedInColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'TKTK' && <TikTokColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'TKTA' && <TikTokColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'TWIT' && <TwitterColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                    {item.communicationchanneltype === 'YOUT' && <YouTubeColor style={{ width: '20px', height: '20px', marginRight: '10px' }} />}
                </div>
            </div>
        </div>
    )
}

const BoxDay: FC<{ hourDay: HourDayProp; handleClick: (event: any) => void; }> = ({ hourDay, handleClick }) => {
    const classes = useScheduleStyles();

    return (
        <div
            className={classes.boxDay}
            style={{ borderBottom: hourDay.hourstart === 23 ? "none" : "1px solid #e1e1e1", position: "relative" }}
        >
            {hourDay.data?.map((x, index) => (
                <PostHistoryTime
                    handleClick={handleClick}
                    hourData={hourDay}
                    item={x}
                    key={x.posthistoryid}
                    totalEvents={hourDay.data ? hourDay.data.length : 0}
                    index={index}
                />
            )) ?? null}
        </div>
    )
}

const CalendarPostHistory: FC<{ data: Dictionary[], date: Date; setDateRange: (p: any) => void; setViewSelected: (view: string) => void; setDataSelected: (view: any) => void; }> = ({ data, date, setDateRange, setViewSelected, setDataSelected }) => {
    const { t } = useTranslation();

    const classes = useScheduleStyles();

    const [daySelected, setDaySelected] = useState<HourDayProp | undefined>(undefined);
    const [daysToShow, setDaysToShow] = useState<HourDayProp[]>([]);
    const [rangeDates, setRangeDates] = useState<DayProp[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const updateDateRange = (newStartDate: Date) => {
        const newRangeDates = calculateDateFromWeek(newStartDate) as DayProp[];
        setRangeDates(newRangeDates);
    }

    const updateDateData = (data: Dictionary[]) => {
        const dayData = rangeDates.reduce((acc: HourDayProp[], item: DayProp) => ([
            ...acc,
            ...Array.from(Array(24).keys()).map(x => ({
                ...item,
                hourstart: x,
                hourend: x + 1,
                data: data?.filter(y => getFormattedDate(new Date(y.publishdate)) === item.dateString && parseInt(new Date(y.publishdate).toLocaleTimeString().split(":")[0]) === x)
                    .map(y => ({
                        ...y,
                        totalTime: (timetomin(new Date(new Date(y.publishdate).setMinutes(new Date(y.publishdate).getMinutes() + 76)).toLocaleTimeString()) - timetomin(new Date(y.publishdate).toLocaleTimeString())) * 100 / 60,
                        initTime: (parseInt(new Date(y.publishdate).toLocaleTimeString().split(":")[1])) * 100 / 60,
                    }))
            }))
        ]), [])
        setDaysToShow(dayData);
    }

    useEffect(() => {
        updateDateRange(date);
        updateDateData(data);
    }, [])

    useEffect(() => {
        if (data) {
            updateDateData(data);
        }
    }, [data])

    useEffect(() => {
        if (data) {
            updateDateData(data);
        }
    }, [rangeDates])

    const handleChangeWeek = useCallback((manage: number) => {
        const previewDate = new Date(rangeDates[0].date);
        updateDateRange(new Date(previewDate.setDate(previewDate.getDate() + 1 + manage * 7)));
    }, [rangeDates])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
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
                                    setDateRange({
                                        startDate: rangeDates[0].date,
                                        endDate: rangeDates[1].date,
                                        key: 'selection',
                                    })
                                    setCurrentIndex(index);
                                    setDaySelected(e);
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ border: '1px solid #e0e0e0', backgroundColor: '#FFFFFF', marginLeft: '6px', width: '100%' }}>
                {daySelected && <div>
                    <div className={classes.containerInfo}>
                        <div>
                            <div className={classes.containerInfoTitle}>
                                {daySelected.dateString}
                            </div>
                        </div>
                        <div className={classes.containerButtons}>
                            <div className={classes.buttonMonth} onClick={() => {
                                if (daysToShow[currentIndex - 1]) {
                                    setDaySelected(daysToShow[currentIndex - 1]);
                                    setCurrentIndex(currentIndex - 1);
                                }
                            }}>
                                <NavigateBeforeIcon />
                            </div>
                            <div className={classes.buttonMonth} style={{ borderLeft: '1px solid #e0e0e0' }} onClick={() => {
                                if (daysToShow[currentIndex - 1]) {
                                    setDaySelected(daysToShow[currentIndex + 1]);
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }}>
                                <NavigateNextIcon />
                            </div>
                        </div>
                    </div>
                    <div style={{ overflowY: 'scroll', minWidth: 300, height: 700 }}>
                        {daySelected.data?.map((postdata) => (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', overflow: 'auto', margin: '16px', border: '1px solid #762AA9', borderRadius: '8px' }}>
                                <div style={{ maxWidth: '50%', flex: '1 1 50%', wordBreak: 'break-word', padding: '10px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flexStart' }}>
                                        <b style={{ marginRight: '6px' }}>{new Date(postdata.publishdate).toLocaleTimeString()?.slice(0, 5)}</b>
                                        {postdata.communicationchanneltype === 'FBWA' && <FacebookColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'INST' && <InstagramColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'LNKD' && <LinkedInColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'TKTK' && <TikTokColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'TKTA' && <TikTokColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'TWIT' && <TwitterColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'YOUT' && <YouTubeColor style={{ width: '22px', height: '22px' }} />}
                                    </div>
                                    <h3 style={{ marginBottom: '2px' }}>{postdata.texttitle}</h3>
                                    <h4 style={{ marginTop: '2px' }}>{postdata.textbody}</h4>
                                    {postdata.publishtatus === "PUBLISHED" && <b style={{ color: 'green' }}>{t(langKeys.posthistory_published)}</b>}
                                    {postdata.publishtatus === "ERROR" && <b style={{ color: 'red' }}>{t(langKeys.posthistory_error)}</b>}
                                    <Button
                                        className={classes.button}
                                        color="primary"
                                        onClick={() => { setDataSelected({ row: postdata, edit: true }); setViewSelected("bet-2") }}
                                        style={{ backgroundColor: "#8b1bb2", display: 'flex', alignItems: 'center', margin: '10px', width: 'auto' }}
                                        variant="contained"
                                    >
                                        {t(langKeys.posthistory_seedetail)}
                                    </Button>
                                </div>
                                {postdata.medialink?.[0]?.thumbnail && <img loading='eager' alt="" style={{ maxWidth: '50%', flex: '1 1 50%', wordBreak: 'break-word' }} src={postdata.medialink?.[0]?.thumbnail || ""}></img>}
                            </div>
                        ))}
                    </div>
                </div>}
                {!daySelected && <div>
                    <h3 style={{ margin: '8px', color: '#762AA9' }}>{t(langKeys.posthistorycalendar_selectitem)}</h3>
                </div>}
            </div>
        </div>
    )
}

export default CalendarPostHistory;