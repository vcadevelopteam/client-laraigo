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
    setProvider: (provider: string) => void
    firstData: Dictionary
    setFirstData: (data: Dictionary) => void
}

const AssistantTabDetail: React.FC<AssistantTabDetailProps> = ({
    data:{row, edit},
    setValue,
    getValues,
    errors,
    setProvider,
    firstData,
    setFirstData,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [isCodeInterpreter, setIsCodeInterpreter] = useState(row?.codeinterpreter || false);
    const [conector, setConector] = useState(row ? multiDataAux?.data?.[3]?.data?.find(item => item.id === row?.intelligentmodelsid) : {});
    
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
        },
        {
            "domainid": 437613,
            "domainvalue": "gpt-4o",
            "domaindesc": "gpt-4o",
            "bydefault": null
        },
        {
            "domainid": 437614,
            "domainvalue": "gpt-4o-2024-05-13",
            "domaindesc": "gpt-4o-2024-05-13",
            "bydefault": null
        },
        {
            "domainid": 437615,
            "domainvalue": "gpt-4o-mini",
            "domaindesc": "gpt-4o-mini",
            "bydefault": null
        },
        {
            "domainid": 437616,
            "domainvalue": "gpt-4o-mini-2024-07-18",
            "domaindesc": "gpt-4o-mini-2024-07-18",
            "bydefault": null
        }
    ];

    const llama3basemodels = [
        {
            "domainvalue": "llama3.1:70b",
            "domaindesc": "llama3.1:70b",
        },
        {
            "domainvalue": "llama3.1:8b",
            "domaindesc": "llama3.1:8b",
        }
    ]

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
                    onChange={(value) => {
                        setValue('name', value)
                        setFirstData({...firstData, name: value})
                    }}
                    error={errors?.name?.message}
                    type="text"
                    maxLength={60}                                    
                />
                <FieldEdit
                    className="col-6"
                    label={t(langKeys.description)}
                    valueDefault={getValues('description')}
                    onChange={(value) => {
                        setValue('description', value)
                        setFirstData({...firstData, description: value})
                    }}
                    error={errors?.description?.message}
                    type="text"
                    maxLength={640}                                    
                />
                <FieldSelect
                    className="col-6"
                    data={multiDataAux?.data?.[3]?.data.filter(item => (item.type === 'LARGE LANGUAGE MODEL' || item.type === 'Gen AI')) || []}
                    label={t(langKeys.conector)}
                    valueDefault={getValues('intelligentmodelsid')}
                    onChange={(value) => {
                        if(value) {
                            setValue('intelligentmodelsid', value.id)
                            setValue('apikey', value.apikey)
                            setValue('basemodel', '')
                            setConector(value)
                            setProvider(value.provider)
                            setFirstData({...firstData, intelligentmodelsid: value.id, basemodel: ''})
                        } else {
                            setValue('intelligentmodelsid', 0)
                            setValue('apikey', '')
                            setValue('basemodel', '')
                            setConector({})
                            setProvider('')
                            setFirstData({...firstData, intelligentmodelsid: 0, basemodel: ''})
                        }
                    }}
                    error={errors?.intelligentmodelsid?.message}
                    optionDesc="name"
                    optionValue="id"
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
                <FieldSelect
                    label={t(langKeys.basemodel)}
                    data={
                        conector?.provider === 'OpenAI' || conector?.provider === 'Open AI' ? retrievalbasemodels :
                        conector?.provider === 'Meta' ? multiDataAux?.data?.[2]?.data.filter(item => item.domainvalue.startsWith('meta')) :
                        conector?.provider === 'IBM' ? multiDataAux?.data?.[2]?.data.filter(item => item.domainvalue.startsWith('meta')) :
                        conector?.provider === 'Mistral' ? multiDataAux?.data?.[2]?.data.filter(item => item.domainvalue.startsWith('mistral')) :
                        conector?.provider === 'Laraigo' || conector?.provider === 'LaraigoLLM' ? llama3basemodels : []
                    }
                    valueDefault={getValues('basemodel')}
                    onChange={(value) => {
                        if(value) {
                            setValue('basemodel', value.domainvalue)
                            setFirstData({...firstData, basemodel: value.domainvalue})
                        } else {
                            setValue('basemodel', '')
                            setFirstData({...firstData, basemodel: ''})
                        }
                    }}
                    error={errors?.basemodel?.message}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                    className="col-6"
                />
                {conector?.provider === 'Open AI' ? (
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
                ) : (
                    <div className="col-6"></div>
                )}
            </div>
        </div>
    );
};

export default AssistantTabDetail;