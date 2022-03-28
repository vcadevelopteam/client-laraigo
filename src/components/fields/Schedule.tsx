import { makeStyles } from "@material-ui/core";
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { ArrowDropDown } from "@material-ui/icons";
import React, { FC, useCallback, useEffect, useState } from "react";
import clsx from 'clsx';
import { Dictionary } from "@types";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const calculateMonth = (year: number, month: number) => {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    const countDays = new Date(year, month + 1, 0).getDate();
    const dayLastDay = new Date(year, month + 1, 0).getDay();
    const dayPreviewMonth = new Date(year, month, 1).getDay();

    const daysMonth = Array.from(Array(countDays).keys()).map(x => {
        const date = new Date(year, month, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isToday: currentDate.getTime() === date.getTime(),
            isDayPreview: date < currentDate
        }
    })

    const daysPreviewMonth = Array.from(Array(dayPreviewMonth).keys()).map(x => {
        const date = new Date(year, month, - x);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    }).reverse()

    const daysNextMonth = Array.from(Array(6 - dayLastDay).keys()).map(x => {
        const date = new Date(year, month + 1, x + 1);
        return {
            date: date,
            dateString: date.toISOString().substring(0, 10),
            dow: date.getDay(),
            dom: date.getDate(),
            isDayPreview: date < currentDate
        }
    })

    return [...daysPreviewMonth, ...daysMonth, ...daysNextMonth];
}

const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

const dataExample = [
    { "dow": 0, "status": "available", "start": "09:00", "end": "18:00" },
    { "dow": 1, "status": "available", "start": "07:00", "end": "18:00" },
    { "dow": 2, "status": "available", "start": "09:00", "end": "18:00" },
    { "dow": 3, "status": "available", "start": "09:00", "end": "18:00" },
    { "dow": 4, "status": "unavailable", "start": "", "end": "" },
    { "dow": 5, "status": "available", "start": "08:00", "end": "18:00" },
    { "dow": 6, "status": "available", "start": "09:00", "end": "18:00" },
    { "date": "2022-03-18", "status": "available", "dow": 5, "start": "09:00", "end": "13:00" },
    { "date": "2022-03-18", "status": "available", "dow": 5, "start": "14:00", "end": "18:00" },
    { "date": "2022-03-19", "status": "available", "dow": 6, "start": "09:00", "end": "13:00" },
    { "date": "2022-03-20", "status": "available", "dow": 0, "start": "09:00", "end": "12:00" },
    { "date": "2022-03-21", "status": "available", "dow": 1, "start": "09:00", "end": "13:00" },
    { "date": "2022-03-21", "status": "available", "dow": 1, "start": "14:00", "end": "18:00" },
    { "date": "2022-03-22", "status": "unavailable", "dow": 2, "start": "", "end": "" },
    { "date": "2022-03-23", "status": "available", "dow": 3, "start": "09:00", "end": "18:00" }
]
interface ISchedule {
    dow: number;
    start: string;
    end: string;
    date?: string | undefined;
    status: string;
}
interface ScheduleInputProps {
    notPreviousDays?: boolean;
    data?: ISchedule[];
    // hex: string;
    // onChange: ColorChangeHandler;
    // disabled?: boolean;
}
interface DayInputProps {
    day: DayProp;
    notPreviousDays?: boolean;
}

interface DayProp {
    date: Date;
    dateString: string;
    dow: number;
    dom: number;
    isToday?: boolean;
    isDayPreview?: boolean;
    notPreviousDays?: boolean;
    data: ISchedule[]
}

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        height: 130,
        borderRight: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        padding: 8,
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
        cursor: 'not-allowed',
        backgroundColor: '#dbdbdb3d',
        '& > div': {
            color: '#767676'
        }
    },
    isToday: {
        fontWeight: 'bold',
        backgroundColor: '#e1e1e1',
        width: 20,
        textAlign: 'center',
        borderRadius: '50%',
    },
    dow: {
        fontWeight: 'bold',
        display: 'inline-block',
        fontSize: 12
    },
    container: {
        width: '910px',
        backgroundColor: '#fff'
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderLeft: '1px solid #e0e0e0',
        borderTop: '1px solid #e0e0e0',
    },
    wrapperDays: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderLeft: '1px solid #e0e0e0',
        borderRight: '1px solid #e0e0e0',
    },
    dowHeader: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#767676',
        padding: '12px 0',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    containerInfo: {
        border: '1px solid #e0e0e0',
        padding: theme.spacing(3),
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
    }
}));

const BoxDay: FC<DayInputProps> = ({ day, notPreviousDays }) => {
    const classes = useScheduleStyles();
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        setIsAvailable(!day.data.some(x => x.status === "unavailable"))
    }, [day.data])

    return (
        <div
            className={clsx(classes.boxDay, {
                [classes.boxDayHover]: !day.isDayPreview,
                [classes.boxDayForbidden]: notPreviousDays && day.isDayPreview,
            })}
        >
            <div className={clsx(classes.dow, {
                [classes.isToday]: day.isToday
            })}>
                {day.dom}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {!isAvailable && (
                    <div>unavailable</div>
                )}
                {isAvailable && day.data.map((item, index) => (
                    <div key={index} className={classes.timeDate}>
                        {item.start} - {item.end}
                    </div>
                ))}
            </div>
        </div>
    )
}

const Schedule: FC<ScheduleInputProps> = ({ notPreviousDays = true, data = [] }) => {
    const classes = useScheduleStyles();
    const { t } = useTranslation();
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })


    useEffect(() => {
        const monthDates = calculateMonth(dateCurrent.year, dateCurrent.month).map(x => ({
            ...x,
            data: data.filter(y => y.dow === x.dow || y.date === x.dateString)
        }));

        setDaysToShow(monthDates);
    }, [dateCurrent])

    const handleChangeMonth = useCallback((manageMonth: number) => {
        setDateCurrent({
            year: dateCurrent.year,
            month: dateCurrent.month + manageMonth
        })
    }, [dateCurrent])


    return (
        <div className={classes.container}>
            <div className={classes.containerInfo}>
                <div>
                    <div className={classes.containerInfoTitle}>
                        {t((langKeys as Dictionary)[`month_${("" + (dateCurrent.month + 1)).padStart(2, "0")}`])} {dateCurrent.year}
                    </div>
                    <div>
                        Set your weekly hours
                    </div>
                </div>
                <div className={classes.containerButtons}>
                    <div
                        className={classes.buttonMonth}
                        onClick={() => handleChangeMonth(-1)}
                    >
                        <NavigateBeforeIcon />
                    </div>
                    <div
                        className={classes.buttonMonth}
                        style={{ borderLeft: '1px solid #e0e0e0' }}
                        onClick={() => handleChangeMonth(1)}
                    >
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
                        notPreviousDays={notPreviousDays}
                    />
                ))}
            </div>
        </div>
    )
}

export default Schedule;
