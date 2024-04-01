import React, { useState, useEffect } from "react";
import { Dictionary } from "@types";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { TitleDetail } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
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
    const executeResult = useSelector((state) => state.main.execute);

    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);

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
