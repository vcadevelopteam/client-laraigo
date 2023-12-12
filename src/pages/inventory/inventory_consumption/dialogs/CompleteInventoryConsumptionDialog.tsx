import { Button, makeStyles } from "@material-ui/core";
import {
  DialogZyx,
  FieldEdit,
  FieldSelect
} from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { inventoryConsumptionComplete } from "common/helpers";
import { execute } from "store/main/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
}));

const CompleteInventoryConsumptionDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    setViewSelected: (dat: string) => void;
    row: Dictionary | null;
}> = ({ openModal, setOpenModal, row, setViewSelected }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const multiData = useSelector((state) => state.main.multiDataAux);
    const executeRes = useSelector((state) => state.main.execute);
    const {
        register,
        handleSubmit: handleMainSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            inventoryconsumptionid: row?.inventoryconsumptionid,
            status: "COMPLETADO",
            comment: "",
            type: "NINGUNO",
        },
    });

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_inventoryconsumption),
                    })
                );
                dispatch(showBackdrop(false));
                reset();
                setOpenModal(false);
                setViewSelected("main-view");
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code ?? "error_unexpected_error", {
                    module: t(langKeys.inventorybalance).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave]);

    React.useEffect(() => {
        register("comment");
        register("status", {
            validate: (value) => (value && value.length > 0 ? true : String(t(langKeys.field_required))),
        });
    }, [register, openModal]);

    const submitData = handleMainSubmit((data) => {
        dispatch(showBackdrop(true));
        dispatch(execute(inventoryConsumptionComplete(data)));
        setWaitSave(true);
    });

    return (
        <form onSubmit={submitData}>
            <DialogZyx
                open={openModal}
                title={`${t(langKeys.complete)} ${t(langKeys.inventory_consumption).toLocaleLowerCase()}`}
                maxWidth="sm"
            >
                <div className="row-zyx">
                    <FieldSelect
                        label={`${t(langKeys.new)} ${t(langKeys.status)}`}
                        className="col-12"
                        data={multiData?.data?.[0]?.data || []}
                        optionValue="domainvalue"
                        optionDesc="domaindesc"
                        valueDefault={getValues("status")}
                        error={errors?.status?.message}
                        onChange={(value) => setValue("status", value.domainvalue)}
                    />
                    <FieldEdit
                        label={t(langKeys.ticket_comment)}
                        type="text"
                        valueDefault={getValues("comment")}
                        className="col-12"
                        onChange={(value) => {
                            setValue("comment", value);
                        }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => {
                            setOpenModal(false);
                            reset();
                        }}
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
                        onClick={submitData}
                    >
                        {t(langKeys.save)}
                    </Button>
                </div>
            </DialogZyx>
        </form>
    );
};

export default CompleteInventoryConsumptionDialog;