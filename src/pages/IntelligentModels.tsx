import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect } from 'components';
import { convertLocalDate, dateToLocalDate, getIntelligentModelsSel, getValuesFromDomain, insIntelligentModels } from 'common/helpers';
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
}));

const DetailIntelligentModels: React.FC<DetailIntelligentModelsProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread2 }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const dataDomainStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const [service, setService] = useState( row ? row.type.trim() : '')

    const { getValues, register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: row ? (row.type || '') : '',
            id: row ? row.id : 0,
            endpoint: row ? (row.endpoint || '') : '',
            modelid: row ? (row.modelid || '') : '',
            apikey: row ? (row.apikey || '') : '',
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
        register('endpoint', { 
            validate: (value) =>
                getValues('type') !== 'LARGE LANGUAGE MODEL'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
        register('apikey', {
            validate: (value) =>
                getValues('type') !== 'RASA'    
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('modelid');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('provider', {
            validate: (value) =>
                getValues('type') !== 'RASA' && getValues('type') !== 'WATSON ASSISTANT'
                    ? (value && value.length) || String(t(langKeys.field_required))
                    : true,
        });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

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
        const callback = () => {
            dispatch(execute(insIntelligentModels(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const providers = [
        {
            domaindesc: 'Open AI',
            domainvalue: 'Open AI',
        },
        {
            domaindesc: 'Meta',
            domainvalue: 'Meta',
        },
        {
            domaindesc: 'Mistral',
            domainvalue: 'Mistral',
        },
        {
            domaindesc: 'LaraigoLLM',
            domainvalue: 'LaraigoLLM',
        },
    ]

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={!!arrayBread2?[...arrayBread2,
                                { id: "view-1", name: t(langKeys.iaconnectors) },
                                { id: "view-2", name: `${t(langKeys.iaconnectors)} ${t(langKeys.detail)}` }
                            ]:arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.name}` : t(langKeys.newintelligentmodel)}
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
                    <div className='row-zyx'>
                        <FieldSelect
                            className='col-6'
                            disabled={edit}
                            label={t(langKeys.type_service)}
                            valueDefault={service}
                            onChange={(value) => {
                                if(value) {
                                    setService(value.domainvalue)
                                    setValue('type', value.domainvalue)
                                } else {
                                    setService('')
                                    setValue('type', '')
                                }
                            }}
                            data={dataDomainStatus || []}
                            optionDesc='domaindesc'
                            optionValue='domainvalue'
                        />
                    </div>
                    {service === 'WATSON ASSISTANT' ? (
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
                    )}
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
                    { key: "Open AI", value: "Open AI" },
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
            getValuesFromDomain("TIPOMODELO"),
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
            
            <div style={{ width: "100%" }}>
                {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.iaconnectors) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <TableZyx
                    ButtonsElement={() => {
                        if (!setExternalViewSelected) {
                            return (
                                <>
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
                    titlemodule={!!window.location.href.includes("iaconectors")?t(langKeys.connectors):t(langKeys.intelligentmodels, { count: 2 })}
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