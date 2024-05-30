import React, { useEffect, useState, FC, useCallback } from 'react';
import { FieldEdit, FieldEditWithSelect, FieldView, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { CircularProgress, IconButton, Paper, Box } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ListIcon from '@material-ui/icons/List';
import ReplyIcon from '@material-ui/icons/Reply';

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
    },
    mb1: {
        marginBottom: '0.25rem',
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
        height: '500px', // Puedes ajustar la altura según tus necesidades
        border: 'none',
        display: 'block',
        margin: '0 auto',
        borderRadius: '0.5rem',
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables }) => {
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

            <div className={classes.containerDetail} style={{display:'flex', width:'100%'}}>

               

                <div style={{width:'50%'}}>
                    Hola 
                </div>  

                <div className={classes.containerDetail} style={{width:'50%'}}>             
                    <h2 style={{margin:'1rem', fontWeight:'normal'}}>{t(langKeys.campaign_templatepreview)}  </h2> 
                    <div className={classes.containerDetail} style={{height:'60%', display:'block', alignContent:'center'}}>             
                        <div style={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                            <div style={{ maxWidth:'25rem', borderRadius:'0.5rem', backgroundColor: '#FDFDFD', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1rem 1rem 0rem 1rem' }}> 

                                <div className='templatePreview' style={{}}>
                                    
                                    {detaildata.messagetemplatetype === 'MULTIMEDIA'  ? (
                                        <div>                                          
                                          
                                            <p>{detaildata?.message}</p>

                                            <p style={{color:'grey', fontSize:'0.8rem'}}>{detaildata.messagetemplatefooter}</p>
                                            <span className={classes.previewHour}> 11:12</span>

                                            {Array.isArray(detaildata.messagetemplatebuttons) && detaildata.messagetemplatebuttons.length > 0 && (
                                                <div>
                                                    {detaildata.messagetemplatebuttons.map((button: Dictionary, index: number) => (
                                                        <a className={classes.buttonPreview} key={index}>
                                                            {button.title}
                                                            {button.type === 'url' && <OpenInNewIcon style={{height:'18px', marginLeft: '5px'}} />}
                                                            {button.type === 'quick_reply' && <ReplyIcon style={{height:'18px', marginLeft: '5px'}} />}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}                                         
                                        </div>             

                                    ) : (
                                    
                                        <div>
                                            <p>No se ha seleccionado una Plantilla</p>             
                                        </div>
                                    )}
                                </div>
                            </div>   
                        </div>  
                    </div>
                </div> 


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