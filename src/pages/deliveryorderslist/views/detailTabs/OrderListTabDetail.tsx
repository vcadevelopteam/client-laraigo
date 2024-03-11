import React from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail } from "components";
import { useSelector } from "hooks";
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
        marginTop: '1rem',
        paddingRight: "2rem",
        fontSize: "1rem",
    },
}));

interface InventoryTabDetailProps {
    row: Dictionary | null;
}

const OrderListTabDetail: React.FC<InventoryTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const productsData = useSelector((state) => state.main.mainAux2);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.product),
                accessor: "description",
                width: "auto",
            },
            {
                Header: t(langKeys.unitaryprice),
                accessor: "unitprice",
                width: "20%",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "20%",
            },
            {
                Header: t(langKeys.totalamount),
                accessor: "amount",
                width: "20%",
            },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <TitleDetail title={t(langKeys.orderlist)} />
            </div>
            <div className="row-zyx" style={{marginBottom: 0}}>
                <TableZyx
                    columns={columns}
                    data={productsData.data || []} 
                    filterGeneral={false}
                    toolsFooter={false}
                />
            </div>
            <Typography className={classes.totalammount}>{t(langKeys.totallistprice) + ": " + productsData.data.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</Typography>
        </div>
    );
};

export default OrderListTabDetail;
