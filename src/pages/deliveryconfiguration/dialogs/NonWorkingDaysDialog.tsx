import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import FilterListIcon from '@material-ui/icons/FilterList';
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "react-i18next";
import CalendarZyx, { DayProp } from "components/fields/Calendar";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/Save";

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
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
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
    const [filtering, setFiltering] = useState(false)
    const [filteringRecurrent, setFilteringRecurrent] = useState(false)
    const [filterData, setFilterData] = useState({
        year: '',
        month: '',
    })
    const [filterDataRecurrent, setFilterDataRecurrent] = useState('')

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
        setFiltering(false)
        setFilteringRecurrent(false)
        setFilterData({
            year: '',
            month: '',
        })
        setFilterDataRecurrent('')
    };

    const months = [
        {
            domainvalue: '01',
        },
        {
            domainvalue: '02',
        },
        {
            domainvalue: '03',
        },
        {
            domainvalue: '04',
        },
        {
            domainvalue: '05',
        },
        {
            domainvalue: '06',
        },
        {
            domainvalue: '07',
        },
        {
            domainvalue: '08',
        },
        {
            domainvalue: '09',
        },
        {
            domainvalue: '10',
        },
        {
            domainvalue: '11',
        },
        {
            domainvalue: '12',
        }
    ]

    const years = [
        {
            domainvalue: '2023',
        },
        {
            domainvalue: '2024',
        },
        {
            domainvalue: '2025',
        },
    ]

    const filterByYear = (year: string) => {
        return nonWorkingDates.filter(date => date.substring(0, 4) === year);
    }

    const filterByMonth = (month: string) => {
        return nonWorkingDates.filter(date => date.substring(5, 7) === month);
    }

    const filterByYearAndMonth = (year: string, month: string) => {
        return nonWorkingDates.filter(date => {
            const dateYear = date.substring(0, 4);
            const dateMonth = date.substring(5, 7);
            return dateYear === year && dateMonth === month;
        });
    }

    const filterByMonthRecurrent = (month: string) => {
        return recurrentNonWorkingDates.filter(date => date.substring(0, 2) === month);
    }

    const handleFilterUnique = () => {
        if(filtering) {
            setFiltering(false)
            setFilterData({
                year: '',
                month: '',
            })
        } else {
            if(filterData.year !== '' || filterData.month !== '') {
                setFiltering(true)
            }
        }
    }

    const handleFilterRecurrent = () => {
        if(filteringRecurrent) {
            setFilteringRecurrent(false)
            setFilterDataRecurrent('')
        } else {
            if(filterDataRecurrent !== '') {
                setFilteringRecurrent(true)
            }
        }
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.nonworkingdaysregister)}
            maxWidth="lg"
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
                    <div style={{width: '50%'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <IconButton
                                style={{ backgroundColor: filtering ? '#90CAF9' : '', color: 'black', borderRadius: 25, padding: 5, marginRight: 5}}
                                onClick={handleFilterUnique}
                            >
                                <FilterListIcon/>
                            </IconButton>
                            <FieldSelect
                                label={t(langKeys.year)}
                                variant="outlined"
                                data={years}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                valueDefault={filterData.year}
                                onChange={(value) => {
                                    if(value) {
                                        setFilterData({...filterData, year: value.domainvalue})
                                    } else {
                                        setFilterData({...filterData, year: ''})
                                    }
                                }}
                            />
                            <div style={{width: 5}}/>
                            <FieldSelect
                                label={t(langKeys.month)}
                                variant="outlined"
                                data={months}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                valueDefault={filterData.month}
                                onChange={(value) => {
                                    if(value) {
                                        setFilterData({...filterData, month: value.domainvalue})
                                    } else {
                                        setFilterData({...filterData, month: ''})
                                    }
                                }}
                            />
                        </div>
                        <div className={classes.col4}>
                            {nonWorkingDates.length > 0 ? (
                                <>
                                    <h3>{t(langKeys.uniquedates)}</h3>
                                    <div className={classes.selectedDatesContainer}>
                                        {filtering ? (
                                            <>
                                                {(filterData.year !== '' && filterData.month !== '') ? (
                                                    <>
                                                        {filterByYearAndMonth(filterData.year, filterData.month).map((date) => (
                                                            <>
                                                                <div className={classes.dateItem}>
                                                                    <span className={classes.dateSpan}>{date}</span>
                                                                    <IconButton onClick={() => handleDeleteDate(date)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </>
                                                        ))}
                                                    </>
                                                ) : filterData.year !== '' ? (
                                                    <>
                                                        {filterByYear(filterData.year).map((date) => (
                                                            <>
                                                                <div className={classes.dateItem}>
                                                                    <span className={classes.dateSpan}>{date}</span>
                                                                    <IconButton onClick={() => handleDeleteDate(date)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <>
                                                        {filterByMonth(filterData.month).map((date) => (
                                                            <>
                                                                <div className={classes.dateItem}>
                                                                    <span className={classes.dateSpan}>{date}</span>
                                                                    <IconButton onClick={() => handleDeleteDate(date)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </>
                                                        ))}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className={classes.noDatesTextContainer}>
                                    <p>{t(langKeys.nodatesselected)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{width: 20}}/>
                    <div style={{width: '50%'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                            <IconButton
                                style={{ backgroundColor: filteringRecurrent ? '#90F9BF' : '', color: 'black', borderRadius: 25, padding: 5, marginRight: 5}}
                                onClick={handleFilterRecurrent}
                            >
                                <FilterListIcon/>
                            </IconButton>
                            <FieldSelect
                                label={t(langKeys.month)}
                                variant="outlined"
                                data={months}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                                valueDefault={filterDataRecurrent}
                                onChange={(value) => {
                                    if(value) {
                                        setFilterDataRecurrent(value.domainvalue)
                                    } else {
                                        setFilterDataRecurrent('')
                                    }
                                }}
                            />
                        </div>
                        <div className={classes.col4}>
                            {recurrentNonWorkingDates?.length > 0 ? (
                                <>
                                    <h3>{t(langKeys.recurringdates)}</h3>
                                    <div className={classes.selectedDatesContainer}>
                                        {filteringRecurrent ? (
                                            <>
                                                {filterByMonthRecurrent(filterDataRecurrent).map((date) => (
                                                    <>
                                                        <div className={classes.dateItem}>
                                                            <span className={classes.dateSpan}>{date}</span>
                                                            <IconButton onClick={() => handleDeleteRecurrent(date)}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </div>
                                                    </>
                                                ))}
                                            </>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
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
                <div className={classes.button}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={closeModal}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"                    
                        onClick={onMainSubmit}
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                    >
                        {t(langKeys.save)}
                    </Button>
                </div>
            </div>
        </DialogZyx>
    );
};

export default NonWorkingDaysDialog;
