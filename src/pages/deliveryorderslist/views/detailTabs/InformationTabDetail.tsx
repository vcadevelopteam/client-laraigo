import React, { useState } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit } from "components";
import { useSelector } from "hooks";
import TableZyx from "components/fields/table-simple";
import { Typography } from "@material-ui/core";
import MapLeaflet from "components/fields/MapLeaflet";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    paymentreceipt: {
        fontSize: "0.9rem",
        fontWeight: 'bold',
        padding: "0 0 0.3rem 0",
    },
    span: {
        color: "blue",
        textDecoration: "underline solid",
        cursor: "pointer",
    },
    subtitle: {
        fontSize: "2rem",
        paddingBottom: "0.5rem",
    },
    totalammount: {
        textAlign: "right",
        marginTop: "1rem",
        paddingRight: "2rem",
        fontSize: "1rem",
    },
}));

interface InformationTabDetailProps {
    row: Dictionary | null;
}

const InformationTabDetail: React.FC<InformationTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const productsData = useSelector((state) => state.main.mainAux2);

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
                width: "10%",
            },
            {
                Header: t(langKeys.currency),
                accessor: "currency",
                width: "10%",
            },
            {
                Header: t(langKeys.unitaryprice),
                accessor: "unitprice",
                width: "10%",
            },
            {
                Header: t(langKeys.totalamount),
                accessor: "amount",
                width: "10%",
            },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx" style={{marginBottom: 0}}>
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
                        valueDefault={row?.ticketnum}
                    />
                    <div className="col-4">
                        <Typography className={classes.paymentreceipt}>{t(langKeys.paymentreceipt)}</Typography>
                        <span className={classes.span} onClick={() => window.open(row?.url_payment)}>
                            {t(langKeys.viewonlinepayment)}
                        </span>
                    </div>
                </div>
                <div style={{ paddingBottom: "0.5rem" }}>
                    <Typography className={classes.paymentreceipt}>{t(langKeys.registeredaddress)}</Typography>
                </div>
                <div className="row-zyx" style={{marginBottom: 0, display: 'flex', alignItems: 'center'}}>
                    <div className="col-6">
                        <MapLeaflet
                            height={200}
                            marker={row && { lat: parseFloat(row?.latitude || 0), lng: parseFloat(row?.longitude || 0) }}
                        />
                    </div>
                    <div className="col-3">
                        <div style={{ paddingBottom: "2rem" }}>
                            <FieldEdit
                                label={t(langKeys.latitude)}
                                className="col-3"
                                type="number"
                                disabled={true}
                                valueDefault={row?.latitude}
                            />
                        </div>
                        <FieldEdit
                            label={t(langKeys.longitude)}
                            className="col-3"
                            type="number"
                            disabled={true}
                            valueDefault={row?.longitude}
                        />
                    </div>
                    <div className="col-3">
                        <div style={{ paddingBottom: "2rem" }}>
                            <FieldEdit
                                label={t(langKeys.carriercoord)}
                                className="col-3"
                                type="text"
                                disabled={true}
                            />
                        </div>
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
            <Typography className={classes.subtitle}>{t(langKeys.orderlist)}</Typography>
            <div className="row-zyx" style={{marginBottom: 0}}>
                <TableZyx
                    columns={columns}
                    data={productsData.data || []}
                    filterGeneral={false}
                    toolsFooter={false}
                />
            </div>
            <Typography className={classes.totalammount}>{t(langKeys.total) + ': ' + productsData.data.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</Typography>
        </div>
    );
};

export default InformationTabDetail;
