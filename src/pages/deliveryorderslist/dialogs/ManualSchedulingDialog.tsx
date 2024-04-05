import { Button, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { format } from "date-fns";
import { Dictionary } from "@types";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { updateOrderSchedule } from "common/helpers";

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

const ManualSchedulingDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    config: Dictionary;
    fetchData: (flag: boolean) => void;
    rows: Dictionary[];
}> = ({ openModal, setOpenModal, config, fetchData, rows }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const signatureDateDefault = format(new Date(), "yyyy-MM-dd");
    const [dateSelected, setDateSelected] = useState(signatureDateDefault)
    const [shift, setShift] = useState('')
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);

    const handleClose = () => {
        setOpenModal(false);
        setDateSelected(signatureDateDefault)
        setShift('')
    }

    const changeStatus = () => {
        if(dateSelected >= signatureDateDefault) {
            dispatch(showBackdrop(true));
            dispatch(execute(updateOrderSchedule({
                listorderid: rows.map(row => row.orderid).join(','),
                deliveryshift: shift,
                scheduledeliverydate: dateSelected,
                orderstatus: 'scheduled',
            })))
            setWaitSave(true);
        } else {
            dispatch(
                showSnackbar({
                    show: true,
                    severity: "error",
                    message: t(langKeys.incorrectdate),
                })
            );
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
        <DialogZyx open={openModal} title={t(langKeys.manualscheduling)} maxWidth="sm">
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
                    onClick={changeStatus}
                >
                    {t(langKeys.save)}
                </Button>
            </div>
        </DialogZyx>
    );
};

export default ManualSchedulingDialog;
