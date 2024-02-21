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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 0,
        border: "4px outset #7721AD",
    },
    calendarButton: {
        marginLeft: 20,
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
}> = ({ openModal, setOpenModal, nonWorkingDates, setNonWorkingDates, onMainSubmit, fetchOriginalConfig }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [tempSelectedDates, setTempSelectedDates] = useState<DayProp | null>(null);

    const handleDateChange = (date: DayProp) => {
        setTempSelectedDates(date[0]);
    };

    const handleApplyDates = () => {
        setNonWorkingDates([...nonWorkingDates, tempSelectedDates.dateString]);
        setTempSelectedDates([]);
    };

    const handleDeleteDate = (date: string) => {
        const updatedDates = nonWorkingDates.filter((d) => d !== date);
        setNonWorkingDates(updatedDates);
    };

    const closeModal = () => {
        fetchOriginalConfig();
        setOpenModal(false);
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyDates}
                        disabled={
                            !tempSelectedDates || nonWorkingDates.some((date) => date === tempSelectedDates.dateString)
                        }
                        className={classes.calendarButton}
                    >
                        {t(langKeys.select)}
                    </Button>
                </div>
                <div className={`${classes.col4} col-4`}>
                    {nonWorkingDates.length > 0 ? (
                        <>
                            <h3>Fechas seleccionadas</h3>
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
                            <p>No hay fechas seleccionadas</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogZyx>
    );
};

export default NonWorkingDaysDialog;
