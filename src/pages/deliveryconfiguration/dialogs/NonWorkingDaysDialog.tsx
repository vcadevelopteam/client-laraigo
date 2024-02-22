import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import CalendarZyx, { DayProp } from "components/fields/Calendar";

const useStyles = makeStyles(() => ({
    rowZyx: {
        marginBottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    col6: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0,
        justifyContent: "center",
    },
    col4: {
        height: 324,
        width: '50%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 0,
        border: "4px outset #7721AD",
    },
    calendarButton: {
        width: 159,
        padding: 0,
        height: 'auto',
    },
    selectedDatesContainer: {
        maxHeight: "260px",
        overflowY: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    dateItem: {
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
    },
    dateSpan: {
        border: "1px solid black",
        width: 100,
        display: "flex",
        justifyContent: "center",
        padding: "8px 0",
    },
    noDatesTextContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const NonWorkingDaysDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    nonWorkingDates: string[];
    setNonWorkingDates: (dates: string[]) => void;
    onMainSubmit: () => void;
    fetchOriginalConfig: () => void;
    recurrentNonWorkingDates: string[];
    setRecurrentNonWorkingDates: (dates: string[]) => void;
}> = ({ openModal, setOpenModal, nonWorkingDates, setNonWorkingDates, onMainSubmit, fetchOriginalConfig, recurrentNonWorkingDates, setRecurrentNonWorkingDates }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [tempSelectedDates, setTempSelectedDates] = useState<DayProp | null>(null);
    const [dateError, setDateError] = useState(false)

    const handleDateChange = (date: DayProp) => {
        setTempSelectedDates(date[0]);
        setDateError(false)
    };

    const handleApplyDates = () => {
        if(
            tempSelectedDates &&
            !recurrentNonWorkingDates.some((date) => date === tempSelectedDates?.dateString?.substring(tempSelectedDates?.dateString?.indexOf('-') + 1)) &&
            !nonWorkingDates.some((date) => date === tempSelectedDates?.dateString)
        ) {
            setNonWorkingDates([...nonWorkingDates, tempSelectedDates.dateString]);
            setTempSelectedDates(null);
            setDateError(false)
        } else {
            setDateError(true)
        }
    };

    const handleDeleteDate = (date: string) => {
        const updatedDates = nonWorkingDates.filter((d) => d !== date);
        setNonWorkingDates(updatedDates);
    };

    const handleSaveRecurrent = () => {
        if(
            tempSelectedDates &&
            !recurrentNonWorkingDates.some((date) => date === tempSelectedDates?.dateString?.substring(tempSelectedDates?.dateString?.indexOf('-') + 1))
        ) {
            setRecurrentNonWorkingDates([...recurrentNonWorkingDates, tempSelectedDates.dateString.substring(tempSelectedDates.dateString.indexOf('-') + 1)]);
            setTempSelectedDates(null);
            setDateError(false)
        } else {
            setDateError(true)
        }
    };

    const handleDeleteRecurrent = (date: string) => {
        const updatedDates = recurrentNonWorkingDates.filter((d) => d !== date);
        setRecurrentNonWorkingDates(updatedDates);
    };

    const closeModal = () => {
        fetchOriginalConfig();
        setOpenModal(false);
        setDateError(false)
        setTempSelectedDates(null);
    };

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.nonworkingdaysregister)}
            maxWidth="lg"
            buttonText0={t(langKeys.back)}
            handleClickButton0={closeModal}
            buttonText1={t(langKeys.save)}
            handleClickButton1={onMainSubmit}
        >
            <div className={`${classes.rowZyx} row-zyx`}>
                <div className={`${classes.col6} col-6`}>
                    <CalendarZyx onChange={handleDateChange} selectedDays={nonWorkingDates} />
                    <div style={{display: 'flex', flexDirection: 'column', marginLeft: 40, marginRight: 40, alignItems: 'center'}}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyDates}
                            className={classes.calendarButton}
                        >
                            {t(langKeys.saveunique)}
                        </Button>
                        <div style={{height: 20}}/>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveRecurrent}
                            className={classes.calendarButton}
                        >
                            {t(langKeys.saverecurrent)}
                        </Button>
                        {dateError && (
                            <span style={{color: 'red', width: 159, textAlign: 'center', marginTop: 20}}>
                                {recurrentNonWorkingDates.some((date) => date === tempSelectedDates?.dateString.substring(tempSelectedDates?.dateString.indexOf('-') + 1)) ? t(langKeys.recurringnonworkingdateexist) :
                                nonWorkingDates.some((date) => date === tempSelectedDates?.dateString) ? t(langKeys.uniquenonworkingdateexist) :
                                t(langKeys.nodateselected)}
                            </span>
                        )}
                    </div>
                </div>
                <div className="col-6" style={{display: 'flex'}}>
                    <div className={classes.col4}>
                        {nonWorkingDates.length > 0 ? (
                            <>
                                <h3>{t(langKeys.uniquedates)}</h3>
                                <div className={classes.selectedDatesContainer}>
                                    {nonWorkingDates.map((date) => (
                                        <>
                                            <div className={classes.dateItem}>
                                                <span className={classes.dateSpan}>{date}</span>
                                                <IconButton onClick={() => handleDeleteDate(date)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={classes.noDatesTextContainer}>
                                <p>{t(langKeys.nodatesselected)}</p>
                            </div>
                        )}
                    </div>
                    <div style={{width: 20}}/>
                    <div className={classes.col4}>
                        {recurrentNonWorkingDates.length > 0 ? (
                            <>
                                <h3>{t(langKeys.recurringdates)}</h3>
                                <div className={classes.selectedDatesContainer}>
                                    {recurrentNonWorkingDates.map((date) => (
                                        <>
                                            <div className={classes.dateItem}>
                                                <span className={classes.dateSpan}>{date}</span>
                                                <IconButton onClick={() => handleDeleteRecurrent(date)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </div>
                                        </>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={classes.noDatesTextContainer}>
                                <p>{t(langKeys.norecurringdatesselected)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DialogZyx>
    );
};

export default NonWorkingDaysDialog;
