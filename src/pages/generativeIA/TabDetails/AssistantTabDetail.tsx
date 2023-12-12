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

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}
interface AssistantTabDetailProps {
    data: RowSelected
    setValue: any
    getValues: any,
    errors: FieldErrors
}

const AssistantTabDetail: React.FC<AssistantTabDetailProps> = ({
    data:{row, edit},
    setValue,
    getValues,
    errors
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const multiDataAux = useSelector(state => state.main.multiDataAux);

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
                    valueDefault={getValues('name')}
                    onChange={(value) => setValue('name', value)}
                    error={errors?.name?.message}
                    type="text"
                    maxLength={60}                                    
                />
                <FieldEdit
                    className="col-6"
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    onChange={(value) => setValue('description', value)}
                    error={errors?.description?.message}
                    type="text"
                    maxLength={640}                                    
                />
                <FieldSelect
                    label={t(langKeys.basemodel)}
                    data={(multiDataAux?.data?.[2]?.data||[])}
                    valueDefault={getValues('basemodel')}
                    onChange={(value) => setValue('basemodel', value.domainvalue)}
                    error={errors?.basemodel?.message}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                    className="col-6"
                />        
                <FieldSelect
                    className="col-6"
                    label={t(langKeys.status)}
                    data={(multiDataAux?.data?.[0]?.data||[])}
                    valueDefault={getValues('status')}
                    onChange={(value) => setValue('status', value.domainvalue)}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEdit
                    className="col-12"
                    label={t(langKeys.apikey)}
                    valueDefault={getValues('apikey')}
                    onChange={(value) => setValue('apikey', value)}
                    error={errors?.apikey?.message}
                    type="password"
                />
            </div>
        </div>
    );
};

export default AssistantTabDetail;
