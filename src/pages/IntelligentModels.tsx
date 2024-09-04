import React, { useCallback, useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldEditPassword } from 'components';
import { convertLocalDate, getIntelligentModelsSel, getValuesFromDomain, insIntelligentModels } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, execute, getMultiCollection } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { CellProps } from 'react-table';
import { Delete } from "@material-ui/icons";
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
interface DetailIntelligentModelsProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread2?: any;
}
const arrayBread = [
    { id: "view-1", name: "Intelligent models" },
    { id: "view-2", name: "Intelligent models detail" }
];

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
    
    const statusData = [
        {
            domainvalue: "ACTIVO",
            domaindesc: "ACTIVO",
        },
        {
            domainvalue: "INACTIVO",
            domaindesc: "INACTIVO",
        },         
    ];

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
    }, []);

    useEffect(() => {
        const updatedHelperText = helperServiceType(selectedValue);
        setHelperText(updatedHelperText);
    }, [selectedValue, helperServiceType]);

    const { getValues, register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            type: row ? (row.type || '') : '',
            id: row ? row.id : 0,
            endpoint: row ? (row.endpoint || '') : '',
            modelid: row ? (row.modelid || '') : '',
            url: row ? (row.url || '') : '',
            apikey: row ? (row.apikey || '') : '',
            skillid: row ? (row.skillid || '') : '',
            name: row ? (row.name || '') : '',
            description: row ? (row.description || '') : '',
            provider: row ? (row.provider || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');        
        register('apikey', {
            validate: (value) =>
                (value && value.length) || String(t(langKeys.field_required)),
        });
        register('name', {
            validate: (value) =>
                (value && value.length) || String(t(langKeys.field_required)),
        });
        register('description', {
            validate: (value) =>
                (value && value.length) || String(t(langKeys.field_required)),
        });
        register('status', {
            validate: (value) =>
                (value && value.length) || String(t(langKeys.field_required)),
        });    
        register('url', {
            validate: (value) =>
                getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
        register('skillid', {
            validate: (value) =>
                getValues('type') === 'Assistant' && getValues('provider') === 'IBM'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
    
    }, [register, getValues]);

    React.useEffect(() => {
        const selectedType = getValues('type');
        
        if (selectedType === 'Conversor de voz') {
            setValue('provider', 'OpenAI');
            clearErrors('provider');
        } else if (selectedType === 'Assistant' && getValues('provider') === 'IBM') {
            register('url', {
                validate: (value) =>
                    (value && value.length) || String(t(langKeys.field_required)),
            });
            register('skillid', {
                validate: (value) =>
                    (value && value.length) || String(t(langKeys.field_required)),
            });
        } else {
            setValue('provider', '');
            clearErrors('provider');
        }
    }, [getValues, setValue, clearErrors, register]);
    
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
        if (data.provider === 'OpenAI') {data.provider = 'Open AI'}    
        if (data.provider === 'Laraigo') {data.provider = 'LaraigoLLM'}    
        console.log(data)    
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

    const genAiProviders = [
        {
            domaindesc: 'Laraigo',
            domainvalue: 'Laraigo',
        },
        {
            domaindesc: 'IBM',
            domainvalue: 'IBM',
        },
        {
            domaindesc: 'OpenAI',
            domainvalue: 'OpenAI',
        },
        {
            domaindesc: 'Google',
            domainvalue: 'Google',
        },
        {
            domaindesc: 'Microsoft Azure',
            domainvalue: 'Microsoft Azure',
        },
    ]

    const assistantProviders = [
        {
            domaindesc: 'IBM',
            domainvalue: 'IBM',
        },
        {
            domaindesc: 'Microsoft Azure',
            domainvalue: 'Microsoft Azure',
        },
        {
            domaindesc: 'Google',
            domainvalue: 'Google',
        },
        {
            domaindesc: 'Rasa',
            domainvalue: 'Rasa',
        },
       
        {
            domaindesc: 'Meta',
            domainvalue: 'Meta',
        },       
    ]

    const handleFieldSelectChange = useCallback((newValue: any) => {
        const selectedDomainValue = newValue?.domainvalue || '';
        setSelectedValue(selectedDomainValue);
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={!!arrayBread2?[...arrayBread2,
                                { id: "view-1", name: t(langKeys.preferred) },
                                { id: "view-2", name: `${t(langKeys.iaconnectors)} ${t(langKeys.detail)}` }
                            ]:arrayBread}
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
                                    data={dataDomainStatus}
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
                                        disabled={getValues('type') === 'Conversor de voz'}
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

                {getValues('type') && getValues('provider') && !(getValues('type') === 'Assistant' && getValues('provider') === 'IBM') && (
                    <>
                        <div className='row-zyx' style={{ borderBottom: '1px solid black', padding: '15px 0 10px 0' }}>
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{'Registro de Servicios'}</span>
                        </div>
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
                        <div className='row-zyx' style={{ borderBottom: '1px solid black', padding: '15px 0 10px 0' }}>
                            <span style={{ fontWeight: 'bold', fontSize: 20 }}>{'Registro de Servicios'}</span>
                        </div>

                        <div style={{ display: 'flex', width: '100%', gap:'3rem' }}>    

                            <div className={classes.customFieldPackageContainer} style={{ marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 18 }}>{'Url'}</span>
                                <span>{'Coloca la url que brinda IBM relacionada a la instancia del modelo que deseas registrar.'}</span>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <div className="row-zyx" style={{ width: '92.2vw', marginBottom: 0 }}>
                                        <FieldEditPassword
                                            label={''}
                                            onChange={(value) => {
                                                setValue("url", value)
                                                clearErrors('url')
                                            }}
                                            valueDefault={getValues("url")}
                                            maxLength={512}
                                            variant="outlined"
                                            error={errors?.url?.message}
                                        />
                                    </div>                                   
                                </div>
                            </div>     
                        </div>

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
                                <span>{'Registra el api key proporcionado por el proveedor de IA seleccionado.'}</span>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <div className="row-zyx" style={{ width: '45vw', marginBottom: 0 }}>
                                        <FieldEditPassword
                                            label={''}
                                            onChange={(value) => {
                                                setValue("skillid", value)
                                                clearErrors('skillid')
                                            }}
                                            valueDefault={getValues("skillid")}
                                            maxLength={512}
                                            variant="outlined"
                                            error={errors?.skillid?.message}
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

                    {/* {service === 'WATSON ASSISTANT' ? (
                        <>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.endpoint)}
                                    className="col-6"
                                    onChange={(value) => setValue('endpoint', value)}
                                    valueDefault={row ? (row.endpoint || "") : ""}
                                    error={errors?.endpoint?.message}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.apikey)}
                                    className="col-6"
                                    onChange={(value) => setValue('apikey', value)}
                                    valueDefault={row ? (row.apikey || "") : ""}
                                    error={errors?.apikey?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.modelid)}
                                    className="col-6"
                                    onChange={(value) => setValue('modelid', value)}
                                    valueDefault={row ? (row.modelid || "") : ""}
                                    error={errors?.modelid?.message}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldEdit
                                    className='col-6'
                                    label={t(langKeys.name)}
                                    onChange={(value) => setValue('name', value)}
                                    valueDefault={row ? (row.name || "") : ""}
                                    error={errors?.name?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    className="col-6"
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={row ? (row.description || "") : ""}
                                    error={errors?.description?.message}
                                />
                            </div>
                        </>
                    ) : service === 'LARGE LANGUAGE MODEL' ? (
                        <div className='row-zyx'>
                            <FieldEdit
                                className='col-6'
                                type='password'
                                label={t(langKeys.apikey)}
                                onChange={(value) => setValue('apikey', value)}
                                valueDefault={getValues('apikey')}
                                error={errors?.apikey?.message}
                                InputProps={{
                                    autoComplete: 'off',
                                }}
                            />
                            <FieldSelect
                                className='col-6'
                                label={t(langKeys.provider)}
                                data={providers}
                                optionDesc='domaindesc'
                                optionValue='domainvalue'
                                onChange={(value) => {
                                    if(value) {
                                        setValue('provider', value.domaindesc)
                                    } else {
                                        setValue('provider', '')
                                    }
                                }}
                                valueDefault={getValues('provider')}
                                error={errors?.provider?.message}
                            />
                            <FieldEdit
                                className='col-6'
                                label={t(langKeys.name)}
                                onChange={(value) => setValue('name', value)}
                                valueDefault={getValues('name')}
                                error={errors?.name?.message}
                            />
                            <FieldEdit
                                className='col-6'
                                label={t(langKeys.description)}
                                onChange={(value) => setValue('description', value)}
                                valueDefault={getValues('description')}
                                error={errors?.description?.message}
                            />
                        </div>
                    ): service === 'RASA' ? (
                        <>
                            <div className='row-zyx'>
                                <FieldEdit
                                    className='col-6'
                                    label={t(langKeys.endpoint)}
                                    onChange={(value) => setValue('endpoint', value)}
                                    valueDefault={row ? (row.endpoint || "") : ""}
                                    error={errors?.endpoint?.message}
                                />
                            </div>
                            <div className='row-zyx'>
                                <FieldEdit
                                    className='col-6'
                                    label={t(langKeys.name)}
                                    onChange={(value) => setValue('name', value)}
                                    valueDefault={row ? (row.name || "") : ""}
                                    error={errors?.name?.message}
                                />
                                <FieldEdit
                                    className='col-6'
                                    label={t(langKeys.description)}
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={row ? (row.description || "") : ""}
                                    error={errors?.description?.message}
                                />
                            </div>
                        </>
                    ): service !== '' ? (
                        <>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.endpoint)}
                                    className="col-6"
                                    onChange={(value) => setValue('endpoint', value)}
                                    valueDefault={row ? (row.endpoint || "") : ""}
                                    error={errors?.endpoint?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.modelid)}
                                    className="col-6"
                                    onChange={(value) => setValue('modelid', value)}
                                    valueDefault={row ? (row.modelid || "") : ""}
                                    error={errors?.modelid?.message}
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.apikey)}
                                    className="col-6"
                                    onChange={(value) => setValue('apikey', value)}
                                    valueDefault={row ? (row.apikey || "") : ""}
                                    error={errors?.apikey?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.provider)}
                                    className="col-6"
                                    onChange={(value) => setValue('provider', value)}
                                    valueDefault={row ? (row.provider || "") : ""}
                                    error={errors?.provider?.message}
                                />
                            </div>
                            <div className="row-zyx">   
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    className="col-6"
                                    onChange={(value) => setValue('description', value)}
                                    valueDefault={row ? (row.description || "") : ""}
                                    error={errors?.description?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.name)}
                                    className="col-6"
                                    onChange={(value) => setValue('name', value)}
                                    valueDefault={row ? (row.name || "") : ""}
                                    error={errors?.name?.message}
                                />
                            </div>
                        </>
                    ) : (
                        <></>
                    )} */}


                </div>
            </form>
        </div>
    );
}

interface IAConnectors {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

const IntelligentModels: React.FC<IAConnectors> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const selectionKey = "id";

    const functionChange = (change:string) => {
        if(change==="view-0"){
            setExternalViewSelected && setExternalViewSelected("view-1");
        }else{
            setViewSelected(change);
        }
    }

    const columns = React.useMemo(
        () => [          
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: false,
                width: 'auto',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: false,
                width: 'auto',
            },
            {
                Header: t(langKeys.type_service),
                accessor: 'type',
                type: "select",
                listSelectFilter: [
                    { key: "Gen AI", value: "GenAI" },
                    { key: "Assistant", value: "Assistant" },
                    { key: "Conversor de voz", value: "VoiceConversor" },
                ],
                width: 'auto',
            },          
            {
                Header: t(langKeys.provider),
                accessor: 'provider',
                type: "select",
                listSelectFilter: [
                    { key: "LaraigoLLM", value: "LaraigoLLM" },
                    { key: "WatsonX", value: "WatsonX" },
                    { key: "OpenAI", value: "OpenAI" },
                    { key: "Meta", value: "Meta" },
                    { key: "Mistral", value: "Mistral" },
                ],
                width: 'auto',
                Cell: (props: Dictionary) => {
                    const { provider } = props.cell.row.original;
                    return provider !== '' ? provider : t(langKeys.none);
                }
            },
            {
                accessor: "createdate",
                Header: t(langKeys.timesheet_registerdate),
                NoFilter: false,               
                type: "date",
                sortType: "datetime",
                width: 'auto',

                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;                
                    if (row && row.createdate) {
                        return convertLocalDate(row.createdate).toLocaleString();
                    } else {
                        return "";
                    }
                },           
            },         
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                NoFilter: false,               
                width: 'auto'
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                type: "select",
                listSelectFilter: [
                    { key: "ACTIVO", value: "ACTIVO" },
                    { key: "DESACTIVO", value: "DESACTIVO" },                
                ],
                prefixTranslation: 'status_',
                 width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original|| {}; 
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                },            
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getIntelligentModelsSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("SERVICIOIA"),
        ]));

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.intelligentmodels).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: false });
    } 

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            const newRowWithDataSelected = Object.keys(selectedRows)
                .map((key) =>
                    mainResult.mainData.data.find((row) => row.id === parseInt(key)) ??
                    rowWithDataSelected.find((row) => row.id === parseInt(key)) ??
                    {}
                )
                .filter(row => row.id)    
            setRowWithDataSelected(newRowWithDataSelected);
        }
    }, [selectedRows, mainResult.mainData.data])
  
    const handleMassiveDelete = (dataSelected: Dictionary[]) => {
        const callback = () => {
            dataSelected.forEach(row => {
                const deleteOperation = {
                    ...row,
                    operation: 'DELETE',                   
                    status: 'ELIMINADO',
                    id: row.id
                } 
                dispatch(execute(insIntelligentModels(deleteOperation)))
            })
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }  
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelected === "view-1") {

        return (
            
            <div style={{ width: "100%", marginTop:'1rem', marginRight:'0.5rem' }}>
                {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.iaconnectors) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <div style={{fontSize:'1.5rem', fontWeight:'bolder'}}>{t(langKeys.connectors)}</div>
                <TableZyx
                    ButtonsElement={() => {
                        if (!setExternalViewSelected) {
                            return (
                                <>
                                    <div style={{marginTop:'0rem'}}>
                                        <Button
                                            color="primary"
                                            disabled={mainPaginated.loading || Object.keys(selectedRows).length === 0}
                                            startIcon={<Delete style={{ color: "white" }} />}
                                            variant="contained"
                                            onClick={() => {
                                                handleMassiveDelete(rowWithDataSelected);
                                            }}
                                        >
                                            {t(langKeys.delete)}
                                        </Button>  
                                    </div>
                                    
                                                                   
                                </>                             
                            )
                        } else {
                            return (
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => setExternalViewSelected("view-1")}
                                >
                                    {t(langKeys.back)}
                                </Button>
                            )
                        }
                    }}
                    autotrigger={true}
                    columns={columns}
                    data={mainResult.mainData.data}
                    filterGeneral={false}
                    handleRegister={handleRegister}
                    onClickRow={handleEdit}                    
                    loading={mainResult.mainData.loading}
                    register={true}
                    download={true}
                    useSelection={true}                  
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    titlemodule={!!window.location.href.includes("iaconectors")?" ":t(langKeys.intelligentmodels, { count: 2 })}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailIntelligentModels
                data={rowSelected}
                setViewSelected={functionChange}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread2={arrayBread}
            />
        )
    } else
        return null;

}

export default IntelligentModels;