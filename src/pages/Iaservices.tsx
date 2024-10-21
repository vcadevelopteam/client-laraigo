import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch } from 'components';
import { getChannelsByOrg, getIntelligentModelsConfigurations, getIntelligentModelsSel, getValuesFromDomain, insInteligentModelConfiguration } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { CellProps } from 'react-table';

const serviceTypes = [
    {
        type: 'ASSISTANT',
        options: [
            { value: 'RASA', description: 'RASA' },
            { value: 'WATSON ASSISTANT', description: 'WATSON ASSISTANT' },
            { value: 'WIT.AI', description: 'WIT.AI' }
        ]
    },
    {
        type: 'CLASSIFIER',
        options: [
            { value: 'NATURAL LANGUAGE CLASSIFIER', description: 'NATURAL LANGUAGE CLASSIFIER' }
        ]
    },
    {
        type: 'NATURAL LANGUAGE UNDERSTANDING',
        options: [
            { value: 'NATURAL LANGUAGE UNDERSTANDING', description: 'NATURAL LANGUAGE UNDERSTANDING' }
        ]
    },
    {
        type: 'TONE ANALYZER',
        options: [
            { value: 'TONE ANALYZER', description: 'TONE ANALYZER' }
        ]
    },
    {
        type: 'LARGE LANGUAGE MODEL'
    }
]

const transtaltion_services = [
    {
        value: 'IBM',
        description: 'IBM'
    },
    {
        value: 'GOOGLE',
        description: 'GOOGLE'
    }
]

const analysis_type = [
    {
        value: 'DESACTIVADO',
        description: 'DESACTIVADO'
    },
    {
        value: 'BYINTERACTION',
        description: 'Por Interaccion'
    },
    {
        value: 'BYCONVERSATION',
        description: 'Por Conversacion'
    }
];

const service_type_tone = [
    {
        value: 'CUSTOMER',
        description: 'Atención al cliente'
    },
    {
        value: 'GENERAL',
        description: 'General'
    },
]

const nlu_fields = [
    {
        value: 'categories',
        description: 'Categorias'
    },
    {
        value: 'concepts',
        description: 'Conceptos'
    },
    {
        value: 'emotion',
        description: 'Emociones'
    },
    {
        value: 'entities',
        description: 'Entidades'
    },
    {
        value: 'keywords',
        description: 'Palabras Clave'
    },
    {
        value: 'semanticroles',
        description: 'Roles Semanticos'
    },
    {
        value: 'sentiment',
        description: 'Sentimiento'
    }
]

interface servicesData {
    service: string,
    intelligentmodelsid: number,
    analyzemode: string,
    analyzecustomer: boolean,
    analyzebot: boolean,
    analyzeuser: boolean,
    id?: string,
    categories?: boolean,
    concepts?: boolean,
    emotion?: boolean,
    entities?: boolean,
    keywords?: boolean,
    semanticroles?: boolean,
    sentiment?: boolean,
    translationservice?: string,
    contextperconversation?: boolean,
    firstinteraction?: boolean,
}

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailIaServiceProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    arrayBread?: any
}

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
    title: {
        fontSize: '22px',
        color: theme.palette.text.primary,
    },
    mb2: {
        marginBottom: theme.spacing(4),
    },
    switches: {
        background: '#ccc3',
        marginRight: '10px',
        padding: '10px 10px 20px 10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '4px'
    }
}));

const DetailIaService: React.FC<DetailIaServiceProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataModels = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataChannels = multiData[1] && multiData[1].success ? multiData[1].data : [];
    //const dataModelType = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataStatus = multiData[3] && multiData[3].success ? multiData[3].data : [];

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<any>({
        defaultValues: {
            id: row ? row.intelligentmodelsconfigurationid : 0,
            description: row ? (row.description || '') : '',
            status: row ? row.status : 'ACTIVO',
            type: 'NINGUNO',
            color: '#FFFFFF',
            icontype: "fab fa-reddit-alien",
            channels: row?.communicationchannelid || '',
            channelsdesc: row ? row.channeldesc : '', //for table
            operation: row ? "EDIT" : "INSERT",
            services: (row?.parameters) ? JSON.parse(row?.parameters) : []
        }
    });

    const { fields, append: fieldsAppend, remove: fieldRemove, update: fieldUpdate } = useFieldArray({
        control,
        name: 'services',
    });

    const handlerNewColumn = () => fieldsAppend({
        type_of_service: '',
        service: '',
        intelligentmodelsid: '',
        analyzemode: '',
        translationservice: '',
        analyzecustomer: false,
        analyzebot: false,
        servicetype: '',
        analyzeuser: false,
        categories: false,
        concepts: false,
        emotion: false,
        entities: false,
        keywords: false,
        semanticroles: false,
        sentiment: false,
        contextperconversation: true,
        firstinteraction: false,
    });

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channels', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channelsdesc', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);


    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const handlerDeleteColumn = (index: number) => {
        fieldRemove(index)
    };

    const onSubmit = handleSubmit((data) => {
        if (data.services.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.iaservice_must_select) }))
            return
        }

        data.services.forEach((item: servicesData) => {
            delete item.id
            if (item.service !== 'NATURAL LANGUAGE UNDERSTANDING') {
                delete item.categories
                delete item.concepts
                delete item.emotion
                delete item.entities
                delete item.keywords
                delete item.semanticroles
                delete item.sentiment
                delete item.translationservice
            }
        })

        data.services = JSON.stringify(data.services)
        const callback = () => {
            dispatch(execute(insInteligentModelConfiguration(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });
    
    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[
                                ...(arrayBread || []),
                                { id: "view-1", name: t(langKeys.iaconfiguration) },
                                { id: "view-2", name: `${t(langKeys.iaconfiguration)} ${t(langKeys.detail)}` }
                            ]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newiaservice)}
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
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.corporation)} // "Corporation"
                            className="col-6"
                            valueDefault={user?.corpdesc}
                            disabled={true}
                        />

                        <FieldEdit
                            label={t(langKeys.organization)} // "Organization"
                            className="col-6"
                            valueDefault={user?.orgdesc}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldMultiSelect //los multiselect te devuelven un array de objetos en OnChange por eso se le recorre
                            label={t(langKeys.channel)}
                            className="col-12"
                            valueDefault={row?.communicationchannelid || ""}
                            onChange={(value) => {
                                setValue('channels', value.map((o: Dictionary) => o.communicationchannelid).join())
                                setValue('channelsdesc', value.map((o: Dictionary) => o.description).join())
                            }}
                            error={errors?.channels?.message}
                            loading={false}
                            data={dataChannels}
                            optionDesc="description"
                            optionValue="communicationchannelid"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={row ? (row.description || "") : ""}
                            onChange={(value) => setValue('description', value)}
                            disabled={false}
                            error={errors?.description?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                            error={errors?.status?.message}
                            uset={true}
                            prefixTranslation="status_"
                            data={dataStatus}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
            </form>

            <div className={classes.containerDetail}>
                <div>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <div className={classes.title}>{t(langKeys.services_plural)}</div>
                        <div>
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon color="secondary" />}
                                onClick={() => handlerNewColumn()}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.register)}
                            </Button>
                        </div>
                    </div>
                    {fields.map((item: Dictionary, i) =>
                        <div key={item.id}>
                            <Accordion expanded={!row ? true : undefined} style={{ marginBottom: '8px' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography style={{ fontSize: 16 }}>{getValues(`services.${i}.service`) || t(langKeys.newiaservice)}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <form onSubmit={onSubmit} style={{ width: '100%' }}>
                                        <div className="row-zyx">
                                            <div className="col-12">
                                                <FieldSelect
                                                    fregister={{
                                                        ...register(`services.${i}.type_of_service`, {
                                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                        })
                                                    }}
                                                    onChange={(value) => {
                                                        // fieldUpdate(i, { ...fields[i], type_of_service: value ? value.type : '', service: '' })
                                                        setValue(`services.${i}.type_of_service`, value?.type || "")
                                                        trigger(`services.${i}.type_of_service`)

                                                        setValue(`services.${i}.service`, "")
                                                        trigger(`services.${i}.service`)
                                                    }}
                                                    label={t(langKeys.type_service)}
                                                    className={classes.mb2}
                                                    valueDefault={getValues(`services.${i}.type_of_service`)}
                                                    error={errors?.services?.[i]?.type_of_service?.message}
                                                    data={serviceTypes}
                                                    optionDesc="type"
                                                    optionValue="type"
                                                />
                                                {getValues(`services.${i}.type_of_service`) !== '' && getValues(`services.${i}.type_of_service`) !== 'LARGE LANGUAGE MODEL' && (
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`services.${i}.service`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            if (value) {
                                                                if (fields.some((x: any) => x.service === value.value)) {
                                                                    // fieldUpdate(i, { ...fields[i], service: '' })
                                                                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.iaservice_already_exist) }))
                                                                    setValue(`services.${i}.type_of_service`, "");
                                                                    setValue(`services.${i}.service`, "");
                                                                    trigger(`services.${i}.service`)
                                                                    trigger(`services.${i}.type_of_service`)
                                                                } else {
                                                                    setValue(`services.${i}.service`, value?.value || "")
                                                                    trigger(`services.${i}.service`)
                                                                }
                                                            } else {
                                                                setValue(`services.${i}.service`, value?.value || "")
                                                                trigger(`services.${i}.service`)
                                                            }
                                                            // fieldUpdate(i, { ...fields[i], service: value ? value.value : '' })

                                                        }}
                                                        // triggerOnChangeOnFirst={true}
                                                        label={t(langKeys.model_type)}
                                                        className={classes.mb2}
                                                        valueDefault={getValues(`services.${i}.service`)}
                                                        error={errors?.services?.[i]?.service?.message}
                                                        data={serviceTypes.find((y: any) => y.type === getValues(`services.${i}.type_of_service`))?.options || []}
                                                        optionDesc="value"
                                                        optionValue="value"
                                                    />
                                                )}

                                                {getValues(`services.${i}.service`) !== '' && (
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`services.${i}.intelligentmodelsid`, {
                                                                validate: (value: any) => (value) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setValue(`services.${i}.intelligentmodelsid`, value?.id || 0)
                                                            trigger(`services.${i}.intelligentmodelsid`)
                                                            // fieldUpdate(i, { ...fields[i], intelligentmodelsid: value.intelligentmodelsid })
                                                        }
                                                        }
                                                        label={t(langKeys.model)}
                                                        className={classes.mb2}
                                                        error={errors?.services?.[i]?.intelligentmodelsid?.message}
                                                        data={dataModels.filter((y: any) => y.type.trim() === getValues(`services.${i}.service`))}
                                                        valueDefault={getValues(`services.${i}.intelligentmodelsid`)}
                                                        optionDesc="description"
                                                        optionValue="id"
                                                    />
                                                )}
                                                {getValues(`services.${i}.service`) === 'NATURAL LANGUAGE UNDERSTANDING' && (
                                                    <div>
                                                        <FieldSelect
                                                            fregister={{
                                                                ...register(`services.${i}.translationservice`, {
                                                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                                })
                                                            }}
                                                            onChange={(value) => {
                                                                fieldUpdate(i, { ...fields[i], translationservice: value.value })
                                                            }}
                                                            label={t(langKeys.translationservice)}
                                                            className={classes.mb2}
                                                            valueDefault={(item.translationservice) ? item.translationservice : ''}
                                                            error={errors?.services?.[i]?.translationservice?.message}
                                                            data={transtaltion_services}
                                                            optionDesc="description"
                                                            optionValue="value"
                                                        />

                                                        <div style={{ display: 'flex', flexWrap: 'wrap' }} className={classes.mb2}>
                                                            {nlu_fields.map((it, index) =>
                                                                <TemplateSwitch
                                                                    key={index}
                                                                    valueDefault={item[it.value] || false}
                                                                    fregister={{
                                                                        ...register(`services.${i}.${it.value}`)
                                                                    }}
                                                                    label={it.description}
                                                                    className={classes.switches}
                                                                    style={{ flex: '0 0 170px', paddingBottom: '10px' }}
                                                                    onChange={(value) => setValue(`services.${i}.${it.value}`, value)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                {getValues(`services.${i}.service`) === 'TONE ANALYZER' && (
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`services.${i}.servicetype`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setValue(`services.${i}.servicetype`, value?.value || "")
                                                            trigger(`services.${i}.servicetype`)

                                                            // fieldUpdate(i, { ...fields[i], servicetype: value.value })
                                                        }}
                                                        label={'Service type'} //traduccion
                                                        className={classes.mb2}
                                                        valueDefault={(item.servicetype) ? item.servicetype : ''}
                                                        error={errors?.services?.[i]?.servicetype?.message}
                                                        data={service_type_tone}
                                                        optionDesc="description"
                                                        optionValue="value"
                                                    />
                                                )}
                                                {getValues(`services.${i}.type_of_service`) !== 'LARGE LANGUAGE MODEL' &&(
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`services.${i}.analyzemode`, {
                                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        label={t(langKeys.analysis_type)}
                                                        className={classes.mb2}
                                                        error={errors?.services?.[i]?.analyzemode?.message}
                                                        valueDefault={getValues(`services.${i}.analyzemode`)}
                                                        onChange={(value) => {
                                                            setValue(`services.${i}.analyzemode`, value?.value || "")
                                                        }}
                                                        data={analysis_type}
                                                        optionDesc="description"
                                                        optionValue="value"
                                                    />
                                                )}
                                                {getValues(`services.${i}.type_of_service`) === 'LARGE LANGUAGE MODEL' && (
                                                    <FieldSelect
                                                        fregister={{
                                                            ...register(`services.${i}.intelligentmodelsid`, {
                                                                validate: (value: any) => (value) || t(langKeys.field_required)
                                                            })
                                                        }}
                                                        onChange={(value) => {
                                                            setValue(`services.${i}.intelligentmodelsid`, value?.id || 0)
                                                            trigger(`services.${i}.intelligentmodelsid`)
                                                            // fieldUpdate(i, { ...fields[i], intelligentmodelsid: value.intelligentmodelsid })
                                                        }
                                                        }
                                                        label={t(langKeys.model)}
                                                        className={classes.mb2}
                                                        error={errors?.services?.[i]?.intelligentmodelsid?.message}
                                                        data={dataModels.filter((y: any) => y.type.trim() === 'LARGE LANGUAGE MODEL')}
                                                        valueDefault={getValues(`services.${i}.intelligentmodelsid`)}
                                                        optionDesc="name"
                                                        optionValue="id"
                                                    />
                                                )}
                                                {getValues(`services.${i}.type_of_service`) !== 'LARGE LANGUAGE MODEL' && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap' }} className={classes.mb2}>
                                                        <TemplateSwitch
                                                            fregister={{
                                                                ...register(`services.${i}.analyzecustomer`)
                                                            }}
                                                            label={t(langKeys.client_message)}
                                                            valueDefault={(item.analyzecustomer) ? item.analyzecustomer : false}
                                                            style={{ flex: '0 0 170px' }}
                                                            onChange={(value) => setValue(`services.${i}.analyzecustomer`, value)}
                                                        />
                                                        <TemplateSwitch
                                                            fregister={{
                                                                ...register(`services.${i}.analyzebot`)
                                                            }}
                                                            label={t(langKeys.bot_message)}
                                                            valueDefault={(item.analyzebot) ? item.analyzebot : false}
                                                            style={{ flex: '0 0 170px' }}
                                                            onChange={(value) => setValue(`services.${i}.analyzebot`, value)}
                                                        />
                                                        <TemplateSwitch
                                                            fregister={{
                                                                ...register(`services.${i}.analyzeuser`)
                                                            }}
                                                            label={t(langKeys.agent_message)}
                                                            valueDefault={(item.analyzeuser) ? item.analyzeuser : false}
                                                            style={{ flex: '0 0 170px' }}
                                                            onChange={(value) => setValue(`services.${i}.analyzeuser`, value)}
                                                        />
                                                    </div>
                                                )}
                                                {getValues(`services.${i}.type_of_service`) === 'LARGE LANGUAGE MODEL' && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap' }} className={classes.mb2}>
                                                        <TemplateSwitch
                                                            fregister={{
                                                                ...register(`services.${i}.contextperconversation`)
                                                            }}
                                                            label={t(langKeys.contextperconversation)}
                                                            valueDefault={(item.contextperconversation) ? item.contextperconversation : true}
                                                            style={{ flex: '0 0 170px' }}
                                                            onChange={(value) => setValue(`services.${i}.contextperconversation`, value)}
                                                        />
                                                        <TemplateSwitch
                                                            fregister={{
                                                                ...register(`services.${i}.firstinteraction`)
                                                            }}
                                                            label={t(langKeys.firstinteraction)}
                                                            valueDefault={(item.firstinteraction) ? item.firstinteraction : false}
                                                            style={{ flex: '0 0 170px' }}
                                                            onChange={(value) => setValue(`services.${i}.firstinteraction`, value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <Button
                                                variant="contained"
                                                type="button"
                                                color="primary"
                                                startIcon={<DeleteIcon color="secondary" />}
                                                style={{ backgroundColor: "#FB5F5F" }}
                                                onClick={() => handlerDeleteColumn(i)}
                                            >{t(langKeys.delete)}</Button>
                                        </div>
                                    </form>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


interface IAConfigurationProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

const IAConfiguration: React.FC<IAConfigurationProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    
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
                accessor: 'orgid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.channeltype),
                accessor: 'channeltype',
                NoFilter: true
            },
            {
                Header: t(langKeys.channeldesc),
                accessor: 'channeldesc',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {}; 
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getIntelligentModelsConfigurations()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getIntelligentModelsSel(0),
            getChannelsByOrg(),
            getValuesFromDomain("TIPOMODELO"),
            getValuesFromDomain("ESTADOGENERICO")
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const data = {
            channels: row.communicationchannelid,
            id: row.intelligentmodelsconfigurationid,
            operation: "DELETE",
            description: row.description,
            type: "NINGUNO",
            color: row.color,
            icontype: row.icontype,
            services: row.parameters,
            status: "ELIMINADO",
        }

        const callback = () => {
            dispatch(execute(insInteligentModelConfiguration(data)));
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
            
            <div style={{ width: "100%" }}>
                {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.iaconfiguration) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <TableZyx
                    onClickRow={handleEdit}
                    ButtonsElement={() => {
                        if(!setExternalViewSelected){
                            return <></>
                        }else{
                            return (
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => setExternalViewSelected("view-1")}
                                >{t(langKeys.back)}</Button>
                            )
                        }}}
                    columns={columns}
                    titlemodule={t(langKeys.iaconfiguration)}
                    data={mainResult.mainData.data}
                    download={false}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailIaService
                data={rowSelected}
                setViewSelected={functionChange}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default IAConfiguration;