import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { execute, getCollectionAux, getCollectionAux2 } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Avatar from '@material-ui/core/Avatar';
import { Dictionary } from "@types";
import { insMessageAi, insThread, messageAiSel, threadSel } from "common/helpers";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { useForm } from "react-hook-form";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { FieldEdit } from "components";
import CachedIcon from '@material-ui/icons/Cached';
import { LaraigoChatProfileIcon, SendMesageIcon } from "icons";
import { createThread, deleteThread, sendMessages } from "store/gpt/actions";
import { deleteThreadLlama, query } from "store/llama/actions";
import { deleteThreadLlama3, query3 } from "store/llama3/actions";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',     
        width: '100%',
    },  
    chatList: {
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
        width: 320,
        height: '100%'
    },
    chatMain: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: theme.spacing(2),      
    },     
    chatMessages: {
        flex: 1,
        height: '81vh', 
        overflowY: 'auto',
    },
    chatInputContainer: {
        bottom: 0,
        height: 'fit-content',
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    },
    buttonscontainer: {
        display: 'flex',
        marginBottom: '2rem',
        justifyContent: 'space-between',
    },
    purpleButton: {
        width: 131,
        backgroundColor: '#7721AD',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#4C226E',
        },
    },
    sendicon: {
        backgroundColor: 'none',
    },
    threadContainer: {
        cursor: 'pointer',
        marginBottom: '15px',
    },
    threadNameContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    threadNameInput: {
        display:'flex',
        flexDirection:'row'
    },
    threadName: {
        display:'flex',
        flexDirection:'row',
        alignItems: 'center',
    },
    chatIcon: {
        color: '#757377',
        paddingLeft: 2,
        marginRight: '0.5rem',
        width: 24,
    },
    messageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    messageContainer2: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 700
    },
    messageDate: {
        alignSelf: 'center',
        marginBottom: '10px'
    },
    messageText: {
        display: 'flex',
        flexDirection: 'row'
    },
    messageAvatar: {
        marginRight: 10,
        alignSelf: 'flex-start',        
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'pre-line'
    },
    initialText: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
    },
    backButton: {
        width: 131,
        backgroundColor: '#ffff',
        color: '#7721AD',
    },
}));

interface ChatAIProps {
    setViewSelected: (view: string) => void;
    row: Dictionary | null;
}

const ChatAI: React.FC<ChatAIProps> = ({ setViewSelected , row}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveCreateThread, setWaitSaveCreateThread] = useState(false);
    const [waitSaveThread, setWaitSaveThread] = useState(false);
    const [waitSaveThreadDelete, setWaitSaveThreadDelete] = useState(false);
    const [waitSaveMessage, setWaitSaveMessage] = useState(false);
    const [waitSaveMessage1, setWaitSaveMessage1] = useState(false);
    const [waitSaveMessage2, setWaitSaveMessage2] = useState(false);
    const [waitSaveMessage3, setWaitSaveMessage3] = useState(false);
    const [waitSaveMessageLlama, setWaitSaveMessageLlama] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const executeThreads = useSelector((state) => state.gpt.gptResult);
    const llamaResult = useSelector((state) => state.llama.llamaResult);
    const llm3Result = useSelector(state => state.llama3.llama3Result);
    const [selectedChatForEdit, setSelectedChatForEdit] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<Dictionary | null>(null);
    const dataThreads = useSelector(state => state.main.mainAux);
    const messages = useSelector(state => state.main.mainAux2);
    const [messageText, setMessageText] = useState('');
    const [messageAux, setMessageAux] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cardDelete, setCardDelete] = useState<Dictionary | null>(null);
    const [waitSaveMessageAux, setWaitSaveMessageLlamaAux] = useState(false);
    const [waitSaveThreadDeleteLlama, setWaitSaveThreadDeleteLlama] = useState(false)
    const [date, setDate] = useState('');
    const endOfMessagesRef = useRef(null);
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const textFieldRef = useRef(null);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [conector, setConector] = useState(row ? multiDataAux?.data?.[3]?.data?.find(item => item.id === row?.intelligentmodelsid) : {});

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchThreadsByAssistant = () => dispatch(getCollectionAux(threadSel({assistantaiid: row?.assistantaiid, id: 0, all: true})));
    const fetchThreadMessages = (threadid: number) => dispatch(getCollectionAux2(messageAiSel({assistantaiid: row?.assistantaiid, threadid: threadid})));

    useEffect(() => {
        fetchThreadsByAssistant();
    }, []);

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            assistantaiid: row?.assistantaiid,
            id: 0,
            code: '',
            description: '',
            type: 'THREAD',
            status: 'ACTIVO',
            operation: 'INSERT',
        }
    });

    React.useEffect(() => {
        register('assistantaiid');
        register('id');
        register('code');
        register('description');
        register('type');
        register('status');
        register('operation');
    }, [register, setValue]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_update),
                    })
                );
                fetchThreadsByAssistant()
                dispatch(showBackdrop(false));
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

    useEffect(() => {
        if (waitSaveCreateThread) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveCreateThread(false)
                fetchThreadsByAssistant()
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveCreateThread(false);
            }
        }
    }, [executeResult, waitSaveCreateThread]);

    useEffect(() => {
        if (waitSaveThread) {
            if (!executeThreads.loading && !executeThreads.error) {
                setWaitSaveThread(false);
                const data = getValues()
                dispatch(execute(insThread({...data, code: executeThreads.data.id, description: date})));
                setDate('')
                setWaitSaveCreateThread(true);
            } else if (executeThreads.error) {
                const errormessage = t(executeThreads.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveThread(false);
            }
        }
    }, [executeThreads, waitSaveThread]);

    useEffect(() => {
        if (waitSaveThreadDelete) {
            if (!executeThreads.loading && !executeThreads.error) {
                setWaitSaveThreadDelete(false);
                dispatch(execute(insThread({ ...cardDelete, id: cardDelete?.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" })));
                setWaitSaveCreateThread(true);
                setCardDelete(null);
            } else if (executeThreads.error) {
                const errormessage = t(executeThreads.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveThreadDelete(false);
            }
        }
    }, [executeThreads, waitSaveThreadDelete]);

    useEffect(() => {
        if (waitSaveThreadDeleteLlama) {
            if(row?.basemodel.startsWith('llama')) {
                if (!llm3Result.loading && !llm3Result.error) {
                    setWaitSaveThreadDeleteLlama(false);
                    dispatch(execute(insThread({ ...cardDelete, id: cardDelete?.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" })));
                    setWaitSaveCreateThread(true);
                    setCardDelete(null);
                } else if (llm3Result.error) {
                    setWaitSaveThreadDeleteLlama(false);
                    dispatch(execute(insThread({ ...cardDelete, id: cardDelete?.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" })));
                    setWaitSaveCreateThread(true);
                    setCardDelete(null);
                }
            } else {
                if (!llamaResult.loading && !llamaResult.error) {
                    setWaitSaveThreadDeleteLlama(false);
                    dispatch(execute(insThread({ ...cardDelete, id: cardDelete?.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" })));
                    setWaitSaveCreateThread(true);
                    setCardDelete(null);
                } else if (llamaResult.error) {
                    setWaitSaveThreadDeleteLlama(false);
                    dispatch(execute(insThread({ ...cardDelete, id: cardDelete?.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" })));
                    setWaitSaveCreateThread(true);
                    setCardDelete(null);
                }
            }
        }
    }, [llamaResult, llm3Result, waitSaveThreadDeleteLlama]);

    useEffect(() => {
        if (waitSaveMessageLlama) {
            if(row?.basemodel.startsWith('llama')) {
                if (!llm3Result.loading && !llm3Result.error) {
                    setWaitSaveMessageLlama(false);
                    if (llm3Result.data && llm3Result.data.result) {
                        dispatch(execute(insMessageAi({
                            assistantaiid: row?.assistantaiid,
                            threadid: activeThreadId,
                            assistantaidocumentid: 0,
                            id: 0,
                            messagetext: llm3Result.data.result,
                            infosource: '',
                            type: 'BOT',
                            status: 'ACTIVO',
                            operation: 'INSERT',
                        })));
                        setWaitSaveMessageLlamaAux(true);
                    } else {
                        dispatch(showSnackbar({ show: true, severity: "error", message: "LLaMA result data is invalid." }));
                        setIsLoading(false);
                    }
                } else if (llm3Result.error) {
                    const errormessage = t(llm3Result.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    setIsLoading(false);
                    setWaitSaveMessageLlama(false);
                }
            } else {
                if (!llamaResult.loading && !llamaResult.error) {
                    setWaitSaveMessageLlama(false);
                    if (llamaResult.data && llamaResult.data.result) {
                        dispatch(execute(insMessageAi({
                            assistantaiid: row?.assistantaiid,
                            threadid: activeThreadId,
                            assistantaidocumentid: 0,
                            id: 0,
                            messagetext: llamaResult.data.result,
                            infosource: '',
                            type: 'BOT',
                            status: 'ACTIVO',
                            operation: 'INSERT',
                        })));
                        setWaitSaveMessageLlamaAux(true);
                    } else {
                        dispatch(showSnackbar({ show: true, severity: "error", message: "LLaMA result data is invalid." }));
                        setIsLoading(false);
                    }
                } else if (llamaResult.error) {
                    const errormessage = t(llamaResult.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    setIsLoading(false);
                    setWaitSaveMessageLlama(false);
                }
            }
        }
    }, [llamaResult, llm3Result, waitSaveMessageLlama]);
    

    useEffect(() => {
        if (waitSaveMessageAux) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveMessageLlamaAux(false);
                setIsLoading(false);
                fetchThreadMessages(selectedChat?.threadid);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSaveMessageLlamaAux(false);
            }
        }
    }, [executeResult, waitSaveMessageAux]);

    useEffect(() => {
        handleChatClick(dataThreads.data[0]);
    }, [dataThreads.data]);

    const handleCreateChat = () => {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
        const day = ('0' + fecha.getDate()).slice(-2);
        const hours = ('0' + fecha.getHours()).slice(-2);
        const minutes = ('0' + fecha.getMinutes()).slice(-2);
        const seconds = ('0' + fecha.getSeconds()).slice(-2);
        const dateAux = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

        if(row?.basemodel.startsWith('gpt')) {
            dispatch(showBackdrop(true));
            setDate(dateAux)
            dispatch(createThread({
                apikey: row?.apikey,
            }))
            setWaitSaveThread(true);
        } else {
            dispatch(showBackdrop(true));
            dispatch(execute(insThread({...getValues(), code: '', description: dateAux})));
            setWaitSaveCreateThread(true);
        }
    };

    const handleSendMessage = async () => {
        setIsLoading(true);
        const currentThreadId = selectedChat?.threadid;
        dispatch(
            execute(
                insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: currentThreadId,
                    assistantaidocumentid: 0,
                    id: 0,
                    messagetext: messageText,
                    infosource: '',
                    type: 'USER',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })
            )
        );
        setMessageAux(messageText);
        setMessageText('');
        setWaitSaveMessage1(true);    
        setActiveThreadId(currentThreadId);
    };
    

    useEffect(() => {
        if (waitSaveMessage1) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveMessage1(false);
                fetchThreadMessages(selectedChat?.threadid);
                setWaitSaveMessage2(true)
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSaveMessage1(false);
            }
        }
    }, [executeResult, waitSaveMessage1]);

    useEffect(() => {
        if (waitSaveMessage2) {
            if (!messages.loading && !messages.error) {
                setWaitSaveMessage2(false);
                dispatch(sendMessages({
                    text: messageAux,
                    assistant_id: row?.code,
                    thread_id: selectedChat?.code,
                    sources: false,
                    apikey: row?.apikey,
                }))
                setMessageAux('')
                setWaitSaveMessage(true)
            } else if (messages.error) {
                const errormessage = t(messages.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSaveMessage2(false);
            }
        }
    }, [messages, waitSaveMessage2]);

    useEffect(() => {
        if (waitSaveMessage) {
            if (!executeThreads.loading && !executeThreads.error) {
                setWaitSaveMessage(false);
                dispatch(execute(insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: activeThreadId,
                    assistantaidocumentid: 0,
                    id: 0,
                    messagetext: executeThreads.data.response,
                    infosource: '',
                    type: 'BOT',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })))
                setWaitSaveMessage3(true)
            } else if (executeThreads.error) {
                const errormessage = t(executeThreads.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSaveMessage(false);
            }
        }
    }, [executeThreads, waitSaveMessage]);

    useEffect(() => {
        if (waitSaveMessage3) {
            if (!executeResult.loading && !executeResult.error) {
                setWaitSaveMessage3(false);
                fetchThreadMessages(selectedChat?.threadid);
                setIsLoading(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                setWaitSaveMessage3(false);
            }
        }
    }, [executeResult, waitSaveMessage3]);

    const handleSendMessageLLM3 = async () => {
        setIsLoading(true);
        const currentThreadLlamaId = selectedChat?.threadid;
        dispatch(
            execute(
                insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: currentThreadLlamaId,
                    assistantaidocumentid: 0,
                    id: 0,
                    messagetext: messageText,
                    infosource: '',
                    type: 'USER',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })
            )
        );
        const message = messageText
        setMessageText('');
        fetchThreadMessages(selectedChat?.threadid);
        dispatch(query3({
            assistant_name: row?.name,
            query: message,
            system_prompt: row?.generalprompt,
            model: row?.basemodel,
            thread_id: selectedChat?.code,
            max_new_tokens: row?.max_tokens,
            temperature: parseFloat(row?.temperature),
            top_p: parseFloat(row?.top_p),
            top_k: parseFloat(row?.top_k),
            repetition_penalty: parseFloat(row?.repetition_penalty),
        }))
        setWaitSaveMessageLlama(true)
        setActiveThreadId(currentThreadLlamaId);
    }

    const handleSendMessageLlama = async () => {
        setIsLoading(true);
        const currentThreadLlamaId = selectedChat?.threadid;
        dispatch(
            execute(
                insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: currentThreadLlamaId,
                    assistantaidocumentid: 0,
                    id: 0,
                    messagetext: messageText,
                    infosource: '',
                    type: 'USER',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })
            )
        );
        const message = messageText
        setMessageText('');
        fetchThreadMessages(selectedChat?.threadid);
        dispatch(query({
            assistant_name: row?.name,
            query: message,
            system_prompt: row?.generalprompt,
            model: row?.basemodel,
            thread_id: selectedChat?.code,
            max_new_tokens: row?.max_tokens,
            temperature: parseFloat(row?.temperature),
            top_p: parseFloat(row?.top_p),
            decoding_method: row?.decoding_method ? row.decoding_method : "sample",
            repetition_penalty: parseFloat(row?.repetition_penalty),
            top_k: parseFloat(row?.top_k),
            ...(conector?.modelid !== '' && { project_id: conector?.modelid }),
        }))
        setWaitSaveMessageLlama(true)
        setActiveThreadId(currentThreadLlamaId);
    };

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if(row?.basemodel.startsWith('gpt')) handleSendMessage();
                else if(row?.basemodel.startsWith('llama')) handleSendMessageLLM3();
                else handleSendMessageLlama();
            }
        };
        
        if(selectedChat && messageText.trim() !== '' && !isLoading) {
            document.addEventListener('keyup', handleKeyUp);
        }
        
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleSendMessage, handleSendMessageLlama, handleSendMessageLLM3]);

    const handleDeleteChat = (chat: Dictionary) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            dispatch(deleteThread({
                thread_id: chat.code,
                apikey: row?.apikey,
            }))
            setCardDelete(chat)
            setWaitSaveThreadDelete(true);
        };
        const callbackMeta = async () => {
            dispatch(showBackdrop(true));
            dispatch(deleteThreadLlama({
                threadid: selectedChat?.threadid
            }))
            setCardDelete(chat)
            setWaitSaveThreadDeleteLlama(true);
        };
        const callbackLlm3 = async () => {
            dispatch(showBackdrop(true));
            dispatch(deleteThreadLlama3({
                threadid: selectedChat?.threadid
            }))
            setCardDelete(chat)
            setWaitSaveThreadDeleteLlama(true);
        };
      
        dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete),
              callback: row?.basemodel.startsWith('gpt') ? callback : row?.basemodel.startsWith('llama') ? callbackLlm3 : callbackMeta,
            })
        );
    };

    const handleEditChat = (chat: Dictionary) => {
        setSelectedChatForEdit(chat.threadid);
        setValue('assistantaiid', chat.assistantaiid)
        setValue('id', chat.threadid)
        setValue('description', chat.description === '' ? chat.createdate.split('.')[0] : chat.description)
        setValue('code', chat.code)
        setValue('type', chat.type)
    };

    const handleCloseEdit = () => {
        setSelectedChatForEdit(null);
        setValue('description', '')
        setValue('assistantaiid', row?.assistantaiid)
        setValue('id', 0)
        setValue('code', '')
        setValue('type', 'THREAD')
    };

    const handleSaveEdit = handleSubmit((data) => {
        dispatch(showBackdrop(true));
        dispatch(execute(insThread({...data, operation: 'UPDATE'})));
        setWaitSaveCreateThread(true);
        handleCloseEdit()
    });

    const handleChatClick = (chat: Dictionary) => {
        setSelectedChat(chat);
        fetchThreadMessages(chat?.threadid)
    };

    const handleSendMessageGeneral = () => {
        if (row?.basemodel.startsWith('gpt')) handleSendMessage();
        else if (row?.basemodel.startsWith('llama')) handleSendMessageLLM3();
        else handleSendMessageLlama();
    
        if (textFieldRef.current) {
          textFieldRef.current.focus();
        }
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.chatList}>
                <div style={{flex: '0 0 auto', height: 90}}>
                    <div style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>{row?.name}</div>
                    <div className={classes.buttonscontainer}>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<ArrowBackIcon color="primary" />}
                            className={classes.backButton}
                            onClick={() => setViewSelected('assistantdetail')}
                        >
                            {t(langKeys.return)}
                        </Button>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<AddIcon color="secondary" />}
                            className={classes.purpleButton}
                            onClick={() => handleCreateChat()} 
                        >
                            {t(langKeys.newchat)}
                        </Button>
                    </div>
                </div>
                <div style={{overflowY: 'auto', flex: 1, width: 'fit-content'}}>
                    {dataThreads.data.filter(chat => chat.type === 'THREAD').map((chat) => (
                        <div key={chat.threadid} onClick={() => handleChatClick(chat)} className={classes.threadContainer}>
                            <div className={classes.threadNameContainer}>
                                {selectedChatForEdit === chat.threadid ? (
                                    <>
                                        <div className={classes.threadNameInput}>
                                            <FieldEdit
                                                valueDefault={getValues('description')}
                                                onChange={(value) => setValue('description', value)}
                                                error={errors?.description?.message}
                                            />
                                        </div>
                                        <div style={{marginLeft:'10px'}}>
                                            <IconButton onClick={() => handleCloseEdit()}>
                                                <ClearIcon style={{ color: '#757377'}}/>
                                            </IconButton>
                                            <IconButton onClick={() => handleSaveEdit()}>
                                                <CheckIcon style={{ color: '#757377' }}/>
                                            </IconButton>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className={classes.threadName} style={{ backgroundColor: chat.threadid === selectedChat?.threadid ? '#EEEEEE': ''}}>
                                            <ChatBubbleIcon className={classes.chatIcon}/>
                                            <Typography style={{ fontSize: '1rem', width: 182 }}>{chat.description}</Typography>
                                            <IconButton onClick={() => handleEditChat(chat)} style={{paddingRight: 0, width: 36}}>
                                                <EditIcon style={{ color: '#757377' }}/>
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteChat(chat)} style={{paddingRight: 0, width: 36}}>
                                                <DeleteIcon style={{ color: '#757377' }}/>
                                            </IconButton>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Paper>
            <div className={classes.chatMain}>
                <div className={classes.chatMessages}>
                    {selectedChat && (
                        <>
                            {messages.data && messages.data.length > 0 ? (
                                <>
                                    {messages.data.map((message, index) => (
                                        <div key={message.messageaiid} className={classes.messageContainer} style={{ backgroundColor: message.type !== 'USER' ? '' : 'white' }}>
                                            <div className={classes.messageContainer2}>
                                                <div className={classes.messageDate}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {message.createdate.split('.')[0]}
                                                    </Typography>
                                                </div>
                                                <div className={classes.messageText}>
                                                    <div className={classes.messageAvatar}>
                                                       {message.type==='USER'?( <Avatar
                                                            src={user?.image + "" || undefined}
                                                            alt="User Avatar"
                                                        />):(<LaraigoChatProfileIcon/>)}
                                                    </div>
                                                    <div className={classes.textContainer}>
                                                        <Typography variant="body1">
                                                            {message.messagetext.trimStart()}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                            {index === messages.data.length - 1 && (
                                                <div ref={endOfMessagesRef}></div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className={classes.initialText}>
                                    <LaraigoChatProfileIcon />
                                    <Typography variant="body1" style={{fontWeight: 'bold', fontSize: 22, color: '#2E2E2E'}}>
                                        {t(langKeys.howCanIHelpYouToday)}
                                    </Typography>
                                </div>
                            )}
                        </>
                    )}
                   {isLoading && activeThreadId === selectedChat?.threadid && (
                        <div className={classes.loadingIndicator}>
                            <CachedIcon color="primary" style={{marginRight: 8}}/>
                            <span>Cargando respuesta...</span>
                        </div>
                    )}

                </div>
                <div className={classes.chatInputContainer}>
                    <div style={{ width: '700px' }}>
                        <FieldEdit
                            label={t(langKeys.typeamessage)}
                            variant="outlined"
                            onChange={(value) => setMessageText(value)}
                            valueDefault={messageText}
                            disabled={!selectedChat}
                            InputProps={{
                                multiline: true,
                                maxRows: 7,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton                                           
                                            className={classes.sendicon}
                                            onClick={handleSendMessageGeneral}
                                            disabled={!selectedChat || messageText.trim() === '' || isLoading}
                                        >
                                          <SendMesageIcon color="secondary" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            inputRef={textFieldRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatAI;