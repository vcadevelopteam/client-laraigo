import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { FieldEdit, FieldSelect, IOSSwitch } from "components";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Dictionary } from "@types";
import { FieldErrors } from "react-hook-form";
import { FormControlLabel, Tooltip } from "@material-ui/core";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';


const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
        marginLeft: 5
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
    const [isRetrieval, setIsRetrieval] = useState(row?.retrieval || true);
    const [isCodeInterpreter, setIsCodeInterpreter] = useState(row?.codeinterpreter || false);
    const allbasemodels = multiDataAux?.data?.[2]?.data||[];
    const retrievalbasemodels = [
        {
            "domainid": 437605,
            "domainvalue": "gpt-3.5-turbo-1106",
            "domaindesc": "gpt-3.5-turbo-1106",
            "bydefault": null
        },
        {
            "domainid": 437612,
            "domainvalue": "gpt-4-1106-preview",
            "domaindesc": "gpt-4-1106-preview",
            "bydefault": null
        }
    ];

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
            <div className="row-zyx" style={{marginBottom: 0}}>
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
                    data={isRetrieval ? retrievalbasemodels : allbasemodels}
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
                <FormControlLabel style={{margin: 0}}
                    control={
                        <>
                            <IOSSwitch
                                checked={isCodeInterpreter}
                                onChange={(event) => {
                                    setIsCodeInterpreter(event.target.checked)
                                    setValue('codeinterpreter', event.target.checked)
                                }}
                                color='primary'
                            />
                            <span style={{marginLeft:'0.6rem'}}>{t(langKeys.codeinterpreter)}</span>
                            <Tooltip title={t(langKeys.codeinterpreterdescription)} arrow placement="top" >
                                <InfoRoundedIcon color="action" className={classes.iconHelpText}/>
                            </Tooltip>
                        </>
                    }                  
                    className="col-5"
                    label=""
                />

            </div>
        </div>
    );
};

export default AssistantTabDetail;
