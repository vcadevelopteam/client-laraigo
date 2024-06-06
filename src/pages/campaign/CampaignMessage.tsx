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
    const [variableValues, setVariableValues] = useState<Dictionary>({});
    const headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: number]: string }>({});
    const [additionalVariables, setAdditionalVariables] = useState<number[]>([1]);
    const [additionalVariableValues, setAdditionalVariableValues] = useState<Dictionary>({});
    const [selectedAdditionalHeaders, setSelectedAdditionalHeaders] = useState<{ [key: number]: string }>({});

    const handleHeaderChange = (selectedOption: any) => {
        setSelectedHeader(selectedOption.key);
        setSelectedHeaders(prev => ({ ...prev, main: selectedOption.key }));
    };    

    const detectVariables = (text: string) => {
        const regex = /{{(\d+)}}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({ variable: match[1] });
        }
        return matches;
    };
    
    const bodyVariables = detectVariables(selectedTemplate.body);
    const headerVariables = selectedTemplate.headertype === 'TEXT' ? detectVariables(selectedTemplate.header) : [];
    const carouselBodyVariables = selectedTemplate.carouseldata
        ? selectedTemplate.carouseldata.flatMap(item => detectVariables(item.body))
        : [];
    const allBodyVariables = bodyVariables.concat(carouselBodyVariables);
    
    const [bodyVariableValues, setBodyVariableValues] = useState<Dictionary>({});
    const [headerVariableValues, setHeaderVariableValues] = useState<Dictionary>({});
    const [videoHeaderValue, setVideoHeaderValue] = useState<string>('');
    const [cardImageValues, setCardImageValues] = useState<Dictionary>({});
    const [dynamicUrlValues, setDynamicUrlValues] = useState<Dictionary>({});
    const [bubbleVariableValues, setBubbleVariableValues] = useState<Dictionary>({});
    const [carouselVariableValues, setCarouselVariableValues] = useState<Dictionary>({});

        
    const handleVariableChange = (variableNumber: string, selectedOption: any, variableType: 'body' | 'header' | 'video' | 'cardImage' | 'dynamicUrl' | 'carousel') => {
        const header = selectedOption.key;
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        if (variableType === 'body') {
            setBodyVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
        } else if (variableType === 'header') {
            setHeaderVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
        } else if (variableType === 'video') {
            setVideoHeaderValue(value);
        } else if (variableType === 'cardImage') {
            setCardImageValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
        } else if (variableType === 'dynamicUrl') {
            setDynamicUrlValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
        } else if (variableType.startsWith('carousel')) {
            setCarouselVariableValues(prevValues => ({
                ...prevValues,
                [variableType]: {
                    ...prevValues[variableType],
                    [variableNumber]: value
                }
            }));
        }
        setSelectedHeaders(prev => ({
            ...prev,
            [`${variableType}-${variableNumber}`]: header
        }));
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
                                {headerVariables.map((variable: Dictionary) => (
                                    <div key={variable.variable}>
                                        <p style={{ marginBottom: '3px' }}>{`Variable Cabecera {{${variable.variable}}}`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={headers
                                                .filter(header => header !== selectedHeader)
                                                .map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={selectedHeaders[`header-${variable.variable}`] ? { key: selectedHeaders[`header-${variable.variable}`], value: selectedHeaders[`header-${variable.variable}`] } : undefined}
                                            onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption, 'header')}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={classes.containerStyle}>
                                {bodyVariables.map((variable: Dictionary) => (
                                    <div key={variable.variable}>
                                        <p style={{ marginBottom: '3px' }}>{`Variable Cuerpo {{${variable.variable}}}`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={headers
                                                .filter(header => header !== selectedHeader)
                                                .map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={headers}
                                            onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption, 'body')}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={classes.containerStyle}>
                                {carouselBodyVariables.map((variable: Dictionary, index: number) => (
                                    <div key={`${variable.variable}-${index}`}>
                                        <p style={{ marginBottom: '3px' }}>{`Variable Burbuja {{${variable.variable}}}`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={headers
                                                .filter(header => header !== selectedHeader)
                                                .map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={headers}
                                            onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption, 'bubble')}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className={classes.containerStyle}>
                                {selectedTemplate.headertype === 'VIDEO' && (
                                    <div>
                                        <p style={{ marginBottom: '3px' }}>{`Cabecera Multimedia`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={headers
                                                .filter(header => header !== selectedHeader)
                                                .map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={headers}
                                            onChange={(selectedOption) => handleVariableChange('videoHeader', selectedOption, 'video')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={classes.containerStyle}>
                                {selectedTemplate.carouseldata?.map((item, index) =>
                                    item.header && (
                                        <div key={`cardImage-${index}`}>
                                            <p style={{ marginBottom: '3px' }}>{`Card Imagen ${index + 1}`}</p>
                                            <FieldSelect
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                data={headers
                                                    .filter(header => header !== selectedHeader)
                                                    .map(header => ({ key: header, value: header }))}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={headers}
                                                onChange={(selectedOption) => handleVariableChange(`cardImage-${index + 1}`, selectedOption, 'cardImage')}
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            <div className={classes.containerStyle}>
                                {selectedTemplate.carouseldata?.some(item => item.buttons?.some(button => button.btn?.type === 'dynamic')) &&
                                    selectedTemplate.carouseldata.map((item, index) =>
                                        item.buttons?.filter(button => button.btn?.type === 'dynamic').map((button, btnIndex) => (
                                            <div key={`dynamicUrl-${index}-${btnIndex}`}>
                                                <p style={{ marginBottom: '3px' }}>{`Url Dinamico {{${index + 1}}}`}</p>
                                                <FieldSelect
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    data={headers
                                                        .filter(header => header !== selectedHeader)
                                                        .map(header => ({ key: header, value: header }))}
                                                    optionDesc="value"
                                                    optionValue="key"
                                                    valueDefault={headers}
                                                    onChange={(selectedOption) => handleVariableChange(`dynamicUrl-${index + 1}`, selectedOption, 'dynamicUrl')}
                                                />
                                            </div>
                                        ))
                                    )}
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
                                                valueDefault={headers}
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
                    <TemplatePreview
                        selectedTemplate={selectedTemplate}
                        bodyVariableValues={bodyVariableValues}
                        headerVariableValues={headerVariableValues}
                        videoHeaderValue={videoHeaderValue}
                        cardImageValues={cardImageValues}
                        dynamicUrlValues={dynamicUrlValues}
                        bubbleVariableValues={bubbleVariableValues}
                    />

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