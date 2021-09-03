/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti } from 'components';
import { getMessageTemplateSel, insMessageTemplate, getValuesFromDomain } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Message Templates" },
    { id: "view-2", name: "Message Templates detail" }
];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    mediabutton: {
        margin: theme.spacing(1),
        flexBasis: 0,
        flexGrow: 1,
        padding: 0,
        minHeight: '30px',
        opacity: 0.8,
        '&:hover': {
            opacity: 1
        }
    },
    headerType: {
        flexGrow: 0,
        flexBasis: '130px',
        marginRight: '10px',
    },
    headerText: {
        flexGrow: 1,
        flexBasis: '200px',
    },
    btnButton: {
        minWidth: 'max-content',
        minHeight: '30px',
        flexBasis: 0,
        flexGrow: 0,
    },
    buttonTitle: {
        width: 'auto',
        marginRight: '0.25rem',
    },
    mb1: {
        marginBottom: '0.25rem',
    }
}));

const dataMessageType = [
    { value: "SMS", text: "SMS" }, // Setear en diccionario los text
    { value: "HSM", text: "HSM" }, // Setear en diccionario los text
];

const dataTemplateType = [
    { value: "STANDARD", text: "Standard (text only)" }, // Setear en diccionario los text
    { value: "MULTIMEDIA", text: "Media & Interactive" }, // Setear en diccionario los text
];

const dataHeaderType = [
    { value: 'text', text: 'Text' }, // Setear en diccionario los text
    { value: 'image', text: 'Image' }, // Setear en diccionario los text
    { value: 'document', text: 'Document' }, // Setear en diccionario los text
    { value: 'video', text: 'Video' } // Setear en diccionario los text
];

const dataButtonType = [
    { value: "url", text: "url" }, // Setear en diccionario los text
    { value: "quick_reply", text: "quickreply" }, // Setear en diccionario los text
];

const MessageTemplates: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.creationdate),
                accessor: 'createdate',
                NoFilter: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return new Date(new Date(row.createdate).getTime() - (new Date().getTimezoneOffset() / 60)).toLocaleDateString()
                }
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: t(langKeys.name),
                accessor: 'name',
                NoFilter: true
            },
            {
                Header: t(langKeys.namespace),
                accessor: 'namespace',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: t(langKeys.action),
                accessor: 'id',
                NoFilter: true,
                isComponent: true,
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
            }
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getMessageTemplateSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("MESSAGETEMPLATECATEGORY"),
            getValuesFromDomain("LANGUAGE")
        ]));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

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
        const callback = () => {
            dispatch(execute(insMessageTemplate({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.id })));
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

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.messagetemplate_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            />
        )
    }
    else
        return (
            <DetailMessageTemplates
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

const DetailMessageTemplates: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataCategory = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataLanguage = multiData[1] && multiData[1].success ? multiData[1].data : [];
    
    const { register, handleSubmit, setValue, getValues, unregister, trigger, formState: { errors } } = useForm({
        defaultValues: {
            id: row ? row.id : 0,
            description: row ? (row.description || '') : '',
            type: row ? row.type : 'SMS',
            status: row ? row.status : 'ACTIVO',
            name: row ? row.name : '',
            namespace: row ? row.namespace : '',
            category: row ? row.category : '',
            language: row ? row.language : '',
            templatetype: row ? row.templatetype : 'STANDARD',
            headerenabled: row ? row.headerenabled : true,
            headertype: row ? row.headertype : 'text',
            header: row ? row.header : '',
            body: row ? row.body : '',
            footerenabled: row ? row.footerenabled : true,
            footer: row ? row.footer : '',
            buttonsenabled: row ? row.buttonsenabled : true,
            buttons: row ? JSON.parse(row.buttons) : [],
            operation: row ? "EDIT" : "INSERT"
        }
    });

    const [templateTypeDisabled, setTemplateTypeDisabled] = useState(getValues('templatetype') === 'STANDARD');
    
    React.useEffect(() => {
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('namespace', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('category', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('templatetype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('body', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.messagetemplate).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insMessageTemplate(data)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onChangeMessageType = (data: Dictionary) => {
        setValue('type', data?.value || '');
        switch (data?.value || 'SMS') {
            case 'SMS':
                onChangeTemplateType({ value: 'STANDARD' });
                setTemplateTypeDisabled(true);
                break;
            case 'HSM':
                setTemplateTypeDisabled(false);    
                break;
        }
    }

    const onChangeTemplateType = async (data: Dictionary) => {
        setValue('templatetype', data?.value || '');
        await trigger('templatetype');
    }

    const onClickHeaderToogle = async ({ value } : { value? : Boolean | null} = {}) => {
        if (value)
            setValue('headerenabled', value)
        else
            setValue('headerenabled', !getValues('headerenabled'));
        await trigger('headerenabled');
    }

    const onClickFooterToogle = async ({ value } : { value? : Boolean | null} = {}) => {
        if (value)
            setValue('footerenabled', value)
        else
            setValue('footerenabled', !getValues('footerenabled'));
        await trigger('footerenabled');
    }

    const onClickButtonsToogle = async ({ value } : { value? : Boolean | null} = {}) => {
        if (value)
            setValue('buttonsenabled', value)
        else
            setValue('buttonsenabled', !getValues('buttonsenabled'));
        await trigger('buttonsenabled');
    }

    const onChangeHeaderType = async (data: Dictionary) => {
        setValue('headertype', data?.value || '');
        await trigger('headertype');
    }

    const onChangeButton = (index: number, param: string, value: string) => {
        setValue(`buttons.${index}.${param}`, value);
    }

    const onClickAddButton = async () => {
        if (getValues('buttons') && getValues('buttons').length < 3)
            setValue('buttons', [...getValues('buttons'), { title: '', type: '', payload: '' }])
        await trigger('buttons');
    }

    const onClickRemoveButton = async () => {
        let btns = getValues('buttons');
        if (btns && btns.length > 0)
        {
            unregister(`buttons.${btns.length - 1}`);
            setValue('buttons', btns.filter((x: any, i: number) => i !== btns.length - 1));
        }
        await trigger('buttons');
    }

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.name}` : t(langKeys.newmessagetemplate)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.messagetype)}
                                className="col-12"
                                valueDefault={row?.type || "SMS"}
                                onChange={onChangeMessageType}
                                error={errors?.type?.message}
                                data={dataMessageType}
                                optionDesc="text"
                                optionValue="value"
                            />
                            :
                            <FieldView
                                label={t(langKeys.messagetype)}
                                value={row ? (row.type || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                                <FieldEdit
                                    label={t(langKeys.name)}
                                    className="col-6"
                                    valueDefault={row?.name || ""}
                                    onChange={(value) => setValue('name', value)}
                                    error={errors?.name?.message}
                                />
                                <FieldEdit
                                    label={t(langKeys.namespace)}
                                    className="col-6"
                                    valueDefault={row?.namespace || ""}
                                    onChange={(value) => setValue('namespace', value)}
                                    error={errors?.namespace?.message}
                                />
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <FieldView
                                    label={t(langKeys.name)}
                                    value={row ? (row.name || "") : ""}
                                    className="col-6"
                                />
                                <FieldView
                                    label={t(langKeys.namespace)}
                                    value={row ? (row.namespace || "") : ""}
                                    className="col-6"
                                />
                            </React.Fragment>
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                                <FieldSelect
                                    label={t(langKeys.category)}
                                    className="col-6"
                                    valueDefault={row?.category || ""}
                                    onChange={(value) => setValue('category', value?.domainvalue)}
                                    error={errors?.category?.message}
                                    data={dataCategory}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <FieldSelect
                                    label={t(langKeys.language)}
                                    className="col-6"
                                    valueDefault={row ? (row.language || "") : ""}
                                    onChange={(value) => setValue('language', value?.domainvalue)}
                                    error={errors?.language?.message}
                                    data={dataLanguage}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <FieldView
                                    label={t(langKeys.category)}
                                    value={row ? (row.category || "") : ""}
                                    className="col-6"
                                />
                                <FieldView
                                    label={t(langKeys.language)}
                                    value={row ? (row.language || "") : ""}
                                    className="col-6"
                                />
                            </React.Fragment>
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.templatetype)}
                                className="col-12"
                                valueDefault={getValues('templatetype')}
                                onChange={onChangeTemplateType}
                                error={errors?.templatetype?.message}
                                data={dataTemplateType}
                                optionDesc="text"
                                optionValue="value"
                                disabled={templateTypeDisabled}
                            />
                            :
                            <FieldView
                                label={t(langKeys.templatetype)}
                                value={row ? (row.templatetype || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    {getValues('templatetype') === 'MULTIMEDIA' ?
                    <div className="row-zyx">
                        {edit ? 
                            <React.Fragment>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className={classes.mediabutton}
                                    style={{ backgroundColor: getValues('headerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    onClick={() => onClickHeaderToogle()}
                                >{t(langKeys.header)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className={classes.mediabutton}
                                    style={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                >{t(langKeys.body)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className={classes.mediabutton}
                                    style={{ backgroundColor: getValues('footerenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    onClick={() => onClickFooterToogle()}
                                >{t(langKeys.footer)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    className={classes.mediabutton}
                                    style={{ backgroundColor: getValues('buttonsenabled') ? "#000000" : "#AAAAAA", color: "#FFFFFF" }}
                                    startIcon={<CheckIcon htmlColor="#FFFFFF" />}
                                    onClick={() => onClickButtonsToogle()}
                                >{t(langKeys.buttons)}</Button>
                            </React.Fragment>
                        : null }
                    </div>
                    : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                    && getValues('headerenabled')) ?
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                                <FieldSelect
                                    label={t(langKeys.headertype)}
                                    className={classes.headerType}
                                    valueDefault={getValues('headertype')}
                                    onChange={onChangeHeaderType}
                                    error={errors?.header?.message}
                                    data={dataHeaderType}
                                    optionDesc="text"
                                    optionValue="value"
                                />
                                <FieldEdit
                                    label={t(langKeys.header)}
                                    className={classes.headerText}
                                    valueDefault={row ? (row.header || "") : ""}
                                    onChange={(value) => setValue('header', value)}
                                    error={errors?.header?.message}
                                />
                            </React.Fragment>
                            :
                            <FieldView
                                label={t(langKeys.header)}
                                value={row ? (row.header || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    : null}
                    <div className="row-zyx">
                        {edit ?
                            <FieldEditMulti
                                label={t(langKeys.body)}
                                className="col-12"
                                valueDefault={row ? (row.body || "") : ""}
                                onChange={(value) => setValue('body', value)}
                                error={errors?.body?.message}
                                maxLength={1024}
                            />
                            : <FieldView
                                label={t(langKeys.body)}
                                value={row ? (row.body || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    {(getValues('templatetype') === 'MULTIMEDIA'
                    && getValues('footerenabled')) ?
                    <div className="row-zyx">
                        {edit ?
                            <FieldEditMulti
                                label={t(langKeys.footer)}
                                className="col-12"
                                valueDefault={row ? (row.footer || "") : ""}
                                onChange={(value) => setValue('footer', value)}
                                error={errors?.footer?.message}
                                rows={2}
                                maxLength={60}
                            />
                            :
                            <FieldView
                                label={t(langKeys.footer)}
                                value={row ? (row.footer || "") : ""}
                                className="col-12"
                            />
                        }
                    </div>
                    : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                    && getValues('buttonsenabled')) ?
                    <div className="row-zyx" style={{ alignItems: 'flex-end' }}>
                        <FieldView
                            label={t(langKeys.buttons)}
                            className={classes.buttonTitle}
                        />
                        {
                            edit && getValues('buttons')?.length < 3 &&
                            <Button
                                variant="outlined"
                                type="button"
                                color="primary"
                                className={classes.btnButton}
                                startIcon={<AddIcon color="primary" />}
                                onClick={() => onClickAddButton()}
                            >{t(langKeys.addbutton)}</Button>
                        }
                        {
                            edit && getValues('buttons')?.length > 0 &&
                            <Button
                                variant="outlined"
                                type="button"
                                color="primary"
                                className={classes.btnButton}
                                startIcon={<RemoveIcon color="primary" />}
                                onClick={() => onClickRemoveButton()}
                            >{t(langKeys.removebutton)}</Button>
                        }
                    </div>
                    : null}
                    {(getValues('templatetype') === 'MULTIMEDIA'
                    && getValues('buttonsenabled')) ?
                    <div className="row-zyx">
                        {edit ?
                            <React.Fragment>
                            {getValues('buttons')?.map((btn: any, i: number) => {
                                return (
                                    <div key={`btn-${i}`} className="col-4">
                                        <FieldEdit
                                            fregister={{...register(`buttons.${i}.title`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })}}
                                            label={t(langKeys.title)}
                                            className={classes.mb1}
                                            valueDefault={btn?.title || ""}
                                            onChange={(value) => onChangeButton(i, 'title', value)}
                                            error={errors?.buttons?.[i]?.title?.message}
                                        />
                                        <FieldSelect
                                            fregister={{...register(`buttons.${i}.type`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })}}
                                            label={t(langKeys.type)}
                                            className={classes.mb1}
                                            valueDefault={btn?.type || ""}
                                            onChange={(value) => onChangeButton(i, 'type', value?.value)}
                                            error={errors?.buttons?.[i]?.type?.message}
                                            data={dataButtonType}
                                            optionDesc="text"
                                            optionValue="value"
                                        />
                                        <FieldEdit
                                            fregister={{...register(`buttons.${i}.payload`, {
                                                validate: (value) => (value && value.length) || t(langKeys.field_required)
                                            })}}
                                            label={t(langKeys.payload)}
                                            className={classes.mb1}
                                            valueDefault={btn?.payload || ""}
                                            onChange={(value) => onChangeButton(i, 'payload', value)}
                                            error={errors?.buttons?.[i]?.payload?.message}
                                        />
                                    </div>
                                )
                            })}
                            </React.Fragment>
                            :
                            getValues('buttons')?.map((btn: any, i: number) => {
                                return (
                                    <div key={`btn${i}`} className="col-4">
                                        <FieldView
                                            label={t(langKeys.title)}
                                            value={btn?.title || ""}
                                            className="col-12"
                                        />
                                        <FieldView
                                            label={t(langKeys.type)}
                                            value={btn?.type || ""}
                                            className="col-12"
                                        />
                                        <FieldView
                                            label={t(langKeys.payload)}
                                            value={btn?.payload || ""}
                                            className="col-12"
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                    : null}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            </form>
        </div>
    );
}



export default MessageTemplates;