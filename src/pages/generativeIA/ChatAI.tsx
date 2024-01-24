import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { execute, getCollectionAux, getCollectionAux2 } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
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

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',     
        width: '100%',
    },  
    chatList: {
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),       
    },
    chatMain: {
        flex: 1,           
        paddingLeft: theme.spacing(2),      
    },     
    chatMessages: {
        height: '81vh', 
        overflowY: 'auto',
    },
    chatInput: {
        display: 'flex',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    chatInputContainer: {
        bottom: 0,
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center',
    },
    buttonscontainer: {
        display: 'flex',      
        gap: '1rem',
        marginBottom: '2rem'
    },
    redbutton: {
        backgroundColor: '#ffff',
        color: 'red',
        border: '1px solid red'
    },
    purpleButton: {
        backgroundColor: '#7721AD',
        color: '#fff'
    },
    sendicon: {
        backgroundColor: 'none',

    },
    newChatContainer: {
        backgroundColor: '#F4EDF8',
        padding: '10px 10px 0',
        marginBottom: '10px',
        border: '1px solid #7721AD'
    },
    iconsContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    threadContainer: {
        cursor: 'pointer',
        marginBottom: '15px'
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
        flexDirection:'row'
    },
    chatIcon: {
        color: '#757377',
        marginRight: '0.5rem'
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
        display: 'flex',
        justifyContent: 'center'
    },
    loadingIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
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
    const executeResult = useSelector((state) => state.main.execute);
    const executeThreads = useSelector((state) => state.gpt.gptResult);
    const [selectedChatForEdit, setSelectedChatForEdit] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<Dictionary | null>(null);
    const dataThreads = useSelector(state => state.main.mainAux);
    const messages = useSelector(state => state.main.mainAux2);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [cardDelete, setCardDelete] = useState<Dictionary | null>(null);

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
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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
                dispatch(execute(insThread({...data, code: executeThreads.data.id})));
                setValue('description', '');
                setWaitSaveCreateThread(true);
                dispatch(showBackdrop(false));
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
                dispatch(showBackdrop(false));
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
        if (waitSaveMessage) {
            if (!executeThreads.loading && !executeThreads.error) {
                setWaitSaveMessage(false);
                dispatch(execute(insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: selectedChat?.threadid,
                    assistantaidocumentid: 0,
                    id: 0,
                    messagetext: executeThreads.data.response,
                    infosource: '',
                    type: 'BOT',
                    status: 'ACTIVO',
                    operation: 'INSERT',
                })))
                setIsLoading(false);
                fetchThreadMessages(selectedChat?.threadid);

                dispatch(showBackdrop(false));
            } else if (executeThreads.error) {
                const errormessage = t(executeThreads.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveMessage(false);
            }
        }
    }, [executeThreads, waitSaveMessage]);

    useEffect(() => {
        handleChatClick(dataThreads.data[0]);
    }, [dataThreads.data]);

    const handleCreateChat = () => {
        setIsCreatingChat(true);
    };

    const handleCancelCreateChat = () => {
        setIsCreatingChat(false);
        setValue('description', '');
    };

    const handleConfirmCreateChat = handleSubmit( async () => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            dispatch(createThread({
                apikey: row?.apikey,
            }))
            setWaitSaveThread(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
        setIsCreatingChat(false);
    });

    const handleSendMessage = async () => {
        setIsLoading(true);
        dispatch(
            execute(
                insMessageAi({
                    assistantaiid: row?.assistantaiid,
                    threadid: selectedChat?.threadid,
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
        dispatch(sendMessages({
            text: message,
            assistant_id: row?.code,
            thread_id: selectedChat?.code,
            sources: false,
            apikey: row?.apikey,
        }))
        setWaitSaveMessage(true)
    };

    useEffect(() => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
            }
        };
        
        document.addEventListener('keyup', handleKeyUp);
        
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleSendMessage]);

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
      
          dispatch(
            manageConfirmation({
              visible: true,
              question: t(langKeys.confirmation_delete),
              callback,
            })
        );
    };

    const handleEditChat = (chat: Dictionary) => {
        setSelectedChatForEdit(chat.threadid);
        setValue('assistantaiid', chat.assistantaiid)
        setValue('id', chat.threadid)
        setValue('description', chat.description)
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
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insThread({...data, operation: 'UPDATE'})));
            setWaitSaveCreateThread(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
        handleCloseEdit()
    });

    const handleChatClick = (chat: Dictionary) => {
        setSelectedChat(chat);
        fetchThreadMessages(chat?.threadid)
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.chatList}>
                <div style={{marginBottom: 10, fontWeight: 'bold', textAlign: 'center'}}>{row?.name}</div>
                <div className={classes.buttonscontainer}>
                    <Button
                        variant="contained"
                        type="button"
                        startIcon={<CloseIcon />}
                        className={classes.redbutton}
                        onClick={() => setViewSelected('assistantdetail')}
                    >
                        {t(langKeys.close)}
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
                {isCreatingChat && (
                    <div className={classes.newChatContainer}>
                        <FieldEdit
                            label={t(langKeys.name)}
                            variant="outlined"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                        <div className={classes.iconsContainer}>
                            <IconButton onClick={handleCancelCreateChat}>
                                <ClearIcon style={{color: '#7721AD'}}/>
                            </IconButton>
                            <IconButton onClick={handleConfirmCreateChat}>
                                <CheckIcon style={{color: '#7721AD'}}/>
                            </IconButton>
                        </div>
                    </div>
                )}
                {dataThreads.data.map((chat) => (
                    <div key={chat.threadid} onClick={() => handleChatClick(chat)} className={classes.threadContainer}>
                        <Typography>
                            {chat.createdate.split('.')[0]}
                        </Typography>
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
                                    <div className={classes.threadName}>
                                        <ChatBubbleIcon className={classes.chatIcon}/>
                                        <Typography style={{ fontSize: '1.1rem' }}>{chat.description}</Typography>
                                    </div>
                                    <div>
                                        <IconButton onClick={() => handleEditChat(chat)}>
                                            <EditIcon style={{ color: '#757377'}}/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteChat(chat)}>
                                            <DeleteIcon style={{ color: '#757377' }}/>
                                        </IconButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </Paper>

            <div className={classes.chatMain}>
                <div className={classes.chatMessages}>
                    {selectedChat && (
                        <>
                            {messages.data && messages.data.length > 0 ? (
                                <>
                                    {messages.data.map(message => (
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
                                                            {message.messagetext}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className={classes.initialText}>
                                    <Typography variant="body1">
                                        {t(langKeys.howCanIHelpYouToday)}
                                    </Typography>
                                </div>
                            )}
                        </>
                    )}
                    {isLoading && (
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
                            disabled={!selectedChat || isLoading}
                            InputProps={{
                                multiline: true,
                                maxRows: 2,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton                                           
                                            className={classes.sendicon}
                                            onClick={() => handleSendMessage()}
                                            disabled={!selectedChat || messageText.trim() === '' || isLoading}
                                        >
                                          <SendMesageIcon color="secondary" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    </div>
            </div>
        </div>
    );
};

export default ChatAI;