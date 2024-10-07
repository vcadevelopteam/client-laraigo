import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import BackspaceIcon from '@material-ui/icons/Backspace';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({      
    shiftsContainer: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px'
    },
    shiftsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        marginBottom: '5px'
    },
    shiftItem: {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #ccc',
        padding: '5px 0'
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
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end",
        marginTop: 20,
    },
}));

interface DeliveryShift {
    shiftname: string;
    starttime: string;
    endtime: string;
}

const DeliverySchedulesDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    onMainSubmit: () => void;
    fetchOriginalConfig: () => void;
    deliveryShifts: DeliveryShift[];
    setDeliveryShifts: (shifts: DeliveryShift[]) => void;
}> = ({ openModal, setOpenModal, onMainSubmit, fetchOriginalConfig, deliveryShifts, setDeliveryShifts }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isAding, setIsAding] = useState(false)
    const [newShift, setNewShift] = useState<DeliveryShift>({
        shiftname: '',
        starttime: '',
        endtime: '',
    })
    const [isEditing, setIsEditing] = useState(false);
    const [shiftAux, setShiftAux] = useState<DeliveryShift|null>(null);
    const [shiftNameError, setShiftNameError] = useState(false);

    const handleSave = () => {
        onMainSubmit();
    }

    const handleClose = () => {
        fetchOriginalConfig()
        handleCancelCreation()
        handleCancel()
        setOpenModal(false)
    }

    const handleCancelCreation = () => {
        setNewShift({
            shiftname: '',
            starttime: '',
            endtime: '',
        })
        setIsAding(false)
        setShiftNameError(false)
    }

    const handleSaveNewShift = () => {
        if (!deliveryShifts.some(shift => shift.shiftname === newShift.shiftname) && newShift.shiftname !== '' && newShift.starttime !== '' && newShift.endtime !== '') {
            setDeliveryShifts([...deliveryShifts, newShift]);
            setNewShift({
                shiftname: '',
                starttime: '',
                endtime: '',
            });
            setIsAding(false);
            setShiftNameError(false);
        } else {
            setShiftNameError(true);
        }
    }

    const handleEdit = (shiftToEdit: DeliveryShift) => {
		setIsEditing(true)
        setShiftNameError(false);
        setIsAding(false)
		setNewShift(shiftToEdit)
		setShiftAux(shiftToEdit)
	}

    const handleCancel = () => {
		setIsEditing(false)
		setShiftAux(null)
		setNewShift({
            shiftname: '',
			starttime: '',
            endtime: '',
		})
        setShiftNameError(false);
	}

    const handleSaveEdit = () => {
        const isEditingSameShift = shiftAux && newShift.shiftname === shiftAux.shiftname;

		if(!deliveryShifts.some(shift => shift.shiftname === newShift.shiftname && !isEditingSameShift) && newShift.shiftname !== '' && newShift.starttime !== '' && newShift.endtime !== '') {
            const index = deliveryShifts.findIndex(shift => shift.shiftname === shiftAux?.shiftname);
            const updatedShifts = [...deliveryShifts];
            updatedShifts[index] = {
                shiftname: newShift.shiftname,
                starttime: newShift.starttime,
                endtime: newShift.endtime,
            };
            setDeliveryShifts(updatedShifts);

            setShiftAux(null)
            setIsEditing(false)
            setNewShift({
                shiftname: '',
                starttime: '',
                endtime: '',
            })
            setShiftNameError(false);
        } else {
            setShiftNameError(true);
        }
	}

    const handleDeleteShift = (shiftToDelete: DeliveryShift) => {
        const updatedShifts = deliveryShifts.filter(shift => shift.shiftname !== shiftToDelete.shiftname);
		setDeliveryShifts(updatedShifts)
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.deliveryshifts)}
            maxWidth="md"
        >
            <div className="row-zyx" style={{marginBottom: 0, display: 'flex', justifyContent: 'center'}}>
                {deliveryShifts?.length > 0 && (
                    <>
                        <span className="col-4">{t(langKeys.shift)}</span>
                        <span className="col-3">{t(langKeys.from)}</span>
                        <span className="col-3">{t(langKeys.until)}</span>
                        <div className="col-2"></div>
                        {deliveryShifts.map((shift) => (
                            <>
                                <div className="col-4" style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.container}>{shift.shiftname}</div>
                                </div>
                                <div className="col-3" style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.container}>{shift.starttime}</div>
                                </div>
                                <div className="col-3" style={{display: 'flex', alignItems: 'center'}}>
                                    <div className={classes.container}>{shift.endtime}</div>
                                </div>
                                <div className={`${classes.flex} col-2`}>
                                    <IconButton onClick={() => handleEdit(shift)}>
                                        <EditIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteShift(shift)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </div>
                            </>
                        ))}
                    </>
                )}
                { (isAding || isEditing) ? (
                    <>
                        <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center', marginTop: 20}}>
                            <div className="col-3" style={{marginBottom:0}}>{t(langKeys.shift)}</div>
                            <div className="col-4" style={{marginBottom:0}}>{t(langKeys.from)}</div>
                            <div className="col-4" style={{marginBottom:0}}>{t(langKeys.until)}</div>
                        </div>
                        <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                            <div className="col-3" style={{marginBottom:0}}>
                                <FieldEdit
                                    variant="outlined"
                                    valueDefault={newShift.shiftname}
                                    onChange={(value) => {
                                        setNewShift({...newShift, shiftname: value})
                                        setShiftNameError(false)
                                    }}
                                />
                            </div>
                            <div className="col-4"  style={{marginBottom:0}}>
                                <FieldEdit
                                    type="time"
                                    variant="outlined"
                                    valueDefault={newShift.starttime}
                                    onChange={(value) => {
                                        setNewShift({...newShift, starttime: value})
                                        setShiftNameError(false)
                                    }}
                                />
                            </div>
                            <div className="col-4" style={{marginBottom:0}}>
                                <FieldEdit
                                    type="time"
                                    variant="outlined"
                                    valueDefault={newShift.endtime}
                                    onChange={(value) => {
                                        setNewShift({...newShift, endtime: value})
                                        setShiftNameError(false)
                                    }}
                                />
                            </div>
                            <div className="col-1" style={{display: 'flex', marginBottom:0}}>
                            {isAding ? (
                                <div className={`${classes.flex} col-1`}>
                                    <IconButton onClick={handleSaveNewShift}>
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
                            </div>
                        </div>
                        {shiftNameError && (
                            <span style={{color: 'red'}}>
                                {(newShift.shiftname === '' || newShift.starttime === '' || newShift.endtime === '') ? t(langKeys.completeallfields) : t(langKeys.shiftnamealreadyexist)}
                            </span>
                        )}
                    </>
                ): (
                    <Button
                        style={{color: 'white', backgroundColor: '#7721AD', width: '20%'}}
                        onClick={() => setIsAding(true)}
                    >
                        {`${t(langKeys.new)} ${t(langKeys.shift)}`}
                    </Button>
                )}
                <div className={classes.button}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={handleClose}
                    >
                        {t(langKeys.back)}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"                    
                        onClick={handleSave}
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

export default DeliverySchedulesDialog;
