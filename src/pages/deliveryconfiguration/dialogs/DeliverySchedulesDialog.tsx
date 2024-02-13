import { makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dictionary } from "@types";

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
}> = ({ openModal, setOpenModal, onMainSubmit, configjson, setConfigjson }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const handleSave = () => {
        onMainSubmit();
    }

    return (
        <DialogZyx open={openModal} title={t(langKeys.deliveryshifts)} maxWidth="md" buttonText0={t(langKeys.close)} buttonText1={t(langKeys.save)} handleClickButton0={() => setOpenModal(false)} handleClickButton1={handleSave}>
            <div className="row-zyx">
                <div className="row-zyx">
                    <div className="col-4">{t(langKeys.shift)}</div>
                    <div className="col-4">{t(langKeys.from)}</div>
                    <div className="col-4">{t(langKeys.until)}</div>
                </div>
                <div className="row-zyx">
                    <div className="col-4">Mañana</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.morningStartTime}
                        onChange={(value) => setConfigjson({...configjson, morningStartTime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.morningEndTime}
                        onChange={(value) => setConfigjson({...configjson, morningEndTime: value})}
                    />
                </div>
                <div className="row-zyx">
                    <div className="col-4">Tarde</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.afternoonStartTime}
                        onChange={(value) => setConfigjson({...configjson, afternoonStartTime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.afternoonEndTime}
                        onChange={(value) => setConfigjson({...configjson, afternoonEndTime: value})}
                    />
                </div>
                <div className="row-zyx">
                    <div className="col-4">Noche</div>
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.nightStartTime}
                        onChange={(value) => setConfigjson({...configjson, nightStartTime: value})}
                    />
                    <FieldEdit
                        type="time"
                        variant="outlined"
                        className="col-4"
                        valueDefault={configjson.nightEndTime}
                        onChange={(value) => setConfigjson({...configjson, nightEndTime: value})}
                    />
                </div>
            </div>
        </DialogZyx>
    );
};

export default DeliverySchedulesDialog;
