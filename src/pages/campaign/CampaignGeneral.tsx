import React, { useEffect, useState } from 'react'; 
import IconButton from '@material-ui/core/IconButton';
import { FieldView, FieldEdit, FieldSelect, DialogZyx, FieldEditArray, ManageOrganization } from 'components';
import { dictToArrayKV, filterIf, filterPipe } from 'common/helpers';
import { Dictionary, ICampaign, MultiData, SelectedColumns } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { Event as EventIcon } from '@material-ui/icons';
import { FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { resetCollectionPaginatedAux, resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { FrameProps } from './CampaignDetail';
import { showSnackbar } from 'store/popus/actions';
import { Descendant } from "slate";
import { MessagePreviewAuthentication, MessagePreviewMultimedia } from 'pages/messagetemplates/components/components';

interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: any) => void;
}

type Button = {
    type: string;
    title: string;
    payload: string;
};


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
    },
    subtitle: {
        fontSize: '0.9rem',       
        color: 'grey', 
        marginBottom:'0.5rem',
    },
    title: {
       fontSize: '1rem', 
       color: 'black' 
    }
}));

const dataExecutionType: Dictionary = {
    MANUAL: 'manual',
    SCHEDULED: 'scheduled',
};

const dataSource: Dictionary = {
    INTERNAL: 'datasource_internal',
    EXTERNAL: 'datasource_external',
    PERSON: 'datasource_person',
    LEAD: 'datasource_lead'
};

const dataCampaignType = [
    { key: 'TEXTO', value: 'text' },
    { key: 'HSM', value: 'hsm', rif: 'startsWith', rifvalue: 'WHA' },
    { key: 'SMS', value: 'sms', rif: 'startsWith', rifvalue: 'SMS' },
    { key: 'CALL', value: 'call', rif: 'starsWith', rifvalue: 'VOX' },
    { key: 'MAIL', value: 'mail', rif: 'starsWith', rifvalue: 'MAI' },
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
    messagetemplatefooter: string,
    messagetemplateattachment: string,
    messagetemplatelanguage: string,
    messagetemplatepriority: string,
    executiontype: string,
    batchjson: Dictionary[],
    fields: SelectedColumns,
    operation: string,
    sourcechanged: boolean,

    headertype: string;
    header: string;
    footer: string;
    buttons: Button[];
    buttonstext: { text: string }[];
    buttonsphone: { text: string }[];

}

export const CampaignGeneral: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, frameProps, setFrameProps, setPageSelected, setSave }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = [...multiData[0] && multiData[0].success ? multiData[0].data : []];
    const dataChannel = [...multiData[1] && multiData[1].success ? (multiData[1].data || []).filter(x => ((x.type || '').startsWith('WHA') || (x.type || '').startsWith('SMS') || (x.type || '').startsWith('MAI') || (x.type || '').startsWith('VOX'))) : []];
    const dataGroup = [...multiData[2] && multiData[2].success ? multiData[2].data : []];
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const groupObligatory = multiData.filter(x=>x.key==="UFN_PROPERTY_SELBYNAMEVALIDACIONCAMPAÑASGRUPO")?.[0]?.data?.[0]?.propertyvalue === "1"

    const [openModal, setOpenModal] = useState(false);

    const { register, setValue, getValues, trigger, formState: { errors } } = useForm<FormFields>({
        defaultValues: {
            isnew: row ? false : true,
            id: row ? row.id : 0,
            communicationchannelid: detaildata?.communicationchannelid || (auxdata?.length > 0 ? auxdata[0].communicationchannelid : 0),
            communicationchanneltype: '',
            usergroup: detaildata?.usergroup || (auxdata?.length > 0 ? auxdata[0].usergroup : ''),
            type: detaildata?.type || (auxdata?.length > 0 ? auxdata[0].type : 'TEXTO'),
            status: detaildata?.status || (auxdata?.length > 0 ? auxdata[0].status : 'ACTIVO'),
            title: '',
            description: '',
            subject: '',
            message: '',
            startdate: '',
            enddate: '',
            repeatable: false,
            frecuency: 0,
            source: detaildata?.source || (auxdata?.length > 0 ? auxdata[0].source : 'EXTERNAL'),
            messagetemplateid: detaildata?.messagetemplateid || (auxdata?.length > 0 ? auxdata[0].messagetemplateid : 0),
            messagetemplatename: '',
            messagetemplatenamespace: '',
            messagetemplatetype: 'STANDARD',
            messagetemplateheader: {},
            messagetemplatebuttons: [],
            messagetemplatefooter: '',
            messagetemplateattachment: '',
            messagetemplatelanguage: '',
            messagetemplatepriority: '',
            executiontype: detaildata?.executiontype || (auxdata?.length > 0 ? auxdata[0].executiontype : 'MANUAL'),
            batchjson: [],
            fields: new SelectedColumns(),
            operation: row ? "UPDATE" : "INSERT",
            sourcechanged: false,           
           
            headertype: row?.headertype || "none",
            buttonsphone: row ? row.buttonsphone || [] : [],
            buttonstext: row ? row.buttonstext || [] : [],
            header: row?.header || "",
            footer: row?.footer || "",
            buttons: row ? row.buttons || [] : [],
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
        if(groupObligatory){
            register('usergroup', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        }
    }, [edit, register, multiData, groupObligatory]);

    useEffect(() => {
        if (row !== null && Object.keys(detaildata).length === 0) {
            if (auxdata.length > 0) {
                let messageTemplateData = dataMessageTemplate.find(d => d.id === auxdata[0].messagetemplateid) || {};
                setStepData({
                    ...auxdata[0],
                    messagetemplatename: messageTemplateData.name || auxdata[0].messagetemplatename || '',
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
        setValue('messagetemplatefooter', data.messagetemplatefooter || '');
        setValue('messagetemplateattachment', data.messagetemplateattachment || '');
        setValue('messagetemplatelanguage', data.messagetemplatelanguage || '');
        setValue('messagetemplatepriority', data.messagetemplatepriority || '');
        setValue('executiontype', data.executiontype);
        setValue('batchjson', data.batchjson || []);
        setValue('fields', { ...new SelectedColumns(), ...data.fields });
    }

    useEffect(() => {
        if (frameProps.checkPage) {
            trigger().then((valid: any) => {
                let data = getValues();
                data.messagetemplateheader = data.messagetemplateheader || {};
                data.messagetemplatebuttons = data.messagetemplatebuttons || [];
                data.batchjson = data.batchjson || [];
                data.fields = { ...new SelectedColumns(), ...data.fields };
                setDetaildata({ ...detaildata, ...data });
                setFrameProps({ ...frameProps, executeSave: false, checkPage: false, valid: { ...frameProps.valid, 0: valid } });
                if (frameProps.page === 2 && !frameProps.valid[1]) {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_person_selected)}));
                }
                else if (valid) {
                    setPageSelected(frameProps.page);
                }
                if (valid && frameProps.executeSave) {
                    setSave('VALIDATION');
                }
            });
        }
    }, [frameProps.checkPage])

    const validateDate = (value: string): any => {
        return new Date(value) >= new Date(getValues('startdate'))
    }

    const onChangeExecutionType = async (data: Dictionary) => {
        setValue('executiontype', data?.key || '');
        await trigger('executiontype');
    }

    const onChangeChannel = async (data: Dictionary) => {
        setValue('communicationchannelid', data?.communicationchannelid || 0);
        const channeltype = dataChannel.filter(d => d.communicationchannelid === data?.communicationchannelid)[0]?.type;
        setValue('communicationchanneltype', channeltype);
        if (channeltype?.startsWith('WHA')) {
            onChangeType({ key: 'HSM' });
        }
        else if (channeltype?.startsWith('SMS')) {
            onChangeType({ key: 'SMS' });
        }
        else if (channeltype?.startsWith('VOX')) {
            onChangeType({ key: 'CALL' });
        }
        else if (channeltype?.startsWith('MAI')) {
            onChangeType({ key: 'MAIL' });
        }
        else {
            onChangeType({ key: 'TEXTO' });
        }
        await trigger(['communicationchannelid', 'communicationchanneltype', 'type']);
    }

    const onChangeGroup = (data: Dictionary) => {
        setValue('usergroup', data?.domainvalue || '');
    }

    const onChangeStatus = (data: Dictionary) => {
        setValue('status', data?.domainvalue || '');
    }

    const filterDataSource = () => {
        return row !== null ? dictToArrayKV(dataSource) : filterPipe(dictToArrayKV(dataSource), 'key', 'INTERNAL', '!');
    }

    const onChangeSource = (data: Dictionary) => {
        if (['PERSON','LEAD'].includes(getValues('source'))) {
            setValue('message', getValues('message').replace(new RegExp(/{{field[0-9]+}}/, 'g'), '{{???}}'))
        }
        setValue('source', data?.key || '');
        setValue('sourcechanged', true);
        setFrameProps({ ...frameProps, valid: { ...frameProps.valid, 1: false } });
        dispatch(resetCollectionPaginatedAux())
    }

    const filterDataCampaignType = () => {
        if (getValues('communicationchanneltype')?.startsWith('WHA')) {
            return dataCampaignType.filter(t => t.key === 'HSM');
        }
        else if (getValues('communicationchanneltype')?.startsWith('SMS')) {
            return dataCampaignType.filter(t => t.key === 'SMS');
        }
        else if (getValues('communicationchanneltype')?.startsWith('VOX')) {
            return dataCampaignType.filter(t => t.key === 'CALL');
        }
        else if (getValues('communicationchanneltype')?.startsWith('MAI')) {
            return dataCampaignType.filter(t => t.key === 'MAIL');
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
        setValue('messagetemplatefooter', '');
        setValue('messagetemplateattachment', '');
        setValue('messagetemplatelanguage', '');
        setValue('messagetemplatepriority', '');
        await trigger('type');
    }

    const filterMessageTemplate = () => {
        if (getValues('type') === "MAIL") {
            var mailTemplate = filterPipe(dataMessageTemplate, 'type', getValues('type'));
            var htmlTemplate = filterPipe(dataMessageTemplate, 'type', 'HTML');

            return [...mailTemplate, ...htmlTemplate];
        }
        else {
            return filterPipe(dataMessageTemplate, 'type', getValues('type'));
        }
    }

    const onChangeMessageTemplateId = async (data: Dictionary) => {
        setValue('messagetemplateid', data?.id || 0);
        let messageTemplate = dataMessageTemplate.filter(d => d.id === data?.id)[0];
        setValue('message', messageTemplate?.body);
        setValue('messagetemplatename', messageTemplate?.name);
        setValue('messagetemplatenamespace', messageTemplate?.namespace);
        setValue('messagetemplatetype', messageTemplate?.templatetype);
        setValue('messagetemplatelanguage', messageTemplate?.language);
        setValue('messagetemplatepriority', messageTemplate?.priority);
        if (data?.type === 'HSM') {
            if (messageTemplate.headerenabled)
                setValue('messagetemplateheader', { type: messageTemplate?.headertype, value: messageTemplate?.header });
            else
                setValue('messagetemplateheader', { type: '', value: '' });
            if (messageTemplate.buttonsenabled)
                setValue('messagetemplatebuttons', messageTemplate?.buttons || []);
            else
                setValue('messagetemplatebuttons', []);
            if (messageTemplate.footerenabled)
                setValue('messagetemplatefooter', messageTemplate?.footer || '');
            else
                setValue('messagetemplatefooter', '');
        }
        if (data?.type === 'MAIL' || data?.type === 'HTML') {
            if (messageTemplate.header) {
                setValue('messagetemplateheader', { type: "TEXT", value: messageTemplate?.header });
                setValue('subject', messageTemplate?.header);
            }
            else {
                setValue('messagetemplateheader', { type: '', value: '' });
                setValue('subject', '');
            }
            if (messageTemplate.attachment)
                setValue('messagetemplateattachment', messageTemplate?.attachment || '');
            else
                setValue('messagetemplateattachment', '');
        }
        await trigger(['messagetemplateid', 'messagetemplatename', 'messagetemplatenamespace', 'messagetemplatetype']);
    }



    const [bodyObject, setBodyObject] = useState<Descendant[]>(
        row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );

    const templateId = getValues('messagetemplateid');
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId);

    const headerType = selectedTemplate?.headertype || '';
    const header = selectedTemplate?.header || '';
    const footer = selectedTemplate?.footer || '';
    const buttons = selectedTemplate?.buttons || [];
    const buttonsText = buttons.map(button => ({ text: button.title }));
    const buttonsLink = buttons.map(button => ({ text: button.payload }));
    const buttonsPhone = getValues('buttonsphone').map((btn: any) => ({ text: btn.text }));
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    
    console.log(selectedTemplate)



    return (
        <React.Fragment>
           <div style={{display:'flex', gap: '1rem', width:'100%'}}>
                <div className={classes.containerDetail}  style={{width:'50%'}}>

                <div className="row-zyx">
                    {edit ?
                        <FormControl className="col-12">                          
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.title)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_title_desc)} </div>                        
                            <FieldEdit                      
                                variant="outlined"
                                className="col-12"
                                valueDefault={getValues('title')}
                                onChange={(value) => setValue('title', value)}
                                error={errors?.title?.message}
                            />                   
                        </FormControl>                                          
                        :
                        <FieldView
                            label={t(langKeys.title)}
                            value={row?.title || ""}
                            className="col-12"
                        />
                    }
                    {edit ?
                      
                    <FormControl className="col-12" >                     
                        <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.description)} </div>
                        <div className={classes.subtitle}> {t(langKeys.campaign_description_desc)} </div>                    
                        <FieldEdit   
                            variant="outlined"                 
                            className="col-12"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />               
                    </FormControl>  
                        :
                        <FieldView
                            label={t(langKeys.description)}
                            value={row?.description || ""}
                            className="col-12"
                        />
                    }
                </div>

                <div className="row-zyx">
                    {edit ?                            
                        <FormControl className="col-6">                          
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.startdate)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_startdate_desc)} </div>
                            <FieldEdit   
                                variant="outlined"                 
                                type="date"                               
                                className="col-6"
                                valueDefault={getValues('startdate')}
                                onChange={(value) => setValue('startdate', value)}
                                error={errors?.startdate?.message}
                            />      
                        </FormControl>                         
                        :
                        <FieldView
                            label={t(langKeys.startdate)}
                            value={row?.startdate || ""}
                            className="col-6"
                        />
                    }
                    {edit ?
                        <FormControl className="col-6">                          
                            <div className={classes.title}> {t(langKeys.report_tipification_enddate)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_enddate_desc)} </div>
                            <FieldEdit   
                                variant="outlined"                 
                                type="date"                            
                                className="col-6"
                                valueDefault={getValues('enddate')}
                                onChange={(value) => setValue('enddate', value)}
                                error={errors?.enddate?.message}
                            />         
                        </FormControl>                          
                        :
                        <FieldView
                            label={t(langKeys.enddate)}
                            value={row?.enddate || ""}
                            className="col-6"
                        />
                    }
                    {edit ?
                        <FormControl className="col-12" >                      
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.source)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_origin_desc)} </div>                          
                            <FieldSelect
                                variant="outlined"       
                                uset={true}                            
                                className="col-12"
                                valueDefault={getValues('source')}
                                onChange={onChangeSource}
                                error={errors?.source?.message}
                                data={filterDataSource()}
                                optionDesc="value"
                                optionValue="key"
                            />
                        </FormControl>                       
                        :
                        <FieldView
                            label={t(langKeys.source)}
                            value={t(dataSource[row?.source]) || ""}
                            className="col-12"
                        />
                    }
                    {edit ?
                       <FormControl className="col-6" >                       
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.executiontype)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_executiontype_desc)} </div>
                            <FieldSelect
                                variant="outlined"       
                                uset={true}
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
                                    style={{ flexGrow: 0 }}
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
                        </FormControl>
                        :
                        <FieldView
                            label={t(langKeys.executiontype)}
                            value={t(dataExecutionType[row?.executiontype]) || ""}
                            className="col-6"
                        />
                    }
                    {edit ?
                        <FormControl className="col-6" >                      
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.group)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_group_desc)} </div>                           
                            <FieldSelect
                                variant="outlined"       
                                className="col-6"
                                valueDefault={getValues('usergroup')}
                                onChange={onChangeGroup}
                                error={errors?.usergroup?.message}
                                data={dataGroup}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </FormControl>                       
                        :
                        <FieldView
                            label={t(langKeys.group)}
                            value={dataGroup.filter(d => d.domainvalue === row?.usergroup)[0].domaindesc || ""}
                            className="col-6"
                        />
                    }
                </div>
                <div className="row-zyx">
                    {edit ?
                        <FormControl className="col-12" >                      
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.channel)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_channel_desc)} </div>
                            <FieldSelect
                                variant="outlined"      
                                className="col-12"
                                valueDefault={getValues('communicationchannelid') as any}
                                disabled={!getValues('isnew')}
                                onChange={onChangeChannel}
                                error={errors?.communicationchannelid?.message}
                                data={dataChannel}
                                optionDesc="communicationchanneldesc"
                                optionValue="communicationchannelid"
                            />
                        </FormControl>                       
                        :
                        <FieldView
                            label={t(langKeys.type)}
                            value={dataChannel.filter(d => d.communicationchannelid === row?.communicationchannelid)[0].communicationchanneldesc || ""}
                            className="col-12"
                        />
                    }                 
                </div>               
                {['HSM'].includes(getValues('type')) ?
                    <div className="row-zyx">
                        {edit ?
                            <FormControl className="col-6" >                     
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetemplate)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_comunicationtemplate_desc)} </div>
                                <FieldSelect
                                    fregister={{
                                        ...register(`messagetemplateid`, {
                                            validate: (value: any) => (value) || t(langKeys.field_required)
                                        })
                                    }}
                                    variant="outlined"                                       
                                    valueDefault={getValues('messagetemplateid') as any}
                                    disabled={!getValues('isnew')}
                                    onChange={onChangeMessageTemplateId}
                                    error={errors?.messagetemplateid?.message}
                                    data={filterMessageTemplate()}
                                    optionDesc="name"
                                    optionValue="id"
                                />
                            </FormControl>                              
                            :
                            <FieldView
                                label={t(langKeys.messagetemplate)}
                                value={dataMessageTemplate.filter(d => d.id === row?.messagetemplateid)[0].name || ""}
                                className="col-6"
                            />
                        }
                        {edit ?
                            <FormControl className="col-6" >                       
                               
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.namespace)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_comunicationtemplate_desc)} </div>
                               
                                <FieldEdit
                                    fregister={{
                                        ...register(`messagetemplatenamespace`, {
                                            validate: (value: any) => (getValues('type') !== 'HSM' ? true : value && value.length) || t(langKeys.field_required)
                                        })
                                    }}
                                    variant="outlined"      
                                    className="col-6"
                                    valueDefault={getValues('messagetemplatenamespace')}
                                    onChange={(value) => setValue('messagetemplatenamespace', value)}
                                    disabled={!getValues('isnew') || getValues('messagetemplateid') !== 0}
                                    error={errors?.messagetemplatenamespace?.message}
                                />
                            </FormControl>  
                           
                            :
                            <FieldView
                                label={t(langKeys.namespace)}
                                value={row?.messagetemplatenamespace || ""}
                                className="col-4"
                            />
                        }
                    </div>
                    : null}
                {['SMS', 'MAIL'].includes(getValues('type')) ?
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                fregister={{
                                    ...register(`messagetemplateid`, {
                                        validate: (value: any) => (value) || t(langKeys.field_required)
                                    })
                                }}
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
                    </div>
                    : null}

                <div className="row-zyx">
                    {edit ?
                        <FormControl className="col-6" >                      
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.status)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_status_desc)} </div>                          
                            <FieldSelect
                                variant="outlined"    
                                valueDefault={getValues('status')}
                                onChange={onChangeStatus}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                        </FormControl>  
                       
                        :
                        <FieldView
                            label={t(langKeys.status)}
                            value={dataGroup.filter(d => d.domainvalue === row?.status)[0].domaindesc || ""}
                            className="col-6"
                        />
                    }
                   
                    {edit ?
                        <FormControl className="col-6" >                       
                           
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetype)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_messagetype_desc)} </div>
                           
                            <FieldSelect
                                variant="outlined"       
                                uset={true}                              
                                className="col-6"
                                valueDefault={getValues('type')}
                                disabled={!getValues('isnew')}
                                onChange={onChangeType}
                                error={errors?.type?.message}
                                data={filterDataCampaignType()}
                                optionDesc="value"
                                optionValue="key"
                            />
                        </FormControl>                       
                        :
                        <FieldView
                            label={t(langKeys.messagetype)}
                            value={t(filterDataCampaignType().filter(d => d.key === row?.type)[0]?.value) || ""}
                            className="col-6"
                        />
                    }
                   
                </div>
                </div>
                <div className={classes.containerDetail} style={{width:'50%'}}>             
                    {t(langKeys.campaign_templatepreview)}   
                    <div style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
                        
                        <div style={{ borderRadius:'0.5rem', backgroundColor: '#FDFDFD', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1rem' }}> 
                            <div className='container'>
                                {/* <MessagePreviewAuthentication
                                    buttontext={authButtonText}
                                    safetyAdvice={addSafetyAdvice}
                                    dateAdvice={addLastDateCode}
                                    expiresValue={expiresValue}
                                /> */}

                                <MessagePreviewMultimedia
                                    headerType={getValues('headertype')}
                                    header={getValues('header')}
                                    selectedFile={selectedFile}
                                    bodyObject={bodyObject}
                                    footer={getValues('footer')}
                                    buttonstext={getValues('buttonstext').map((btn: any) => { return btn.text })}
                                    buttonslink={getValues('buttons').map((btn: Dictionary) => { return btn.text })}
                                    buttonsphone={getValues('buttonsphone').map((btn: any) => { return btn.text })}
                                />
                            </div>
                        </div>
                        
                        
                    </div>    
                </div>

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
        parentSetValue('batchjson', data.batchjson.map((d: any, i: number) => ({ ...d, batchindex: i + 1 })));
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
                                        fregister={{
                                            ...register(`batchjson.${i}.date`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        type="date"
                                        valueDefault={item.date}
                                        error={errors?.batchjson?.[i]?.date?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].date`, value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FieldEditArray
                                        fregister={{
                                            ...register(`batchjson.${i}.time`, {
                                                validate: (value: any) => (value && value.length) || t(langKeys.field_required)
                                            })
                                        }}
                                        type="time"
                                        valueDefault={item.time}
                                        error={errors?.batchjson?.[i]?.time?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].time`, value)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <FieldEditArray
                                        fregister={{
                                            ...register(`batchjson.${i}.quantity`, {
                                                validate: (value: any) => (value && value > 0) || t(langKeys.field_required)
                                            })
                                        }}
                                        type="number"
                                        valueDefault={item.quantity}
                                        error={errors?.batchjson?.[i]?.quantity?.message}
                                        onChange={(value) => setValue(`batchjson[${i}].quantity`, parseInt(value))}
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