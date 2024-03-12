import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { updateOrderDispatched } from "common/helpers";
import { Dictionary } from "@types";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "end",
    },
}));

const AssignCarrierDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    fetchData: (flag: boolean) => void;
    row: Dictionary[];
}> = ({ openModal, setOpenModal, fetchData, row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const multiData = useSelector(state => state.main.multiData);
    const [carrier, setCarrier] = useState(0)
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);

    const handleClose = () => {
        setOpenModal(false);
        setCarrier(0)
    }

    const changeStatus = () => {
        if(carrier !== 0) {
            dispatch(showBackdrop(true));
            dispatch(execute(updateOrderDispatched({
                code: row[0].code,
                orderstatus: 'shipped',
                userid: carrier,
            })))
            setWaitSave(true);
        }
    }

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSave(false);
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_update),
                    })
                );
                handleClose()
                fetchData(true)
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    return (
        <DialogZyx open={openModal} title={t(langKeys.assigncarrier)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <FieldSelect
                    label={t(langKeys.selectcarrier)}
                    className="col-12"
                    data={multiData?.data?.[2]?.data || []}
                    valueDefault={carrier}
                    onChange={(value) => {
                        if(value) {
                            setCarrier(value.userid)
                        } else {
                            setCarrier(0)
                        }
                    }}
                    optionValue="userid"
                    optionDesc="name"
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
                    onClick={changeStatus}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default AssignCarrierDialog;
