import React, { useEffect, useState } from 'react';
import { FieldEdit, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { FormControl } from '@material-ui/core';
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
    jsonPersons: Dictionary;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables, templateAux, jsonPersons}) => {
    const classes = useStyles();
    const { t } = useTranslation();  
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const templateId = templateAux.id;
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId) || {};
    const bodyVariables = selectedTemplate.bodyvariables;
    const [variableValues, setVariableValues] = useState<Dictionary>({});
    const headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: number]: string }>({});
    const [additionalVariables, setAdditionalVariables] = useState<number[]>([1]);
    const [additionalVariableValues, setAdditionalVariableValues] = useState<Dictionary>({});
    const [selectedAdditionalHeaders, setSelectedAdditionalHeaders] = useState<{ [key: number]: string }>({});
 
    console.log('Template en mensaje', templateAux)
    console.log('Mi jsonPersons desde message es: ', jsonPersons)

    const handleHeaderChange = (selectedOption: any) => {
        setSelectedHeader(selectedOption.key);
        setSelectedHeaders(prev => ({ ...prev, main: selectedOption.key }));
    };    

    const handleVariableChange = (variableNumber: number, selectedOption: any) => {
        const header = selectedOption.key;
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        setVariableValues(prevValues => {
            const newValues = { ...prevValues, [variableNumber]: value };
            return newValues;
        });
        setSelectedHeaders(prev => ({ ...prev, [variableNumber]: header }));
    };
    
    
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

    const handleAdditionalVariableChange = (variableNumber: number, selectedOption: any) => {
        const header = selectedOption.key;
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';        
        setAdditionalVariableValues(prevValues => {
            const newValues = { ...prevValues, [variableNumber]: value };
            return newValues;
        });
        setSelectedAdditionalHeaders(prev => {
            const newHeaders = { ...prev, [variableNumber]: header };
            return newHeaders;
        });
    };
    
      
    
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
                                    data={headers.map(header => ({ key: header, value: header }))}
                                    optionDesc="value"
                                    optionValue="key"
                                    valueDefault={selectedHeader ? { key: selectedHeader, value: selectedHeader } : undefined}
                                    onChange={handleHeaderChange}
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
                                            data={headers
                                                .filter(header => header !== selectedHeader)
                                                .map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={selectedHeaders[variable.variable] ? { key: selectedHeaders[variable.variable], value: selectedHeaders[variable.variable] } : undefined}
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
                                                className="col-12"
                                                data={headers
                                                    .filter(header => !Object.values(selectedHeaders).includes(header) && !Object.values(selectedAdditionalHeaders).includes(header))
                                                    .map(header => ({ key: header, value: header }))}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={selectedAdditionalHeaders[variable] ? { key: selectedAdditionalHeaders[variable], value: selectedAdditionalHeaders[variable] } : null}
                                                onChange={(selectedOption) => handleAdditionalVariableChange(variable, selectedOption)}
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
                        <div className={classes.subtitle}> {'Previsualiza un ejemplo de las variables adicionales elegidas en el apartado de Variables Adicionales'} </div>                      
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        {additionalVariables.map((variable, index) => (
                            <div style={{ flex: 1 }} key={index}>
                                <p>{`Variable ${variable}`}</p>
                                <div style={{ flex: 1 }}>
                                <FieldEdit
                                    variant="outlined"
                                    uset={true}
                                    className="col-12"
                                    valueDefault={additionalVariableValues[variable] || ''}
                                    disabled
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