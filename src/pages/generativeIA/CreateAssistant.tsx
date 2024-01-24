import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, AntTab, AntTabPanelAux, TitleDetail  } from "components";
import { Trans, useTranslation } from "react-i18next";
import { execute, getCollectionAux, getMultiCollectionAux } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { Button, Tabs } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AssistantTabDetail from "./TabDetails/AssistantTabDetail";
import ParametersTabDetail from "./TabDetails/ParametersTabDetail";
import TrainingTabDetail from "./TabDetails/TrainingTabDetail";
import { useForm } from "react-hook-form";
import { Dictionary } from "@types";
import { assistantAiDocumentSel, decrypt, encrypt, getValuesFromDomain, insAssistantAi, insAssistantAiDoc } from "common/helpers";
import PUBLICKEYPEM from "./key.js";

const useStyles = makeStyles(() => ({
    container: {
        width: '100%',
        color: "#2e2c34",
    },
    tabs: {
        color: "#989898",
        backgroundColor: "white",
    },
    formcontainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    titleandcrumbs: {
        marginBottom: 12,
        marginTop: 4,
    },
    buttonscontainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginBottom: 10
    },
    purpleButton: {
        backgroundColor: '#ffff',
        color: '#7721AD'
    },
}));

type BreadCrumb = {
    id: string,
    name: string
}

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface CreateAssistantProps {
    data: RowSelected;
    arrayBread: BreadCrumb[],
    setViewSelected: (view: string) => void,
    setExternalViewSelected: (view: string) => void,
    fetchData: () => void
}

const CreateAssistant: React.FC<CreateAssistantProps> = ({
    data: {row, edit},
    setViewSelected,
    arrayBread,
    setExternalViewSelected,
    fetchData
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveInsFile, setWaitSaveInsFile] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);
    const [registerError, setRegisterError] = useState(false);
    const dataDocuments = useSelector(state => state.main.mainAux);
    const [cosFile, setCosFile] = useState({
        name: '',
        url: ''
    });
    const [assistantaiid, setAssistantaiid] = useState('');

    const newArrayBread = [
        ...arrayBread,
        { id: "createssistant", name: t(langKeys.createssistant) },       
    ];

    useEffect(() => {
        dispatch(
          getMultiCollectionAux([
            getValuesFromDomain('ESTADOGENERICO'),
            getValuesFromDomain('QUERYWITHOUTANSWER'),
            getValuesFromDomain('BASEMODEL')
          ])
        );
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(registerError) {
                    dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.ERROR) }))
                } else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                }
                fetchData();
                setViewSelected('assistantdetail')
                dispatch(showBackdrop(false));
                setRegisterError(false)
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        if(waitSaveInsFile){
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveInsFile(false);
                InsFile()
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSaveInsFile(false);
            }
        }
    }, [executeResult, waitSaveInsFile])

    const InsFile = async () => {
        const encryptedApikey = encrypt(getValues('apikey'), PUBLICKEYPEM);
        try {
            const isDocumentAPI = await fetch('https://documentgptapi.laraigo.com/files', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                file_url: cosFile.url,
                file_name: cosFile.name,
                apikey: encryptedApikey,
              }),
            });
      
            if (!isDocumentAPI.ok) {
              console.error('Error en cargar documento:', isDocumentAPI.statusText);
              setWaitSave(true);
              return;
            }
      
            const responseData = await isDocumentAPI.json();
            const documentid = responseData.data.id;
            
            const assistantFilesAPI = await fetch('https://documentgptapi.laraigo.com/assistants/files', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                assistant_id: assistantaiid,
                file_id: documentid,
                apikey: encryptedApikey,
              }),
            });
      
            if (!assistantFilesAPI.ok) {
              console.error('Error en la llamada al endpoint assistants/files:', assistantFilesAPI.statusText);
              setWaitSave(true);
              return;
            }

            const docListEndpoint = await fetch ('https://documentgptapi.laraigo.com/assistants/files/list', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                  assistant_id: assistantaiid,                
                  apikey: encryptedApikey,                  
                }),
            })
            if (!docListEndpoint.ok) {
                console.error('Error en el nuevo endpoint:', docListEndpoint.statusText);
                setWaitSave(true);
                return;
            }      

            const docListData = await docListEndpoint.json();
            const list = docListData.data.data;
            const matchingFile = list.find((file: Dictionary) => file.id===documentid);
            if(!matchingFile){
                console.error('No se encontró un archivo con el ID deseado.');
                setWaitSave(true);
                return;
            }            

            dispatch(execute(insAssistantAiDoc({
                assistantaiid: executeResult.data[0].p_assistantaiid,
                id: 0,
                description: cosFile.name,
                url: cosFile.url,
                fileid: documentid,
                type: 'FILE',
                status: 'ACTIVO',
                operation: 'INSERT',
            })));
            
            setWaitSave(true);
          } catch (error) {
            console.error('Error en la llamada a la API:', error);
            setWaitSave(true);
          }
    }

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            id: row?.assistantaiid || 0,
            code: row?.code || '',
            name: row?.name || '',
            description: row?.description || '',
            basemodel: row?.basemodel || '',
            language: row?.language || '',
            organizationname: row?.organizationname || '',
            querywithoutanswer: row?.querywithoutanswer || '',
            response: row?.response || '',
            prompt: row?.prompt || '',
            negativeprompt: row?.negativeprompt || '',
            generalprompt: row?.generalprompt || '',
            temperature: row?.temperature || 0,
            max_tokens: row?.max_tokens || 0,
            top_p: row?.top_p || 0,
            apikey: edit ? decrypt(row?.apikey, PUBLICKEYPEM) : '',
            retrieval: row?.retrieval || true,
            codeinterpreter: row?.codeinterpreter || false,
            type: row?.type || '',
            status: row?.status || 'ACTIVO',
            operation: edit ? 'UPDATE' : 'INSERT',
        }
    });

    React.useEffect(() => {
        register('id');
        register('code')
        register('name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('basemodel', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('language', { validate: (value) => (value && value.length) || t(langKeys.field_required) })
        register('organizationname');
        register('querywithoutanswer', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('response');
        register('prompt', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('negativeprompt');
        register('generalprompt');
        register('temperature', { validate: (value) => (value && value > 0 && parseFloat(value) <= 2.0) || t(langKeys.required) });
        register('max_tokens', { validate: (value) => (value && value > 0) || t(langKeys.required) });
        register('top_p', { validate: (value) => (value && value > 0 && parseFloat(value) <= 1.0) || t(langKeys.required) });
        register('apikey', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('retrieval');
        register('codeinterpreter');
        register('type');
        register('status');
        register('operation');
    }, [register, setValue]);

    const fetchDocumentsByAssistant = () => dispatch(getCollectionAux(assistantAiDocumentSel({assistantaiid: getValues('id'), id: 0, all: true})));

    useEffect(() => {
        fetchDocumentsByAssistant();
    }, [])

    const filesIds = dataDocuments.data.map(item => item.fileid);

    const onMainSubmit = handleSubmit(async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));           

            const encryptedApikey = encrypt(data.apikey, PUBLICKEYPEM);

            let generalprompt = data.organizationname !== '' ? data.prompt + '\n\n' + 'Tus respuestas no deben de contener o informar lo siguiente:\n' + data.negativeprompt + '\n\n' +
            'El idioma que empleas para comunicarte es el ' + data.language + '. Si te piden que hables en otro idioma que no sea ' + data.language +
            ', infórmales que solamente puedes comunicarte en ' + data.language + '\n\n' + 'Solamente debes contestar o informar temas referidos a: ' + data.organizationname : 
            data.prompt + '\n\n' + 'Tus respuestas no deben de contener o informar lo siguiente:\n' + data.negativeprompt + '\n\n' +
            'El idioma que empleas para comunicarte es el  ' + data.language + '. Si te piden que hables en otro idioma que no sea ' + data.language +
            ', infórmales que solamente puedes comunicarte en ' + data.language;

            if(data.querywithoutanswer === 'Mejor Sugerencia') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda la mejor sugerencia que tengas referente a lo consultado.'
            } else if(data.querywithoutanswer === 'Respuesta Sugerida') {
                generalprompt += '\n\nCuando no puedas responder alguna consulta o pregunta, sugiere lo siguiente: ' + data.response
            }

            try {
                const endpoint = edit
                ? 'https://documentgptapi.laraigo.com/assistants/update'
                : 'https://documentgptapi.laraigo.com/assistants/new';
                const apiResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    body: edit
                    ? JSON.stringify({
                        assistant_id: data.code,
                        name: data.name,
                        instructions: generalprompt,
                        basemodel: data.basemodel,
                        retrieval: data.retrieval,
                        codeinterpreter: data.codeinterpreter,
                        apikey: encryptedApikey,
                        file_ids: filesIds,
                    })
                    : JSON.stringify({
                        name: data.name,
                        instructions: generalprompt,
                        basemodel: data.basemodel,
                        retrieval: data.retrieval,
                        codeinterpreter: data.codeinterpreter,
                        apikey: encryptedApikey,
                    }),
                });
    
                if (!apiResponse.ok) {
                    console.error('Error en la llamada a la API:', apiResponse.statusText);
                    setRegisterError(true)
                    setWaitSave(true);
                    return;
                }

                const responseData = await apiResponse.json();
                if (
                    responseData.data &&
                    responseData.data.error &&
                    responseData.data.error.code === 'invalid_api_key'
                ) {
                    console.error('Error: API key inválida. No se insertará en la base de datos.');
                    setRegisterError(true);
                    setWaitSave(true);
                    return;
                }
                const assistantid = edit ? data.code : responseData.data.assistandid;
                
                dispatch(execute(insAssistantAi({ ...data, generalprompt: generalprompt, code: assistantid, apikey: encryptedApikey })));
                setWaitSave(true);
            } catch (error) {
                console.error('Error en la llamada a la API:', error);
                setRegisterError(true)
                setWaitSave(true);
            }
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

    const onMainSubmitWithoutFiles = handleSubmit(async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));           

            const encryptedApikey = encrypt(data.apikey, PUBLICKEYPEM);

            let generalprompt = data.organizationname !== '' ? data.prompt + '\n\n' + 'Tus respuestas no deben de contener o informar lo siguiente:\n' + data.negativeprompt + '\n\n' +
            'El idioma que empleas para comunicarte es el ' + data.language + '. Si te piden que hables en otro idioma que no sea ' + data.language +
            ', infórmales que solamente puedes comunicarte en ' + data.language + '\n\n' + 'Solamente debes contestar o informar temas referidos a: ' + data.organizationname : 
            data.prompt + '\n\n' + 'Tus respuestas no deben de contener o informar lo siguiente:\n' + data.negativeprompt + '\n\n' +
            'El idioma que empleas para comunicarte es el  ' + data.language + '. Si te piden que hables en otro idioma que no sea ' + data.language +
            ', infórmales que solamente puedes comunicarte en ' + data.language;

            if(data.querywithoutanswer === 'Mejor Sugerencia') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda la mejor sugerencia que tengas referente a lo consultado.'
            } else if(data.querywithoutanswer === 'Respuesta Sugerida') {
                generalprompt += '\n\nCuando no puedas responder alguna consulta o pregunta, sugiere lo siguiente: ' + data.response
            }

            try {
                const endpoint = 'https://documentgptapi.laraigo.com/assistants/new';
                const apiResponse = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`,
                    },
                    body: JSON.stringify({
                        name: data.name,
                        instructions: generalprompt,
                        basemodel: data.basemodel,
                        retrieval: data.retrieval,
                        codeinterpreter: data.codeinterpreter,
                        apikey: encryptedApikey,
                    }),
                });
    
                if (!apiResponse.ok) {
                    console.error('Error en la llamada a la API:', apiResponse.statusText);
                    setRegisterError(true)
                    setWaitSave(true);
                    return;
                }

                const responseData = await apiResponse.json();

                if (
                    responseData.data &&
                    responseData.data.error &&
                    responseData.data.error.code === 'invalid_api_key'
                ) {
                    console.error('Error: API key inválida. No se insertará en la base de datos.');
                    setRegisterError(true);
                    setWaitSave(true);
                    return;
                }
                const assistantid = edit ? data.code : responseData.data.assistandid;
                setAssistantaiid(assistantid);

                dispatch(execute(insAssistantAi({ ...data, generalprompt: generalprompt, code: assistantid, apikey: encryptedApikey })));

                setWaitSaveInsFile(true);
            } catch (error) {
                console.error('Error en la llamada a la API:', error);
                setRegisterError(true)
                setWaitSave(true);
            }
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

	const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        setTabIndex(newIndex);
    };

    return (
        <>
            <form onSubmit={cosFile.name === '' && cosFile.url === '' ? onMainSubmit : onMainSubmitWithoutFiles} className={classes.formcontainer}>
                <div style={{ width: "100%" }}>
                    <div className={classes.titleandcrumbs}>
                        <div style={{ flexGrow: 1 }}>
                            <TemplateBreadcrumbs
                                breadcrumbs={newArrayBread}
                                handleClick={setExternalViewSelected}
                            />
                            <TitleDetail title={t(langKeys.createssistant)} />
                        </div>
                    </div>
                    <div className={classes.container}>     
                        <div id="assistant">
                            <div className={classes.buttonscontainer}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    startIcon={<ArrowBackIcon color="primary" />}
                                    className={classes.purpleButton}
                                    onClick={() => {
                                        setViewSelected('assistantdetail')
                                    }}
                                >
                                    {t(langKeys.return)}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    startIcon={<SaveIcon color="secondary" />}
                                    style={{ backgroundColor: '#55BD84' }}
                                >
                                    {t(langKeys.save)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Tabs
                    value={tabIndex}
                    onChange={handleChangeTab}
                    className={classes.tabs}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="fullWidth"
                >
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.assistant_singular} />
                            </div>
                        }
                    />
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.parameters} />
                            </div>
                        }
                    />
                    <AntTab
                        label={
                            <div>
                                <Trans i18nKey={langKeys.training} />
                            </div>
                        }
                    />
                </Tabs>
                <AntTabPanelAux index={0} currentIndex={tabIndex}>
                    <AssistantTabDetail data={{row,edit}} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanelAux>
                <AntTabPanelAux index={1} currentIndex={tabIndex}>
                    <ParametersTabDetail data={{row,edit}} setValue={setValue} getValues={getValues} errors={errors} />
                </AntTabPanelAux>
                <AntTabPanelAux index={2} currentIndex={tabIndex}>
                    <TrainingTabDetail row={row} fetchData={fetchDocumentsByAssistant} fetchAssistants={fetchData} edit={edit} setFile={setCosFile} />
                </AntTabPanelAux>
            </form>
        </>
    )
}

export default CreateAssistant;