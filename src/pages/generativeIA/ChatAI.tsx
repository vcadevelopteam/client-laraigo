import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { execute, getCollectionAux, getCollectionAux2 } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
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
        alignSelf: 'flex-start'
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
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
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const [selectedChatForEdit, setSelectedChatForEdit] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<Dictionary | null>(null);
    const dataThreads = useSelector(state => state.main.mainAux);
    const messages = useSelector(state => state.main.mainAux2);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleCreateChat = () => {
        setIsCreatingChat(true);
    };

    const handleCancelCreateChat = () => {
        setIsCreatingChat(false);
        setValue('description', '');
    };

    const handleConfirmCreateChat = handleSubmit( async (data) => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            try {
                const insThreadAPI = await fetch ('https://documentgptapi.laraigo.com/threads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        apikey: row?.apikey,
                    })
                })
                if (!insThreadAPI.ok) {
                    console.error('Error en la llamada a la API:', insThreadAPI.statusText);
                    setWaitSave(true);
                    return;
                }
                const responseData = await insThreadAPI.json();
                const threadid = responseData.data.id;
                dispatch(execute(insThread({...data,code:threadid})));
                setWaitSave(true);
            }        
            catch (error) {
                console.error('Error en la llamada a la API:', error);
                setWaitSave(true);
            }
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
        setIsCreatingChat(false);
        setValue('description', '');
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
        
        try {
            const sendMessage = await fetch ('https://documentgptapi.laraigo.com/assistants/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: message,
                    assistant_id: row?.code,
                    thread_id: selectedChat?.code,
                    sources: true,
                    apikey: row?.apikey,
                })
            })
            if (!sendMessage.ok) {
                console.error('Error en la llamada a la API:', sendMessage.statusText);
                return;
            }
            const responseData = await sendMessage.json();
            const botResponse = responseData.data.response;
            dispatch(
                execute(
                    insMessageAi({
                        assistantaiid: row?.assistantaiid,
                        threadid: selectedChat?.threadid,
                        assistantaidocumentid: 0,
                        id: 0,
                        messagetext: botResponse,
                        infosource: '',
                        type: 'BOT',
                        status: 'ACTIVO',
                        operation: 'INSERT',
                    })
                )
            );
            fetchThreadMessages(selectedChat?.threadid);
        } catch (error) {
            console.error('Error en la llamada a la API:', error);
        } finally {
            setIsLoading(false);
        }
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

            try {
                const threadDelete = await fetch('https://documentgptapi.laraigo.com/threads/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        thread_id: chat.code,
                        apikey: row?.apikey,
                    }),
                });
    
                if (!threadDelete.ok) {
                    console.error('Error al eliminar el thread:', threadDelete.statusText);
                    setWaitSave(true);
                    return;
                }

                dispatch(
                    execute(insThread({ ...chat, id: chat.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" }))
                );
                setWaitSave(true);

            } catch (error) {
                console.error('Error en la llamada:', error);
                setWaitSave(true);
            }          
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
            setWaitSave(true);
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
        fetchThreadMessages(chat.threadid)
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.chatList}>
                <div>{row?.name}</div>
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
                                                        <Avatar
                                                            src={message.type === 'USER' ? 'https://cdn-icons-png.flaticon.com/512/2919/2919600.png' : 'https://play-lh.googleusercontent.com/YZxZDkJuvqZByRtcFe6PNjfOdl9oUgEXIqpQ_0WlEonqw93AT-3CvVcT76-iU82a-Q=w240-h480-rw'}
                                                            alt="User Avatar"
                                                        />
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
                                        <Button
                                            variant="contained"
                                            type="button"
                                            startIcon={<SendIcon color="secondary" />}
                                            disabled={!selectedChat || messageText.trim() === '' || isLoading}
                                            className={classes.purpleButton}
                                            onClick={() => handleSendMessage()}
                                        >
                                            {t(langKeys.send)}
                                        </Button>
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