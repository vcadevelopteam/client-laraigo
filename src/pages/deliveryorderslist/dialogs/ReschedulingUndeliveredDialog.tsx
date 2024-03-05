import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { format } from "date-fns";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
    rescheduleForm : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        gap: '1rem'
    },
}));

const ReschedulingUndeliveredDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    config: Dictionary;
}> = ({ openModal, setOpenModal, config }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const signatureDateDefault = format(new Date(), "yyyy-MM-dd");
    const [dateSelected, setDateSelected] = useState(signatureDateDefault)
    const [shift, setShift] = useState('')

    const handleClose = () => {
        setOpenModal(false);
        setDateSelected(signatureDateDefault)
        setShift('')
    }
    
    return (
        <DialogZyx open={openModal} title={t(langKeys.rescheduling) + " - " + t(langKeys.undelivered)} maxWidth="sm">
            <div className={classes.rescheduleForm}>
                <div style={{width: 150}}>
                    <FieldEdit
                        label={t(langKeys.selectdate)}
                        type="date"
                        valueDefault={dateSelected}
                        onChange={(value) => setDateSelected(value)}
                    />
                </div>
                <div style={{width: 150}}>
                    <FieldSelect
                        label={t(langKeys.selectshift)}
                        data={config?.deliveryshifts || []}
                        valueDefault={shift}
                        onChange={(value) => {
                            if(value) {
                                setShift(value.shiftname)
                            } else {
                                setShift('')
                            }
                        }}
                        optionValue="shiftname"
                        optionDesc="shiftname"
                    />
                </div>
            </div>
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
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default ReschedulingUndeliveredDialog;
