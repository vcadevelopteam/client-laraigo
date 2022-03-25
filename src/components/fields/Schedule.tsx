import { makeStyles } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import Close from "@material-ui/icons/Close";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ChromePicker, ColorChangeHandler, ColorResult } from "react-color";
import clsx from 'clsx';

const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
]

interface ScheduleInputProps {
    // hex: string;
    // onChange: ColorChangeHandler;
    // disabled?: boolean;
}

interface DayProp {
    date: String,
    dow: number,
    dom: number,
    isToday?: boolean
}

const useScheduleStyles = makeStyles(theme => ({
    boxDay: {
        height: 130,
        cursor: 'pointer',
        borderRight: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        padding: 8,

        '&:hover': {
            padding: 6,
            border: '2px solid #5593ff'
        }
    },
    isToday: {
        fontWeight: 'bold',
        backgroundColor: '#e1e1e1'
    },
    dow: {
        fontWeight: 'bold'
    },
    wrapper: {
        display: 'grid',
        width: '910px',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderLeft: '1px solid #e0e0e0',
        borderTop: '1px solid #e0e0e0',
    }
}));


const Schedule: FC<ScheduleInputProps> = ({ }) => {
    const classes = useScheduleStyles();
    const [daysToShow, setDaysToShow] = useState<DayProp[]>([]);
    console.log(daysToShow)
    useEffect(() => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const countDays = new Date(year, month, 0).getDate();
        const dayLastDay = new Date(year, month, 0).getDay();
        const dayPreviewMonth = new Date(year, month - 1, 0).getDay();

        const daysMonth = Array.from(Array(countDays).keys()).map(x => {
            const date = new Date(year, month, x + 1);
            return {
                date: date.toISOString().slice(0, 10),
                dow: date.getDay(),
                dom: date.getDate(),
                isToday: date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
            }
        })

        const daysPreviewMonth = Array.from(Array(dayPreviewMonth).keys()).map(x => {
            const date = new Date(year, month, - x);
            return {
                date: date.toISOString().slice(0, 10),
                dow: date.getDay(),
                dom: date.getDate()
            }
        })

        const daysNextMonth = Array.from(Array(7 - dayLastDay).keys()).map(x => {
            const date = new Date(year, month, x + 1);
            return {
                date: date.toISOString().slice(0, 10),
                dow: date.getDay(),
                dom: date.getDate()
            }
        })

        setDaysToShow([...daysPreviewMonth, ...daysMonth, ...daysNextMonth]);
    }, [])

    return (
        <div className={classes.wrapper}>
            {daysToShow.map((day, index) => (
                <div
                    className={clsx(classes.boxDay, {
                        [classes.isToday]: day.isToday
                    })}
                    key={index}
                >
                    <div className={classes.dow}>{day.dom}</div>
                </div>
            ))}
        </div>
    )
}

export default Schedule;
