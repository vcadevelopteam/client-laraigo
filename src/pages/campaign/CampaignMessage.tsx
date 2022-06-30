/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { FieldEdit, FieldEditWithSelect, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { Box } from '@material-ui/core';

interface DetailProps {
    row: Dictionary | null,
    edit: boolean,
    auxdata: Dictionary;
    detaildata: ICampaign;
    setDetaildata: (data: ICampaign) => void;
    multiData: MultiData[];
    fetchData: () => void;
    tablevariable: any[];
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: any) => void;
    messageVariables: any[];
    setMessageVariables: (value: any[]) => void;
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);

    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());

    useEffect(() => {
        if (frameProps.checkPage) {
            setFrameProps({...frameProps, executeSave: false, checkPage: false});
            setPageSelected(frameProps.page);
            if (frameProps.executeSave) {
                setSave('VALIDATION');
            }
        }
    }, [frameProps.checkPage])
    
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
                && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1
                && elem.value[selectionStart - 1] !== '}') {
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

    // useEffect(() => {
    //     if (detaildata.communicationchanneltype?.startsWith('MAI')) {
    //         const variablesList = detaildata.message?.match(/({{)(.*?)(}})/g) || [];
    //         const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
    //         setMessageVariables(varaiblesCleaned.map((x: string) => ({ name: x, text: '', type: 'text' })));
    //     }
    //     else {
    //         setMessageVariables([]);
    //     }
    // }, [])

    useEffect(() => {
        if (detaildata.communicationchanneltype?.startsWith('MAI')) {
            const variablesList = detaildata.message?.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setMessageVariables(varaiblesCleaned.map((x: string) => ({ name: x, text: x, type: 'text' })));
        }
        else {
            setMessageVariables([]);
        }
    }, [detaildata.message])

    return (
        <React.Fragment>
             <div className={classes.containerDetail}>
                {detaildata.communicationchanneltype?.startsWith('MAI') ?
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.title)}
                        className="col-12"
                        valueDefault={detaildata.subject}
                        onChange={(value) => setDetaildata({...detaildata, subject: value})}
                    />
                </div> : null}
                {(detaildata.messagetemplatetype === 'MULTIMEDIA'
                && (detaildata?.messagetemplateheader?.type || '') !== '') ?
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.header)}
                        className="col-12"
                        valueDefault={detaildata.messagetemplateheader?.value}
                        onChange={(value) => setDetaildata({
                            ...detaildata, 
                            messagetemplateheader: {...detaildata.messagetemplateheader, value: value}
                        })}
                        inputProps={{
                            readOnly: detaildata.messagetemplateid !== 0
                        }}
                    />
                </div> : null}
                {detaildata.communicationchanneltype?.startsWith('MAI')
                && ['MAIL','HTML'].includes(detaildata.type!!) ?
                <div className="row-zyx">
                    <React.Fragment>
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.body)}</Box>
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexFlow: 'row wrap', gap: '10px' }}>
                            <div className="col-9" style={{overflow: 'auto'}}>
                                <div
                                    onClick={(e) => console.log(e)}
                                    dangerouslySetInnerHTML={{ __html: detaildata?.message || '' }}
                                />
                            </div>
                            <div className="col-3" style={{width: '300px'}}>
                                {messageVariables.map((item: Dictionary, i) => (
                                    <React.Fragment key={"param_" + i}>
                                        <FieldSelect
                                            key={"var_" + i}
                                            label={`${i + 1}. ${item.name}`}
                                            valueDefault={messageVariables[i].text}
                                            onChange={(value) => {
                                                const datatemp = [...messageVariables];
                                                datatemp[i].text = value.description;
                                                setMessageVariables(datatemp)
                                            }}
                                            data={tablevariable}
                                            optionDesc="description"
                                            optionValue="description"
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </React.Fragment>
                </div>
                :
                <div className="row-zyx">
                    <FieldEditWithSelect
                        label={t(langKeys.message)}
                        className="col-12"
                        rows={10}
                        valueDefault={detaildata.message}
                        onChange={(value) => setDetaildata({...detaildata, message: value})}
                        inputProps={{
                            readOnly: ['HSM','SMS'].includes(detaildata.type || '') && detaildata.messagetemplateid !== 0,
                            onClick: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetaildata, detaildata.type === 'TEXTO'),
                            onInput: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetaildata, detaildata.type === 'TEXTO'),
                        }}
                        show={variableHandler.show}
                        data={tablevariableShow}
                        datakey="description"
                        top={variableHandler.top}
                        left={variableHandler.left}
                        onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                        onClickAway={(variableHandler) => setVariableHandler({...variableHandler, show: false})}
                    />
                </div>}
                {(detaildata.messagetemplatetype === 'MULTIMEDIA'
                && (detaildata?.messagetemplatefooter || '') !== '') ?
                <div className="row-zyx">
                    <FieldEdit
                        label={t(langKeys.footer)}
                        className="col-12"
                        valueDefault={detaildata.messagetemplatefooter}
                        onChange={(value) => setDetaildata({...detaildata,  messagetemplatefooter: value})}
                        inputProps={{
                            readOnly: detaildata.messagetemplateid !== 0
                        }}
                    />
                </div> : null}
            </div>
        </React.Fragment>
    )
}