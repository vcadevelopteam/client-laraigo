import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail, FieldEdit } from "components";
import { Typography } from "@material-ui/core";
import TableZyx from "components/fields/table-simple";
import { Dictionary } from "@types";
import { useSelector } from "hooks";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        background: "#fff",
    },
    listtotalprice: {
        textAlign: "right",
		marginTop: 20,
        fontSize: "1rem",
    },
}));

interface NewAttentionOrdersTabDetailProps {
    row: Dictionary | null;
}

const NewAttentionOrdersTabDetail: React.FC<NewAttentionOrdersTabDetailProps> = ({ row }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const productsData = useSelector((state) => state.main.mainAux);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.product),
                accessor: "description",
                width: "50%",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.totalamount),
                accessor: "amount",
                width: "auto",
            },
        ],
        []
    );

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
				<div style={{marginBottom: 10}}>
                    <TitleDetail title={t(langKeys.clientdata)} />
                </div>
                <FieldEdit
					label={t(langKeys.clientname)}
					disabled={true}
					className="col-6"
					maxLength={100}
					valueDefault={row?.name}
				/>
                <FieldEdit
					label={t(langKeys.documentnumber)}
					type="number"
					disabled={true}
					className="col-6"
					valueDefault={row?.personid}
				/>
                <FieldEdit
					label={t(langKeys.telephonenumber)}
					disabled={true}
					className="col-6"
					valueDefault={row?.phone}
				/>
                <FieldEdit
					label={t(langKeys.address)}
					disabled={true}
					className="col-6"
					valueDefault={row?.name}
				/>
                <div style={{ paddingTop: "1rem" }}>
                    <TitleDetail title={t(langKeys.orderlist)} />
                </div>
                <div>
					<TableZyx
						columns={columns}
						data={productsData.data || []}
						filterGeneral={false}
						toolsFooter={false}
					/>
				</div>
                <Typography className={classes.listtotalprice}>
                    {t(langKeys.totallistprice) + ': ' + productsData.data.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
                </Typography>
            </div>
        </div>
    );
};

export default NewAttentionOrdersTabDetail;
