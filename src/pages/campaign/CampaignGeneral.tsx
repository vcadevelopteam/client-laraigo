/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx } from 'components';
import { getCampaignSel, dictToArrayKV, filterIf, filterPipe } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollectionAux, resetMainAux } from 'store/main/actions';
// import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { useForm } from 'react-hook-form';
import { Event as EventIcon } from '@material-ui/icons';

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
    { id: "view-1", name: "Campaign" },
    { id: "view-2", name: "Campaign detail" }
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
    flexgrow1: {
        flexGrow: 1
    }
}));

const dataExecutionType: Dictionary = {
    MANUAL: 'manual',
    SCHEDULED: 'scheduled',
};

const dataSource: Dictionary = {
    INTERNAL: 'bdinternal',
    EXTERNAL: 'bdexternal',
};

const dataCampaignType = [
    { key: 'TEXTO', value: 'text'},
    { key: 'HSM', value: 'hsm'}, // rif: 'startsWith', rifvalue: 'WHA' },
    { key: 'SMS', value: 'sms'}, // rif: 'startsWith', rifvalue: 'SMS'},
];

type FormFields = {
    isnew: boolean,
    id: number,
	communicationchannelid: string,
    communicationchanneltype: string,
	usergroup: string,
	type: string,
	status: string,
	title: string,
	description: string,
	subject: string,
	message: string, 
	startdate: string,
	enddate: string,
	repeatable: boolean,
	frecuency: number,
    source: string,
	messagetemplateid: string,
	messagetemplatename: string,
	messagetemplatenamespace: string,
	messagetemplateheader: Dictionary,
	messagetemplatebuttons: Dictionary[],
	executiontype: string,
	batchjson: Dictionary[],
	fields: Dictionary,
    operation: string
}

export const CampaignGeneral: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const auxResult = useSelector(state => state.main.mainAux);
    
    const fetchDetailData = (id: number) => dispatch(getCollectionAux(getCampaignSel(id)));

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataChannel = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataGroup = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataMessageTemplate = multiData[3] && multiData[3].success ? multiData[3].data : [];
    
    const { control, register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            communicationchannelid: '',
            communicationchanneltype: '',
            usergroup: '',
            type: 'TEXTO',
            status: 'ACTIVO',
            title: '',
            description: '',
            subject: '',
            message: '',
            startdate: '',
            enddate: '',
            repeatable: false,
            frecuency: 0,
            source: 'EXTERNAL',
            messagetemplateid: '',
            messagetemplatename: '',
            messagetemplatenamespace: '',
            messagetemplateheader: {},
            messagetemplatebuttons: [],
            executiontype: 'MANUAL',
            batchjson: [],
            fields: {},
            operation: row ? "EDIT" : "INSERT"
        }
    });
    
    useEffect(() => {
        if (row !== null) {
            fetchDetailData(row?.id);
            return () => {
                dispatch(resetMainAux());
            };
        }
    }, []);

    useEffect(() => {
        register('title', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('startdate', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('enddate', { 
            validate: {
                value: (value: any) => (value && value.length) || t(langKeys.field_required),
                afterstart: (value: any) => validateDate(value) || t(langKeys.field_afterstart)
            }
        });
        register('executiontype', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('communicationchannelid', { validate: (value: any) => (value && value > 0) || t(langKeys.field_required) });
        register('status', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('source', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        // register('message', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);
    
    useEffect(() => {
        if (!auxResult.loading && !auxResult.error && row !== null) {
            const detailData: any = auxResult.data;
            setValue('id', detailData.id);
            setValue('communicationchannelid', detailData.communicationchannelid);
            setValue('usergroup', detailData.usergroup);
            setValue('type', detailData.type);
            setValue('status', detailData.status);
            setValue('title', detailData.title);
            setValue('description', detailData.description);
            setValue('subject', detailData.subject);
            setValue('message', detailData.message);
            setValue('startdate', detailData.startdate);
            setValue('enddate', detailData.enddate);
            setValue('repeatable', detailData.repeatable);
            setValue('frecuency', detailData.frecuency);
            setValue('source', 'INTERNAL');
            setValue('messagetemplateid', detailData.messagetemplateid);
            setValue('messagetemplatename', detailData.messagetemplatename);
            setValue('messagetemplatenamespace', detailData.messagetemplatenamespace);
            setValue('messagetemplateheader', detailData.messagetemplateheader);
            setValue('messagetemplatebuttons', detailData.messagetemplatebuttons);
            setValue('executiontype', detailData.executiontype);
            setValue('batchjson', detailData.batchjson);
            setValue('fields', detailData.fields);
        }
    }, [auxResult]);

    const onSubmit = handleSubmit((data) => {
        console.log(data);
        // const callback = () => {
        //     dispatch(execute(insIntegrationManager(data)));
        //     dispatch(showBackdrop(true));
        //     setWaitSave(true)
        // }

        // dispatch(manageConfirmation({
        //     visible: true,
        //     question: t(langKeys.confirmation_save),
        //     callback
        // }))
    });

    const validateDate = (value: string): any => {
        return new Date(value) > new Date(getValues('startdate'))
    }

    const onChangeExecutionType = async (data: Dictionary) => {
        setValue('executiontype', data?.key || '');
        await trigger('executiontype');
    }

    const onChangeChannel = async (data: Dictionary) => {
        setValue('communicationchannelid', data?.communicationchannelid || '');
        setValue('communicationchanneltype', dataChannel.filter(d => d.communicationchannelid === data?.communicationchannelid)[0]?.type);
        setValue('type', 'TEXTO');
        await trigger(['communicationchannelid', 'communicationchanneltype', 'type']);
    }

    const onChangeGroup = (data: Dictionary) => {
        setValue('usergroup', data?.domainvalue || '');
    }

    const onChangeStatus = (data: Dictionary) => {
        setValue('status', data?.domainvalue || '');
    }

    const filterDataSource = () => {
        return row !== null ? dictToArrayKV(dataSource) : filterPipe(dictToArrayKV(dataSource), 'key', 'EXTERNAL');
    }

    const onChangeSource = (data: Dictionary) => {
        setValue('source', data?.key || '');
    }

    const filterDataCampaignType = () => {
        if (getValues('communicationchanneltype').startsWith('WHA')) {
            return filterIf(dataCampaignType, 'startWith', 'WHA');
        }
        else if (getValues('communicationchanneltype').startsWith('SMS')) {
            return filterIf(dataCampaignType, 'startWith', 'SMS');
        }
        else {
            return filterIf(dataCampaignType);
        }
    }

    const onChangeType = async (data: Dictionary) => {
        setValue('type', data?.key || '');
        await trigger('type');
    }
    
    const filterMessageTemplate = () => {
        return filterPipe(dataMessageTemplate, 'type', getValues('type'));
    }

    const onChangeMessageTemplateId = async (data: Dictionary) => {
        setValue('messagetemplateid', data?.id || '');
        setValue('messagetemplatename', dataMessageTemplate.filter(d => d.id === data?.id)[0]?.name);
        setValue('messagetemplatenamespace', dataMessageTemplate.filter(d => d.id === data?.id)[0]?.namespace);
        await trigger(['messagetemplateid', 'messagetemplatename', 'messagetemplatenamespace']);
    }

    return (
        <div style={{ width: '100%' }}>
            <div className="col-12" style={{overflowWrap: 'break-word'}}>{JSON.stringify(getValues())}</div>
            <form>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.name}` : t(langKeys.newcampaign)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            // startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.cancel)}</Button>
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="button"
                                // startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                                onClick={() => onSubmit()}
                            >{t(langKeys.next)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.title)}
                                className="col-6"
                                valueDefault={getValues('title')}
                                onChange={(value) => setValue('title', value)}
                                error={errors?.title?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.title)}
                                value={row?.title || ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)}
                                className="col-6"
                                valueDefault={getValues('description')}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.description)}
                                value={row?.description || ""}
                                className="col-6"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                type="date"
                                label={t(langKeys.startdate)}
                                className="col-4"
                                valueDefault={getValues('startdate')}
                                onChange={(value) => setValue('startdate', value)}
                                error={errors?.startdate?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.startdate)}
                                value={row?.startdate || ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                type="date"
                                label={t(langKeys.enddate)}
                                className="col-4"
                                valueDefault={getValues('enddate')}
                                onChange={(value) => setValue('enddate', value)}
                                error={errors?.enddate?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.enddate)}
                                value={row?.enddate || ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <div className="col-4" style={{display: 'flex'}}>
                                <FieldSelect
                                    uset={true}
                                    label={t(langKeys.executiontype)}
                                    className={classes.flexgrow1}
                                    valueDefault={getValues('executiontype')}
                                    onChange={onChangeExecutionType}
                                    error={errors?.executiontype?.message}
                                    data={dictToArrayKV(dataExecutionType)}
                                    optionDesc="value"
                                    optionValue="key"
                                />
                                {getValues('executiontype') === 'SCHEDULED' ? 
                                <IconButton
                                    style={{flexGrow: 0}}    
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    size="small"
                                    onClick={(e) => console.log(e)}
                                >
                                    <EventIcon style={{ color: '#777777' }} />
                                </IconButton>
                                :
                                null}
                            </div>
                            :
                            <FieldView
                                label={t(langKeys.executiontype)}
                                value={t(dataExecutionType[row?.executiontype]) || ""}
                                className="col-4"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.channel)}
                                className="col-8"
                                valueDefault={getValues('communicationchannelid')}
                                onChange={onChangeChannel}
                                error={errors?.communicationchannelid?.message}
                                data={dataChannel}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                            />
                            :
                            <FieldView
                                label={t(langKeys.type)}
                                value={dataChannel.filter(d => d.communicationchannelid === row?.communicationchannelid)[0].communicationchanneldesc || ""}
                                className="col-8"
                            />
                        }
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.group)}
                                className="col-4"
                                valueDefault={getValues('usergroup')}
                                onChange={onChangeGroup}
                                error={errors?.usergroup?.message}
                                data={dataGroup}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            :
                            <FieldView
                                label={t(langKeys.group)}
                                value={dataGroup.filter(d => d.domainvalue === row?.usergroup)[0].domaindesc || ""}
                                className="col-4"
                            />
                        }
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-4"
                                valueDefault={getValues('status')}
                                onChange={onChangeStatus}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            :
                            <FieldView
                                label={t(langKeys.status)}
                                value={dataGroup.filter(d => d.domainvalue === row?.status)[0].domaindesc || ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.source)}
                                className="col-4"
                                valueDefault={getValues('source')}
                                onChange={onChangeSource}
                                error={errors?.source?.message}
                                data={filterDataSource()}
                                optionDesc="value"
                                optionValue="key"
                            />
                            :
                            <FieldView
                                label={t(langKeys.source)}
                                value={t(dataSource[row?.source]) || ""}
                                className="col-4"
                            />
                        }
                        {edit ?
                            <FieldSelect
                                uset={true}
                                label={t(langKeys.messagetype)}
                                className="col-4"
                                valueDefault={getValues('type')}
                                onChange={onChangeType}
                                error={errors?.type?.message}
                                data={filterDataCampaignType()}
                                optionDesc="value"
                                optionValue="key"
                            />
                            :
                            <FieldView
                                label={t(langKeys.messagetype)}
                                value={t(dataCampaignType.filter(d => d.key === row?.type)[0].value) || ""}
                                className="col-4"
                            />
                        }
                    </div>
                    {['HSM','SMS'].includes(getValues('type')) ?
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.messagetemplate)}
                                className="col-6"
                                valueDefault={getValues('messagetemplateid')}
                                onChange={onChangeMessageTemplateId}
                                error={errors?.messagetemplateid?.message}
                                data={filterMessageTemplate()}
                                optionDesc="name"
                                optionValue="id"
                            />
                            :
                            <FieldView
                                label={t(langKeys.messagetemplate)}
                                value={dataMessageTemplate.filter(d => d.id === row?.messagetemplateid)[0].name || ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            <FieldEdit
                                fregister={{...register(`messagetemplatenamespace`, {
                                    validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                })}}    
                                label={t(langKeys.namespace)}
                                className="col-6"
                                valueDefault={getValues('messagetemplatenamespace')}
                                onChange={(value) => setValue('messagetemplatenamespace', value)}
                                disabled={getValues('messagetemplateid') !== ''}
                                error={errors?.messagetemplatenamespace?.message}
                            />
                            :
                            <FieldView
                                label={t(langKeys.namespace)}
                                value={row?.messagetemplatenamespace || ""}
                                className="col-4"
                            />
                        }
                    </div>
                    : null}
                </div>
            </form>
        </div>
    )
}