import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit, FieldSelect } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { FieldErrors } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
}));

interface AssistantTabDetailProps {
    row: Dictionary | null
    setValue: any
    getValues: any,
    errors: FieldErrors
}

const AssistantTabDetail: React.FC<AssistantTabDetailProps> = ({
    row,
    setValue,
    getValues,
    errors
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitExport, setWaitExport] = useState(false);
    const resExportData = useSelector((state) => state.main.exportData);
    const [waitUpload, setWaitUpload] = useState(false);
    const importRes = useSelector((state) => state.main.execute);
    const multiDataAux = useSelector(state => state.main.multiDataAux);

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

    return (
        <div className={classes.containerDetail}>
             <div className="row-zyx">
                <FieldEdit
                    className="col-6"
                    label={t(langKeys.name)}
                    type="text"
                    maxLength={60}                                    
                />
                <FieldEdit
                    className="col-6"
                    label={t(langKeys.description)}
                    type="text"
                    maxLength={640}                                    
                />
                <FieldSelect
                    label={t(langKeys.basemodel)}
                    data={[]}
                    optionDesc="value"
                    optionValue="value"
                    className="col-6"
                />        
                <FieldSelect
                    className="col-6"
                    label={t(langKeys.status)}
                    data={(multiDataAux?.data?.[0]?.data||[])}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEdit
                    className="col-12"
                    label={t(langKeys.apikey)}
                    type="password"
                />
            </div>
        </div>
    );
};

export default AssistantTabDetail;
