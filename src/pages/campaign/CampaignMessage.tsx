import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldEdit, FieldSelect, FieldSelectDisabled } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
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
    tablevariable: Dictionary[];
    frameProps: FrameProps;
    setFrameProps: (value: FrameProps) => void;
    setPageSelected: (page: number) => void;
    setSave: (value: string) => void;
    messageVariables: Dictionary[];
    setMessageVariables: (value: Dictionary[]) => void;
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

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables, templateAux, jsonPersons}) => {
    const classes = useStyles();
    const { t } = useTranslation();  
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const templateId = templateAux.id;
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId) || {};
    const [filledTemplate, setFilledTemplate] = useState<Dictionary>({ ...selectedTemplate });
    const headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    const [selectedHeader, setSelectedHeader] = useState<string>('');
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: number]: string }>({});
    const [additionalVariables, setAdditionalVariables] = useState<number[]>([1]);
    const [additionalVariableValues, setAdditionalVariableValues] = useState<Dictionary>({});
    const [selectedAdditionalHeaders, setSelectedAdditionalHeaders] = useState<{ [key: number]: string }>({});
    const messagetemplateid = multiData[4]?.data?.[0]?.messagetemplateid ?? null;
    const getTemplateById = (id: Dictionary, data: Dictionary) => {
        return (data as Dictionary)?.data?.find((template: Dictionary) => template.id === id) ?? null;
    };
    const matchingTemplate = getTemplateById(messagetemplateid, multiData[3]);
    const isEmptyData = (data: Dictionary) => {
        return Object.keys(data).length === 0 && data.constructor === Object;
    };    
    const templateToUse = isEmptyData(selectedTemplate) ? matchingTemplate : selectedTemplate;
    
    const handleHeaderChange = (selectedOption: Dictionary) => {       
        setSelectedHeader(selectedOption ? selectedOption.key : '');
        setSelectedHeaders(prev => ({ ...prev, main: selectedOption ? selectedOption.key : '' }));
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

    const detectVariablesField = (text: string) => {
        const regex = /{{(field\d+|\d+)}}/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({ variable: match[1] });
        }
        return matches;
    };
     
    const bodyVariables = detectVariables(templateToUse.body);
    const headerVariables = templateToUse.headertype === 'TEXT' ? detectVariables(templateToUse.header) : [];    
    const [bodyVariableValues, setBodyVariableValues] = useState<Dictionary>({});
    const [headerVariableValues, setHeaderVariableValues] = useState<Dictionary>({});
    const [videoHeaderValue, setVideoHeaderValue] = useState<string>('');
    const [cardImageValues, setCardImageValues] = useState<Dictionary>({});
    const [dynamicUrlValues, setDynamicUrlValues] = useState<Dictionary>({});
    const [bubbleVariableValues, setBubbleVariableValues] = useState<Dictionary>({});
    const [carouselVariableValues, setCarouselVariableValues] = useState<Dictionary>({});
    const [variableSelections, setVariableSelections] = useState<{ [key: string]: string }>({});    
    const templateData = multiData[4]?.data?.[0];
    const columnsArray = templateData && templateData.fields ? [templateData.fields.primarykey, ...templateData.fields.columns] : [];
    const dataToUse = headers.length > 0 ? headers : columnsArray;      
    const availableData = dataToUse.filter(header => !Object.values({ ...selectedHeaders, ...selectedAdditionalHeaders }).includes(header));
    const [campaignViewDetails, setCampaignViewDetails] = useState<ICampaign | null>(null);
    const [variablesBodyView, setVariablesBodyView] = useState<Dictionary[]>([]);
    const [variablesAdditionalView, setVariablesAdditionalView] = useState<string[]>([]);
    const [variablesCarouselBubbleView, setVariablesCarouselBubbleView] = useState<Dictionary[][]>([]);
    const [variablesUrlView, setVariablesUrlView] = useState<Dictionary[]>([]);
    const [variablesCardImageView, setVariablesCardImageView] = useState<Dictionary[]>([]);
    const [selectedAuthVariable, setSelectedAuthVariable] = useState<string>('');
    const [variablesHeaderView, setVariablesHeaderView] = useState<Dictionary[]>([]);
    const [selectedFields, setSelectedFields] = useState<{ [key: string]: { column: string, value: any, type: string, index: string, carouselIndex: number | null } }>({});
    const [allVariables, setAllVariables] = useState<{ [key: string]: { column: string, value: any } }>({});

    const buildAllVariables = (jsonPersons) => {
        const allVars = {};
        if (jsonPersons.length > 0) {
            const firstPerson = jsonPersons[0];
            let fieldIndex = 1;
            for (const key in firstPerson) {
                if (firstPerson.hasOwnProperty(key)) {
                    allVars[`field${fieldIndex}`] = {
                        column: key,
                        value: firstPerson[key]
                    };
                    fieldIndex++;
                }
            }
        }
        return allVars;
    };

    useEffect(() => {
        const allVars = buildAllVariables(jsonPersons);
        setAllVariables(allVars);
    }, [jsonPersons]);

    if (availableData.length === 0) {
        availableData.push('No quedan más variables');
    }

    const processMultiData = (data: Dictionary) => {
        const processedData = {
            bodyVariableValues: {},
            headerVariableValues: {},
            videoHeaderValue: '',
            cardImageValues: {},
            dynamicUrlValues: {},
            bubbleVariableValues: {},
            carouselVariableValues: {},
            additionalVariableValues: {},
            selectedAdditionalHeaders: {},
            selectedAuthVariable: ''
        };

        const campaignData = data[0];

        if (campaignData) {
            const bodyVariables = detectVariablesField(campaignData.message);
            const variablesHiddenMultidata = campaignData.variableshidden || [];
            const carouselBubbleVariables = campaignData.carouseljson ? campaignData.carouseljson.map((item: Dictionary) => {
                return detectVariablesField(item.body);
            }) : [];
            const carouselUrlVariables = campaignData.carouseljson ? campaignData.carouseljson.flatMap((item: Dictionary) => {
                return item.buttons ? item.buttons.flatMap((button: Dictionary) => detectVariablesField(button.btn.url)) : [];
            }) : [];    
            const templateButtonsUrlVariables = campaignData.messagetemplatebuttons ? campaignData.messagetemplatebuttons.flatMap((button: Dictionary) => {
                return button && button.btn && button.btn.url ? detectVariablesField(button.btn.url) : [];
            }) : [];
            const allUrlVariables = [...carouselUrlVariables, ...templateButtonsUrlVariables];
            const headerVariable = campaignData.messagetemplateheader ? detectVariablesField(campaignData.messagetemplateheader.value) : [];
            const cardImageVariables = campaignData.carouseljson ? campaignData.carouseljson.map((item: Dictionary) => {
                return detectVariablesField(item.header);
            }) : [];

            setVariablesBodyView(bodyVariables);
            setVariablesAdditionalView(variablesHiddenMultidata);
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);     
            setSelectedAuthVariable(JSON.stringify(bodyVariableValues));
            setVariablesHeaderView(headerVariable);
            setVariablesCardImageView(cardImageVariables); 

            
            bodyVariables.forEach((variable, index) => {
                const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                (processedData.bodyVariableValues as { [key: number]: string })[index + 1] = `field${fieldIndex}`;
            });
    
            if (campaignData.headertype === 'TEXT') {
                const headerVariables = detectVariablesField(campaignData.header);
                headerVariables.forEach((variable, index) => {
                    const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                    (processedData.headerVariableValues as { [key: number]: string })[index + 1] = `field${fieldIndex}`;
                });
            }    

            processedData.videoHeaderValue = campaignData.messagetemplateheader?.value || '';    
            if (campaignData.carouseljson) {
                campaignData.carouseljson.forEach((item: Dictionary, carouselIndex: number) => {
                    (processedData.carouselVariableValues as { [key: number]: { [key: number]: string } })[carouselIndex] = {};
                    if (item.bodyvariables) {
                        item.bodyvariables.forEach((variable: Dictionary, index: number) => {
                            const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                            (processedData.carouselVariableValues[carouselIndex] as { [key: number]: string })[index + 1] = `field${fieldIndex}`;
                        });
                    }
                });
            }
        }    
        return processedData;
    };

    useEffect(() => {
        if (multiData[4] && multiData[4].data && multiData[4].data.length > 0) {
            const combinedData: ICampaign = {
                ...multiData[4].data[0],
                operation: 'UPDATE',
            };
    
            setCampaignViewDetails(combinedData);
            const processedData = processMultiData(multiData[4].data);
            const bodyVariables = combinedData.message ? detectVariablesField(combinedData.message) : [];
            const variablesHiddenMultidata = combinedData.variableshidden || [];           
            const carouselBubbleVariables = combinedData.carouseljson ? combinedData.carouseljson.map(item => {
                return detectVariablesField(item.body);
            }) : [];
            const urlVariables = combinedData.carouseljson ? combinedData.carouseljson.flatMap(item => {
                return item.buttons ? item.buttons.flatMap((button: Dictionary) => detectVariablesField(button.btn.url)) : [];
            }) : [];
            const templateButtonsUrlVariables = combinedData.messagetemplatebuttons ? combinedData.messagetemplatebuttons.flatMap(button => {
                return button && button.btn && button.btn.url ? detectVariablesField(button.btn.url) : [];
            }) : [];    
            const allUrlVariables = [...urlVariables, ...templateButtonsUrlVariables];
            const headerVariable = combinedData.messagetemplateheader ? detectVariablesField(combinedData.messagetemplateheader.value) : [];
            const cardImageVariables = combinedData.carouseljson ? combinedData.carouseljson.map(item => {
                return detectVariablesField(item.header);
            }) : [];
    
            setVariablesBodyView(bodyVariables);
            setVariablesAdditionalView(variablesHiddenMultidata.map(variable => variable));
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);
            setVariablesHeaderView(headerVariable);
            setVariablesCardImageView(cardImageVariables);
    
            const newBodyVariableValues = {};
            const newAdditionalVariableValues = {};
            const newCarouselBubbleVariableValues = {};
            const newDynamicUrlValues = {};
            const newHeaderValue = {};
            const newCardImageValue = {};
    
            if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
                const personData = multiData[5].data[0];
    
                Object.entries(processedData.bodyVariableValues).forEach(([key, fieldKey], index) => {
                    newBodyVariableValues[index + 1] = personData[fieldKey];
                });
    
                variablesHiddenMultidata.forEach(variable => {
                    const fieldIndex = parseInt(variable.replace('field', ''), 10);
                    if (personData[`field${fieldIndex}`]) {
                        newAdditionalVariableValues[variable] = personData[`field${fieldIndex}`];
                    }
                });
    
                carouselBubbleVariables.forEach((variables, carouselIndex) => {
                    newCarouselBubbleVariableValues[carouselIndex] = {};
                    variables.forEach((variable, index) => {
                        const fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newCarouselBubbleVariableValues[carouselIndex][index + 1] = personData[`field${fieldIndex}`];
                    });
                });
    
                allUrlVariables.forEach((variable, index) => {
                    const fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newDynamicUrlValues[index + 1] = personData[`field${fieldIndex}`];
                });
    
                headerVariable.forEach((variable, index) => {
                    const fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newHeaderValue[index + 1] = personData[`field${fieldIndex}`];
                });
    
                cardImageVariables.forEach((variables, carouselIndex) => {
                    if (variables.length > 0 && variables[0].variable) {
                        const fieldIndex = parseInt(variables[0].variable.replace('field', ''), 10);
                        newCardImageValue[carouselIndex + 1] = personData[`field${fieldIndex}`];
                    }
                });
            }
    
            setBodyVariableValues(newBodyVariableValues);
            setHeaderVariableValues(newHeaderValue);
            setVideoHeaderValue(processedData.videoHeaderValue);
            setCardImageValues(newCardImageValue);
            setDynamicUrlValues(newDynamicUrlValues);
            setBubbleVariableValues(newCarouselBubbleVariableValues);
            setCarouselVariableValues(processedData.carouselVariableValues);
            setAdditionalVariableValues(newAdditionalVariableValues);
            setSelectedAdditionalHeaders(processedData.selectedAdditionalHeaders);
            setSelectedAuthVariable(processedData.selectedAuthVariable);

            if (combinedData.fields && combinedData.fields.primarykey) {
                setSelectedHeader(combinedData.fields.primarykey);
            }
    
            const bodyVars = detectVariablesField(combinedData.message);
            const newSelectedHeaders = { ...selectedHeaders };
    
            bodyVars.forEach((variable, index) => {
                let fieldIndex;
                if (typeof variable.variable === 'string' && variable.variable.startsWith('field')) {
                    fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                } else {
                    fieldIndex = parseInt(variable.variable, 10);
                }
                const header = combinedData.fields.columns[fieldIndex - 2]; 
                newSelectedHeaders[`body-${index + 1}`] = header;
            });
    
            setSelectedHeaders(newSelectedHeaders);
            console.log("111")
            updateTemplate(); 
        }
    }, [multiData]);

    const getAdditionalVariableIndex = () => {
        const additionalIndexes = Object.keys(selectedFields)
            .filter(key => selectedFields[key].type === 'variablehidden')
            .map(key => parseInt(selectedFields[key].index, 10));
        return additionalIndexes.length > 0 ? Math.max(...additionalIndexes) + 1 : 1;
    };

    const handleVariableChange = (variableNumber: string, selectedOption: any, variableType: 'body' | 'header' | 'video' | 'cardImage' | 'dynamicUrl' | 'carousel' | 'authentication' | 'additional' | 'receiver', carouselIndex?: number) => {
        console.log(`Variable Change - type: ${variableType}, variableNumber: ${variableNumber}, selectedOption:`, selectedOption, "carouselIndex", carouselIndex);
    
        const header = selectedOption ? selectedOption.key : '';
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
        const index = variableType === 'additional' ? getAdditionalVariableIndex() : variableNumber;
    
        if (variableType === 'video') {
            setVideoHeaderValue(header);
        } else if (variableType === 'body') {
            setBodyVariableValues(prevValues => {
                const newBodyVariableValues = {
                    ...prevValues,
                    [variableNumber]: header
                };
                setSelectedAuthVariable(newBodyVariableValues['authentication'] || '');
                return newBodyVariableValues;
            });
        } else if (variableType === 'header') {
            setHeaderVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: header
            }));
        } else if (variableType === 'cardImage') {
            setCardImageValues(prevValues => ({
                ...prevValues,
                [variableNumber]: header
            }));
        } else if (variableType === 'dynamicUrl') {
            setDynamicUrlValues(prevValues => ({
                ...prevValues,
                [variableNumber]: header
            }));
        } else if (variableType === 'carousel' && carouselIndex !== undefined) {
            setCarouselVariableValues(prevValues => ({
                ...prevValues,
                [carouselIndex]: {
                    ...prevValues[carouselIndex],
                    [variableNumber]: header
                }
            }));
        } else if (variableType === 'authentication') {
            setSelectedAuthVariable(header);
        } else if (variableType === 'additional') {
            setAdditionalVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: header
            }));
        } else if (variableType === 'receiver') {
            setSelectedHeader(header);
        } 
    
        const key = generateKey(variableType, variableNumber, carouselIndex);
        const newSelectedHeaders = {
            ...selectedHeaders,
            [key]: header
        };
        setSelectedHeaders(newSelectedHeaders);
    
        const newVariableSelections = {
            ...variableSelections,
            [key]: header
        };
        setVariableSelections(newVariableSelections);
    
        const newSelectedFields = { ...selectedFields };
    
        newSelectedFields[`field${index}`] = {
            column: selectedOption,
            value: value,
            type: variableType === 'additional' ? 'variablehidden' : variableType,
            index: index.toString(),
            carouselIndex: carouselIndex !== undefined ? carouselIndex : null
        };
    
        setSelectedFields(newSelectedFields);
    
        if (!header) {
            updateTemplate(true, variableNumber);
        } else {
            updateTemplate();
        }
    };
    
    const generateKey = (variableType: string, variableNumber: string, carouselIndex?: number) => {
        return carouselIndex !== undefined ? `${variableType}-${carouselIndex}-${variableNumber}` : `${variableType}-${variableNumber}`;
    };   
    
    const getValueDefault = (variableType: string, variableNumber: string, carouselIndex?: number) => {
        const key = generateKey(variableType, variableNumber, carouselIndex);
        const header = selectedHeaders[key];
        if ((variableType === 'video' || variableType === 'cardImage') && header === 'default') {
            return { key: 'default', value: 'Default ' };
        }
        return header ? { key: header, value: header } : undefined;
    };
    
    const [currentTemplate, setCurrentTemplate] = useState(templateToUse);

    const extractFieldKeysFromTemplate = (templatePart: any) => {
        const regex = /{{field(\d+)}}/g;
        let match;
        const fields = [];
        while ((match = regex.exec(templatePart)) !== null) {
            fields.push(`field${match[1]}`);
        }
        return fields;
    };    

    const extractFieldKeysFromButtonsgeneric = (buttonsgeneric: Dictionary[], carouseldata?: Dictionary[]) => {
        const fields = [];
        buttonsgeneric?.forEach(button => {
            const match = button.btn?.url?.match(/{{field(\d+)}}/);
            if (match) {
                fields.push(`field${match[1]}`);
            }
        });    
        carouseldata?.forEach(carousel => {
            carousel.buttons?.forEach(button => {
                const match = button.btn.url.match(/{{field(\d+)}}/);
                if (match) {
                    fields.push(`field${match[1]}`);
                }
            });
        });    
        return fields;
    };

    const [unavailableVariables, setUnavailableVariables] = useState([]);

    console.log('campaña completa ya creada', multiData[4])
    // console.log('personas de la campaña ya creada', multiData[5])
    
    const updateTemplate = useCallback((resetField = false, fieldToReset = null) => {
       
        if(!row) {
            const updatedTemplate = JSON.parse(JSON.stringify(templateToUse));
    
            if (updatedTemplate.category === "AUTHENTICATION" && !updatedTemplate.body) {
                updatedTemplate.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }        

            let newSelectedFields = { ...selectedFields };
         
            Object.keys(variableSelections).forEach(key => {
                let type, number, carouselIndexStr;    
                if (key.startsWith('carousel')) {
                    [type, carouselIndexStr, number] = key.split('-');
                } else {
                    [type, number, carouselIndexStr] = key.split('-');
                }
                const fieldNumber = headers.indexOf(variableSelections[key]) + 1;
                const selectedOption = variableSelections[key];
                const value = jsonPersons.length > 0 ? jsonPersons[0][selectedOption] : '';

                let index = number;
                if (type === 'dynamicUrl') {
                    index = key;
                }
    
                newSelectedFields[`field${fieldNumber}`] = {
                    column: selectedOption,
                    value: value,
                    type: type,
                    index: index,
                    carouselIndex: carouselIndexStr !== undefined ? parseInt(carouselIndexStr, 10) : null
                };              
                       
                if (type === 'body' && updatedTemplate.body) {
                    updatedTemplate.body = updatedTemplate.body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
                }else if (type === 'header' && updatedTemplate.header) {
                    const placeholders = [...updatedTemplate.header.matchAll(/{{field(\d+)}}/g)];
                    if (placeholders.length >= number) {
                        const currentField = placeholders[number - 1][0];
                        const newField = `{{field${fieldNumber}}}`;
                        updatedTemplate.header = updatedTemplate.header.replace(currentField, newField);
                    }
                } else if (type === 'cardImage' && updatedTemplate.carouseldata) {
                    const carouselIndex = parseInt(number, 10);
                    if (!isNaN(carouselIndex) && updatedTemplate.carouseldata[carouselIndex]) {
                        if (variableSelections[key] === 'Default ') {
                            const messageTemplateName = multiData[4].data[0].messagetemplatename;
                            console.log('messageTemplateName:', messageTemplateName);
                            const campaign = multiData[3].data.find(campaign => campaign.name === messageTemplateName);
                            if (campaign && campaign.carouseldata[carouselIndex]) {
                                updatedTemplate.carouseldata[carouselIndex].header = campaign.carouseldata[carouselIndex].header;
                                console.log(`Updated updatedTemplate.carouseldata[${carouselIndex}].header to: ${campaign.carouseldata[carouselIndex].header}`);
                            } else {
                                console.log(`No matching campaign found in multiData[3] for messagetemplatename: ${messageTemplateName}`);
                            }
                        } else {
                            const header = variableSelections[key];
                            const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                            const selectedField = Object.keys(allVariables).find(key => allVariables[key].column === header);
                            if (selectedField) {
                                updatedTemplate.carouseldata[carouselIndex].header = `{{${selectedField}}}`;
                                console.log(`Updated updatedTemplate.carouseldata[${carouselIndex}].header to: {{${selectedField}}}`);
                            } else {
                                console.log(`No matching field found in allVariables for header: ${header}`);
                                const placeholders = [...updatedTemplate.carouseldata[carouselIndex].header.matchAll(/{{field(\d+)}}/g)];
                                if (placeholders.length >= 1) {
                                    const currentField = placeholders[0][0];
                                    const newField = `{{field${fieldNumber}}}`;
                                    updatedTemplate.carouseldata[carouselIndex].header = updatedTemplate.carouseldata[carouselIndex].header.replace(currentField, newField);
                                }
                            }
                        }
                    }
                }
                
                
                
                 else if (type === 'dynamicUrl') {
                    if (updatedTemplate.buttonsgeneric) {
                        updatedTemplate.buttonsgeneric.forEach((button: Dictionary, btnIndex: number) => {
                            const buttonKey = `dynamicUrl-dynamicUrl-${btnIndex + 1}`;
                            const variableSelectionsValue = variableSelections[buttonKey];
                            if (variableSelectionsValue) {
                                const variableKey = headers.indexOf(variableSelectionsValue);
                                if (variableKey !== -1) {
                                    if (button.btn.type === 'dynamic' && button.btn.url) {
                                        if (!button.btn.url.includes('{{')) {
                                            button.btn.url += '/{{1}}';
                                        }
                                        const regex = /{{\d+}}/g;
                                        button.btn.url = button.btn.url.replace(regex, `{{field${variableKey + 1}}}`);
                                    }
                                }
                            } 
                        });
                    }
                    if (updatedTemplate.carouseldata) {
                        updatedTemplate.carouseldata.forEach((item: Dictionary, carouselIndex: number) => {
                            item.buttons.forEach((button: Dictionary, btnIndex: number) => {
                                if (button.btn.type === 'dynamic') {
                                    const buttonKey = `dynamicUrl-dynamicUrl-${carouselIndex}-${btnIndex}`;
                                    const variableSelectionsValue = variableSelections[buttonKey];                                
                                    if (variableSelectionsValue) {
                                        const fieldNumber = headers.indexOf(variableSelectionsValue) + 1;                                  
                                        if (!isNaN(fieldNumber)) {
                                            if (!button.btn.url.includes('{{')) {
                                                button.btn.url += '/{{1}}';
                                            }
                                            const regex = /{{\d+}}/g;
                                            button.btn.url = button.btn.url.replace(regex, `{{field${fieldNumber}}}`);
                                        }
                                    }
                                }
                            });
                        });
                    }
                } else if (type === 'carousel' && updatedTemplate.carouseldata) {
                    const index = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index) && updatedTemplate.carouseldata[index]) {
                        updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
                    }
                } else if (type === 'bubble' && updatedTemplate.carouseldata) {
                    const index = parseInt(carouselIndexStr, 10);
                    if (!isNaN(index)) {
                        updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
                    }
                } else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate.headertype) && variableSelections['video-videoHeader']) {
                    const selectedHeader = variableSelections['video-videoHeader'];
                    if (selectedHeader === 'default') {
                        updatedTemplate.header = templateToUse.header;
                    } else {
                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                        const matchingField = Object.keys(allVariables).find(key => allVariables[key].column === selectedHeader);
                        if (matchingField) {
                            updatedTemplate.header = `{{${matchingField}}}`;
                        } else {
                            const fieldNumber = columns.indexOf(selectedHeader) + 2;
                            if (!isNaN(fieldNumber)) {
                                updatedTemplate.header = `{{field${fieldNumber}}}`;
                            }
                        }
                    }
                }
                
            });
        
            if (updatedTemplate.category === "AUTHENTICATION" && selectedHeaders['body-authentication']) {
                const fieldNumber = headers.indexOf(selectedHeaders['body-authentication']) + 1;
                if (!isNaN(fieldNumber)) {
                    updatedTemplate.body = updatedTemplate.body.replace('{{1}}', `{{field${fieldNumber}}}`);
                }
            }
        
            if (updatedTemplate.messagetemplatetype === "CAROUSEL" && updatedTemplate.carouseljson) {
                const carouselData = JSON.parse(updatedTemplate.carouseljson);
                carouselData.forEach((item: Dictionary, index: number) => {
                    const key = `cardImage-cardImage-${index + 1}`;
                    const variableSelectionKey = variableSelections[key];
                    if (variableSelectionKey) {
                        const fieldNumber = headers.indexOf(variableSelectionKey) + 1;
                        if (!isNaN(fieldNumber)) {
                            item.header = `{{field${fieldNumber}}}`;
                        } 
                    }
                    item.buttons.forEach((button: Dictionary, btnIndex: number) => {
                        if (button.btn.type === 'dynamic') {
                            const buttonKey = `dynamicUrl-dynamicUrl-${index}-${btnIndex}`;
                            const variableSelectionsValue = variableSelections[buttonKey];
                            if (variableSelectionsValue) {
                                const fieldNumber = headers.indexOf(variableSelectionsValue) + 1;
                                if (!isNaN(fieldNumber)) {
                                    if (!button.btn.url.includes('{{')) {
                                        button.btn.url += '/{{1}}';
                                    }
                                    const regex = /{{\d+}}/g;
                                    button.btn.url = button.btn.url.replace(regex, `{{field${fieldNumber}}}`);
                                }
                            } 
                        }
                    });
                });
                updatedTemplate.carouseljson = JSON.stringify(carouselData);
            }
        
            updatedTemplate.variableshidden = Object.values(selectedAdditionalHeaders).map(
                header => `field${headers.indexOf(header) + 1}`
            );
        
            newSelectedFields = Object.fromEntries(
                Object.entries(newSelectedFields).filter(([key, { column }]) =>
                    Object.values(variableSelections).includes(column)
                )
            );

            const newAllVariables = buildAllVariables(jsonPersons);
            //console.log('Selected Fields:', newSelectedFields);
            //console.log('All Variables:', newAllVariables);
            console.log('final updatedTemplate:', updatedTemplate);

            setSelectedFields(newSelectedFields);
            setAllVariables(newAllVariables);            
            setFilledTemplate(updatedTemplate);
            setDetaildata((prev: any) => ({
                ...prev,
                message: updatedTemplate.body,
                messagetemplateheader: {
                    ...prev.messagetemplateheader,
                    value: updatedTemplate.header
                },
                messagetemplatebuttons: updatedTemplate.buttonsgeneric || [],
                fields: {
                    ...prev.fields,
                    campaignvariables: newSelectedFields,
                    allVariables: newAllVariables
                },
                carouseljson: updatedTemplate.carouseldata,
                variableshidden: updatedTemplate.variableshidden
            }));
        }

       if (row) {
            const updatedTemplate = JSON.parse(JSON.stringify(templateToUse));

            if (updatedTemplate.category === "AUTHENTICATION" && !updatedTemplate.body) {
                updatedTemplate.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
            }

            if (variablesBodyView.length > 0 && updatedTemplate.body) {
                let bodyIndex = 1;
                variablesBodyView.forEach(variable => {
                    const placeholder = `{{${bodyIndex}}}`;
                    if (updatedTemplate.body.indexOf(placeholder) !== -1) {
                        updatedTemplate.body = updatedTemplate.body.replace(placeholder, `{{${variable.variable}}}`);
                    }
                    bodyIndex++;
                });
            }

            if (variablesCarouselBubbleView.length > 0 && updatedTemplate.carouseldata) {
                variablesCarouselBubbleView.forEach((variables, carouselIndex) => {
                    if (updatedTemplate.carouseldata[carouselIndex]) {
                        let bodyIndex = 1;
                        variables.forEach(variable => {
                            const placeholder = `{{${bodyIndex}}}`;
                            if (updatedTemplate.carouseldata[carouselIndex].body.indexOf(placeholder) !== -1) {
                                updatedTemplate.carouseldata[carouselIndex].body = updatedTemplate.carouseldata[carouselIndex].body.replace(placeholder, `{{${variable.variable}}}`);
                            }
                            bodyIndex++;
                        });
                    }
                });
            }

             if (variablesAdditionalView.length > 0) {
                updatedTemplate.variableshidden = variablesAdditionalView;
            }

            if (variablesUrlView.length > 0) {
                if (updatedTemplate.buttonsgeneric) {
                    updatedTemplate.buttonsgeneric.forEach((button, btnIndex) => {
                        if (button.btn.type === 'dynamic') {
                            const variable = variablesUrlView[btnIndex];
                            if (variable && variable.variable) {
                                if (!button.btn.url.includes('{{')) {
                                    button.btn.url += '/{{1}}';
                                }
                                const regex = /{{\d+}}/g;
                                button.btn.url = button.btn.url.replace(regex, `{{${variable.variable}}}`);
                            }
                        }
                    });
                }
                if (updatedTemplate.carouseldata) {
                    updatedTemplate.carouseldata.forEach((item, carouselIndex) => {
                        item.buttons.forEach((button, btnIndex) => {
                            if (button.btn.type === 'dynamic') {
                                const variable = variablesUrlView[btnIndex];
                                if (variable && variable.variable) {
                                    if (!button.btn.url.includes('{{')) {
                                        button.btn.url += '/{{1}}';
                                    }
                                    const regex = /{{\d+}}/g;
                                    button.btn.url = button.btn.url.replace(regex, `{{${variable.variable}}}`);
                                }
                            }
                        });
                    });
                }
            }

            if (variablesCardImageView.length > 0 && updatedTemplate.carouseldata) {
                variablesCardImageView.forEach((variables, carouselIndex) => {
                    if (variables.length > 0 && variables[0].variable) {
                        updatedTemplate.carouseldata[carouselIndex].header = `{{${variables[0].variable}}}`;
                    }
                });
            }

            if (variablesHeaderView.length > 0 && updatedTemplate.header) {
                variablesHeaderView.forEach((variable, index) => {
                    const placeholder = `{{${index + 1}}}`;
                    if (updatedTemplate.header.indexOf(placeholder) !== -1) {
                        updatedTemplate.header = updatedTemplate.header.replace(placeholder, `{{${variable.variable}}}`);
                    } else {
                        updatedTemplate.header = `{{${variable.variable}}}`;
                    }
                });
            }


            Object.keys(variableSelections).forEach(key => {
                let type, number, carouselIndexStr;
                if (key.startsWith('carousel')) {
                    [type, carouselIndexStr, number] = key.split('-');
                } else {
                    [type, number, carouselIndexStr] = key.split('-');
                }
                const header = variableSelections[key];
                const columns = templateData.fields?.columns || [];
                const fieldNumber = columns.indexOf(header) + 2;
            
                if (type === 'body' && updatedTemplate.body) {
                    const placeholders = [...updatedTemplate.body.matchAll(/{{field(\d+)}}/g)];
                    if (placeholders.length >= number) {
                        const currentField = placeholders[number - 1][0];
                        const selectedOption = variableSelections[`body-${number}`];
                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
            
                        let newField = currentField; 
                        if (selectedOption) {
                            const matchingField = Object.keys(allVariables).find(key => allVariables[key].column === selectedOption);
                            if (matchingField) {
                                newField = `{{${matchingField}}}`;
                                console.log(`Updated body variable ${number} to ${newField}`);
                            }
                        } else {
                            const fieldNumber = columns.indexOf(selectedOption) + 2;
                            newField = `{{field${fieldNumber}}}`;
                        }
            
                        updatedTemplate.body = updatedTemplate.body.replace(currentField, newField);
                    }
                } else if (type === 'header' && updatedTemplate.header) {
                    const placeholders = [...updatedTemplate.header.matchAll(/{{field(\d+)}}/g)];
                    if (placeholders.length >= number) {
                        const currentField = placeholders[number - 1][0];
                        const newField = `{{field${fieldNumber}}}`;
                        updatedTemplate.header = updatedTemplate.header.replace(currentField, newField);
                    }
                } else if (type === 'cardImage' && updatedTemplate.carouseldata) {
                    const carouselIndex = parseInt(number, 10);
                    console.log(`Processing cardImage for carouselIndex: ${carouselIndex}`);
                    if (!isNaN(carouselIndex) && updatedTemplate.carouseldata[carouselIndex]) {
                        if (header === 'Default ') {
                            const messageTemplateName = multiData[4].data[0].messagetemplatename;
                            console.log('messageTemplateName:', messageTemplateName);
                            const campaign = multiData[3].data.find(campaign => campaign.name === messageTemplateName);
                            if (campaign && campaign.carouseldata[carouselIndex]) {
                                updatedTemplate.carouseldata[carouselIndex].header = campaign.carouseldata[carouselIndex].header;
                                console.log(`Updated updatedTemplate.carouseldata[${carouselIndex}].header to: ${campaign.carouseldata[carouselIndex].header}`);
                            } else {
                                console.log(`No matching campaign found in multiData[3] for messagetemplatename: ${messageTemplateName}`);
                            }
                        } else {
                            const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                            console.log('allVariables:', allVariables);
                            const selectedField = Object.keys(allVariables).find(key => allVariables[key].column === header);
                            console.log('selectedField:', selectedField);
                            if (selectedField) {
                                updatedTemplate.carouseldata[carouselIndex].header = `{{${selectedField}}}`;
                                console.log(`Updated updatedTemplate.carouseldata[${carouselIndex}].header to: {{${selectedField}}}`);
                            } else {
                                console.log(`No matching field found in allVariables for header: ${header}`);
                                const placeholders = [...updatedTemplate.carouseldata[carouselIndex].header.matchAll(/{{field(\d+)}}/g)];
                                if (placeholders.length >= 1) {
                                    const currentField = placeholders[0][0];
                                    const newField = `{{field${fieldNumber}}}`;
                                    updatedTemplate.carouseldata[carouselIndex].header = updatedTemplate.carouseldata[carouselIndex].header.replace(currentField, newField);
                                    console.log(`Fallback: Updated updatedTemplate.carouseldata[${carouselIndex}].header to: ${updatedTemplate.carouseldata[carouselIndex].header}`);
                                }
                            }
                        }
                    }
            
                } else if (type === 'dynamicUrl') {
                    if (updatedTemplate.buttonsgeneric) {
                        updatedTemplate.buttonsgeneric.forEach((button, btnIndex) => {
                            const buttonKey = `dynamicUrl-dynamicUrl-${btnIndex + 1}`;
                            const variableSelectionsValue = variableSelections[buttonKey];
                            if (variableSelectionsValue) {
                                const variableKey = columns.indexOf(variableSelectionsValue) + 2;                                
                                if (variableKey !== -1) {
                                    if (button.btn.type === 'dynamic' && button.btn.url) {
                                        if (!button.btn.url.includes('{{')) {
                                            button.btn.url += '/{{1}}';
                                        }
                                        const regex = /{{field(\d+)}}/g;
                                        button.btn.url = button.btn.url.replace(regex, `{{field${variableKey}}}`);
                                    }
                                } 
                            }
                        });
                    }         
            
                    if (updatedTemplate.carouseldata) {
                        updatedTemplate.carouseldata.forEach((item, carouselIndex) => {
                            item.buttons.forEach((button, btnIndex) => {
                                if (button.btn.type === 'dynamic') {
                                    const buttonKey = `dynamicUrl-dynamicUrl-${carouselIndex}-${btnIndex}`;
                                    const variableSelectionsValue = variableSelections[buttonKey];
                                    if (variableSelectionsValue) {
                                        const field = Object.keys(multiData[4].data[0].fields.allVariables).find(key => multiData[4].data[0].fields.allVariables[key].column === variableSelectionsValue);
                                        const fieldKey = field ? field.replace('field', '') : null;
                                        if (fieldKey) {
                                            if (!button.btn.url.includes('{{')) {
                                                button.btn.url += '/{{1}}';
                                            }
                                            const regex = /{{field(\d+)}}/g;
                                            button.btn.url = button.btn.url.replace(regex, `{{field${fieldKey}}}`);
                                        }
                                    }
                                }
                            });
                        });
                    }
            
                } else if (type === 'carousel' && updatedTemplate.carouseldata) {
                    const carouselIndex = parseInt(carouselIndexStr, 10);
                    if (!isNaN(carouselIndex) && updatedTemplate.carouseldata[carouselIndex]) {
                        const selectedField = variableSelections[key];
                        const field = Object.keys(multiData[4].data[0].fields.allVariables).find(key => multiData[4].data[0].fields.allVariables[key].column === selectedField);
                        const fieldKey = field ? field.replace('field', '') : null;
                        if (fieldKey) {
                            const placeholders = [...updatedTemplate.carouseldata[carouselIndex].body.matchAll(/{{field(\d+)}}/g)];
                            if (placeholders.length >= number) {
                                const currentField = placeholders[number - 1][0];
                                const newField = `{{field${fieldKey}}}`;
                                updatedTemplate.carouseldata[carouselIndex].body = updatedTemplate.carouseldata[carouselIndex].body.replace(currentField, newField);
                            }
                        }
                    }
                } else if (type === 'additional') {
                    const additionalIndex = parseInt(number, 10) - 1;
                    if (!isNaN(additionalIndex) && updatedTemplate.variableshidden) {
                        const selectedOption = variableSelections[`additional-${number}`];
                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
            
                        if (selectedOption) {
                            const matchingField = Object.keys(allVariables).find(key => allVariables[key].column === selectedOption);
                            if (matchingField) {
                                updatedTemplate.variableshidden[additionalIndex] = matchingField;
                                console.log(`Updated additional variable ${number} to ${matchingField}`);
                            }
                        } else {
                            if (updatedTemplate.variableshidden[additionalIndex]) {
                                updatedTemplate.variableshidden[additionalIndex] = `field${fieldNumber}`;
                            }
                        }
                    }
                } else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate.headertype) && variableSelections['video-videoHeader']) {
                    const selectedHeader = variableSelections['video-videoHeader'];
                    if (selectedHeader === 'default') {
                        updatedTemplate.header = templateToUse.header;
                    } else {
                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                        const matchingField = Object.keys(allVariables).find(key => allVariables[key].column === selectedHeader);
                        if (matchingField) {
                            updatedTemplate.header = `{{${matchingField}}}`;
                        } else {
                            const columns = templateData.fields?.columns || [];
                            const fieldNumber = columns.indexOf(selectedHeader) + 2;
                            if (!isNaN(fieldNumber)) {
                                updatedTemplate.header = `{{field${fieldNumber}}}`;
                            }
                        }
                    }
                }
            });
           
            if (!row) {
                updatedTemplate.variableshidden = Object.values(selectedAdditionalHeaders).map(
                    header => `field${columns.indexOf(header) + 2}`
                );
            }

            if (resetField && fieldToReset !== null) {
                const placeholders = [...updatedTemplate.body.matchAll(/{{field(\d+)}}/g)];
                if (placeholders.length >= fieldToReset) {
                    const currentField = placeholders[fieldToReset - 1][0];
                    updatedTemplate.body = updatedTemplate.body.replace(currentField, `{{${fieldToReset}}}`);
                }
            }

            console.log('final updatedTemplate:', updatedTemplate);
            setCurrentTemplate(updatedTemplate);
            setDetaildata((prev: any) => ({
                ...prev,
                message: updatedTemplate.body,
                messagetemplateheader: {
                    ...prev.messagetemplateheader,
                    value: updatedTemplate.header
                },
                messagetemplatebuttons: updatedTemplate.buttonsgeneric || [],
                carouseljson: updatedTemplate.carouseldata,
                variableshidden: updatedTemplate.variableshidden
            }));

             const getUsedVariables = (template) => {
                const regex = /{{field(\d+)}}/g;
                const usedVariables = new Set();
                const extractVariables = (str) => {
                    let match;
                    while ((match = regex.exec(str)) !== null) {
                        usedVariables.add(`field${match[1]}`);
                    }
                };
                if (template.body) extractVariables(template.body);
                if (template.header) extractVariables(template.header);
                if (template.footer) extractVariables(template.footer);
                if (template.buttonsgeneric) {
                    template.buttonsgeneric.forEach(button => {
                        if (button.btn.url) extractVariables(button.btn.url);
                    });
                }
                if (template.carouseldata) {
                    template.carouseldata.forEach(carousel => {
                        if (carousel.body) extractVariables(carousel.body);
                        if (carousel.header) extractVariables(carousel.header);
                        carousel.buttons.forEach(button => {
                            if (button.btn.url) extractVariables(button.btn.url);
                        });
                    });
                }
                if (template.variableshidden) {
                    template.variableshidden.forEach(variable => {
                        usedVariables.add(variable);
                    });
                }
                return usedVariables;
            };            
            const usedVariables = getUsedVariables(updatedTemplate);
            setUnavailableVariables([...usedVariables]);   
        }
    }, [headers, selectedHeaders, templateToUse, variableSelections, jsonPersons, variablesBodyView, variablesAdditionalView, variablesCarouselBubbleView, variablesUrlView, variablesHeaderView, variablesCardImageView]);

    //logica para person y lead, previsualizacion de campaña ya creada
    const [unavailableValues, setUnavailableValues] = useState([]);
    const [availableOptions, setAvailableOptions] = useState([]);

    const checkTypeInMultiData = () => {
        return multiData[5]?.data?.some(item => item.type === "PERSON" || item.type === "LEAD");
    };

    const getUnavailableVariableValues = () => {
        const unavailableValues = unavailableVariables.map(variable => {
            const fieldIndex = parseInt(variable.replace('field', ''), 10) - 2;
            return templateData.fields.columns[fieldIndex];
        });
        return unavailableValues;
    };

    const getAvailableOptions = (dataToUse, unavailableValues) => {
        return dataToUse.filter(option => option !== 'Destinatarios' && !unavailableValues.includes(option));
    };

    const getAvailableOptionsForPersonOrLead = () => {
        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
        const allColumns = Object.values(allVariables).map(item => item.column);
        return allColumns.filter(option => option !== 'Destinatarios' && !unavailableValues.includes(option));
    };

    useEffect(() => {
        if (checkTypeInMultiData()) {
            const campaignVariables = multiData[4].data[0].fields.campaignvariables || {};
            const newUnavailableValues = Object.values(campaignVariables).map(variable => variable.column);
            setUnavailableValues(newUnavailableValues);
            const newAvailableOptions = getAvailableOptionsForPersonOrLead();
            setAvailableOptions(newAvailableOptions);
            //console.log('Available Options for PERSON or LEAD:', newAvailableOptions);
        } else {
            const newUnavailableValues = getUnavailableVariableValues();
            setUnavailableValues(newUnavailableValues);
            const newAvailableOptions = getAvailableOptions(dataToUse, newUnavailableValues);
            setAvailableOptions(newAvailableOptions);
            //console.log('Available Options:', newAvailableOptions);
        }
    }, [unavailableVariables, templateData.fields?.columns, multiData]);

    //console.log('Unavailable Values:', unavailableValues);


    const getMatchingUnavailableValues = () => {
        if (checkTypeInMultiData()) {
            const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
            const matchingValues = unavailableValues
                .map(value => {
                    return Object.entries(allVariables).find(([key, variable]) => variable.column === value);
                })
                .filter(Boolean) 
                .map(([key, variable]) => ({ field: key, ...variable }));
            return matchingValues;
        }
        return []; 
    };
    
    const matchingUnavailableValues = getMatchingUnavailableValues();
    //console.log('Matching Unavailable Values:', matchingUnavailableValues);

    //console.log('a ver', multiData[4].data[0].fields.campaignvariables);
    
    useEffect(() => {
        updateTemplate();
    }, [variableSelections, selectedAdditionalHeaders]);

    const handleAddVariable = () => {
        setAdditionalVariables(prev => {
            if (prev.length < 10) {
                return [...prev, prev.length + 1];
            }
            return prev;
        });
    }

    const handleRemoveVariable = (indexToRemove: number) => {   
        setAdditionalVariables(prev => {
            const newVariables = prev.filter((_, index) => index !== indexToRemove);
            return newVariables.map((_, index) => index + 1);
        });
    }

    const handleAdditionalVariableChange = (variableNumber: number, selectedOption: Dictionary) => {
        const header = selectedOption ? selectedOption.key : '';    
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
    
        setAdditionalVariableValues(prevValues => {
            const newValues = { ...prevValues, [variableNumber]: value };
            return newValues;
        });

        setSelectedAdditionalHeaders(prev => {
            const newHeaders = { ...prev, [variableNumber]: header };
            return newHeaders;
        });       
        updateTemplate();
    };    

    const collectButtonsFromTemplate = (template: Dictionary) => {
        const buttons = [...(template.buttonsgeneric || []), ...(template.buttonsquickreply || [])];
        return buttons;
    };
    
    useEffect(() => {
        const buttons = collectButtonsFromTemplate(templateToUse);
        setDetaildata(prev => ({
            ...prev,
            messagetemplatebuttons: buttons
        }));
    }, [templateToUse]);

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
        else {-
            setMessageVariables([]);
        }
    }, [detaildata.message]);


    const renderDynamicUrlFields = (carouselIndex, row, buttons) => {
        const dynamicButtons = templateToUse.buttonsgeneric?.filter((button) => button.btn.type === 'dynamic') || [];
        const carouselDynamicButtons = templateToUse.carouseldata?.flatMap((item, index) =>
            item.buttons.filter((button) => button.btn.type === 'dynamic').map((button, btnIndex) => ({
                button,
                btnIndex,
                carouselIndex: index
            }))
        ) || [];
        const allDynamicButtons = buttons.length ? buttons : [...dynamicButtons, ...carouselDynamicButtons];
    
        const campaignVariables = multiData[4].data[0].fields?.campaignvariables || {};
    
        return allDynamicButtons.map((buttonData, index) => {
            const key = buttonData.carouselIndex !== undefined ?
                `dynamicUrl-${buttonData.carouselIndex}-${buttonData.btnIndex}` :
                `dynamicUrl-${index + 1}`;
    
            let valueDefault;
    
            const dynamicUrlField = Object.values(campaignVariables).find(
                field => field.type === 'dynamicUrl' && field.index === key
            );
    
            if (!dynamicUrlField) {
                const nonCarouselDynamicUrlField = Object.values(campaignVariables).find(
                    field => field.type === 'dynamicUrl' && field.index === `dynamicUrl-dynamicUrl-${index + 1}`
                );
    
                if (nonCarouselDynamicUrlField) {
                    valueDefault = nonCarouselDynamicUrlField.column;
                }
            } else {
                valueDefault = dynamicUrlField.column;
            }
    
            if (!valueDefault) {
                if (row) {
                    const fieldsInButtons = extractFieldKeysFromButtonsgeneric(currentTemplate.buttonsgeneric, currentTemplate.carouseldata);
                    const fieldKey = fieldsInButtons[index];
                    if (fieldKey) {
                        const matchingField = matchingUnavailableValues.find(item => item.field === fieldKey);
                        if (matchingField) {
                            valueDefault = matchingField.column ? matchingField.column : undefined;
                        } else {
                            const fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                            const valor = templateData.fields.columns[fieldIndex];
                            valueDefault = valor ? valor : undefined;
                        }
                    } else {
                        valueDefault = undefined;
                    }
                } else {
                    if (buttonData && buttonData.button) {
                        const match = buttonData.button.btn.url.match(/{{field(\d+)}}/);
                        if (match) {
                            const fieldNumber = parseInt(match[1], 10) - 2;
                            valueDefault = templateData.fields.columns[fieldNumber];
                        }
                    }
                }
            }
    
            const selectedValue = variableSelections[key];
            if (selectedValue) {
                valueDefault = selectedValue;
            } else if (!valueDefault || valueDefault === 'default') {
                const defaultValue = getValueDefault('dynamicUrl', key);
                valueDefault = defaultValue ? defaultValue.value : '';
            }
        
            if (buttonData.carouselIndex !== undefined && row && buttons.length > 0) {
                return null;
            }
    
            const allOptions = row
                ? [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])]
                : availableData;
        
            return (
                <div key={key}>
                    <p style={{ marginBottom: '3px' }}>{`Url Dinamico {{${index + 1}}}`}</p>
                    <FieldSelectDisabled
                        variant="outlined"
                        uset={true}
                        className="col-12"
                        data={allOptions.map((header) => ({ key: header, value: header }))}
                        optionDesc="value"
                        optionValue="key"
                        valueDefault={valueDefault}
                        onChange={(selectedOption) => handleVariableChange(key, selectedOption, 'dynamicUrl')}
                        getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                    />
                </div>
            );
        });
    };
     
    const campaignVariablesMulti = multiData[4].data[0].fields?.campaignvariables || {};
    const columnsInCampaignVariables = new Set(Object.values(campaignVariablesMulti).map(variable => variable.column));
    const availableColumnsMulti = availableData.filter(column => !columnsInCampaignVariables.has(column));
    //console.log('availableColumnsMulti:', availableColumnsMulti);
    //console.log('templateData', templateData)
    
    return (
        <React.Fragment>
            <div className={classes.containerDetail} style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%' }}>
                    <div className="row-zyx">

                    <FormControl className="col-12">
                        {row ? (                           
                            <>
                                <div style={{ fontSize: '1rem', color: 'black' }}> {'Destinatarios'} </div>
                                <div className={classes.subtitle}> {'Selecciona la columna que contiene los destinatarios para el envio del mensaje'} </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ flex: 1 }}>
                                        {(() => {
                                            let valueDefault;
                            
                                            if (row) {
                                                const campaignVariables = multiData[4].data[0].fields?.campaignvariables || {};
                                                for (const field in campaignVariables) {
                                                    if (campaignVariables[field].type === 'receiver') {
                                                        valueDefault = campaignVariables[field].column;
                                                    }
                                                }
                                            }
                                            const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])];                            
                                            return (
                                                <FieldSelectDisabled
                                                    variant="outlined"
                                                    uset={true}
                                                    disabled={row ? true : false}
                                                    label='Campos archivo'
                                                    className="col-12"
                                                    data={checkTypeInMultiData() ? allOptions.map(header => ({ key: header, value: header })) : dataToUse.map(header => ({ key: header, value: header }))}
                                                    optionDesc="value"
                                                    optionValue="key"
                                                    valueDefault={valueDefault}
                                                    onChange={(selectedOption) => handleVariableChange('1', selectedOption, 'receiver')}
                                                    getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                />
                                            );
                                        })()}
                                    </div>
                                    <Tooltip
                                        title={'Selecciona el campo de columna que contiene los destinatarios para el envío del mensaje.'}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                    </Tooltip>
                                </div>
                            </>
                                      
                        ) : (
                            <>                                                        
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Destinatarios'} </div>
                                <div className={classes.subtitle}> {'Selecciona la columna que contiene los destinatarios para el envio del mensaje'} </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <div style={{ flex: 1 }}>
                                        <FieldSelectDisabled
                                            variant="outlined"
                                            uset={true}
                                            disabled={row ? true : false}
                                            label='Campos archivo'
                                            className="col-12"
                                            data={dataToUse.map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={selectedHeader ? { key: selectedHeader, value: selectedHeader } : ''}
                                            onChange={(selectedOption) => handleVariableChange('1', selectedOption, 'receiver')}
                                            getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
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
                            
                            </>     
                           
                        )}



                       
                    </FormControl>



                        <FormControl className="col-12">
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Requeridas'} </div>
                            <div className="subtitle"> {'Selecciona los campos que ocuparán la posición de cada variable para el envío de la campaña'} </div>
                           
                            <div className={classes.containerStyle}>                             
                            {row ? (
                                     (
                                        (() => {
                                            const campaignVariables = multiData[4].data[0].fields?.campaignvariables || {};
                                            const headerFields = Object.values(campaignVariables).filter(field => field.type === 'header');


                                            const maxIndex = Math.max(...headerFields.map(field => parseInt(field.index, 10)), 0);

                                            return Array.from({ length: maxIndex }, (_, index) => {
                                                const field = headerFields.find(field => parseInt(field.index, 10) === index + 1);
                                                let valueDefault;


                                                if (field) {
                                                    valueDefault = field.column ? (field.column === 'default' ? 'Default ' : field.column) : 'Default ';
                                                } else {
                                                    const fieldsInHeader = extractFieldKeysFromTemplate(currentTemplate.header);
                                                    const fieldKey = fieldsInHeader[index];
                                                    if (fieldKey) {
                                                        const matchingField = matchingUnavailableValues.find(item => item.field === fieldKey);
                                                        if (matchingField) {
                                                            valueDefault = matchingField.column ? matchingField.column : undefined;
                                                        } else {
                                                            const fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                                            const valor = templateData.fields.columns[fieldIndex];
                                                            valueDefault = valor ? valor : undefined;
                                                        }
                                                    } else {
                                                        valueDefault = undefined;
                                                    }
                                                }

                                                const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column), 'Default '])];
                                             

                                                return (
                                                    <div key={`header-${index + 1}`}>
                                                        <p style={{ marginBottom: '3px' }}>{`Variable Cabecera {{${index + 1}}}`}</p>
                                                        <FieldSelectDisabled
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={[{ key: 'default', value: 'Default ' }, ...allOptions.map(header => ({ key: header, value: header }))]}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={valueDefault}
                                                            onChange={(selectedOption) => handleVariableChange((index + 1).toString(), selectedOption, 'header')}
                                                            getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                        />
                                                    </div>
                                                );
                                            });
                                        })()
                                    ) 
                                ) : (
                                <>
                                    {headerVariables.map((variable: Dictionary) => (
                                        <div key={variable.variable}>
                                            <p style={{ marginBottom: '3px' }}>{`Variable Cabecera {{${variable.variable}}}`}</p>
                                            <FieldSelectDisabled
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                data={availableData.map(header => ({ key: header, value: header }))}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={getValueDefault('header', variable.variable)}
                                                onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption, 'header')}
                                                getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>



                            <div className={classes.containerStyle}>                               
                                {(templateToUse.headertype === 'IMAGE' || templateToUse.headertype === 'VIDEO') && (
                                    row ? (
                                        (() => {
                                            const campaignVariables = multiData[4].data[0].fields?.campaignvariables || {};
                                            const headerField = Object.values(campaignVariables).find(field => field.type === 'video' || field.type === 'image');
                                            const [valueDefault, setValueDefault] = useState('Default ');
                                    
                                            useEffect(() => {
                                                let initialDefault;
                                    
                                                if (headerField) {
                                                    if (headerField.column) {
                                                        initialDefault = headerField.column === 'default' ? 'Default ' : headerField.column;
                                                    } else if (headerField.value) {
                                                        initialDefault = headerField.value;
                                                    } else {
                                                        initialDefault = 'Default ';
                                                    }
                                                } else {
                                                    initialDefault = 'Default ';
                                                }
                                                                                    
                                                const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                                                if (initialDefault && initialDefault !== 'Default ') {
                                                    const selectedField = Object.keys(allVariables).find(key => allVariables[key].column === initialDefault);
                                                    if (selectedField) {
                                                        initialDefault = allVariables[selectedField].column;
                                                    }
                                                }
                                    
                                                setValueDefault(initialDefault);
                                                console.log('Initial valueDefault:', initialDefault);
                                            }, [headerField, multiData]);
                                    
                                            const allOptions = [
                                                'Default ',
                                                ...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])
                                            ];
                                    
                                            const handleVariableChangeWithUpdate = (variableNumber, selectedOption, variableType) => {
                                                console.log('FieldSelectDisabled onChange selectedOption:', selectedOption);
                                                setValueDefault(selectedOption.key); // Actualizar el valor predeterminado
                                                handleVariableChange(variableNumber, selectedOption, variableType);
                                            };
                                    
                                            return (
                                                <div key={`header`}>
                                                    <p style={{ marginBottom: '3px' }}>{`Cabecera Multimedia`}</p>
                                                    <FieldSelectDisabled
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={allOptions.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={valueDefault}
                                                        onChange={(selectedOption) => handleVariableChangeWithUpdate('videoHeader', selectedOption, 'video')}
                                                        getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                    />
                                                </div>
                                            );
                                        })()
                         
                            
                          
                                                     
                                
                                    ) : (
                                        <div>
                                            <p style={{ marginBottom: '3px' }}>{`Cabecera Multimedia`}</p>
                                            <FieldSelectDisabled
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                data={[{ key: 'default', value: 'Default ' }, ...availableData.map(header => ({ key: header, value: header }))]}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={getValueDefault('video', 'videoHeader')}
                                                onChange={(selectedOption) => handleVariableChange('videoHeader', selectedOption, 'video')}
                                                getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                           
                            <div className={classes.containerStyle}>
                                {row ? (
                                    <>
                                      {variablesBodyView.map((variable, index) => {
                                        const fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.body);
                                        const fieldKey = fieldsInBody[index];
                                        let valueDefault;

                                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                                        const selectedField = Object.keys(allVariables).find(key => allVariables[key].column === fieldKey);
                                        if (selectedField) {
                                            valueDefault = allVariables[selectedField].column;
                                        } else {
                                            const matchingField = matchingUnavailableValues.find(item => item.field === fieldKey);
                                            if (matchingField) {
                                                valueDefault = matchingField.column ? matchingField.column : undefined;
                                            } else {
                                                const fieldIndex = fieldKey ? parseInt(fieldKey.replace('field', ''), 10) - 2 : -1;
                                                const valor = templateData.fields.columns[fieldIndex];
                                                valueDefault = valor ? valor : undefined;
                                            }
                                        }

                                        const selectedValue = variableSelections[`body-${index + 1}`];
                                        if (selectedValue) {
                                            valueDefault = selectedValue;
                                        }

                                        const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])];

                                        return (
                                            <div key={`body-${index + 1}`}>
                                                <p style={{ marginBottom: '3px' }}>{`Variable Cuerpo {{${index + 1}}}`}</p>
                                                <FieldSelectDisabled
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    data={allOptions.map(header => ({ key: header, value: header }))}
                                                    optionDesc="value"
                                                    optionValue="key"
                                                    valueDefault={valueDefault}
                                                    onChange={(selectedOption) => {
                                                        handleVariableChange(index + 1, selectedOption, 'body');
                                                        setVariableSelections(prev => ({
                                                            ...prev,
                                                            [`body-${index + 1}`]: selectedOption.key
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}



                                    </>
                                                    
                                ) : (
                                    <>
                                        {bodyVariables.map((variable, index) => {
                                            const valueDefault = selectedHeaders[`body-${index + 1}`]
                                                ? { key: selectedHeaders[`body-${index + 1}`], value: selectedHeaders[`body-${index + 1}`] }
                                                : undefined;

                                                console.log(`Value Default creacion:`, valueDefault);

                                            return (
                                                <div key={`body-${index + 1}`}>
                                                    <p style={{ marginBottom: '3px' }}>{`Variable Cuerpo {{${variable.variable}}}`}</p>
                                                    <FieldSelectDisabled
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={availableData.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={valueDefault}
                                                        onChange={(selectedOption) => handleVariableChange(index + 1, selectedOption, 'body')}
                                                        getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                  



                            {templateToUse.category === "AUTHENTICATION" && (
                                <div className={classes.containerStyle}>
                                    {templateAux.category === "AUTHENTICATION" && (
                                        <div key="authentication-variable">
                                            <p style={{ marginBottom: '3px' }}>Variable Autenticación</p>
                                            <FieldSelectDisabled
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                data={availableData.map(header => ({ key: header, value: header }))}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={selectedHeaders[`body-authentication`] ? { key: selectedHeaders[`body-authentication`], value: selectedHeaders[`body-authentication`] } : undefined}
                                                onChange={(selectedOption) => handleVariableChange('authentication', selectedOption, 'body')}
                                                getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                       

                           <div style={{marginTop:'1rem'}}>

                           {templateToUse.carouseldata?.map((item, index) => {
                                const hasDynamicButton = item.buttons.some(button => button.btn.type === 'dynamic');
                                return (
                                    <div key={`card-${index}`} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                                        <div style={{fontSize:'1.2rem', fontWeight:'bolder'}}>{`Card ${index + 1}`}</div>
                                        
                                        <div className={classes.containerStyle}>                                       
                                            {item.header && (
                                                row ? (
                                                    (() => {
                                                        const cardImageFields = multiData[4].data[0].fields?.campaignvariables || {};
                                                        const cardImageField = Object.values(cardImageFields).find(field => field.type === 'cardImage' && parseInt(field.index, 10) === index + 1);
                                                        let valueDefault;
                                                        if (cardImageField) {
                                                            valueDefault = cardImageField.column ? (cardImageField.column === 'default' ? 'Default ' : cardImageField.column) : 'Default ';
                                                        } else {
                                                            valueDefault = 'Default ';
                                                        }                                                    
                                                        const recentSelection = variableSelections[`cardImage-${index + 1}`];
                                                        if (recentSelection) {
                                                            valueDefault = recentSelection;
                                                        } else {
                                                            const selectedKey = Object.keys(allVariables).find(key => allVariables[key].column === valueDefault);
                                                            if (selectedKey) {
                                                                valueDefault = allVariables[selectedKey].column;
                                                            }
                                                        }                                                  
                                                        const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column), 'Default '])];
                                                        return (
                                                            <div key={`cardImage-${index}`}>
                                                                <p style={{ marginBottom: '3px' }}>{`Card Imagen`}</p>
                                                                <FieldSelectDisabled
                                                                    variant="outlined"
                                                                    uset={true}
                                                                    className="col-12"
                                                                    data={allOptions.map(header => ({ key: header, value: header }))}
                                                                    optionDesc="value"
                                                                    optionValue="key"
                                                                    valueDefault={valueDefault}
                                                                    onChange={(selectedOption) => {
                                                                        console.log(`Updating valueDefault for cardImage-${index + 1} with`, selectedOption);
                                                                        handleVariableChange((index + 1).toString(), selectedOption, 'cardImage', index);
                                                                        setVariableSelections(prev => ({
                                                                            ...prev,
                                                                            [`cardImage-${index + 1}`]: selectedOption.key
                                                                        }));
                                                                    }}
                                                                    getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                                />
                                                            </div>
                                                        );
                                                    })()                                                    
                                                ) : (
                                                    <div>
                                                        <p style={{ marginBottom: '3px' }}>{`Card Imagen`}</p>
                                                        <FieldSelectDisabled
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={[{ key: 'default', value: 'Default ' }, ...availableData.map(header => ({ key: header, value: header }))]}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={getValueDefault('cardImage', (index + 1).toString())}
                                                            onChange={(selectedOption) => handleVariableChange((index + 1).toString(), selectedOption, 'cardImage')}
                                                            getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>  



                                        <div className={classes.containerStyle}>                                       
                                        {row ? (
                                            variablesCarouselBubbleView[index]?.map((variable, variableIndex) => {
                                                const fieldsInBody = extractFieldKeysFromTemplate(currentTemplate.carouseldata[index].body);
                                                const fieldKey = fieldsInBody[variableIndex];
                                                let valueDefault;
                                                const selectedOption = variableSelections[`carousel-bubble-${variableIndex + 1}`];
                                                if (selectedOption) {
                                                    valueDefault = selectedOption;
                                                } else {
                                                    if (fieldKey) {
                                                        const matchingField = matchingUnavailableValues.find(item => item.field === fieldKey);
                                                        if (matchingField) {
                                                            valueDefault = matchingField.column ? matchingField.column : undefined;
                                                            console.log(`matchingField found, valueDefault: ${valueDefault}`);
                                                        } else {
                                                            const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                                                            const selectedField = Object.keys(allVariables).find(key => allVariables[key].column === fieldKey);
                                                            if (selectedField) {
                                                                valueDefault = allVariables[selectedField].column;
                                                                console.log(`Updated valueDefault for carousel-bubble-${variableIndex} with: ${valueDefault}`);
                                                            } else {
                                                                const fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                                                const valor = templateData.fields.columns[fieldIndex];
                                                                valueDefault = valor ? valor : undefined;
                                                            }
                                                        }
                                                    } else {
                                                        valueDefault = undefined;
                                                    }
                                                }
                                                const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])];
                                                return (
                                                    <div key={`carousel-${index}-bubble-${variableIndex}`}>
                                                        <p style={{ marginBottom: '3px' }}>{`Variable Burbuja {{${variableIndex + 1}}}`}</p>
                                                        <FieldSelectDisabled
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={allOptions.map(header => ({ key: header, value: header }))}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={valueDefault}
                                                            onChange={(selectedOption) => {
                                                                console.log(`Updating valueDefault for carousel-bubble-${variableIndex + 1} with`, selectedOption);
                                                                handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index);
                                                                setVariableSelections(prev => ({
                                                                    ...prev,
                                                                    [`carousel-bubble-${variableIndex + 1}`]: selectedOption.key
                                                                }));
                                                            }}
                                                            getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                        />
                                                    </div>
                                                );
                                            })




                                            ) : (
                                                item.body && item.body.match(/{{\d+}}/g)?.map((match, variableIndex) => (
                                                    <div key={`carousel-${index}-bubble-${variableIndex}`}>
                                                        <p style={{ marginBottom: '3px' }}>{`Variable Burbuja {{${variableIndex + 1}}}`}</p>
                                                        <FieldSelectDisabled
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={availableData.map(header => ({ key: header, value: header }))}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={getValueDefault('carousel', (variableIndex + 1).toString(), index)}
                                                            onChange={(selectedOption) => handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index)}
                                                            getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                        />
                                                    </div>
                                                ))
                                            )}  
                                        </div>                                       
                                        

                                        {hasDynamicButton && (
                                            <div className={classes.containerStyle}>
                                                {renderDynamicUrlFields(index, row, [])}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            
                           </div>

                           {(templateToUse.buttonsgeneric?.some(button => button.btn.type === 'dynamic')) && (
                                <div className={classes.containerStyle}>
                                    {renderDynamicUrlFields(null, row, templateToUse.buttonsgeneric?.filter(button => button.btn.type === 'dynamic') || [])}
                                </div>
                            )}

                        </FormControl>
    
                      

                        <FormControl className="col-12">
                            <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Adicionales'} </div>
                            <div className={classes.subtitle}> {'Selecciona los campos adicionales que deseas que viajen en conjunto con la campaña, se utiliza para dar trazabilidad al cliente. También para poder utilizarlo en reportes personalizados y en flujos'} </div>
                            <div style={{ width: '50%', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={handleAddVariable}>
                                <AddIcon /> Añadir variable adicional
                            </div>
                            <div className={classes.containerStyle}>
                            {row ? (
                                <>
                                    {variablesAdditionalView.map((variable, index) => {
                                        const fieldKey = variable.replace(/"/g, '');
                                        let valueDefault;

                                        if (fieldKey) {
                                            const matchingField = matchingUnavailableValues.find(item => item.field === fieldKey);
                                            if (matchingField) {
                                                valueDefault = matchingField.column ? matchingField.column : undefined;
                                            } else {
                                                const allVariables = multiData[4].data[0].fields?.allVariables || {};
                                                const allVariablesField = allVariables[fieldKey];
                                                if (allVariablesField) {
                                                    valueDefault = allVariablesField.column ? allVariablesField.column : undefined;
                                                } else {
                                                    const fieldIndex = parseInt(fieldKey.replace('field', ''), 10) - 2;
                                                    const valor = templateData.fields.columns[fieldIndex];
                                                    valueDefault = valor ? valor : undefined;
                                                }
                                            }
                                        } else {
                                            valueDefault = undefined;
                                        }

                                        const allOptions = [...new Set([...availableOptions, ...matchingUnavailableValues.map(item => item.column)])];

                                        return (
                                            <div style={{ flex: 1 }} key={`additional-${index + 1}`}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <p>{`Variable Adicional {{${index + 1}}}`}</p>
                                                    <DeleteIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => handleRemoveVariable(index)} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <FieldSelectDisabled
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={checkTypeInMultiData()
                                                            ? allOptions.map(header => ({ key: header, value: header }))
                                                            : dataToUse.map(header => ({ key: header, value: header }))
                                                        }
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={valueDefault}
                                                        onChange={(selectedOption) => handleVariableChange((index + 1).toString(), selectedOption, 'additional')}
                                                        getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (

                                    <>
                                        {additionalVariables.map((variable, index) => (
                                            <div style={{ flex: 1 }} key={index}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <p>{`Variable {{${variable}}}`}</p>
                                                    <DeleteIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => handleRemoveVariable(index)} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <FieldSelectDisabled
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={availableData.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={selectedAdditionalHeaders[variable] ? { key: selectedAdditionalHeaders[variable], value: selectedAdditionalHeaders[variable] } : undefined}
                                                        onChange={(selectedOption) => handleAdditionalVariableChange(variable, selectedOption)}
                                                        getOptionDisabled={(option: Dictionary) => option.key === 'No quedan más variables'}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </FormControl>
                    </div>
                </div>

                <div className={classes.containerDetail} style={{marginLeft:'1rem', width:'50%'}}>             
                    <div style={{fontSize:'1.2rem'}}>{t('Previsualización del mensaje')}</div> 
                    <TemplatePreview
                        selectedTemplate={templateToUse}
                        bodyVariableValues={bodyVariableValues}
                        headerVariableValues={headerVariableValues}
                        videoHeaderValue={videoHeaderValue}
                        cardImageValues={cardImageValues}
                        dynamicUrlValues={dynamicUrlValues}
                        bubbleVariableValues={bubbleVariableValues}
                        carouselVariableValues={carouselVariableValues}
                        selectedAuthVariable={selectedAuthVariable}
                    />                    
                    <FormControl style={{ width: '100%' }}>
                        <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Adicionales'} </div>
                        <div className={classes.subtitle}> {'Previsualiza un ejemplo de las variables adicionales elegidas en el apartado de Variables Adicionales'} </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                        {row ? (
                            variablesAdditionalView.map((variable, index) => {
                                const cleanVariable = variable.replace(/"/g, '');
                                const fieldNumber = parseInt(cleanVariable.replace("field", ""), 10) - 2;
                                let valueDefault;
                                
                                if (cleanVariable) {
                                    const matchingField = matchingUnavailableValues.find(item => item.field === cleanVariable);
                                    if (matchingField) {
                                        valueDefault = matchingField.value ? matchingField.value : undefined;
                                    } else {
                                        const allVariables = multiData[4]?.data[0]?.fields?.allVariables || {};
                                        const allVariablesField = allVariables[cleanVariable];
                                        if (allVariablesField) {
                                            valueDefault = allVariablesField.value ? allVariablesField.value : undefined;
                                        } else {
                                            const valor = templateData.fields.columns[fieldNumber];
                                            valueDefault = valor ? valor : undefined;
                                        }
                                    }
                                } else {
                                    valueDefault = undefined;
                                }
                                
                                return (
                                    <div style={{ flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }} key={`additional-${index + 1}`}>
                                            <p>{`Variable Adicional {{${index + 1}}}`}</p>
                                            <div style={{ flex: 1 }}>
                                                <FieldEdit
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    valueDefault={valueDefault || 'Sin valor'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    )
                            })
                            ) : (
                                additionalVariables.map((variable, index) => (
                                    <div style={{ flex: '1 1 calc(25% - 20px)', boxSizing: 'border-box' }} key={index}>
                                        <p>{`Variable ${variable}`}</p>
                                        <div style={{ flex: 1 }}>
                                            <FieldEdit
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                valueDefault={additionalVariableValues[variable] || 'Sin valor'}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </FormControl>
                </div> 
            </div>
        </React.Fragment>
    )
}