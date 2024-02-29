import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { FieldEdit } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import TableZyx from "components/fields/table-simple";
import { Typography } from "@material-ui/core";
import InvoiceA4Dialog from "../../dialogs/InvoiceA4Dialog";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    button: {
        marginRight: theme.spacing(2),
    },
    paymentreceipt: {
        fontSize: "0.9rem",
        fontWeight: "lighter",
        padding: "0 0 0.3rem 0",
    },
    span: {
        color: "blue",
        textDecoration: "underline solid",
        cursor: "pointer",
    },
    mapimage: {
        display: "flex",
        textAlign: "center",
        width: "100%",
        height: "10rem",
        objectFit: "cover",
    },
    subtitle: {
        fontSize: "2rem",
        paddingBottom: "0.5rem",
    },
    totalammount: {
        textAlign: "right",
        padding: "2rem 2rem 0 0",
        fontSize: "1rem",
    },
}));

interface InformationTabDetailProps {
    row: Dictionary | null;
    setValue: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    errors: FieldErrors;
}

const InformationTabDetail: React.FC<InformationTabDetailProps> = ({ row, setValue, getValues, errors }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [openModalInvoiceA4, setOpenModalInvoiceA4] = useState(false);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_delete),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
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

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.description),
                accessor: "description",
                width: "auto",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.currency),
                accessor: "currency",
                width: "auto",
            },
            {
                Header: t(langKeys.unitaryprice),
                accessor: "unitaryprice",
                width: "auto",
            },
            {
                Header: t(langKeys.totalamount),
                accessor: "totalamount",
                width: "auto",
            },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.clientfullname)}
                        className="col-8"
                        type="text"
                        disabled={true}
                        valueDefault={row?.name}
                    />
                    <FieldEdit
                        label={t(langKeys.contactnum)}
                        className="col-4"
                        type="number"
                        disabled={true}
                        valueDefault={row?.phone}
                    />
                </div>

                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.deliverydate)}
                        className="col-4"
                        type="date"
                        valueDefault={row?.deliverydate}
                    />
                    <FieldEdit
                        label={t(langKeys.ticket_number)}
                        className="col-4"
                        type="number"
                        disabled={true}
                    />
                    <div className="col-4">
                        <Typography className={classes.paymentreceipt}>{t(langKeys.paymentreceipt)}</Typography>
                        <span className={classes.span} onClick={() => setOpenModalInvoiceA4(true)}>
                            {t(langKeys.viewonlinepayment)}
                        </span>
                    </div>
                </div>
                <div className="row-zyx">
                    <div style={{ paddingBottom: "2rem" }}>
                        <FieldEdit
                            label={t(langKeys.registeredaddress)}
                            className="col-12"
                            type="text"
                            disabled={true}
                            valueDefault={row?.deliveryaddress}
                        />
                    </div>
                    <div className="col-4">
                        <img
                            className={classes.mapimage}
                            src="https://i0.wp.com/www.cssscript.com/wp-content/uploads/2018/03/Simple-Location-Picker.png?fit=561%2C421&ssl=1"
                            alt="map"
                        ></img>
                    </div>
                    <div className="col-4" style={{ padding: "0rem 2rem 1rem 0" }}>
                        <div style={{ paddingBottom: "2rem" }}>
                            <FieldEdit
                                label={t(langKeys.latitude)}
                                className="col-3"
                                type="number"
                                disabled={true}
                                valueDefault={row?.latitude}
                            />
                        </div>
                        <div style={{ paddingBottom: "2rem" }}>
                            <FieldEdit
                                label={t(langKeys.longitude)}
                                className="col-3"
                                type="number"
                                disabled={true}
                                valueDefault={row?.longitude}
                            />
                        </div>
                    </div>
                    <div className="col-4" style={{ padding: "0rem 2rem 1rem 0" }}>
                        <div style={{ paddingBottom: "2rem" }}>
                            <FieldEdit
                                label={t(langKeys.carriername)}
                                className="col-3"
                                type="text"
                                disabled={true}
                            />
                        </div>
                        <div style={{ paddingBottom: "1rem" }}>
                            <FieldEdit
                                label={t(langKeys.deliveryaddress)}
                                className="col-3"
                                type="text"
                                disabled={true}
                                valueDefault={row?.deliveryaddress}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Typography className={classes.subtitle}>{t(langKeys.orderlist)}</Typography>
            <div className="row-zyx">
                <TableZyx columns={columns} data={[]} filterGeneral={false} toolsFooter={false} />
            </div>
            <Typography className={classes.totalammount}>{t(langKeys.total) + ": S/0.00"}</Typography>
            <InvoiceA4Dialog openModal={openModalInvoiceA4} setOpenModal={setOpenModalInvoiceA4} />
        </div>
    );
};

export default InformationTabDetail;
