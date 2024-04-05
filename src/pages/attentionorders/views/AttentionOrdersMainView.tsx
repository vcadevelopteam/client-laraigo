import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { CellProps } from "react-table";
import TableZyx from "components/fields/table-simple";

const useStyles = makeStyles(() => ({
    container: {
        width: "100%",
    },
    titlespace: {
        marginBottom: 12,
        marginTop: 4,
    },
    orderNumber: {
        textDecoration: 'underline',
        color: 'blue',
        cursor: "pointer",
    },
}));

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface InventoryMainViewProps {
    setViewSelected: (view: string) => void;
    setRowSelected: (rowdata: RowSelected) => void;
    fetchData: () => void;
}

const AttentionOrdersMainView: FC<InventoryMainViewProps> = ({ setViewSelected, setRowSelected, fetchData }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const main = useSelector((state) => state.main.mainData);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.attentionorders) },
    ];

    const moveToDetail = (row: Dictionary) => {
        setViewSelected("detail-view");
        setRowSelected({ row, edit: true });
    };

	useEffect(() => {
        fetchData()
	},[]);

	useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            const selectedData = Object.keys(selectedRows).map((key) => main.data[key]);
            setRowWithDataSelected(selectedData);
        }
    }, [selectedRows])

    const columns = React.useMemo(
        () => [
            {
                accessor: "id",
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return <TemplateIcons editFunction={() => moveToDetail(row)} />;
                },
            },
            {
                Header: t(langKeys.ordernumber),
                accessor: "ordernumber",
                width: "auto",
				Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    const orderNumber = props.cell.value;
                    const handleClickOrderNumber = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                        event.stopPropagation();
                        moveToDetail(row);
                    };
                    return (
                        <span
                            className={classes.orderNumber}
                            onClick={handleClickOrderNumber}
                        >
                            {orderNumber}
                        </span>
                    );
                },
            },
            {
                Header: t(langKeys.deliverynumber),
                accessor: "deliveryid",
                width: "auto",
            },
            {
                Header: t(langKeys.clientname),
                accessor: "name",
                width: "auto",
            },
            {
                Header: t(langKeys.phone),
                accessor: "phone",
                width: "auto",
            },
            {
                Header: t(langKeys.product),
                accessor: "description",
                width: "auto",
            },
            {
                Header: t(langKeys.requestedquantity),
                accessor: "quantity",
                width: "auto",
            },
			{
                Header: t(langKeys.amountserved),
                accessor: "quantityattended",
                width: "auto",
            },
            {
                Header: t(langKeys.orderstatus),
                accessor: "orderstatus",
                width: "auto",
                Cell: (props: any) => {
                    const { orderstatus } = props.cell.row.original;
                    return (t(`deliverystatus_${orderstatus}`.toLowerCase()) || '');
                }
            },
            {
                Header: t(langKeys.deliverytype),
                accessor: "orddeliverytypeerstatus",
                width: "auto",
            },
            {
                Header: t(langKeys.orderdate),
                accessor: "orderdate",
                width: "auto",
            },
            {
                Header: t(langKeys.scheduleddate),
                accessor: "scheduledeliverydate",
                width: "auto",
            },
			{
                Header: t(langKeys.scheduledshift),
                accessor: "deliveryshift",
                width: "auto",
            },
        ],
        []
    );

    return (
        <div className={classes.container}>
            <div className={classes.titlespace}>
                <div style={{ flexGrow: 1 }}>
                    <TemplateBreadcrumbs breadcrumbs={arrayBread} />
                    <TitleDetail title={t(langKeys.attentionorders)} />
                </div>
            </div>
            <TableZyx
                columns={columns}
                data={main.data || []}
                filterGeneral={false}
                loading={main.loading}
                useSelection={true}
                setSelectedRows={setSelectedRows}
                ButtonsElement={() => (
                    <div style={{justifyContent: 'right', display: 'flex'}}>
						<Button
							variant="contained"
							color="primary"
							disabled={main.loading || Object.keys(selectedRows).length === 0}
							startIcon={<CheckCircleIcon color="secondary" />}
							style={{ backgroundColor: "#55BD84" }}
						>
							<Trans i18nKey={langKeys.prepare} />
						</Button>
					</div>
                )}
            />
        </div>
    );
};

export default AttentionOrdersMainView;
