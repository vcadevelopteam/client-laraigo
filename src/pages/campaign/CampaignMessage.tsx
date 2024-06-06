import React, { useEffect, useState } from 'react'; 
import { FieldEdit, FieldEditWithSelect, FieldView, FieldSelect } from 'components';
import { Dictionary, ICampaign, MultiData } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { filterPipe } from 'common/helpers';
import { FrameProps } from './CampaignDetail';
import { Box } from '@material-ui/core';
import FieldEditWithSelectCampaign from './FieldEditWithSelectCampaign';
import { FilePreview } from './components/FilePreview';
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
    setSave: (value: any) => void;
    messageVariables: Dictionary[];
    setMessageVariables: (value: Dictionary[]) => void;
    dataButtons: Dictionary[];
    setDataButtons: (value: any[]) => void;
    templateAux: Dictionary;
    jsonPersons: Dictionary;
}

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },    
    mb1: {
        marginBottom: '0.25rem',
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
        this.changer = () => null;
        this.top = 0;
        this.left = 0;
    }
}

export const CampaignMessage: React.FC<DetailProps> = ({ row, edit, auxdata, detaildata, setDetaildata, multiData, fetchData, tablevariable, frameProps, setFrameProps, setPageSelected, setSave, messageVariables, setMessageVariables, templateAux, jsonPersons, setDataButtons}) => {
    
    const classes = useStyles();
    const { t } = useTranslation();
    const [tablevariableShow, setTableVariableShow] = useState<Dictionary[]>([]);
    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());
    const [allVariables, setAllVariables] = useState<string[]>([]);
    const dataMessageTemplate = [...multiData[3] && multiData[3].success ? multiData[3].data : []];
    const templateId = templateAux.id;
    const selectedTemplate = dataMessageTemplate.find(template => template.id === templateId) || {};
    const bodyVariables = selectedTemplate.bodyvariables;
    const [variableValues, setVariableValues] = useState<Dictionary>({});
    const headers = jsonPersons.length > 0 ? Object.keys(jsonPersons[0]) : [];
    const [selectedHeader, setSelectedHeader] = useState<string | null>(null);
    let counter = 1;
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: number]: string }>({});
    const [additionalVariables, setAdditionalVariables] = useState<number[]>([1]);
    const [additionalVariableValues, setAdditionalVariableValues] = useState<Dictionary>({});
    const [selectedAdditionalHeaders, setSelectedAdditionalHeaders] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const detectedVariables = (detaildata.message.match(/{{(.*?)}}/g) || []);
        console.log('Variables detectadas:', detectedVariables);
        setAllVariables(detectedVariables);
    }, [detaildata.message]);

    const toggleVariableSelect = (e: React.ChangeEvent<Dictionary>, item: Dictionary, inputkey: string, changefunc: ({ ...param }) => void, filter = true) => {        
        const elem = e.target;
        if (elem) {
            const selectionStart = elem.selectionStart || 0;
            const lines = (elem.value || '').substr(0, selectionStart).split('\n');
            const row = lines.length - 1;
            const column = lines[row].length * 3;
            const startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
            let partialText = '';
            const detectedVariables = (elem.value.match(/{{(.*?)}}/g) || []);
            setAllVariables(detectedVariables);

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
                    });
                    if (filter) {
                        setTableVariableShow(filterPipe(tablevariable, 'description', partialText, '%'));
                    } else {
                        setTableVariableShow(tablevariable);
                    }
                } else {
                    setVariableHandler(new VariableHandler());
                }
            } else {
                setVariableHandler(new VariableHandler());
            }
        }
    }

    const selectionVariableSelect = (e: React.ChangeEvent<Dictionary>, value: string) => {
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

    const handleHeaderChange = (selectedOption: any) => {
        setSelectedHeader(selectedOption.key);
        setSelectedHeaders(prev => ({ ...prev, main: selectedOption.key }));
    };   
    
    const handleVariableChange = (variableName: string, selectedOption: { key: string, value: string } | null) => {
        if (!selectedOption) {
            setSelectedHeaders(prev => {
                const newHeaders = { ...prev };
                delete newHeaders[variableName];
                return newHeaders;
            });
            const updatedMessage = detaildata.message.replace(`{{${variableName}}}`, `{{${variableName}}}`);
            setDetaildata(prevDetaildata => ({ ...prevDetaildata, message: updatedMessage }));
        } else {
            setSelectedHeaders(prev => ({ ...prev, [variableName]: selectedOption.key }));
            const updatedMessage = detaildata.message.replace(`{{${variableName}}}`, `{{${selectedOption.key}}}`);
            setDetaildata(prevDetaildata => ({ ...prevDetaildata, message: updatedMessage }));
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
        const newData = (detaildata?.messagetemplatebuttons||[]).map(item => 
            item.payload.match(/{{(.*?)}}/) ? { ...item, variables: Object.fromEntries(item.payload.match(/{{(.*?)}}/g).map(variable => [variable.slice(2, -2), ""])) } : item
        );
        setDataButtons(newData)
    }, [detaildata.messagetemplatebuttons])
    
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
                                                onChange={(value: { description: Dictionary; }) => {
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

                        <div  className="col-6">
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
                                    {(allVariables || []).map((variable: string) => {
                                        const variableName = variable.slice(2, -2); 
                                        const currentCounter = counter++;
                                        return (
                                            <div key={variableName}>
                                                <p style={{ marginBottom: '3px' }}>{`Variable {{${currentCounter}}}`}</p>
                                                <FieldSelect
                                                    variant="outlined"
                                                    uset={true}
                                                    className="col-12"
                                                    data={headers
                                                        .filter(header => header !== selectedHeader)
                                                        .map(header => ({ key: header, value: header }))}
                                                    optionDesc="value"
                                                    optionValue="key"
                                                    valueDefault={selectedHeaders[variableName]}
                                                    onChange={(selectedOption) => handleVariableChange(variableName, selectedOption)}
                                                />
                                            </div>
                                        );
                                    })}
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

                        <FieldEditWithSelect
                            label={t(langKeys.body)}
                            className="col-6"
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
                        {detaildata?.messagetemplatebuttons?.map((btn: Dictionary, i: number) => {
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
                                            const auxdetail = detaildata
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
                        {Boolean(detaildata?.messagetemplateattachment) && detaildata?.messagetemplateattachment?.split(',').map((f: string, i: number) => (
                            <FilePreview key={`attachment-${i}`} src={f} />
                        ))}
                    </React.Fragment>
                </div>}
            </div>
        </React.Fragment>
    )
}