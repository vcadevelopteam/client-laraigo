import { Button, Typography, makeStyles } from "@material-ui/core";
import { DialogZyx } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import { useSelector } from "hooks";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Dictionary } from "@types";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { updateOrderOnlyStatus } from "common/helpers";

const useStyles = makeStyles(() => ({
    button: {
        display: "flex", 
        gap: "10px", 
        alignItems: "center", 
        justifyContent: "end", 
    },
}));

const DeliveredDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    fetchData: () => void;
    rows: Dictionary[];
}> = ({ openModal, setOpenModal, fetchData, rows }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSaveChangeStatus, setWaitSaveChangeStatus] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const [paid, setPaid] = useState(false);

    const handleClose = () => {
        setPaid(false);
        setOpenModal(false);
    }

    const deliverOrder = () => {
        if(paid) {
            dispatch(showBackdrop(true));
            dispatch(execute(updateOrderOnlyStatus({
                listorderid: rows.map(row => row.orderid).join(','),
                orderstatus: 'delivered',
            })))
            setWaitSaveChangeStatus(true);
        } else {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.needtopay),
                })
            );
        }
    }

    useEffect(() => {
        if (waitSaveChangeStatus) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveChangeStatus(false);
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_update),
                    })
                );
                handleClose()
                fetchData()
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveChangeStatus(false);
            }
        }
    }, [executeResult, waitSaveChangeStatus]);

    return (
        <DialogZyx open={openModal} title={t(langKeys.delivered)} maxWidth="sm">
            <div className="row-zyx" style={{ justifyContent: "center" }}>
                <Button
                    variant="contained"
                    className="col-6"
                    type="button"
                    color="primary"
                    disabled={paid}
                    startIcon={<AttachMoneyIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={() => setPaid(true)}
                >
                    {t(langKeys.chargeorder)}
                </Button>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5}}>
                    <Typography />{t(langKeys.chargeamount) + rows?.[0]?.amount}
                    {paid && (
                        <CheckCircleOutlineIcon style={{color: 'green'}}/>
                    )}
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
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    startIcon={<SaveIcon color="secondary" />}
                    style={{ backgroundColor: "#55BD84" }}
                    onClick={deliverOrder}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default DeliveredDialog;
