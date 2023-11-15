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
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
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
}));

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface InventoryTabDetailProps {
    setViewSelected: (view: string) => void;
    fetchData: () => void;
    setRowSelected: (rowdata: RowSelected) => void;
}

const OrderListMainView: React.FC<InventoryTabDetailProps> = ({
    setViewSelected,
    setRowSelected,
    fetchData,
}) => {
    const { t } = useTranslation();
    const [attentionOrders, setAttentionOrders] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
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
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.orderlist) },
    ];

    const handleEdit = (row: Dictionary) => {
        setRowSelected({ row, edit: true });
    };

	useEffect(() => {
		fetchData()
	},[]);

    useEffect(() => {
        if (waitUpload) {
            if (!importRes.loading && !importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_import),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            } else if (importRes.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "error",
                        message: t(importRes.code || "error_unexpected_error"),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            }
        }
    }, [importRes, waitUpload]);

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_delete),
                callback,
            })
        );
    };

    useEffect(() => {
        if (waitExport) {
            if (!resExportData.loading && !resExportData.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                resExportData.url?.split(",").forEach((x) => window.open(x, "_blank"));
            } else if (resExportData.error) {
                const errormessage = t(resExportData.code || "error_unexpected_error", {
                    module: t(langKeys.person).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [resExportData, waitExport]);

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
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                Header: t(langKeys.deliverynumber),
                accessor: "deliverynumber",
                width: "auto",
            },
            {
                Header: t(langKeys.ordernumber),
                accessor: "ordernumber",
                width: "auto",
            },
            {
                Header: t(langKeys.uniqueroutingcode),
                accessor: "uniqueroutingcode",
                width: "auto",
            },
            {
                Header: t(langKeys.clientname),
                accessor: "clientname",
                width: "auto",
            },
            {
                Header: t(langKeys.phone),
                accessor: "phone",
                width: "auto",
            },
            {
                Header: t(langKeys.totalamount),
                accessor: "totalamount",
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
                accessor: "appointmenttype",
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
                accessor: "scheduledshift",
                width: "auto",
            },
            {
                Header: t(langKeys.deliverydate),
                accessor: "deliverydate",
                width: "auto",
            },
            {
                Header: t(langKeys.ordertime),
                accessor: "ordertime",
                width: "auto",
            },
        ],
        []
    );

    function moveDetailView() {
        setViewSelected("detail-view");
        setRowSelected({ row: null, edit: false });
    }

    function moveDetailView2() {
        setViewSelected("detail-view2");
        setRowSelected({ row: null, edit: false });
    }

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
                data={[]}
                filterGeneral={true}
                useSelection={true}
                register={true}
                handleRegister={moveDetailView}
                ButtonsElement={() => (
                    <div style={{ justifyContent: "right", display: "flex" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<LocationOnIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            <Trans i18nKey={langKeys.routinglogic} />
                        </Button>
                        <div style={{ marginLeft: "0.6rem" }}>
                            <ExtrasMenu
                                schedulesth={() => setOpenModalManualScheduling(true)}
                                prepare={() => setOpenModalAssignCarrier(true)}
                                dispatch={() => setOpenModalCanceled(true)}
                                reschedule={() => setOpenModalReschedulingUndelivered(true)}
                                deliver={() => setOpenModalCanceled(true)}
                                undelivered={() => setOpenModalReschedulingUndelivered(true)}
                                cancel={() => setOpenModalCanceled(true)}
                                cancelundelivered={() => setOpenModalCanceled(true)}
                            />
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<PrintIcon color="secondary" />}
                            className={classes.button}
                            onClick={() => {
                                setOpenModalPrint(true);
                            }}
                        >
                            <Trans i18nKey={langKeys.print} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<ReceiptIcon color="secondary" />}
                            className={classes.button}
                            onClick={() => {
                                setOpenModalElectronicTicketAndInvoice(true);
                            }}
                        >
                            <Trans i18nKey={langKeys.electronic_ticket_and_invoice} />
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainPaginated.loading}
                            startIcon={<ReceiptIcon color="secondary" />}
                            className={classes.button}
                            onClick={() => moveDetailView2()}
                        >
                            <Trans i18nKey={langKeys.test} />
                        </Button>
                    </div>
                )}
                loading={mainPaginated.loading}
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
            />
            <ElectronicTicketAndInvoiceDialog
                openModal={openModalElectronicTicketAndInvoice}
                setOpenModal={setOpenModalElectronicTicketAndInvoice}
            />
            <PrintDialog
				openModal={openModalPrint}
				setOpenModal={setOpenModalPrint}
			/>
        </div>
    );
};

export default OrderListMainView;
