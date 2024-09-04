import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch } from 'components';
import { convertLocalDate, getChannelsByOrg, getIntelligentModelsConfigurations, getIntelligentModelsSel, getValuesFromDomain, iaservicesBulkDel, insInteligentModelConfiguration } from 'common/helpers';
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
import { IconButton } from '@material-ui/core';
import { CellProps } from 'react-table';
import { KeyboardArrowLeft, KeyboardArrowRight, Delete } from '@material-ui/icons';
import WarningIcon from '@material-ui/icons/Warning';


const languageList = [
    {
        domainvalue: 'Alemán',
        domaindesc: 'Alemán'
    },
    {
        domainvalue: 'Árabe',
        domaindesc: 'Árabe'
    },
    {
        domainvalue: 'Bengalí',
        domaindesc: 'Bengalí'
    },
    {
        domainvalue: 'Chino',
        domaindesc: 'Chino'
    },
    {
        domainvalue: 'Español',
        domaindesc: 'Español'
    },
    {
        domainvalue: 'Francés',
        domaindesc: 'Francés'
    },
    {
        domainvalue: 'Hindi',
        domaindesc: 'Hindi'
    },
    {
        domainvalue: 'Indonesio',
        domaindesc: 'Indonesio'
    },
    {
        domainvalue: 'Inglés',
        domaindesc: 'Inglés'
    },
    {
        domainvalue: 'Italiano',
        domaindesc: 'Italiano'
    },
    {
        domainvalue: 'Japonés',
        domaindesc: 'Japonés'
    },
    {
        domainvalue: 'Portugués',
        domaindesc: 'Portugués'
    },
    {
        domainvalue: 'Ruso',
        domaindesc: 'Ruso'
    },
    {
        domainvalue: 'Turco',
        domaindesc: 'Turco'
    },
    {
        domainvalue: 'Urdu',
        domaindesc: 'Urdu'
    },        
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
    titleandcrumbs: {
        marginBottom: 4,
        marginTop: 4,
    },
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    tag: {
        backgroundColor: '#EBF2F3',
        borderRadius: '8px',
        padding: '2px 8px',
        marginRight: '4px',
        marginBottom: '4px',
        whiteSpace: 'nowrap',
        wordBreak: 'keep-all',
    },
    tagcontainer: {
        display: 'flex',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '300px'
    },
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
    },
    warningContainer: {
        backgroundColor: '#FFD9D9',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5
    },
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

    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors }, watch } = useForm<any>({
        defaultValues: {
            id: row ? row.intelligentmodelsconfigurationid : 0,
            description: row ? (row.description || '') : '',
            type: 'NINGUNO',
            color: '#FFFFFF',
            icontype: "fab fa-reddit-alien",
            channels: row?.communicationchannelid || '',
            channelsdesc: row ? row.channeldesc : '', //for table
            operation: row ? "EDIT" : "INSERT",
            services: (row?.parameters) ? JSON.parse(row?.parameters) : [],
            connector: row?.connector || "",
            connectortype: row?.connectortype || "",
            firstinteraccion: row?.firstinteraccion || "",
            originanalysis: row?.originanalysis || "",
            model: row?.model || "",
            translation: row?.translation || "",
            language: row?.language || "",
        }
    });

    const watchConnectorType = watch("connectortype")

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channels', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('connector', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channelsdesc', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('originanalysis', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channels', { validate: (value) => ((value && value.length)|| watchConnectorType==="Gen AI") || t(langKeys.field_required) });
        register('firstinteraccion', { validate: (value) => ((value && value.length)|| watchConnectorType!=="Assistant") || t(langKeys.field_required) });
        register('context', { validate: (value) => ((value && value.length)|| watchConnectorType!=="Gen AI") || t(langKeys.field_required) });
        register('model', { validate: (value) => ((value && value.length)|| watchConnectorType!=="Conversor de voz") || t(langKeys.field_required) });
        register('translation', { validate: (value) => ((value && value.length)|| watchConnectorType!=="Conversor de voz") || t(langKeys.field_required) });
        register('language', { validate: (value) => ((value && value.length)|| watchConnectorType!=="Conversor de voz") || t(langKeys.field_required) });
        register('precision', { validate: (value) => ((value>=0 && value <=1)|| watchConnectorType!=="Assistant") || t(langKeys.error_between_range, { min: 0, max: 1 }) });
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
                        <FieldSelect
                            className="col-6"
                            label={t(langKeys.conector)}
                            helperText2={t(langKeys.conectoriahelper)}
                            valueDefault={getValues("connector")}
                            onChange={(value) => {setValue('connector', value?.id || ''); setValue("connectortype", value?.type||"")}}
                            data={dataModels}
                            optionDesc="description"
                            optionValue="id"
                            variant="outlined"
                        />
                        {watchConnectorType === "" && <div className="col-4" style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <div className={classes.warningContainer} style={{ width: 220 }}>
                                <WarningIcon style={{ color: '#FF7575' }} />
                                Selecciona una opción
                            </div>
                        </div>
                        }
                    </div>
                </div>
                {watchConnectorType!=="" && <div className={classes.containerDetail}>
                    <div style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 15 }}>{t(langKeys.configuration)}</div>
                    <div className="row-zyx" style={{ marginBottom: 0 }}>
                        <FieldEdit
                            className="col-12"
                            valueDefault={getValues("description")}
                            onChange={(value) => setValue('description', value)}
                            variant='outlined'
                            size="small"
                            error={errors?.description?.message}
                            label={t(langKeys.description)}
                            helperText2={t(langKeys.descriptioniahelper)}
                        />
                    </div>
                    {watchConnectorType !=="Gen AI" &&<div className="row-zyx">
                        <FieldMultiSelect
                            className="col-12"
                            valueDefault={getValues("channels")}
                            onChange={(value) => {
                                setValue('channels', value.map((o: Dictionary) => o.communicationchannelid).join())
                                setValue('channelsdesc', value.map((o: Dictionary) => o.description).join())
                            }}
                            error={errors?.channels?.message}
                            data={dataChannels}
                            optionDesc="description"
                            variant='outlined'
                            size="small"
                            optionValue="communicationchannelid"
                            label={t(langKeys.channel_plural)}
                            helperText2={t(langKeys.channeliahelper)}
                        />
                    </div>}
                    {watchConnectorType==="Gen AI" && <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.contextAI)}
                            helperText2={t(langKeys.contextAIHelper)}
                            className="col-6"
                            valueDefault={getValues("context")}
                            onChange={(value) => setValue('context', value?.domainvalue||"")}
                            error={errors?.context?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            variant="outlined"
                        />
                    </div>}
                    {watchConnectorType==="Assistant" && <>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.firstinteractionIA)}
                                helperText2={t(langKeys.firstinteractionIAhelper)}
                                className="col-6"
                                valueDefault={getValues("firstinteraccion")}
                                onChange={(value) => setValue('firstinteraccion', value?.domainvalue||"")}
                                error={errors?.firstinteraccion?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                variant="outlined"
                            />
                            <FieldMultiSelect
                                className="col-6"
                                valueDefault={getValues("originanalysis")}
                                onChange={(value) => {
                                    setValue('originanalysis', value.map((o: Dictionary) => o.desc).join())
                                }}
                                error={errors?.originanalysis?.message}
                                data={[
                                    {desc: "Mensajes del cliente"},
                                    {desc: "Mensajes del bot"},
                                    {desc: "Mensajes del asesor"},
                                ]}
                                optionDesc="desc"
                                variant='outlined'
                                size="small"
                                optionValue="desc"
                                label={t(langKeys.originanalysis)}
                                helperText2={t(langKeys.originanalysisIAhelper)}
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldEdit
                                className="col-6"
                                valueDefault={getValues("precision")}
                                onChange={(value) => setValue('precision', value)}
                                variant='outlined'
                                size="small"
                                type="number"
                                error={errors?.precision?.message}
                                label={t(langKeys.precision)}
                                helperText2={t(langKeys.precisionIAhelper)}
                                helperText={t(langKeys.precisionIAhelper2)}
                                inputProps={{ step: 0.1 }} 
                            />
                        </div>
                    </>}
                    {watchConnectorType==="Conversor de voz" && <>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.languagemodel)}
                                helperText2={t(langKeys.languagemodelhelper)}
                                className="col-6"
                                valueDefault={getValues("model")}
                                onChange={(value) => setValue('model', value?.domainvalue||"")}
                                error={errors?.model?.message}
                                data={[
                                    {desc: "Small"},
                                    {desc: "Medium"},
                                    {desc: "Large"},
                                ]}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                variant="outlined"
                            />
                        </div>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.translationai)}
                                helperText2={t(langKeys.translationaihelper)}
                                className="col-6"
                                valueDefault={getValues("translation")}
                                onChange={(value) => setValue('translation', value?.domainvalue||"")}
                                error={errors?.translation?.message}
                                data={dataStatus}
                                uset={true}
                                prefixTranslation="status_"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                variant="outlined"
                            />
                            <FieldSelect
                                className="col-6"
                                valueDefault={getValues("language")}
                                onChange={(value) => setValue('language', value?.domainvalue||"")}
                                error={errors?.language?.message}
                                data={languageList}
                                variant='outlined'
                                size="small"
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                                label={t(langKeys.language)}
                                helperText2={t(langKeys.languageaihelper)}
                            />
                        </div>
                    </>}
                </div>}
            </form>
        </div>
    );
}


interface IAConfigurationProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}
const selectionKey = "intelligentmodelsconfigurationid"
const IAConfiguration: React.FC<IAConfigurationProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [selectedRows, setSelectedRows] = useState<any>({});

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);


    const functionChange = (change: string) => {
        if (change === "view-0") {
            setExternalViewSelected && setExternalViewSelected("view-1");
        } else {
            setViewSelected(change);
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.conector),
                accessor: 'channeltype',
                width: 'auto',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: 'auto',
            },
            {
                Header: t(langKeys.channeldesc),
                accessor: 'channeldesc',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const data = row?.original?.channeldesc || '';
                    const items = data.split(';').map((item: Dictionary) => item.trim()).filter(Boolean);

                    const [scrollPosition, setScrollPosition] = useState(0);
                    const tagsWrapperRef = useRef<HTMLDivElement>(null);
                    const [atEnd, setAtEnd] = useState(false);
                    const [isOverflowing, setIsOverflowing] = useState(false);

                    useEffect(() => {
                        if (tagsWrapperRef.current) {
                            const isOverflowingContent = tagsWrapperRef.current.scrollWidth > tagsWrapperRef.current.clientWidth;
                            setIsOverflowing(isOverflowingContent);
                            setAtEnd(scrollPosition + tagsWrapperRef.current.clientWidth >= tagsWrapperRef.current.scrollWidth);
                        }
                    }, [scrollPosition, items]);

                    const handleScroll = (direction: string, event: React.MouseEvent) => {
                        event.stopPropagation();

                        const scrollAmount = 100;
                        const newPosition = direction === 'left'
                            ? scrollPosition - scrollAmount
                            : scrollPosition + scrollAmount;

                        setScrollPosition(newPosition);
                        if (tagsWrapperRef.current) {
                            tagsWrapperRef.current.scrollLeft = newPosition;
                        }

                        const atEndPosition = tagsWrapperRef.current
                            ? newPosition + tagsWrapperRef.current.clientWidth >= tagsWrapperRef.current.scrollWidth
                            : false;

                        setAtEnd(atEndPosition);
                    };

                    if (!data || items.length === 0) {
                        return null;
                    }

                    const shouldShowTags = items.length > 1;

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', width: '300px', overflow: 'hidden' }}>
                            {isOverflowing && shouldShowTags && (
                                <IconButton
                                    size='small'
                                    disabled={!(scrollPosition > 0)}
                                    onClick={(event) => handleScroll('left', event)}
                                    style={{ padding: 0 }}
                                >
                                    <KeyboardArrowLeft fontSize='small' />
                                </IconButton>
                            )}
                            <div
                                ref={tagsWrapperRef}
                                className={classes.tagcontainer}
                            >
                                {items.map((item: Dictionary, index: number) => (
                                    <span
                                        key={index}
                                        className={shouldShowTags && item ? classes.tag : ''}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            {isOverflowing && shouldShowTags && (
                                <IconButton
                                    size='small'
                                    disabled={atEnd}
                                    onClick={(event) => handleScroll('right', event)}
                                    style={{ padding: 0 }}
                                >
                                    <KeyboardArrowRight fontSize='small' />
                                </IconButton>
                            )}
                        </div>
                    );
                },
            },
            {
                Header: t(langKeys.timesheet_registerdate),
                accessor: 'createdate',
                type: 'date',
                sortType: 'datetime',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                width: 'auto',
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

    const handleDelete = () => {

        const callback = () => {
            dispatch(execute(iaservicesBulkDel(Object.keys(selectedRows).join())));
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
                        breadcrumbs={[...arrayBread, { id: "view-1", name: t(langKeys.iaconfiguration) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <TableZyx
                    onClickRow={handleEdit}
                    ButtonsElement={() => {
                        if (!setExternalViewSelected) {
                            return <><Button
                                variant="contained"
                                color="primary"
                                disabled={mainResult.mainData.loading || Object.keys(selectedRows).length === 0}
                                type='button'
                                style={{ backgroundColor: (mainResult.mainData.loading || Object.keys(selectedRows).length === 0) ? "#dbdbdb" : "#FB5F5F" }}
                                startIcon={<Delete style={{ color: 'white' }} />}
                                onClick={() => handleDelete()}
                            >{t(langKeys.delete)}
                            </Button>
                            </>
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
                                >{t(langKeys.back)}</Button>
                            )
                        }
                    }}
                    columns={columns}
                    filterGeneral={false}
                    titlemodule={t(langKeys.iaconfiguration)}
                    data={mainResult.mainData.data}
                    download={false}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
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