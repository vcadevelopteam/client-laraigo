/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
// import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { FieldEdit, FieldEditWithSelect, TemplateBreadcrumbs, TitleDetail } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { extractVariables, filterPipe, insCampaign, insCampaignMember } from 'common/helpers';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { useSelector } from 'hooks';


interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetailData: (data: ICampaign) => void;
    setViewSelected: (view: string) => void;
    step: string,
    setStep: (step: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
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

class VariableHandler {
    show: boolean;
    item: any;
    inputkey: string;
    inputvalue: string;
    range: number[];
    top: number;
    left: number;
    changer: ({...param}) => any;
    constructor() {
        this.show = false;
        this.item = null;
        this.inputkey = '';
        this.inputvalue = '';
        this.range = [-1, -1];
        this.changer = ({...param}) => null;
        this.top = 0;
        this.left = 0;
    }
}

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetailData, setViewSelected, step, setStep, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeRes = useSelector(state => state.main.execute);

    const [save, setSave] = useState('');
    const [tablevariable, setTableVariable] = useState<any[]>([]);
    const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);

    const [campaignMembers, setCampaignMembers] = useState<any[]>([]);
    const [valid, setValid] = useState(true);

    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());

    useEffect(() => {
        if (detaildata.operation === 'INSERT' && detaildata.source === 'INTERNAL') {
            setTableVariable([
                {description: "personcommunicationchannelowner", persistent: false },
                {description: "name", persistent: false },
                {description: "personcommunicationchannel", persistent: false },
                {description: "type", persistent: false },
                {description: "phone", persistent: false },
                {description: "email", persistent: false },
            ]);
        }
        else if (detaildata.source === 'EXTERNAL') {
            setTableVariable(detaildata.selectedColumns?.columns.reduce((ac: any, c: string) => {
                ac.push({description: c, persistent: false})
                return ac;
            }, [{description: detaildata.selectedColumns.primarykey, persistent: false}]));
        }
        else {
            setTableVariable([
                {description:"corpid", persistent:true}, 
                {description:"orgid", persistent:true}, 
                {description:"campaignmemberid", persistent:true}, 
                {description:"campaignid", persistent:true}, 
                {description:"personid", persistent:true}, 
                {description:"status", persistent:true}, 
                {description:"globalid", persistent:true}, 
                {description:"personcommunicationchannel", persistent:true}, 
                {description:"type", persistent:true}, 
                {description:"displayname", persistent:true}, 
                {description:"personcommunicationchannelowner", persistent:true}, 
                {description:"field1", persistent:true}, 
                {description:"field2", persistent:true}, 
                {description:"field3", persistent:true}, 
                {description:"field4", persistent:true}, 
                {description:"field5", persistent:true}, 
                {description:"field6", persistent:true}, 
                {description:"field7", persistent:true}, 
                {description:"field8", persistent:true}, 
                {description:"field9", persistent:true}, 
                {description:"field10", persistent:true}, 
                {description:"field11", persistent:true}, 
                {description:"field12", persistent:true}, 
                {description:"field13", persistent:true}, 
                {description:"field14", persistent:true}, 
                {description:"field15", persistent:true}, 
                {description:"resultfromsend", persistent:true}, 
                {description:"batchindex", persistent:true}
            ]);
        }
    }, [step]);

    const toggleVariableSelect = (e: React.ChangeEvent<any>, item: any, inputkey: string, changefunc: ({...param}) => void, filter = true) => {
        let elem = e.target;
        if (elem) {
            let selectionStart = elem.selectionStart || 0;
            let lines = (elem.value || '').substr(0, selectionStart).split('\n');
            let row = lines.length - 1;
            let column = lines[row].length * 3;
            let startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
            let partialText = '';
            if (startIndex !== -1) {
                if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1) {
                    partialText = elem.value.slice(startIndex + 2, selectionStart);
                    let rightText = (elem.value || '').slice(selectionStart, elem.value.length);
                    let selectionEnd = rightText.indexOf('}}') !== -1 ? rightText.indexOf('}}') : 0;
                    let endIndex = startIndex + partialText.length + selectionEnd + 4;
                    setVariableHandler({
                        show: true,
                        item: item,
                        inputkey: inputkey,
                        inputvalue: elem.value,
                        range: [startIndex, endIndex],
                        changer: ({...param}) => changefunc({...param}),
                        top: 24 + row * 21,
                        left: column
                    })
                    if (filter) {
                        setTableVariableShow(filterPipe(tablevariable, 'description', partialText, '%'));
                    }
                    else {
                        setTableVariableShow(tablevariable);
                    }
                }
                else {
                    setVariableHandler(new VariableHandler());
                }
            }
            else {
                setVariableHandler(new VariableHandler());
            }
        }
    }
    
    const selectionVariableSelect = (e: React.ChangeEvent<any>, value: string) => {
        const {item, inputkey, inputvalue, range, changer} = variableHandler;
        if (range[1] !== -1 && (range[1] > range[0] || range[0] !== -1)) {
            changer({
                ...item,
                [inputkey]: inputvalue.substring(0, range[0] + 2)
                + value
                + (inputvalue[range[1] - 2] !== '}' ? '}}' : '')
                + inputvalue.substring(range[1] - 2)
            });
            setVariableHandler(new VariableHandler());
        }
    }

    const formatMessage = () => {
        let subject = detaildata.subject || '';
        let header = detaildata.messagetemplateheader?.value || '';
        let message = detaildata.message || '';
        if (detaildata.operation === 'INSERT' || detaildata.source === 'EXTERNAL') {
            tablevariable.forEach((v: any, i: number) => {
                subject = subject.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                header = header.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
                message = message.replace(new RegExp(`{{${v.description}}}`, 'g'), `{{field${i + 1}}}`);
            });
        }
        return { subject, header, message }
    }

    const checkValidation = () => {
        let valid = true;
        if (detaildata.messagetemplatetype === 'MULTIMEDIA'
        && (detaildata?.messagetemplateheader?.type || '') !== ''
        && detaildata.messagetemplateheader?.value === '') {
            valid = false;
            dispatch(showSnackbar({ show: true, success: false, message: t(langKeys.missing_header)}));
        }
        let elemVariables: string[] = [];
        let errorIndex = null;
        if (detaildata.communicationchanneltype === 'MAIL') {
            let vars = extractVariables(detaildata.subject || '');
            errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
            if (errorIndex !== -1) {
                valid = false;
                dispatch(showSnackbar({ show: true, success: false, message: `${t(langKeys.missing_header)} ${vars[errorIndex]}` }));
            }
            elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
        }
        if (detaildata.messagetemplatetype === 'MULTIMEDIA' && (detaildata.messagetemplateheader?.value || '') !== '') {
            let vars = extractVariables(detaildata.messagetemplateheader?.value || '')
            errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
            if (errorIndex !== -1) {
                valid = false;
                dispatch(showSnackbar({ show: true, success: false, message: `${t(langKeys.invalid_parameter)} ${vars[errorIndex]}` }));
            }
            elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
        }
        if ((detaildata.message || '') !== '') {
            let vars = extractVariables(detaildata.message || '')
            errorIndex = vars.findIndex(v => !(v.includes('field') || tablevariable.map(t => t.description).includes(v)));
            if (errorIndex !== -1) {
                valid = false;
                dispatch(showSnackbar({ show: true, success: false, message: `${t(langKeys.invalid_parameter)} ${vars[errorIndex]}` }));
            }
            elemVariables = Array.from(new Set([...elemVariables, ...(vars || [])]));
        }
        setValid(valid);
        if (valid) {
            let newmessages = formatMessage();
            setDetailData({
                ...detaildata,
                variablereplace: elemVariables,
                batchjson: detaildata.executiontype === 'SCHEDULED' ? detaildata.batchjson : [],
                subject: newmessages.subject,
                messagetemplateheader: {...detaildata.messagetemplateheader, value: newmessages.header},
                message: newmessages.message,
            });
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
                        field1: p[tablevariable[0]] || '',
                        field2: p[tablevariable[1]] || '',
                        field3: p[tablevariable[2]] || '',
                        field4: p[tablevariable[3]] || '',
                        field5: p[tablevariable[4]] || '',
                        field6: p[tablevariable[5]] || '',
                        field7: '',
                        field8: '',
                        field9: '',
                        field10: '',
                        field11: '',
                        field12: '',
                        field13: '',
                        field14: '',
                        field15: '',
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
            detaildata.batchjson?.reduce((bda, bdc, i) => {
                campaignMemberList.filter((cm, j) => j >= bda && j < bda + parseInt(bdc.quantity)).map(cm => cm.batchindex = i);
                return bda + parseInt(bdc.quantity);
            }, 0);
        }
        setCampaignMembers(campaignMemberList);
        setSave('SUBMIT');
    }

    const saveCampaign = (data: any) => dispatch(execute(insCampaign(data)));
    const saveCampaignMembers = (data: any, campaignid: number) => dispatch(execute({
        header: null,
        detail: [...data.map((x: any) => insCampaignMember({...x, campaignid: campaignid }))]
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
        if (valid) {
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
                    dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                    dispatch(showBackdrop(false));
                    setSave('');
                }
    
            }
            else if (save === 'MEMBERS') {
                if (!executeRes.loading && !executeRes.error) {
                    dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1");
                } else if (executeRes.error) {
                    const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.campaign).toLocaleLowerCase() })
                    dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                    dispatch(showBackdrop(false));
                    setSave('');
                }
            }
        }
    }, [save, executeRes])

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
                            style={{ backgroundColor: "#53a6fa" }}
                            onClick={() => setStep("step-2")}
                        >{t(langKeys.back)}
                        </Button>
                    }
                    {edit &&
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="button"
                            style={{ backgroundColor: "#55BD84" }}
                            onClick={() => {
                                setSave('VALIDATION')
                            }}
                        >{t(langKeys.save)}
                        </Button>
                    }
                </div>
            </div>
            <div className={classes.containerDetail}>
                {detaildata.communicationchanneltype === 'MAIL' ?
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.title)}
                        className="col-12"
                        valueDefault={detaildata.subject}
                        onChange={(value) => setDetailData({...detaildata, subject: value})}
                    />
                </div> : null}
                {(detaildata.messagetemplatetype === 'MULTIMEDIA'
                && (detaildata?.messagetemplateheader?.type || '') !== '') ?
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.header)}
                        className="col-12"
                        valueDefault={detaildata.messagetemplateheader?.value}
                        onChange={(value) => setDetailData({
                            ...detaildata, 
                            messagetemplateheader: {...detaildata.messagetemplateheader, value: value}
                        })}
                        inputProps={{
                            readOnly: detaildata.messagetemplateid !== 0
                        }}
                    />
                </div> : null}
                <div className="row-zyx">
                    <FieldEditWithSelect
                        label={t(langKeys.message)}
                        className="col-12"
                        rows={10}
                        valueDefault={detaildata.message}
                        onChange={(value) => setDetailData({...detaildata, message: value})}
                        inputProps={{
                            readOnly: ['HSM','SMS'].includes(detaildata.type || '') && detaildata.messagetemplateid !== 0,
                            onClick: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetailData, detaildata.type === 'TEXTO'),
                            onInput: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetailData, detaildata.type === 'TEXTO'),
                        }}
                        show={variableHandler.show}
                        data={tablevariableShow}
                        datakey="description"
                        top={variableHandler.top}
                        left={variableHandler.left}
                        onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                        onClickAway={(variableHandler) => setVariableHandler({...variableHandler, show: false})}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}