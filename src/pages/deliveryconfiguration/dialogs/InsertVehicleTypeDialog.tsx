import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit } from "components";
import { langKeys } from "lang/keys";
import React from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
}));

const InsertVehicleTypeDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <DialogZyx open={openModal} title={t(langKeys.vehicletype)} maxWidth="md">
            <div className="row-zyx">
                <FieldEdit label={t(langKeys.vehicle)} className="col-6" />
                <FieldEdit label={t(langKeys.insuredamount)} className="col-6" />
                <FieldEdit label={t(langKeys.averagespeed)} type="number" className="col-6" />
                <FieldEdit label={t(langKeys.capacity)} type="number" className="col-6" />
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
                >
                    {t(langKeys.add)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default InsertVehicleTypeDialog;
