/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { extractVariables, getCampaignMemberSel, getCampaignSel, getCommChannelLst, getMessageTemplateLst, getUserGroupsSel, getValuesFromDomain, insCampaign, insCampaignMember } from 'common/helpers';
import { Dictionary, ICampaign, SelectedColumns } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { execute, getMultiCollection, resetMainAux } from 'store/main/actions';
import { CampaignGeneral, CampaignPerson, CampaignMessage } from 'pages';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Button, Tabs } from '@material-ui/core';
import { langKeys } from 'lang/keys';
import { AntTab, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void
}

export interface FrameProps {
    page: number,
    checkPage: boolean,
    valid: Dictionary;
    executeSave: boolean,
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
    flexgrow1: {
        flexGrow: 1
    }
}));

export const CampaignDetail: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const [pageSelected, setPageSelected] = useState<number>(0);
    const [auxData, setAuxData] = useState<Dictionary[]>([]);
    const [detaildata, setDetaildata] = useState<ICampaign>({});
    const [waitView, setWaitView] = useState(false);

    const executeRes = useSelector(state => state.main.execute);
    const [save, setSave] = useState('');
    const [campaignMembers, setCampaignMembers] = useState<any[]>([]);

    const [tablevariable, setTableVariable] = useState<any[]>([]);
    const [usedTablevariable, setUsedTableVariable] = useState<any>({});

    const [frameProps, setFrameProps] = useState<FrameProps>({ executeSave: false, page: 0, checkPage: false, valid: { 0: false, 1: false, 2: false } });

    const [messageVariables, setMessageVariables] = useState<any[]>([]);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.campaign) },
        { id: "view-2", name: `${t(langKeys.campaign)} ${t(langKeys.detail)}` }
    ];

    useEffect(() => {
        if (row !== null) {
            dispatch(getMultiCollection([
                getValuesFromDomain("ESTADOGENERICO"),
                getCommChannelLst(),
                getUserGroupsSel(),
                getMessageTemplateLst(''),
                getCampaignSel(row?.id),
                getCampaignMemberSel(row?.id)
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
                        messagetemplatebuttons: data?.messagetemplatebuttons || [],
                        messagetemplatefooter: data?.messagetemplatefooter || '',
                        messagetemplateattachment: data?.messagetemplateattachment || '',
                        messagetemplatelanguage: data?.messagetemplatelanguage || '',
                        messagetemplatepriority: data?.messagetemplatepriority || '',
                        executiontype: data?.executiontype,
                        batchjson: data?.batchjson || [],
                        fields: { ...new SelectedColumns(), ...data?.fields },
                        operation: 'UPDATE',
                        person: mainResult.multiData.data[5] && mainResult.multiData.data[5].success ? mainResult.multiData.data[5].data : []
                    });
                    setFrameProps({
                        ...frameProps,
                        valid: {
                            0: !!data,
                            1: (mainResult.multiData.data[5] && mainResult.multiData.data[5].success ? mainResult.multiData.data[5].data : []).length !== 0,
                            2: !!data
                        }
                    });
                }
                dispatch(showBackdrop(false));
                setWaitView(false);
                setPageSelected(0);
            }
        }
    }, [mainResult, waitView]);

    const formatMessage = () => {
        let subject = detaildata.subject || '';
        let header = detaildata.messagetemplateheader?.value || '';
        let message = detaildata.message || '';
        if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
            if (detaildata.person && detaildata.person?.length > 0) {
                let localtablevariable = Array.from(new Set([
                    ...(subject.match(new RegExp(`{{.+?}}`, 'g')) || []),
                    ...(header.match(new RegExp(`{{.+?}}`, 'g')) || []),
                    ...(message.match(new RegExp(`{{.+?}}`, 'g')) || [])
                ]));
                localtablevariable = localtablevariable.map(x => x.slice(2,-2));
                if (Object.keys(usedTablevariable).length > 0) {
                    Object.values(usedTablevariable).forEach((v: any, i: number) => {
                        subject = subject.replace(new RegExp(`{{field${i + 2}}}`, 'g'), `{{${v}}}`);
                        header = header.replace(new RegExp(`{{field${i + 2}}}`, 'g'), `{{${v}}}`);
                        message = message.replace(new RegExp(`{{field${i + 2}}}`, 'g'), `{{${v}}}`);
                    });
                    localtablevariable = localtablevariable.map(x => usedTablevariable[x] ? usedTablevariable[x] : x)
                }
                localtablevariable = localtablevariable.reduce((actv, tv, tvi) => ({
                    ...actv,
                    [`field${tvi + 2}`]: tv
                }), {});
                setUsedTableVariable(localtablevariable);
                tablevariable.filter(tv => Object.values(localtablevariable).includes(tv.description)).forEach((v: any, i: number) => {
                    subject = subject.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                    header = header.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                    message = message.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 2}}}`);
                });
            }
        }
        else if (detaildata.operation === 'INSERT' || detaildata.source === 'EXTERNAL') {
            tablevariable.forEach((v: any, i: number) => {
                subject = subject.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                header = header.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                message = message.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
            });
        }
        return { subject, header, message }
    }

    const checkValidation = () => {
        if (!frameProps.valid[0]) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.required_fields_missing) }));
        }
        else if (!frameProps.valid[1]) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.missing_people) }));
        }
        else {
            let valid = true;
            if (detaildata.messagetemplatetype === 'MULTIMEDIA'
                && (detaildata?.messagetemplateheader?.type || '') !== ''
                && detaildata.messagetemplateheader?.value === '') {
                valid = false;
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.missing_header) }));
            }
            let elemVariables: string[] = [];
            let errorIndex = null;

            if (detaildata.communicationchanneltype?.startsWith('MAI')) {
                let vars = extractVariables(detaildata.subject || '');
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
                if (errorIndex !== -1) {
                    valid = false;
                    dispatch(showSnackbar({ show: true, severity: "error", message: `${t(langKeys.missing_header)} ${vars[errorIndex]}` }));
                }
                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }
            if (detaildata.messagetemplatetype === 'MULTIMEDIA' && (detaildata.messagetemplateheader?.value || '') !== '') {
                let vars = extractVariables(detaildata.messagetemplateheader?.value || '');
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
                if (errorIndex !== -1 || (detaildata.messagetemplateheader?.value || '').includes('{{}}')) {
                    valid = false;
                    dispatch(showSnackbar({ show: true, severity: "error", message: `${t(langKeys.invalid_parameter)} ${vars[errorIndex] || '{{}}'}` }));
                }
                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }
            if ((detaildata.message || '') !== '') {
                if (detaildata.communicationchanneltype?.startsWith('MAI')) {
                    let splitMessage = (detaildata.message || '').split('{{');
                    messageVariables.forEach((v, i) => {
                        splitMessage[i + 1] = splitMessage[i + 1]?.replace(`${v.name}}}`, `${v.text}}}`);
                    });
                    detaildata.message = splitMessage.join('{{');
                }
                let vars = extractVariables(detaildata.message || '')
                errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
                if (errorIndex !== -1 || (detaildata.message || '').includes('{{}}')) {
                    valid = false;
                    dispatch(showSnackbar({ show: true, severity: "error", message: `${t(langKeys.invalid_parameter)} ${vars[errorIndex] || '{{}}'}` }));
                }
                elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
            }
            setFrameProps({ ...frameProps, valid: { ...frameProps.valid, 2: valid } });
            if (valid) {
                let newmessages = formatMessage();
                setDetaildata({
                    ...detaildata,
                    variablereplace: elemVariables,
                    batchjson: detaildata.executiontype === 'SCHEDULED' ? detaildata.batchjson : [],
                    subject: newmessages.subject,
                    messagetemplateheader: { ...detaildata.messagetemplateheader, value: newmessages.header },
                    message: newmessages.message,
                });
            }
        }
    }

    const buildingMembers = () => {
        let campaignMemberList: any[] = [];
        if (detaildata.source === 'EXTERNAL') {
            campaignMemberList = detaildata.person?.reduce((ap, p) => {
                ap.push({
                    id: 0,
                    personid: 0,
                    personcommunicationchannel: '',
                    personcommunicationchannelowner: p[Object.keys(p)[0]] || '',
                    type: '',
                    displayname: '',
                    status: 'ACTIVO',
                    field1: p[Object.keys(p)[0]] || '',
                    field2: p[Object.keys(p)[1]] || '',
                    field3: p[Object.keys(p)[2]] || '',
                    field4: p[Object.keys(p)[3]] || '',
                    field5: p[Object.keys(p)[4]] || '',
                    field6: p[Object.keys(p)[5]] || '',
                    field7: p[Object.keys(p)[6]] || '',
                    field8: p[Object.keys(p)[7]] || '',
                    field9: p[Object.keys(p)[8]] || '',
                    field10: p[Object.keys(p)[9]] || '',
                    field11: p[Object.keys(p)[10]] || '',
                    field12: p[Object.keys(p)[11]] || '',
                    field13: p[Object.keys(p)[12]] || '',
                    field14: p[Object.keys(p)[13]] || '',
                    field15: p[Object.keys(p)[14]] || '',
                    batchindex: 0,
                    operation: detaildata.operation
                })
                return ap;
            }, []);
        }
        else if (detaildata.source === 'INTERNAL') {
            if (detaildata.operation === 'INSERT') {
                campaignMemberList = detaildata.person?.reduce((ap, p) => {
                    ap.push({
                        id: 0,
                        personid: p.personid || 0,
                        personcommunicationchannel: p.personcommunicationchannel || '',
                        personcommunicationchannelowner: p.personcommunicationchannelowner || '',
                        type: p.type || '',
                        displayname: p.name || '',
                        status: 'ACTIVO',
                        field1: detaildata.communicationchanneltype?.startsWith('MAI') ? p.email : p.phone,
                        field2: p[usedTablevariable['field2']] || '',
                        field3: p[usedTablevariable['field3']] || '',
                        field4: p[usedTablevariable['field4']] || '',
                        field5: p[usedTablevariable['field5']] || '',
                        field6: p[usedTablevariable['field6']] || '',
                        field7: p[usedTablevariable['field7']] || '',
                        field8: p[usedTablevariable['field8']] || '',
                        field9: p[usedTablevariable['field9']] || '',
                        field10: p[usedTablevariable['field10']] || '',
                        field11: p[usedTablevariable['field11']] || '',
                        field12: p[usedTablevariable['field12']] || '',
                        field13: p[usedTablevariable['field13']] || '',
                        field14: p[usedTablevariable['field14']] || '',
                        field15: p[usedTablevariable['field15']] || '',
                        batchindex: 0,
                        operation: detaildata.operation
                    })
                    return ap;
                }, []);
            }
            else if (detaildata.operation === 'UPDATE') {
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
            }
        }
        if (detaildata.executiontype === 'SCHEDULED') {
            let batchjsontemp = [...(detaildata.batchjson || [])];
            batchjsontemp = batchjsontemp.map((d: any, i: number) => ({ ...d, batchindex: i + 1 }));
            setDetaildata({
                ...detaildata,
                batchjson: batchjsontemp,
            });
            batchjsontemp.reduce((bda, bdc, i) => {
                campaignMemberList.filter((cm, j) => j >= bda && j < bda + parseInt(bdc.quantity)).map(cm => cm.batchindex = bdc.batchindex);
                return bda + parseInt(bdc.quantity);
            }, 0);
        }
        setCampaignMembers(campaignMemberList);
        setSave('SUBMIT');
    }

    const saveCampaign = (data: any) => dispatch(execute(insCampaign(data)));
    const saveCampaignMembers = (data: any, campaignid: number) => dispatch(execute({
        header: null,
        detail: [...data.map((x: any) => insCampaignMember({ ...x, campaignid: campaignid }))]
    }, true));

    const onSubmit = () => {
        const callback = () => {
            dispatch(showBackdrop(true));
            setSave('PARENT');
            saveCampaign(detaildata);
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    };

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
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                    dispatch(showBackdrop(false));
                    setSave('');
                }

            }
            else if (save === 'MEMBERS') {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                    dispatch(showBackdrop(false));
                    setSave('');
                }
            }
        }
    }, [save, executeRes])

    useEffect(() => {
        if (pageSelected === 2) {
            if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
                setTableVariable([
                    { label: t(langKeys.firstname), description: 'firstname', persistent: false },
                    { label: t(langKeys.lastname), description: 'lastname', persistent: false },
                    { label: t(langKeys.documenttype), description: 'documenttype', persistent: false },
                    { label: t(langKeys.documentnumber), description: 'documentnumber', persistent: false },
                    { label: t(langKeys.personType), description: 'persontype', persistent: false },
                    { label: t(langKeys.phone), description: 'phone', persistent: false },
                    { label: t(langKeys.alternativePhone), description: 'alternativephone', persistent: false },
                    { label: t(langKeys.email), description: 'email', persistent: false },
                    { label: t(langKeys.alternativeEmail), description: 'alternativeemail', persistent: false },
                    { label: t(langKeys.birthday), description: 'birthday', persistent: false },
                    { label: t(langKeys.gender), description: 'genderdesc', persistent: false },
                    { label: t(langKeys.educationLevel), description: 'educationleveldesc', persistent: false },
                    { label: t(langKeys.civilStatus), description: 'civilstatusdesc', persistent: false },
                    { label: t(langKeys.occupation), description: 'occupationdesc', persistent: false },
                    { label: t(langKeys.observation), description: 'observation', persistent: false },
                ]);
            }
            else if (detaildata.source === 'EXTERNAL') {
                setTableVariable(detaildata.selectedColumns?.columns.reduce((ac: any, c: string) => {
                    ac.push({ label: c, description: c, persistent: false })
                    return ac;
                }, [{ description: detaildata.selectedColumns.primarykey, persistent: false }]));
            }
            else {
                setTableVariable([
                    { label: "corpid", description: "corpid", persistent: true },
                    { label: "orgid", description: "orgid", persistent: true },
                    { label: "campaignmemberid", description: "campaignmemberid", persistent: true },
                    { label: "campaignid", description: "campaignid", persistent: true },
                    { label: "personid", description: "personid", persistent: true },
                    { label: "status", description: "status", persistent: true },
                    { label: "globalid", description: "globalid", persistent: true },
                    { label: "personcommunicationchannel", description: "personcommunicationchannel", persistent: true },
                    { label: "type", description: "type", persistent: true },
                    { label: "displayname", description: "displayname", persistent: true },
                    { label: "personcommunicationchannelowner", description: "personcommunicationchannelowner", persistent: true },
                    { label: "field1", description: "field1", persistent: true },
                    { label: "field2", description: "field2", persistent: true },
                    { label: "field3", description: "field3", persistent: true },
                    { label: "field4", description: "field4", persistent: true },
                    { label: "field5", description: "field5", persistent: true },
                    { label: "field6", description: "field6", persistent: true },
                    { label: "field7", description: "field7", persistent: true },
                    { label: "field8", description: "field8", persistent: true },
                    { label: "field9", description: "field9", persistent: true },
                    { label: "field10", description: "field10", persistent: true },
                    { label: "field11", description: "field11", persistent: true },
                    { label: "field12", description: "field12", persistent: true },
                    { label: "field13", description: "field13", persistent: true },
                    { label: "field14", description: "field14", persistent: true },
                    { label: "field15", description: "field15", persistent: true },
                    { label: "resultfromsend", description: "resultfromsend", persistent: true },
                    { label: "batchindex", description: "batchindex", persistent: true }
                ]);
            }
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
            {pageSelected === 0 ?
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
                />
                : null}
            {pageSelected === 1 ?
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
                />
                : null}
            {pageSelected === 2 ?
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
                />
                : null}
        </div>
    )
}