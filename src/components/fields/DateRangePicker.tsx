import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme } from "@material-ui/core";
import { langKeys } from "lang/keys";
import { useState } from "react";
import { FC } from "react";
import { DateRangePicker as PDateRangePicker, DateRangePickerProps as PDateRangePickerProps, Range, RangeWithKey, StaticRange } from 'react-date-range';
import { Trans, useTranslation } from "react-i18next";
import { dateRangeResourceLanguage } from "common/helpers";
import {
    addDays,
    endOfDay,
    startOfDay,
    startOfMonth,
    endOfMonth,
    addMonths,
    startOfWeek,
    endOfWeek,
    isSameDay,
} from 'date-fns';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'store/popus/actions';
import { useSelector } from 'hooks';
interface DateRangePickerProps extends Omit<PDateRangePickerProps, 'ranges'> {
    title?: React.ReactNode;
    open: boolean;
    fillterAllDate?: Boolean;
    showSelectionPreview?: Boolean;
    range: Range;
    limitMonth?: number;
    setOpen: (open: boolean) => void;
    onSelect?: (props: Range) => void;
}

const defineds = {
    startOfWeek: startOfWeek(new Date()),
    endOfWeek: endOfWeek(new Date()),
    startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
    endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
    startOfToday: startOfDay(new Date()),
    endOfToday: endOfDay(new Date()),
    startOfYesterday: startOfDay(addDays(new Date(), -1)),
    endOfYesterday: endOfDay(addDays(new Date(), -1)),
    startOfMonth: startOfMonth(new Date()),
    endOfMonth: endOfMonth(new Date()),
    startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
    endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const todayRange: Range = { startDate: defineds.startOfToday, endDate: defineds.endOfToday };
const yesterdayRange: Range = { startDate: defineds.startOfYesterday, endDate: defineds.endOfYesterday };
const thisWeekRange: Range = { startDate: defineds.startOfWeek, endDate: defineds.endOfWeek };
const lastWeekRange: Range = { startDate: defineds.startOfLastWeek, endDate: defineds.endOfLastWeek };
const thisMonthRange: Range = { startDate: defineds.startOfMonth, endDate: defineds.endOfMonth };
const lastMonthRange: Range = { startDate: defineds.startOfLastMonth, endDate: defineds.endOfLastMonth };
const allDateRange: Range = { startDate: new Date("1995-01-01"), endDate: new Date() };

const isSelected = (range: Range, definedRange: Range) => {
    return (
        isSameDay(range.startDate!, definedRange.startDate!) &&
        isSameDay(range.endDate!, definedRange.endDate!)
    );
};

/**https://github.com/hypeserver/react-date-range/blob/2ffa7c861115e4d9cb9b50c8c9f14d274f143bd5/src/defaultRanges.js#L44 */
const DateRangePicker: FC<DateRangePickerProps> = (props) => {
    const {
        title = <Trans i18nKey={langKeys.dateRangeFilterTitle} />,
        children,
        open,
        setOpen,
        range,
        onSelect,
        months = 2,
        direction = "horizontal",
        fillterAllDate=false,
        showSelectionPreview = true,
        moveRangeOnFirstSelection = false,
        limitMonth = 0,
        ...res
    } = props;
    const dispatch = useDispatch();
    const theme = useTheme();
    const { t } = useTranslation();
    const [currentRange, setCurrentRange] = useState<Range[]>([range]);
    const [search, setSearch] = useState(true)
    const rangeDateFilter = useSelector(state => state.login.validateToken.user?.properties?.range_date_filter);

    React.useEffect(() => {
        if (open) {
            setSearch(true)
        }
    }, [open])

    const staticRanges: StaticRange[] = [
        {
            label: t(langKeys.today),
            range: () => todayRange,
            isSelected: (range) => isSelected(range, todayRange),
        },
        {
            label: t(langKeys.yesterday),
            range: () => yesterdayRange,
            isSelected: (range) => isSelected(range, yesterdayRange),
        },

        {
            label: t(langKeys.thisWeek),
            range: () => thisWeekRange,
            isSelected: (range) => isSelected(range, thisWeekRange),
        },
        {
            label: t(langKeys.lastWeek),
            range: () => lastWeekRange,
            isSelected: (range) => isSelected(range, lastWeekRange),
        },
        {
            label: t(langKeys.thisMonth),
            range: () => thisMonthRange,
            isSelected: (range) => isSelected(range, thisMonthRange),
        },
        {
            label: t(langKeys.lastMonth),
            range: () => lastMonthRange,
            isSelected: (range) => isSelected(range, lastMonthRange),
        },
        ...(fillterAllDate ? [{
            label: t(langKeys.all),
            range: () => allDateRange,
            isSelected: (range:any) => isSelected(range, allDateRange),
        }] : []),
    ];

    return (
        <>
            {children}
            <Dialog
                open={open}
                maxWidth="md"
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <div>
                        <PDateRangePicker
                            onChange={(range) => {
                                const selection = (range as { selection: RangeWithKey }).selection;
                                const limitExec = limitMonth || rangeDateFilter;
                                if (limitExec && !fillterAllDate) {
                                    const { startDate, endDate } = selection;
                                    const diffYear = endDate!!.getFullYear() - startDate!!.getFullYear()
                                    const diffmonth = endDate!!.getMonth() + 12 * diffYear - startDate!!.getMonth()
                                    if ((diffmonth + 1) > limitExec) {
                                        setSearch(false)
                                        return dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.validate_time_filter) }))
                                    }
                                }
                                setSearch(true)
                                setCurrentRange([selection]);
                            }}
                            showSelectionPreview={showSelectionPreview}
                            moveRangeOnFirstSelection={moveRangeOnFirstSelection}
                            ranges={currentRange}
                            direction={direction}
                            months={months}
                            color={theme.palette.primary.main}
                            locale={dateRangeResourceLanguage()}
                            staticRanges={staticRanges}
                            rangeColors={[theme.palette.primary.main, theme.palette.primary.dark]}
                            {...res}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={!search}
                        onClick={() => {
                            onSelect?.(currentRange[0]);
                            setOpen(false);
                        }}
                    >
                        <Trans i18nKey={langKeys.apply} />
                    </Button>
                    <Button
                        type="button"
                        color="secondary"
                        style={{ marginLeft: '1rem', color: theme.palette.text.primary }}
                        onClick={() => setOpen(false)}
                    >
                        <Trans i18nKey={langKeys.close} />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DateRangePicker;