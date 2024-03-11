import React from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail } from "components";
import TableZyx from "components/fields/table-simple";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    totalammount: {
        textAlign: "right",
        padding: "2rem 2rem 0 0",
        fontSize: "1rem",
    },
}));

interface OrderStatusTabDetailProps {
    row: Dictionary | null;
}

const OrderStatusTabDetail: React.FC<OrderStatusTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.ticket_number),
                accessor: "ticket_number",
                width: "auto",
            },
            {
                Header: t(langKeys.status),
                accessor: "status",
                width: "auto",
            },
            {
                Header: t(langKeys.createdBy),
                accessor: "createdBy",
                width: "auto",
            },
            {
                Header: t(langKeys.date),
                accessor: "date",
                width: "auto",
            },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <TitleDetail title={t(langKeys.orderstatus)} />
            </div>
            <div className="row-zyx">
                <TableZyx columns={columns} data={[]} filterGeneral={false} toolsFooter={false} />
            </div>
            <Typography className={classes.totalammount}>{t(langKeys.viewcounter) + ": 03"}</Typography>
        </div>
    );
};

export default OrderStatusTabDetail;
