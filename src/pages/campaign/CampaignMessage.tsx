/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, FC, useCallback } from 'react'; // we need this to make JSX compile
import { FieldEdit, FieldEditWithSelect, FieldView, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { CircularProgress, IconButton, Paper, Box } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import FieldEditWithSelectCampaign from './FieldEditWithSelectCampaign';

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
    dataButtons: any[];
    setDataButtons: (value: any[]) => void;
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
    },
    mb1: {
        marginBottom: '0.25rem',
    },
}));

class VariableHandler {
    show: boolean;
    item: any;
    inputkey: string;
    inputvalue: string;
    range: number[];
    top: number;
    left: number;
    changer: ({ ...param }) => any;
    constructor() {
        this.show = false;
        this.item = null;
        this.inputkey = '';
        this.inputvalue = '';
        this.range = [-1, -1];
        this.changer = ({ ...param }) => null;
        this.top = 0;
        this.left = 0;
    }
}

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables, dataButtons, setDataButtons }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);

    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());
    useEffect(() => {
        if (frameProps.checkPage) {
            setFrameProps({ ...frameProps, executeSave: false, checkPage: false });
            setPageSelected(frameProps.page);
            if (frameProps.executeSave) {
                setSave('VALIDATION');
            }
        }
    }, [frameProps.checkPage])
    useEffect(() => {
        const newData = (detaildata?.messagetemplatebuttons||[]).map(item => 
            item.payload.match(/{{(.*?)}}/) ? { ...item, variables: Object.fromEntries(item.payload.match(/{{(.*?)}}/g).map(variable => [variable.slice(2, -2), ""])) } : item
        );
        setDataButtons(newData)
    }, [detaildata.messagetemplatebuttons])
    const toggleVariableSelect = (e: React.ChangeEvent<any>, item: any, inputkey: string, changefunc: ({ ...param }) => void, filter = true) => {
        
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
                        changer: ({ ...param }) => changefunc({ ...param }),
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
        const { item, inputkey, inputvalue, range, changer } = variableHandler;
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

    useEffect(() => {
        if (detaildata.communicationchanneltype?.startsWith('MAI')) {
            const variablesList = detaildata.message?.match(/({{)(.*?)(}})/g) || [];
            const varaiblesCleaned = variablesList.map((x: string) => x.substring(x.indexOf("{{") + 2, x.indexOf("}}")))
            setMessageVariables(varaiblesCleaned.map((x: string, i: number) => ({
                name: x,
                text: messageVariables[i]?.text || x,
                type: 'text'
            })));
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
                            label={t(langKeys.subject)}
                            className="col-12"
                            valueDefault={detaildata.messagetemplateheader?.value}
                            onChange={(value) => setDetaildata({ ...detaildata, subject: value })}
                            inputProps={{
                                readOnly: ['HSM', 'SMS', 'MAIL'].includes(detaildata.type || '') && detaildata.messagetemplateid !== 0
                            }}
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
                                messagetemplateheader: { ...detaildata.messagetemplateheader, value: value }
                            })}
                            inputProps={{
                                readOnly: detaildata.messagetemplateid !== 0
                            }}
                        />
                    </div> : null}
                {detaildata.communicationchanneltype?.startsWith('MAI')
                    && ['MAIL', 'HTML'].includes(detaildata.type!!) ?
                    <div className="row-zyx">
                        <React.Fragment>
                            <div style={{ display: 'flex', justifyContent: 'center', flexFlow: 'row wrap', gap: '20px' }}>
                                <div className="col-8" style={{ overflow: 'auto', borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "20px" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.body)}</Box>
                                    <div
                                        onClick={(e) => console.log(e)}
                                        dangerouslySetInnerHTML={{ __html: detaildata?.message || '' }}
                                    />
                                </div>
                                <div className="col-4" style={{ width: '400px', borderStyle: "solid", borderWidth: "1px", borderColor: "#762AA9", borderRadius: "4px", padding: "20px" }}>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">{t(langKeys.parameters)}</Box>
                                    {messageVariables.map((item: Dictionary, i) => (
                                        <React.Fragment key={"param_" + i}>
                                            <FieldSelect
                                                key={"var_" + i}
                                                label={`${i + 1}. ${t(langKeys.variable)} #${item.name}`}
                                                valueDefault={messageVariables[i].text}
                                                onChange={(value: { description: any; }) => {
                                                    const datatemp = [...messageVariables];
                                                    datatemp[i].text = value?.description;
                                                    setMessageVariables(datatemp)
                                                }}
                                                data={tablevariable}
                                                optionDesc="label"
                                                optionValue="description"
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </React.Fragment>
                    </div> :
                    <div className="row-zyx">
                        <FieldEditWithSelect
                            label={t(langKeys.body)}
                            className="col-12"
                            rows={10}
                            valueDefault={detaildata.message}
                            onChange={(value) => setDetaildata({ ...detaildata, message: value })}
                            inputProps={{
                                readOnly: ['HSM', 'SMS', 'MAIL'].includes(detaildata.type || '') && detaildata.messagetemplateid !== 0,
                                onClick: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetaildata, detaildata.type === 'TEXTO'),
                                onInput: (e: any) => toggleVariableSelect(e, detaildata, 'message', setDetaildata, detaildata.type === 'TEXTO'),
                            }}
                            show={variableHandler.show}
                            data={tablevariableShow}
                            datalabel="label"
                            datakey="description"
                            top={variableHandler.top}
                            left={variableHandler.left}
                            onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                            onClickAway={(variableHandler) => setVariableHandler({ ...variableHandler, show: false })}
                        />
                    </div>}
                {(detaildata.messagetemplatetype === 'MULTIMEDIA'
                    && (detaildata?.messagetemplatefooter || '') !== '') ?
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.footer)}
                            className="col-12"
                            valueDefault={detaildata.messagetemplatefooter}
                            onChange={(value) => setDetaildata({
                                ...detaildata,
                                messagetemplatefooter: value
                            })}
                            inputProps={{
                                readOnly: detaildata.messagetemplateid !== 0
                            }}
                        />
                    </div> : null}
                {(detaildata.messagetemplatetype === 'MULTIMEDIA' && (detaildata?.messagetemplatebuttons || detaildata?.messagetemplatebuttons !== null)) && <div className="row-zyx">
                    <FieldView
                        label={t(langKeys.buttons)}
                        className="col-12"
                        value=''
                    />
                    <React.Fragment>
                        {detaildata?.messagetemplatebuttons?.map((btn: any, i: number) => {
                            return (<div key={`btn-${i}`} className="col-4">
                                <FieldView
                                    label={t(langKeys.title)}
                                    value={btn?.title || ""}
                                    className={classes.mb1}
                                />
                                <FieldView
                                    label={t(langKeys.type)}
                                    value={t(`messagetemplate_${btn?.type || ""}`)}
                                    className={classes.mb1}
                                />
                                {(btn?.type === "url") ? 
                                <div className="row-zyx">
                                    <FieldEditWithSelectCampaign 
                                        title={t(langKeys.payload)}
                                        rows={1}
                                        message={detaildata?.messagetemplatebuttons?.[i]?.payload}
                                        onChange={(value) => {
                                            let auxdetail = detaildata
                                            auxdetail.messagetemplatebuttons[i].payload = value
                                            setDetaildata(auxdetail)
                                        }}
                                        readOnly={['HSM', 'SMS', 'MAIL'].includes(detaildata.type || '') && detaildata.messagetemplateid !== 0}
                                        tablevariable={tablevariable}
                                        detaildata={detaildata}
                                        field={`messagetemplatebuttons[${i}].payload`}
                                        setDetaildata={setDetaildata}
                                    />
                                </div>:
                                <FieldView
                                    label={t(langKeys.payload)}
                                    value={btn?.payload || ""}
                                    className={classes.mb1}
                                />
                            }
                            </div>

                        )
                        })}
                    </React.Fragment>
                </div>}
                {(detaildata.communicationchanneltype === 'MAIL' && detaildata?.messagetemplateattachment) && <div className="row-zyx">
                    <FieldView label={t(langKeys.messagetemplate_attachment)} />
                    <React.Fragment>
                        {!!detaildata?.messagetemplateattachment && detaildata?.messagetemplateattachment?.split(',').map((f: string, i: number) => (
                            <FilePreview key={`attachment-${i}`} src={f} />
                        ))}
                    </React.Fragment>
                </div>}
            </div>
        </React.Fragment>
    )
}

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

const useFilePreviewStyles = makeStyles(theme => ({
    btnContainer: {
        color: 'lightgrey',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    root: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: 'hidden',
        padding: theme.spacing(1),
        width: 'fit-content',
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes('http'), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = (src as string).match(/.*\/(.+?)\./);
            return m && m.length > 1 ? m[1] : "";
        };
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split('.').pop()?.toUpperCase() || "-";
        }
        return (src as File).name?.split('.').pop()?.toUpperCase() || "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: '0.5em' }} />
            <div className={classes.infoContainer}>
                <div>
                    <div style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 190, whiteSpace: 'nowrap' }}>{getFileName()}</div>{getFileExt()}
                </div>
            </div>
            <div style={{ width: '0.5em' }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: '10%' }} />}
                {isUrl() && (
                    <a href={src as string} target="_blank" rel="noreferrer" download={`${getFileName()}.${getFileExt()}`}>
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
}