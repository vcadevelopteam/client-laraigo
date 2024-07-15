import React, { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { langKeys } from "lang/keys";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { Button } from "@material-ui/core";
import { CellProps } from "react-table";
import TableZyx from "components/fields/table-simple";
import CheckIcon from '@material-ui/icons/Check';
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { execute } from "store/main/actions";
import { prepareAttentionOrder } from "common/helpers";

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
    const dispatch = useDispatch();
    const [waitSavePrepare, setWaitSavePrepared] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);

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
    
    const prepareOrder = () => {
        const allScheduled = rowWithDataSelected.every((row: Dictionary) => row.orderstatus === 'scheduled');
        if(allScheduled && Object.keys(selectedRows).length !== 0) {
            const uniqueOrderNumbers = Array.from(new Set(rowWithDataSelected.map((row: Dictionary) => row.orderid)));
            const orderNumbersString = uniqueOrderNumbers.join(',');
            dispatch(showBackdrop(true));
            dispatch(execute(prepareAttentionOrder(orderNumbersString)));
            setWaitSavePrepared(true);
        } else {
            if(Object.keys(selectedRows).length !== 0) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(langKeys.prepareorderserror),
                    })
                );
            } else {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(langKeys.mustselectorders),
                    })
                );
            }
        }
    }

    useEffect(() => {
        if (waitSavePrepare) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSavePrepared(false);
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_update),
                    })
                );
                fetchData()
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSavePrepared(false);
            }
        }
    }, [executeResult, waitSavePrepare]);

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
							startIcon={<CheckIcon/>}
							style={{ backgroundColor: "#55BD84" }}
                            onClick={prepareOrder}
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
