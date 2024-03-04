import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { Trans, useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail, TemplateIcons, IOSSwitch, TemplateBreadcrumbs } from "components";
import TableZyx from "components/fields/table-simple";
import { Button, FormControlLabel } from "@material-ui/core";
import { useSelector } from "hooks";
import PrintIcon from "@material-ui/icons/Print";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import UndeliveredDialog from "../dialogs/UndeliveredDialog";
import CanceledDialog from "../dialogs/CanceledDialog";
import AssignCarrierDialog from "../dialogs/AssignCarrierDialog";
import ManualSchedulingDialog from "../dialogs/ManualSchedulingDialog";
import ReschedulingUndeliveredDialog from "../dialogs/ReschedulingUndeliveredDialog";
import ElectronicTicketAndInvoiceDialog from "../dialogs/ElectronicTicketAndInvoiceDialog";
import PrintDialog from "../dialogs/PrintDialog";
import { CellProps } from "react-table";
import { ExtrasMenu } from "../components/components";
import { reportPdf } from "store/culqi/actions";
import { getCollectionAux } from "store/main/actions";
import { deliveryConfigurationSel } from "common/helpers";

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: "#55BD84",
        marginLeft: theme.spacing(1.2),
        "&:hover": {
            backgroundColor: "#55BD84",
        },
    },
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    titleandcrumbs: {
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

interface InventoryTabDetailProps {
    setViewSelected: (view: string) => void;
    fetchData: (flag: boolean) => void;
    setRowSelected: (rowdata: RowSelected) => void;
}

const selectionKey = 'orderid';

const OrderListMainView: React.FC<InventoryTabDetailProps> = ({
    setViewSelected,
    setRowSelected,
    fetchData,
}) => {
    const { t } = useTranslation();
    const [attentionOrders, setAttentionOrders] = useState(true);
    const executeResult = useSelector((state) => state.main.execute);
    const [openModalUndelivered, setOpenModalUndelivered] = useState(false);
    const [openModalCanceled, setOpenModalCanceled] = useState(false);
    const [openModalAssignCarrier, setOpenModalAssignCarrier] = useState(false);
    const [openModalManualScheduling, setOpenModalManualScheduling] = useState(false);
    const [openModalReschedulingUndelivered, setOpenModalReschedulingUndelivered] = useState(false);
    const [openModalElectronicTicketAndInvoice, setOpenModalElectronicTicketAndInvoice] = useState(false);
    const [openModalPrint, setOpenModalPrint] = useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSave2, setWaitSave2] = useState(false);
    const main = useSelector((state) => state.main.mainData);
    const configData = useSelector(state => state.main.mainAux);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const culqiReportResult = useSelector((state) => state.culqi.requestReportPdf);
    const [waitPdf, setWaitPdf] = useState(false);
    const [pdfRender, setPdfRender] = useState('');
    const [config, setConfig] = useState<Dictionary>({})

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.orderlist) },
    ];

    const fetchConfig = () => dispatch(getCollectionAux(deliveryConfigurationSel({id: 0, all: true})));

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected(p => Object.keys(selectedRows).map(x => main?.data.find(y => y.orderid === parseInt(x)) || p.find((y) => y.orderid === parseInt(x)) || {}))
        }
    }, [selectedRows])

    useEffect(() => {
		fetchConfig()
        dispatch(showBackdrop(true));
        setWaitSave2(true)
	},[]);

    useEffect(() => {
        if (waitSave2) {
            if (!configData.loading && !configData.error) {
                setConfig(configData?.data?.[0]?.config)
                dispatch(showBackdrop(false));
                setWaitSave2(false);
            } else if (configData.error) {
                const errormessage = t(configData.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave2(false);
            }
        }
    }, [configData, waitSave2]);

    useEffect(() => {
		fetchData(attentionOrders)
	},[attentionOrders]);

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
                accessor: "orderlistid",
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            editFunction={() => moveDetailView2(row)}
                        />
                    );
                },
            },
            {
                Header: t(langKeys.deliverynumber),
                accessor: "deliveryid",
                width: "auto",
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
                        moveDetailView(row);
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
                Header: t(langKeys.uniqueroutingcode),
                accessor: "code",
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
                Header: t(langKeys.totalamount),
                accessor: "amount",
                width: "auto",
            },
            {
                Header: t(langKeys.orderstatus),
                accessor: "orderstatus",
                width: "auto",
            },
            {
                Header: t(langKeys.deliverytype),
                accessor: "deliverytype",
                width: "auto",
            },
            {
                Header: t(langKeys.appointmenttype),
                accessor: "schedulingtype",
                width: "auto",
            },
            {
                Header: t(langKeys.orderdate),
                accessor: "orderdate",
                width: "auto",
            },
            {
                Header: t(langKeys.scheduleddate),
                accessor: "scheduleddate",
                width: "auto",
            },
            {
                Header: t(langKeys.scheduledshift),
                accessor: "deliveryshift",
                width: "auto",
            },
            {
                Header: t(langKeys.deliverydate),
                accessor: "deliverydate",
                width: "auto",
            },
            {
                Header: t(langKeys.ordertime),
                accessor: "timeorder",
                width: "auto",
            },
        ],
        []
    );

    function moveDetailView(row: Dictionary) {
        setViewSelected("detail-view");
        setRowSelected({ row, edit: true });
    }

    function moveDetailView2(row: Dictionary) {
        setViewSelected("detail-view2");
        setRowSelected({ row, edit: true });
    }

    const handleReportPdf = () => {
        const reportBody = {
            dataonparameters: true,
            key: "period-report",
            method: "",
            reportname: "order-list",
            template: 'orderlist.html',
            parameters: {
                ordernumber: rowWithDataSelected?.[0]?.ordernumber,
                date: rowWithDataSelected?.[0]?.orderdate,
                orders: [
                    {
                        code: 'product273y',
                        amount: 20,
                    },
                    {
                        code: 'product904M',
                        amount: 8,
                    },
                ]
            },
        };

        dispatch(reportPdf(reportBody));
        dispatch(showBackdrop(true));
        setWaitPdf(true);
    }

    useEffect(() => {
        if (waitPdf) {
            if (!culqiReportResult.loading && !culqiReportResult.error) {
                dispatch(showBackdrop(false));
                setWaitPdf(false);
                if (culqiReportResult.datacard) {
                    //window.open(culqiReportResult.datacard, "_blank");
                    setPdfRender(culqiReportResult.datacard);
                    setOpenModalPrint(true)
                }
            } else if (culqiReportResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(culqiReportResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.person).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitPdf(false);
            }
        }
    }, [culqiReportResult, waitPdf]);

    return (
        <div className={classes.container}>
            <div className={classes.titleandcrumbs}>
                <div style={{ flexGrow: 1 }}>
                    <TemplateBreadcrumbs breadcrumbs={arrayBread} />
                    <TitleDetail title={t(langKeys.orderlist)} />
                </div>
            </div>
            <FormControlLabel
                style={{ paddingLeft: "10px" }}
                control={
                    <IOSSwitch
                        checked={attentionOrders}
                        onChange={(event) => {
                            setAttentionOrders(event.target.checked);
                        }}
                        color="primary"
                    />
                }
                label={t(langKeys.attentionorders)}
            />
            <TableZyx
                columns={columns}
                data={main.data || []}
                filterGeneral={true}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                onClickRow={moveDetailView2}
                ButtonsElement={() => (
                    <div style={{ justifyContent: "right", display: "flex" }}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            color="primary"
                            disabled={main.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<LocationOnIcon color="secondary" />}
                        >
                            <Trans i18nKey={langKeys.routinglogic} />
                        </Button>
                        <div style={{ marginLeft: "0.6rem" }}>
                            <ExtrasMenu
                                schedulesth={() => setOpenModalManualScheduling(true)}
                                prepare={() => setOpenModalAssignCarrier(true)}
                                dispatch={() => setOpenModalAssignCarrier(true)}
                                reschedule={() => setOpenModalReschedulingUndelivered(true)}
                                deliver={() => setOpenModalCanceled(true)}
                                undelivered={() => setOpenModalReschedulingUndelivered(true)}
                                cancel={() => setOpenModalCanceled(true)}
                                cancelundelivered={() => setOpenModalCanceled(true)}
                                rows={selectedRows}
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={main.loading || Object.keys(selectedRows).length === 0}
                            startIcon={<PrintIcon color="secondary" />}
                            className={classes.button}
                            onClick={() => {
                                handleReportPdf()
                            }}
                        >
                            <Trans i18nKey={langKeys.print} />
                        </Button>
                        {config?.invoiced && (
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={main.loading || Object.keys(selectedRows).length === 0 || Object.keys(selectedRows).length > 1}
                                startIcon={<ReceiptIcon color="secondary" />}
                                className={classes.button}
                                onClick={() => {
                                    setOpenModalElectronicTicketAndInvoice(true);
                                }}
                            >
                                <Trans i18nKey={langKeys.electronic_ticket_and_invoice} />
                            </Button>
                        )}
                    </div>
                )}
                loading={main.loading}
            />
            <UndeliveredDialog
				openModal={openModalUndelivered}
				setOpenModal={setOpenModalUndelivered}
			/>
            <CanceledDialog
				openModal={openModalCanceled}
				setOpenModal={setOpenModalCanceled}
			/>
            <AssignCarrierDialog
				openModal={openModalAssignCarrier}
				setOpenModal={setOpenModalAssignCarrier}
			/>
            <ManualSchedulingDialog
				openModal={openModalManualScheduling}
				setOpenModal={setOpenModalManualScheduling}
			/>
            <ReschedulingUndeliveredDialog
                openModal={openModalReschedulingUndelivered}
                setOpenModal={setOpenModalReschedulingUndelivered}
                config={config}
            />
            <ElectronicTicketAndInvoiceDialog
                openModal={openModalElectronicTicketAndInvoice}
                setOpenModal={setOpenModalElectronicTicketAndInvoice}
                config={config}
                rows={rowWithDataSelected}
                pdfRender={pdfRender}
                setPdfRender={setPdfRender}
                setOpenModalInvoiceA4={setOpenModalPrint}
            />
            <PrintDialog
				openModal={openModalPrint}
				setOpenModal={setOpenModalPrint}
                pdfRender={pdfRender}
                setPdfRender={setPdfRender}
			/>
        </div>
    );
};

export default OrderListMainView;
