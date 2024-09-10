import React, { useCallback, useEffect, useRef, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldEditPassword } from 'components';
import { insIntelligentModels } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import WarningIcon from '@material-ui/icons/Warning';
import { Tooltip } from "@material-ui/core";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface Breadcrumb {
    id: string;
    name: string; 
}
interface DetailIntelligentModelsProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread2?: Breadcrumb[]; 
}
const arrayBread = [
    { id: "view-1", name: "Conectores" },
    { id: "view-2", name: "Registrar conector" }
]

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    warningContainer: {
        backgroundColor: '#FFD9D9',
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5
    },
    customFieldPackageContainer: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
}));

const DetailIntelligentModels: React.FC<DetailIntelligentModelsProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread2 }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const [, setSelectedValue] = useState<string>('');
    const oldTypes = ["LARGE LANGUAGE MODEL", "NATURAL LANGUAGE CLASSIFIER", "NATURAL LANGUAGE UNDERSTANDING", "TONE ANALYZER","","WIT.AI"];
    const providerMap: Record<string, string> = { 'LaraigoLLM': 'Laraigo', 'Open AI': 'OpenAI', 'RASA': 'Rasa', 'WATSON ASSISTANT': 'IBM'}    
    const reverseProviderMap: Record<string, string> = { 'Laraigo': 'Laraigo', 'OpenAI': 'OpenAI'}
    const previousTypeRef = useRef()    

    const mapProvider = (provider: string, type?: string, forSave = false) => {
        if (forSave) { return reverseProviderMap[provider] || provider }
        if (type && providerMap[type]) { return providerMap[type] }
        return providerMap[provider] || provider
    }  
    
    const statusData = [
        { domainvalue: "ACTIVO", domaindesc: "ACTIVO"},
        { domainvalue: "INACTIVO", domaindesc: "INACTIVO"},         
    ]

    const genAiProviders = [
        { domaindesc: 'Laraigo', domainvalue: 'Laraigo' },
        { domaindesc: 'IBM', domainvalue: 'IBM' },
        { domaindesc: 'OpenAI', domainvalue: 'OpenAI' },
        { domaindesc: 'Google', domainvalue: 'Google' },
        { domaindesc: 'Microsoft Azure', domainvalue: 'Microsoft Azure' },       
    ]    

    const assistantProviders = [
        { domaindesc: 'IBM', domainvalue: 'IBM' },
        { domaindesc: 'Microsoft Azure', domainvalue: 'Microsoft Azure' },
        { domaindesc: 'Google', domainvalue: 'Google' },
        { domaindesc: 'Rasa', domainvalue: 'Rasa' },
        { domaindesc: 'Meta', domainvalue: 'Meta' }
    ]   
    
    const { getValues, register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm({
        defaultValues: {          
            type: row ? (oldTypes.includes(row.type) ? "Gen AI" : ["RASA", "WATSON ASSISTANT"].includes(row.type) ? "Assistant" : row.type) : '',
            id: row ? row.id : 0,
            endpoint: row ? (row.endpoint || '') : '',
            modelid: row ? (row.modelid || '') : '',
            apikey: row ? (row.apikey || '') : '',
            name: row ? (row.name || '') : '',
            description: row ? (row.description || '') : '',
            provider: row ? mapProvider(row.provider, row.type) || '' : '',             
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT",            
        }
    })
    
    React.useEffect(() => {
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('id');       
        register('apikey', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('provider', {validate: (value) => Boolean(value) || t(langKeys.field_required)});
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('endpoint', {
            validate: (value) =>
                getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
        register('modelid', {
            validate: (value) =>
                getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
    }, [edit, register])

    useEffect(() => {
        const currentType = getValues('type');
        const currentProvider = getValues('provider');
        if (previousTypeRef.current && previousTypeRef.current !== currentType) {
            if (currentType !== 'Conversor de voz') {
                setValue('provider', '');  setValue('name', ''); setValue('endpoint', ''); setValue('modelid', ''); setValue('apikey', ''); setValue('description', ''); 
                clearErrors('provider'); clearErrors('name'); clearErrors('endpoint'); clearErrors('modelid'); clearErrors('apikey'); clearErrors('description');
            }
        }
        if (currentType === 'Conversor de voz' && currentProvider !== 'OpenAI') { setValue('provider', 'OpenAI'); clearErrors('provider') }
        previousTypeRef.current = currentType
    }, [getValues, setValue, clearErrors, getValues('type')]); 

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.intelligentmodels).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        if (oldTypes.includes(data.type)) {data.type = "Gen AI"}
        data.provider = mapProvider(data.provider, undefined, true);
        const callback = () => {
            dispatch(execute(insIntelligentModels(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }    
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    })   
    
    const helperServiceType = useCallback(() => {
        const type = getValues('type');
        switch (type) {
            case "Gen AI":
                return t(langKeys.genai_help)
            case "Assistant":
                return t(langKeys.assistant_help)
            case "Conversor de voz":
                return t(langKeys.voiceconversor_help)
            default:
                return "";
        }
    }, [getValues('type')]);
    
    const handleFieldSelectChange = useCallback((newValue: Dictionary) => {
        const selectedDomainValue = newValue?.domainvalue || ''
        setSelectedValue(selectedDomainValue)
    }, [])

    //console.log('row es: ', row)
    //console.log('getValues es: ', getValues())

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread2 
                            ? [...arrayBread2.map(item => ({ ...item, name: item.name || "" })),
                                { id: "view-1", name: "" }, 
                                { id: "view-2", name: "" }]
                            : arrayBread}
                        handleClick={setViewSelected}
                    />
                        <TitleDetail
                            title={row ? `${row.name}` : t(langKeys.newconnector)}
                        />                     
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>

                <div className={classes.containerDetail}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>                        
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.type_service)}</span>
                            <span>{t(langKeys.typeservicedescription)}</span>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                <div className="row-zyx" style={{ width: '30vw', marginBottom: 0 }}>
                                    <FieldSelect
                                        data={dataDomainStatus || []}
                                        variant="outlined"
                                        optionDesc='domaindesc'
                                        optionValue='domainvalue'
                                        onChange={(value) => {
                                            handleFieldSelectChange(value);
                                            if (value) {
                                                setValue('type', value.domaindesc);
                                                if (value.domaindesc === 'Conversor de voz') {setValue('provider', 'OpenAI')}
                                            } else {
                                                setValue('type', '');
                                                setValue('provider', '');
                                            }
                                        }}
                                        valueDefault={getValues('type')}
                                    />
                                </div>
                                <div style={{ margin: '0 0.5rem' }}>
                                {getValues('type') !== '' && (
                                    <Tooltip title={helperServiceType()} arrow placement="top">
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                )}
                                </div>
                                <div style={{ margin: '0 1rem', padding: '0' }}>
                                    {getValues('type') === '' && (
                                        <div className={classes.warningContainer} style={{ width: 220 }}>
                                            <WarningIcon style={{ color: '#FF7575' }} />
                                            {t(langKeys.selectoption)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {getValues('type') && 
                            <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.provider)}</span>
                                <span>{t(langKeys.providerdescription)}</span>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <div className="row-zyx" style={{ width: '30vw', marginBottom: 0 }}>
                                        <FieldSelect
                                            data={getValues('type') === 'Gen AI' ? genAiProviders : getValues('type') === 'Assistant' ? assistantProviders : getValues('type') === 'Conversor de voz' ? [{ domaindesc: 'OpenAI', domainvalue: 'OpenAI' }] : []}
                                            variant="outlined"                                      
                                            optionDesc='domaindesc'
                                            optionValue='domainvalue'
                                            onChange={(value) => {
                                                handleFieldSelectChange(value);
                                                if (value) {
                                                    setValue('provider', value.domaindesc);
                                                } else {
                                                    setValue('provider', '');
                                                }
                                            }}
                                            valueDefault={getValues('type') === 'Conversor de voz' ? 'OpenAI' : getValues('provider')}
                                            disabled={getValues('type') === 'Conversor de voz'}
                                        />
                                    </div>
                                    <div style={{ margin: '0 1rem', padding: '0' }}>
                                        {getValues('provider') === '' && (
                                            <div className={classes.warningContainer} style={{ width: 220 }}>
                                                <WarningIcon style={{ color: '#FF7575' }} />
                                                {t(langKeys.selectoption)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>    

                    {getValues('type') && getValues('provider') && (
                        <div className='row-zyx' style={{ borderBottom: '1px solid black', padding: '15px 0 10px 0' }}>
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{t(langKeys.serviceregistration)}</span>
                        </div>
                    )}                   

                    {((getValues('type') === 'Assistant' && getValues('provider') === 'Rasa') || (getValues('type') === 'Assistant' && getValues('provider') === 'IBM')) && (
                        <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>  
                            <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.url)}</span>
                                {getValues('provider') === 'Rasa'&& (
                                    <span>{t(langKeys.urlrasadescription)}</span>
                                )}
                                {getValues('provider') === 'IBM'&& (
                                    <span>{t(langKeys.urlibmdescription)}</span>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <div className="row-zyx" style={{ width: '92.2vw', marginBottom: 0 }}>
                                        <FieldEditPassword
                                            label={''}
                                            onChange={(value) => {
                                                setValue("endpoint", value)
                                                clearErrors('endpoint')
                                            }}
                                            valueDefault={getValues("endpoint")}
                                            variant="outlined"
                                            error={errors?.endpoint?.message}
                                        />
                                    </div>                                   
                                </div>
                            </div>     
                        </div>
                    )}         
                    
                    {getValues('type') && getValues('provider') && !(getValues('type') === 'Assistant' && getValues('provider') === 'IBM') && (
                        <>                     
                            <div style={{ display: 'flex', width: '100%', gap:'1rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Api Key'}</span>
                                    <span>{t(langKeys.apikeydescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("apikey", value)
                                                    clearErrors('apikey')
                                                }}
                                                valueDefault={getValues("apikey")}
                                                variant="outlined"
                                                error={errors?.apikey?.message}
                                            />
                                        </div>
                                        <div style={{ margin: '0 0.5rem' }}>
                                            <Tooltip title={t(langKeys.apikey_help)} arrow placement="top">
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>                                       
                                        </div>                                 
                                    </div>
                                </div>
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.status)}</span>
                                    <span>{t(langKeys.statusdescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0}}>
                                            <FieldSelect
                                                data={statusData}
                                                variant="outlined"
                                                optionDesc='domaindesc'
                                                optionValue='domainvalue'
                                                onChange={(value) => {
                                                    handleFieldSelectChange(value);
                                                    if (value) {
                                                        setValue('status', value.domaindesc);
                                                        clearErrors('status')
                                                    } else {
                                                        setValue('status', '');
                                                        clearErrors('status')
                                                    }
                                                }}
                                                valueDefault={getValues('status')}
                                                error={errors?.status?.message}
                                            />
                                        </div>                                   
                                    
                                    </div>
                                </div>
                            </div>                    
                        
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.name)}</span>
                                    <span>{t(langKeys.namedescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEdit
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("name", value)
                                                    clearErrors('name')
                                                }}
                                                valueDefault={getValues("name")}
                                                maxLength={512}
                                                variant="outlined"
                                                error={errors?.name?.message}
                                            />
                                        </div>                                   
                                    </div>
                                </div>

                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.description)}</span>
                                    <span>{t(langKeys.descriptiondescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                        <FieldEdit
                                            label={''}
                                            onChange={(value) => {
                                                setValue("description", value)
                                                clearErrors('description')
                                            }}
                                            valueDefault={getValues("description")}
                                            variant="outlined"
                                            error={errors?.description?.message}
                                        />
                                        </div>                                  
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {getValues('type') === 'Assistant' && getValues('provider') === 'IBM' && (
                        <>                                                
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>   
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Api Key'}</span>
                                    <span>{t(langKeys.apikeydescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("apikey", value)
                                                    clearErrors('apikey')
                                                }}
                                                valueDefault={getValues("apikey")}
                                                variant="outlined"
                                                error={errors?.apikey?.message}
                                            />
                                        </div>                                                                  
                                    </div>
                                </div>
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Skill ID'}</span>
                                    <span>{t(langKeys.skilliddescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("modelid", value)
                                                    clearErrors('modelid')
                                                }}
                                                valueDefault={getValues("modelid")}
                                                variant="outlined"
                                                error={errors?.modelid?.message}
                                            />
                                        </div>
                                        <div style={{ margin: '0 0.5rem' }}>
                                            <Tooltip title={t(langKeys.skillid_help)} arrow placement="top">
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>                                       
                                        </div>                                 
                                    </div>
                                </div>
                            </div>                  
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.name)}</span>
                                    <span>{t(langKeys.namedescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEdit
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("name", value)
                                                    clearErrors('name')
                                                }}
                                                valueDefault={getValues("name")}
                                                variant="outlined"
                                                error={errors?.name?.message}
                                            />
                                        </div>                                   
                                    </div>
                                </div>
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.description)}</span>
                                    <span>{t(langKeys.descriptiondescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                        <FieldEdit
                                            label={''}
                                            onChange={(value) => {
                                                setValue("description", value)
                                                clearErrors('description')
                                            }}
                                            valueDefault={getValues("description")}
                                            variant="outlined"
                                            error={errors?.description?.message}
                                        />
                                        </div>                                  
                                    </div>
                                </div>                          
                            </div>
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{t(langKeys.status)}</span>
                                    <span>{t(langKeys.statusdescription)}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0}}>
                                            <FieldSelect
                                                data={statusData}
                                                variant="outlined"
                                                optionDesc='domaindesc'
                                                optionValue='domainvalue'
                                                onChange={(value) => {
                                                    handleFieldSelectChange(value);
                                                    if (value) {
                                                        setValue('status', value.domaindesc);
                                                        clearErrors('status')

                                                    } else {
                                                        setValue('status', '');
                                                        clearErrors('status')
                                                    }
                                                }}
                                                valueDefault={getValues('status')}
                                                error={errors?.status?.message}
                                            />
                                        </div>                                   
                                    
                                    </div>
                                </div>                   
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    )
}

export default DetailIntelligentModels