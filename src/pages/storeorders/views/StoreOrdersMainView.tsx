import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TemplateBreadcrumbs, TemplateIcons, TitleDetail } from "components";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Dictionary } from "@types";
import { useDispatch } from "react-redux";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { useSelector } from "hooks";
import TablePaginated from "components/fields/table-paginated";
import DeliveredDialog from "../dialogs/DeliveredDialog";
import UndeliveredDialog from "../dialogs/UndeliveredDialog";
import { CellProps } from "react-table";
import { ExtrasMenu } from "../components/components";

const selectionKey = "warehouseid";

const useStyles = makeStyles(() => ({     
    generalContainer: {       
        width: "100%",      
        flexDirection: "column",      
    },     
}));

interface InventoryMainViewProps {
    fetchData: () => void;
    fetchDataAux: any;
    setRowSelected: (rowdata: Dictionary) => void;
}

const StoreOrdersMainView: FC<InventoryMainViewProps> = ({ setRowSelected, fetchData, fetchDataAux }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const executeResult = useSelector((state) => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [cleanSelected, setCleanSelected] = useState(false);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const [totalrow, settotalrow] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const classes = useStyles();
    const importRes = useSelector((state) => state.main.execute);
    const [openModalDelivered, setOpenModalDelivered] = useState(false);
    const [openModalUndelivered, setOpenModalUndelivered] = useState(false);

    const arrayBread = [
        { id: "main-view", name: t(langKeys.delivery) },
        { id: "detail-view", name: t(langKeys.storeorders) },
    ];


    const handleEdit = (row: Dictionary) => {
        setRowSelected({ row, edit: true });
    };

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
        if (!mainPaginated.loading && !mainPaginated.error) {
            setPageCount(fetchDataAux.pageSize ? Math.ceil(mainPaginated.count / fetchDataAux.pageSize) : 0);
            settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

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
                accessor: 'orderlistid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.ordernumber),
                accessor: "ordernumber",
                width: "auto",
            },
            {
                Header: t(langKeys.report_voicecall_ticketnum),
                accessor: "report_voicecall_ticketnum",
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
                Header: t(langKeys.ticket_dni),
                accessor: "ticket_dni",
                width: "auto",
            },
            {
                Header: t(langKeys.product),
                accessor: "family",
                width: "auto",
            },
            {
                Header: t(langKeys.quantity),
                accessor: "quantity",
                width: "auto",
            },
            {
                Header: t(langKeys.validated),
                accessor: "validated",
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
                Header: t(langKeys.orderdate),
                accessor: "orderdate",
                width: "auto",
            },
            {
                Header: t(langKeys.deliverydate),
                accessor: "deliverydate",
                width: "auto",
            },
            {
                Header: t(langKeys.deliveryshift),
                accessor: "deliveryshift",
                width: "auto",
            },
        ],
        []
    );

   

    return (
        <div className={classes.generalContainer}>
            <div>         
                <div style={{ flexGrow: 1 }}>
                    <TemplateBreadcrumbs breadcrumbs={arrayBread} />
                    <TitleDetail title={t(langKeys.storeorders)} />
                </div>
            </div>
            <TablePaginated
                columns={columns}
                data={[]}
                totalrow={totalrow}
                loading={mainPaginated.loading}
                pageCount={pageCount}
                useSelection={true}
                selectionKey={selectionKey}
                setSelectedRows={setSelectedRows}
                onClickRow={handleEdit}
                initialSelectedRows={selectedRows}
                cleanSelection={cleanSelected}
                setCleanSelection={setCleanSelected}
                ButtonsElement={() => (
                    <ExtrasMenu
                        delivered={() => setOpenModalDelivered(true)}
                        undelivered={() => setOpenModalUndelivered(true)}
                    />
                )}
                
            />
            <DeliveredDialog 
                openModal={openModalDelivered} 
                setOpenModal={setOpenModalDelivered} 
            />
            <UndeliveredDialog 
                openModal={openModalUndelivered} 
                setOpenModal={setOpenModalUndelivered} 
            />
        </div>
    );
};

export default StoreOrdersMainView;