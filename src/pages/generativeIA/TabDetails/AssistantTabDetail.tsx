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
type FieldType = "code" | "apikey" | "status" | "type" | "name" | "description" | "id" | "language" | "basemodel" | "prompt" | "negativeprompt" | "temperature" | "retrieval" | "codeinterpreter" | "intelligentmodelsid" | `decoding_method.${string}`

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
    buttonsContainer: {
        display: 'flex',
        backgroundColor: '#DFD6C6',
        padding: '0px 5px 5px 10px',
        overflowX: 'hidden',
        maxWidth: 640,
        width: 'fit-content',
        borderRadius: '0px 0px 5px 5px',
    },
    combinedContainer: {
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'scroll',
        cursor: 'grab',
    },
    customFieldPackageContainer: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    warningContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem',
        backgroundColor: '#FFEBEB',
        color: '#FF7575',
        borderRadius: '4px',
        width: 'fit-content',
    } 
}));

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}
interface AssistantTabDetailProps {
    data: RowSelected
    setValue: (field: FieldType, value: unknown) => void
    getValues: (field?: FieldType) => unknown
    errors: FieldErrors
    setProvider: (provider: string) => void
    firstData: Dictionary
    setFirstData: (data: Dictionary) => void
    setSelectedProvider: (provider: string) => void
}

const AssistantTabDetail: React.FC<AssistantTabDetailProps> = ({
    data:{row},
    setValue,
    getValues,
    errors,
    setProvider,
    firstData,
    setFirstData,
    setSelectedProvider
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [isCodeInterpreter, setIsCodeInterpreter] = useState(row?.codeinterpreter || false);
    const [conector, setConector] = useState(row ? multiDataAux?.data?.[3]?.data?.find(item => item.id === row?.intelligentmodelsid) : {});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const intelligentmodelsid = getValues('intelligentmodelsid');
    const selectedProvider = multiDataAux?.data?.[3]?.data.find(item => item.id === intelligentmodelsid)?.provider || '';

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
    ]

    const llama3basemodels = [
        {
            "domainvalue": "llama3.1:70b",
            "domaindesc": "llama3.1:70b",
            "domainvalue": "llama3.1:70b",
            "domaindesc": "llama3.1:70b",
        },
        {
            "domainvalue": "llama3.1:8b",
            "domaindesc": "llama3.1:8b",
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

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (selectedProvider) {
            setSelectedProvider(selectedProvider);
        }
    }, [selectedProvider, setSelectedProvider]);

    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx" style={{marginBottom: 0}}>     

                <div style={{ display: 'flex', width: '100%', gap:'1.5rem', flexWrap: 'wrap'}}>      
                    <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.name)}</span>
                        <span>{t(langKeys.assistantnamedesc)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div className="row-zyx" style={{ minWidth: windowWidth > 1609 ? '45vw' : '80vw', marginBottom: 0 }}>
                                <FieldEdit
                                    label={''}
                                    onChange={(value) => {
                                        setValue("name", value)
                                        setFirstData({...firstData, name: value})
                                    }}
                                    valueDefault={getValues("name")}
                                    type="text"
                                    maxLength={60} 
                                    variant="outlined"
                                    error={errors?.name?.message}                            
                                />
                            </div>                                   
                        </div>
                    </div>
                    <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.description)}</span>
                        <span>{t(langKeys.assistantdescriptiondesc)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div className="row-zyx" style={{ minWidth: windowWidth > 1609 ? '45vw' : '80vw', marginBottom: 0 }}>
                                <FieldEdit
                                    label={''}
                                    onChange={(value) => {
                                        setValue("description", value)
                                        setFirstData({...firstData, description: value})
                                    }}
                                    valueDefault={getValues("description")}
                                    type="text"
                                    maxLength={640}                                    
                                    variant="outlined"
                                    error={errors?.description?.message}                            
                                />
                            </div>                                   
                        </div>
                    </div>
                </div>      

                <div style={{ display: 'flex', width: '100%', gap:'1.5rem', flexWrap: 'wrap' }}>      
                    <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.connectors)}</span>
                        <span>{t(langKeys.assistantconnectorsdesc)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        
                            <div className="row-zyx" style={{ minWidth: windowWidth > 1609 ? '45vw' : '80vw', marginBottom: 0 }}>
                                <FieldSelect
                                    data={multiDataAux?.data?.[3]?.data.filter(item => (item.type === 'LARGE LANGUAGE MODEL' || item.type === 'Gen AI')) || []}
                                    variant="outlined"
                                    optionDesc="name"
                                    disabled={row ? true: false}
                                    optionValue="id"
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
                                />
                            </div>                                   
                        
                        </div>
                    </div>          
                    <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.status)}</span>
                        <span>{t(langKeys.assistantstatussdesc)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div className="row-zyx" style={{ minWidth: windowWidth > 1609 ? '45vw' : '80vw', marginBottom: 0 }}>
                                <FieldSelect
                                    data={(multiDataAux?.data?.[0]?.data||[])}
                                    variant="outlined"
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                    onChange={(value) => {                                       
                                        setValue('status', value.domainvalue);
                                    }}
                                    valueDefault={getValues('status')}
                                    error={errors?.status?.message}
                                />
                            </div>                                   
                        
                        </div>
                    </div>          
                </div>    

                <div style={{ display: 'flex', width: '100%', gap:'1.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>      
                    <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.basemodel)}</span>
                        <span>{t(langKeys.assistantbasemodeldesc)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        
                            <div className="row-zyx" style={{ minWidth: windowWidth > 1609 ? '45vw' : '80vw', marginBottom: 0 }}>
                                <FieldSelect
                                    data={
                                        conector?.provider === 'OpenAI' || conector?.provider === 'Open AI' ? retrievalbasemodels :
                                        conector?.provider === 'Laraigo' || conector?.provider === 'LaraigoLLM' ? llama3basemodels : 
                                        conector?.provider === 'IBM' ? 
                                            multiDataAux?.data?.[2]?.data
                                            .filter(item => item.domainvalue.startsWith('meta'))
                                            .concat(multiDataAux?.data?.[2]?.data.filter(item => item.domainvalue.startsWith('mistral'))) : []                       
                                    }
                                    variant="outlined"
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"  
                                    disabled={row ? true: false}   
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
                                />
                            </div>                                   
                        
                        </div>
                    </div>          
                    <div className={classes.customFieldPackageContainer} style={{ margin: '4rem 0' }}>
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
              
               
                
            </div>
        </div>
    );
};

export default AssistantTabDetail;