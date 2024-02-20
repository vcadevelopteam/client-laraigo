import React, { useState } from "react";
import { makeStyles, IconButton } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    mainContainer: {
        marginBottom: 0,
        display: 'flex',
        alignItems: 'center'
    },
    ordersTitle: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 0
    },
    ordersSpan: {
        fontWeight: 'bold',
        fontSize: 17
    },
    container: {
        border: '1px solid black',
        borderRadius: 5,
        padding: 5,
        width: '80%'
    },
    flex: {
        display: 'flex',
    },
}));

interface AutomaticSchedule {
    starttime: string;
    endtime: string;
    shift: string;
    deliveryday: string;
}

const AutomaticDeliveryDialog = ({
    openModal,
    setOpenModal,
    automaticSchedules,
    setAutomaticSchedules,
    onMainSubmit,
    fetchOriginalConfig,
    configjson
}: {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    automaticSchedules: AutomaticSchedule[];
    setAutomaticSchedules: (automaticSchedules: AutomaticSchedule[]) => void;
    onMainSubmit: () => void;
    fetchOriginalConfig: () => void;
    configjson: Dictionary;
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isAding, setIsAding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newSchedule, setNewSchedule] = useState<AutomaticSchedule>({
        starttime: '',
        endtime: '',
        shift: '',
        deliveryday: '',
    })
    const [scheduleAux, setScheduleAux] = useState<AutomaticSchedule|null>(null);

    const closeModal = () => {
        fetchOriginalConfig();
        handleCancelCreation()
        handleCancel()
        setOpenModal(false);
    };

    const handleCreateSchedule = () => {
        setIsAding(true);
    }

    const handleCancelCreation = () => {
        setNewSchedule({
            starttime: '',
            endtime: '',
            shift: '',
            deliveryday: '',
        })
        setIsAding(false)
    }

    const handleSaveNewSchedule = () => {
        setAutomaticSchedules([...automaticSchedules, newSchedule])
        setNewSchedule({
            starttime: '',
            endtime: '',
            shift: '',
            deliveryday: '',
        })
        setIsAding(false)
    }

    const handleEdit = (scheduleToEdit: AutomaticSchedule) => {
		setIsEditing(true)
		setNewSchedule(scheduleToEdit)
		setScheduleAux(scheduleToEdit)
	}

    const handleCancel = () => {
		setIsEditing(false)
		setScheduleAux(null)
		setNewSchedule({
			starttime: '',
            endtime: '',
            shift: '',
            deliveryday: '',
		})
	}

    const handleSaveEdit = () => {
		const index = automaticSchedules.findIndex(schedule => schedule === scheduleAux);
		const updatedSchedules = [...automaticSchedules];
        updatedSchedules[index] = {
            starttime: newSchedule.starttime,
            endtime: newSchedule.endtime,
            shift: newSchedule.shift,
            deliveryday: newSchedule.deliveryday
        };
		setAutomaticSchedules(updatedSchedules);

		setScheduleAux(null)
		setIsEditing(false)
		setNewSchedule({
			starttime: '',
            endtime: '',
            shift: '',
            deliveryday: '',
		})
	}

    const handleDeleteSchedule = (scheduleToDelete: AutomaticSchedule) => {
        const updatedSchedules = automaticSchedules.filter(schedule => schedule !== scheduleToDelete);
		setAutomaticSchedules(updatedSchedules)
    }

    const handleSave = () => {
		onMainSubmit()
		setOpenModal(false)
	}

    const dates = [
        {
            domainvalue: '0',
            domaindesc: '0'
        },
        {
            domainvalue: '+1',
            domaindesc: '+1'
        },
        {
            domainvalue: '+2',
            domaindesc: '+2'
        },
    ]

    const shifts: {domainvalue: string; domaindesc: string}[] = [];
    if (configjson.morningstarttime !== null && configjson.morningendtime !== null) {
        shifts.push({domainvalue: 'Mañana', domaindesc: 'Mañana'});
    } if (configjson.afternoonstarttime !== null && configjson.afternoonendtime !== null) {
        shifts.push({domainvalue: 'Tarde', domaindesc: 'Tarde'});
    } if (configjson.nightstarttime !== null && configjson.nightendtime !== null) {
        shifts.push({domainvalue: 'Noche', domaindesc: 'Noche'});
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.automaticscheduling)}
            maxWidth="md"
            buttonText0={t(langKeys.close)}
            buttonText1={t(langKeys.save)}
            handleClickButton0={closeModal}
            handleClickButton1={handleSave}
        >
            <div className={`${classes.mainContainer} row-zyx`}>
                <div className={`${classes.ordersTitle} col-6`}>
                    <span className={classes.ordersSpan}>Pedidos</span>
                    <IconButton>
                        <AddCircleIcon style={{color: 'green'}} onClick={handleCreateSchedule}/>
                    </IconButton>
                </div>
                <span className={`${classes.ordersSpan} col-6`}>Entrega</span>
                {automaticSchedules.length > 0 && (
                    <>
                        <span className="col-3" style={{marginBottom: 0}}>{t(langKeys.from)}</span>
                        <span className="col-3" style={{marginBottom: 0}}>{t(langKeys.until)}</span>
                        <span className="col-3" style={{marginBottom: 0}}>{t(langKeys.shift)}</span>
                        <span className="col-3" style={{marginBottom: 0}}>{t(langKeys.day)}</span>
                        {automaticSchedules.map((schedule) => (
                            <>
                                <div className="col-3">
                                    <div className={classes.container}>{schedule.starttime}</div>
                                </div>
                                <div className="col-3">
                                    <div className={classes.container}>{schedule.endtime}</div>
                                </div>
                                <div className="col-3">
                                    <div className={classes.container}>{schedule.shift}</div>
                                </div>
                                <div className="col-2">
                                    <div className={classes.container}>{schedule.deliveryday}</div>
                                </div>
                                <div className={`${classes.flex} col-1`}>
                                    <IconButton onClick={() => handleEdit(schedule)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteSchedule(schedule)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            </>
                        ))}
                    </>
                )}
                {(isAding || isEditing) && (
                    <>
                        <FieldEdit
                            label={t(langKeys.from)}
                            type="time"
                            className='col-3'
                            valueDefault={newSchedule.starttime}
                            onChange={(value) => setNewSchedule({...newSchedule, starttime: value})}
                        />
                        <FieldEdit
                            label={t(langKeys.until)}
                            type="time"
                            className='col-3'
                            valueDefault={newSchedule.endtime}
                            onChange={(value) => setNewSchedule({...newSchedule, endtime: value})}
                        />
                        <FieldSelect
                            label={t(langKeys.shift)}
                            className='col-3'
                            data={shifts}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            valueDefault={newSchedule?.shift}
                            onChange={(value) => setNewSchedule({...newSchedule, shift: value.domainvalue})}
                        />
                        <FieldSelect
                            label={t(langKeys.day)}
                            className='col-2'
                            data={dates}
                            optionValue="domainvalue"
                            optionDesc="domaindesc"
                            valueDefault={newSchedule?.deliveryday}
                            onChange={(value) => setNewSchedule({...newSchedule, deliveryday: value.domainvalue})}
                        />
                        {isAding ? (
                            <div className={`${classes.flex} col-1`}>
                                <IconButton onClick={handleSaveNewSchedule}>
                                    <CheckIcon/>
                                </IconButton>
                                <IconButton onClick={handleCancelCreation}>
                                    <ClearIcon/>
                                </IconButton>
                            </div>
                        ) : (
                            <div className={`${classes.flex} col-1`}>
                                <IconButton onClick={handleSaveEdit}>
                                    <SaveIcon/>
                                </IconButton>
                                <IconButton onClick={handleCancel}>
                                    <BackspaceIcon/>
                                </IconButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DialogZyx>
    );
};

export default AutomaticDeliveryDialog;
