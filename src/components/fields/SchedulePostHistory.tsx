import clsx from 'clsx';
import EventIcon from '@material-ui/icons/Event';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import RepeatIcon from '@material-ui/icons/Repeat';

import { Button, makeStyles } from "@material-ui/core";
import { calculateDateFromMonth, dayNames, getFormattedDate } from "common/helpers";
import { Dictionary } from "@types";
import { FacebookColor, InstagramColor, LinkedInColor, TikTokColor, TwitterColor, YouTubeColor } from "icons";
import { FC, useCallback, useEffect, useState } from "react";
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';

interface ScheduleInputProps {
    data: Dictionary[];
    notPreviousDays?: boolean;
    setViewSelected: (view: string) => void;
    setDataSelected: (view: any) => void;
}

interface DayInputProps {
    day: DayProp;
    handleClick: (day: DayProp) => void;
    notPreviousDays?: boolean;
}

interface DayProp {
    data: Dictionary[];
    date: Date;
    dateString: string;
    dom: number;
    dow: number;
    isDayPreview?: boolean;
    isToday?: boolean;
    notPreviousDays?: boolean;
    type: string;
}

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        borderBottom: '1px solid #e0e0e0',
        borderRight: '1px solid #e0e0e0',
        height: 130,
        padding: 8,
    },
    boxDayHover: {
        '&:hover': {
            backgroundColor: '#E4E1E8',
            border: '2px solid #762AA9',
            padding: 6,
        },
        cursor: 'pointer',
    },
    boxDayForbidden: {
        '& > div': {
            color: '#767676'
        },
        '&:hover': {
            backgroundColor: '#E4E1E8',
            border: '2px solid #762AA9',
            padding: 6,
        },
        backgroundColor: '#dbdbdb3d',
        cursor: 'pointer',
    },
    button: {
        fontSize: '14px',
        fontWeight: 500,
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
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
        width: '910px',
        minWidth: '910px',
    },
    wrapper: {
        borderLeft: '1px solid #e0e0e0',
        borderTop: '1px solid #e0e0e0',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
    },
    wrapperDays: {
        borderLeft: '1px solid #e0e0e0',
        borderRight: '1px solid #e0e0e0',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
    },
    dowHeader: {
        color: '#767676',
        fontSize: 16,
        fontWeight: 'bold',
        padding: '12px 0',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    containerInfo: {
        border: '1px solid #e0e0e0',
        display: 'grid',
        gridTemplateColumns: '1fr 120px',
        padding: theme.spacing(3),
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
        width: '100%',
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
        justifyContent: 'center'
    },
    infoBox: {
        display: 'flex',
        justifyContent: 'space-between',
    }
}));

const BoxDay: FC<DayInputProps> = ({ day, notPreviousDays, handleClick }) => {
    const { t } = useTranslation();

    const classes = useScheduleStyles();

    const [isAvailable, setIsAvailable] = useState(true);
    const [more3Items, setMore3Items] = useState(false);

    useEffect(() => {
        const isAvailable = !day.data?.some(x => x.status === "unavailable");
        setMore3Items(day?.data?.length > 3)
        setIsAvailable(isAvailable);
    }, [day.data])

    return (
        <div
            onClick={(e: any) => handleClick(day)}
            className={clsx(classes.boxDay, {
                [classes.boxDayHover]: !day.isDayPreview,
                [classes.boxDayForbidden]: notPreviousDays && day.isDayPreview,
            })}
        >
            <div className={classes.infoBox}>
                <div className={clsx(classes.dow, {
                    [classes.isToday]: day.isToday
                })}>
                    {day.dom}
                </div>
                <div>
                    {day.type === "personalized" && (
                        <EventIcon style={{ width: 16 }} color="action" />
                    )}
                    {day.type === "repeat" && (
                        <RepeatIcon style={{ width: 16 }} color="action" />
                    )}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!isAvailable && (
                    <div>{t(langKeys.unavailable)}</div>
                )}
                {isAvailable && day?.data?.slice(0, 3).map((item, index) => (
                    <>
                        <div key={index} className={classes.timeDate}>
                            {item.communicationchanneltype === 'FBWA' && <FacebookColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {item.communicationchanneltype === 'INST' && <InstagramColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {item.communicationchanneltype === 'LNKD' && <LinkedInColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {item.communicationchanneltype === 'TKTK' && <TikTokColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {item.communicationchanneltype === 'TWIT' && <TwitterColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {item.communicationchanneltype === 'YOUT' && <YouTubeColor style={{ width: '18px', height: '18px', marginRight: '3px' }} />}
                            {new Date(item.publishdate).toLocaleTimeString()?.slice(0, 5)}
                            <b style={{ marginLeft: '3px', backgroundColor: item.publishtatus === "ERROR" ? "#F12601" : (item.type === "POST" ? "#FFDC73" : "#BAFFC9"), borderRadius: '4px' }}>{item.type}</b>
                        </div>
                    </>
                ))}
                {isAvailable && more3Items && (
                    <div style={{ fontWeight: 'bold' }}>{day.data.length - 3} {t(langKeys.more_items)}</div>
                )}
            </div>
        </div>
    )
}

const makeData = (year: number, month: number, schedule: Dictionary[]) => {
    return calculateDateFromMonth(year, month).map(x => ({
        ...x,
        ...(() => {
            const isPersonalized = schedule?.some(y => getFormattedDate(new Date(y.publishdate)) === x.dateString);
            const dataRepeatDay = isPersonalized ? [] : schedule?.filter(y => new Date(y.publishdate).getDay() === x.dow && !y.publishdate);
            const data = isPersonalized ? schedule?.filter(y => getFormattedDate(new Date(y.publishdate)) === x.dateString) : dataRepeatDay;
            return {
                data,
                type: isPersonalized ? 'personalized' : dataRepeatDay?.length ? 'repeat' : 'none'
            };
        })()
    }));
}

const SchedulePostHistory: FC<ScheduleInputProps> = ({ notPreviousDays = true, data, setViewSelected, setDataSelected }) => {

    const { t } = useTranslation();

    const classes = useScheduleStyles();

    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({ month: new Date().getMonth(), year: new Date().getFullYear() });
    const [dates, setDates] = useState<Dictionary[]>([]);
    const [daySelected, setDaySelected] = useState<DayProp | undefined>(undefined);
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (day: DayProp) => {
        setDaySelected(day);
    };

    useEffect(() => {
        setDates(data);
        setDaysToShow(makeData(dateCurrent.year, dateCurrent.month, data));
    }, [dateCurrent, data])

    const handleChangeMonth = useCallback((manageMonth: number) => {
        const newdate = new Date(new Date(dateCurrent.year, dateCurrent.month).setMonth(dateCurrent.month + manageMonth));
        const newyear = newdate.getFullYear();
        const newmonth = newdate.getMonth();

        setDateCurrent({ year: newyear, month: newmonth });
    }, [dateCurrent])

    return (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <div className={classes.container}>
                <div className={classes.containerInfo}>
                    <div>
                        <div className={classes.containerInfoTitle}>
                            {t((langKeys as Dictionary)[`month_${("" + (dateCurrent.month + 1)).padStart(2, "0")}`])} {dateCurrent.year}
                        </div>
                    </div>
                    <div className={classes.containerButtons}>
                        <div className={classes.buttonMonth} onClick={() => handleChangeMonth(-1)}>
                            <NavigateBeforeIcon />
                        </div>
                        <div className={classes.buttonMonth} style={{ borderLeft: '1px solid #e0e0e0' }} onClick={() => handleChangeMonth(1)}>
                            <NavigateNextIcon />
                        </div>
                    </div>
                </div>
                <div className={classes.wrapperDays}>
                    {dayNames.map((day, index) => (
                        <div key={index} className={classes.dowHeader}>
                            {(t((langKeys as Dictionary)[day])).substring(0, 3)}
                        </div>
                    ))}
                </div>
                <div className={classes.wrapper}>
                    {daysToShow.map((day, index) => (
                        <BoxDay
                            key={index}
                            day={day}
                            handleClick={() => { handleClick(day); setCurrentIndex(index); }}
                            notPreviousDays={notPreviousDays}
                        />
                    ))}
                </div>
            </div>
            <div style={{ border: '1px solid #e0e0e0', backgroundColor: '#FFFFFF', marginLeft: '6px', width: '100%' }}>
                {daySelected && <div>
                    <div className={classes.containerInfo} style={{ minWidth: 300, }}>
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
                                        {postdata.communicationchanneltype === 'TWIT' && <TwitterColor style={{ width: '22px', height: '22px' }} />}
                                        {postdata.communicationchanneltype === 'YOUT' && <YouTubeColor style={{ width: '22px', height: '22px' }} />}
                                    </div>
                                    <h3 style={{ marginBottom: '2px' }}>{postdata.texttitle}</h3>
                                    <h4 style={{ marginTop: '2px' }}>{postdata.textbody}</h4>
                                    {postdata.publishtatus == "PUBLISHED" && <b style={{ color: 'green' }}>{t(langKeys.posthistory_published)}</b>}
                                    {postdata.publishtatus == "ERROR" && <b style={{ color: 'red' }}>{t(langKeys.posthistory_error)}</b>}
                                    <Button
                                        className={classes.button}
                                        color="primary"
                                        onClick={() => { setDataSelected({ row: postdata, edit: true }); setViewSelected("bet-2") }}
                                        style={{ backgroundColor: "#8b1bb2", display: 'flex', alignItems: 'center', margin: '10px', width: '100%' }}
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
                    <h3 style={{ margin: '8px', color: '#762AA9' }}>{t(langKeys.posthistorycalendar_selectdate)}</h3>
                </div>}
            </div>
        </div >
    )
}

export default SchedulePostHistory;