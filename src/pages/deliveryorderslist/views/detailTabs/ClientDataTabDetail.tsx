import React from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit, TitleDetail } from "components";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
}

const ClientDataTabDetail: React.FC<InventoryTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className="col-8">
                    <TitleDetail title={t(langKeys.clientdata)} />
                </div>
                <div className="col-4">
                    <TitleDetail title={t(langKeys.receptionistdata)} />
                </div>
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.documenttype}
                />
                <FieldEdit
                    label={t(langKeys.contactnum)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.phone}
                />
                <FieldEdit
                    label={t(langKeys.documenttype)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.documenttypereceiver}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.documentnumber}
                />
                <FieldEdit
                    label={t(langKeys.email)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.email}
                />
                <FieldEdit
                    label={t(langKeys.documentnumber)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.documentnumberreceiver}
                />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.clientfullname)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.name}
                />
                <FieldEdit
                    label={t(langKeys.willdeliveryhappen)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.deliveryreceiver}
                />
                <FieldEdit
                    label={t(langKeys.fullname) + " (" + t(langKeys.optional) + ")"}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.fullnamereceiver}
                />
            </div>
            <div className="row-zyx" style={{ paddingTop: "20px" }}>
                <FieldEdit
                    label={t(langKeys.paymentmethod)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.paymentmethod}
                />
                <FieldEdit
                    label={t(langKeys.deliverytype)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.deliverytype}
                />
                <FieldEdit
                    label={t(langKeys.vouchertype)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.payment_document_type}
                />
            </div>
            <div className="row-zyx">
                <TitleDetail title={t(langKeys.data4voucher)} />
            </div>
            <div className="row-zyx">
                <FieldEdit
                    label={t(langKeys.rucnumber)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.payment_document_number}
                />
                <FieldEdit
                    label={t(langKeys.businessname)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.payment_businessname}
                />
                <FieldEdit
                    label={t(langKeys.address)}
                    disabled={true}
                    className="col-4"
                    valueDefault={row?.person_address}
                />
            </div>
        </div>
    );
};

export default ClientDataTabDetail;
