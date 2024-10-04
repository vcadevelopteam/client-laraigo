import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { extractVariables, getCampaignMemberSel, getCampaignSel, getCampaignStart, getCommChannelLst, getMessageTemplateLst, getPropertySelByName, getUserGroupsSel, getValuesFromDomain, insCampaign, insCampaignMember } from 'common/helpers';
import { Dictionary, ICampaign, SelectedColumns } from "@types";
import { execute, getMultiCollection, resetMainAux } from 'store/main/actions';
import { CampaignGeneral } from './campaignDetailTabs/CampaignGeneral';
import { CampaignPerson } from './campaignDetailTabs/CampaignPerson';
import { CampaignMessage } from './campaignDetailTabs/CampaignMessage';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Button, Tabs } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { AntTab, AntTabPanel, AntTabPanelAux, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { DetailProps, FrameProps, useStyles, validateField, TableColumn } from './CDComponents';

export const CampaignDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {

    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeRes = useSelector(state => state.main.execute);

    const [catchPersonTab, setcatchPersonTab] = useState(false);
    const [pageSelected, setPageSelected] = useState<number>(0);
    const [auxData, setAuxData] = useState<Dictionary[]>([]);
    const [detaildata, setDetaildata] = useState<ICampaign>({});
    const [waitView, setWaitView] = useState(false);
    const [save, setSave] = useState('');
    const [campaignMembers, setCampaignMembers] = useState<Dictionary[]>([]);
    const [tablevariable, setTableVariable] = useState<Dictionary[]>([]);
    const [usedTablevariable, setUsedTableVariable] = useState<Dictionary>({});
    const [frameProps, setFrameProps] = useState<FrameProps>({ executeSave: false, page: 0, checkPage: false, valid: { 0: false, 1: false, 2: false } });
    const [messageVariables, setMessageVariables] = useState<Dictionary[]>([]);
    const [dataButtons, setDataButtons] = useState<Dictionary[]>([])
    const [idAux, setIdAux] = useState(0)
    const [templateAux, setTemplateAux] = useState<Dictionary>({})
    const [jsonPersons, setJsonPersons] = useState<Dictionary>({})
    const [detectionChangeSource, setDetectionChangeSource] = useState<boolean>(false);
    const [campaignId, setCampaignId] = useState<number | null>(null);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.campaign) },
        { id: "view-2", name: `${t(langKeys.campaign)} ${t(langKeys.detail)}` }
    ];

    const formatMessage = () => {
        let subject = detaildata.subject || '';
        let header = detaildata.messagetemplateheader?.value || '';
        let message = detaildata.message || '';
        let localtablevariable: string[] = [];
    
        if (['PERSON', 'LEAD'].includes(detaildata.source || '')) {
            if (detaildata.person && detaildata.person.length > 0) {
                if (detaildata.communicationchanneltype?.startsWith('MAI')) {
                    const localmessageVariables = Array.from(new Map(messageVariables.map(d => [d['text'], d])).values());
                    localmessageVariables.filter(mv => tablevariable.map(tv => tv.description).includes(mv.text)).forEach((v, i) => {
                        message = message.replace(new RegExp(`{{${v.text}}}`, 'g'), `{{field${i + 2}}}`);
                    });
                } else {
                    localtablevariable = Array.from(new Set([
                        ...(subject.match(new RegExp(`{{.+?}}`, 'g')) || []),
                        ...(header.match(new RegExp(`{{.+?}}`, 'g')) || []),
                        ...(message.match(new RegExp(`{{.+?}}`, 'g')) || [])
                    ])).map(x => x.slice(2, -2));
    
                    const localTableVariableMap = localtablevariable.reduce((acc, tv, tvi) => ({
                        ...acc,
                        [`field${tvi + 2}`]: tv
                    }), {});
    
                    setUsedTableVariable(localTableVariableMap);
    
                    tablevariable.filter(tv => Object.values(localTableVariableMap).includes(tv.description)).forEach((v, i) => {
                        subject = subject.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                        header = header.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                        message = message.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                    });
                }
            }
        } else if (['EXTERNAL'].includes(detaildata.source || '')) {
            tablevariable.forEach((v, i) => {
                subject = subject.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                header = header.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                message = message.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
            });
        }
        return { subject, header, message };
    };

    const formatMessageGeneric = (message: string) => {
        let modifiedMessage = message;
    
        const splitMessage = message.split('{{');
        messageVariables.forEach((v, i) => {
            splitMessage[i + 1] = splitMessage[i + 1]?.replace(`${v.name}}}`, `${v.text || 'field' + (i + 1)}}}`);
        });
        modifiedMessage = splitMessage.join('{{');
    
        if (['PERSON', 'LEAD'].includes(detaildata.source || '')) {
            if (detaildata.person && detaildata.person.length > 0) {
                const localtablevariable: string[] = (message.match(new RegExp(`{{.+?}}`, 'g')) || []).map(x => x.slice(2, -2));
    
                const localTableVariableMap = localtablevariable.reduce<Record<string, string>>((acc, tv, tvi) => ({
                    ...acc,
                    [`field${tvi + 2}`]: tv
                }), {});
    
                setUsedTableVariable(localTableVariableMap);
    
                tablevariable.forEach((v, i) => {
                    modifiedMessage = modifiedMessage.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                });
            }
        } else if (['EXTERNAL'].includes(detaildata.source || '')) {
            tablevariable.forEach((v, i) => {
                modifiedMessage = modifiedMessage.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
            });
        }
    
        return modifiedMessage;
    };

    const checkValidation = () => {
        if (!frameProps.valid[0]) {
            console.error("Validation failed: required fields are missing in the initial section.");
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.required_fields_missing) }));
        } else if (!frameProps.valid[1]) {
            console.error("Validation failed: missing people in the campaign.");
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.missing_people) }));
        } else {
            let valid = true;

            if (detaildata.messagetemplatetype === 'MULTIMEDIA'
                && (detaildata?.messagetemplateheader?.type || '') !== ''
                && detaildata.messagetemplateheader?.value === '') {
                valid = false;
                console.error("Validation failed: missing header for multimedia message.");
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.missing_header) }));
            }

            const newmessages = formatMessage();
            const localsubject = newmessages.subject || '';
            const localheader = newmessages.header || '';
            const localmessage = newmessages.message || '';
            let elemVariables: string[] = [];
            let errorIndex = null;
            const auxbuttons = detaildata;

            if (auxbuttons?.messagetemplatebuttons) {
                auxbuttons.messagetemplatebuttons.forEach((button: Dictionary) => {
                    if (button.payload) {
                        button.payload = formatMessageGeneric(button.payload);
                    }
                });
            }

            if (detaildata.communicationchanneltype?.startsWith('MAI')) {
                const vars = extractVariables(localsubject);
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
                if (errorIndex !== -1) {
                    valid = false;
                    console.error("Validation failed: missing header variable in email communication channel.");
                    dispatch(showSnackbar({ show: true, severity: "error", message: `${t(langKeys.missing_header)} ${vars[errorIndex]}` }));
                }
                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }

            if (detaildata.messagetemplatetype === 'MULTIMEDIA' && localheader !== '') {
                const vars = extractVariables(localheader);
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
                if (errorIndex !== -1 || localheader.includes('{{}}')) {
                    valid = false;
                    console.error("Validation failed: invalid parameter in multimedia message header.");
                    dispatch(showSnackbar({ show: true, severity: "error", message: `${t(langKeys.invalid_parameter)} ${vars[errorIndex] || '{{}}'}` }));
                }
                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }

            if (localmessage !== '') {
                const vars = extractVariables(localmessage);
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));

                if (errorIndex !== -1 || localmessage.includes('{{}}')) {
                    valid = false;

                    const errorDetail = {
                        localmessage,
                        vars,
                        errorIndex,
                        problematicVariable: vars[errorIndex],
                        tableDescriptions: tablevariable.map(t => t.description),
                    };

                    console.error("Validation Error Details:", errorDetail);
                    const errorMessage = `${t(langKeys.invalid_parameter)} ${vars[errorIndex]}`;
                    dispatch(showSnackbar({ show: true, severity: "error", message: errorMessage }));
                }

                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }

            if (detaildata.executiontype === 'SCHEDULED') {
                const batchjson = Array.isArray(detaildata.batchjson) ? detaildata.batchjson[0] : detaildata.batchjson;
                const { date, time } = batchjson || {};            
                if (!date || !time) {
                    valid = false;
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.required_fields_missing) }));
                }
            }            

            setDetaildata({
                ...detaildata,
                variablereplace: elemVariables,
                batchjson: detaildata.executiontype === 'SCHEDULED' ? detaildata.batchjson : [],
                subject: newmessages.subject,
                messagetemplateheader: { ...detaildata.messagetemplateheader, value: newmessages.header },
                messagetemplatebuttons: auxbuttons.messagetemplatebuttons,
                fields: detaildata.fields,
                carouseljson: detaildata.carouseljson,
                message: newmessages.message,
            });
            setFrameProps({ ...frameProps, valid: { ...frameProps.valid, 2: valid } });
        }
    }

    const buildingMembers = (onlyCheck: boolean = false) => {
        let campaignMemberList: Dictionary[] = [];
        switch (detaildata.source) {
            case 'INTERNAL':
                campaignMemberList = detaildata.person?.reduce((ap, p) => {
                    ap.push({
                        id: p.campaignmemberid,
                        personid: p.personid,
                        personcommunicationchannel: p.personcommunicationchannel,
                        personcommunicationchannelowner: p.personcommunicationchannelowner,
                        type: p.type,
                        displayname: p.displayname,
                        status: p.status,
                        field1: p.field1,
                        field2: p.field2,
                        field3: p.field3,
                        field4: p.field4,
                        field5: p.field5,
                        field6: p.field6,
                        field7: p.field7,
                        field8: p.field8,
                        field9: p.field9,
                        field10: p.field10,
                        field11: p.field11,
                        field12: p.field12,
                        field13: p.field13,
                        field14: p.field14,
                        field15: p.field15,
                        batchindex: 0,
                        operation: detaildata.operation
                    })
                    return ap;
                }, []);
                break;
            case 'EXTERNAL':
                if (detaildata.selectedColumns && detaildata.selectedColumns.primarykey) {
                    const primaryKeyColumn = detaildata.selectedColumns.primarykey;
                    campaignMemberList = detaildata.jsonData?.map((p) => {
                        const columns = Object.keys(p);
                        const otherColumns = columns.filter(col => col !== primaryKeyColumn);
                    
                        return {
                            id: 0,
                            personid: 0,
                            personcommunicationchannel: '',
                            personcommunicationchannelowner: p[primaryKeyColumn] || '',
                            type: 'EXTERNAL',
                            displayname: '',
                            status: 'ACTIVO',
                            field1: p[primaryKeyColumn] || '',
                            field2: p[otherColumns[0]] || '',
                            field3: p[otherColumns[1]] || '',
                            field4: p[otherColumns[2]] || '',
                            field5: p[otherColumns[3]] || '',
                            field6: p[otherColumns[4]] || '',
                            field7: p[otherColumns[5]] || '',
                            field8: p[otherColumns[6]] || '',
                            field9: p[otherColumns[7]] || '',
                            field10: p[otherColumns[8]] || '',
                            field11: p[otherColumns[9]] || '',
                            field12: p[otherColumns[10]] || '',
                            field13: p[otherColumns[11]] || '',
                            field14: p[otherColumns[12]] || '',
                            field15: p[otherColumns[13]] || '',
                            batchindex: 0,
                            operation: detaildata.operation
                        };
                    }) || [];
                }
                break;
            case 'PERSON':
            case 'LEAD':
                if (detaildata.communicationchanneltype?.startsWith('MAI')) {
                    campaignMemberList = detaildata.person?.reduce((ap, p) => {
                        ap.push({
                            id: 0,
                            personid: p.personid || 0,
                            personcommunicationchannel: '',
                            personcommunicationchannelowner: p.email || p.alternativeemail || '',
                            type: detaildata.source || '',
                            displayname: detaildata.source === 'PERSON'
                                ? `${p.firstname || ''} ${p.lastname || ''}`.trim()
                                : detaildata.source === 'LEAD' ? `${p.name || ''}` : '',
                            status: 'ACTIVO',
                            field1: p.email || p.alternativeemail || '',
                            field2: validateField(detaildata.source, p, messageVariables[0]?.text),
                            field3: validateField(detaildata.source, p, messageVariables[1]?.text),
                            field4: validateField(detaildata.source, p, messageVariables[2]?.text),
                            field5: validateField(detaildata.source, p, messageVariables[3]?.text),
                            field6: validateField(detaildata.source, p, messageVariables[4]?.text),
                            field7: validateField(detaildata.source, p, messageVariables[5]?.text),
                            field8: validateField(detaildata.source, p, messageVariables[6]?.text),
                            field9: validateField(detaildata.source, p, messageVariables[7]?.text),
                            field10: validateField(detaildata.source, p, messageVariables[8]?.text),
                            field11: validateField(detaildata.source, p, messageVariables[9]?.text),
                            field12: validateField(detaildata.source, p, messageVariables[10]?.text),
                            field13: validateField(detaildata.source, p, messageVariables[11]?.text),
                            field14: validateField(detaildata.source, p, messageVariables[12]?.text),
                            field15: validateField(detaildata.source, p, messageVariables[13]?.text),
                            batchindex: 0,
                            operation: detaildata.operation
                        })
                        return ap;
                    }, []);
                }
                else {
                    campaignMemberList = detaildata.person?.reduce((ap, p) => {
                        ap.push({
                            id: 0,
                            personid: p.personid || 0,
                            personcommunicationchannel: '',
                            personcommunicationchannelowner: p.phone || p.alternativephone || '',
                            type: detaildata.source || '',
                            displayname: detaildata.source === 'PERSON'
                                ? `${p.firstname || ''} ${p.lastname || ''}`.trim()
                                : detaildata.source === 'LEAD' ? `${p.name || ''}` : '',
                            status: 'ACTIVO',
                            field1: p.phone || p.alternativephone || '',
                            field2: validateField(detaildata.source, p, usedTablevariable['field2']),
                            field3: validateField(detaildata.source, p, usedTablevariable['field3']),
                            field4: validateField(detaildata.source, p, usedTablevariable['field4']),
                            field5: validateField(detaildata.source, p, usedTablevariable['field5']),
                            field6: validateField(detaildata.source, p, usedTablevariable['field6']),
                            field7: validateField(detaildata.source, p, usedTablevariable['field7']),
                            field8: validateField(detaildata.source, p, usedTablevariable['field8']),
                            field9: validateField(detaildata.source, p, usedTablevariable['field9']),
                            field10: validateField(detaildata.source, p, usedTablevariable['field10']),
                            field11: validateField(detaildata.source, p, usedTablevariable['field11']),
                            field12: validateField(detaildata.source, p, usedTablevariable['field12']),
                            field13: validateField(detaildata.source, p, usedTablevariable['field13']),
                            field14: validateField(detaildata.source, p, usedTablevariable['field14']),
                            field15: validateField(detaildata.source, p, usedTablevariable['field15']),
                            batchindex: 0,
                            operation: detaildata.operation
                        })
                        return ap;
                    }, []);
                }
                break;
        }
        if (detaildata.executiontype === 'SCHEDULED') {
            const batchjson = Array.isArray(detaildata.batchjson) ? detaildata.batchjson[0] : detaildata.batchjson ?? {};
            const { date, time, quantity } = batchjson;
            
            if (date && time && quantity) {
                const newBatchjson = [{
                    date,
                    time,
                    quantity,
                    batchindex: 1
                }];
                setDetaildata({
                    ...detaildata,
                    batchjson: newBatchjson,
                });
                campaignMemberList.forEach((cm, j) => {
                    if (j < quantity) {
                        cm.batchindex = 1;
                    }
                });
            }
        }        
        if (!onlyCheck) {
            setCampaignMembers(campaignMemberList);
            setSave('SUBMIT');
        }
        return campaignMemberList;
    }

    const handleStart = (id: number) => {
        dispatch(execute(getCampaignStart(id)));
    };

    const saveCampaign = (data: Dictionary, memberscount: number) => {
        dispatch(execute(insCampaign({ ...data }, memberscount)));
    };

    const saveCampaignMembers = (data: Dictionary, campaignid: number) => {
        const membersData = data.map((x: Dictionary) => insCampaignMember({ ...x, campaignid: campaignid }));
        return dispatch(execute({
            header: null,
            detail: membersData
        }, true));
    };

    const onSubmit = () => {
        const members = buildingMembers(true);
        if (members.length === 0) {
            dispatch(showSnackbar({ show: true, severity: "error", message: "No hay miembros ha insertar." }));
            return;
        }
        const callback = () => {
            dispatch(showBackdrop(true));
            setSave('PARENT');
            saveCampaign(detaildata, members.length);
        };

        let errormessage = false;
        if (detaildata.operation === "UPDATE") {
            if (row?.startdate !== detaildata.startdate) {
                if (Math.abs(Number(new Date(String(detaildata.startdate))) - Number(new Date())) / (1000 * 60 * 60 * 24 * 365) > 1) errormessage = true;
            }
            if (row?.enddate !== detaildata.enddate) {
                if (Math.abs(Number(new Date(String(detaildata.enddate))) - Number(new Date())) / (1000 * 60 * 60 * 24 * 365) > 1) errormessage = true;
            }
        } else {
            if (Math.abs(Number(new Date(String(detaildata.startdate))) - Number(new Date())) / (1000 * 60 * 60 * 24 * 365) > 1) errormessage = true;
            if (Math.abs(Number(new Date(String(detaildata.enddate))) - Number(new Date())) / (1000 * 60 * 60 * 24 * 365) > 1) errormessage = true;
        }

        if (errormessage) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_campaign_date) }));
        } else {
            dispatch(manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback
            }));
        }
    };

    useEffect(() => {
        if (detaildata.source === 'EXTERNAL' && detaildata.jsonData) {
            setJsonPersons(detaildata.jsonData);
            buildingMembers();
        }
    }, [detaildata.jsonData]);

    useEffect(() => {
        if (row !== null) {
            dispatch(getMultiCollection([
                getValuesFromDomain("ESTADOGENERICO"),
                getCommChannelLst(),
                getUserGroupsSel(),
                getMessageTemplateLst(''),
                getCampaignSel(row?.id),
                getCampaignMemberSel(row?.id),
                getPropertySelByName("VALIDACIONCAMPAÑASGRUPO", "VALIDACIONCAMPAÑASGRUPO")
            ]));
            dispatch(showBackdrop(true));
            setWaitView(true);
            return () => {
                dispatch(resetMainAux());
            };
        }
        else {
            dispatch(getMultiCollection([
                getValuesFromDomain("ESTADOGENERICO"),
                getCommChannelLst(),
                getUserGroupsSel(),
                getMessageTemplateLst(''),
                getPropertySelByName("VALIDACIONCAMPAÑASGRUPO", "VALIDACIONCAMPAÑASGRUPO")
            ]));
            setPageSelected(0);
        }
    }, []);

    useEffect(() => {
        if (waitView) {
            if (!mainResult.multiData.loading && !mainResult.multiData.error && row !== null) {
                setAuxData(mainResult.multiData.data[4].data);
                const data = mainResult.multiData.data[4].data[0];
                if (data) {
                    setDetaildata({
                        isnew: false,
                        id: row.id,
                        communicationchannelid: data?.communicationchannelid,
                        usergroup: data?.usergroup,
                        type: data?.type,
                        status: data?.status,
                        title: data?.title,
                        description: data?.description,
                        subject: data?.subject,
                        message: data?.message,
                        startdate: data?.startdate,
                        enddate: data?.enddate,
                        repeatable: data?.repeatable,
                        frecuency: data?.frecuency,
                        source: data?.source || 'INTERNAL',
                        messagetemplateid: data?.messagetemplateid,
                        messagetemplatename: data?.messagetemplatename,
                        messagetemplatenamespace: data?.messagetemplatenamespace,
                        messagetemplatetype: data?.messagetemplatetype,
                        messagetemplateheader: data?.messagetemplateheader || {},
                        messagetemplatebuttons: detaildata.messagetemplatebuttons || [],
                        messagetemplatefooter: data?.messagetemplatefooter || '',
                        messagetemplateattachment: data?.messagetemplateattachment || '',
                        messagetemplatelanguage: data?.messagetemplatelanguage || '',
                        messagetemplatepriority: data?.messagetemplatepriority || '',
                        executiontype: data?.executiontype,
                        batchjson: data?.batchjson || [],
                        fields: { ...new SelectedColumns(), ...data?.fields },
                        operation: 'UPDATE',
                        carouseljson: data?.carouseljson || [],
                        variableshidden: data?.variableshidden || [],
                        person: mainResult.multiData.data[5] && mainResult.multiData.data[5].success ? mainResult.multiData.data[5].data : []
                    });
                    setFrameProps({
                        ...frameProps,
                        valid: {
                            0: Boolean(data),
                            1: (mainResult.multiData.data[5] && mainResult.multiData.data[5].success ? mainResult.multiData.data[5].data : []).length !== 0,
                            2: Boolean(data)
                        }
                    });
                }
                dispatch(showBackdrop(false));
                setWaitView(false);
                setPageSelected(0);
            }
        }
    }, [mainResult, waitView]);

    useEffect(() => {
        if (save === 'VALIDATION') {
            checkValidation();
            setSave('PREPARING');
        }
        if (!Object.values(frameProps.valid).includes(false)) {
            if (save === 'PREPARING') {
                buildingMembers();
            }
            else if (save === 'SUBMIT') {
                onSubmit();
            }
            else if (save === 'PARENT') {
                if (!executeRes.loading && !executeRes.error) {
                    setSave('MEMBERS');
                    saveCampaignMembers(campaignMembers, executeRes.data[0]?.p_campaignid);
                    setCampaignId(executeRes.data[0]?.p_campaignid);
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setSave('');
                }
            }
            else if (save === 'MEMBERS') {
                if (!executeRes.loading && !executeRes.error) {
                    setTimeout(() => {
                        dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }));
                        dispatch(showBackdrop(false));
                        fetchData();
                        setViewSelected("view-1");
                    }, 1000);

                    if (detaildata.executiontype === "SCHEDULED" && campaignId !== null) {
                        handleStart(campaignId);
                        setCampaignId(null);
                    }
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setSave('');
                }
            }
        }
    }, [save, executeRes]);  

    useEffect(() => {
        if (pageSelected === 2) {
            switch (detaildata.source) {
                case 'INTERNAL':
                    setTableVariable([
                        { label: t(langKeys.name), description: "displayname", persistent: true },
                        { label: "PCC", description: "personcommunicationchannelowner", persistent: true },
                        { label: t(langKeys.type), description: "type", persistent: true },
                        { label: t(langKeys.status), description: "status", persistent: true },
                        { label: `${t(langKeys.field)} 1`, description: "field1", persistent: true },
                        { label: `${t(langKeys.field)} 2`, description: "field2", persistent: true },
                        { label: `${t(langKeys.field)} 3`, description: "field3", persistent: true },
                        { label: `${t(langKeys.field)} 4`, description: "field4", persistent: true },
                        { label: `${t(langKeys.field)} 5`, description: "field5", persistent: true },
                        { label: `${t(langKeys.field)} 6`, description: "field6", persistent: true },
                        { label: `${t(langKeys.field)} 7`, description: "field7", persistent: true },
                        { label: `${t(langKeys.field)} 8`, description: "field8", persistent: true },
                        { label: `${t(langKeys.field)} 9`, description: "field9", persistent: true },
                        { label: `${t(langKeys.field)} 10`, description: "field10", persistent: true },
                        { label: `${t(langKeys.field)} 11`, description: "field11", persistent: true },
                        { label: `${t(langKeys.field)} 12`, description: "field12", persistent: true },
                        { label: `${t(langKeys.field)} 13`, description: "field13", persistent: true },
                        { label: `${t(langKeys.field)} 14`, description: "field14", persistent: true },
                        { label: `${t(langKeys.field)} 15`, description: "field15", persistent: true },
                    ]);
                    break;
                case 'EXTERNAL':
                    if (detaildata.selectedColumns) {
                        setTableVariable(detaildata.selectedColumns.columns.reduce((ac: TableColumn[], c: string) => {
                            ac.push({ label: c, description: c, persistent: false });
                            return ac;
                        }, [{ label: detaildata.selectedColumns.primarykey, description: detaildata.selectedColumns.primarykey, persistent: false }]));
                    }
                    break;                    
                case 'PERSON':
                    setTableVariable([
                        { label: t(langKeys.firstname), description: 'firstname', persistent: false },
                        { label: t(langKeys.lastname), description: 'lastname', persistent: false },
                        { label: t(langKeys.documenttype), description: 'documenttype', persistent: false },
                        { label: t(langKeys.documentnumber), description: 'documentnumber', persistent: false },
                        { label: t(langKeys.personType), description: 'persontype', persistent: false },
                        { label: t(langKeys.type), description: 'type', persistent: false },
                        { label: t(langKeys.phone), description: 'phone', persistent: false },
                        { label: t(langKeys.alternativePhone), description: 'alternativephone', persistent: false },
                        { label: t(langKeys.email), description: 'email', persistent: false },
                        { label: t(langKeys.alternativeEmail), description: 'alternativeemail', persistent: false },
                        { label: t(langKeys.lastContactDate), description: 'lastcontact', persistent: false },
                        { label: t(langKeys.agent), description: 'agent', persistent: false },
                        { label: t(langKeys.opportunity), description: 'opportunity', persistent: false },
                        { label: t(langKeys.birthday), description: 'birthday', persistent: false },
                        { label: t(langKeys.gender), description: 'gender', persistent: false },
                        { label: t(langKeys.educationLevel), description: 'educationlevel', persistent: false },
                        { label: t(langKeys.comments), description: 'comments', persistent: false },
                    ]);
                    break;
                case 'LEAD':
                    setTableVariable([
                        { label: t(langKeys.opportunity), description: 'opportunity', persistent: false },
                        { label: t(langKeys.lastUpdate), description: 'changedate', persistent: false },
                        { label: t(langKeys.name), description: 'name', persistent: false },
                        { label: t(langKeys.email), description: 'email', persistent: false },
                        { label: t(langKeys.phone), description: 'phone', persistent: false },
                        { label: t(langKeys.expected_revenue), description: 'expected_revenue', persistent: false },
                        { label: t(langKeys.endDate), description: 'date_deadline', persistent: false },
                        { label: t(langKeys.tags), description: 'tags', persistent: false },
                        { label: t(langKeys.agent), description: 'agent', persistent: false },
                        { label: t(langKeys.priority), description: 'priority', persistent: false },
                        { label: t(langKeys.campaign), description: 'campaign', persistent: false },
                        { label: t(langKeys.product_plural), description: 'products', persistent: false },
                        { label: t(langKeys.phase), description: 'phase', persistent: false },
                        { label: t(langKeys.comments), description: 'comments', persistent: false },
                    ]);
                    break;
            }
        } else if (pageSelected === 1) {
            setcatchPersonTab(true)
        }
    }, [pageSelected]);

    return (
        <div style={{ width: '100%' }}>
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
                            disabled={!frameProps.valid[0] || !frameProps.valid[1]}
                            onClick={() => {
                                setFrameProps({ ...frameProps, executeSave: true, checkPage: true });
                            }}
                        >{t(langKeys.save)}
                        </Button>
                    }
                </div>
            </div>

            <Tabs
                value={pageSelected}
                indicatorColor="primary"
                variant="fullWidth"
                style={{ borderBottom: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                textColor="primary"
                onChange={(_, value) => setFrameProps({ ...frameProps, page: value, checkPage: true })}
            >
                <AntTab label={t(langKeys.generalinformation)} />
                <AntTab label={t(langKeys.person_plural)} />
                <AntTab label={t(langKeys.message)} />
            </Tabs>
            <AntTabPanel currentIndex={0} index={pageSelected}>
                <CampaignGeneral
                    row={row}
                    edit={edit}
                    auxdata={auxData}
                    detaildata={detaildata}
                    setDetaildata={setDetaildata}
                    multiData={mainResult.multiData.data}
                    fetchData={fetchData}
                    frameProps={frameProps}
                    setFrameProps={setFrameProps}
                    setPageSelected={setPageSelected}
                    setSave={setSave}
                    setIdAux={setIdAux}
                    setTemplateAux={setTemplateAux}
                    setDetectionChangeSource={setDetectionChangeSource}
                />
            </AntTabPanel>
            {catchPersonTab && (
                <AntTabPanelAux currentIndex={1} index={pageSelected}>
                    <CampaignPerson
                        row={row}
                        edit={edit}
                        auxdata={auxData}
                        detaildata={detaildata}
                        setDetaildata={setDetaildata}
                        multiData={mainResult.multiData.data}
                        fetchData={fetchData}
                        frameProps={frameProps}
                        setFrameProps={setFrameProps}
                        setPageSelected={setPageSelected}
                        setSave={setSave}
                        idAux={idAux}
                        templateAux={templateAux}
                        setJsonPersons={setJsonPersons}
                        detectionChangeSource={detectionChangeSource}
                    />
                </AntTabPanelAux>
            )}
            <AntTabPanel currentIndex={2} index={pageSelected}>
                <CampaignMessage
                    row={row}
                    edit={edit}
                    auxdata={auxData}
                    detaildata={detaildata}
                    setDetaildata={setDetaildata}
                    multiData={mainResult.multiData.data}
                    fetchData={fetchData}
                    tablevariable={tablevariable}
                    frameProps={frameProps}
                    setFrameProps={setFrameProps}
                    setPageSelected={setPageSelected}
                    setSave={setSave}
                    messageVariables={messageVariables}
                    setMessageVariables={setMessageVariables}
                    dataButtons={dataButtons}
                    setDataButtons={setDataButtons}
                    templateAux={templateAux}
                    jsonPersons={jsonPersons}
                    detectionChangeSource={detectionChangeSource}
                />
            </AntTabPanel>
        </div>
    )
}