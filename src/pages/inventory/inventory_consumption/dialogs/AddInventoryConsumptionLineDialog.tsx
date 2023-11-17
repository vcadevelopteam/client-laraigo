/* eslint-disable react-hooks/exhaustive-deps */
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { DialogZyx, FieldEdit, FieldSelect, FieldView } from "components";
import { langKeys } from "lang/keys";
import React, { useEffect, useState } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks";
import { useForm } from "react-hook-form";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import TableSelectionDialog from "./TableSelectionDialog";
import { Add } from "@material-ui/icons";
import { execute, getCollection } from "store/main/actions";
import { getInventoryConsumptionDetail, inventoryConsumptionDetailIns } from "common/helpers/requestBodies";
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(2),
    },
}));

const AddInventoryConsumptionLineDialog: React.FC<{
    openModal: boolean;
    setOpenModal: (dat: boolean) => void;
    row: any;
    warehouseProducts: any;
    rowSelected: any;
    updateRecords: (dat: any) => void;
    edit: boolean;
    editRow: boolean;
}> = ({ openModal, setOpenModal, row, rowSelected, updateRecords, editRow, edit, warehouseProducts }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector((state) => state.main.execute);
    const multiData = useSelector((state) => state.main.multiDataAux);
    const user = useSelector((state) => state.login.validateToken.user);
    const [openModalProduct, setOpenModalProduct] = useState(false);
    const [openModalUser, setOpenModalUser] = useState(false);

    const {
        register,
        handleSubmit: handleMainSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            inventoryconsumptiondetailid: rowSelected?.row?.inventoryconsumptiondetailid || 0,
            p_tableid: row?.inventoryconsumptionid || 0,
            line: rowSelected?.row?.line || 0,
            productid: rowSelected?.row?.productid || 0,
            description: rowSelected?.row?.description || "",
            fromshelf: rowSelected?.row?.fromshelf || "",
            fromlote: rowSelected?.row?.fromlote || "",
            ticketnumber: rowSelected?.row?.ticketnumber || "",
            transactiontype: rowSelected?.row?.transactiontype || "",
            quantity: rowSelected?.row?.quantity || 0,
            unitcost: rowSelected?.row?.unitcost || 0,
            dispatchto: rowSelected?.row?.dispatchto || "",
            createby: row?.createby || user?.usr,
            comment: rowSelected?.row?.comment || "",
            realdate: rowSelected?.row?.realdate
                ? new Date(rowSelected.row.realdate).toISOString().split("T")[0]
                : null,
            status: rowSelected?.row?.status || "ACTIVO",
            type: rowSelected?.row?.type || "NINGUNO",
            productcode: rowSelected?.row?.productcode || "",
            operation: editRow ? "EDIT" : "INSERT",
        },
    });

    useEffect(() => {
        if (openModal) {
            reset({
                inventoryconsumptiondetailid: rowSelected?.row?.inventoryconsumptiondetailid || 0,
                p_tableid: row?.inventoryconsumptionid || 0,
                line: rowSelected?.row?.line || 0,
                productid: rowSelected?.row?.productid || 0,
                description: rowSelected?.row?.description || "",
                fromshelf: rowSelected?.row?.fromshelf || "",
                fromlote: rowSelected?.row?.fromlote || "",
                ticketnumber: rowSelected?.row?.ticketnumber || "",
                transactiontype: rowSelected?.row?.transactiontype || "",
                quantity: rowSelected?.row?.quantity || 0,
                unitcost: rowSelected?.row?.unitcost || 0,
                dispatchto: rowSelected?.row?.dispatchto || "",
                createby: row?.createby || user?.usr,
                comment: rowSelected?.row?.comment || "",
                realdate: rowSelected?.row?.realdate
                    ? new Date(rowSelected.row.realdate).toISOString().split("T")[0]
                    : null,
                status: rowSelected?.row?.status || "ACTIVO",
                type: rowSelected?.row?.type || "NINGUNO",
                productcode: rowSelected?.row?.productcode || "",
                operation: editRow ? "EDIT" : "INSERT",
            });
        }
    }, [openModal]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_register),
                    })
                );
                dispatch(showBackdrop(false));
                reset();
                dispatch(getCollection(getInventoryConsumptionDetail(row?.inventoryconsumptionid || 0)));
                setOpenModal(false);
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
        register("inventoryconsumptiondetailid");
        register("p_tableid");
        register("line");
        register("productid", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("description");
        register("fromshelf");
        register("fromlote");
        register("ticketnumber");
        register("quantity", { validate: (value) => (value && value > 0) || t(langKeys.field_required) });
        register("unitcost");
        register("dispatchto");
        register("createby");
        register("comment");
        register("realdate");
        register("status");
        register("type");
        register("transactiontype", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register("operation");
        register("productcode", { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register, openModal]);

    function setProduct(selectedRow: any) {
        setValue("productid", selectedRow.productid);
        setValue("productcode", selectedRow.productcode);
        setValue("description", selectedRow.productdescription);
        setValue("unitcost", parseFloat(selectedRow.priceunit));
    }
    function setUser(selectedRow: any) {
        setValue("createby", selectedRow.usr);
    }

    const submitData = handleMainSubmit((data) => {
        const onlinecost = data.unitcost * data.quantity;
        if (!edit) {
            if (rowSelected?.edit) {
                updateRecords &&
                    updateRecords((p: Dictionary[]) =>
                        p.map((x) =>
                            x.productid === rowSelected?.row?.productid || ""
                                ? { ...x, ...data, onlinecost, operation: "INSERT" }
                                : x
                        )
                    );
            } else
                updateRecords &&
                    updateRecords((p: Dictionary[]) => [
                        ...p,
                        { ...data, onlinecost, status: rowSelected?.row?.status || "ACTIVO" },
                    ]);

            setOpenModal(false);
        } else {
            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(execute(inventoryConsumptionDetailIns({ ...data, onlinecost })));
                setWaitSave(true);
            };
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                })
            );
        }
    });

    const columnsSelectionUser = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: "firstname",
                width: "auto",
            },
            {
                Header: t(langKeys.lastname),
                accessor: "lastname",
                width: "auto",
            },
            {
                Header: t(langKeys.user),
                accessor: "usr",
                width: "auto",
            },
            {
                Header: t(langKeys.email),
                accessor: "email",
                width: "auto",
            },
        ],
        []
    );

    const columnsSelectionProduct = React.useMemo(
        () => [
            {
                Header: t(langKeys.product),
                accessor: "productcode",
                width: "auto",
            },
            {
                Header: t(langKeys.description),
                accessor: "productdescription",
                width: "auto",
            },
            {
                Header: t(langKeys.family),
                accessor: "familydescription",
                width: "auto",
            },
            {
                Header: t(langKeys.subfamily),
                accessor: "subfamilydescription",
                width: "auto",
            },
        ],
        []
    );

    return (
        <form onSubmit={submitData}>
            <DialogZyx open={openModal} title={t(langKeys.inventoryconsumptionlines)} maxWidth="lg">
                <div className="row-zyx">
                    <div className="row-zyx col-4">
                        <FieldEdit
                            disabled
                            label={t(langKeys.line)}
                            className="col-6"
                            valueDefault={getValues("line")}
                        />
                    </div>
                    <div className="row-zyx col-4">
                        <FieldEdit
                            label={t(langKeys.originshelf)}
                            className="col-6"
                            disabled={edit}
                            valueDefault={getValues("fromshelf")}
                            onChange={(value) => {
                                setValue("fromshelf", value);
                            }}
                        />
                    </div>
                    <FieldEdit
                        label={t(langKeys.quantity)}
                        className="col-2"
                        disabled={edit}
                        type="number"
                        valueDefault={getValues("quantity")}
                        error={errors?.quantity?.message}
                        onChange={(value) => {
                            setValue("quantity", value);
                        }}
                    />
                    <FieldEdit
                        label={t(langKeys.dispatchto)}
                        type="text"
                        valueDefault={getValues("dispatchto")}
                        className="col-2"
                        maxLength={50}
                        onChange={(value) => {
                            setValue("dispatchto", value);
                        }}
                    />
                    <div className="row-zyx col-4">
                        <FieldSelect
                            label={t(langKeys.transactiontype)}
                            className="col-6"
                            valueDefault={getValues("transactiontype")}
                            onChange={(e) => setValue("transactiontype", e?.domainvalue || "")}
                            error={errors?.transactiontype?.message}
                            data={multiData?.data?.[2]?.data || []}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx col-4">
                        <FieldEdit
                            label={t(langKeys.originbatch)}
                            type="text"
                            valueDefault={getValues("fromlote")}
                            className="col-6"
                            onChange={(value) => {
                                setValue("fromlote", value);
                            }}
                        />
                    </div>
                    <FieldEdit
                        label={t(langKeys.unitcost)}
                        className="col-2"
                        valueDefault={getValues("unitcost")}
                        disabled
                    />
                    <FieldEdit
                        label={t(langKeys.createdBy)}
                        className="col-2"
                        valueDefault={getValues("createby")}
                        error={(errors?.createby?.message as string) ?? ""}
                        disabled
                        InputProps={
                            !edit
                                ? {
                                      endAdornment: (
                                          <IconButton
                                              onClick={() => {
                                                  setOpenModalUser(true);
                                              }}
                                          >
                                              <Add />
                                          </IconButton>
                                      ),
                                  }
                                : {}
                        }
                    />
                    <FieldEdit
                        label={t(langKeys.product)}
                        className="col-2"
                        valueDefault={getValues("productcode")}
                        error={(errors?.productcode?.message as string) ?? ""}
                        disabled
                        InputProps={
                            !edit
                                ? {
                                      endAdornment: (
                                          <IconButton
                                              onClick={() => {
                                                  setOpenModalProduct(true);
                                              }}
                                          >
                                              <Add />
                                          </IconButton>
                                      ),
                                  }
                                : {}
                        }
                    />
                    <FieldEdit
                        disabled
                        label={t(langKeys.description)}
                        className="col-2"
                        valueDefault={getValues("description")}
                    />
                    <div className="row-zyx col-4">
                        <FieldEdit
                            disabled={edit}
                            label={t(langKeys.ticketapplication)}
                            className="col-4"
                            valueDefault={getValues("ticketnumber")}
                            onChange={(value) => {
                                setValue("ticketnumber", value);
                            }}
                            maxLength={36}
                        />
                    </div>
                    <FieldEdit
                        label={t(langKeys.linecost)}
                        className="col-2"
                        disabled
                        valueDefault={getValues("unitcost") * getValues("quantity")}
                    />
                    <FieldEdit
                        label={t(langKeys.realdate)}
                        type="date"
                        valueDefault={new Date(rowSelected?.row?.realdate || null).toISOString().split("T")[0]}
                        className="col-2"
                        onChange={(value) => {
                            setValue("realdate", value);
                        }}
                    />
                    <div className="row-zyx col-6"></div>
                    <div className="row-zyx col-6">
                        <FieldEdit
                            label={t(langKeys.ticket_comment)}
                            type="text"
                            maxLength={256}
                            valueDefault={getValues("comment")}
                            onChange={(value) => {
                                setValue("comment", value);
                            }}
                        />
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
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

            <TableSelectionDialog
                openModal={openModalProduct}
                setOpenModal={setOpenModalProduct}
                setRow={setProduct}
                data={warehouseProducts}
                columns={columnsSelectionProduct}
                title={t(langKeys.product)}
            />
            <TableSelectionDialog
                openModal={openModalUser}
                setOpenModal={setOpenModalUser}
                setRow={setUser}
                data={multiData?.data?.[3]?.data || []}
                columns={columnsSelectionUser}
                title={t(langKeys.user)}
            />
        </form>
    );
};

export default AddInventoryConsumptionLineDialog;
