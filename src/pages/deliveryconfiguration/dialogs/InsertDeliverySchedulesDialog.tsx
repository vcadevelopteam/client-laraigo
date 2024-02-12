import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
}));

interface DeliveryShift {
    shift: string;
    startTime: string;
    endTime: string;
}

interface RowSelected {
    row2: Dictionary | null;
    edit: boolean;
}

const InsertDeliverySchedulesDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    setNewShift: (shift: DeliveryShift) => void;
    newShift: DeliveryShift;
    onMainSubmit: () => void;
    data: RowSelected;
}> = ({ openModal, setOpenModal, setNewShift, newShift, onMainSubmit, data:{row2, edit} }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const shifts = [
        {
            domainvalue: 'Mañana',
            domaindesc: 'Mañana',
        },
        {
            domainvalue: 'Tarde',
            domaindesc: 'Tarde',
        },
        {
            domainvalue: 'Noche',
            domaindesc: 'Noche',
        },
    ]

    const handleAddShift = () => {
        setOpenModal(false);
        onMainSubmit()
    }

    return (
        <DialogZyx open={openModal} title={t(langKeys.deliveryshifts)} maxWidth="sm">
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.shifts)}
                    className="col-4"
                    data={shifts}
                    valueDefault={edit ? row2?.shift : newShift.shift}
                    onChange={(value) => setNewShift({...newShift, shift: value.domainvalue})}
                    optionValue="domainvalue"
                    optionDesc="domaindesc"
                />
                <div className="col-2"></div>
                <FieldEdit
                    label={t(langKeys.from)}
                    type="time"
                    className="col-3"
                    valueDefault={edit ? row2?.startTime : newShift.startTime}
                    onChange={(value) => setNewShift({...newShift, startTime: value})}
                />
                <FieldEdit
                    label={t(langKeys.until)}
                    type="time"
                    className="col-3"
                    valueDefault={edit ? row2?.endTime : newShift.endTime}
                    onChange={(value) => setNewShift({...newShift, endTime: value})}
                />
            </div>
            <div className={classes.button}>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<ClearIcon color="secondary" />}
                    style={{ backgroundColor: "#FB5F5F" }}
                    onClick={() => {
                        setOpenModal(false);
                    }}
                >
                    {t(langKeys.back)}
                </Button>
                <Button
                    variant="contained"
                    type="button"
                    color="primary"
                    startIcon={<AddIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={handleAddShift}
                >
                    {t(langKeys.add)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default InsertDeliverySchedulesDialog;
