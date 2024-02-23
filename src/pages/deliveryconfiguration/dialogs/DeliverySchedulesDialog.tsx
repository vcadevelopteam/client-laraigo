import { IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types";
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
}));

const DeliverySchedulesDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    onMainSubmit: () => void;
    configjson: Dictionary;
    setConfigjson: (data: any) => void;
    fetchOriginalConfig: () => void;
}> = ({ openModal, setOpenModal, onMainSubmit, configjson, setConfigjson, fetchOriginalConfig }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const handleSave = () => {
        onMainSubmit();
    }

    const handleCleanMorningRow = () => {
        setConfigjson({...configjson, morningstarttime: null, morningendtime: null})
    }

    const handleCleanAfternoonRow = () => {
        setConfigjson({...configjson, afternoonstarttime: null, afternoonendtime: null})
    }

    const handleCleanNightRow = () => {
        setConfigjson({...configjson, nightstarttime: null, nightendtime: null})
    }

    const handleClose = () => {
        fetchOriginalConfig()
        setOpenModal(false)
    }

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.deliveryshifts)}
            maxWidth="md"
            buttonText0={t(langKeys.close)}
            buttonText1={t(langKeys.save)}
            handleClickButton0={handleClose}
            handleClickButton1={handleSave}
        >
            <div className="row-zyx" style={{marginBottom: 0}}>
                <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                    <div className="col-3">{t(langKeys.shift)}</div>
                    <div className="col-4">{t(langKeys.from)}</div>
                    <div className="col-4">{t(langKeys.until)}</div>
                </div>
                <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                    <div className="col-3" style={{display:'flex', justifyContent: 'center'}}>Mañana</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.morningstarttime || ''}
                        onChange={(value) => setConfigjson({...configjson, morningstarttime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.morningendtime || ''}
                        onChange={(value) => setConfigjson({...configjson, morningendtime: value})}
                    />
                    <div className="col-1">
                        <IconButton onClick={handleCleanMorningRow}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                    <div className="col-3" style={{display:'flex', justifyContent: 'center'}}>Tarde</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.afternoonstarttime || ''}
                        onChange={(value) => setConfigjson({...configjson, afternoonstarttime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.afternoonendtime || ''}
                        onChange={(value) => setConfigjson({...configjson, afternoonendtime: value})}
                    />
                    <div className="col-1">
                        <IconButton onClick={handleCleanAfternoonRow}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                    <div className="col-3" style={{display:'flex', justifyContent: 'center'}}>Noche</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.nightstarttime || ''}
                        onChange={(value) => setConfigjson({...configjson, nightstarttime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.nightendtime || ''}
                        onChange={(value) => setConfigjson({...configjson, nightendtime: value})}
                    />
                    <div className="col-1">
                        <IconButton onClick={handleCleanNightRow}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>
                </div>
            </div>
        </DialogZyx>
    );
};

export default DeliverySchedulesDialog;
