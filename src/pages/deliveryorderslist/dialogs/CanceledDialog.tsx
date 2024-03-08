import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useSelector } from "hooks";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
}));

const CanceledDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
}> = ({ openModal, setOpenModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const multiData = useSelector(state => state.main.multiData);
    const [motive, setMotive] = useState('')

    const handleClose = () => {
        setOpenModal(false);
        setMotive('')
    }

    return (
        <DialogZyx open={openModal} title={t(langKeys.cancel)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <FieldSelect
                    label={t(langKeys.selectcancellationreason)}
                    className="col-12"
                    data={multiData?.data?.[0]?.data.filter((motive) => { return motive.type === 'CANCEL' }) || []}
                    valueDefault={motive}
                    onChange={(value) => {
                        if(value) {
                            setMotive(value.reasonnondeliveryid)
                        } else {
                            setMotive('')
                        }
                    }}
                    optionValue="reasonnondeliveryid"
                    optionDesc="description"
                />
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
                    className={classes.button}
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

export default CanceledDialog;
