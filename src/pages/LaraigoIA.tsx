//TODO: en conectares hay un tipo preguntar de donde sale

/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch, TemplateIcons } from 'components';
import { getChannelsByOrg, getIntelligentModels, getIntelligentModelsConfigurations, getValuesFromDomain, insInteligentModelConfiguration } from 'common/helpers';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardActionArea, CardContent, CardMedia, Grid, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { LaraigoLogo } from 'icons';
import TableZyx from 'components/fields/table-simple';
import { Intentions } from './assistant/Intentions';
import { Entities } from './assistant/Entities';

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
    translationservice?: string
}

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailIaServiceProps {
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
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
    },
    container: {
        width: '100%',
        color: "#2e2c34",
    },
    containerHeader: {
        display: 'block',
        marginBottom: 0,
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    containerDetails: {
        marginTop: theme.spacing(3)
    },    
    media: {
        objectFit: "contain"
    },
    containerInner:{
        display:"flex",
        padding:15
    },
    containerInnertittle1:{
        width: "100%",
        textTransform: "uppercase",
        fontSize: "1.1em",
        padding: "7px 0",
    },
    containerInnertittle2:{
        width: "100%",
        fontSize: "1.5em",
        fontWeight: "bold",
        padding: "7px 0",
    },
    containerInnertittle3:{
        width: "100%",
        fontSize: "1.2em",
        padding: "7px 0",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
}));

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface DetailIAConnectorsProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
    multiData: MultiData[];
    arrayBread: any;
}

const DetailIAConfiguration: React.FC<DetailIAConnectorsProps> = ({ data: { row, edit }, setViewSelected, fetchData,multiData, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [billbyorg, setbillbyorg] = useState(row?.billbyorg || false);
    const [doctype, setdoctype] = useState(row?.doctype || ((row?.sunatcountry) === "PE" ? "1" : "0"))
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            corporation: row?.corporation || '',
            organization: row?.organization || '',
            status: row?.status || '',
            description: row?.description || '',
            provider: row?.provider || '',
            type: row?.type || '',
        }
    });

    React.useEffect(() => {
        register('corporation', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('organization', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('provider', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
    }, [executeRes, waitSave])
    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            setWaitSave(true)
            //dispatch(execute(insCorp(data)));
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
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.iaconfiguration)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={`${t(langKeys.iaconfiguration)} ${t(langKeys.detail)}`}
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
                            label={t(langKeys.corporation)}
                            className="col-6"
                            valueDefault={getValues('corporation')}
                            onChange={(value) => setValue('corporation', value)}
                            error={errors?.corporation?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.organization)}
                            className="col-6"
                            valueDefault={getValues('organization')}
                            onChange={(value) => setValue('organization', value)}
                            error={errors?.organization?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={""}
                            className="col-12"
                            valueDefault={getValues('type')}
                            onChange={(value) => setValue('type', value?.domainvalue)}
                            error={errors?.type?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={getValues('status')}
                            onChange={(value) => setValue('status', value?.domainvalue)}
                            error={errors?.type?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
const DetailIAConnectors: React.FC<DetailIAConnectorsProps> = ({ data: { row, edit }, setViewSelected, fetchData,multiData, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [billbyorg, setbillbyorg] = useState(row?.billbyorg || false);
    const [doctype, setdoctype] = useState(row?.doctype || ((row?.sunatcountry) === "PE" ? "1" : "0"))
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const user = useSelector(state => state.login.validateToken.user);
    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];

    const { register, handleSubmit, setValue, trigger, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            endpoint: row?.endpoint || '',
            modelid: row?.modelid || '',
            apikey: row?.apikey || '',
            description: row?.description || '',
            provider: row?.provider || '',
            type: row?.type || '',
        }
    });

    React.useEffect(() => {
        register('endpoint', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('modelid', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('apikey', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('provider', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
    }, [executeRes, waitSave])
    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            setWaitSave(true)
            //dispatch(execute(insCorp(data)));
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
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.iaconnectors)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={`${t(langKeys.iaconnectors)} ${t(langKeys.detail)}`}
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
                            label={t(langKeys.endpoint)}
                            className="col-6"
                            valueDefault={getValues('endpoint')}
                            onChange={(value) => setValue('endpoint', value)}
                            error={errors?.endpoint?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.modelid)}
                            className="col-6"
                            valueDefault={getValues('modelid')}
                            onChange={(value) => setValue('modelid', value)}
                            error={errors?.modelid?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.apikey)}
                            className="col-6"
                            valueDefault={getValues('apikey')}
                            onChange={(value) => setValue('apikey', value)}
                            error={errors?.apikey?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.provider)}
                            className="col-6"
                            valueDefault={getValues('provider')}
                            onChange={(value) => setValue('provider', value)}
                            error={errors?.provider?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={getValues('type')}
                            onChange={(value) => setValue('type', value?.domainvalue)}
                            error={errors?.type?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}


const IAConnectors: React.FC<DetailIaServiceProps> = ({ setViewSelected,multiData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedConnectors, setViewSelectedConnectors] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);

    const arrayBread = [
        { id: "view-0", name:  t(langKeys.laraigoia) },
        { id: "view-1", name: t(langKeys.iaconnectors) }
    ];
    const [mainData, setMainData] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change==="view-0"){
            setViewSelected("view-1");
        }else{
            setViewSelectedConnectors(change);
        }
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'corpid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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
                Header: "Endpoint",
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.modelid),
                accessor: 'typedesc',
                NoFilter: true,
            },
            {
                Header: t(langKeys.apikey),
                accessor: 'paymentplandesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.provider),
                accessor: 'statusdesc',
                NoFilter: true,
            },
            {
                Header: t(langKeys.description),
                accessor: 'statusdesc2',
                NoFilter: true,
            },
            {
                Header: t(langKeys.type),
                accessor: 'statusdesc3',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc4',
                NoFilter: true,
            },
        ],
        []
    );

    //const fetchData = () => dispatch(getCollection(getCorpSel(0)));
    const fetchData = () => {debugger};

    useEffect(() => {
        //fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                //fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setMainData(mainResult.mainData.data.map(x => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.mainData.data])

    const handleRegister = () => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            //dispatch(execute(insCorp({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.corpid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelectedConnectors === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={functionChange}
                    />
                </div>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.iaconnectors)}
                    onClickRow={handleEdit}
                    data={mainData}
                    ButtonsElement={() => (
                        <Button
                            disabled={mainResult.mainData.loading}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    download={false}
                    loading={mainResult.mainData.loading}
                    register={['SUPERADMIN'].includes(user?.roledesc || "")}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else if (viewSelectedConnectors === "view-2") {
        return (
            <DetailIAConnectors
                data={rowSelected}
                setViewSelected={functionChange}
                fetchData={fetchData}
                multiData={multiData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

const IAConfiguration: React.FC<DetailIaServiceProps> = ({ setViewSelected,multiData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedConnectors, setViewSelectedConnectors] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);

    const arrayBread = [
        { id: "view-0", name:  t(langKeys.laraigoia) },
        { id: "view-1", name: t(langKeys.iaconfiguration) }
    ];
    const [mainData, setMainData] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change==="view-0"){
            setViewSelected("view-1");
        }else{
            setViewSelectedConnectors(change);
        }
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'corpid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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
                Header: "Endpoint",
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'typedesc',
                NoFilter: true,
            },
            {
                Header: t(langKeys.channeltype),
                accessor: 'paymentplandesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.channeldesc),
                accessor: 'statusdesc',
                NoFilter: true,
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc4',
                NoFilter: true,
            },
        ],
        []
    );

    //const fetchData = () => dispatch(getCollection(getCorpSel(0)));
    const fetchData = () => {debugger};

    useEffect(() => {
        //fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                //fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setMainData(mainResult.mainData.data.map(x => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.mainData.data])

    const handleRegister = () => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelectedConnectors("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            //dispatch(execute(insCorp({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.corpid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    if (viewSelectedConnectors === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={functionChange}
                    />
                </div>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.iaconfiguration)}
                    onClickRow={handleEdit}
                    data={mainData}
                    ButtonsElement={() => (
                        <Button
                            disabled={mainResult.mainData.loading}
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    )}
                    download={false}
                    loading={mainResult.mainData.loading}
                    register={['SUPERADMIN'].includes(user?.roledesc || "")}
                    handleRegister={handleRegister}
                />
            </div>
        )
    }
    else if (viewSelectedConnectors === "view-2") {
        return (
            <DetailIAConfiguration
                data={rowSelected}
                setViewSelected={functionChange}
                fetchData={fetchData}
                multiData={multiData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

const IATraining: React.FC<DetailIaServiceProps> = ({ setViewSelected,multiData }) => {
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const [viewSelectedTraining, setViewSelectedTraining] = useState("view-1");
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();

    const arrayBread = [
        { id: "view-0", name:  t(langKeys.laraigoia) },
        { id: "view-1", name: t(langKeys.training) }
    ];
    const [mainData, setMainData] = useState<any>([]);
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    
    const functionChange = (change:string) => {
        if(change==="view-0"){
            setViewSelected("view-1");
        }else{
            setViewSelectedTraining(change);
        }
    }

    //const fetchData = () => dispatch(getCollection(getCorpSel(0)));
    const fetchData = () => {debugger};

    useEffect(() => {
        //fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                //fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        setMainData(mainResult.mainData.data.map(x => ({
            ...x,
            typedesc: (t(`type_corp_${x.type}`.toLowerCase()) || "").toUpperCase(),
            statusdesc: (t(`status_${x.status}`.toLowerCase()) || "").toUpperCase()
        })))
    }, [mainResult.mainData.data])


    if (viewSelectedTraining === "view-1") {
        return (
            <div style={{ width: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={functionChange}
                    />
                </div>
                <div className={classes.container}>
                    <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                        <span className={classes.title}>
                            {t(langKeys.training)}
                        </span>
                    </Box>
                    <div className={classes.containerDetails}>
                        <Grid container spacing={3} >
                            
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.intentions)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.intentionsdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                onClick={()=>setViewSelectedTraining("intentions")}
                                                style={{ backgroundColor: "#55BD84" }}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <LaraigoLogo style={{ height: 50, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                                <Card style={{ position: 'relative', display:"flex" }}>
                                    <div className={classes.containerInner}>

                                        <div className="col-6" style={{width: "50%"}}>
                                            <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                            <div className={classes.containerInnertittle2}>{t(langKeys.entities)}</div>
                                            <div className={classes.containerInnertittle3}>{t(langKeys.entitiesdescription)}</div>                                            
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                color="primary"
                                                style={{ backgroundColor: "#55BD84" }}
                                                onClick={()=>setViewSelectedTraining("entities")}
                                            >{t(langKeys.enter)}
                                            </Button>
                                        </div>
                                        
                                        <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                            <LaraigoLogo style={{ height: 50, width:"100%" }} />
                                        </div>
                                    </div>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }else if (viewSelectedTraining === "intentions") {
        return <Intentions 
        />
    }else if (viewSelectedTraining === "entities") {
        return (
            <Entities 
            setExternalViewSelected={functionChange}
            arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

const Iaservices: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const classes = useStyles();

    const [viewSelected, setViewSelected] = useState("view-1");

    useEffect(() => {
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    if (viewSelected === "view-1") {

        return (
            <div className={classes.container}>
                <Box className={classes.containerHeader} justifyContent="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                    <span className={classes.title}>
                        {t(langKeys.laraigoia)}
                    </span>
                </Box>
                <div className={classes.containerDetails}>
                    <Grid container spacing={3} >
                        
                        <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                            <Card style={{ position: 'relative', display:"flex" }}>
                                <div className={classes.containerInner}>

                                    <div className="col-6" style={{width: "50%"}}>
                                        <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                        <div className={classes.containerInnertittle2}>{t(langKeys.iaconnectors)}</div>
                                        <div className={classes.containerInnertittle3}>{t(langKeys.iaconnectorsdescription)}</div>                                            
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            onClick={()=>setViewSelected("connectors")}
                                            style={{ backgroundColor: "#55BD84" }}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <LaraigoLogo style={{ height: 50, width:"100%" }} />
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                            <Card style={{ position: 'relative', display:"flex" }}>
                                <div className={classes.containerInner}>

                                    <div className="col-6" style={{width: "50%"}}>
                                        <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                        <div className={classes.containerInnertittle2}>{t(langKeys.iaconfiguration)}</div>
                                        <div className={classes.containerInnertittle3}>{t(langKeys.iaconfigurationdescription)}</div>                                            
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            onClick={()=>setViewSelected("configuration")}
                                            style={{ backgroundColor: "#55BD84" }}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <LaraigoLogo style={{ height: 50, width:"100%" }} />
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4} style={{ minWidth: 330 }}>
                            <Card style={{ position: 'relative', display:"flex" }}>
                                <div className={classes.containerInner}>

                                    <div className="col-6" style={{width: "50%"}}>
                                        <div className={classes.containerInnertittle1}>{t(langKeys.ia)}</div>
                                        <div className={classes.containerInnertittle2}>{t(langKeys.trainingwithai)}</div>
                                        <div className={classes.containerInnertittle3}>{t(langKeys.trainingwithaidescription)}</div>                                            
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            style={{ backgroundColor: "#55BD84" }}
                                            onClick={()=>setViewSelected("training")}
                                        >{t(langKeys.enter)}
                                        </Button>
                                    </div>
                                    
                                    <div className='col-6' style={{ display: 'flex', justifyContent: 'center', width: "50%" }}>
                                        <LaraigoLogo style={{ height: 50, width:"100%" }} />
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }else if (viewSelected === "connectors") {
        return (
            <IAConnectors
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        )
    }else if (viewSelected === "configuration") {
        return (
            <IAConfiguration
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        )
    }else if (viewSelected === "training") {
        return (
            <IATraining
                multiData={mainResult.multiData.data}
                setViewSelected={setViewSelected}
            />
        )
    } else
        return null;

}

export default Iaservices;