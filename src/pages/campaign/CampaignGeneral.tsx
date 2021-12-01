/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx, FieldEditArray } from 'components';
import { dictToArrayKV, filterIf, filterPipe } from 'common/helpers';
import { Dictionary, ICampaign, MultiData, SelectedColumns } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { Event as EventIcon } from '@material-ui/icons';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';

interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: ICampaign) => void;
    setViewSelected: (view: string) => void;
    step: string;
    setStep: (step: string) => void;
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
    { key: 'HSM', value: 'hsm', rif: 'startsWith', rifvalue: 'WHA' },
    { key: 'SMS', value: 'sms', rif: 'startsWith', rifvalue: 'SMS'},
];

type FormFields = {
    isnew: boolean,
    id: number,
	communicationchannelid: number,
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
	messagetemplateid: number,
	messagetemplatename: string,
	messagetemplatenamespace: string,
    messagetemplatetype: string,
	messagetemplateheader: Dictionary,
	messagetemplatebuttons: Dictionary[],
	executiontype: string,
	batchjson: Dictionary[],
	fields: SelectedColumns,
    operation: string,
    sourcechanged: boolean
}

export const CampaignGeneral: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, step, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataChannel = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataGroup = multiData[2] && multiData[2].success ? multiData[2].data : [];
    const dataMessageTemplate = multiData[3] && multiData[3].success ? multiData[3].data : [];
    
    const [openModal, setOpenModal] = useState(false);
    
    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            communicationchannelid: auxdata?.length > 0 ? auxdata[0].communicationchannelid : 0,
            communicationchanneltype: '',
            usergroup: auxdata?.length > 0 ? auxdata[0].usergroup : '',
            type: auxdata?.length > 0 ? auxdata[0].type : 'TEXTO',
            status: auxdata?.length > 0 ? auxdata[0].status : 'ACTIVO',
            title: '',
            description: '',
            subject: '',
            message: '',
            startdate: '',
            enddate: '',
            repeatable: false,
            frecuency: 0,
            source: auxdata?.length > 0 ? auxdata[0].source : 'EXTERNAL',
            messagetemplateid:  auxdata?.length > 0 ? auxdata[0].messagetemplateid : 0,
            messagetemplatename: '',
            messagetemplatenamespace: '',
            messagetemplatetype: 'STANDARD',
            messagetemplateheader: {},
            messagetemplatebuttons: [],
            executiontype: auxdata?.length > 0 ? auxdata[0].executiontype : 'MANUAL',
            batchjson: [],
            fields: new SelectedColumns(),
            operation: row ? "UPDATE" : "INSERT",
            sourcechanged: false,
        }
    });

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
    }, [edit, register]);
    
    useEffect(() => {
        if (row !== null && Object.keys(detaildata).length === 0) {
            if (auxdata.length > 0) {
                let messageTemplateData = dataMessageTemplate.find(d => d.id === auxdata[0].messagetemplateid) || {};
                setStepData({
                    ...auxdata[0],
                    messagetemplatename: messageTemplateData.name || auxdata[0].messagetemplatename ||'',
                    messagetemplatenamespace: messageTemplateData.namespace || auxdata[0].messagetemplatenamespace || '',
                    messagetemplatetype: messageTemplateData.templatetype || 'STANDARD',
                });
                trigger();
                dispatch(resetMainAux());
            }
        }
        else if (Object.keys(detaildata).length !== 0) {
            setStepData(detaildata);
            trigger();
        }
    }, [auxdata, detaildata]);

    const setStepData = (data: Dictionary) => {
        setValue('id', data.id);
        setValue('communicationchannelid', data.communicationchannelid);
        setValue('communicationchanneltype', dataChannel.filter(d => d.communicationchannelid === data?.communicationchannelid)[0]?.type);
        setValue('usergroup', data.usergroup);
        setValue('type', data.type);
        setValue('status', data.status);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('subject', data.subject);
        setValue('message', data.message);
        setValue('startdate', data.startdate);
        setValue('enddate', data.enddate);
        setValue('repeatable', data.repeatable);
        setValue('frecuency', data.frecuency);
        setValue('source', data.source || 'INTERNAL');
        setValue('messagetemplateid', data.messagetemplateid);
        setValue('messagetemplatename', data.messagetemplatename);
        setValue('messagetemplatenamespace', data.messagetemplatenamespace);
        setValue('messagetemplatetype', data.messagetemplatetype);
        setValue('messagetemplateheader', data.messagetemplateheader || {});
        setValue('messagetemplatebuttons', data.messagetemplatebuttons || []);
        setValue('executiontype', data.executiontype);
        setValue('batchjson', data.batchjson || []);
        setValue('fields', {...new SelectedColumns(), ...data.fields});
    }

    const onSubmit = handleSubmit((data) => {
        data.messagetemplateheader = data.messagetemplateheader || {};
        data.messagetemplatebuttons = data.messagetemplatebuttons || [];
        data.batchjson = data.batchjson || [];
        data.fields = {...new SelectedColumns(), ...data.fields};
        setDetailData({...detaildata, ...data});
        setStep("step-2");
    });

    const validateDate = (value: string): any => {
        return new Date(value) >= new Date(getValues('startdate'))
    }

    const onChangeExecutionType = async (data: Dictionary) => {
        setValue('executiontype', data?.key || '');
        await trigger('executiontype');
    }

    const onChangeChannel = async (data: Dictionary) => {
        setValue('communicationchannelid', data?.communicationchannelid || 0);
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
        setValue('sourcechanged', true);
    }

    const filterDataCampaignType = () => {
        if (getValues('communicationchanneltype')?.startsWith('WHA')) {
            return filterIf(dataCampaignType, 'startsWith', 'WHA');
        }
        else if (getValues('communicationchanneltype')?.startsWith('SMS')) {
            return filterIf(dataCampaignType, 'startsWith', 'SMS');
        }
        else {
            return filterIf(dataCampaignType);
        }
    }

    const onChangeType = async (data: Dictionary) => {
        setValue('type', data?.key || '');
        setValue('message', '');
        setValue('messagetemplateid', 0);
        setValue('messagetemplatename', '');
        setValue('messagetemplatenamespace', '');
        setValue('messagetemplatetype', 'STANDARD');
        setValue('messagetemplateheader', {});
        setValue('messagetemplatebuttons', []);
        await trigger('type');
    }
    
    const filterMessageTemplate = () => {
        return filterPipe(dataMessageTemplate, 'type', getValues('type'));
    }

    const onChangeMessageTemplateId = async (data: Dictionary) => {
        setValue('messagetemplateid', data?.id || 0);
        let messageTemplate = dataMessageTemplate.filter(d => d.id === data?.id)[0];
        setValue('message', messageTemplate?.body);
        setValue('messagetemplatename', messageTemplate?.name);
        setValue('messagetemplatenamespace', messageTemplate?.namespace);
        setValue('messagetemplatetype', messageTemplate?.templatetype);
        if (data.type === 'HSM') {
            if (messageTemplate.headerenabled)
                setValue('messagetemplateheader', { type: messageTemplate?.headertype, value: messageTemplate?.header });
            else
                setValue('messagetemplateheader', { type: '', value: '' });
            if (messageTemplate.buttonsenabled)
                setValue('messagetemplatebuttons', messageTemplate?.buttons || []);
            else
                setValue('messagetemplatebuttons', []);
        }
        await trigger(['messagetemplateid', 'messagetemplatename', 'messagetemplatenamespace', 'messagetemplatetype']);
    }

    return (
        <React.Fragment>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={setViewSelected}
                    />
                    <TitleDetail
                        title={row ? `${row.title}` : t(langKeys.newcampaign)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.cancel)}</Button>
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
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
                                onClick={(e) => setOpenModal(true)}
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
                            valueDefault={getValues('communicationchannelid') as any}
                            disabled={!getValues('isnew')}
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
                            disabled={!getValues('isnew')}
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
                            valueDefault={getValues('messagetemplateid') as any}
                            disabled={!getValues('isnew')}
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
                            disabled={!getValues('isnew') || getValues('messagetemplateid') !== 0}
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
            <ModalCampaignSchedule
                openModal={openModal}
                setOpenModal={setOpenModal}
                data={getValues('batchjson')}
                parentSetValue={setValue}
            />
        </React.Fragment>
    )
}

interface ModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => any;
    data: any[];
    parentSetValue: (...param: any) => any;
}

const ModalCampaignSchedule: React.FC<ModalProps> = ({ openModal, setOpenModal, data = [], parentSetValue }) => {
    const { t } = useTranslation();

    const { control, register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<any>({
        defaultValues: {
            batchjson: data
        }
    });

    useEffect(() => {
        setValue('batchjson', data);
    }, [data]);

    const { fields: schedule, append: scheduleAppend, remove: scheduleRemove } = useFieldArray({
        control,
        name: "batchjson",
    });

    const onClickAddSchedule = async () => {
        scheduleAppend({ date: '', time: '', quantity: 0 });
    }

    const onClickDeleteSchedule = async (index: number) => {
        scheduleRemove(index);
    }

    const handleCancelModal = () => {
        setOpenModal(false);
        setValue('batchjson', data);
        clearErrors();
    }

    const onSubmit = handleSubmit((data) => {
        parentSetValue('batchjson', data.batchjson);
        setOpenModal(false);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.scheduled)}
            button1Type="button"
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={handleCancelModal}
            button2Type="button"
            buttonText2={t(langKeys.save)}
            handleClickButton2={onSubmit}
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => onClickAddSchedule()}
                                >
                                    <AddIcon style={{ color: '#7721AD' }} />
                                </IconButton>
                            </TableCell>
                            <TableCell>{t(langKeys.date)}</TableCell>
                            <TableCell>{t(langKeys.hour)}</TableCell>
                            <TableCell>{t(langKeys.quantity)}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedule.map((item: any, i) => 
                            <TableRow key={item.id}>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => onClickDeleteSchedule(i)}
                                    >
                                        <DeleteIcon style={{ color: '#777777' }} />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <FieldEditArray 
                                        fregister={{...register(`batchjson.${i}.date`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })}}
                                        type="date"
                                        valueDefault={item.date}
                                        error={errors?.batchjson?.[i]?.date?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].date`, value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FieldEditArray 
                                        fregister={{...register(`batchjson.${i}.time`, {
                                            validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                        })}}
                                        type="time"
                                        valueDefault={item.time}
                                        error={errors?.batchjson?.[i]?.time?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].time`, value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FieldEditArray 
                                        fregister={{...register(`batchjson.${i}.quantity`, {
                                            validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                        })}}
                                        type="number"
                                        valueDefault={item.quantity}
                                        error={errors?.batchjson?.[i]?.quantity?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].quantity`, value)}
                                        inputProps={{ min: 0, step: 1 }}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </DialogZyx>
    )
}