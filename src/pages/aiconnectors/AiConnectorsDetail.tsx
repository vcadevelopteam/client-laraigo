import React, { useCallback, useEffect, useState } from 'react'; 
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
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [helperText, setHelperText] = useState<string>('');   
    const oldTypes = ["LARGE LANGUAGE MODEL", "NATURAL LANGUAGE CLASSIFIER", "NATURAL LANGUAGE UNDERSTANDING", "TONE ANALYZER","","WIT.AI"];
    const providerMap: Record<string, string> = { 'LaraigoLLM': 'Laraigo', 'Open AI': 'OpenAI', 'RASA': 'Rasa', 'WATSON ASSISTANT': 'IBM'}    
    const reverseProviderMap: Record<string, string> = { 'Laraigo': 'LaraigoLLM', 'OpenAI': 'Open AI'}
    
    const mapProvider = (provider: string, type?: string, forSave = false) => {
        if (forSave) { return reverseProviderMap[provider] || provider }
        if (type && providerMap[type]) { return providerMap[type] }
        return providerMap[provider] || provider
    }    
       
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
        { domaindesc: 'Meta', domainvalue: 'Meta' },
        { domaindesc: 'Mistral', domainvalue: 'Mistral' }
    ]    

    const assistantProviders = [
        { domaindesc: 'IBM', domainvalue: 'IBM' },
        { domaindesc: 'Microsoft Azure', domainvalue: 'Microsoft Azure' },
        { domaindesc: 'Google', domainvalue: 'Google' },
        { domaindesc: 'Rasa', domainvalue: 'Rasa' },
        { domaindesc: 'Meta', domainvalue: 'Meta' }
    ]    

    const helperServiceType = useCallback((value: string) => {
        switch (value) {
            case "GENAI":
                return "Registra un servicio de inteligencia artificial generativa, con el uso de modelos como Llama3, GPT4, Gemini y más.";
            case "ASSISTANT":
                return "Registra un servicio de inteligencia artificial tradicional, crea tus modelos de detección de intenciones y entidades.";
            case "VOICECONVERSOR":
                return "Registra un servicio de transcripción y traducción de audio para tus conversaciones.";
            default:
                return "";
        }
    }, [])

    useEffect(() => {
        const updatedHelperText = helperServiceType(selectedValue)
        setHelperText(updatedHelperText)
    }, [selectedValue, helperServiceType])

    const handleFieldSelectChange = useCallback((newValue: Dictionary) => {
        const selectedDomainValue = newValue?.domainvalue || ''
        setSelectedValue(selectedDomainValue)
    }, [])

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread2 
                            ? [...arrayBread2.map(item => ({ ...item, name: item.name || "" })),
                                { id: "view-1", name: "Conectores" }, 
                                { id: "view-2", name: "Registrar conector" }]
                            : arrayBread}
                        handleClick={setViewSelected}
                    />
                        <TitleDetail
                            title={row ? `${row.name}` : 'Nuevo Conector'}
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
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{'Tipo de Servicio'}</span>
                            <span>{'Selecciona el tipo de servicio que registrarás y emplearas en Laraigo'}</span>
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
                                            } else {
                                                setValue('type', '');
                                            }
                                        }}
                                        valueDefault={getValues('type')}
                                    />
                                </div>
                                <div style={{ margin: '0 0.5rem' }}>
                                    {helperText && selectedValue && (
                                        <Tooltip title={helperText} arrow placement="top">
                                            <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                        </Tooltip>
                                    )}
                                </div>
                                <div style={{ margin: '0 1rem', padding: '0' }}>
                                    {getValues('type') === '' && (
                                        <div className={classes.warningContainer} style={{ width: 220 }}>
                                            <WarningIcon style={{ color: '#FF7575' }} />
                                            Selecciona una opción
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {getValues('type') && 
                            <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 20 }}>{'Proveedor'}</span>
                                <span>{'Selecciona el proveedor del servicio de inteligencia artificial que deseas registrar.'}</span>
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
                                                Selecciona una opción
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>    

                    {getValues('provider') && (
                        <div className='row-zyx' style={{ borderBottom: '1px solid black', padding: '15px 0 10px 0' }}>
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{'Registro de Servicios'}</span>
                        </div>
                    )}                   

                    {((getValues('type') === 'Assistant' && getValues('provider') === 'Rasa') || (getValues('type') === 'Assistant' && getValues('provider') === 'IBM')) && (
                        <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>  
                            <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Url'}</span>
                                {getValues('provider') === 'Rasa'&& (
                                    <span>{'Coloca la url que genera Laraigo relacionada al conector Rasa que se desea registrar.'}</span>
                                )}
                                {getValues('provider') === 'IBM'&& (
                                    <span>{'Coloca la url que brinda IBM relacionada a la instancia del modelo que deseas registrar.'}</span>
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
                                            maxLength={512}
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
                                    <span>{'Registra el api key proporcionado por el proveedor de IA seleccionado.'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("apikey", value)
                                                    clearErrors('apikey')
                                                }}
                                                valueDefault={getValues("apikey")}
                                                maxLength={512}
                                                variant="outlined"
                                                error={errors?.apikey?.message}
                                            />
                                        </div>
                                        <div style={{ margin: '0 0.5rem' }}>
                                            <Tooltip title={'El api key usualmente se encuentra en el perfil de tu cuenta relacionada al proveedor de la inteligencia artificial.'} arrow placement="top">
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>                                       
                                        </div>                                 
                                    </div>
                                </div>
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Estado'}</span>
                                    <span>{'Selecciona el estado de tu conector, si deseas que se encuentre activo o inactivo.'}</span>
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
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Nombre'}</span>
                                    <span>{'Asigna un nombre para el conector que registrarás.'}</span>
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
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Descripción'}</span>
                                    <span>{'Asigna una breve descripción al conector que registrarás.'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                        <FieldEdit
                                            label={''}
                                            onChange={(value) => {
                                                setValue("description", value)
                                                clearErrors('description')
                                            }}
                                            valueDefault={getValues("description")}
                                            maxLength={512}
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
                                    <span>{'Registra el api key proporcionado por el proveedor de IA seleccionado.'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("apikey", value)
                                                    clearErrors('apikey')
                                                }}
                                                valueDefault={getValues("apikey")}
                                                maxLength={512}
                                                variant="outlined"
                                                error={errors?.apikey?.message}
                                            />
                                        </div>                                                                  
                                    </div>
                                </div>
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Skill ID'}</span>
                                    <span>{'Coloca el skill id del modelo que deseas registrar, en la opción “View Api Details” encontraras el detalle.'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                            <FieldEditPassword
                                                label={''}
                                                onChange={(value) => {
                                                    setValue("modelid", value)
                                                    clearErrors('modelid')
                                                }}
                                                valueDefault={getValues("modelid")}
                                                maxLength={512}
                                                variant="outlined"
                                                error={errors?.modelid?.message}
                                            />
                                        </div>
                                        <div style={{ margin: '0 0.5rem' }}>
                                            <Tooltip title={'Si no cuentas con un skill creado previamente en IBM, podrás crearlo en la opción de “Entrenamiento IA” de Laraigo.'} arrow placement="top">
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>                                       
                                        </div>                                 
                                    </div>
                                </div>
                            </div>                  
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Nombre'}</span>
                                    <span>{'Asigna un nombre para el conector que registrarás.'}</span>
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
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Descripción'}</span>
                                    <span>{'Asigna una breve descripción al conector que registrarás.'}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                        <FieldEdit
                                            label={''}
                                            onChange={(value) => {
                                                setValue("description", value)
                                                clearErrors('description')
                                            }}
                                            valueDefault={getValues("description")}
                                            maxLength={512}
                                            variant="outlined"
                                            error={errors?.description?.message}
                                        />
                                        </div>                                  
                                    </div>
                                </div>                          
                            </div>
                            <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>                       
                                <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Estado'}</span>
                                    <span>{'Selecciona el estado de tu conector, si deseas que se encuentre activo o inactivo.'}</span>
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