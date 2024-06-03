import React, { useEffect, useState, FC, useCallback } from 'react';
import { FieldEdit, FieldEditWithSelect, FieldView, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { CircularProgress, IconButton, Paper, Box, FormControl } from '@material-ui/core';
import { Close, FileCopy, GetApp } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import AddIcon from '@material-ui/icons/Add';
import TemplatePreview from './components/TemplatePreview';
import DeleteIcon from '@material-ui/icons/Delete';

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
    templateAux: Dictionary;
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
        height: '500px',
        border: 'none',
        display: 'block',
        margin: '0 auto',
        borderRadius: '0.5rem',
    },
    subtitle: {
        fontSize: '0.9rem',       
        color: 'grey', 
        marginBottom:'0.5rem',
    },
    iconHelpText: {
        width: 'auto',
        height: 23,
        cursor: 'pointer',
    },
    containerStyle: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables, templateAux }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [tablevariableShow, setTableVariableShow] = useState<any[]>([]);
    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());

    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const templateId = templateAux.id;
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId) || {};
    const bodyVariables = selectedTemplate.bodyvariables;
    const [additionalVariables, setAdditionalVariables] = useState<number[]>([1]);
    const [variableValues, setVariableValues] = useState<Dictionary>({});

    console.log('Template en mensaje', templateAux)
    console.log('Template id en Mensaje: ', templateAux.id)

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
        const elem = e.target;
        if (elem) {
            const selectionStart = elem.selectionStart || 0;
            const lines = (elem.value || '').substr(0, selectionStart).split('\n');
            const row = lines.length - 1;
            const column = lines[row].length * 3;
            const startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
            let partialText = '';
            if (startIndex !== -1) {
                if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                    && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1
                    && elem.value[selectionStart - 1] !== '}') {
                    partialText = elem.value.slice(startIndex + 2, selectionStart);
                    const rightText = (elem.value || '').slice(selectionStart, elem.value.length);
                    const selectionEnd = rightText.indexOf('}}') !== -1 ? rightText.indexOf('}}') : 0;
                    const endIndex = startIndex + partialText.length + selectionEnd + 4;
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

    const handleAddVariable = () => {
        setAdditionalVariables(prev => {
            if (prev.length < 10) {
                return [...prev, prev.length + 1];
            }
            return prev;
        });
    };

    const handleRemoveVariable = (indexToRemove: number) => {
        setAdditionalVariables(prev => {
            const newVariables = prev.filter((_, index) => index !== indexToRemove);
            return newVariables.map((_, index) => index + 1);
        });
    };

    const handleVariableChange = (variableNumber: number, selectedOption: any) => {
        const value = selectedOption.value; 
        setVariableValues(prevValues => {
            const newValues = { ...prevValues, [variableNumber]: value };
            console.log("handleVariableChange - variableNumber:", variableNumber);
            console.log("handleVariableChange - value:", value);
            console.log("handleVariableChange - newValues:", newValues);
            return newValues;
        });
    };   

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
                    <div className="row-zyx">
                       
                        <FormControl className="col-12">                          
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Destinatarios'} </div>
                            <div className={classes.subtitle}> {'Selecciona la columna que contiene los destinatarios para el envio del mensaje'} </div>                        
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <div style={{ flex: 1 }}>
                                <FieldSelect
                                        variant="outlined"       
                                        uset={true}       
                                        label='Campos archivo'                     
                                        className="col-12"
                                        data={[]}
                                        optionDesc="value"
                                        optionValue="key"
                                    />    
                                </div>                                   
                                <Tooltip
                                    title={'Selecciona el campo de columna que contiene los destinatarios para el envío del mensaje.'}
                                    arrow
                                    placement="top"
                                >
                                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                </Tooltip>        
                            </div>         
                        </FormControl>                                          
                           
                        <FormControl className="col-12">
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Requeridas'} </div>
                            <div className="subtitle"> {'Selecciona los campos que ocuparán la posición de cada variable para el envío de la campaña'} </div>
                           
                            <div className={classes.containerStyle}>
                                {bodyVariables.map((variable: Dictionary) => (
                                    <div key={variable.variable}>
                                        <p style={{ marginBottom: '3px' }}>{`Variable {{${variable.variable}}}`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={[{ key: variable.variable, value: variable.text }]}
                                            optionDesc="value"
                                            optionValue="key"
                                            onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </FormControl>   

                        <FormControl className="col-12">                          
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Adicionales'} </div>
                            <div className={classes.subtitle}> {'Selecciona los campos adicionales que deseas que viajen en conjunto con la campaña, se utiliza para dar trazabilidad al cliente. También para poder utilizarlo en reportes personalizados y en flujos'} </div>                        
                            
                            <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={handleAddVariable}>
                                <AddIcon /> Añadir variable adicional
                            </div>

                            <div className={classes.containerStyle}>
                            {additionalVariables.map((variable, index) => (
                                <div style={{ flex: 1 }} key={index}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <p>{`Variable {{${variable}}}`}</p>
                                        <DeleteIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => handleRemoveVariable(index)} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            label={`Variable ${variable + 2}`}
                                            className="col-12"
                                            data={[]}
                                            optionDesc="value"
                                            optionValue="key"
                                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}                 
                            </div>                          
                        </FormControl>     
                      
                      
                    </div> 
                </div>  

                <div className={classes.containerDetail} style={{marginLeft:'1rem', width:'50%'}}>             
                    <div style={{fontSize:'1.2rem'}}>{t('Previsualización del mensaje')}  </div> 

                    <TemplatePreview selectedTemplate={selectedTemplate} variableValues={variableValues} />

                    <FormControl className="col-12">                          
                        <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Adicionales'} </div>
                        <div className={classes.subtitle}> {'Selecciona los campos adicionales que deseas que viajen en conjunto con la campaña, se utiliza para dar trazabilidad al cliente. También para poder utilizarlo en reportes personalizados y en flujos'} </div>                        
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        {additionalVariables.map((variable, index) => (
                            <div style={{ flex: 1 }} key={index}>
                                <p>{`Variable ${variable}`}</p>
                                <div style={{ flex: 1 }}>
                                    <FieldSelect
                                        variant="outlined"
                                        uset={true}
                                        label={`Variable ${variable + 2}`}
                                        className="col-12"
                                        data={[]}
                                        optionDesc="value"
                                        optionValue="key"
                                        disabled
                                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                        </div>
                    </FormControl>       
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