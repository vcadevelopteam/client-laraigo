import React, { useEffect, useState } from 'react'; 
import { FieldView, FieldEdit, FieldSelect } from 'components';
import { dictToArrayKV, filterIf, filterPipe } from 'common/helpers';
import { Dictionary, ICampaign, MultiData, SelectedColumns } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { FormControl } from '@material-ui/core';
import { resetCollectionPaginatedAux, resetMainAux } from 'store/main/actions';
import { useDispatch } from 'react-redux';
import { FrameProps } from './CampaignDetail';
import { showSnackbar } from 'store/popus/actions';
import TemplatePreview from './components/TemplatePreview';

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
    setIdAux: (value: number) => void;
    setTemplateAux: (value: Dictionary) => void;
    setDetectionChangeSource: (value: boolean) => void;
}

type Button = {
    type: string;
    title: string;
    payload: string;
};

type BatchJson = {
    date: string;
    time: string;
    quantity: number;
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
    },
    buttonPreview: {
        color: '#009C8F',    
        padding: '0.8rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
   
        textDecoration: 'none',
        borderTop: '1px solid #D7D7D7',
        '&:hover': {
            backgroundColor: '#FBFBFB',
        },
    },
    previewHour: {
        display:'flex', justifyContent:'right', fontSize:'0.78rem', color:'grey', margin:'10px 0'
    }, 
    pdfPreview: {
        width: '100%',
        height: '500px',
        border: 'none',
        display: 'block',
        margin: '0 auto',
        borderRadius: '0.5rem',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        background: '#F5D9D9',
        padding: '10px',
        marginTop:'7px',
        borderRadius: '5px',
        maxWidth: '100%',
        overflow: 'hidden',
    },
    copyButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    icon: {
        marginRight: '10px',
        color:'#DF3636',
    },
    fileName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
    },
    carouselContainer: {
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '1rem 0',
    },
    carouselItem: {
        minWidth: '200px',
        maxWidth: '300px',
        borderRadius: '0.5rem',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
        textAlign: 'center',
    },
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
    { key: 'HTML', value: 'HTML', rif: 'starsWith', rifvalue: 'HTML' },
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
    date: string,
    time: string,  
    quantity: number,
    batchjson: BatchJson,
    carouseljson: Dictionary[],
    variableshidden: string[],
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

export const CampaignGeneral: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, frameProps, setFrameProps, setPageSelected, setSave, setIdAux, setTemplateAux, setDetectionChangeSource }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = [...multiData[0] && multiData[0].success ? multiData[0].data : []];
    const dataChannel = [...multiData[1] && multiData[1].success ? (multiData[1].data || []).filter(x => ((x.type || '').startsWith('WHA') || (x.type || '').startsWith('SMS') || (x.type || '').startsWith('MAI') || (x.type || '').startsWith('VOX'))) : []];
    const dataGroup = [...multiData[2] && multiData[2].success ? multiData[2].data : []];
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const groupObligatory = multiData.filter(x=>x.key==="UFN_PROPERTY_SELBYNAMEVALIDACIONCAMPAÑASGRUPO")?.[0]?.data?.[0]?.propertyvalue === "1"
    const [previousSource, ] = useState('INTERNAL');
    const initialBatchjson = { date: '', time: '', quantity: 1 };

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
            batchjson: JSON.stringify(detaildata?.batchjson) === "[]" ? initialBatchjson : (detaildata?.batchjson?.[0] || initialBatchjson),
            carouseljson: [],
            variableshidden: [],
            fields: new SelectedColumns(),
            operation: row ? "UPDATE" : "INSERT",
            sourcechanged: false,           
            headertype: row?.headertype || "none",
            buttonsphone: row ? row.buttonsphone || [] : [],
            buttonstext: row ? row.buttonstext || [] : [],
            header: row?.header || "",
            footer: row?.footer || "",
            buttons: row ? row.buttons || [] : [],
            date: row?.date || null,
            time: row?.time || null,
        }
    });

    const templateId = getValues('messagetemplateid');
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId) || {};
    let fieldCounter = 5; 
    const initialFieldCounter = fieldCounter; 
    fieldCounter = initialFieldCounter;

    const carouseljsonData: any[] = selectedTemplate.carouseldata
    ? selectedTemplate.carouseldata.map(({ bodyvariables, buttons, ...rest }: { bodyvariables: any, buttons: any[] }) => ({
        ...rest,
        body: rest.body.replace(/{{\d+}}/g, () => `{{field${fieldCounter++}}}`), 
        buttons: buttons.map(({ btn, ...buttonRest }) => {
            let url = btn.url;
            if (btn.type === "dynamic" && !url.includes("{{")) {
                url = `${url}/{{field${fieldCounter++}}}`;
            }
            return {
                ...buttonRest,
                btn: {
                    ...btn,
                    url,
                    variables: undefined
                }
            }
        })
    }))
    : [];
    
    const templateButtonsData = [
        ...(selectedTemplate.buttonsgeneric || []).map(({ btn, ...rest }) => ({
            ...rest,
            btn: {
                ...Object.fromEntries(Object.entries(btn).filter(([key]) => key !== 'variables')),
                url: btn.url ? btn.url.replace(/{{\d+}}/g, () => `{{field${fieldCounter++}}}`) : btn.url
            }
        })),
        ...(selectedTemplate.buttonsquickreply || []).map(({ btn, ...rest }) => ({
            ...rest,
            btn: {
                ...btn,
                text: btn.text ? btn.text.replace(/{{\d+}}/g, () => `{{field${fieldCounter++}}}`) : btn.text
            }
        }))
    ];
    
    useEffect(() => {
        register('title', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('startdate', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('enddate', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('executiontype', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('batchjson.date', {
            validate: {
                value: (value: any) => (getValues('executiontype') !== 'SCHEDULED' || (value && value.length)) || t(langKeys.field_required),
                notPastDate: (value: any) => (getValues('executiontype') !== 'SCHEDULED' || validateDate(value)) || "La fecha es menor a la actual"
            }
        });
        register('batchjson.time', { validate: (value: any) => (getValues('executiontype') !== 'SCHEDULED' || (value && value.length)) || t(langKeys.field_required) });
        register('communicationchannelid', { validate: (value: any) => (value && value > 0) || t(langKeys.field_required) });
        register('status', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('source', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        if (groupObligatory) {
            register('usergroup', { validate: (value: any) => (value && value.length) || t(langKeys.field_required) });
        }
    }, [edit, register, multiData, groupObligatory]);
    


    useEffect(() => {
        if (row !== null && Object.keys(detaildata).length === 0) {
            if (auxdata.length > 0) {
                const messageTemplateData = dataMessageTemplate.find(d => d.id === auxdata[0].messagetemplateid) || {};
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
        setValue('messagetemplatebuttons', templateButtonsData || []);
        setValue('messagetemplatefooter', data.messagetemplatefooter || '');
        setValue('messagetemplateattachment', data.messagetemplateattachment || '');
        setValue('messagetemplatelanguage', data.messagetemplatelanguage || '');
        setValue('messagetemplatepriority', data.messagetemplatepriority || '');
        setValue('executiontype', data.executiontype);
        const batchjson = JSON.stringify(detaildata?.batchjson) === "[]" ? initialBatchjson : (Array.isArray(detaildata?.batchjson) ? (detaildata.batchjson || []) : detaildata.batchjson)
    
        setValue('batchjson', batchjson);
        setValue('carouseljson', carouseljsonData || ['faileaste']);
        setValue('fields', { ...new SelectedColumns(), ...data.fields });
    }
    

    useEffect(() => {
        if (frameProps.checkPage) {
            trigger().then((valid: any) => {            
                const data = getValues();
                data.messagetemplateheader = data.messagetemplateheader || {};
                data.messagetemplatebuttons = templateButtonsData || [];
                data.batchjson = data.batchjson || [];
                data.carouseljson = carouseljsonData || ['faileaste'];
                data.fields = { ...new SelectedColumns(), ...data.fields };
                

                data.variableshidden = detaildata.variableshidden || [];

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
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 
    
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
    
        const oneDayBefore = new Date(currentDate);
        oneDayBefore.setDate(currentDate.getDate() - 1); 
    
        return selectedDate >= oneDayBefore;
    }; 

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
        trigger('usergroup');
    }

    const onChangeStatus = (data: Dictionary) => {
        setValue('status', data?.domainvalue || '');
        trigger('status');
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

        if (previousSource === 'INTERNAL' && data?.key !== 'INTERNAL') {
            setDetectionChangeSource(true);
        } else {
            setDetectionChangeSource(false);
        }
    }

    const filterDataCampaignType = () => {
        const communicationChannelType = getValues('communicationchanneltype');
        
        if (communicationChannelType?.startsWith('WHA')) {
            return dataCampaignType.filter(t => t.key === 'HSM' || t.key === 'SMS');
        }
        else if (communicationChannelType?.startsWith('SMS')) {
            return dataCampaignType.filter(t => t.key === 'SMS');
        }
        else if (communicationChannelType?.startsWith('VOX')) {
            return dataCampaignType.filter(t => t.key === 'CALL');
        }
        else if (communicationChannelType?.startsWith('MAI')) {
            return dataCampaignType.filter(t => t.key === 'MAIL' || t.key === 'HTML');
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
        const type = getValues('type');
        const communicationChannelId = getValues('communicationchannelid');   
        let filteredTemplates;
    
        if (type === "MAIL" || type === "HTML" || type === 'SMS') {
            filteredTemplates = filterPipe(dataMessageTemplate, 'type', type);
        } else {
            filteredTemplates = filterPipe(dataMessageTemplate, 'type', type);    
            if (communicationChannelId) {
                filteredTemplates = filteredTemplates.filter(template => {
                    const templateChannelIds = template.communicationchannelid.split(',').map((id: Dictionary) => id.trim());
                    return templateChannelIds.some((id: Dictionary) => id.trim() === String(communicationChannelId).trim());
                });
            }
        }
    
        return filteredTemplates;
    }    
        
    const onChangeMessageTemplateId = async (data: Dictionary) => {
        setValue('messagetemplateid', data?.id || 0);
        setIdAux(data?.id || 0);      
        setTemplateAux(dataMessageTemplate.find(template => template.id === data.id) || {})        
   
        const messageTemplate = dataMessageTemplate.filter(d => d.id === data?.id)[0];
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

    const classNameCondition = edit && getValues('executiontype') === 'SCHEDULED' ? 'col-12' : 'col-6'  
    return (
        <React.Fragment>
            <div style={{display:'flex', gap: '1rem', width:'100%'}}>

                <div className={classes.containerDetail}  style={{width:'60%'}}>

                <div className="row-zyx">
                    {edit ?
                        <FormControl className="col-12">                          
                            <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.title)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_title_desc)} </div>                        
                            <FieldEdit                      
                                variant="outlined"
                                className="col-12"
                                valueDefault={getValues('title')}
                                onChange={(value) => {
                                    setValue('title', value);
                                    trigger('title'); 
                                }}
                                onBlur={() => trigger('title')} 
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
                            onChange={(value) => {
                                setValue('description', value);
                                trigger('description'); 
                            }}
                            onBlur={() => trigger('description')} 
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
                                onChange={(value) => {
                                    setValue('startdate', value);
                                    trigger('startdate'); 
                                }}
                                onBlur={() => trigger('startdate')} 
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
                            <div className={classes.title}> {t(langKeys.enddate)} </div>
                            <div className={classes.subtitle}> {t(langKeys.campaign_enddate_desc)} </div>
                            <FieldEdit   
                                variant="outlined"                 
                                type="date"                            
                                className="col-6"
                                valueDefault={getValues('enddate')}
                                onChange={(value) => {
                                    setValue('enddate', value);
                                    trigger('enddate'); 
                                }}
                                onBlur={() => trigger('enddate')} 
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
                       <>

                    <div className="row-zyx" style={{ display: 'flex', marginBottom: '0', padding:'1rem 1rem 0 0' }}>
                        <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.executiontype)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_executiontype_desc)} </div>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
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
                            </div>
                        </FormControl>
                        {edit && getValues('executiontype') === 'SCHEDULED' &&
                            <>
                               <FormControl className="col-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.date)} </div>
                                        <div className={classes.subtitle}> {t(langKeys.campaign_execution_date)} </div>
                                    </div>
                                    <div style={{ marginTop: 'auto' }}>
                                        <FieldEdit
                                            variant="outlined"
                                            type="date"
                                            className="col-6"
                                            valueDefault={getValues('batchjson.date')}
                                            onChange={(value) => {
                                                const batchjson = getValues('batchjson') || {};
                                                batchjson.date = value;
                                                setValue('batchjson', batchjson);
                                                trigger('batchjson.date');
                                            }}
                                            error={errors?.batchjson?.date?.message}
                                        />
                                    </div>
                                </FormControl>


                                <FormControl className="col-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <div className={classes.title}> {t(langKeys.hour)} </div>
                                        <div className={classes.subtitle}> {t(langKeys.campaign_execution_time)} </div>
                                    </div>
                                    <div style={{ marginTop: 'auto' }}>
                                        <FieldEdit
                                            variant="outlined"
                                            type="time"
                                            className="col-6"
                                            valueDefault={getValues('batchjson.time')}
                                            onChange={(value) => {
                                                const batchjson = getValues('batchjson') || {};
                                                batchjson.time = value;
                                                setValue('batchjson', batchjson);
                                                trigger('batchjson.time');
                                            }}
                                            error={errors?.batchjson?.time?.message}
                                        />
                                    </div>
                                </FormControl>
                            </>
                        }
                        {edit ?
                            <FormControl className={classNameCondition} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '1rem', color: 'black' }}>{t(langKeys.group)}</div>
                                    <div className={classes.subtitle}>{t(langKeys.campaign_group_desc)}</div>
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <FieldSelect
                                        variant="outlined"
                                        className={classNameCondition}
                                        valueDefault={getValues('usergroup')}
                                        onChange={onChangeGroup}
                                        onBlur={() => trigger('usergroup')}
                                        error={errors?.usergroup?.message}
                                        data={dataGroup}
                                        optionDesc="domaindesc"
                                        optionValue="domainvalue"
                                    />
                                </div>
                            </FormControl>
                            :
                            <FieldView
                                label={t(langKeys.group)}
                                value={dataGroup.filter(d => d.domainvalue === row?.usergroup)[0].domaindesc || ""}
                                className={classNameCondition}
                            />
                        }
                    </div>
                       </>
                        :
                        <FieldView
                            label={t(langKeys.executiontype)}
                            value={t(dataExecutionType[row?.executiontype]) || ""}
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
                                onBlur={() => trigger('communicationchannelid')}
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

                    <div className="row-zyx" style={{ display: 'flex', padding:'0rem 1rem 0 0'  }}>
                    {edit ?
                        <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.status)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_status_desc)} </div>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <FieldSelect
                                    variant="outlined"
                                    valueDefault={getValues('status')}
                                    onChange={onChangeStatus}
                                    onBlur={() => trigger('usergroup')}
                                    error={errors?.status?.message}
                                    data={dataStatus}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                            </div>
                        </FormControl>
                        :
                        <FieldView
                            label={t(langKeys.status)}
                            value={dataGroup.filter(d => d.domainvalue === row?.status)[0].domaindesc || ""}
                            className="col-6"
                        />
                    }

                    {edit ?
                        <FormControl className="col-6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '1rem', color: 'black' }}> {t(langKeys.messagetype)} </div>
                                <div className={classes.subtitle}> {t(langKeys.campaign_messagetype_desc)} </div>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
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
                            </div>
                        </FormControl>
                        :
                        <FieldView
                            label={t(langKeys.messagetype)}
                            value={t(filterDataCampaignType().filter(d => d.key === row?.type)[0]?.value) || ""}
                            className="col-6"
                        />
                    }
                </div> 

                {['HSM'].includes(getValues('type')) ?
                    <div className="row-zyx">
                        {edit ?
                            <FormControl className="col-12" >                     
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
                                className="col-12"
                            />
                        }
                       
                    </div>
                    : null}
                {['SMS', 'MAIL', 'HTML'].includes(getValues('type')) ?
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
                    </div>
                    : null}
                </div>
                
                <div style={{width:'50%'}}>
                    <div style={{fontSize:'1.2rem', marginTop:'2.1rem'}}>{t('Previsualización de la Plantilla')}</div> 
                    <TemplatePreview selectedTemplate={selectedTemplate} variableValues={[]}/>

                </div>           
            </div>           
        </React.Fragment>
    )
}