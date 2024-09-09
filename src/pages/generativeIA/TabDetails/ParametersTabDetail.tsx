import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Button, Card, Grid } from "@material-ui/core";
import { BaseAIPersonalityIcon, ClientServicePersonalityIcon, HelpDeskPersonalityIcon, PersonalizedPersonalityIcon, SalesPersonalityIcon, TechSupportPersonalityIcon } from "icons";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { FieldEdit, FieldEditMultiAux, FieldMultiSelect, FieldSelect, IOSSwitch } from "components";
import { Dictionary } from "@types";
import { FieldErrors } from "react-hook-form";
import Tooltip from '@material-ui/core/Tooltip';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    containerDetail2: {
        padding: theme.spacing(2),
        background: "#F9F9FA",
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    cardsContainer: {
        marginTop:"1.5rem",
        gap:"1.5rem"
    },
    card: {
        position: 'relative',
        width: '100%',
        padding:"2.2rem 1rem",
        backgroundColor: '#F7F7F7',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#EBEAED',            
        }
    },    
    cardContent: {
        textAlign: 'center',
        alignContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    logo: {
        height: 60,
        width:"100%",
        justifyContent: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingBottom:'1rem'
    },
    grid: {
        minWidth: 300,
        display: 'flex'
    },
    container2: {
        display: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        margin: '1rem',
        cursor: 'pointer',
        color: '#7721AD'
    },
    cardText: {
        textAlign: 'left',
        marginBottom: 0
    },
    detailTitle: {
        fontWeight:'bold',
        fontSize: 18
    },
    actionButton: {
        cursor: 'pointer',
        padding: '5px',
        backgroundColor: '#7721AD',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '4px',
        fontSize: '12px',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#3D1158',
        },
    },
    cardActions: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16
    },
    subTextContainer: {
        height: 80,
        marginBottom: 15
    },
    block10: {
        height: 10
    },
    block20: {
        height: 20
    },
    textMarginBot: {
        marginBottom: 20
    },
    parameterContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    widthBlock10: {
        width: 10
    },
    parameterDesc: {
        marginTop: 15
    }, 
    subtittles: {
        fontSize: '1rem', 
        fontWeight:"bold",
    },
    iconHelpText: {
        width: 'auto',
        height: 23,
        cursor: 'pointer',
    },
    decodingContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        marginBottom: 15,
    }
}));
interface CardDataType {
    title: string;
    description: string;
    language: string;
    organizationName: string;
    querywithoutanswer: string;
    response: string;
    prompt: string;
    negativeprompt: string;
    max_tokens: number;
    temperature: number;
    top_p: number;
    top_k: number;
    repetitionpenalty: number;
}
interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface ParametersTabDetailProps {
    data: RowSelected
    setValue: any
    getValues: any
    errors: FieldErrors
    setValidatePrompt: (data: string) => void
    trigger: any
}

const ParametersTabDetail: React.FC<ParametersTabDetailProps> = ({
    data:{row, edit},
    setValue,
    getValues,
    errors,
    setValidatePrompt,
    trigger
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [viewSelected, setViewSelected] = useState(edit ? 'detail' : 'main');
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [unansweredQueries, setUnansweredQueries] = useState<string | null>(row?.querywithoutanswer || null);
    const [selectedCardData, setSelectedCardData] = useState<CardDataType | null>(null);
    const [selectedOption, setSelectedOption] = useState('');
    const personalityKey = `personality_${(getValues('type') as string).toLowerCase()}`;

    useEffect(() => {
        const defaultValue = getValues('querywithoutanswer') as string;
        setSelectedOption(defaultValue);
    }, []);    

    const handleSelectChange = (value: Dictionary) => {
        console.log('Selected option:', value);
        setSelectedOption(value?.domainvalue || '');
    };
    
    const filteredData = (multiDataAux?.data?.[1]?.data || []).reduce<Dictionary[]>((acc, item) => {
        if (!acc.find((i) => i.domainvalue === item.domainvalue)) {
            acc.push(item);
        }
        return acc;
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_delete),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const languages = [
        {
            domainvalue: 'Todos',
            domaindesc: 'Todos'
        },
        {
            domainvalue: 'Alemán',
            domaindesc: 'Alemán'
        },
        {
            domainvalue: 'Árabe',
            domaindesc: 'Árabe'
        },
        {
            domainvalue: 'Bengalí',
            domaindesc: 'Bengalí'
        },
        {
            domainvalue: 'Chino',
            domaindesc: 'Chino'
        },
        {
            domainvalue: 'Español',
            domaindesc: 'Español'
        },
        {
            domainvalue: 'Francés',
            domaindesc: 'Francés'
        },
        {
            domainvalue: 'Hindi',
            domaindesc: 'Hindi'
        },
        {
            domainvalue: 'Indonesio',
            domaindesc: 'Indonesio'
        },
        {
            domainvalue: 'Inglés',
            domaindesc: 'Inglés'
        },
        {
            domainvalue: 'Italiano',
            domaindesc: 'Italiano'
        },
        {
            domainvalue: 'Japonés',
            domaindesc: 'Japonés'
        },
        {
            domainvalue: 'Portugués',
            domaindesc: 'Portugués'
        },
        {
            domainvalue: 'Ruso',
            domaindesc: 'Ruso'
        },
        {
            domainvalue: 'Turco',
            domaindesc: 'Turco'
        },
        {
            domainvalue: 'Urdu',
            domaindesc: 'Urdu'
        },        
    ]

    const cardData = [
        {
            title: t(langKeys.help_desk_clerk),
            description: t(langKeys.help_desk_clerk_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: `Quiero que actúes como un Help Desk especializado en la satisfacción del cliente. Toma en consideración los siguientes argumentos para tu perfil:\n\n1) Explico las soluciones técnicas en un lenguaje simple y fácil de entender.\n2) Me aseguro que los usuarios comprendan cómo resolver sus problemas.\n3) Hago preguntas para obtener toda la información relevante.\n4) Soy un asistente amable, paciente y servicial.\n5) Sigo los procedimientos establecidos y utilizo las mejores prácticas.\n6) Puedo diagnosticar y solucionar una gran variedad de problemas técnicos.\n\nImportante: No puedes salir de tu rol de Help Desk.`,
            negativeprompt: '1) Ser grosero.\n2) Hablar de temas políticos, sexuales, religiosos y culturales.\n3) Usar información falsa o incoherente.',
            max_tokens: 500,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'TABLE',
        },
        {
            title: t(langKeys.customer_service),
            description: t(langKeys.customer_service_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: 'Quiero que actúes como un experto de Servicio al Cliente. Toma en consideración los siguientes argumentos para tu perfil:\n\n1) Proporciona soluciones rápidas y efectivas a las consultas de los clientes.\n2) Muestro empatía ante las frustraciones de los clientes.\n3) Hago preguntas de seguimiento para obtener más detalles.\n4) Saludo a los clientes con entusiasmo y les demuestro que me importan.\n5) Promuevo una cultura centrada en el cliente dentro de la organización.\n6) Calmo a los clientes enojados y encuentro soluciones razonables.\n7) Soy hábil resolviendo quejas y reclamos.\n\nImportante: No puedes salir de tu rol de experto de Servicio al Cliente.',
            negativeprompt: '1) Ser grosero.\n2) Hablar de temas políticos, sexuales, religiosos y culturales.\n3) Usar información falsa o incoherente.\n4) Hablar de otras organizaciones.',
            max_tokens: 300,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'CLIENT',
        },
        {
            title: t(langKeys.sales_expert),
            description: t(langKeys.sales_expert_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: 'Quiero que actúes como un comercial experto en ventas y relaciones con los clientes especializado en captación de clientes. Toma en consideración los siguientes argumentos para tu perfil:\n\n1) Soy un vendedor entusiasta y apasionado.\n2) Creo firmemente en los productos y servicios que vendo.\n3) Escucho las necesidades de los clientes y les presento cómo nuestros productos pueden ayudarlos. Nunca asumo, siempre pregunto.\n4) Manejo con tacto las objeciones de los clientes y las convierto en oportunidades para construir valor.\n5) Soy experto en nuestra línea de productos/servicios.\n6) Mi meta es siempre poder vender un producto de la organización que represento, sin dejar de lado la satisfacción del cliente.\n\nImportante: No puedes salir de tu rol de comercial experto en ventas y relaciones con los clientes.',
            negativeprompt: '1) Ser grosero.\n2) Hablar de temas políticos, sexuales, religiosos y culturales.\n3) Usar información falsa o incoherente.\n4) Ofrecer productos relacionados a otras organizaciones.',
            max_tokens: 300,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'SALES',
        },
        {
            title: t(langKeys.technical_support),
            description: t(langKeys.technical_support_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: 'Quiero que actúes como ingeniero de soporte técnico experto en resolución de problemas y atención al cliente especializado en soporte al usuario. Toma en consideración los siguientes argumentos para tu perfil:\n\n1) Tengo amplios conocimientos sobre hardware y software de computadoras, redes y otros sistemas informáticos.\n2) Puedo diagnosticar y solucionar una gran variedad de problemas técnicos.\n3) Soy muy paciente y tranquilo al manejar situaciones estresantes y resolver problemas complejos.\n4) Escucho con atención los problemas reportados por los usuarios. Hago preguntas para entender bien el contexto.\n5) Utilizo un enfoque lógico y sistemático para diagnosticar la raíz de los problemas técnicos.\n6) Explico soluciones técnicas en un lenguaje sencillo para que los usuarios puedan entender. De ser necesario, puedo generar código y compartirlo.\n7) Investigo a fondo los problemas difíciles y persisto hasta encontrar una solución. No me rindo fácilmente.\n\nImportante: No puedes salir de tu rol de ingeniero de soporte técnico.',
            negativeprompt: '1) Ser grosero.\n2) Hablar de temas políticos, sexuales, religiosos y culturales.\n3) Usar información falsa o incoherente.\n4) Hablar de otras organizaciones.',
            max_tokens: 700,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'TECH',
        },
        {
            title: t(langKeys.ai_base),
            description: t(langKeys.ai_base_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: '',
            negativeprompt: '1) Ser grosero.\n2) Usar información falsa o incoherente.',
            max_tokens: 300,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'AI',
        },
        {
            title: t(langKeys.custom_mode),
            description: t(langKeys.custom_mode_description),
            language: 'Todos',
            organizationName: '',
            querywithoutanswer: 'Sin reacción',
            response: '',
            prompt: '',
            negativeprompt: '',
            max_tokens: 300,
            temperature: 1,
            top_p: 1,
            top_k: 20,
            repetitionpenalty: 1,
            type: 'PERSONALIZED',
        },
    ];

    const handleSelectCard = (cardIndex: number) => {  
        setSelectedCardData(cardData[cardIndex])
        setValue('language', cardData[cardIndex].language)
        setValue('organizationname', cardData[cardIndex].organizationName)
        setValue('querywithoutanswer', cardData[cardIndex].querywithoutanswer)
        setValue('response', cardData[cardIndex].response)
        setValue('prompt', cardData[cardIndex].prompt)
        setValue('negativeprompt', cardData[cardIndex].negativeprompt)
        setValue('temperature', cardData[cardIndex].temperature)
        setValue('max_tokens', cardData[cardIndex].max_tokens)
        setValue('top_p', cardData[cardIndex].top_p)
        setValue('top_k', cardData[cardIndex].top_k)
        setValue('repetitionpenalty', cardData[cardIndex].repetitionpenalty)
        setValue('type', cardData[cardIndex].type)
        setValidatePrompt(cardData[cardIndex].prompt)
        setViewSelected('detail');
    }

    const handleBackCard = () => {  
        setSelectedCardData(null)
        setValue('language', '')
        setValue('organizationname', '')
        setValue('querywithoutanswer', '')
        setValue('response', '')
        setValue('prompt', '')
        setValue('negativeprompt', '')
        setValue('temperature', 0)
        setValue('max_tokens', 0)
        setValue('top_p', 0)
        setValue('top_k', 0)
        setValue('repetitionpenalty', 0)
        setValue('type', '')
        setValidatePrompt('')
        setViewSelected('main');
    }
    
    if(edit) {
        if(viewSelected === 'main') {
            return (
                <div className={classes.containerDetail}>
                    <div id="parameters">
                        <span className={classes.title}>
                            {t(langKeys.personality)}
                        </span>
                        <div><span className={classes.text}>{t(langKeys.selectpersonality)}</span></div>
                        <div className={`row-zyx ${classes.cardsContainer}`} >
                            {cardData.map((card, index) => (
                                <Grid item xs={2} md={1} lg={2} className={classes.grid} key={index}>
                                    <Card className={classes.card} onClick={() => handleSelectCard(index)}>
                                        <div className={classes.cardContent}>             
                                            {card.title=== t(langKeys.help_desk_clerk) ? (<HelpDeskPersonalityIcon className={classes.logo} />) 
                                            : card.title=== t(langKeys.customer_service) ? (<ClientServicePersonalityIcon className={classes.logo} />) 
                                            : card.title=== t(langKeys.sales_expert) ? (<SalesPersonalityIcon className={classes.logo} />)
                                            : card.title=== t(langKeys.technical_support) ? (<TechSupportPersonalityIcon className={classes.logo} />)
                                            : card.title=== t(langKeys.ai_base) ? (<BaseAIPersonalityIcon className={classes.logo} />)
                                            : (<PersonalizedPersonalityIcon className={classes.logo} />)                                        
                                        }                               
                                            <div className={classes.cardTitle}>{card.title}</div>
                                            <div className={classes.cardText}>{card.description}</div>                                         
                                        </div>
                                    </Card>
                                </Grid>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white', marginTop: 20}}>
                    <div>
                        <div>
                            <Button
                                type="button"
                                style={{color: '#7721AD'}}
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackCard}
                            >
                                {t(langKeys.personality)}
                            </Button>
                        </div>
                        <div className={classes.block10}/>
                        <span className={classes.title}>
                        {personalityKey in langKeys ? t(langKeys[personalityKey as keyof typeof langKeys]) : ''}
                    </span>
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <div style={{flex: 2, display: 'flex', flexDirection: 'column'}}>
                            <div className={classes.containerDetail}>
                                <div className="row-zyx" style={{marginBottom:0}}>
                                    <div className="col-6">
                                        <span className={classes.detailTitle}>{t(langKeys.language2)}</span>
                                        <div className={classes.subTextContainer}><span className={classes.text}>{t(langKeys.selectAILang)}</span></div>
                                        <FieldMultiSelect                                                                                    
                                            data={getValues('language') === 'Todos' ? languages.filter((value) => {return value.domainvalue === 'Todos'}) : languages}
                                            valueDefault={getValues('language')}
                                            onChange={(value) => {
                                                if(value) {
                                                    const languagesAux = value.map((o: Dictionary) => o.domainvalue).join(',')
                                                    if(languagesAux.includes('Todos')) {
                                                        setValue("language", 'Todos')
                                                        trigger('language')
                                                    } else {
                                                        setValue("language", languagesAux)
                                                        trigger('language')
                                                    }
                                                } else {
                                                    setValue('language', '')
                                                    trigger('language')
                                                }
                                            }}
                                            error={errors?.language?.message}
                                            optionValue='domainvalue'
                                            optionDesc='domaindesc'
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className={classes.detailTitle}>{t(langKeys.unansweredqueries)}</span>
                                        <div className={classes.subTextContainer}><span className={classes.text}>{t(langKeys.aireaction)}</span></div>                                        
                                        <div style={{ display: 'flex', alignItems: 'end', gap: 5 }}>
                                            <div style={{ flex: 1 }}>
                                                <FieldSelect
                                                    data={filteredData}
                                                    onChange={(value) => {
                                                        handleSelectChange(value);
                                                        if (value?.domainvalue) {
                                                            setUnansweredQueries(value.domainvalue);
                                                            setValue('querywithoutanswer', value.domainvalue);
                                                        } else {
                                                            setUnansweredQueries('');
                                                            setValue('querywithoutanswer', '');
                                                        }
                                                    }}
                                                    error={errors?.querywithoutanswer?.message}
                                                    valueDefault={getValues('querywithoutanswer')}
                                                    optionValue="domainvalue"
                                                    optionDesc="domainvalue"
                                                />
                                            </div>
                                            <Tooltip
                                                title={
                                                    selectedOption === 'Sin reacción' ? t(langKeys.noreaction_help) :
                                                    selectedOption === 'Respuesta Sugerida' ? t(langKeys.bestsuggestion_help) :
                                                    selectedOption === 'Mejor Sugerencia' ? t(langKeys.suggestedanswer_help) : t(langKeys.nooptionselected)
                                                }
                                                arrow
                                                placement="top"
                                            >
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    {unansweredQueries === 'Respuesta Sugerida' && (
                                        <>
                                            <div className={classes.block20}/>
                                            <div>
                                                <span className={classes.detailTitle}>{t(langKeys.dashboard_managerial_survey3_answervalue)}</span>
                                                <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.aianswer)}</span></div>
                                                <FieldEdit
                                                    variant="outlined"
                                                    InputProps={{
                                                        multiline: true,
                                                        maxRows: 3
                                                    }}
                                                    valueDefault={getValues('response')}
                                                    onChange={(value) => setValue('response', value)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={`row-zyx ${classes.containerDetail2}`}>
                                <div>
                                    <span className={classes.detailTitle}>{t(langKeys.instructions)}</span>
                                    <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.promptinstructions)}</span></div>
                                    <FieldEditMultiAux
                                        variant="outlined"
                                        inputProps={{
                                            rows: 7,
                                            maxRows: 40
                                        }}
                                        valueDefault={getValues('prompt')}
                                        onChange={(value) => {
                                            setValue('prompt', value)
                                            setValidatePrompt(value)
                                        }}
                                        error={errors?.prompt?.message}
                                    />
                                    <div className={classes.block20}/>
                                    <span className={classes.detailTitle}>{t(langKeys.exclusions)}</span>
                                    <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.negativepromptinstructions)}</span></div>
                                    <FieldEditMultiAux
                                        variant="outlined"
                                        inputProps={{
                                            rows: 3,
                                            maxRows: 10,
                                        }}
                                        valueDefault={getValues('negativeprompt')}
                                        onChange={(value) => setValue('negativeprompt', value)}
                                        error={errors?.negativeprompt?.message}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9F9FA', padding: 10}}>
                            <div className={classes.decodingContainer}>
                                <span className={classes.detailTitle}>Decoding</span>
                                <div style={{display: 'flex', gap: 5}}>
                                    <span className={classes.text}>Greedy</span>
                                    <IOSSwitch
                                        checked={getValues("decoding_method") === "sample"}
                                        style={{color: '#078548'}}
                                        onChange={() => {
                                            if(getValues("decoding_method") === "sample") {
                                                setValue("decoding_method", "greedy")
                                                trigger("decoding_method")
                                            }
                                            else {
                                                setValue("decoding_method", "sample")
                                                trigger("decoding_method")
                                            }
                                        }}
                                    />
                                    <span className={classes.text}>Sampling</span>
                                </div>
                            </div>
                            <div>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{t(langKeys.maxtokens)}</span>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={getValues('max_tokens')}
                                        onChange={(value) => setValue('max_tokens', value)}
                                        error={errors?.max_tokens?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.maxtokensdesc)}</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{t(langKeys.temperature)}</span>
                                    <div className={classes.widthBlock10}/>
                                    <span>0 - 2.0</span>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={getValues('temperature')}
                                        onChange={(value) => setValue('temperature', value)}
                                        error={errors?.temperature?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.temperaturedesc)}</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{t(langKeys.topp)}</span>
                                    <div className={classes.widthBlock10}/>
                                    <span>0 - 1.0</span>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={getValues('top_p')}
                                        onChange={(value) => setValue('top_p', value)}
                                        error={errors?.top_p?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.toppdesc)}</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{t(langKeys.topk)}</span>
                                    <div className={classes.widthBlock10}/>
                                    <span>1 - 100</span>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={selectedCardData?.top_k}
                                        onChange={(value) => setValue('top_k', value)}
                                        error={errors?.top_k?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.topkdescription)}</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{t(langKeys.repetitionpenalty)}</span>
                                    <div className={classes.widthBlock10}/>
                                    <span>1 - 2</span>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={selectedCardData?.repetitionpenalty}
                                        onChange={(value) => setValue('repetitionpenalty', value)}
                                        error={errors?.repetitionpenalty?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.repetitionpenaltydescription)}</span></div>
                        
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        if(viewSelected === 'main') {
            return (
                <div className={classes.containerDetail}>
                    <div id="parameters">
                        <span className={classes.title}>
                            {t(langKeys.personality)}
                        </span>
                        <div><span className={classes.text}>{t(langKeys.selectpersonality)}</span></div>
                        <div className={`row-zyx ${classes.cardsContainer}`} >
                            {cardData.map((card, index) => (
                                <Grid item xs={2} md={1} lg={2} className={classes.grid} key={index}>
                                    <Card className={classes.card} onClick={() => handleSelectCard(index)}>
                                        <div className={classes.cardContent}>             
                                            {card.title=== t(langKeys.help_desk_clerk) ? (<HelpDeskPersonalityIcon className={classes.logo} />) 
                                            : card.title=== t(langKeys.customer_service) ? (<ClientServicePersonalityIcon className={classes.logo} />) 
                                            : card.title=== t(langKeys.sales_expert) ? (<SalesPersonalityIcon className={classes.logo} />)
                                            : card.title=== t(langKeys.technical_support) ? (<TechSupportPersonalityIcon className={classes.logo} />)
                                            : card.title=== t(langKeys.ai_base) ? (<BaseAIPersonalityIcon className={classes.logo} />)
                                            : (<PersonalizedPersonalityIcon className={classes.logo} />)                                        
                                        }                               
                                            <div className={classes.cardTitle}>{card.title}</div>
                                            <div className={classes.cardText}>{card.description}</div>                                         
                                        </div>
                                    </Card>
                                </Grid>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if(viewSelected === 'detail') {
            return (
                <div style={{display: 'flex', flexDirection: 'column', padding: 10, backgroundColor: 'white', marginTop: 20}}>
                    <div>
                        <div>
                            <Button
                                type="button"
                                style={{color: '#7721AD'}}
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBackCard}
                            >
                                {t(langKeys.personality)}
                            </Button>
                        </div>
                        <div className={classes.block10}/>
                        <span className={classes.title}>
                            {selectedCardData?.title}
                        </span>
                    </div>
                    <div style={{display: 'flex', gap: 10}}>
                        <div style={{flex: 2, display: 'flex', flexDirection: 'column'}}>
                            <div className={classes.containerDetail}>
                                <div className="row-zyx" style={{marginBottom:0}}>
                                    <div className="col-6">
                                        <span className={classes.detailTitle}>{t(langKeys.language2)}</span>
                                        <div className={classes.subTextContainer}><span className={classes.text}>{t(langKeys.selectAILang)}</span></div>
                                        <FieldMultiSelect
                                            data={getValues('language') === 'Todos' ? languages.filter((value) => {return value.domainvalue === 'Todos'}) : languages}
                                            valueDefault={getValues('language')}
                                            onChange={(value) => {
                                                if(value) {
                                                    const languagesAux = value.map((o: Dictionary) => o.domainvalue).join(',')
                                                    if(languagesAux.includes('Todos')) {
                                                        setValue("language", 'Todos')
                                                        trigger('language')
                                                    } else {
                                                        setValue("language", languagesAux)
                                                        trigger('language')
                                                    }
                                                } else {
                                                    setValue('language', '')
                                                    trigger('language')
                                                }
                                            }}
                                            optionValue='domainvalue'
                                            optionDesc='domaindesc'
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className={classes.detailTitle}>{t(langKeys.unansweredqueries)}</span>
                                        <div className={classes.subTextContainer}><span className={classes.text}>{t(langKeys.aireaction)}</span></div>
                                        <div style={{display: 'flex', alignItems: 'end', gap: 5}}>
                                            <div style={{flex: 1}}>
                                                <FieldSelect                                                   
                                                    data={filteredData}
                                                    onChange={(value) => {
                                                        console.log('onChange value:', value);
                                                        handleSelectChange(value);
                                                        if(value?.domainvalue) {
                                                            setUnansweredQueries(value.domainvalue);
                                                            setValue('querywithoutanswer', value.domainvalue);
                                                        } else {
                                                            setUnansweredQueries('');
                                                            setValue('querywithoutanswer', '');
                                                        }
                                                    }}                                                   
                                                    valueDefault={getValues('querywithoutanswer')}
                                                    optionValue="domainvalue"
                                                    optionDesc="domainvalue"
                                                />
                                            </div>
                                            <Tooltip
                                                title={selectedOption === 'Sin reacción' ? t(langKeys.noreaction_help) :
                                                    selectedOption === 'Respuesta Sugerida' ? t(langKeys.bestsuggestion_help) :
                                                    selectedOption === 'Mejor Sugerencia' ? t(langKeys.suggestedanswer_help) : t(langKeys.noreaction_help)}
                                                arrow
                                                placement="top"
                                            >
                                                <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    {unansweredQueries === 'Respuesta Sugerida' && (
                                        <>
                                            <div>
                                                <span className={classes.detailTitle}>{t(langKeys.dashboard_managerial_survey3_answervalue)}</span>
                                                <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.aianswer)}</span></div>
                                                <FieldEdit
                                                    variant="outlined"
                                                    InputProps={{
                                                        multiline: true,
                                                    }}
                                                    valueDefault={selectedCardData?.response}
                                                    onChange={(value) => setValue('response', value)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={`row-zyx ${classes.containerDetail2}`}>
                                <div>
                                    <span className={classes.detailTitle}>{t(langKeys.instructions)}</span>
                                    <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.promptinstructions)}</span></div>
                                    <FieldEditMultiAux
                                        variant="outlined"
                                        inputProps={{
                                            rows: 1,
                                            maxRows: 40
                                        }}
                                        valueDefault={selectedCardData?.prompt}
                                        onChange={(value) => {
                                            setValue('prompt', value)
                                            setValidatePrompt(value)
                                        }}
                                        error={errors?.prompt?.message}
                                    />
                                    <div className={classes.block20}/>
                                    <span className={classes.detailTitle}>{t(langKeys.exclusions)}</span>
                                    <div className={classes.textMarginBot}><span className={classes.text}>{t(langKeys.negativepromptinstructions)}</span></div>
                                    <FieldEditMultiAux
                                        variant="outlined"
                                        inputProps={{
                                            rows: 3,
                                            maxRows: 10
                                        }}
                                        valueDefault={selectedCardData?.negativeprompt}
                                        onChange={(value) => setValue('negativeprompt', value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F9F9FA', padding: 10}}>
                            <div className={classes.decodingContainer}>
                                <span className={classes.detailTitle}>Decoding</span>
                                <div style={{display: 'flex', gap: 5}}>
                                    <span className={classes.text}>Greedy</span>
                                    <IOSSwitch
                                        checked={getValues("decoding_method") === "sample"}
                                        style={{color: '#078548'}}
                                        onChange={() => {
                                            if(getValues("decoding_method") === "sample") {
                                                setValue("decoding_method", "greedy")
                                                trigger("decoding_method")
                                            }
                                            else {
                                                setValue("decoding_method", "sample")
                                                trigger("decoding_method")
                                            }
                                        }}
                                    />
                                    <span className={classes.text}>Sampling</span>
                                </div>
                            </div>
                            <div className={classes.parameterContainer}>
                                <span className={classes.detailTitle}>{t(langKeys.maxtokens)}</span>
                                <div className={classes.widthBlock10}/>
                                <FieldEdit
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    width={80}
                                    valueDefault={selectedCardData?.max_tokens}
                                    onChange={(value) => setValue('max_tokens', value)}
                                    error={errors?.max_tokens?.message}
                                />
                            </div>
                            <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.maxtokensdesc)}</span></div>
                            <div className={classes.block20}/>
                            <div className={classes.parameterContainer}>
                                <span className={classes.detailTitle}>{t(langKeys.temperature)}</span>
                                <div className={classes.widthBlock10}/>
                                <span>0 - 2.0</span>
                                <div className={classes.widthBlock10}/>
                                <FieldEdit
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    width={80}
                                    valueDefault={selectedCardData?.temperature}
                                    onChange={(value) => setValue('temperature', value)}
                                    error={errors?.temperature?.message}
                                />
                            </div>
                            <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.temperaturedesc)}</span></div>
                            <div className={classes.block20}/>
                            <div className={classes.parameterContainer}>
                                <span className={classes.detailTitle}>{t(langKeys.topp)}</span>
                                <div className={classes.widthBlock10}/>
                                <span>0 - 1.0</span>
                                <div className={classes.widthBlock10}/>
                                <FieldEdit
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    width={80}
                                    valueDefault={selectedCardData?.top_p}
                                    onChange={(value) => setValue('top_p', value)}
                                    error={errors?.top_p?.message}
                                />
                            </div>
                            <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.toppdesc)}</span></div>
                            <div className={classes.block20}/>
                            <div className={classes.parameterContainer}>
                                <span className={classes.detailTitle}>{t(langKeys.topk)}</span>
                                <div className={classes.widthBlock10}/>
                                <span>1 - 100</span>
                                <div className={classes.widthBlock10}/>
                                <FieldEdit
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    width={80}
                                    valueDefault={selectedCardData?.top_k}
                                    onChange={(value) => setValue('top_k', value)}
                                    error={errors?.top_k?.message}
                                />
                            </div>
                            <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.topkdescription)}</span></div>
                            <div className={classes.block20}/>
                            <div className={classes.parameterContainer}>
                                <span className={classes.detailTitle}>{t(langKeys.repetitionpenalty)}</span>
                                <div className={classes.widthBlock10}/>
                                <span>1 - 2</span>
                                <div className={classes.widthBlock10}/>
                                <FieldEdit
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    width={80}
                                    valueDefault={selectedCardData?.repetitionpenalty}
                                    onChange={(value) => setValue('repetitionpenalty', value)}
                                    error={errors?.repetitionpenalty?.message}
                                />
                            </div>
                            <div className={classes.parameterDesc}><span className={classes.text}>{t(langKeys.repetitionpenaltydescription)}</span></div>
                        
                        
                        </div>
                    </div>
                </div>
            );
        } else return null;
    }
};

export default ParametersTabDetail;