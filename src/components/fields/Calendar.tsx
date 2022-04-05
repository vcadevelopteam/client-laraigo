import { IconButton, makeStyles } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import React, { FC, useCallback, useEffect, useState } from "react";
import clsx from 'clsx';
import { Dictionary } from "@types";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { calculateDateFromMonth } from 'common/helpers';

const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

interface CalendarInputProps {
    notPreviousDays?: boolean;
    selectedDays?: string[];
    onChange?: (dates: DayProp[], dateChanged: DayProp, action: string) => void;
    multiple?: boolean;
    onChangeMonth?: (month: number, year: number) => void;
    daysAvailable?: string[];
    // hex: string;
    // onChange: ColorChangeHandler;
    // disabled?: boolean;
}
interface DayInputProps {
    day: DayProp;
    notPreviousDays?: boolean;
    handleClick: (event: any, day: DayProp) => void;
}

interface DayProp {
    date: Date;
    dateString: string;
    dow: number;
    dom: number;
    isToday?: boolean;
    isDayPreview?: boolean;
    isSelected?: boolean;
}

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        height: 44,
        padding: 8,
        textAlign: 'center',
        color: '#767676',
    },
    boxDayHover: {
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: 'rgb(119, 33, 173, 0.065)',
        color: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        '&:hover': {
            backgroundColor: 'rgb(119, 33, 173, 0.095)',
        }
    },
    dateSelected: {
        backgroundColor: theme.palette.primary.main,
        color: '#FFF',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
        }
    },
    container: {
        width: '350px',
        backgroundColor: '#fff'
    },
    wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 6
    },
    wrapperDays: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
    },
    dowHeader: {
        textAlign: 'center',
        padding: '8px 0',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    containerInfo: {
        padding: theme.spacing(1),
        display: 'flex',
        justifyContent: 'space-between',
    },
    infoTitle: {
        alignItems: 'center',
        display: 'flex',
        fontSize: 16

    },
    containerButtons: {
        display: 'flex',
        alignItems: 'center',
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

const BoxDay: FC<DayInputProps & { isActive?: boolean }> = ({ day, handleClick, isActive = true }) => {
    const classes = useScheduleStyles();

    return (
        <div
            onClick={(e: any) => isActive && handleClick(e, day)}
            className={clsx(classes.boxDay, {
                [classes.boxDayHover]: !day.isDayPreview && isActive,
                [classes.dateSelected]: day.isSelected && isActive
            })}
        >
            {day.dom}
        </div>
    )
}


const CalendarZyx: FC<CalendarInputProps> = ({ notPreviousDays = true, selectedDays = [], onChange, multiple, onChangeMonth, daysAvailable }) => {
    const classes = useScheduleStyles();
    const { t } = useTranslation();
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    const [dateCurrent, setDateCurrent] = useState<{ month: number, year: number }>({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const [datesSelected, setDatesSelected] = useState<DayProp[]>([]);

    useEffect(() => {
        let year = dateCurrent.year;
        let month = dateCurrent.month;

        if (selectedDays[0]) {
            const splitDate = selectedDays[0].split("-").map(item => parseInt(item));
            const date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
            year = date.getFullYear();
            month = date.getMonth();
            setDateCurrent({ year, month })
        }
        const monthDates = calculateDateFromMonth(year, month).map(x => ({
            ...x,
            isSelected: datesSelected.some(date => date.dateString === x.dateString)
        }));

        if (selectedDays.length > 0) {
            const parsedDates = selectedDays.filter(x => x.split("-").length === 3).map(x => {
                const splitDate = x.split("-").map(item => parseInt(item));
                const date = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
                return {
                    date: date,
                    dateString: date.toISOString().substring(0, 10),
                    dow: date.getDay(),
                    dom: date.getDate(),
                    isDayPreview: date < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                }
            })
            setDatesSelected(parsedDates);
            setDaysToShow(monthDates.map(date => ({
                ...date,
                isSelected: parsedDates.some(x => x.dateString === date.dateString)
            })));
        } else {
            setDaysToShow(monthDates.map(date => ({
                ...date,
            })));
        }
    }, [])

    const handleClick = (_: any, day: DayProp) => {
        if (day.isDayPreview)
            return
        if (multiple) {
            const alreadyMarked = datesSelected.some(date => date.dateString === day.dateString);
            if (alreadyMarked) {
                const newDates = datesSelected.filter(date => date.dateString !== day.dateString);
                onChange && onChange(newDates, day, 'remove');
                setDatesSelected(newDates);
                setDaysToShow(daysToShow.map(date => ({
                    ...date,
                    isSelected: date.dateString === day.dateString ? false : date.isSelected
                })));
            } else {
                const newDates = [...datesSelected, day];
                onChange && onChange(newDates, day, 'add');
                setDatesSelected(newDates);
                setDaysToShow(daysToShow.map(date => ({
                    ...date,
                    isSelected: date.dateString === day.dateString ? true : date.isSelected
                })));
            }
        } else {
            onChange && onChange([day], day, 'remove');
            setDatesSelected([day]);
            setDaysToShow(daysToShow.map(date => ({
                ...date,
                isSelected: date.dateString === day.dateString ? true : false
            })));
        }
    };

    useEffect(() => {
        if (daysToShow.length > 0) {
            const monthDates = calculateDateFromMonth(dateCurrent.year, dateCurrent.month).map(x => ({
                ...x,
                isSelected: datesSelected.some(date => date.dateString === x.dateString)
            }));
            setDaysToShow(monthDates);
        }
    }, [dateCurrent])

    const handleChangeMonth = useCallback((manageMonth: number) => {
        
        setDateCurrent({
            year: dateCurrent.year,
            month: dateCurrent.month + manageMonth
        });
        onChangeMonth && onChangeMonth(dateCurrent.month + manageMonth, dateCurrent.year)
    }, [dateCurrent])


    return (
        <div className={classes.container}>
            <div className={classes.containerInfo}>
                <div className={classes.infoTitle}>
                    {t((langKeys as Dictionary)[`month_${("" + (dateCurrent.month + 1)).padStart(2, "0")}`])} {dateCurrent.year}
                </div>
                <div className={classes.containerButtons}>
                    <IconButton size="small" onClick={() => handleChangeMonth(-1)}
                    >
                        <NavigateBeforeIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleChangeMonth(1)}
                    >
                        <NavigateNextIcon />
                    </IconButton>
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
                        isActive={daysAvailable === undefined || daysAvailable.includes(day.dateString)}
                        day={day}
                        handleClick={handleClick}
                        notPreviousDays={notPreviousDays}
                    />
                ))}
            </div>
        </div>
    )
}

export default CalendarZyx;