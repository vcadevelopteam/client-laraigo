import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { TemplateBreadcrumbs, AntTab, AntTabPanelAux, TitleDetail  } from "components";
import { Trans, useTranslation } from "react-i18next";
import { execute, getCollectionAux } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { Button, Tabs } from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AssistantTabDetail from "./TabDetails/AssistantTabDetail";
import ParametersTabDetail from "./TabDetails/ParametersTabDetail";
import TrainingTabDetail from "./TabDetails/TrainingTabDetail";
import { useForm } from "react-hook-form";
import { Dictionary } from "@types";
import { assistantAiDocumentSel, decrypt, encrypt, insAssistantAi, insAssistantAiDoc } from "common/helpers";
import PUBLICKEYPEM from "./key.js";
import { addFile, assignFile, createAssistant, updateAssistant } from "store/gpt/actions";
import { createCollection, createCollectionDocuments, editCollection } from "store/llama/actions";
import { createCollection3, createCollectionDocuments3, editCollection3 } from "store/llama3/actions";

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
        gap: '0.5rem',
        marginBottom: 10
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
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const [tabIndex, setTabIndex] = useState(0);
    const [registerError, setRegisterError] = useState(false);
    const dataDocuments = useSelector(state => state.main.mainAux);
    const [cosFile, setCosFile] = useState<Dictionary[]>([]);
    const [assistantaiid, setAssistantaiid] = useState('');
    const newArrayBread = [
        ...arrayBread,
        { id: "createssistant", name: edit ? `${t(langKeys.edit)} ${t(langKeys.assistant_singular)}` : t(langKeys.createssistant) },       
    ];      
    const [encryptedApikey, setEncryptedApikey] = useState<string | null>(null)
    const [generalprompt, setGeneralPrompt] = useState<string | null>(null)
    const [documentId, setDocumentId] = useState<string | null>(null)
    const [waitSaveCreateAssistant, setWaitSaveCreateAssistant] = useState(false)
    const [waitSaveCreateAssistantFile, setWaitSaveCreateAssistantFile] = useState(false)
    const [waitSaveCreateAssistantAssignFile, setWaitSaveCreateAssistantAssignFile] = useState(false)
    const executeAssistant = useSelector(state => state.gpt.gptResult);
    const metaResult = useSelector(state => state.llama.llamaResult);
    const llm3Result = useSelector(state => state.llama3.llama3Result);
    const [waitSaveCreateAssistant2, setWaitSaveCreateAssistant2] = useState(false)
    const [waitSaveUpdateAssistant, setWaitSaveUpdateAssistant] = useState(false)
    const [waitSaveCreateMeta, setWaitSaveCreateMeta] = useState(false)
    const [waitSaveCreateCollection, setWaitSaveCreateCollection] = useState(false)
    const [waitSaveCreateCollectionDoc, setWaitSaveCreateCollectionDoc] = useState(false)
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [provider, setProvider] = useState(row ? multiDataAux?.data?.[3]?.data?.find(item => item.id === row?.intelligentmodelsid)?.provider : '')
    const [firstData, setFirstData] = useState<Dictionary>({
        name: row ? row.name : '',
        description: row ? row.description : '',
        basemodel: row ? row.basemodel : '',
        intelligentmodelsid: row ? row.intelligentmodelsid : 0
    })
    const [validatePrompt, setValidatePrompt] = useState(row ? row.prompt : '')
    const [fileIdsAux, setFileIdsAux] = useState<string[]>([])
    const [selectedProvider, setSelectedProvider] = React.useState(''); 

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
                setCosFile([])
                setFileIdsAux([])
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({        
        defaultValues: {
            id: row?.assistantaiid || 0,
            code: row?.code || '',
            name: row?.name || '',
            description: row?.description || '',
            basemodel: row?.basemodel || '',
            language: row?.language || '',
            organizationname: row?.organizationname || '',
            intelligentmodelsid: row?.intelligentmodelsid || 0,
            querywithoutanswer: row?.querywithoutanswer || '',
            response: row?.response || '',
            prompt: row?.prompt || '',
            negativeprompt: row?.negativeprompt || '',
            generalprompt: row?.generalprompt || '',
            temperature: row?.temperature || 0,
            max_tokens: row?.max_tokens || 0,
            top_p: row?.top_p || 0,
            top_k: row?.top_k || 0,
            repetition_penalty: row?.repetition_penalty || 0,
            chunk_size: row?.chunk_size || 0,
            chunk_overlap: row?.chunk_overlap || 0,
            apikey: row?.basemodel.startsWith('gpt') ? (edit ? decrypt(row?.apikey, PUBLICKEYPEM) : '') : (edit ? row?.apikey : ''),
            retrieval: row?.retrieval || true,
            codeinterpreter: row?.codeinterpreter || false,
            type: row?.type || '',
            status: row?.status || 'ACTIVO',
            decoding_method: row?.decoding_method || "sample",
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
        register('intelligentmodelsid');
        register('querywithoutanswer', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('response');
        register('prompt', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('negativeprompt');
        register('generalprompt');
        register('temperature', { validate: (value) => (value && value > 0 && parseFloat(value) <= 2.0) || t(langKeys.required) });
        register('max_tokens', { validate: (value) => (value && value > 0) || t(langKeys.required) });
        register('top_p', { validate: (value) => (value && value > 0 && parseFloat(value) <= 1.0) || t(langKeys.required) });
        register('top_k', { validate: (value) => (value && value > 0 && parseFloat(value) <= 100) || t(langKeys.required) });
        register('repetition_penalty', { validate: (value) => (value && value > 0 && parseFloat(value) <= 2) || t(langKeys.required) });
        register('chunk_size', { validate: (value) => (value && value.length) ||  t(langKeys.required) });
        register('chunk_overlap', { validate: (value) => (value && value.length) ||  t(langKeys.required) });
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

    useEffect(() => {
        if (waitSaveCreateAssistant) {
            if (!executeAssistant.loading && !executeAssistant.error) {
                setWaitSaveCreateAssistant(false);
                setAssistantaiid(executeAssistant.data.assistandid);
                dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: executeAssistant.data.assistandid, apikey: encryptedApikey })));
                setWaitSaveInsFile(true);
            } else if (executeAssistant.error) {
                const errormessage = t(executeAssistant.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateAssistant(false);
            }
        }
    }, [executeAssistant, waitSaveCreateAssistant]);

    useEffect(() => {
        if (waitSaveCreateAssistant2) {
            if (!executeAssistant.loading && !executeAssistant.error) {
                setWaitSaveCreateAssistant2(false);          
                dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: executeAssistant.data.assistandid, apikey: encryptedApikey })));
                setWaitSave(true);
            } else if (executeAssistant.error) {
                const errormessage = t(executeAssistant.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateAssistant2(false);                
            }
        }
    }, [executeAssistant, waitSaveCreateAssistant2]);

        /*Para Update Assistant*/
        useEffect(() => {
            if (waitSaveUpdateAssistant) {
                if (!executeAssistant.loading && !executeAssistant.error) {
                    setWaitSaveUpdateAssistant(false);         
                    dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, apikey: encryptedApikey })));
                    setWaitSave(true);         
                } else if (executeAssistant.error) {
                    const errormessage = t(executeAssistant.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveUpdateAssistant(false);
                }
            }
        }, [executeAssistant, waitSaveUpdateAssistant]);


    const filesIds = dataDocuments.data.map(item => item.fileid);

    const onMainSubmit = handleSubmit(async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));           

            const encryptedApikey = encrypt(data.apikey, PUBLICKEYPEM);

            let generalprompt;

            generalprompt = data.prompt + '\n\n';
            if (data.negativeprompt !== '') {
                generalprompt += 'Considera inapropiado y evita mencionar los siguientes temas:\n' + data.negativeprompt + '\n\n';
            }
            if (data.language !== '') {
                if(data.language.includes(',')){
                    const formattedLanguages = data.language.split(',').join(', ');
                    generalprompt += 'Empleas los siguientes idiomas para responder: <<' + formattedLanguages + '>>. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + formattedLanguages + '" no añadas mas texto o información a tu respuesta.';
                } else {
                    if(data.language !== 'Todos') {
                        generalprompt += 'Empleas el <<' + data.language + '>> para responder. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + data.language + '" no añadas mas texto o información a tu respuesta.';
                    }
                }
            }

            if (data.querywithoutanswer === 'Mejor Sugerencia') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda una sugerencia divertida, alegre o interesante relacionada con tu base de conocimiento actual.';
            } else if (data.querywithoutanswer === 'Respuesta Sugerida') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, sugiere al usuario que siga lo siguiente: ' + data.response;
            }

            setEncryptedApikey(encryptedApikey)
            setGeneralPrompt(generalprompt)

            if(edit){
                dispatch(updateAssistant({
                    assistant_id: data.code,
                    name: data.name,
                    instructions: generalprompt,
                    basemodel: data.basemodel,
                    retrieval: data.retrieval,
                    codeinterpreter: data.codeinterpreter,
                    apikey: encryptedApikey,
                    file_ids: filesIds,
                }))
                setWaitSaveUpdateAssistant(true)    
            } else {
                dispatch(createAssistant({
                    name: data.name,
                    instructions: generalprompt,
                    basemodel: data.basemodel,
                    retrieval: data.retrieval,
                    codeinterpreter: data.codeinterpreter,
                    apikey: encryptedApikey,
                }))            
                setWaitSaveCreateAssistant2(true)        
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
  
    const onMainSubmitWithFiles = handleSubmit(async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));           

            const encryptedApikey2 = encrypt(data.apikey, PUBLICKEYPEM);

            let generalprompt;

            generalprompt = data.prompt + '\n\n';
            if (data.negativeprompt !== '') {
                generalprompt += 'Considera inapropiado y evita mencionar los siguientes temas:\n' + data.negativeprompt + '\n\n';
            }
            if (data.language !== '') {
                if(data.language.includes(',')){
                    const formattedLanguages = data.language.split(',').join(', ');
                    generalprompt += 'Empleas los siguientes idiomas para responder: <<' + formattedLanguages + '>>. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + formattedLanguages + '" no añadas mas texto o información a tu respuesta.';
                } else {
                    if(data.language !== 'Todos') {
                        generalprompt += 'Empleas el <<' + data.language + '>> para responder. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + data.language + '" no añadas mas texto o información a tu respuesta.';
                    }
                }
            }

            if (data.querywithoutanswer === 'Mejor Sugerencia') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda una sugerencia divertida, alegre o interesante relacionada con tu base de conocimiento actual.';
            } else if (data.querywithoutanswer === 'Respuesta Sugerida') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, sugiere al usuario que siga lo siguiente: ' + data.response;
            }

            setEncryptedApikey(encryptedApikey2)
            setGeneralPrompt(generalprompt)

            dispatch(createAssistant({
                name: data.name,
                instructions: generalprompt,
                basemodel: data.basemodel,
                retrieval: data.retrieval,
                codeinterpreter: data.codeinterpreter,
                apikey: encryptedApikey2,
            }))
            setWaitSaveCreateAssistant(true)
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        );
    });

    useEffect(() => {
        if (waitSaveInsFile) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveInsFile(false);
                dispatch(addFile({
                    files: cosFile,
                    apikey: encryptedApikey,
                }))
                setWaitSaveCreateAssistantFile(true);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveInsFile(false);
            }
        }
    }, [executeResult, waitSaveInsFile]);

    useEffect(() => {
        if (waitSaveCreateAssistantFile) {
            if (!executeAssistant.loading && !executeAssistant.error) {
                setWaitSaveCreateAssistantFile(false);
                const file_ids = executeAssistant.data.map((item: Dictionary) => item.response.id);
                setFileIdsAux(file_ids)
                dispatch(assignFile({
                    assistant_id: assistantaiid,
                    file_ids: file_ids,
                    apikey: encryptedApikey,
                }))
                setWaitSaveCreateAssistantAssignFile(true)
            } else if (executeAssistant.error) {
                const errormessage = t(executeAssistant.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateAssistantFile(false);
            }
        }
    }, [executeAssistant, waitSaveCreateAssistantFile]);

    useEffect(() => {
        if (waitSaveCreateAssistantAssignFile) {
            if (!executeAssistant.loading && !executeAssistant.error) {
                setWaitSaveCreateAssistantAssignFile(false);
                cosFile.map(async (file, index) => {
                    dispatch(execute(insAssistantAiDoc({
                        assistantaiid: executeResult.data[0].p_assistantaiid,
                        id: 0,
                        description: file.file_name,
                        url: file.file_url,
                        fileid: fileIdsAux[index],
                        type: 'FILE',
                        status: 'ACTIVO',
                        operation: 'INSERT',
                    })))
                })
                setWaitSave(true);
            } else if (executeAssistant.error) {
                const errormessage = t(executeAssistant.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateAssistantAssignFile(false);
            }
        }
    }, [executeAssistant, waitSaveCreateAssistantAssignFile]);

	const handleChangeTab = (event: ChangeEvent<NonNullable<unknown>>, newIndex: number) => {
        if(!isDisabled()) {
            setTabIndex(newIndex);
        }
    };
   
    const onMainSubmitMeta = handleSubmit(async (data) => {
        let generalprompt;

        generalprompt = data.prompt + '\n\n';
        if (data.negativeprompt !== '') {
            generalprompt += 'Considera inapropiado y evita mencionar los siguientes temas:\n' + data.negativeprompt + '\n\n';
        }
        if (data.language !== '') {
            if(data.language.includes(',')){
                const formattedLanguages = data.language.split(',').join(', ');
                generalprompt += 'Empleas los siguientes idiomas para responder: <<' + formattedLanguages + '>>. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + formattedLanguages + '" no añadas mas texto o información a tu respuesta.';
            } else {
                if(data.language !== 'Todos') {
                    generalprompt += 'Empleas el <<' + data.language + '>> para responder. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + data.language + '" no añadas mas texto o información a tu respuesta.';
                }
            }
        }

        if (data.querywithoutanswer === 'Mejor Sugerencia') {
            generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda una sugerencia divertida, alegre o interesante relacionada con tu base de conocimiento actual.';
        } else if (data.querywithoutanswer === 'Respuesta Sugerida') {
            generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, sugiere al usuario que siga lo siguiente: ' + data.response;
        }

        setGeneralPrompt(generalprompt)

        const callback = async () => {
            dispatch(showBackdrop(true));
            if(provider === "LaraigoLLM") {
                dispatch(createCollection3({
                    collection: data.name,
                }))
            } else {
                dispatch(createCollection({
                    collection: data.name,
                }))
            }
            setWaitSaveCreateMeta(true)
        };
        const callbackEdit = async () => {
            dispatch(showBackdrop(true));
            if(provider === "LaraigoLLM") {
                dispatch(editCollection3({
                    name: row?.name,
                    new_name: data.name
                }))
            } else {
                dispatch(editCollection({
                    name: row?.name,
                    new_name: data.name
                }))
            }
            setWaitSaveCreateMeta(true)
        };

        if(!edit) {
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback,
                })
            );
        } else {
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_save),
                    callback: callbackEdit,
                })
            );
        }
    });

    const onMainSubmitMetaWithFiles = handleSubmit(async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            let generalprompt;

            generalprompt = data.prompt + '\n\n';
            if (data.negativeprompt !== '') {
                generalprompt += 'Considera inapropiado y evita mencionar los siguientes temas:\n' + data.negativeprompt + '\n\n';
            }
            if (data.language !== '') {
                if(data.language.includes(',')){
                    const formattedLanguages = data.language.split(',').join(', ');
                    generalprompt += 'Empleas los siguientes idiomas para responder: <<' + formattedLanguages + '>>. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + formattedLanguages + '" no añadas mas texto o información a tu respuesta.';
                } else {
                    if(data.language !== 'Todos') {
                        generalprompt += 'Empleas el <<' + data.language + '>> para responder. Si te escriben en cualquier otro idioma, responde de la siguiente manera: "Perdón ☹, solamente puedo comunicarme en ' + data.language + '" no añadas mas texto o información a tu respuesta.';
                    }
                }
            }

            if (data.querywithoutanswer === 'Mejor Sugerencia') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, brinda una sugerencia divertida, alegre o interesante relacionada con tu base de conocimiento actual.';
            } else if (data.querywithoutanswer === 'Respuesta Sugerida') {
                generalprompt += '\n\nPara consultas o preguntas que no puedas responder o no tengas la base de conocimiento necesaria, sugiere al usuario que siga lo siguiente: ' + data.response;
            }
            setGeneralPrompt(generalprompt)

            if(provider === "LaraigoLLM") {
                dispatch(createCollectionDocuments3({
                    urls: cosFile.map((item: Dictionary) => item.file_url),
                    collection: data.name
                }))
                setWaitSaveCreateCollection(true)
            } else {
                dispatch(createCollectionDocuments({
                    urls: cosFile.map((item: Dictionary) => item.file_url),
                    collection: data.name
                }))
                setWaitSaveCreateCollection(true)
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

    useEffect(() => {
        if (waitSaveCreateMeta) {
            if(provider === "LaraigoLLM"){
                if (!llm3Result.loading && !llm3Result.error) {
                    setWaitSaveCreateMeta(false);
                    dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: 'llamatest' })));
                    setWaitSave(true);
                } else if (llm3Result.error) {
                    const errormessage = t(llm3Result.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveCreateMeta(false);
                }
            } else {
                if (!metaResult.loading && !metaResult.error) {
                    setWaitSaveCreateMeta(false);
                    dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: 'llamatest' })));
                    setWaitSave(true);
                } else if (metaResult.error) {
                    const errormessage = t(metaResult.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveCreateMeta(false);
                }
            }
        }
    }, [metaResult, llm3Result, waitSaveCreateMeta]);

    useEffect(() => {
        if (waitSaveCreateCollection) {
            if(provider === "LaraigoLLM") {
                if (!llm3Result.loading && !llm3Result.error) {
                    setWaitSaveCreateCollection(false);
                    dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: 'llamatest' })));
                    setWaitSaveCreateCollectionDoc(true);
                } else if (llm3Result.error) {
                    const errormessage = t(llm3Result.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveCreateCollection(false);
                }
            } else {
                if (!metaResult.loading && !metaResult.error) {
                    setWaitSaveCreateCollection(false);
                    dispatch(execute(insAssistantAi({ ...getValues(), generalprompt: generalprompt, code: 'llamatest' })));
                    setWaitSaveCreateCollectionDoc(true);
                } else if (metaResult.error) {
                    const errormessage = t(metaResult.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveCreateCollection(false);
                }
            }
        }
    }, [metaResult, llm3Result, waitSaveCreateCollection]);

    useEffect(() => {
        if (waitSaveCreateCollectionDoc) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveCreateCollectionDoc(false);
                cosFile.map(async (file) => {
                    dispatch(execute(insAssistantAiDoc({
                        assistantaiid: executeResult.data[0].p_assistantaiid,
                        id: 0,
                        description: file.file_name,
                        url: file.file_url,
                        fileid: 'llamatest',
                        type: 'FILE',
                        status: 'ACTIVO',
                        operation: 'INSERT',
                    })))
                })
                setWaitSave(true);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateCollectionDoc(false);
            }
        }
    }, [executeResult, waitSaveCreateCollectionDoc]);

    const mainHandleSubmit = (e: ChangeEvent<NonNullable<unknown>>) => {
        e.preventDefault();
        if (tabIndex === 0) {
            handleChangeTab(e, 1);
        } else if (tabIndex === 1) {
            handleChangeTab(e, 2);
        } else {
            if(provider === 'Open AI') {
                if (cosFile.length < 1) {
                    onMainSubmit();
                } else {
                    onMainSubmitWithFiles();
                }
            } else {
                if (cosFile.length < 1) {
                    onMainSubmitMeta();
                } else {
                    onMainSubmitMetaWithFiles();
                }
            }
        }
    }

    const handleClose = () => {
        const callback = () => {
            setViewSelected('assistantdetail')
        }
        dispatch(
            manageConfirmation({
                visible: true,
                question: edit ? t(langKeys.cancelassistantedit) : t(langKeys.cancelassistantcreation),
                callback,
            })
        );
    }

    const isDisabled = () => {
        if (tabIndex === 0) {
            return (firstData.name === '' || firstData.description === '' || firstData.intelligentmodelsid === 0 || firstData.basemodel === '');
        } else if (tabIndex === 1) {
            return validatePrompt === '';
        } else {
            return false;
        }
    };

    return (
        <>
            <form
                onSubmit={mainHandleSubmit}
                className={classes.formcontainer}
            >
                <div style={{ width: "100%" }}>
                    <div className={classes.titleandcrumbs}>
                        <div style={{ flexGrow: 1 }}>
                            <TemplateBreadcrumbs
                                breadcrumbs={newArrayBread}
                                handleClick={setExternalViewSelected}
                            />
                            <TitleDetail title={edit ? row?.name : t(langKeys.createssistant)} />
                        </div>
                    </div>
                    <div className={classes.container}>     
                        <div id="assistant">
                            <div className={classes.buttonscontainer}>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={handleClose}
                                >
                                    {t(langKeys.cancel)}
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    disabled={isDisabled()}
                                    startIcon={tabIndex !== 2 ? <></> : <SaveIcon color="secondary" />}
                                    endIcon={tabIndex !== 2 ? <ArrowForwardIcon color="secondary" /> : <></>}
                                    style={{ backgroundColor: '#55BD84' }}
                                >
                                    {tabIndex !== 2 ? t(langKeys.next) : t(langKeys.save)}
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
                    <AssistantTabDetail data={{row,edit}} setValue={setValue} getValues={getValues} errors={errors} setProvider={setProvider} firstData={firstData} setFirstData={setFirstData} setSelectedProvider={setSelectedProvider} />
                </AntTabPanelAux>
                <AntTabPanelAux index={1} currentIndex={tabIndex}>
                    <ParametersTabDetail data={{row,edit}} setValue={setValue} getValues={getValues} errors={errors} setValidatePrompt={setValidatePrompt} trigger={trigger} provider={selectedProvider} />
                </AntTabPanelAux>
                <AntTabPanelAux index={2} currentIndex={tabIndex}>
                    <TrainingTabDetail row={row} fetchData={fetchDocumentsByAssistant} fetchAssistants={fetchData} edit={edit} setFile={setCosFile} set_chunk_size={(value) => setValue('chunk_size', value)} set_chunk_overlap={(value) => setValue('chunk_overlap', value)} chunk_size={getValues('chunk_size')} chunk_overlap={getValues('chunk_overlap')} provider={selectedProvider} />
                </AntTabPanelAux>
            </form>
        </>
    )
}

export default CreateAssistant;