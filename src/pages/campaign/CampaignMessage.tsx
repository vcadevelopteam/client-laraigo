import React, { useCallback, useEffect, useState } from 'react';
import { FieldEdit, FieldSelect, FieldView } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { FrameProps } from './CampaignDetail';
import { FormControl } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import AddIcon from '@material-ui/icons/Add';
import { langKeys } from 'lang/keys';
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
        return data?.data?.find(template => template.id === id) ?? null;
    };
    const matchingTemplate = getTemplateById(messagetemplateid, multiData[3]);
    const isEmptyData = (data: Dictionary) => {
        return Object.keys(data).length === 0 && data.constructor === Object;
    };    
    const templateToUse = isEmptyData(selectedTemplate) ? matchingTemplate : selectedTemplate;
    const handleHeaderChange = (selectedOption: any) => {       
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
    const [selectedAuthVariable, setSelectedAuthVariable] = useState<string>('');
    const availableData = dataToUse.filter(header => !Object.values({ ...selectedHeaders, ...selectedAdditionalHeaders }).includes(header));
    const [campaignViewDetails, setCampaignViewDetails] = useState<ICampaign | null>(null);
    
    const [variablesBodyView, setVariablesBodyView] = useState<Dictionary[]>([]);
    const [variablesAdditionalView, setVariablesAdditionalView] = useState<string[]>([]);
    const [variablesCarouselBubbleView, setVariablesCarouselBubbleView] = useState<Dictionary[][]>([]);
    const [variablesUrlView, setVariablesUrlView] = useState<Dictionary[]>([]);
    const [variablesCarouselImageView, setVariablesCarouselImageView] = useState<Dictionary[]>([]);


    const processMultiData = (data) => {
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
        console.log('campaignData', multiData[4])

        if (campaignData) {
            const bodyVariables = detectVariablesField(campaignData.message);
            const variablesHiddenMultidata = campaignData.variableshidden || [];
            const carouselBubbleVariables = campaignData.carouseljson ? campaignData.carouseljson.map(item => {
                return detectVariablesField(item.body);
            }) : [];
            const carouselUrlVariables = campaignData.carouseljson ? campaignData.carouseljson.flatMap(item => {
                return item.buttons ? item.buttons.flatMap(button => detectVariablesField(button.btn.url)) : [];
            }) : [];    
            const templateButtonsUrlVariables = campaignData.messagetemplatebuttons ? campaignData.messagetemplatebuttons.flatMap(button => {
                return detectVariablesField(button.btn.url);
            }) : [];
            const allUrlVariables = [...carouselUrlVariables, ...templateButtonsUrlVariables];

            setVariablesBodyView(bodyVariables)
            setVariablesAdditionalView(variablesHiddenMultidata);
            setVariablesCarouselBubbleView(carouselBubbleVariables);
            setVariablesUrlView(allUrlVariables);           
            console.log('a ver', variablesUrlView)
            
            bodyVariables.forEach((variable, index) => {
                const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                processedData.bodyVariableValues[index + 1] = `field${fieldIndex}`;
            });
    
            if (campaignData.headertype === 'TEXT') {
                const headerVariables = detectVariablesField(campaignData.header);
                headerVariables.forEach((variable, index) => {
                    const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                    processedData.headerVariableValues[index + 1] = `field${fieldIndex}`;
                });
            }    

            processedData.videoHeaderValue = campaignData.messagetemplateheader?.value || '';    
            if (campaignData.carouseljson) {
                campaignData.carouseljson.forEach((item, carouselIndex) => {
                    processedData.carouselVariableValues[carouselIndex] = {};
                    if (item.bodyvariables) {
                        item.bodyvariables.forEach((variable, index) => {
                            const fieldIndex = typeof variable.variable === 'string' ? parseInt(variable.variable.replace('field', ''), 10) : variable.variable;
                            processedData.carouselVariableValues[carouselIndex][index + 1] = `field${fieldIndex}`;
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
            const bodyVariables = detectVariablesField(combinedData.message);
            const variablesHiddenMultidata = combinedData.variableshidden || [];           
            const carouselBubbleVariables = combinedData.carouseljson ? combinedData.carouseljson.map(item => {
                return detectVariablesField(item.body);
            }) : [];
            const urlVariables = combinedData.carouseljson ? combinedData.carouseljson.flatMap(item => {
                return item.buttons ? item.buttons.flatMap(button => detectVariablesField(button.btn.url)) : [];
            }) : [];
            const templateButtonsUrlVariables = combinedData.messagetemplatebuttons ? combinedData.messagetemplatebuttons.flatMap(button => {
                return detectVariablesField(button.btn.url);
            }) : [];    
            const allUrlVariables = [...urlVariables, ...templateButtonsUrlVariables];

            setVariablesBodyView(bodyVariables)
            setVariablesAdditionalView(variablesHiddenMultidata)
            setVariablesCarouselBubbleView(carouselBubbleVariables)
            setVariablesUrlView(allUrlVariables)

            const newBodyVariableValues = {}
            const newAdditionalVariableValues = {}
            const newCarouselBubbleVariableValues = {}
            const newDynamicUrlValues = {}

            if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
                const personData = multiData[5].data[0]
                
                Object.entries(processedData.bodyVariableValues).forEach(([key, fieldKey], index) => {
                    newBodyVariableValues[index + 1] = personData[fieldKey];
                })

                variablesHiddenMultidata.forEach(variable => {
                    const fieldIndex = parseInt(variable.replace('field', ''), 10);
                    if (personData[`field${fieldIndex}`]) {
                        newAdditionalVariableValues[variable] = personData[`field${fieldIndex}`];
                    }
                })

                carouselBubbleVariables.forEach((variables, carouselIndex) => {
                    newCarouselBubbleVariableValues[carouselIndex] = {};
                    variables.forEach((variable, index) => {
                        const fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                        newCarouselBubbleVariableValues[carouselIndex][index + 1] = personData[`field${fieldIndex}`];
                    })
                })

                allUrlVariables.forEach((variable, index) => {
                    const fieldIndex = parseInt(variable.variable.replace('field', ''), 10);
                    newDynamicUrlValues[index + 1] = personData[`field${fieldIndex}`];
                })
            }

            setBodyVariableValues(newBodyVariableValues);
            setHeaderVariableValues(processedData.headerVariableValues);
            setVideoHeaderValue(processedData.videoHeaderValue);
            setCardImageValues(processedData.cardImageValues);
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
        }
    }, [multiData]); 

    useEffect(() => {
        if (multiData[5] && multiData[5].data && multiData[5].data.length > 0) {
            const newAdditionalVariableValues = {};
            const personData = multiData[5].data[0];

            variablesAdditionalView.forEach(variable => {
                const fieldIndex = parseInt(variable.replace('field', ''), 10);
                if (personData[`field${fieldIndex}`]) {
                    newAdditionalVariableValues[variable] = personData[`field${fieldIndex}`];
                }
            });

            setAdditionalVariableValues(newAdditionalVariableValues);
        }
    }, [variablesAdditionalView, multiData[5]]);
    
    const handleVariableChange = (variableNumber: string, selectedOption: any, variableType: 'body' | 'header' | 'video' | 'cardImage' | 'dynamicUrl' | 'carousel' | 'authentication', carouselIndex?: number) => {
        const header = selectedOption ? selectedOption.key : '';
        const value = jsonPersons.length > 0 ? jsonPersons[0][header] : '';
    
        if (variableType === 'video') {
            setVideoHeaderValue(value);
        } else if (variableType === 'body') {
            setBodyVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
        } else if (variableType === 'header') {
            setHeaderVariableValues(prevValues => ({
                ...prevValues,
                [variableNumber]: value
            }));
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
        } else if (variableType === 'carousel' && carouselIndex !== undefined) {
            setCarouselVariableValues(prevValues => ({
                ...prevValues,
                [carouselIndex]: {
                    ...prevValues[carouselIndex],
                    [variableNumber]: value
                }
            }));
        } else if (variableType === 'authentication') {
            setSelectedAuthVariable(value);
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
    
        updateTemplate();
    };
    
    const generateKey = (variableType: string, variableNumber: string, carouselIndex?: number) => {
        return `${variableType}-${variableNumber}${carouselIndex !== undefined ? `-${carouselIndex}` : ''}`;
    };
    
    const getValueDefault = (variableType: string, variableNumber: string, carouselIndex?: number) => {
        const key = generateKey(variableType, variableNumber, carouselIndex);
        const header = selectedHeaders[key];    
        if (variableType === 'video' && header === 'default') {
            return { key: 'default', value: 'Default ' };
        }    
        return header ? { key: header, value: header } : undefined;
    };
    
    const updateTemplate = useCallback(() => {
        const updatedTemplate = JSON.parse(JSON.stringify(templateToUse));
    
        if (updatedTemplate.category === "AUTHENTICATION" && !updatedTemplate.body) {
            updatedTemplate.body = "Tu código de verificación es {{1}}. Por tu seguridad, no lo compartas.";
        }
    
        Object.keys(variableSelections).forEach(key => {
            const [type, number, carouselIndexStr] = key.split('-');
            const fieldNumber = headers.indexOf(variableSelections[key]) + 1;
    
            if (type === 'body' && updatedTemplate.body) {
                updatedTemplate.body = updatedTemplate.body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
            } else if (type === 'header' && updatedTemplate.header) {
                updatedTemplate.header = updatedTemplate.header.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
            } else if (type === 'cardImage' && updatedTemplate.carouseldata) {
                const index = parseInt(carouselIndexStr) - 1;
                if (!isNaN(index) && updatedTemplate.carouseldata[index]) {
                    updatedTemplate.carouseldata[index].header = `{{field${fieldNumber}}}`;
                }
            } else if (type === 'dynamicUrl') {
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
                            } else {
                                console.log(`Value "${variableSelectionsValue}" not found in headers`);
                            }
                        } else {
                            console.log(`No selection found for button key: ${buttonKey}`);
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
                const index = parseInt(carouselIndexStr);
                if (!isNaN(index)) {
                    updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
                }
            } else if (type === 'bubble' && updatedTemplate.carouseldata) {
                const index = parseInt(carouselIndexStr);
                if (!isNaN(index)) {
                    updatedTemplate.carouseldata[index].body = updatedTemplate.carouseldata[index].body.replace(`{{${number}}}`, `{{field${fieldNumber}}}`);
                }
            } else if (['VIDEO', 'DOCUMENT', 'IMAGE'].includes(updatedTemplate.headertype) && variableSelections['video-videoHeader']) {
                const selectedHeader = variableSelections['video-videoHeader'];
                if (selectedHeader === 'default') {
                    updatedTemplate.header = templateToUse.header;
                } else {
                    const fieldNumber = headers.indexOf(selectedHeader) + 1;
                    if (!isNaN(fieldNumber)) {
                        updatedTemplate.header = `{{field${fieldNumber}}}`;
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
                        const buttonKey = `dynamicUrl-${index}-${btnIndex}`;
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

        setFilledTemplate(updatedTemplate);
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
    }, [variableSelections, headers, templateToUse, jsonPersons, setDetaildata, selectedAdditionalHeaders]);
    
    const renderDynamicUrlFields = (carouselIndex, row) => {
        const dynamicButtons = templateToUse.buttonsgeneric?.filter(button => button.btn.type === 'dynamic') || [];
        const carouselDynamicButtons = templateToUse.carouseldata?.flatMap((item, index) => 
            item.buttons.filter(button => button.btn.type === 'dynamic' && index === carouselIndex).map((button, btnIndex) => ({
                button,
                btnIndex,
                carouselIndex: index
            }))
        ) || [];
        const allDynamicButtons = [...dynamicButtons, ...carouselDynamicButtons];
    
        return allDynamicButtons.map((buttonData, index) => {
            const key = buttonData.carouselIndex !== undefined ? 
                `dynamicUrl-${buttonData.carouselIndex}-${buttonData.btnIndex}` : 
                `dynamicUrl-${index + 1}`;
    
            let columnName;
            if (row) {
                const fieldNumber = parseInt(variablesUrlView[index]?.variable.replace("field", ""), 10) - 2;
                columnName = templateData.fields.columns[fieldNumber];
            } else {
                const match = buttonData.button.btn.url.match(/{{(\d+)}}/);
                if (match) {
                    const variableNumber = parseInt(match[1], 10) - 2;
                    columnName = templateData.fields.columns[variableNumber];
                } else {
                    columnName = ''; 
                }
            }    
            return (
                <div key={key}>
                    <p style={{ marginBottom: '3px' }}>{`Url Dinamico {{${index + 1}}}`}</p>
                    <FieldSelect
                        variant="outlined"
                        uset={true}
                        className="col-12"
                        data={availableData.map(header => ({ key: header, value: header }))}
                        optionDesc="value"
                        optionValue="key"
                        valueDefault={columnName}
                        onChange={(selectedOption) => handleVariableChange(key, selectedOption, 'dynamicUrl')}
                    />
                </div>
            );
        });
    };
    
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

    console.log('bubbleVariableValues', bubbleVariableValues)

    return (
        <React.Fragment>
            <div className={classes.containerDetail} style={{ display: 'flex', width: '100%' }}>
                <div style={{ width: '50%' }}>
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
                                        data={availableData.map(header => ({ key: header, value: header }))}
                                        optionDesc="value"
                                        optionValue="key"
                                        valueDefault={selectedHeader ? selectedHeader : ''}
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
                                            data={availableData.map(header => ({ key: header, value: header }))}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={getValueDefault('header', variable.variable)}
                                            onChange={(selectedOption) => handleVariableChange(variable.variable, selectedOption, 'header')}
                                        />
                                    </div>
                                ))}
                            </div>
                           
                            <div className={classes.containerStyle}>
                                {row ? (
                                    <>
                                        {variablesBodyView.map((variable, index) => {                                   
                                            const confe = parseInt(variable.variable.replace("field", ""), 10)-2    
                                            const valor = templateData.fields.columns[confe]                                    
                                            return (
                                                <div key={`body-${index + 1}`}>
                                                    <p style={{ marginBottom: '3px' }}>{`Variable Cuerpo {{${index+1}}}`}</p>
                                                    <FieldSelect
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={dataToUse.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={valor}
                                                        onChange={(selectedOption) => handleVariableChange(index + 1, selectedOption, 'body')}
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
                                            return (
                                                <div key={`body-${index + 1}`}>
                                                    <p style={{ marginBottom: '3px' }}>{`Variable Cuerpo {{${variable.variable}}}`}</p>
                                                    <FieldSelect
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={availableData.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={valueDefault}
                                                        onChange={(selectedOption) => handleVariableChange(index + 1, selectedOption, 'body')}
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
                                            <FieldSelect
                                                variant="outlined"
                                                uset={true}
                                                className="col-12"
                                                data={availableData.map(header => ({ key: header, value: header }))}
                                                optionDesc="value"
                                                optionValue="key"
                                                valueDefault={selectedHeaders[`body-authentication`] ? { key: selectedHeaders[`body-authentication`], value: selectedHeaders[`body-authentication`] } : undefined}
                                                onChange={(selectedOption) => handleVariableChange('authentication', selectedOption, 'body')}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={classes.containerStyle}>
                                {(templateToUse.headertype === 'IMAGE' || templateToUse.headertype === 'VIDEO') && (
                                    <div>
                                        <p style={{ marginBottom: '3px' }}>{`Cabecera Multimedia`}</p>
                                        <FieldSelect
                                            variant="outlined"
                                            uset={true}
                                            className="col-12"
                                            data={[{ key: 'default', value: 'Default ' }, ...availableData.map(header => ({ key: header, value: header }))]}
                                            optionDesc="value"
                                            optionValue="key"
                                            valueDefault={getValueDefault('video', 'videoHeader')}
                                            onChange={(selectedOption) => handleVariableChange('videoHeader', selectedOption, 'video')}
                                        />
                                    </div>
                                )}
                            </div>

                           <div style={{marginTop:'1rem'}}>
                            {templateToUse.carouseldata?.map((item, index) => (
                                <div key={`card-${index}`} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                                    <div style={{fontSize:'1.2rem', fontWeight:'bolder'}}>{`Card ${index + 1}`}</div>

                                    <div className={classes.containerStyle}>                                       
                                        {row ? (
                                            variablesCarouselBubbleView[index]?.map((variable, variableIndex) => {
                                                const fieldNumber = parseInt(variable.variable.replace("field", ""), 10) - 2;
                                                const columnName = templateData.fields.columns[fieldNumber];
                                                return (
                                                    <div key={`carousel-${index}-bubble-${variableIndex}`}>
                                                        <p style={{ marginBottom: '3px' }}>{`Variable Burbuja {{${variableIndex + 1}}}`}</p>
                                                        <FieldSelect
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={availableData.map(header => ({ key: header, value: header }))}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={columnName}
                                                            onChange={(selectedOption) => handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index)}
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            item.body && item.body.match(/{{\d+}}/g)?.map((match, variableIndex) => (
                                                <div key={`carousel-${index}-bubble-${variableIndex}`}>
                                                    <p style={{ marginBottom: '3px' }}>{`Variable Burbuja {{${variableIndex + 1}}}`}</p>
                                                    <FieldSelect
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={availableData.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={getValueDefault('carousel', (variableIndex + 1).toString(), index)}
                                                        onChange={(selectedOption) => handleVariableChange((variableIndex + 1).toString(), selectedOption, 'carousel', index)}
                                                    />
                                                </div>
                                            ))
                                        )}  
                                    </div>                                       
                                      
                                    <div className={classes.containerStyle}>
                                        {item.header && (
                                            <div key={`cardImage-${index}`}>
                                                <p style={{ marginBottom: '3px' }}>{`Card Imagen ${index + 1}`}</p>
                                                <FieldSelect
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    data={availableData.map(header => ({ key: header, value: header }))}
                                                    optionDesc="value"
                                                    optionValue="key"
                                                    valueDefault={getValueDefault('cardImage', (index + 1).toString())}
                                                    onChange={(selectedOption) => handleVariableChange((index + 1).toString(), selectedOption, 'cardImage')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className={classes.containerStyle}>
                                        {renderDynamicUrlFields(index, row)}
                                    </div>

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
                                {row ? (
                                    <>
                                        {variablesAdditionalView.map((variable, index) => {
                                            const fieldNumber = parseInt(variable.replace("field", ""), 10) - 2;
                                            const columnName = templateData.fields.columns[fieldNumber];                                           
                                            return (
                                                <div style={{ flex: 1 }} key={`body-${index + 1}`}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <p>{`Variable {{${index + 1}}}`}</p>
                                                        <DeleteIcon style={{ cursor: 'pointer', color: 'grey' }} onClick={() => handleRemoveVariable(index)} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <FieldSelect
                                                            variant="outlined"
                                                            uset={true}
                                                            className="col-12"
                                                            data={dataToUse.map(header => ({ key: header, value: header }))}
                                                            optionDesc="value"
                                                            optionValue="key"
                                                            valueDefault={columnName}
                                                            onChange={(selectedOption) => handleAdditionalVariableChange(index + 1, selectedOption)}
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
                                                    <FieldSelect
                                                        variant="outlined"
                                                        uset={true}
                                                        className="col-12"
                                                        data={availableData.map(header => ({ key: header, value: header }))}
                                                        optionDesc="value"
                                                        optionValue="key"
                                                        valueDefault={selectedAdditionalHeaders[variable] ? { key: selectedAdditionalHeaders[variable], value: selectedAdditionalHeaders[variable] } : undefined}
                                                        onChange={(selectedOption) => handleAdditionalVariableChange(variable, selectedOption)}
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
                    <FormControl className="col-12">
                        <div style={{ fontSize: '1rem', color: 'black' }}> {'Variables Adicionales'} </div>
                        <div className={classes.subtitle}> {'Previsualiza un ejemplo de las variables adicionales elegidas en el apartado de Variables Adicionales'} </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                            {row ? (
                                variablesAdditionalView.map((variable, index) => {
                                    const fieldNumber = parseInt(variable.replace("field", ""), 10) - 2;
                                    const columnName = templateData.fields.columns[fieldNumber];
                                    return (
                                        <div style={{ flex: 1 }} key={`body-${index + 1}`}>
                                            <p>{`Variable ${index + 1}`}</p>
                                            <div style={{ flex: 1 }}>
                                                <FieldEdit
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    valueDefault={additionalVariableValues[variable] || columnName}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                additionalVariables.map((variable, index) => (
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
                                ))
                            )}
                        </div>
                    </FormControl>

                </div> 

            </div>
        </React.Fragment>
    )
}