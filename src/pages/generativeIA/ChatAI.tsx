import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { execute, getCollectionAux, getCollectionAux2 } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, TextField, Typography } from "@material-ui/core";
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
        width: '100%',
        padding: theme.spacing(2),
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
}));

interface ChatAIProps {
    setViewSelected: (view: string) => void;
    row: Dictionary | null;
}

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
}

interface Chat {
    id: number;
    title: string;
    date: string;
    messages: ChatMessage[];
}

const ChatAI: React.FC<ChatAIProps> = ({ setViewSelected , row}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector((state) => state.main.execute);
    const [selectedChatForEdit, setSelectedChatForEdit] = useState<number | null>(null);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const dataThreads = useSelector(state => state.main.mainAux);
    const messages = useSelector(state => state.main.mainAux2);
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const [messageText, setMessageText] = useState('');

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
                        message: t(langKeys.successful_delete),
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

    const handleConfirmCreateChat = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insThread(data)));
            setWaitSave(true);
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

    const handleSendMessage = () => {
        dispatch(execute(insMessageAi({
            assistantaiid: row?.assistantaiid,
            threadid: selectedChat,
            assistantaidocumentid: 0,
            id: 0,
            messagetext : messageText,
            infosource: '',
            type: 'USER',
            status: 'ACTIVO',
            operation: 'INSERT'
        })));
        setMessageText('')
        fetchThreadMessages(selectedChat)
    };

    const handleDeleteChat = (chat: Dictionary) => {
        const callback = () => {
            dispatch(
              execute(insThread({ ...chat, id: chat.threadid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" }))
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
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

    const handleChatClick = (chatId: number) => {
        setSelectedChat(chatId);
        fetchThreadMessages(chatId)
    };

    const handleChange = (e:any) => {
        setMessageText(e.target.value)
    }

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
                        style={{ backgroundColor: '#7721AD', color: '#fff' }}
                        onClick={() => handleCreateChat()} 
                    >
                        {t(langKeys.newchat)}
                    </Button>
                </div>
                {isCreatingChat && (
                    <div style={{backgroundColor: '#F4EDF8', padding: '10px 10px 0', marginBottom: '10px', border: '1px solid #7721AD'}}>
                        <FieldEdit
                            label={t(langKeys.name)}
                            variant="outlined"
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', value)}
                            error={errors?.description?.message}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={handleCancelCreateChat}>
                                <ClearIcon style={{color: '#7721AD'}}/>
                            </IconButton>
                            <IconButton onClick={handleConfirmCreateChat}>
                                <CheckIcon style={{color: '#7721AD'}}/>
                            </IconButton>
                        </div>
                    </div>
                )}
                {dataThreads.data.map((chat, index) => (
                    <div key={chat.threadid} onClick={() => handleChatClick(chat.threadid)} style={{ cursor: 'pointer', marginBottom: '15px' }}>
                        <Typography>
                            {chat.createdate.split('.')[0]}
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {selectedChatForEdit === chat.threadid ? (
                                <>
                                    <div style={{display:'flex', flexDirection:'row'}}>
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
                                    <div style={{display:'flex', flexDirection:'row'}}>
                                        <ChatBubbleIcon style={{ color: '#757377', marginRight: '0.5rem' }} />
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
                                        <div key={message.messageaiid} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: message.type !== 'USER' ? '' : 'white' }}>
                                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: 700}}>
                                                <div style={{alignSelf: 'center', marginBottom: '10px'}}>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {message.createdate.split('.')[0]}
                                                    </Typography>
                                                </div>
                                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                                    <div style={{ marginRight: 10, alignSelf: 'flex-start' }}>
                                                        <Avatar
                                                            src={message.type === 'USER' ? 'https://cdn-icons-png.flaticon.com/512/2919/2919600.png' : 'https://play-lh.googleusercontent.com/YZxZDkJuvqZByRtcFe6PNjfOdl9oUgEXIqpQ_0WlEonqw93AT-3CvVcT76-iU82a-Q=w240-h480-rw'}
                                                            alt="User Avatar"
                                                        />
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography variant="body1">
                                        {t(langKeys.howCanIHelpYouToday)}
                                    </Typography>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={classes.chatInputContainer}>
                    <FieldEdit
                        label= {t(langKeys.typeamessage)}
                        variant="outlined"
                        onChange={(value) => setMessageText(value)}
                        valueDefault={messageText}
                        disabled={!selectedChat}
                        InputProps={{
                            multiline: true,
                            maxRows: 2,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<SendIcon color="secondary" />}
                                        disabled={!selectedChat}
                                        style={{ backgroundColor: '#7721AD', color: '#fff' }}
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
    );
};

export default ChatAI;
