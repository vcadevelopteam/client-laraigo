import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldEdit, FieldSelect, FieldMultiSelect } from 'components';
import { insInteligentModelConfiguration } from 'common/helpers';
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

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface MultiData {
    data: Dictionary[];
    success: boolean;
}

interface IAConfigurationDetailProps {
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
    warningContainer: {
        backgroundColor: '#FFD9D9',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 5
    },
}));

const IAConfigurationDetail: React.FC<IAConfigurationDetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataModels = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataChannels = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataStatus = multiData[3] && multiData[3].success ? multiData[3].data : [];

    const { control, register, handleSubmit, setValue, getValues, formState: { errors }, watch } = useForm<any>({
        defaultValues: {
            id: row?.intelligentmodelsconfigurationid || 0,
            description: row?.description || '',
            type: 'NINGUNO',
            color: '#FFFFFF',
            icontype: "fab fa-reddit-alien",
            channels: row?.communicationchannelid || '',
            channelsdesc: row?.channeldesc || '',
            operation: row ? "EDIT" : "INSERT",
            intelligentmodelsid: row?.intelligentmodelsid || "",
            connectortype: row?.connectortype || "",
            firstinteraccion: row?.firstinteraccion || "",
            originanalysis: row?.originanalysis || "",
            model: row?.model || "",
            translation: row?.translation || "",
            language: row?.language || "",
            context: row?.context || "",
            precision: row?.precision || "0",
            status: row?.status || "ACTIVO",
        }
    });

    const watchConnectorType = watch("connectortype")

    React.useEffect(() => {
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('channels', { validate: (value) => ((value && value.length) || watchConnectorType === "Gen AI") || t(langKeys.field_required) });
        register('intelligentmodelsid', { validate: (value) => (value && value >= 0) || t(langKeys.field_required) });
        register('channelsdesc', { validate: (value) => ((value && value.length) || watchConnectorType === "Gen AI") || t(langKeys.field_required) });
        register('originanalysis', { validate: (value) => ((value && value.length) || watchConnectorType !== "Assistant") || t(langKeys.field_required) });
        register('channels', { validate: (value) => ((value && value.length) || watchConnectorType === "Gen AI") || t(langKeys.field_required) });
        register('firstinteraccion', { validate: (value) => ((value && value.length) || watchConnectorType !== "Assistant") || t(langKeys.field_required) });
        register('context', { validate: (value) => ((value && value.length) || watchConnectorType !== "Gen AI") || t(langKeys.field_required) });
        register('model', { validate: (value) => ((value && value.length) || watchConnectorType !== "Conversor de voz") || t(langKeys.field_required) });
        register('translation', { validate: (value) => ((value && value.length) || watchConnectorType !== "Conversor de voz") || t(langKeys.field_required) });
        register('language', { validate: (value) => ((value && value.length) || watchConnectorType !== "Conversor de voz") || t(langKeys.field_required) });
        register('precision', { validate: (value) => ((value >= 0 && value <= 1) || watchConnectorType !== "Assistant") || t(langKeys.error_between_range, { min: 0, max: 1 }) });
    }, [register, watchConnectorType]);

    React.useEffect(() => {
        console.log(errors)

    }, [errors, control]);


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
                            title={row?.description||t(langKeys.newiaservice)}
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
                            valueDefault={getValues("intelligentmodelsid")}
                            onChange={(value) => { setValue('intelligentmodelsid', value?.id || ''); setValue("connectortype", value?.type || "") }}
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
                {watchConnectorType !== "" && <div className={classes.containerDetail}>
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
                    {watchConnectorType !== "Gen AI" && <div className="row-zyx">
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
                    {watchConnectorType === "Gen AI" && <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.contextAI)}
                            helperText2={t(langKeys.contextAIHelper)}
                            className="col-6"
                            valueDefault={getValues("context")}
                            onChange={(value) => setValue('context', value?.domainvalue || "")}
                            error={errors?.context?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                            variant="outlined"
                        />
                    </div>}
                    {watchConnectorType === "Assistant" && <>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.firstinteractionIA)}
                                helperText2={t(langKeys.firstinteractionIAhelper)}
                                className="col-6"
                                valueDefault={getValues("firstinteraccion")}
                                onChange={(value) => setValue('firstinteraccion', value?.domainvalue || "")}
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
                                    { desc: "Mensajes del cliente" },
                                    { desc: "Mensajes del bot" },
                                    { desc: "Mensajes del asesor" },
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
                    {watchConnectorType === "Conversor de voz" && <>
                        <div className="row-zyx">
                            <FieldSelect
                                label={t(langKeys.languagemodel)}
                                helperText2={t(langKeys.languagemodelhelper)}
                                className="col-6"
                                valueDefault={getValues("model")}
                                onChange={(value) => setValue('model', value?.domainvalue || "")}
                                error={errors?.model?.message}
                                data={[
                                    { desc: "Small" },
                                    { desc: "Medium" },
                                    { desc: "Large" },
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
                                onChange={(value) => setValue('translation', value?.domainvalue || "")}
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
                                onChange={(value) => setValue('language', value?.domainvalue || "")}
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

export default IAConfigurationDetail;